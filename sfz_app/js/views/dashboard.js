// views/dashboard.js — Startseite mit Tagesaktion, Wochen-Soll/Ist, Fortschritt und Schwachpunkten.

import { state, allLearnableContent, domainMap, pathCertifications, refreshLearningData } from "../state.js";
import { dueForPath, summarizeActivity } from "../learning.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { el, clear, progressBar, pathLabel, certLabel } from "../utils.js";

export async function render(container, ctx) {
  clear(container);

  await refreshLearningData();
  const certification = state.settings.certificationPath;
  const certifications = pathCertifications(certification);
  const dueCount = dueForPath(certifications).length;

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

  // Cockpit-KPI-Grid: Fällige Wiederholungen + Aktuelle Woche
  const topGrid = el("div", { class: "cockpit-grid" });

  // Fällige Wiederholungen
  topGrid.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Fällige Wiederholungen" }),
    el("p", { class: "big-number", text: String(dueCount) }),
    el("p", { class: "item-hint", text: dueCount > 0 ? "Diese Inhalte warten auf Wiederholung." : "Aktuell nichts fällig — gute Gelegenheit für neue Inhalte." })
  ]));

  // Wochen-Soll vs Ist
  const weekCard = el("div", { class: "card" });
  weekCard.appendChild(el("h2", { text: weekTarget ? `Woche ${weekNumber} von 12` : `Woche ${weekNumber} · Nach dem Lernplan` }));
  if (weekTarget) {
    weekCard.appendChild(el("p", { class: "item-hint", text: weekTarget.focus }));
    for (const [label, actual, target] of weeklyPlan.GOAL_METRICS) {
      weekCard.appendChild(soll_ist_row(label, weekActual[actual], weekTarget[target]));
    }
  } else {
    for (const [label, actual] of weeklyPlan.GOAL_METRICS) {
      weekCard.appendChild(el("p", { text: `${label} · ${weekActual[actual]} diese Woche` }));
    }
  }
  topGrid.appendChild(weekCard);
  container.appendChild(topGrid);

  // Zweite Cockpit-Reihe: Monat + Zertifizierung/CEFR
  const midGrid = el("div", { class: "cockpit-grid" });
  const monthly = weeklyPlan.computeMilestoneProgress(
    state.content.weeklyPlan, state.activity, state.settings.startDate, monthNumber, certification, certifications
  );
  const monthCard = el("div", { class: "card" }, [
    el("h2", { text: `Monat ${monthNumber} · Meilenstein` }),
    milestone && el("p", { class: "milestone", text: milestone })
  ]);
  for (const [label, actual, target] of weeklyPlan.GOAL_METRICS) {
    monthCard.appendChild(soll_ist_row(label, monthly.actual[actual], monthly.target[target]));
  }
  midGrid.appendChild(monthCard);

  // Nur Inhalte des aktiven Lernpfads berücksichtigen (bei administrator-full: Foundations + Administrator zusammen)
  const all = allLearnableContent().filter((i) => certifications.includes(i.content.certification));
  const pathActivity = state.activity.filter((a) => certifications.includes(a.certification));
  const { answered } = summarizeActivity(pathActivity, state.progressByContentId);

  const overviewCard = el("div", { class: "card" }, [
    el("h2", { text: "Abdeckung nach Pfad & CEFR" })
  ]);
  for (const cert of certifications) {
    const items = all.filter((item) => item.content.certification === cert);
    const count = items.filter((item) => answered.has(item.content.id)).length;
    overviewCard.appendChild(progressBar(count / Math.max(1, items.length) * 100, `${certLabel(cert)} · ${count}/${items.length} bearbeitet`));
  }
  ["B1", "B2"].forEach((cefr) => {
    const items = all.filter((i) => i.content.cefr === cefr);
    const attempted = items.filter((i) => answered.has(i.content.id)).length;
    const pct = items.length ? (attempted / items.length) * 100 : 0;
    overviewCard.appendChild(progressBar(pct, `CEFR ${cefr} — ${attempted}/${items.length} bearbeitet`));
  });
  midGrid.appendChild(overviewCard);
  container.appendChild(midGrid);

  // Fortschritt je Domain (nur Domains des aktiven Lernpfads, Top 4 sichtbar + Rest klappbar)
  const domains = domainMap();
  const domainCard = el("div", { class: "card" });
  domainCard.appendChild(el("h2", { text: "Fortschritt je Exam-Domain" }));
  const sortedDomains = [...domains.values()]
    .filter((d) => certifications.includes(d.certification))
    .sort((a, b) => b.weightPercent - a.weightPercent)
    .map((domain) => {
      const items = all.filter((i) => i.content.examDomainId === domain.id);
      return { domain, items };
    })
    .filter(({ items }) => items.length > 0);

  const renderDomainBar = ({ domain, items }) => {
    const attempted = items.filter((i) => answered.has(i.content.id)).length;
    const pct = (attempted / items.length) * 100;
    return progressBar(pct, `${domain.name} (${domain.weightPercent}%) — ${attempted}/${items.length} bearbeitet`);
  };

  sortedDomains.slice(0, 4).forEach((entry) => domainCard.appendChild(renderDomainBar(entry)));
  if (sortedDomains.length > 4) {
    const more = el("details", { class: "domain-more" }, [
      el("summary", { text: `Weitere ${sortedDomains.length - 4} Exam-Domains anzeigen` })
    ]);
    sortedDomains.slice(4).forEach((entry) => more.appendChild(renderDomainBar(entry)));
    domainCard.appendChild(more);
  }
  container.appendChild(domainCard);

  // Top-3 Schwachpunkte (als direkte Übungslinks)
  const weakCard = el("div", { class: "card" });
  weakCard.appendChild(el("h2", { text: "Top-3 Schwachpunkte" }));
  const weakDomains = computeWeakDomains(pathActivity, domains);
  if (weakDomains.length === 0) {
    weakCard.appendChild(el("p", { class: "item-hint", text: "Noch nicht genug Daten — starte deine erste Einheit." }));
  } else {
    const list = el("ul", { class: "weak-links-list" });
    weakDomains.slice(0, 3).forEach((w) => {
      const btn = el("button", {
        class: "weak-link-btn",
        text: `${w.name}: ${w.accuracy}% Trefferquote (${w.total} Antworten) → Gezielt üben`,
        attrs: { type: "button" }
      });
      btn.addEventListener("click", () => ctx.navigate(`#/quiz?domain=${encodeURIComponent(w.id)}`));
      list.appendChild(el("li", {}, [btn]));
    });
    weakCard.appendChild(list);
  }
  container.appendChild(weakCard);
}

function soll_ist_row(label, actual, target) {
  if (target === 0 && actual === 0) {
    return el("p", { class: "item-hint soll-empty", text: `${label}: Kein Soll in dieser Woche` });
  }
  const pct = target > 0 ? (actual / target) * 100 : actual > 0 ? 100 : 0;
  return progressBar(pct, `${label}: ${actual} / ${target} (Soll)`);
}

function computeWeakDomains(activity, domains) {
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId) continue;
    if (typeof a.correct !== "boolean") continue; // reines Kennenlernen einer Vokabel zählt nicht als Trefferquote
    if (!byDomain.has(a.examDomainId)) byDomain.set(a.examDomainId, { correct: 0, total: 0 });
    const entry = byDomain.get(a.examDomainId);
    entry.total += 1;
    if (a.correct) entry.correct += 1;
  }
  return [...byDomain.entries()]
    .filter(([, v]) => v.total >= 3)
    .map(([domainId, v]) => ({
      id: domainId,
      name: domains.get(domainId)?.name || domainId,
      accuracy: Math.round((v.correct / v.total) * 100),
      total: v.total
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}
