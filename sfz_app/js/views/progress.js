// views/progress.js — Detaillierte Fortschrittsübersicht.

import { state, allLearnableContent, domainMap, pathCertifications } from "../state.js";
import * as db from "../db.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { el, clear, progressBar, formatDuration, todayISO, pathLabel } from "../utils.js";

export async function render(container) {
  clear(container);
  const certification = state.settings.certificationPath;
  const certifications = pathCertifications(certification);
  const domains = domainMap();
  container.appendChild(el("h1", { text: "Fortschritt" }));
  container.appendChild(el("p", { class: "active-path-banner", text: `Aktiver Lernpfad: ${pathLabel(certification)}` }));

  const activity = state.activity.filter((a) => certifications.includes(a.certification));
  // Reines Kennenlernen einer neuen Vokabel (Karteikarte, keine Wertung) fließt nicht in
  // Trefferquote/Sicherheit/Bearbeitungszeit ein — dafür gibt es unten den separaten Zähler.
  const scoredActivity = activity.filter((a) => !a.isIntro);
  const introducedCount = activity.filter((a) => a.isIntro).length;
  const total = scoredActivity.length;
  const correct = scoredActivity.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : null;
  const avgConfidence = total ? (scoredActivity.reduce((s, a) => s + (a.confidence || 0), 0) / total).toFixed(1) : "–";
  const avgTime = total ? scoredActivity.reduce((s, a) => s + (a.responseTimeMs || 0), 0) / total : null;

  container.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Gesamtstatistik" }),
    el("p", { text: `Trefferquote: ${accuracy != null ? accuracy + "%" : "–"} (${correct}/${total} Antworten)` }),
    el("p", { text: `Durchschnittliche Sicherheit: ${avgConfidence} / 5` }),
    el("p", { text: `Durchschnittliche Bearbeitungszeit: ${formatDuration(avgTime)}` }),
    el("p", { class: "item-hint", text: `Neue Vokabeln kennengelernt (Karteikarte, noch nicht abgefragt): ${introducedCount}` })
  ]));

  // Fällige/überfällige Wiederholungen
  const today = todayISO();
  const due = (await db.getDueProgress(today)).filter((d) => certifications.includes(d.certification));
  const overdue = due.filter((d) => d.nextReviewDate < today).length;
  container.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Wiederholungen" }),
    el("p", { text: `Fällig heute oder überfällig: ${due.length}` }),
    el("p", { text: `Davon überfällig: ${overdue}` })
  ]));

  // Zielerreichung Woche/Monat
  const weekNumber = weeklyPlan.getCurrentWeekNumber(state.settings.startDate);
  const weekTarget = weeklyPlan.getWeekTarget(state.content.weeklyPlan, weekNumber, certification);
  const weekActual = weeklyPlan.computeWeekActual(activity, state.settings.startDate, weekNumber, certifications);
  const monthNumber = weeklyPlan.getMonthForWeek(weekNumber);
  const milestone = weeklyPlan.getMonthMilestone(state.content.weeklyPlan, monthNumber, certification);

  const goalCard = el("div", { class: "card" });
  goalCard.appendChild(el("h2", { text: `Zielerreichung — Woche ${weekNumber}, Monat ${monthNumber}` }));
  if (weekTarget) {
    goalCard.appendChild(progressBar((weekActual.newVocab / Math.max(1, weekTarget.newVocabTarget)) * 100, `Neue Vokabeln: ${weekActual.newVocab}/${weekTarget.newVocabTarget}`));
    goalCard.appendChild(progressBar((weekActual.reviews / Math.max(1, weekTarget.reviewsTarget)) * 100, `Wiederholungen: ${weekActual.reviews}/${weekTarget.reviewsTarget}`));
    goalCard.appendChild(progressBar((weekActual.readingExercises / Math.max(1, weekTarget.readingExercisesTarget)) * 100, `Reading: ${weekActual.readingExercises}/${weekTarget.readingExercisesTarget}`));
  }
  if (milestone) goalCard.appendChild(el("p", { class: "milestone" }, [el("strong", { text: "Meilenstein: " }), document.createTextNode(milestone)]));
  goalCard.appendChild(el("p", { class: "item-hint", text: "Die Lernreifeanzeige ist ein Indikator für deinen Lernfortschritt, keine Garantie für das Bestehen der Prüfung." }));
  container.appendChild(goalCard);

  // Wochenrückblick: Trefferquote, Wiederholungsquote, schwächste Themen dieser Woche, konkrete Empfehlung.
  const weekWeakDomains = weeklyPlan.getWeekWeakDomains(activity, state.settings.startDate, weekNumber, certifications, domains);
  const reviewRatePercent =
    weekTarget && weekTarget.reviewsTarget > 0 ? Math.round((weekActual.reviews / weekTarget.reviewsTarget) * 100) : null;
  const recommendation = weeklyPlan.buildWeeklyRecommendation({ weekActual, weekTarget, weakDomains: weekWeakDomains });

  const reviewCard = el("div", { class: "card" });
  reviewCard.appendChild(el("h2", { text: `Wochenrückblick — Woche ${weekNumber}` }));
  reviewCard.appendChild(el("p", {
    text: `Trefferquote diese Woche: ${weekActual.accuracy != null ? weekActual.accuracy + "%" : "– (noch keine gewerteten Antworten)"} (${weekActual.totalAnswers} Antworten)`
  }));
  reviewCard.appendChild(el("p", {
    text:
      reviewRatePercent != null
        ? `Wiederholungsquote: ${reviewRatePercent}% des Wochenziels erreicht (${weekActual.reviews}/${weekTarget.reviewsTarget} Wiederholungen)`
        : "Wiederholungsquote: für diese Woche ist kein Wiederholungs-Wochenziel hinterlegt."
  }));
  if (weekWeakDomains.length > 0) {
    reviewCard.appendChild(el("p", { text: "Schwächste Themen diese Woche:" }));
    const list = el("ul");
    weekWeakDomains.slice(0, 3).forEach((w) => list.appendChild(el("li", { text: `${w.name}: ${w.accuracy}% (${w.total} Antworten)` })));
    reviewCard.appendChild(list);
  } else {
    reviewCard.appendChild(el("p", { class: "item-hint", text: "Noch nicht genug Antworten diese Woche für eine Schwachpunktanalyse (mindestens 2 pro Domain nötig)." }));
  }
  reviewCard.appendChild(el("p", { class: "milestone" }, [el("strong", { text: "Empfehlung: " }), document.createTextNode(recommendation)]));
  container.appendChild(reviewCard);

  // Domain-Abdeckung nach Gewichtung (nur Domains des aktiven Lernpfads)
  const all = allLearnableContent().filter((i) => certifications.includes(i.content.certification));
  const domainCard = el("div", { class: "card" });
  domainCard.appendChild(el("h2", { text: "Domain-Abdeckung (nach offizieller Gewichtung)" }));
  [...domains.values()]
    .filter((d) => certifications.includes(d.certification))
    .sort((a, b) => b.weightPercent - a.weightPercent)
    .forEach((domain) => {
      const items = all.filter((i) => i.content.examDomainId === domain.id);
      if (!items.length) return;
      const mastered = items.filter((i) => {
        const p = state.progressByContentId.get(i.content.id);
        return p && p.repetitions >= 2 && p.lastResult === "correct";
      }).length;
      const pct = (mastered / items.length) * 100;
      domainCard.appendChild(progressBar(pct, `${domain.name} (${domain.weightPercent}%) — gefestigt: ${mastered}/${items.length}`));
    });
  container.appendChild(domainCard);

  // Schwachpunktanalyse
  const weakCard = el("div", { class: "card" });
  weakCard.appendChild(el("h2", { text: "Schwachpunktanalyse" }));
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId) continue;
    if (a.isIntro) continue; // reines Kennenlernen einer Vokabel zählt nicht als Trefferquote
    if (!byDomain.has(a.examDomainId)) byDomain.set(a.examDomainId, { correct: 0, total: 0 });
    const e = byDomain.get(a.examDomainId);
    e.total += 1;
    if (a.correct) e.correct += 1;
  }
  const weak = [...byDomain.entries()]
    .filter(([, v]) => v.total >= 3)
    .map(([id, v]) => ({ name: domains.get(id)?.name || id, accuracy: Math.round((v.correct / v.total) * 100), total: v.total }))
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weak.length === 0) {
    weakCard.appendChild(el("p", { class: "item-hint", text: "Noch nicht genug Daten für eine Schwachpunktanalyse." }));
  } else {
    const list = el("ul");
    weak.forEach((w) => list.appendChild(el("li", { text: `${w.name}: ${w.accuracy}% (${w.total} Antworten)` })));
    weakCard.appendChild(list);
  }
  container.appendChild(weakCard);
}
