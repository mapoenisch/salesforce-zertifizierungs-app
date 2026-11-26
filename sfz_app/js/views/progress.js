// views/progress.js — Detaillierte Fortschrittsübersicht.

import { state, allLearnableContent, domainMap, pathCertifications, refreshLearningData } from "../state.js";
import { dueForPath, summarizeActivity } from "../learning.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { el, clear, progressBar, formatDuration, todayISO, pathLabel } from "../utils.js";

export async function render(container) {
  clear(container);
  await refreshLearningData();
  const certification = state.settings.certificationPath;
  const certifications = pathCertifications(certification);
  const domains = domainMap();
  container.appendChild(el("h1", { text: "Fortschritt" }));
  container.appendChild(el("p", { class: "active-path-banner", text: `Aktiver Lernpfad: ${pathLabel(certification)}` }));

  const activity = state.activity.filter((a) => certifications.includes(a.certification));
  const scoredActivity = activity.filter((a) => typeof a.correct === "boolean");
  const introducedCount = activity.filter((a) => a.isIntro).length;
  const total = scoredActivity.length;
  const correct = scoredActivity.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : null;
  // Frühere Mini-Prüfungen speicherten den festen Wert 3 ohne Zeitmessung oder Modus.
  const selfReported = scoredActivity.filter((a) => !(a.mode == null && a.confidence === 3 &&
    a.responseTimeMs == null && ["question", "readingPassage"].includes(a.contentType)));
  const avgConfidence = averageOf(selfReported, "confidence");
  const avgTime = averageOf(scoredActivity, "responseTimeMs");

  container.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Gesamtstatistik" }),
    el("p", { text: `Trefferquote: ${accuracy != null ? accuracy + "%" : "–"} (${correct}/${total} Antworten)` }),
    el("p", { text: `Durchschnittliche Sicherheit: ${avgConfidence == null ? "–" : avgConfidence.toFixed(1) + " / 5"}` }),
    el("p", { text: `Durchschnittliche Bearbeitungszeit: ${formatDuration(avgTime)}` }),
    el("p", { class: "item-hint", text: `Vokabeln als Karteikarte kennengelernt: ${introducedCount}` })
  ]));

  // Fällige/überfällige Wiederholungen
  const today = todayISO();
  const due = dueForPath(certifications, today);
  const overdue = due.filter(({ progress }) => progress.nextReviewDate && progress.nextReviewDate < today).length;
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
  for (const [label, actual, target] of weeklyPlan.GOAL_METRICS) {
    if (weekTarget) {
      goalCard.appendChild(progressBar(targetPercent(weekActual[actual], weekTarget[target]), `${label} · ${weekActual[actual]}/${weekTarget[target]}`));
    } else {
      goalCard.appendChild(el("p", { text: `${label} · ${weekActual[actual]} diese Woche` }));
    }
  }
  const monthly = weeklyPlan.computeMilestoneProgress(
    state.content.weeklyPlan, activity, state.settings.startDate, monthNumber, certification, certifications
  );
  goalCard.appendChild(el("h3", { text: `Monat ${monthNumber} · kumulierter Stand zum Meilenstein` }));
  if (milestone) goalCard.appendChild(el("p", { class: "milestone", text: milestone }));
  for (const [label, actual, target] of weeklyPlan.GOAL_METRICS) {
    goalCard.appendChild(progressBar(targetPercent(monthly.actual[actual], monthly.target[target]), `${label} · ${monthly.actual[actual]}/${monthly.target[target]}`));
  }
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
        : `Wiederholungen diese Woche · ${weekActual.reviews} (kein Soll)`
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
  const { answered, consolidated } = summarizeActivity(activity, state.progressByContentId);
  const domainCard = el("div", { class: "card" });
  domainCard.appendChild(el("h2", { text: "Domain-Abdeckung (nach offizieller Gewichtung)" }));
  [...domains.values()]
    .filter((d) => certifications.includes(d.certification))
    .sort((a, b) => b.weightPercent - a.weightPercent)
    .forEach((domain) => {
      const items = all.filter((i) => i.content.examDomainId === domain.id);
      if (!items.length) return;
      const mastered = items.filter((i) => consolidated.has(i.content.id)).length;
      const pct = (mastered / items.length) * 100;
      domainCard.appendChild(progressBar(pct, `${domain.name} (${domain.weightPercent}%) — gefestigt: ${mastered}/${items.length}`));
    });
  domainCard.appendChild(el("p", {
    class: "item-hint",
    text: "Als gefestigt zählt eine Aufgabe nach richtigen Antworten an zwei verschiedenen Kalendertagen seit dem letzten Fehler."
  }));
  container.appendChild(domainCard);

  const formats = el("div", { class: "card" }, [el("h2", { text: "Fortschritt je Übungsformat" })]);
  for (const [title, types] of [
    ["Vokabel im Kontext", ["vocabulary"]],
    ["Definitions-Matching", ["definition"]],
    ["Szenario und Reading", ["readingPassage", "question"]]
  ]) {
    const items = all.filter((item) => types.includes(item.contentType));
    const done = items.filter((item) => answered.has(item.content.id)).length;
    formats.appendChild(progressBar(done / Math.max(1, items.length) * 100, `${title} · ${done}/${items.length} bearbeitet`));
  }
  container.appendChild(formats);

  // Schwachpunktanalyse
  const weakCard = el("div", { class: "card" });
  weakCard.appendChild(el("h2", { text: "Schwachpunktanalyse" }));
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId) continue;
    if (typeof a.correct !== "boolean") continue; // reines Kennenlernen einer Vokabel zählt nicht als Trefferquote
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


function averageOf(activity, key) {
  const values = activity.map((event) => event[key]).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function targetPercent(actual, target) {
  return target > 0 ? actual / target * 100 : actual > 0 ? 100 : 0;
}
