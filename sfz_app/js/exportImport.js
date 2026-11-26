// exportImport.js — JSON-Export/-Import des kompletten Lernstands (Fortschritt, Aktivitätslog, Einstellungen).

import * as db from "./db.js";
import { belongsToTrainer, supportedPath } from "./learningScope.js";
import { state, saveSettings, refreshProgress, refreshActivity } from "./state.js";

const EXPORT_VERSION = 1;
const TRAINER = "salesforce";

/** Exportiert den gesamten Lernstand als herunterladbare JSON-Datei. */
export async function exportData() {
  const [progress, activity] = await Promise.all([db.getAllProgress(), db.getAllActivity()]);
  const payload = {
    exportVersion: EXPORT_VERSION,
    trainer: TRAINER,
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    learningProgress: progress,
    activityLog: activity
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${TRAINER}-lernstand-${new Date().toISOString().slice(0, 10)}.json`;
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

  if (payload.trainer && payload.trainer !== TRAINER) {
    throw new Error("Die Sicherung stammt aus der anderen Zertifizierungs-App.");
  }
  if (payload.activityLog != null && !Array.isArray(payload.activityLog)) {
    throw new Error("Das Aktivitätsprotokoll hat ein ungültiges Format.");
  }

  const progress = payload.learningProgress.filter(belongsToTrainer);
  const activity = (payload.activityLog || []).filter(belongsToTrainer);
  const path = supportedPath(payload.settings?.certificationPath);
  if (!progress.length && !activity.length && !path && payload.trainer !== TRAINER) {
    throw new Error("Die Sicherung enthält keinen Lernstand für diesen Trainer.");
  }

  await db.replaceLearningData(progress, activity);
  if (payload.settings && typeof payload.settings === "object") {
    saveSettings({ ...payload.settings, certificationPath: path || state.settings.certificationPath });
  }
  await Promise.all([refreshProgress(), refreshActivity()]);

  return { progressCount: progress.length, activityCount: activity.length };
}

/**
 * Setzt den kompletten Lernfortschritt zurück: löscht alle SM-2-Fortschrittsdatensätze und
 * das Aktivitätslog und setzt das Startdatum der 12-Wochen-Planung auf heute. Theme,
 * Lernpfad und Tagesziel bleiben unverändert, da sie keine Fortschrittsdaten sind.
 * Unumkehrbar — die aufrufende Stelle muss vorher selbst nachfragen (siehe confirmDialog).
 */
export async function resetAllProgress() {
  await db.replaceLearningData([], []);
  saveSettings({ startDate: new Date().toISOString().slice(0, 10) });
  await refreshProgress();
  await refreshActivity();
}
