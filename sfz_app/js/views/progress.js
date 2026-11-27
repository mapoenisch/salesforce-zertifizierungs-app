// views/progress.js — Detaillierte Fortschrittsübersicht.

import { state, allLearnableContent, domainMap, pathCertifications, refreshLearningData } from "../state.js";
import { dueForPath, summarizeActivity } from "../learning.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { el, clear, progressBar, formatDuration, todayISO, pathLabel, termHelp } from "../utils.js";

export async function render(container, ctx) {
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

  // 3-Tab-Struktur für schnelle Orientierung ohne Endlos-Scrollen
  const tabDefs = [
    { id: "overview", label: "Übersicht" },
    { id: "domains", label: "Exam-Domains" },
    { id: "formats", label: "Formate & Meilenstein" }
  ];
  const tabBar = el("div", { class: "studio-tabs", attrs: { role: "tablist", "aria-label": "Fortschrittsbereiche" } });
  const panels = new Map();
  const tabButtons = [];

  function activateTab(activeId, focusTab = false) {
    tabButtons.forEach((btn) => {
      const selected = btn.dataset.tabId === activeId;
      btn.setAttribute("aria-selected", String(selected));
      btn.tabIndex = selected ? 0 : -1;
      btn.classList.toggle("studio-tab-active", selected);
      if (selected && focusTab) btn.focus();
    });
    for (const [id, panel] of panels) {
      panel.hidden = id !== activeId;
    }
  }

  tabDefs.forEach((def, idx) => {
    const btn = el("button", {
      class: "studio-tab" + (idx === 0 ? " studio-tab-active" : ""),
      text: def.label,
      attrs: {
        type: "button",
        role: "tab",
        id: `progress-tab-${def.id}`,
        "aria-selected": String(idx === 0),
        "aria-controls": `progress-panel-${def.id}`,
        tabindex: idx === 0 ? "0" : "-1"
      }
    });
    btn.dataset.tabId = def.id;
    btn.addEventListener("click", () => activateTab(def.id));
    btn.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      ev.preventDefault();
      const nextIdx = ev.key === "ArrowRight" ? (idx + 1) % tabDefs.length : (idx - 1 + tabDefs.length) % tabDefs.length;
      activateTab(tabDefs[nextIdx].id, true);
    });
    tabButtons.push(btn);
    tabBar.appendChild(btn);

    const panel = el("div", {
      class: "studio-tabpanel",
      attrs: { role: "tabpanel", id: `progress-panel-${def.id}`, "aria-labelledby": `progress-tab-${def.id}`, ...(idx !== 0 && { hidden: "" }) }
    });
    panels.set(def.id, panel);
  });

  container.appendChild(tabBar);
  const overviewPanel = panels.get("overview");
  const domainsPanel = panels.get("domains");
  const formatsPanel = panels.get("formats");
  container.append(overviewPanel, domainsPanel, formatsPanel);

  const confidenceText = (() => {
    if (avgConfidence == null) return "–";
    const threeStep = (avgConfidence + 1) / 2;
    const label = threeStep >= 2.5 ? "Sicher" : threeStep >= 1.6 ? "Mittel" : "Unsicher";
    return `${threeStep.toFixed(1)} / 3 (${label})`;
  })();

  const statsGrid = el("div", { class: "cockpit-grid" });
  statsGrid.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Gesamtstatistik" }),
    el("p", { text: `Trefferquote: ${accuracy != null ? accuracy + "%" : "–"} (${correct}/${total} Antworten)` }),
    el("p", { text: `Durchschnittliche Sicherheit: ${confidenceText}` }),
    el("p", { text: `Durchschnittliche Bearbeitungszeit: ${formatDuration(avgTime)}` }),
    el("p", { class: "item-hint", text: `Vokabeln als Karteikarte kennengelernt: ${introducedCount}` })
  ]));

  // Fällige/überfällige Wiederholungen
  const today = todayISO();
  const due = dueForPath(certifications, today);
  const overdue = due.filter(({ progress }) => progress.nextReviewDate && progress.nextReviewDate < today).length;
  statsGrid.appendChild(el("div", { class: "card" }, [
    el("h2", { text: "Wiederholungen" }),
    el("p", { class: "big-number", text: String(due.length) }),
    el("p", { text: `Fällig heute oder überfällig: ${due.length}` }),
    el("p", { class: "item-hint", text: `Davon überfällig: ${overdue}` })
  ]));
  overviewPanel.appendChild(statsGrid);

  // Zielerreichung Woche + Wochenrückblick
  const weekNumber = weeklyPlan.getCurrentWeekNumber(state.settings.startDate);
  const weekTarget = weeklyPlan.getWeekTarget(state.content.weeklyPlan, weekNumber, certification);
  const weekActual = weeklyPlan.computeWeekActual(activity, state.settings.startDate, weekNumber, certifications);
  const monthNumber = weeklyPlan.getMonthForWeek(weekNumber);
  const milestone = weeklyPlan.getMonthMilestone(state.content.weeklyPlan, monthNumber, certification);
  const weekWeakDomains = weeklyPlan.getWeekWeakDomains(activity, state.settings.startDate, weekNumber, certifications, domains);
  const reviewRatePercent =
    weekTarget && weekTarget.reviewsTarget > 0 ? Math.round((weekActual.reviews / weekTarget.reviewsTarget) * 100) : null;
  const recommendation = weeklyPlan.buildWeeklyRecommendation({ weekActual, weekTarget, weakDomains: weekWeakDomains });

  const weekGoalCard = el("div", { class: "card" });
  weekGoalCard.appendChild(el("h2", { text: `Woche ${weekNumber} — Wochenziel (Soll vs. Ist)` }));
  for (const [label, actual, target] of weeklyPlan.GOAL_METRICS) {
    if (weekTarget) {
      if (weekTarget[target] === 0 && weekActual[actual] === 0) {
        weekGoalCard.appendChild(el("p", { class: "item-hint soll-empty", text: `${label}: Kein Soll in dieser Woche` }));
      } else {
        weekGoalCard.appendChild(progressBar(targetPercent(weekActual[actual], weekTarget[target]), `${label} · ${weekActual[actual]}/${weekTarget[target]}`));
      }
    } else {
      weekGoalCard.appendChild(el("p", { text: `${label} · ${weekActual[actual]} diese Woche` }));
    }
  }
  overviewPanel.appendChild(weekGoalCard);

  const weekReviewCard = el("div", { class: "card" });
  weekReviewCard.appendChild(el("h2", { text: `Woche ${weekNumber} — Rückblick & Empfehlung` }));
  weekReviewCard.appendChild(el("p", {
    text: `Trefferquote diese Woche: ${weekActual.accuracy != null ? weekActual.accuracy + "%" : "– (noch keine gewerteten Antworten)"} (${weekActual.totalAnswers} Antworten)`
  }));
  weekReviewCard.appendChild(el("p", {
    text:
      reviewRatePercent != null
        ? `Wiederholungsquote: ${reviewRatePercent}% des Wochenziels erreicht (${weekActual.reviews}/${weekTarget.reviewsTarget} Wiederholungen)`
        : `Wiederholungen diese Woche · ${weekActual.reviews} (kein Soll)`
  }));
  if (weekWeakDomains.length > 0) {
    weekReviewCard.appendChild(el("p", { text: "Schwächste Themen diese Woche:" }));
    const list = el("ul");
    weekWeakDomains.slice(0, 3).forEach((w) => list.appendChild(el("li", { text: `${w.name}: ${w.accuracy}% (${w.total} Antworten)` })));
    weekReviewCard.appendChild(list);
  }
  weekReviewCard.appendChild(el("p", { class: "milestone" }, [el("strong", { text: "Empfehlung: " }), document.createTextNode(recommendation)]));
  weekReviewCard.appendChild(el("p", { class: "item-hint", text: "Die Lernreifeanzeige ist ein Indikator für deinen Lernfortschritt, keine Garantie für das Bestehen der Prüfung." }));
  overviewPanel.appendChild(weekReviewCard);

  // Tab 2: Domain-Abdeckung + Schwachpunktanalyse
  const all = allLearnableContent().filter((i) => certifications.includes(i.content.certification));
  const { answered, consolidated } = summarizeActivity(activity, state.progressByContentId);
  const domainCard = el("div", { class: "card" });
  domainCard.appendChild(el("div", { class: "card-head-row" }, [
    el("h2", { text: "Domain-Abdeckung (nach offizieller Gewichtung)" }),
    termHelp("Exam-Domain", "Exam-Domains sind die offiziellen Themenbereiche der Prüfung. Die Prozentzahl zeigt, wie stark der Bereich im Exam Guide gewichtet ist.")
  ]));
  const sortedDomains = [...domains.values()]
    .filter((d) => certifications.includes(d.certification))
    .sort((a, b) => b.weightPercent - a.weightPercent)
    .map((domain) => ({ domain, items: all.filter((i) => i.content.examDomainId === domain.id) }))
    .filter(({ items }) => items.length > 0);

  const renderCoverageBar = ({ domain, items }) => {
    const mastered = items.filter((i) => consolidated.has(i.content.id)).length;
    const pct = (mastered / items.length) * 100;
    return progressBar(pct, `${domain.name} (${domain.weightPercent}%) — gefestigt: ${mastered}/${items.length}`);
  };

  sortedDomains.slice(0, 4).forEach((entry) => domainCard.appendChild(renderCoverageBar(entry)));
  if (sortedDomains.length > 4) {
    const more = el("details", { class: "domain-more" }, [
      el("summary", { text: `Weitere ${sortedDomains.length - 4} Exam-Domains anzeigen` })
    ]);
    sortedDomains.slice(4).forEach((entry) => more.appendChild(renderCoverageBar(entry)));
    domainCard.appendChild(more);
  }
  domainCard.appendChild(el("p", {
    class: "item-hint",
    text: "Als gefestigt zählt eine Aufgabe nach richtigen Antworten an zwei verschiedenen Kalendertagen seit dem letzten Fehler."
  }));
  domainsPanel.appendChild(domainCard);

  // Schwachpunktanalyse (direkt anklickbar zum gezielten Üben)
  const weakCard = el("div", { class: "card" });
  weakCard.appendChild(el("h2", { text: "Schwachpunktanalyse" }));
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId) continue;
    if (typeof a.correct !== "boolean") continue;
    if (!byDomain.has(a.examDomainId)) byDomain.set(a.examDomainId, { correct: 0, total: 0 });
    const e = byDomain.get(a.examDomainId);
    e.total += 1;
    if (a.correct) e.correct += 1;
  }
  const weak = [...byDomain.entries()]
    .filter(([, v]) => v.total >= 3)
    .map(([id, v]) => ({ id, name: domains.get(id)?.name || id, accuracy: Math.round((v.correct / v.total) * 100), total: v.total }))
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weak.length === 0) {
    weakCard.appendChild(el("p", { class: "item-hint", text: "Noch nicht genug Daten für eine Schwachpunktanalyse (mindestens 3 Antworten pro Domain nötig)." }));
  } else {
    const list = el("ul", { class: "weak-links-list" });
    weak.forEach((w) => {
      const btn = el("button", {
        class: "weak-link-btn",
        text: `${w.name}: ${w.accuracy}% (${w.total} Antworten) → Gezielt üben`,
        attrs: { type: "button" }
      });
      btn.addEventListener("click", () => ctx.navigate(`#/quiz?domain=${encodeURIComponent(w.id)}`));
      list.appendChild(el("li", {}, [btn]));
    });
    weakCard.appendChild(list);
  }
  domainsPanel.appendChild(weakCard);

  // Tab 3: Formate & Monatsmeilenstein
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
  formatsPanel.appendChild(formats);

  const monthly = weeklyPlan.computeMilestoneProgress(
    state.content.weeklyPlan, activity, state.settings.startDate, monthNumber, certification, certifications
  );
  const milestoneCard = el("div", { class: "card" });
  milestoneCard.appendChild(el("h2", { text: `Monat ${monthNumber} · kumulierter Stand zum Meilenstein` }));
  if (milestone) milestoneCard.appendChild(el("p", { class: "milestone", text: milestone }));
  for (const [label, actual, target] of weeklyPlan.GOAL_METRICS) {
    if (monthly.target[target] === 0 && monthly.actual[actual] === 0) {
      milestoneCard.appendChild(el("p", { class: "item-hint soll-empty", text: `${label}: Kein Soll in diesem Monat` }));
    } else {
      milestoneCard.appendChild(progressBar(targetPercent(monthly.actual[actual], monthly.target[target]), `${label} · ${monthly.actual[actual]}/${monthly.target[target]}`));
    }
  }
  formatsPanel.appendChild(milestoneCard);
}


function averageOf(activity, key) {
  const values = activity.map((event) => event[key]).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function targetPercent(actual, target) {
  return target > 0 ? actual / target * 100 : actual > 0 ? 100 : 0;
}
