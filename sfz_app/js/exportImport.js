// exportImport.js — JSON-Export/-Import des kompletten Lernstands (Fortschritt, Aktivitätslog, Einstellungen).

import * as db from "./db.js";
import { state, saveSettings, refreshProgress, refreshActivity } from "./state.js";

const EXPORT_VERSION = 1;

/** Exportiert den gesamten Lernstand als herunterladbare JSON-Datei. */
export async function exportData() {
  const [progress, activity] = await Promise.all([db.getAllProgress(), db.getAllActivity()]);
  const payload = {
    exportVersion: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    learningProgress: progress,
    activityLog: activity
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `salesforce-lernstand-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Importiert einen zuvor exportierten Lernstand. Überschreibt bestehende Daten vollständig.
 * @param {File} file
 */
export async function importData(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Die Datei ist kein gültiges JSON.");
  }

  if (!payload || typeof payload !== "object" || !Array.isArray(payload.learningProgress)) {
    throw new Error("Die Datei hat nicht das erwartete Format eines Lernstand-Exports.");
  }

  await db.clearProgress();
  await db.clearActivity();
  await db.bulkPutProgress(payload.learningProgress);
  await db.bulkPutActivity(payload.activityLog || []);

  if (payload.settings) {
    saveSettings(payload.settings);
  }

  return {
    progressCount: payload.learningProgress.length,
    activityCount: (payload.activityLog || []).length
  };
}

/**
 * Setzt den kompletten Lernfortschritt zurück: löscht alle SM-2-Fortschrittsdatensätze und
 * das Aktivitätslog und setzt das Startdatum der 12-Wochen-Planung auf heute. Theme,
 * Lernpfad und Tagesziel bleiben unverändert, da sie keine Fortschrittsdaten sind.
 * Unumkehrbar — die aufrufende Stelle muss vorher selbst nachfragen (siehe confirmDialog).
 */
export async function resetAllProgress() {
  await db.clearProgress();
  await db.clearActivity();
  saveSettings({ startDate: new Date().toISOString().slice(0, 10) });
  await refreshProgress();
  await refreshActivity();
}
