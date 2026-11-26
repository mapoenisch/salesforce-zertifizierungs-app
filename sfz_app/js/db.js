// db.js — IndexedDB-Wrapper für Lernfortschritt (SM-2) und Aktivitätslog.
// Kein externes Framework, native IndexedDB-API, Promise-basiert.

import { belongsToTrainer } from "./learningScope.js";

const DB_NAME = "salesforce-trainer-db";
const DB_VERSION = 1;
const STORE_PROGRESS = "learningProgress";
const STORE_ACTIVITY = "activityLog";
const STORE_MIGRATIONS = "migrations";
const LEGACY_MIGRATION = "combined-trainer";

let dbPromise = null;

/**
 * Öffnet (und erstellt bei Bedarf) die IndexedDB-Datenbank.
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_MIGRATIONS);

      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        const progressStore = db.createObjectStore(STORE_PROGRESS, { keyPath: "contentId" });
        progressStore.createIndex("nextReviewDate", "nextReviewDate", { unique: false });
        progressStore.createIndex("certification", "certification", { unique: false });
        progressStore.createIndex("examDomainId", "examDomainId", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_ACTIVITY)) {
        const activityStore = db.createObjectStore(STORE_ACTIVITY, { keyPath: "id", autoIncrement: true });
        activityStore.createIndex("ts", "ts", { unique: false });
      }
    };

    request.onsuccess = () => migrateLegacyData(request.result).then(() => resolve(request.result), reject);
    request.onerror = (event) => reject(event.target.error);
  });
  return dbPromise;
}

function tx(storeName, mode) {
  return openDB().then((db) => db.transaction(storeName, mode).objectStore(storeName));
}

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---------- learningProgress ----------

/** Holt den Fortschrittsdatensatz zu einer Content-ID, oder null. */
export async function getProgress(contentId) {
  const store = await tx(STORE_PROGRESS, "readonly");
  const result = await promisifyRequest(store.get(contentId));
  return result || null;
}

/** Legt einen Fortschrittsdatensatz an oder überschreibt ihn. */
export async function putProgress(record) {
  const store = await tx(STORE_PROGRESS, "readwrite");
  await promisifyRequest(store.put(record));
  return record;
}

/** Liefert alle Fortschrittsdatensätze als Array. */
export async function getAllProgress() {
  const store = await tx(STORE_PROGRESS, "readonly");
  return promisifyRequest(store.getAll());
}

/** Liefert alle fälligen Datensätze (nextReviewDate <= heute), sortiert nach Überfälligkeit. */
export async function getDueProgress(todayISO) {
  const all = await getAllProgress();
  return all
    .filter((r) => r.nextReviewDate && r.nextReviewDate <= todayISO)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
}

// ---------- activityLog ----------

/**
 * Protokolliert ein Lernereignis (für Wochen-Ist-Werte und Trefferquote).
 * @param {{contentId:string, contentType:string, certification:string, examDomainId:string, isNew:boolean, correct:boolean, confidence:number, responseTimeMs:number}} entry
 */
export async function logActivity(entry) {
  const store = await tx(STORE_ACTIVITY, "readwrite");
  const record = { ...entry, ts: new Date().toISOString() };
  await promisifyRequest(store.add(record));
  return record;
}

/** Liefert alle Aktivitäts-Einträge. */
export async function getAllActivity() {
  const store = await tx(STORE_ACTIVITY, "readonly");
  return promisifyRequest(store.getAll());
}

function commitTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(transaction.error || new Error("Speichervorgang abgebrochen."));
  });
}

async function readLegacyData() {
  const legacy = await new Promise((resolve, reject) => {
    const request = indexedDB.open("sfz-app-db");
    // Eine neue Datenbank an dieser Adresse enthält keinen alten Lernstand.
    request.onupgradeneeded = () => request.transaction.abort();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      if (request.error?.name === "AbortError") resolve(null);
      else reject(request.error);
    };
  });
  if (!legacy) return [[], []];
  try {
    const transaction = legacy.transaction([STORE_PROGRESS, STORE_ACTIVITY], "readonly");
    const records = await Promise.all([STORE_PROGRESS, STORE_ACTIVITY].map((name) =>
      promisifyRequest(transaction.objectStore(name).getAll())
    ));
    return records.map((entries) => entries.filter(belongsToTrainer));
  } finally {
    legacy.close();
  }
}

async function migrateLegacyData(db) {
  const check = db.transaction(STORE_MIGRATIONS).objectStore(STORE_MIGRATIONS);
  if (await promisifyRequest(check.get(LEGACY_MIGRATION))) return;

  const [progress, activity] = await readLegacyData();
  const transaction = db.transaction([STORE_MIGRATIONS, STORE_PROGRESS, STORE_ACTIVITY], "readwrite");
  const committed = commitTransaction(transaction);
  const markers = transaction.objectStore(STORE_MIGRATIONS);
  const marker = markers.get(LEGACY_MIGRATION);
  // Die Markierung wird mit den Daten geschrieben. Parallel geöffnete Tabs übernehmen sie nur einmal.
  marker.onsuccess = () => {
    if (marker.result) return;
    const progressStore = transaction.objectStore(STORE_PROGRESS);
    const activityStore = transaction.objectStore(STORE_ACTIVITY);
    progress.forEach((record) => progressStore.put(record));
    activity.forEach((record) => activityStore.put(record));
    markers.put(true, LEGACY_MIGRATION);
  };
  await committed;
}

/** Ersetzt beide Lernstand-Speicher gemeinsam. */
export async function replaceLearningData(progress, activity) {
  const db = await openDB();
  const transaction = db.transaction([STORE_PROGRESS, STORE_ACTIVITY], "readwrite");
  const committed = commitTransaction(transaction);
  const progressStore = transaction.objectStore(STORE_PROGRESS);
  const activityStore = transaction.objectStore(STORE_ACTIVITY);
  try {
    progressStore.clear();
    activityStore.clear();
    progress.forEach((record) => progressStore.put(record));
    activity.forEach((record) => activityStore.put(record));
  } catch (error) {
    transaction.abort();
    await committed.catch(() => {});
    throw error;
  }
  await committed;
}
