// weeklyPlan.js — Soll-Ist-Vergleich gegen den 12-Wochen-Lernplan.

import { addCalendarDays, todayISO } from "./utils.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const GOAL_METRICS = [
  ["Neue Vokabeln", "newVocab", "newVocabTarget"],
  ["Wiederholungen", "reviews", "reviewsTarget"],
  ["Reading-Übungen", "readingExercises", "readingExercisesTarget"]
];

function calendarDay(date) {
  return Date.parse(todayISO(date) + "T00:00:00Z") / MS_PER_DAY;
}

/** Aktuelle Lernwoche, auch nach dem Ende des zwölfwöchigen Soll-Plans. */
export function getCurrentWeekNumber(startDateISO, today = new Date()) {
  const start = new Date(startDateISO + "T00:00:00");
  const diffDays = calendarDay(today) - calendarDay(start);
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}

/**
 * Liefert den Wochen-Sollwert-Datensatz für eine Wochennummer im gewählten Lernpfad.
 * `certification` ist hier die Lernpfad-ID (settings.certificationPath): "foundations" | "administrator" | "administrator-full".
 * Jeder Wochendatensatz trägt zusätzlich ein "phase"-Feld ("foundations" | "administrator"), das angibt,
 * aus welchem Content-Pool in dieser Woche neue Inhalte gezogen werden sollen (relevant v.a. für administrator-full).
 */
export function getWeekTarget(weeklyPlan, weekNumber, certification) {
  return weeklyPlan.find((w) => w.week === weekNumber && w.certification === certification) || null;
}

/** Exportiert, da auch der Wochenrückblick (getWeekWeakDomains) den Datumsbereich einer Woche braucht. */
export function weekDateRange(startDateISO, weekNumber) {
  const start = new Date(startDateISO + "T00:00:00");
  const weekStart = addCalendarDays(start, (weekNumber - 1) * 7);
  const weekEnd = addCalendarDays(weekStart, 7);
  return { weekStart, weekEnd };
}

/**
 * Berechnet die Wochen-Ist-Werte aus dem Aktivitätslog, gefiltert auf den aktiven Lernpfad
 * (Aktivität aus einem zuvor genutzten anderen Pfad zählt nicht auf das aktuelle Wochen-Soll).
 * @param {Array} activity Einträge aus dem Aktivitätsprotokoll
 * @param {string} startDateISO
 * @param {number} weekNumber
 * @param {string[]} certifications Erlaubte binäre Content-Certifications, z. B. state.pathCertifications(path)
 *   — bei "administrator-full" sind das ["foundations","administrator"] zusammen, da Aktivitäts-Einträge
 *   immer die binäre Content-Certification tragen, nie die Lernpfad-ID selbst.
 */
export function computeWeekActual(activity, startDateISO, weekNumber, certifications) {
  const { weekStart, weekEnd } = weekDateRange(startDateISO, weekNumber);
  return computeActual(activity, weekStart, weekEnd, certifications);
}

function computeActual(activity, start, end, certifications) {
  const inWeek = activity.filter((a) => {
    if (certifications && certifications.length && !certifications.includes(a.certification)) return false;
    const ts = new Date(a.ts);
    return ts >= start && ts < end;
  });

  // "intro"-Einträge (Vokabel nur als Karteikarte kennengelernt, siehe learn.js persistIntro)
  // zählen auf newVocab, aber nicht auf Trefferquote/Antwortenzahl — sie wurden nicht aktiv beantwortet.
  const newVocab = inWeek.filter((a) => a.contentType === "vocabulary" && a.isNew).length;
  const scored = inWeek.filter((a) => typeof a.correct === "boolean");
  const reviews = scored.filter((a) => !a.isNew).length;
  const readingExercises = scored.filter((a) => a.contentType === "readingPassage").length;
  const correct = scored.filter((a) => a.correct).length;
  const accuracy = scored.length > 0 ? Math.round((correct / scored.length) * 100) : null;

  return { newVocab, reviews, readingExercises, totalAnswers: scored.length, accuracy };
}

/** Summiert bis zum Ende des gewählten Monats, einschließlich früherer Planwochen. */
export function computeMilestoneProgress(weeklyPlan, activity, startDate, month, path, certifications) {
  const endWeek = month * 4;
  const targets = weeklyPlan.filter((entry) => entry.certification === path && entry.week <= endWeek);
  const target = Object.fromEntries(GOAL_METRICS.map(([, , key]) =>
    [key, targets.reduce((sum, entry) => sum + entry[key], 0)]
  ));
  const start = weekDateRange(startDate, 1).weekStart;
  const end = weekDateRange(startDate, endWeek).weekEnd;
  return { target, actual: computeActual(activity, start, end, certifications) };
}

/** Ordnet eine Wochennummer ihrem Monatsmeilenstein zu (Wochen 1-4 = Monat 1, usw.). */
export function getMonthForWeek(weekNumber) {
  return Math.min(3, Math.ceil(weekNumber / 4));
}

/**
 * Findet den textuellen Meilenstein für den aktuellen Monat im gewählten Lernpfad (letzte Woche des Monats mit milestone-Feld).
 * `certification` ist hier wieder die Lernpfad-ID, wie bei getWeekTarget.
 */
export function getMonthMilestone(weeklyPlan, monthNumber, certification) {
  const weeksInMonth = weeklyPlan.filter((w) => w.certification === certification && getMonthForWeek(w.week) === monthNumber);
  const withMilestone = weeksInMonth.reverse().find((w) => w.milestone);
  return withMilestone ? withMilestone.milestone : null;
}

/**
 * Schwächste Exam-Domains innerhalb der aktuellen Woche (nicht Lifetime) — Grundlage für den
 * Wochenrückblick auf der Fortschrittsseite. Braucht mind. 2 gewertete Antworten pro Domain in
 * dieser Woche, sonst ist die Aussage statistisch zu unsicher (bewusst niedrigere Schwelle als
 * die Lifetime-Schwachpunktanalyse mit >=3, da eine Woche naturgemäß weniger Datenpunkte liefert).
 * @param {Array} activity Einträge aus dem Aktivitätsprotokoll
 * @param {string} startDateISO
 * @param {number} weekNumber
 * @param {string[]} certifications
 * @param {Map} domainMap examDomainId -> Domain-Objekt (aus state.domainMap())
 */
export function getWeekWeakDomains(activity, startDateISO, weekNumber, certifications, domainMap) {
  const { weekStart, weekEnd } = weekDateRange(startDateISO, weekNumber);
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId || typeof a.correct !== "boolean") continue; // reines Vokabel-Kennenlernen zählt nicht als Trefferquote
    if (certifications && certifications.length && !certifications.includes(a.certification)) continue;
    const ts = new Date(a.ts);
    if (ts < weekStart || ts >= weekEnd) continue;
    if (!byDomain.has(a.examDomainId)) byDomain.set(a.examDomainId, { correct: 0, total: 0 });
    const entry = byDomain.get(a.examDomainId);
    entry.total += 1;
    if (a.correct) entry.correct += 1;
  }
  return [...byDomain.entries()]
    .filter(([, v]) => v.total >= 2)
    .map(([id, v]) => ({
      id,
      name: domainMap.get(id)?.name || id,
      accuracy: Math.round((v.correct / v.total) * 100),
      total: v.total
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

/**
 * Baut eine konkrete, regelbasierte Empfehlung für den Wochenrückblick (Freitext, ein bis zwei Sätze).
 * Prüft in fester Priorität: keine Aktivität diese Woche > deutlicher Wiederholungsrückstand >
 * klarer Schwachpunkt in einer Domain > insgesamt niedrige Trefferquote > alles im Soll (Lob).
 * Bewusst regelbasiert und transparent statt eines Black-Box-Scores — passend zum Prinzip
 * "Lernindikator, keine Bestehensgarantie" aus der Lernreifeanzeige.
 * @param {{weekActual: object, weekTarget: object|null, weakDomains: Array}} params
 * @returns {string}
 */
export function buildWeeklyRecommendation({ weekActual, weekTarget, weakDomains }) {
  if (!weekActual || weekActual.totalAnswers === 0) {
    return "Diese Woche gab es noch keine gewertete Aktivität. Starte mit der \"Heutigen Einheit\" auf dem Dashboard, um dein Wochenziel nicht zu verpassen.";
  }
  const gaps = weekTarget ? GOAL_METRICS
    .filter(([, actual, target]) => weekActual[actual] < weekTarget[target])
    .map(([label, actual, target]) => `${label} (${weekActual[actual]}/${weekTarget[target]})`) : [];
  if (gaps.length) return `Beim Wochenziel sind noch offen: ${gaps.join(", ")}.`;
  if (weakDomains.length > 0 && weakDomains[0].accuracy < 60) {
    const d = weakDomains[0];
    return `Größter Schwachpunkt diese Woche: "${d.name}" mit ${d.accuracy}% Trefferquote (${d.total} Antworten). Nutze den Prüfungsmodus mit Filter auf diese Domain für gezieltes Üben.`;
  }
  if (weekActual.accuracy != null && weekActual.accuracy < 70) {
    return `Deine Trefferquote liegt diese Woche bei ${weekActual.accuracy}% — etwas unter dem Zielbereich. Wiederhole zuerst als falsch markierte Inhalte, bevor du viele neue Begriffe aufnimmst.`;
  }
  return weekTarget
    ? "Alle Wochenziele erreicht. Nutze weitere Einheiten zum Festigen."
    : "Der zwölfwöchige Plan ist abgeschlossen. Übe gezielt anhand deiner aktuellen Trefferquote.";
}

/**
 * Berechnet einen kompakten Plan-Status ("Im Plan" vs. "X Tage Aufholbedarf") gegen das 12-Wochen-Ziel.
 * @returns {{status: "on-track"|"behind"|"completed", label: string, daysBehind: number}}
 */
export function computePlanStatus(weeklyPlan, activity, startDateISO, path, certifications, today = new Date()) {
  const start = new Date(startDateISO + "T00:00:00");
  const elapsedDays = Math.max(0, Math.floor(calendarDay(today) - calendarDay(start)));
  const weekNumber = getCurrentWeekNumber(startDateISO, today);
  const pathWeeks = weeklyPlan.filter((w) => w.certification === path);
  const totalTarget = pathWeeks.reduce(
    (sum, w) => sum + w.newVocabTarget + w.reviewsTarget + w.readingExercisesTarget,
    0
  );
  const end = addCalendarDays(start, 12 * 7);
  const actualStats = computeActual(activity, start, today < end ? addCalendarDays(today, 1) : end, certifications);
  const actualTotal = actualStats.newVocab + actualStats.reviews + actualStats.readingExercises;

  if (weekNumber > 12 && actualTotal >= totalTarget) {
    return { status: "completed", label: "Plan-Status: 12-Wochen-Ziel erreicht", daysBehind: 0 };
  }

  let expectedTotal = 0;
  for (const w of pathWeeks) {
    const weekSum = w.newVocabTarget + w.reviewsTarget + w.readingExercisesTarget;
    if (w.week < weekNumber) {
      expectedTotal += weekSum;
    } else if (w.week === weekNumber) {
      const dayInWeek = (elapsedDays % 7) + 1;
      // Am ersten Tag der Woche gilt der Tagesanteil erst nach etwas Puffer; ab Tag 2 anteilig.
      expectedTotal += weekSum * (Math.max(0, dayInWeek - 1) / 7);
    }
  }

  if (expectedTotal <= 0 || actualTotal >= expectedTotal * 0.9) {
    return { status: "on-track", label: "Plan-Status: Im Plan", daysBehind: 0 };
  }

  const currentTarget = getWeekTarget(weeklyPlan, Math.min(12, weekNumber), path);
  const weekSum = currentTarget
    ? currentTarget.newVocabTarget + currentTarget.reviewsTarget + currentTarget.readingExercisesTarget
    : Math.max(1, totalTarget / 12);
  const dailyPace = Math.max(1, weekSum / 7);
  const daysBehind = Math.max(1, Math.round((expectedTotal - actualTotal) / dailyPace));
  return {
    status: "behind",
    label: `Plan-Status: ${daysBehind} ${daysBehind === 1 ? "Tag" : "Tage"} Aufholbedarf`,
    daysBehind
  };
}
