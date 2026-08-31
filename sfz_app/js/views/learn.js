// views/learn.js — Tägliche Lerneinheit: fällige Wiederholungen, neue Vokabeln, Matching, Reading, Abschluss.

import { state, refreshProgress, refreshActivity, domainWeightMap, pathCertifications } from "../state.js";
import * as db from "../db.js";
import * as sm2 from "../sm2.js";
import * as weeklyPlan from "../weeklyPlan.js";
import { renderItem } from "../itemRenderer.js";
import { el, clear, todayISO, shuffle } from "../utils.js";

const SESSION_LIMITS = { due: 10, newVocab: 5, newDefinitions: 3, reading: 2 };

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Heutige Einheit" }));

  const firstQueue = await buildQueue();
  if (firstQueue.length === 0) {
    container.appendChild(el("p", { text: "Für heute gibt es nichts Neues oder Fälliges. Schau später wieder vorbei, oder übe frei im Prüfungsmodus." }));
    return;
  }

  const progressLabel = el("p", { class: "session-progress" });
  const roundLabel = el("p", { class: "item-hint" });
  container.appendChild(roundLabel);
  container.appendChild(progressLabel);
  const itemHost = el("div");
  container.appendChild(itemHost);

  // Läuft über mehrere Runden hinweg, damit Nutzer:innen mit mehr Zeit an einem Tag freiwillig
  // weiterlernen können (siehe Rückmeldung: eine feste Tagesobergrenze war zu starr). Jede Runde
  // respektiert weiterhin SESSION_LIMITS, damit ein einzelner Block überschaubar bleibt (20-40 Min.);
  // "Weiterlernen" lädt einfach die nächste Runde über denselben buildQueue()-Aufruf nach, der dank
  // aktualisiertem state.progressByContentId automatisch die nächsten fälligen/neuen Inhalte liefert.
  const cumulative = { total: 0, scored: 0, correct: 0, introduced: 0, byType: {}, rounds: 0 };

  async function runRound(queue) {
    cumulative.rounds += 1;
    let index = 0;

    async function step() {
      if (index >= queue.length) {
        await finishRound();
        return;
      }
      roundLabel.textContent = `Runde ${cumulative.rounds}`;
      progressLabel.textContent = `Element ${index + 1} von ${queue.length}`;
      const current = queue[index];
      renderItem(itemHost, current, {
        onAnswered: async (result) => {
          await persistAnswer(current, result);
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
    const nextQueue = await buildQueue();
    clear(itemHost);
    progressLabel.textContent = "";
    roundLabel.textContent = "";
    renderRoundEnd(container, itemHost, cumulative, nextQueue, ctx, () => runRound(nextQueue));
  }

  await runRound(firstQueue);
}

async function buildQueue() {
  const today = todayISO();
  const certification = state.settings.certificationPath;
  const certifications = pathCertifications(certification);
  const all = allByType().filter((i) => certifications.includes(i.content.certification));
  const weights = domainWeightMap();

  // Fällige Wiederholungen: aus dem gesamten Pfad (bei administrator-full also Foundations-Reviews
  // während der Administrator-Phase — Wissen, das schon eingeführt wurde, bleibt im SM-2-Rhythmus).
  const dueRaw = (await db.getDueProgress(today)).filter((r) => certifications.includes(r.certification));
  const dueIds = new Set(dueRaw.map((r) => r.contentId));
  // "intro"-Vokabeln (nur einmal als Karteikarte gezeigt, siehe unten) zählen ebenfalls als fällig,
  // sobald ihr Intervall erreicht ist — sie bekommen dann ihre erste echte Abfrage.
  const dueItems = all.filter((i) => {
    if (!dueIds.has(i.content.id)) return false;
    const p = state.progressByContentId.get(i.content.id);
    return (p?.repetitions ?? 0) > 0 || p?.flag === "intro";
  });
  const prioritizedDue = sm2
    .prioritize(dueItems.map((i) => ({ content: i.content, progress: state.progressByContentId.get(i.content.id) })), weights, today)
    .slice(0, SESSION_LIMITS.due)
    .map((x) => all.find((i) => i.content.id === x.content.id));

  // Neue Inhalte: nur aus dem Content-Pool der aktuellen Wochenplan-Phase.
  // Bei "foundations"/"administrator" ist das derselbe Pool wie der gesamte Pfad; bei "administrator-full"
  // steuert das "phase"-Feld im Wochenplan, ob Woche 1-5 neue Foundations- oder Woche 6-12 neue
  // Administrator-Inhalte einführt (siehe data/weekly-plan.json).
  const weekNumber = weeklyPlan.getCurrentWeekNumber(state.settings.startDate);
  const weekTarget = weeklyPlan.getWeekTarget(state.content.weeklyPlan, weekNumber, certification);
  const newPoolCert = weekTarget?.phase || certifications[0];

  const unattempted = (type) =>
    all.filter((i) => i.contentType === type && i.content.certification === newPoolCert && !state.progressByContentId.get(i.content.id));

  // Brandneue Vokabeln werden zuerst als Karteikarte eingeführt (introMode), nicht sofort abgefragt —
  // siehe itemRenderer.renderVocabularyIntro. Die aktive Abfrage folgt beim nächsten fälligen Kontakt
  // über den regulären SM-2-Zyklus (siehe dueItems oben und sm2.introProgress).
  const newVocab = sortByDomainWeight(unattempted("vocabulary"), weights)
    .slice(0, SESSION_LIMITS.newVocab)
    .map((i) => ({ ...i, introMode: true }));
  const newDefinitions = sortByDomainWeight(unattempted("definition"), weights).slice(0, SESSION_LIMITS.newDefinitions);
  const newReading = sortByDomainWeight(unattempted("readingPassage"), weights).slice(0, SESSION_LIMITS.reading);

  return [...prioritizedDue, ...newVocab, ...newDefinitions, ...newReading];
}

function sortByDomainWeight(items, weights) {
  return [...items].sort((a, b) => (weights.get(b.content.examDomainId) || 0) - (weights.get(a.content.examDomainId) || 0));
}

function allByType() {
  const { vocabulary, definitions, readingPassages } = state.content;
  return [
    ...vocabulary.map((c) => ({ content: c, contentType: "vocabulary" })),
    ...definitions.map((c) => ({ content: c, contentType: "definition" })),
    ...readingPassages.map((c) => ({ content: c, contentType: "readingPassage" }))
  ];
}

async function persistAnswer(item, result) {
  if (item.introMode) return persistIntro(item);

  const existing = state.progressByContentId.get(item.content.id) || sm2.emptyProgress(item.content, item.contentType);
  const isNew = !state.progressByContentId.get(item.content.id);
  const update = sm2.computeNextProgress(existing, result);
  const merged = { ...existing, ...update };
  await db.putProgress(merged);
  await db.logActivity({
    contentId: item.content.id,
    contentType: item.contentType,
    certification: item.content.certification,
    examDomainId: item.content.examDomainId,
    isNew,
    correct: result.correct,
    confidence: result.confidence,
    responseTimeMs: result.responseTimeMs
  });
  await refreshProgress();
  await refreshActivity();
}

/**
 * Speichert das erstmalige Kennenlernen einer Vokabel (Karteikarte, keine Wertung).
 * isIntro:true markiert den Aktivitätseintrag so, dass er nicht in Trefferquote/Sicherheit/
 * Bearbeitungszeit-Statistiken einfließt (siehe progress.js, dashboard.js, weeklyPlan.js),
 * aber trotzdem als "neue Vokabel" auf das Wochen-Soll zählt.
 */
async function persistIntro(item) {
  const record = sm2.introProgress(item.content, item.contentType);
  await db.putProgress(record);
  await db.logActivity({
    contentId: item.content.id,
    contentType: item.contentType,
    certification: item.content.certification,
    examDomainId: item.content.examDomainId,
    isNew: true,
    isIntro: true,
    correct: null,
    confidence: null,
    responseTimeMs: null
  });
  await refreshProgress();
  await refreshActivity();
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
}
