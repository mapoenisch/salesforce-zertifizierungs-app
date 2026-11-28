// views/dashboard.js — Startseite mit Tagesaktion, Wochen-Soll/Ist, Fortschritt und Schwachpunkten.

import { state, allLearnableContent, domainMap, pathCertifications, refreshLearningData } from "../state.js";
import { dueForPath, summarizeActivity } from "../learning.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { el, clear, progressBar, pathLabel, certLabel, termHelp, todayISO } from "../utils.js";

import { readDailyDraft } from "../sessionDrafts.js";

const PLAN_DAYS = 84;

export async function render(container, ctx) {
  clear(container);

  await refreshLearningData();
  if (ctx.signal.aborted) return;
  const certification = state.settings.certificationPath;
  const certifications = pathCertifications(certification);
  const resumable = Boolean(readDailyDraft(todayISO(), certification, allLearnableContent()));
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

  const all = allLearnableContent().filter((i) => certifications.includes(i.content.certification));
  const pathActivity = state.activity.filter((a) => certifications.includes(a.certification));
  const { answered } = summarizeActivity(pathActivity, state.progressByContentId);
  const scoredCount = pathActivity.filter((a) => typeof a.correct === "boolean").length;
  const coldStart = scoredCount === 0;

  container.appendChild(el("h1", { text: "Dashboard" }));
  const bannerRow = el("div", { class: "dashboard-banner-row" }, [
    el("p", { class: "active-path-banner", text: `Aktiver Lernpfad: ${pathLabel(certification)}` }),
    el("p", { class: `plan-status-pill plan-status-${planStatus.status}`, text: planStatus.label })
  ]);
  container.appendChild(bannerRow);

  if (coldStart) {
    container.appendChild(renderColdStartHero(ctx, { weekNumber, weekTarget, certification, resumable }));
    container.appendChild(renderEmptyState());
  } else {
    container.appendChild(renderHero(ctx, {
      weekNumber, weekTarget, dueCount, pathActivity, scoredCount, resumable
    }));
    container.appendChild(renderCockpit({ certifications, all, answered, dueCount }));
  }

  container.appendChild(footerLinks(ctx));
}

// ---------- Tagesfokus ----------

function planDayLabel(startDate) {
  if (!startDate) return "";
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return "";
  const day = Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
  if (day < 1) return "";
  return `Tag ${Math.min(day, PLAN_DAYS)} von ${PLAN_DAYS}`;
}

function renderHero(ctx, { weekNumber, weekTarget, dueCount, pathActivity, scoredCount, resumable }) {
  const heroCard = el("section", { class: "card dashboard-hero-card", attrs: { "aria-label": "Tagesfokus" } });
  const dayLabel = planDayLabel(state.settings.startDate);
  const weekLine = weekTarget
    ? `Woche ${weekNumber} von 12 · ${weekTarget.focus}`
    : `Woche ${weekNumber} · Nach dem Lernplan`;
  heroCard.appendChild(el("p", {
    class: "dashboard-eyebrow",
    text: dayLabel ? `${weekLine} · ${dayLabel}` : weekLine
  }));
  heroCard.appendChild(el("h2", { text: "Tagesfokus" }));

  const heroBtn = el("button", {
    class: "primary-btn hero-btn",
    text: resumable ? "Einheit fortsetzen" : `Heutige Einheit starten${dueCount > 0 ? ` (${dueCount} fällig)` : ""}`,
    attrs: { type: "button" }
  });
  heroBtn.addEventListener("click", () => ctx.navigate("#/learn"));
  heroCard.appendChild(heroBtn);

  const { weak, hasPracticedDomains } = computeWeakDomains(pathActivity, domainMap());
  if (weak.length > 0) {
    const topWeak = weak[0];
    const focusBtn = el("button", {
      class: "weak-link-btn dashboard-focus-chip",
      text: `Schwachpunkt-Fokus: ${topWeak.name} (${topWeak.accuracy}% aus ${topWeak.total} Antworten) → Gezielt üben`,
      attrs: { type: "button" }
    });
    focusBtn.addEventListener("click", () => ctx.navigate(`#/quiz?domain=${encodeURIComponent(topWeak.id)}`));
    heroCard.appendChild(focusBtn);
  } else if (hasPracticedDomains) {
    heroCard.appendChild(el("p", {
      class: "item-hint dashboard-unlock-hint",
      text: "Alle bisher geübten Domains liegen bei mindestens 80% Trefferquote."
    }));
  } else {
    const remaining = Math.max(0, 3 - scoredCount);
    heroCard.appendChild(el("p", {
      class: "item-hint dashboard-unlock-hint",
      text: remaining > 0
        ? `Noch ${remaining} beantwortete Frage${remaining === 1 ? "" : "n"} bis zur Schwachpunktanalyse.`
        : "Beantworte mindestens 3 Fragen in einer Domain für die Schwachpunktanalyse."
    }));
  }
  return heroCard;
}

function renderColdStartHero(ctx, { weekNumber, weekTarget, certification, resumable }) {
  const card = el("section", {
    class: "card dashboard-hero-card dashboard-hero-cold",
    attrs: { "aria-label": "Erste Einheit" }
  });
  const weekLine = weekTarget
    ? `Woche ${weekNumber} von 12 · ${weekTarget.focus}`
    : `Woche ${weekNumber}`;
  card.appendChild(el("p", { class: "dashboard-eyebrow", text: weekLine }));
  card.appendChild(el("h2", { text: resumable ? "Deine Einheit ist pausiert" : "Starte mit einer kurzen Runde" }));
  card.appendChild(el("p", {
    class: "dashboard-hero-lead",
    text: resumable ? "Mach bei der zuletzt geöffneten Aufgabe weiter." : "Vokabeln, Definitionen und eine Lesefrage – etwa 20 Minuten. Danach siehst du hier deinen Fortschritt."
  }));

  const startBtn = el("button", {
    class: "primary-btn hero-btn",
    text: resumable ? "Einheit fortsetzen" : "Heutige Einheit starten",
    attrs: { type: "button" }
  });
  startBtn.addEventListener("click", () => ctx.navigate("#/learn"));
  card.appendChild(startBtn);

  card.appendChild(el("p", {
    class: "item-hint",
    text: `Pfad: ${certLabel(certification)} · Du kannst den Pfad in den Einstellungen wechseln.`
  }));
  return card;
}

function renderEmptyState() {
  const card = el("section", { class: "card dashboard-empty-state" }, [
    el("h2", { text: "Das erscheint nach deiner ersten Einheit" }),
    el("ul", { class: "dashboard-empty-list" }, [
      el("li", { text: "Fällige Wiederholungen aus deinem Lernplan" }),
      el("li", { text: "Abdeckung nach Zertifizierung und Englisch-Niveau" }),
      el("li", { text: "Schwachpunkte, sobald du ein paar Fragen beantwortet hast" })
    ])
  ]);
  return card;
}

// ---------- Status-Reihe ----------

function renderCockpit({ certifications, all, answered, dueCount }) {
  const statusGrid = el("div", { class: "cockpit-grid" });

  const dueCard = el("div", { class: "card" });
  dueCard.appendChild(el("div", { class: "card-head-row" }, [
    el("h2", { text: "Fällige Wiederholungen" }),
    termHelp("SM-2", "SM-2 ist ein einfacher Abstandsalgorithmus: richtig beantwortete Inhalte werden in größeren Abständen wiederholt, falsche Antworten kommen schnell zurück.")
  ]));
  if (dueCount > 0) {
    dueCard.append(
      el("p", { class: "big-number", text: String(dueCount) }),
      el("p", { class: "big-number-label", text: dueCount === 1 ? "Inhalt fällig heute" : "Inhalte fällig heute" }),
      el("p", { class: "item-hint", text: "Diese Inhalte stehen nach SM-2 (Abstandslernen) zur Wiederholung an." })
    );
  } else {
    dueCard.append(
      el("p", { class: "due-clear", text: "Nichts fällig" }),
      el("p", { class: "item-hint", text: "Gute Gelegenheit für neue Inhalte aus deinem Lernplan." })
    );
  }
  statusGrid.appendChild(dueCard);

  const overviewCard = el("div", { class: "card" });
  overviewCard.appendChild(el("div", { class: "card-head-row" }, [
    el("h2", { text: "Abdeckung nach Pfad & CEFR" }),
    termHelp("CEFR", "CEFR B1 ist Grundlagenenglisch, CEFR B2 sind komplexere Szenariofragen. Die Stufen beziehen sich auf das Leseverständnis, nicht auf dein Salesforce-Wissen.")
  ]));
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
  return statusGrid;
}

// ---------- Fußzeile ----------

function footerLinks(ctx) {
  return el("div", { class: "dashboard-footer-links" }, [
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
  const practiced = [...byDomain.entries()]
    .filter(([, v]) => v.total >= 3)
    .map(([domainId, v]) => ({
      id: domainId,
      name: domains.get(domainId)?.name || domainId,
      accuracy: Math.round((v.correct / v.total) * 100),
      total: v.total
    }));
  const weak = practiced
    .filter((d) => d.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy);
  return { weak, hasPracticedDomains: practiced.length > 0 };
}
