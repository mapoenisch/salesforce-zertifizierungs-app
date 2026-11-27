// sm2.js — Angepasster SM-2-Algorithmus für Spaced Repetition.
// Beschreibung siehe 02_Produkt_und_Datenkonzept.md, Kapitel 5.

import { addCalendarDays, todayISO } from "./utils.js";

const MAX_REVIEW_INTERVAL_DAYS = 3650;
const MAX_EASE_FACTOR = 5;

/**
 * Wandelt (korrekt/falsch + Sicherheit 1-5) in eine SM-2-Qualität (0-5) um.
 * @param {boolean} correct
 * @param {number} confidence 1-5
 * @returns {number} quality 0-5
 */
export function toQuality(correct, confidence) {
  // Ohne Selbsteinschätzung verwendet SM-2 eine neutrale Qualität.
  const c = Number.isFinite(confidence) ? Math.min(5, Math.max(1, Math.round(confidence))) : 3;
  if (!correct) {
    if (c <= 2) return 0;
    if (c <= 4) return 1;
    return 2;
  }
  if (c === 1) return 3;
  if (c <= 3) return 4;
  return 5;
}

/**
 * Aktualisiert den Ease-Factor nach der SM-2-Formel.
 * @param {number} ef aktueller Ease-Factor
 * @param {number} q Qualität 0-5
 * @returns {number} neuer Ease-Factor, mindestens 1.3
 */
export function updateEaseFactor(ef, q) {
  const next = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return Math.max(1.3, Math.min(MAX_EASE_FACTOR, Math.round(next * 100) / 100));
}

/**
 * Berechnet den nächsten Fortschrittsdatensatz nach einer Antwort.
 * @param {object} progress bestehender Fortschritt (oder Default-Objekt bei erster Bearbeitung)
 * @param {{correct:boolean, confidence:number, responseTimeMs:number}} answer
 * @param {Date} [now]
 * @returns {object} aktualisierter Fortschrittsdatensatz (ohne contentId/contentType/certification/examDomainId/cefr — die bleiben unverändert im Aufrufer)
 */
export function computeNextProgress(progress, answer, now = new Date()) {
  const q = toQuality(answer.correct, answer.confidence);
  const prevEF = progress.easeFactor ?? 2.5;
  const easeFactor = updateEaseFactor(prevEF, q);

  let repetitions = progress.repetitions ?? 0;
  let intervalDays;
  let flag = null;

  if (!answer.correct && answer.languageSlip) {
    // Sprachfehler (z. B. englisches Signalwort überlesen): Fachkonzept nicht auf 0 zurücksetzen,
    // sondern nur zur zeitnahen Wiederholung vormerken.
    intervalDays = Math.max(1, Math.min(3, progress.intervalDays || 1));
    flag = "later";
  } else if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    flag = "relearn";
  } else {
    repetitions = Math.min(Number.MAX_SAFE_INTEGER, repetitions + 1);
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.min(MAX_REVIEW_INTERVAL_DAYS, Math.round((progress.intervalDays || 6) * easeFactor));

    // Wenn mit niedriger Sicherheit richtig beantwortet: als "später wiederholen" markieren,
    // aber das SM-2-Intervall trotzdem nach der Formel fortschreiben.
    if (answer.confidence != null && answer.confidence <= 2) flag = "later";
  }

  return {
    repetitions,
    lastResult: answer.correct ? "correct" : "incorrect",
    confidence: answer.confidence ?? null,
    responseTimeMs: answer.responseTimeMs ?? null,
    languageSlip: Boolean(!answer.correct && answer.languageSlip),
    easeFactor,
    intervalDays,
    nextReviewDate: todayISO(addCalendarDays(now, intervalDays)),
    flag,
    quality: q
  };
}

/**
 * Erstellt den Fortschrittsdatensatz für eine Vokabel, die gerade zum ersten Mal als Karteikarte
 * eingeführt wurde (nur angesehen, nicht abgefragt — siehe itemRenderer.renderVocabularyIntro).
 * repetitions bleibt bei 0 (zählt SM-2-technisch weiterhin als "nie aktiv beantwortet"), aber
 * flag="intro" sorgt dafür, dass die Vokabel morgen als reguläre Wiederholung/erste echte Abfrage
 * erscheint, statt für immer im "neu"-Pool zu verschwinden (siehe Lernmodus).
 */
export function introProgress(content, contentType, now = new Date()) {
  return {
    contentId: content.id,
    contentType,
    certification: content.certification,
    examDomainId: content.examDomainId,
    cefr: content.cefr,
    repetitions: 0,
    lastResult: null,
    confidence: null,
    responseTimeMs: null,
    easeFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: todayISO(addCalendarDays(now, 1)),
    flag: "intro"
  };
}

/**
 * Erstellt einen leeren Ausgangs-Fortschrittsdatensatz für einen Inhalt, der noch nie beantwortet wurde.
 */
export function emptyProgress(content, contentType) {
  return {
    contentId: content.id,
    contentType,
    certification: content.certification,
    examDomainId: content.examDomainId,
    cefr: content.cefr,
    repetitions: 0,
    lastResult: null,
    confidence: null,
    responseTimeMs: null,
    easeFactor: 2.5,
    intervalDays: 0,
    nextReviewDate: null,
    flag: null
  };
}

/** Älteste überfällige Termine zuerst, danach fällige Fehler und unsichere Antworten. */
export function prioritizeDue(items, today) {
  const rank = (progress) => {
    if (progress.flag === "relearn" || progress.lastResult === "incorrect") return 0;
    if (progress.flag === "later") return 1;
    return 2;
  };
  return [...items].sort((a, b) => (a.progress.nextReviewDate || today)
    .localeCompare(b.progress.nextReviewDate || today) || rank(a.progress) - rank(b.progress));
}
