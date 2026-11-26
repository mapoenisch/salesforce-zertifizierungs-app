// views/learn.js — Tägliche Lerneinheit: fällige Wiederholungen, neue Vokabeln, Matching, Reading, Abschluss.

import { state, allLearnableContent, domainWeightMap, pathCertifications, refreshLearningData } from "../state.js";
import { dueForPath, saveAnswers } from "../learning.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { renderItem } from "../itemRenderer.js";
import { el, clear, shuffle, focusContent } from "../utils.js";

const SESSION_LIMITS = { due: 10, vocabulary: 5, definition: 3, readingPassage: 2 };
const ESTIMATED_MINUTES = { vocabulary: 1, definition: 2, readingPassage: 4, question: 3 };

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Heutige Einheit" }));

  await refreshLearningData();
  const firstQueue = buildQueue();
  if (firstQueue.length === 0) {
    container.appendChild(el("p", { text: "Für heute gibt es nichts Neues oder Fälliges. Schau später wieder vorbei, oder übe frei im Prüfungsmodus." }));
    return;
  }

  const progressLabel = el("p", { class: "session-progress" });
  container.appendChild(el("p", { class: "item-hint", text:
    `Tagesziel: ${state.settings.dailySessionMinutesTarget} Min.`
  }));
  container.appendChild(progressLabel);
  const itemHost = el("div");
  container.appendChild(itemHost);

  const cumulative = { total: 0, scored: 0, correct: 0, introduced: 0, byType: {}, rounds: 0 };

  async function runRound(queue) {
    cumulative.rounds += 1;
    let index = 0;

    async function step() {
      if (index >= queue.length) {
        await finishRound();
        return;
      }
      progressLabel.textContent = `Runde ${cumulative.rounds} · ${index + 1} von ${queue.length}`;
      const current = queue[index];
      renderItem(itemHost, current, {
        onAnswered: async (result) => {
          try {
            await saveAnswers([{ item: current, result, mode: "daily" }]);
          } catch {
            showSaveError(itemHost, () => ctx.navigate("#/learn"));
            return;
          }
          if (current.introMode) {
            cumulative.introduced += 1;
          } else {
            cumulative.scored += 1;
            cumulative.correct += result.correct ? 1 : 0;
          }
          cumulative.total += 1;
          cumulative.byType[current.contentType] = (cumulative.byType[current.contentType] || 0) + 1;
          index += 1;
          await step();
        }
      });
    }

    await step();
  }

  async function finishRound() {
    const nextQueue = buildQueue();
    clear(itemHost);
    progressLabel.textContent = "";
    renderRoundEnd(container, itemHost, cumulative, nextQueue, ctx, () => runRound(nextQueue));
  }

  await runRound(firstQueue);
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

  const candidates = dueForPath(certifications).slice(0, SESSION_LIMITS.due);
  for (const type of ["vocabulary", "definition", "readingPassage"]) {
    candidates.push(...fresh.filter((item) => item.contentType === type)
      .slice(0, SESSION_LIMITS[type])
      .map((item) => ({ ...item, introMode: type === "vocabulary" })));
  }

  let minutes = 0;
  return candidates.filter((item) => {
    if (minutes + ESTIMATED_MINUTES[item.contentType] > state.settings.dailySessionMinutesTarget) return false;
    minutes += ESTIMATED_MINUTES[item.contentType];
    return true;
  });
}

function showSaveError(host, restart) {
  clear(host);
  const error = el("p", { attrs: { role: "alert" }, text: "Der Lernstand konnte nicht gespeichert werden." });
  host.appendChild(error);
  focusContent(error);
  host.appendChild(el("button", {
    class: "primary-btn", text: "Einheit neu laden", attrs: { type: "button" }, on: { click: restart }
  }));
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
  const card = el("div", { class: "card" }, [
    el("h2", { text: `Runde ${cumulative.rounds} geschafft` }),
    el("p", { class: "big-number", text: `${cumulative.correct} / ${cumulative.scored}` }),
    el("p", { text: `Trefferquote bisher heute: ${pct}%` }),
    el("p", { class: "item-hint", text: `Noch ${nextQueue.length} weitere fällige oder neue Inhalte verfügbar, falls du heute noch Zeit hast.` })
  ]);
  itemHost.appendChild(card);

  const btnRow = el("div", { class: "filter-row" });
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
  const summaryCard = el("div", { class: "card" }, [
    el("p", { class: "big-number", text: `${summary.correct} / ${summary.scored}` }),
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
      el("p", { text: task.instructions })
    ]));
  }

  const backBtn = el("button", { class: "primary-btn", text: "Zurück zum Dashboard", attrs: { type: "button" } });
  backBtn.addEventListener("click", () => ctx.navigate("#/dashboard"));
  container.appendChild(backBtn);
  focusContent(container.querySelector("h1"), { page: true });
}
