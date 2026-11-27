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
  const planStatus = weeklyPlan.computePlanStatus(
    state.content.weeklyPlan,
    state.activity,
    state.settings.startDate,
    certification,
    certifications
  );

  container.appendChild(el("h1", { text: "Dashboard" }));
  const bannerRow = el("div", { class: "dashboard-banner-row" }, [
    el("p", { class: "active-path-banner", text: `Aktiver Lernpfad: ${pathLabel(certification)}` }),
    el("p", { class: `plan-status-pill plan-status-${planStatus.status}`, text: planStatus.label })
  ]);
  container.appendChild(bannerRow);

  // Tagesfokus-Hero-Karte (kompakt, über dem Fold)
  const heroCard = el("section", { class: "card dashboard-hero-card", attrs: { "aria-label": "Tagesfokus" } });
  const weekSummary = weekTarget
    ? `Woche ${weekNumber} von 12 · ${weekTarget.focus}`
    : `Woche ${weekNumber} · Nach dem Lernplan`;
  heroCard.appendChild(el("h2", { text: "Tagesfokus" }));
  heroCard.appendChild(el("p", { class: "item-hint", text: weekSummary }));

  const heroBtn = el("button", {
    class: "primary-btn hero-btn",
    text: `Heutige Einheit starten${dueCount > 0 ? ` (${dueCount} fällig)` : ""}`,
    attrs: { type: "button" }
  });
  heroBtn.addEventListener("click", () => ctx.navigate("#/learn"));
  heroCard.appendChild(heroBtn);

  const all = allLearnableContent().filter((i) => certifications.includes(i.content.certification));
  const pathActivity = state.activity.filter((a) => certifications.includes(a.certification));
  const { answered } = summarizeActivity(pathActivity, state.progressByContentId);
  const scoredCount = pathActivity.filter((a) => typeof a.correct === "boolean").length;
  const domains = domainMap();
  const weakDomains = computeWeakDomains(pathActivity, domains);

  if (weakDomains.length > 0) {
    const topWeak = weakDomains[0];
    const focusBtn = el("button", {
      class: "weak-link-btn dashboard-focus-chip",
      text: `Schwachpunkt-Fokus: ${topWeak.name} (${topWeak.accuracy}% aus ${topWeak.total} Antworten) → Gezielt üben`,
      attrs: { type: "button" }
    });
    focusBtn.addEventListener("click", () => ctx.navigate(`#/quiz?domain=${encodeURIComponent(topWeak.id)}`));
    heroCard.appendChild(focusBtn);
  } else {
    const remaining = Math.max(0, 3 - scoredCount);
    heroCard.appendChild(el("p", {
      class: "item-hint dashboard-unlock-hint",
      text: remaining > 0
        ? `Noch ${remaining} beantwortete Frage${remaining === 1 ? "" : "n"} bis zur Schwachpunktanalyse.`
        : "Beantworte mindestens 3 Fragen in einer Domain für die Schwachpunktanalyse."
    }));
  }
  container.appendChild(heroCard);

  // Kompakte Status-Reihe: Fällige Wiederholungen + Abdeckung nach Pfad & CEFR
  const statusGrid = el("div", { class: "cockpit-grid" });

  statusGrid.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Fällige Wiederholungen" }),
    el("p", { class: "big-number", text: String(dueCount) }),
    el("p", { class: "item-hint", text: dueCount > 0 ? "Diese Inhalte stehen heute nach SM-2 (Abstandslernen) zur Wiederholung an." : "Aktuell nichts fällig — gute Gelegenheit für neue Inhalte." })
  ]));

  const overviewCard = el("div", { class: "card" }, [
    el("h2", { text: "Abdeckung nach Pfad & CEFR" }),
    el("p", { class: "item-hint", text: "CEFR B1 = Grundlagenenglisch · CEFR B2 = komplexere Szenariofragen." })
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
    const bar = progressBar(pct, `CEFR ${cefr} — ${attempted}/${items.length} bearbeitet`);
    if (cefr === "B2") bar.classList.add("progress-bar-b2");
    overviewCard.appendChild(bar);
  });
  statusGrid.appendChild(overviewCard);
  container.appendChild(statusGrid);

  const footerLinks = el("div", { class: "dashboard-footer-links" }, [
    el("a", {
      class: "secondary-btn compact-link-btn",
      text: "Wochenplan, Schwachpunkte & Exam-Domains ansehen",
      attrs: { href: "#/progress" },
      on: {
        click: (ev) => {
          if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          ctx.navigate("#/progress");
        }
      }
    }),
    el("a", {
      class: "secondary-btn compact-link-btn",
      text: "Leitfaden: Prüfungsenglisch",
      attrs: { href: "#/exam-english" },
      on: {
        click: (ev) => {
          if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          ctx.navigate("#/exam-english");
        }
      }
    })
  ]);
  container.appendChild(footerLinks);
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
