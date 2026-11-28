// views/learn.js — Tägliche Lerneinheit: fällige Wiederholungen, neue Vokabeln, Matching, Reading, Abschluss.

import { state, allLearnableContent, domainWeightMap, pathCertifications, refreshLearningData } from "../state.js";
import { dueForPath, markForReview, saveAnswers } from "../learning.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { renderItem } from "../itemRenderer.js";
import { openExamEnglishModal } from "./examEnglish.js";
import { el, clear, shuffle, focusContent, createSessionChrome, todayISO } from "../utils.js";
import { DAILY_DRAFT, newSessionId, readDailyDraft, readDraft, writeDraft } from "../sessionDrafts.js";

const SESSION_LIMITS = { due: 10, vocabulary: 5, definition: 3, readingPassage: 2 };
const ESTIMATED_MINUTES = { vocabulary: 1, definition: 2, readingPassage: 4, question: 3 };

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Heutige Einheit" }));

  await refreshLearningData();
  if (ctx.signal.aborted) return;
  const today = todayISO();
  const activePath = state.settings.certificationPath;
  const resumed = readDailyDraft(today, activePath, allLearnableContent());
  const firstQueue = resumed ? resumed.queue : buildQueue();
  if (firstQueue.length === 0) {
    writeDraft(DAILY_DRAFT, null);
    container.appendChild(el("p", { text: "Für heute gibt es nichts Neues oder Fälliges. Schau später wieder vorbei, oder übe frei im Prüfungsmodus." }));
    return;
  }

  const chrome = createSessionChrome({
    onOpenRef: (btn) => openExamEnglishModal(btn, "Zurück zur Lerneinheit")
  });
  container.appendChild(chrome.statusBar);
  container.appendChild(chrome.sessionTrack);

  const itemHost = el("div");
  container.appendChild(itemHost);

  const toolbar = el("div", { class: "quiz-toolbar session-toolbar-bottom" });
  const laterBtn = el("button", {
    class: "secondary-btn",
    text: "Später wiederholen markieren",
    attrs: { type: "button", "aria-pressed": "false" }
  });
  const pauseBtn = el("button", { class: "secondary-btn", text: "Pausieren", attrs: { type: "button" } });
  const stopBtn = el("button", { class: "secondary-btn", text: "Einheit beenden", attrs: { type: "button" } });
  toolbar.append(laterBtn, pauseBtn, stopBtn);
  container.appendChild(toolbar);

  const status = el("p", { class: "quiz-setup-status", attrs: { role: "status" } });
  const draftStatus = el("p", { class: "quiz-setup-status", attrs: { role: "status" } });
  container.append(status, draftStatus);

  const activeSince = performance.now();
  const precedingMs = Number.isFinite(resumed?.elapsedMs)
    ? resumed.elapsedMs
    : Math.max(0, Date.now() - (resumed?.sessionStartedAt ?? Date.now()));
  const elapsedMs = () => precedingMs + performance.now() - activeSince;
  const cumulative = resumed?.cumulative ?? {
    total: 0, scored: 0, correct: 0, introduced: 0, byType: {}, rounds: resumed ? 1 : 0
  };
  let checkpoint;
  window.addEventListener("pagehide", () => checkpoint?.(), { signal: ctx.signal });

  async function runRound(queue, saved) {
    if (!saved) cumulative.rounds += 1;
    const sessionId = saved?.sessionId ?? newSessionId();
    const queueIds = queue.map((item) => ({ id: item.content.id, introMode: Boolean(item.introMode) }));
    toolbar.hidden = false;
    chrome.setHidden(false);
    let index = saved?.index ?? 0;
    let itemDraft = saved?.itemDraft ?? {};
    let storedIndex = null;

    function isOutdated() {
      if (storedIndex == null) return false;
      const latest = readDraft(DAILY_DRAFT);
      return latest?.sessionId !== sessionId || latest.index !== storedIndex;
    }

    function persistProgress() {
      if (isOutdated()) {
        draftStatus.textContent = "Der Entwurf ist in diesem Tab nicht mehr aktuell. Öffne die Lerneinheit erneut.";
        return false;
      }
      const stored = writeDraft(DAILY_DRAFT, {
        date: today, path: activePath, sessionId, queueIds, index, cumulative, elapsedMs: elapsedMs(), itemDraft
      });
      if (stored) storedIndex = index;
      draftStatus.textContent = stored ? "" : "Der Entwurf konnte nicht gespeichert werden. Lass die Einheit geöffnet, um weiterzulernen.";
      return stored;
    }

    checkpoint = persistProgress;
    pauseBtn.onclick = () => {
      if (persistProgress() || isOutdated()) ctx.navigate("#/dashboard");
    };
    stopBtn.onclick = () => {
      if (!isOutdated() && !writeDraft(DAILY_DRAFT, null)) {
        draftStatus.textContent = "Der Entwurf konnte nicht gelöscht werden.";
        return;
      }
      checkpoint = null;
      renderSummary(container, cumulative, ctx);
    };

    async function step() {
      if (index >= queue.length) {
        await finishRound();
        return;
      }
      persistProgress();
      const elapsedMin = Math.floor(elapsedMs() / 60000);
      chrome.update(
        `Runde ${cumulative.rounds} · ${index + 1} von ${queue.length} · ${elapsedMin}/${state.settings.dailySessionMinutesTarget} Min.`,
        ((index + 1) / queue.length) * 100
      );
      const current = queue[index];
      status.textContent = "";
      status.setAttribute("role", "status");
      const marked = state.progressByContentId.get(current.content.id)?.flag === "later";
      laterBtn.textContent = marked ? "✓ Vorgemerkt" : "Später wiederholen markieren";
      laterBtn.setAttribute("aria-pressed", String(marked));
      laterBtn.onclick = async () => {
        laterBtn.disabled = true;
        try {
          await markForReview(current);
          if (queue[index] === current) {
            laterBtn.textContent = "✓ Vorgemerkt";
            laterBtn.setAttribute("aria-pressed", "true");
            status.setAttribute("role", "status");
            status.textContent = "Für die Lerneinheit vorgemerkt.";
          }
        } catch {
          if (queue[index] === current) {
            status.setAttribute("role", "alert");
            status.textContent = "Die Markierung konnte nicht gespeichert werden.";
          }
        } finally {
          laterBtn.disabled = false;
        }
      };
      renderItem(itemHost, current, {
        draft: itemDraft,
        onDraftChange(draft) {
          itemDraft = draft;
          persistProgress();
        },
        onAnswered: async (result) => {
          if (isOutdated()) {
            showSaveError(itemHost, () => ctx.navigate("#/learn"), () => ctx.navigate("#/dashboard"),
              "Der Entwurf ist in diesem Tab nicht mehr aktuell.");
            return;
          }
          pauseBtn.disabled = true;
          stopBtn.disabled = true;
          const isIntroOnly = Boolean(current.introMode && !result.fastTracked);
          const effectiveItem = isIntroOnly ? current : { ...current, introMode: false };
          try {
            await saveAnswers([{ item: effectiveItem, result, mode: "daily" }], `daily:${sessionId}:${index}`);
          } catch {
            if (!ctx.signal.aborted) {
              showSaveError(itemHost, () => ctx.navigate("#/learn"), () => ctx.navigate("#/dashboard"));
            }
            return;
          } finally {
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
          }
          if (isIntroOnly) {
            cumulative.introduced += 1;
          } else {
            cumulative.scored += 1;
            cumulative.correct += result.correct ? 1 : 0;
          }
          cumulative.total += 1;
          cumulative.byType[current.contentType] = (cumulative.byType[current.contentType] || 0) + 1;
          index += 1;
          itemDraft = {};
          if (isOutdated()) {
            if (!ctx.signal.aborted) await ctx.navigate("#/learn");
            return;
          }
          if (ctx.signal.aborted) {
            if (index < queue.length) persistProgress();
            else writeDraft(DAILY_DRAFT, null);
            return;
          }
          await step();
          window.scrollTo(0, 0);
        }
      });
    }

    await step();
  }

  async function finishRound() {
    checkpoint = null;
    writeDraft(DAILY_DRAFT, null);
    draftStatus.textContent = "";
    const nextQueue = buildQueue();
    clear(itemHost);
    chrome.update("", 0);
    status.textContent = "";
    toolbar.hidden = true;
    chrome.setHidden(true);
    renderRoundEnd(container, itemHost, cumulative, nextQueue, ctx, () => runRound(nextQueue));
  }

  await runRound(firstQueue, resumed);
}

function buildQueue() {
  const path = state.settings.certificationPath;
  const certifications = pathCertifications(path);
  const weights = domainWeightMap();
  const weekNumber = weeklyPlan.getCurrentWeekNumber(state.settings.startDate);
  const target = weeklyPlan.getWeekTarget(state.content.weeklyPlan, weekNumber, path);
  const phaseCertifications = target ? [target.phase] : certifications;
  const focusDomains = target?.focusDomains || [];
  const fresh = allLearnableContent().filter(({ content }) =>
    phaseCertifications.includes(content.certification) && !state.progressByContentId.has(content.id));
  fresh.sort((a, b) => {
    const aFocused = focusDomains.includes(a.content.examDomainId);
    const bFocused = focusDomains.includes(b.content.examDomainId);
    return Number(bFocused) - Number(aFocused) ||
      (weights.get(b.content.examDomainId) || 0) - (weights.get(a.content.examDomainId) || 0);
  });

  const due = dueForPath(certifications).slice(0, SESSION_LIMITS.due);
  const freshItems = [];
  for (const type of ["vocabulary", "definition", "readingPassage"]) {
    freshItems.push(...fresh.filter((item) => item.contentType === type)
      .slice(0, SESSION_LIMITS[type])
      .map((item) => ({ ...item, introMode: type === "vocabulary" })));
  }

  return selectSessionItems(due, freshItems, state.settings.dailySessionMinutesTarget);
}

/**
 * Balanciert fällige Wiederholungen und neue Inhalte innerhalb des Tagesbudgets (Minuten),
 * damit lange Wiederholungs-Warteschlangen neue Inhalte in Runde 1 nicht vollständig verdrängen.
 */
export function selectSessionItems(dueCandidates, freshCandidates, minutesTarget) {
  const cost = (item) => ESTIMATED_MINUTES[item.contentType] || 1;
  const dueBudget = freshCandidates.length > 0 ? Math.floor(minutesTarget * 0.65) : minutesTarget;

  const selectedDue = [];
  const remainingDue = [];
  let minutes = 0;

  for (const item of dueCandidates) {
    const c = cost(item);
    const fitsDueBudget = minutes + c <= dueBudget || (selectedDue.length === 0 && minutes + c <= minutesTarget);
    if (fitsDueBudget && minutes + c <= minutesTarget) {
      selectedDue.push(item);
      minutes += c;
    } else {
      remainingDue.push(item);
    }
  }

  const selectedFresh = [];
  for (const item of freshCandidates) {
    const c = cost(item);
    if (minutes + c <= minutesTarget) {
      selectedFresh.push(item);
      minutes += c;
    }
  }

  for (const item of remainingDue) {
    const c = cost(item);
    if (minutes + c <= minutesTarget) {
      selectedDue.push(item);
      minutes += c;
    }
  }

  return [...selectedDue, ...selectedFresh];
}

function showSaveError(host, restart, goHome, message = "Die Antwort konnte nicht gespeichert werden.") {
  clear(host);
  const error = el("p", { attrs: { role: "alert" }, text: message });
  host.appendChild(error);
  focusContent(error);
  host.appendChild(el("div", { class: "quiz-actions" }, [
    el("button", { class: "primary-btn", text: "Einheit neu laden", attrs: { type: "button" }, on: { click: restart } }),
    el("button", { class: "secondary-btn", text: "Zurück zum Dashboard", attrs: { type: "button" }, on: { click: goHome } })
  ]));
}

/**
 * Zwischenbildschirm nach einer abgeschlossenen Runde. Gibt es noch weiteres fälliges oder neues
 * Material (nextQueue nicht leer), bietet dieser Bildschirm "Weiterlernen" für eine zusätzliche
 * Runde an — sonst wird direkt der Abschlussbildschirm (renderSummary) mit Praxisaufgabe gezeigt.
 * So lässt sich die Einheit an Tagen mit mehr Zeit beliebig fortsetzen, ohne die SM-2-Fälligkeiten
 * oder die Wochenplan-Logik zu verändern (siehe buildQueue in learn.js).
 */
function renderRoundEnd(container, itemHost, cumulative, nextQueue, ctx, onContinue) {
  if (nextQueue.length === 0) {
    renderSummary(container, cumulative, ctx);
    return;
  }

  clear(itemHost);
  const pct = cumulative.scored ? Math.round((cumulative.correct / cumulative.scored) * 100) : 0;
  const card = el("div", { class: "card studio-celebration-card" }, [
    el("h2", { text: `Runde ${cumulative.rounds} geschafft` }),
    el("p", {
      class: "big-number",
      text: `${cumulative.correct} / ${cumulative.scored}`,
      attrs: { "aria-label": `${cumulative.correct} von ${cumulative.scored} richtig` }
    }),
    el("p", { text: `Trefferquote bisher heute: ${pct}%` }),
    el("p", { class: "item-hint", text: `Noch ${nextQueue.length} weitere fällige oder neue Inhalte verfügbar, falls du heute noch Zeit hast.` })
  ]);
  itemHost.appendChild(card);

  const btnRow = el("div", { class: "quiz-actions" });
  const continueBtn = el("button", { class: "primary-btn", text: "Weiterlernen", attrs: { type: "button" } });
  continueBtn.addEventListener("click", () => onContinue());
  const stopBtn = el("button", { class: "secondary-btn", text: "Für heute beenden", attrs: { type: "button" } });
  stopBtn.addEventListener("click", () => renderSummary(container, cumulative, ctx));
  btnRow.appendChild(continueBtn);
  btnRow.appendChild(stopBtn);
  itemHost.appendChild(btnRow);
  focusContent(card.querySelector("h2"));
}

function renderSummary(container, summary, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Einheit abgeschlossen" }));
  const pct = summary.scored ? Math.round((summary.correct / summary.scored) * 100) : 0;
  const summaryCard = el("div", { class: "card studio-celebration-card" }, [
    el("p", {
      class: "big-number",
      text: `${summary.correct} / ${summary.scored}`,
      attrs: { "aria-label": `${summary.correct} von ${summary.scored} richtig` }
    }),
    el("p", { text: `Trefferquote: ${pct}%` })
  ]);
  if (summary.introduced > 0) {
    summaryCard.appendChild(el("p", { class: "item-hint", text: `Außerdem ${summary.introduced} neue Vokabel${summary.introduced === 1 ? "" : "n"} kennengelernt — die erste Abfrage dazu folgt in einer der nächsten Einheiten.` }));
  }
  container.appendChild(summaryCard);

  const practiceTasks = shuffle(
    state.content.practiceTasks.filter((t) => pathCertifications(state.settings.certificationPath).includes(t.certification))
  ).slice(0, 1);
  if (practiceTasks.length) {
    const task = practiceTasks[0];
    container.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "Optionale Praxisaufgabe" }),
      el("p", { class: "item-hint", text: `${task.title} (${task.estimatedMinutes} Min., ${task.environment})` }),
      el("p", { text: task.instructions }),
      el("p", { class: "item-hint" }, [
        document.createTextNode("Tipp: Öffne dazu deinen kostenlosen "),
        el("a", {
          text: "Trailhead Playground",
          attrs: { href: "https://trailhead.salesforce.com/", target: "_blank", rel: "noopener noreferrer" }
        }),
        document.createTextNode(" (nach Login unter Hands-On Orgs → Launch).")
      ])
    ]));
  }

  const backBtn = el("button", { class: "primary-btn", text: "Zurück zum Dashboard", attrs: { type: "button" } });
  backBtn.addEventListener("click", () => ctx.navigate("#/dashboard"));
  container.appendChild(backBtn);
  focusContent(container.querySelector("h1"), { page: true });
}
