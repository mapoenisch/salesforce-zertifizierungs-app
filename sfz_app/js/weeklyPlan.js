// weeklyPlan.js — Soll-Ist-Vergleich gegen den 12-Wochen-Lernplan.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Ermittelt die aktuelle Wochennummer (1-12, danach bleibt sie bei 12) ab dem Startdatum. */
export function getCurrentWeekNumber(startDateISO, today = new Date()) {
  const start = new Date(startDateISO + "T00:00:00");
  const diffDays = Math.floor((today - start) / MS_PER_DAY);
  const week = Math.floor(diffDays / 7) + 1;
  return Math.min(12, Math.max(1, week));
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
  const weekStart = new Date(start.getTime() + (weekNumber - 1) * 7 * MS_PER_DAY);
  const weekEnd = new Date(weekStart.getTime() + 7 * MS_PER_DAY);
  return { weekStart, weekEnd };
}

/**
 * Berechnet die Wochen-Ist-Werte aus dem Aktivitätslog, gefiltert auf den aktiven Lernpfad
 * (Aktivität aus einem zuvor genutzten anderen Pfad zählt nicht auf das aktuelle Wochen-Soll).
 * @param {Array} activity Einträge aus db.getAllActivity()
 * @param {string} startDateISO
 * @param {number} weekNumber
 * @param {string[]} certifications Erlaubte binäre Content-Certifications, z. B. state.pathCertifications(path)
 *   — bei "administrator-full" sind das ["foundations","administrator"] zusammen, da Aktivitäts-Einträge
 *   immer die binäre Content-Certification tragen, nie die Lernpfad-ID selbst.
 */
export function computeWeekActual(activity, startDateISO, weekNumber, certifications) {
  const { weekStart, weekEnd } = weekDateRange(startDateISO, weekNumber);
  const inWeek = activity.filter((a) => {
    if (certifications && certifications.length && !certifications.includes(a.certification)) return false;
    const ts = new Date(a.ts);
    return ts >= weekStart && ts < weekEnd;
  });

  // "intro"-Einträge (Vokabel nur als Karteikarte kennengelernt, siehe learn.js persistIntro)
  // zählen auf newVocab, aber nicht auf Trefferquote/Antwortenzahl — sie wurden nicht aktiv beantwortet.
  const newVocab = inWeek.filter((a) => a.contentType === "vocabulary" && a.isNew).length;
  const scored = inWeek.filter((a) => !a.isIntro);
  const reviews = scored.filter((a) => !a.isNew).length;
  const readingExercises = inWeek.filter((a) => a.contentType === "readingPassage").length;
  const correct = scored.filter((a) => a.correct).length;
  const accuracy = scored.length > 0 ? Math.round((correct / scored.length) * 100) : null;

  return { newVocab, reviews, readingExercises, totalAnswers: scored.length, accuracy };
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
 * @param {Array} activity Einträge aus db.getAllActivity()
 * @param {string} startDateISO
 * @param {number} weekNumber
 * @param {string[]} certifications
 * @param {Map} domainMap examDomainId -> Domain-Objekt (aus state.domainMap())
 */
export function getWeekWeakDomains(activity, startDateISO, weekNumber, certifications, domainMap) {
  const { weekStart, weekEnd } = weekDateRange(startDateISO, weekNumber);
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId || a.isIntro) continue; // reines Vokabel-Kennenlernen zählt nicht als Trefferquote
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
  if (weekTarget && weekTarget.reviewsTarget > 0 && weekActual.reviews < weekTarget.reviewsTarget * 0.5) {
    return `Du liegst bei den Wiederholungen unter der Hälfte des Wochenziels (${weekActual.reviews}/${weekTarget.reviewsTarget}). Plane in den nächsten Tagen gezielt zusätzliche Wiederholungssessions ein, damit sich der Rückstand nicht vergrößert.`;
  }
  if (weakDomains.length > 0 && weakDomains[0].accuracy < 60) {
    const d = weakDomains[0];
    return `Größter Schwachpunkt diese Woche: "${d.name}" mit ${d.accuracy}% Trefferquote (${d.total} Antworten). Nutze den Prüfungsmodus mit Filter auf diese Domain für gezieltes Üben.`;
  }
  if (weekActual.accuracy != null && weekActual.accuracy < 70) {
    return `Deine Trefferquote liegt diese Woche bei ${weekActual.accuracy}% — etwas unter dem Zielbereich. Wiederhole zuerst als falsch markierte Inhalte, bevor du viele neue Begriffe aufnimmst.`;
  }
  return `Guter Stand${weekActual.accuracy != null ? ` bei ${weekActual.accuracy}% Trefferquote` : ""}: Wochenziel weitgehend erreicht. Bleib beim aktuellen Rhythmus.`;
}
