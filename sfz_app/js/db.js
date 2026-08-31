// db.js — IndexedDB-Wrapper für Lernfortschritt (SM-2) und Aktivitätslog.
// Kein externes Framework, native IndexedDB-API, Promise-basiert.

const DB_NAME = "sfz-app-db";
const DB_VERSION = 1;
const STORE_PROGRESS = "learningProgress";
const STORE_ACTIVITY = "activityLog";

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

    request.onsuccess = (event) => resolve(event.target.result);
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

/** Löscht den kompletten learningProgress-Store (für JSON-Import). */
export async function clearProgress() {
  const store = await tx(STORE_PROGRESS, "readwrite");
  await promisifyRequest(store.clear());
}

/** Schreibt mehrere Fortschrittsdatensätze auf einmal (für JSON-Import). */
export async function bulkPutProgress(records) {
  const store = await tx(STORE_PROGRESS, "readwrite");
  await Promise.all(records.map((r) => promisifyRequest(store.put(r))));
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

/** Löscht den kompletten activityLog-Store (für JSON-Import). */
export async function clearActivity() {
  const store = await tx(STORE_ACTIVITY, "readwrite");
  await promisifyRequest(store.clear());
}

/** Schreibt mehrere Aktivitäts-Einträge auf einmal (für JSON-Import). */
export async function bulkPutActivity(records) {
  const store = await tx(STORE_ACTIVITY, "readwrite");
  await Promise.all(records.map((r) => promisifyRequest(store.put(r))));
}
