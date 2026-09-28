// state.js — Zentraler App-State (kein Framework, einfacher Store mit Pub/Sub).

import * as contentLoader from "./contentLoader.js";
import { PLATFORMS, platformConfig } from "./platforms.js";
import * as db from "./db.js";

const SETTINGS_KEY = "sfz-app-settings";

const defaultSettings = {
  theme: "dark",
  dailySessionMinutesTarget: 30,
  startDate: new Date().toISOString().slice(0, 10),
  // certificationPath: null bedeutet "noch nicht gewählt" -> erzwingt das Onboarding.
  // Salesforce: "foundations" | "administrator" | "administrator-full"
  // HubSpot: "hubspot-inbound-sales" | "hubspot-sales-software" | "hubspot-frictionless-sales" | "hubspot-all"
  // (siehe Produktkonzept, Kapitel 7 Nachtrag 2 — Salesforce verlangt keine formale Prüfungsvoraussetzung,
  // aber "administrator" setzt inhaltlich bestandenes Foundations-Wissen voraus; "administrator-full"
  // deckt beide Stoffgebiete in einem 12-Wochen-Plan ab, siehe pathCertifications()).
  // Jede Person wählt genau einen Lernpfad und kann ihn später in den Einstellungen wechseln.
  certificationPath: null
};

const listeners = new Set();

export const state = {
  content: null, // { vocabulary, definitions, readingPassages, questions, practiceTasks, examDomains, weeklyPlan }
  progressByContentId: new Map(),
  activity: [],
  settings: loadSettings(),
  ready: false
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(partial) {
  state.settings = { ...state.settings, ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn(state);
}

/** Initialisiert den App-State: lädt Content-JSONs und Fortschritt aus IndexedDB. */
export async function init() {
  const [content, progressList, activity] = await Promise.all([
    contentLoader.loadAll(),
    db.getAllProgress(),
    db.getAllActivity()
  ]);
  state.content = content;
  state.progressByContentId = new Map(progressList.map((p) => [p.contentId, p]));
  state.activity = activity;
  state.ready = true;
  notify();
  return state;
}

export async function refreshProgress() {
  const progressList = await db.getAllProgress();
  state.progressByContentId = new Map(progressList.map((p) => [p.contentId, p]));
  notify();
}

export async function refreshActivity() {
  state.activity = await db.getAllActivity();
  notify();
}

/** Liefert alle lernbaren Inhalte als flache Liste mit contentType-Tag. */
export function allLearnableContent() {
  if (!state.content) return [];
  const { vocabulary, definitions, readingPassages, questions } = state.content;
  return [
    ...vocabulary.map((c) => ({ content: c, contentType: "vocabulary" })),
    ...definitions.map((c) => ({ content: c, contentType: "definition" })),
    ...readingPassages.map((c) => ({ content: c, contentType: "readingPassage" })),
    ...questions.map((c) => ({ content: c, contentType: "question" }))
  ];
}

export function getProgress(contentId) {
  return state.progressByContentId.get(contentId) || null;
}

export function domainMap() {
  return contentLoader.domainMap(state.content?.examDomains || []);
}

export function domainWeightMap() {
  return contentLoader.domainWeightMap(state.content?.examDomains || []);
}

export function filterByCertification(items, certification) {
  if (certification === "both" || !certification) return items;
  const allowed = pathCertifications(certification);
  return items.filter((i) => allowed.includes(i.content.certification));
}

/**
 * Bildet einen der drei Lernpfade auf die binären Content-Certification-Tags ab,
 * mit denen Vokabeln/Fragen/Reading-Passagen/Definitionen in den Content-JSONs getaggt sind.
 * - "foundations": nur Foundations-Inhalte (keine Vorkenntnisse nötig)
 * - "administrator": nur Administrator-Inhalte (setzt bestandene Foundations-Prüfung voraus)
 * - "administrator-full": Foundations- UND Administrator-Inhalte (keine Vorkenntnisse nötig,
 *   deckt beide Stoffgebiete im selben 12-Wochen-Plan ab)
 */
export function pathCertifications(path) {
  if (path === "administrator-full") return ["foundations", "administrator"];
  if (path === "administrator") return ["administrator"];
  // HubSpot-Ebene: "hubspot-all" bündelt alle drei Zertifizierungen, sonst ist der Lernpfad
  // selbst das Content-Certification-Tag (siehe js/platforms.js).
  if (path === "hubspot-all") return [...PLATFORMS.hubspot.certifications];
  if (PLATFORMS.hubspot.certifications.includes(path)) return [path];
  return ["foundations"];
}

/** Plattform-Konfiguration des aktuell gewählten Lernpfads (Salesforce oder HubSpot). */
export function activePlatform() {
  return platformConfig(state.settings.certificationPath || "foundations");
}
