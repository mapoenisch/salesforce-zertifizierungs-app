// JSON-Sicherung für Lernfortschritt, Aktivitätsprotokoll und Einstellungen.

import { readLearningData, replaceLearningData } from "./db.js";
import { belongsToTrainer, supportedPath } from "./learningScope.js";
import { state, allLearnableContent, saveSettings, refreshLearningData } from "./state.js";
import { isCalendarDate, todayISO } from "./utils.js";

const EXPORT_VERSION = 1;
const TRAINER = "salesforce";
const LEGACY_CERTIFICATIONS = ["hubspot-sales-software", "hubspot-inbound-sales", "hubspot-frictionless-sales"];

export async function exportData() {
  const [progress, activity] = await readLearningData();
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
  const link = document.createElement("a");
  link.href = url;
  link.download = `${TRAINER}-lernstand-${todayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function readBackup(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Die Datei ist kein gültiges JSON.");
  }
  return validateBackup(payload, allLearnableContent());
}

export function validateBackup(payload, items) {
  if (!payload || !Array.isArray(payload.learningProgress) ||
      (payload.activityLog != null && !Array.isArray(payload.activityLog))) {
    throw new Error("Die Datei hat nicht das erwartete Format eines Lernstand-Exports.");
  }
  if (payload.trainer != null && payload.trainer !== TRAINER) {
    throw new Error("Die Sicherung stammt aus einer anderen Zertifizierungs-App.");
  }
  if (payload.exportVersion !== EXPORT_VERSION) {
    throw new Error("Diese Version der Lernstandsicherung wird nicht unterstützt.");
  }

  const catalog = new Map(items.map((item) => [item.content.id, item]));
  const progress = validateRecords(payload.learningProgress, catalog, false, payload.trainer == null);
  const activity = validateRecords(payload.activityLog || [], catalog, true, payload.trainer == null);
  if (!progress.length && !activity.length) {
    throw new Error("Die Sicherung enthält keinen Salesforce-Lernstand. Dein vorhandener Lernstand bleibt erhalten.");
  }
  return { progress, activity, settings: validateSettings(payload.settings, payload.trainer == null) };
}

function validateRecords(records, catalog, activity, legacy) {
  const ids = new Set();
  return records.filter((record, index) => {
    if (legacy && LEGACY_CERTIFICATIONS.includes(record?.certification)) return false;

    const item = catalog.get(record?.contentId);
    const id = activity ? record?.id : record?.contentId;
    if (!belongsToTrainer(record) || !item || ids.has(id) ||
        item.contentType !== record.contentType || item.content.certification !== record.certification ||
        item.content.examDomainId !== record.examDomainId ||
        !validMeasurements(record) || (activity ? !validActivity(record) : !validProgress(record, item))) {
      const section = activity ? "Aktivitätsprotokoll" : "Fortschritt";
      throw new Error(`${section}, Eintrag ${index + 1}: Aufgaben-ID oder Datensatz ist ungültig.`);
    }
    ids.add(id);
    return true;
  });
}

function validMeasurements(record) {
  return (record.confidence == null || (Number.isInteger(record.confidence) &&
    record.confidence >= 1 && record.confidence <= 5)) &&
    (record.responseTimeMs == null || (Number.isFinite(record.responseTimeMs) && record.responseTimeMs >= 0));
}

function validActivity(record) {
  return Number.isSafeInteger(record.id) && record.id > 0 &&
    typeof record.ts === "string" && Number.isFinite(Date.parse(record.ts)) &&
    typeof record.isNew === "boolean" &&
    (record.isIntro === true ? record.correct == null : typeof record.correct === "boolean") &&
    (record.isIntro == null || typeof record.isIntro === "boolean");
}

function validProgress(record, item) {
  return (record.cefr == null || record.cefr === item.content.cefr) &&
    Number.isSafeInteger(record.repetitions) && record.repetitions >= 0 &&
    Number.isSafeInteger(record.intervalDays) && record.intervalDays >= 0 &&
    Number.isFinite(record.easeFactor) && record.easeFactor >= 1.3 &&
    (record.nextReviewDate == null || isCalendarDate(record.nextReviewDate)) &&
    (record.lastResult == null || ["correct", "incorrect"].includes(record.lastResult)) &&
    (record.flag == null || ["intro", "later", "relearn"].includes(record.flag));
}

function validateSettings(settings, legacy) {
  if (settings == null) return {};
  if (typeof settings !== "object" || Array.isArray(settings)) throw new Error("Die Einstellungen sind ungültig.");

  const path = supportedPath(settings.certificationPath);
  const { theme, startDate, dailySessionMinutesTarget: minutes } = settings;
  const legacyPath = legacy && [...LEGACY_CERTIFICATIONS, "hubspot-all"].includes(settings.certificationPath);
  if ((settings.certificationPath != null && !path && !legacyPath) ||
      (theme != null && !["dark", "light"].includes(theme)) ||
      (startDate != null && !isCalendarDate(startDate)) ||
      (minutes != null && (!Number.isInteger(minutes) || minutes < 5 || minutes > 120))) {
    throw new Error("Ein oder mehrere Werte in den Einstellungen sind ungültig.");
  }
  return {
    ...(path && { certificationPath: path }),
    ...(theme != null && { theme }),
    ...(startDate != null && { startDate }),
    ...(minutes != null && { dailySessionMinutesTarget: minutes })
  };
}

/** Aufruf erst nach der angezeigten Vorschau und Bestätigung. */
export async function restoreBackup({ progress, activity, settings }) {
  await replaceLearningData(progress, activity);
  await refreshLearningData();
  return restoreSettings(settings);
}

export async function resetAllProgress() {
  await replaceLearningData([], []);
  await refreshLearningData();
  return restoreSettings({ startDate: todayISO() });
}

function restoreSettings(settings) {
  if (!Object.keys(settings).length) return true;
  try {
    saveSettings(settings);
    return true;
  } catch {
    // Die beiden Lernstandspeicher sind bereits gemeinsam geschrieben.
    return false;
  }
}
