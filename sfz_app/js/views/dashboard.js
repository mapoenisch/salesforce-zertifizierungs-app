// views/dashboard.js — Startseite mit Tagesaktion, Wochen-Soll/Ist, Fortschritt und Schwachpunkten.

import { state, allLearnableContent, domainMap, pathCertifications } from "../state.js";
import * as db from "../db.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { el, clear, progressBar, todayISO, pathLabel } from "../utils.js";

export async function render(container, ctx) {
  clear(container);

  const certification = state.settings.certificationPath;
  const certifications = pathCertifications(certification);
  const today = todayISO();
  const dueCountAll = await db.getDueProgress(today);
  const dueCount = dueCountAll.filter((d) => certifications.includes(d.certification)).length;

  const weekNumber = weeklyPlan.getCurrentWeekNumber(state.settings.startDate);
  const weekTarget = weeklyPlan.getWeekTarget(state.content.weeklyPlan, weekNumber, certification);
  const weekActual = weeklyPlan.computeWeekActual(state.activity, state.settings.startDate, weekNumber, certifications);
  const monthNumber = weeklyPlan.getMonthForWeek(weekNumber);
  const milestone = weeklyPlan.getMonthMilestone(state.content.weeklyPlan, monthNumber, certification);

  container.appendChild(el("h1", { text: "Dashboard" }));
  container.appendChild(el("p", { class: "active-path-banner", text: `Aktiver Lernpfad: ${pathLabel(certification)}` }));

  // Primäraktion
  const heroBtn = el("button", { class: "primary-btn hero-btn", text: `Heutige Einheit starten${dueCount > 0 ? ` (${dueCount} fällig)` : ""}`, attrs: { type: "button" } });
  heroBtn.addEventListener("click", () => ctx.navigate("#/learn"));
  container.appendChild(heroBtn);

  // Fällige Wiederholungen
  container.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Fällige Wiederholungen" }),
    el("p", { class: "big-number", text: String(dueCount) }),
    el("p", { class: "item-hint", text: dueCount > 0 ? "Diese Inhalte warten auf Wiederholung." : "Aktuell nichts fällig — gute Gelegenheit für neue Inhalte." })
  ]));

  // Wochen-Soll vs Ist
  const weekCard = el("div", { class: "card" });
  weekCard.appendChild(el("h2", { text: `Woche ${weekNumber} von 12` }));
  if (weekTarget) {
    weekCard.appendChild(el("p", { class: "item-hint", text: weekTarget.focus }));
    weekCard.appendChild(soll_ist_row("Neue Vokabeln", weekActual.newVocab, weekTarget.newVocabTarget));
    weekCard.appendChild(soll_ist_row("Wiederholungen", weekActual.reviews, weekTarget.reviewsTarget));
    weekCard.appendChild(soll_ist_row("Reading-Übungen", weekActual.readingExercises, weekTarget.readingExercisesTarget));
  }
  if (milestone) {
    weekCard.appendChild(el("p", { class: "milestone" }, [el("strong", { text: `Monat ${monthNumber}-Meilenstein: ` }), document.createTextNode(milestone)]));
  }
  container.appendChild(weekCard);

  // Nur Inhalte des aktiven Lernpfads berücksichtigen (bei administrator-full: Foundations + Administrator zusammen)
  const all = allLearnableContent().filter((i) => certifications.includes(i.content.certification));
  const pathActivity = state.activity.filter((a) => certifications.includes(a.certification));

  // Fortschritt je Domain (nur Domains des aktiven Lernpfads)
  const domains = domainMap();
  const domainCard = el("div", { class: "card" });
  domainCard.appendChild(el("h2", { text: "Fortschritt je Exam-Domain" }));
  [...domains.values()]
    .filter((d) => certifications.includes(d.certification))
    .sort((a, b) => b.weightPercent - a.weightPercent)
    .forEach((domain) => {
      const items = all.filter((i) => i.content.examDomainId === domain.id);
      if (!items.length) return;
      const attempted = items.filter((i) => state.progressByContentId.get(i.content.id)?.repetitions > 0).length;
      const pct = (attempted / items.length) * 100;
      domainCard.appendChild(progressBar(pct, `${domain.name} (${domain.weightPercent}%) — ${attempted}/${items.length} bearbeitet`));
    });
  container.appendChild(domainCard);

  // Fortschritt B1 vs B2
  const cefrCard = el("div", { class: "card" });
  cefrCard.appendChild(el("h2", { text: "Fortschritt B1 vs. B2" }));
  ["B1", "B2"].forEach((cefr) => {
    const items = all.filter((i) => i.content.cefr === cefr);
    const attempted = items.filter((i) => state.progressByContentId.get(i.content.id)?.repetitions > 0).length;
    const pct = items.length ? (attempted / items.length) * 100 : 0;
    cefrCard.appendChild(progressBar(pct, `${cefr} — ${attempted}/${items.length} bearbeitet`));
  });
  container.appendChild(cefrCard);

  // Top-3 Schwachpunkte
  const weakCard = el("div", { class: "card" });
  weakCard.appendChild(el("h2", { text: "Top-3 Schwachpunkte" }));
  const weakDomains = computeWeakDomains(pathActivity, domains);
  if (weakDomains.length === 0) {
    weakCard.appendChild(el("p", { class: "item-hint", text: "Noch nicht genug Daten — starte deine erste Einheit." }));
  } else {
    const list = el("ul");
    weakDomains.slice(0, 3).forEach((w) => {
      list.appendChild(el("li", { text: `${w.name}: ${w.accuracy}% Trefferquote (${w.total} Antworten)` }));
    });
    weakCard.appendChild(list);
  }
  container.appendChild(weakCard);
}

function soll_ist_row(label, actual, target) {
  const pct = target > 0 ? (actual / target) * 100 : actual > 0 ? 100 : 0;
  return progressBar(pct, `${label}: ${actual} / ${target} (Soll)`);
}

function computeWeakDomains(activity, domains) {
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId) continue;
    if (a.isIntro) continue; // reines Kennenlernen einer Vokabel zählt nicht als Trefferquote
    if (!byDomain.has(a.examDomainId)) byDomain.set(a.examDomainId, { correct: 0, total: 0 });
    const entry = byDomain.get(a.examDomainId);
    entry.total += 1;
    if (a.correct) entry.correct += 1;
  }
  return [...byDomain.entries()]
    .filter(([, v]) => v.total >= 3)
    .map(([domainId, v]) => ({
      name: domains.get(domainId)?.name || domainId,
      accuracy: Math.round((v.correct / v.total) * 100),
      total: v.total
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}
