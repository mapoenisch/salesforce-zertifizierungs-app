// state.js — Zentraler App-State (kein Framework, einfacher Store mit Pub/Sub).

import * as contentLoader from "./contentLoader.js";
import * as db from "./db.js";
import { supportedPath } from "./learningScope.js";
import { isCalendarDate, todayISO } from "./utils.js";

const SETTINGS_KEY = "salesforce-trainer-settings";

const defaultSettings = {
  theme: "dark",
  dailySessionMinutesTarget: 30,
  startDate: todayISO(),
  // certificationPath: null bedeutet "noch nicht gewählt" -> erzwingt das Onboarding.
  // Drei mögliche Werte nach Onboarding: "foundations" | "administrator" | "administrator-full"
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
    const raw = localStorage.getItem(SETTINGS_KEY) ?? localStorage.getItem("sfz-app-settings");
    const settings = { ...defaultSettings, ...JSON.parse(raw) };
    return {
      theme: ["dark", "light"].includes(settings.theme) ? settings.theme : defaultSettings.theme,
      dailySessionMinutesTarget: Number.isInteger(settings.dailySessionMinutesTarget)
        && settings.dailySessionMinutesTarget >= 5 && settings.dailySessionMinutesTarget <= 120
        ? settings.dailySessionMinutesTarget : defaultSettings.dailySessionMinutesTarget,
      startDate: isCalendarDate(settings.startDate) ? settings.startDate : defaultSettings.startDate,
      certificationPath: supportedPath(settings.certificationPath)
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(partial) {
  const settings = { ...state.settings, ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  state.settings = settings;
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn(state);
}

let initPromise = null;

/** Initialisiert den App-State: lädt Content-JSONs und Fortschritt aus IndexedDB (dedupliziert). */
export async function init() {
  if (state.ready) return state;
  if (!initPromise) {
    initPromise = Promise.all([
      contentLoader.loadAll(),
      db.readLearningData()
    ]).then(([content, [progressList, activity]]) => {
      state.content = content;
      state.progressByContentId = new Map(progressList.map((p) => [p.contentId, p]));
      state.activity = activity;
      state.ready = true;
      notify();
      return state;
    }).catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

/** Lädt Lerninhalte im Hintergrund vor, ohne auf Fehler zu werfen. */
export function preload() {
  return init().catch(() => {});
}

export async function refreshLearningData() {
  const [progressList, activity] = await db.readLearningData();
  state.progressByContentId = new Map(progressList.map((p) => [p.contentId, p]));
  state.activity = activity;
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
 * - "administrator": nur Administrator-Inhalte (setzt Foundations-Grundwissen voraus)
 * - "administrator-full": Foundations- UND Administrator-Inhalte (keine Vorkenntnisse nötig,
 *   deckt beide Stoffgebiete im selben 12-Wochen-Plan ab)
 */
export function pathCertifications(path) {
  if (path === "administrator-full") return ["foundations", "administrator"];
  if (path === "administrator") return ["administrator"];
  return ["foundations"];
}
