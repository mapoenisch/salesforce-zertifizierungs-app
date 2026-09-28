// sm2.js — Angepasster SM-2-Algorithmus für Spaced Repetition.
// Beschreibung siehe 02_Produkt_und_Datenkonzept.md, Kapitel 5.

import { platformOfCertification } from "./platforms.js";

/**
 * Wandelt (korrekt/falsch + Sicherheit 1-5) in eine SM-2-Qualität (0-5) um.
 * @param {boolean} correct
 * @param {number} confidence 1-5
 * @returns {number} quality 0-5
 */
export function toQuality(correct, confidence) {
  const c = Math.min(5, Math.max(1, Math.round(confidence)));
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
  return Math.max(1.3, Math.round(next * 100) / 100);
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

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    flag = "relearn";
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round((progress.intervalDays || 6) * easeFactor);

    // Wenn mit niedriger Sicherheit richtig beantwortet: als "später wiederholen" markieren,
    // aber das SM-2-Intervall trotzdem nach der Formel fortschreiben.
    if (answer.confidence <= 2) flag = "later";
  }

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  return {
    repetitions,
    lastResult: answer.correct ? "correct" : "incorrect",
    confidence: answer.confidence,
    responseTimeMs: answer.responseTimeMs ?? null,
    easeFactor,
    intervalDays,
    nextReviewDate: nextReviewDate.toISOString().slice(0, 10),
    flag,
    quality: q
  };
}

/**
 * Erstellt den Fortschrittsdatensatz für eine Vokabel, die gerade zum ersten Mal als Karteikarte
 * eingeführt wurde (nur angesehen, nicht abgefragt — siehe itemRenderer.renderVocabularyIntro).
 * repetitions bleibt bei 0 (zählt SM-2-technisch weiterhin als "nie aktiv beantwortet"), aber
 * flag="intro" sorgt dafür, dass die Vokabel morgen als reguläre Wiederholung/erste echte Abfrage
 * erscheint, statt für immer im "neu"-Pool zu verschwinden (siehe prioritize() und learn.js).
 */
export function introProgress(content, contentType, now = new Date()) {
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + 1);
  return {
    contentId: content.id,
    contentType,
    certification: content.certification,
    platform: content.platform || platformOfCertification(content.certification),
    examDomainId: content.examDomainId,
    cefr: content.cefr,
    repetitions: 0,
    lastResult: null,
    confidence: null,
    responseTimeMs: null,
    easeFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: nextReviewDate.toISOString().slice(0, 10),
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
    platform: content.platform || platformOfCertification(content.certification),
    examDomainId: content.examDomainId,
    cefr: content.cefr,
    repetitions: 0,
    lastResult: null,
    confidence: null,
    responseTimeMs: null,
    easeFactor: 2.5,
    intervalDays: 0,
    nextReviewDate: new Date().toISOString().slice(0, 10),
    flag: null
  };
}

/**
 * Sortiert eine Liste von Content-Items nach Lernpriorität (Kapitel 5 der Produktkonzept-Doku):
 * 1. überfällige Wiederholungen (nach Überfälligkeitsdauer) — dazu zählen auch als "intro" markierte
 *    Vokabeln, deren erste echte Abfrage jetzt fällig ist (siehe introProgress())
 * 2. flag === 'relearn'
 * 3. flag === 'later'
 * 4. neue Inhalte aus hoch gewichteten Domains
 * 5. restliche neue Inhalte
 *
 * @param {Array<{content:object, progress:object|null}>} items
 * @param {Map<string,number>} domainWeights examDomainId -> weightPercent
 * @param {string} todayISO
 */
export function prioritize(items, domainWeights, todayISO) {
  const score = ({ content, progress }) => {
    if (
      progress &&
      progress.nextReviewDate &&
      progress.nextReviewDate <= todayISO &&
      (progress.repetitions > 0 || progress.flag === "intro")
    ) {
      return [0, progress.nextReviewDate];
    }
    if (progress && progress.flag === "relearn") return [1, ""];
    if (progress && progress.flag === "later") return [2, ""];
    const weight = domainWeights.get(content.examDomainId) || 0;
    if (!progress) return [4 - Math.min(weight / 100, 0.99), ""];
    return [5, ""];
  };

  return [...items].sort((a, b) => {
    const [sa, ta] = score(a);
    const [sb, tb] = score(b);
    if (sa !== sb) return sa - sb;
    return String(ta).localeCompare(String(tb));
  });
}
