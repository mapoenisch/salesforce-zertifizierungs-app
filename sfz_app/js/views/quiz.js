// views/quiz.js — Frage-/Prüfungsmodus: freies Üben (mit Filtern) und zeitlimitierte Mini-Prüfung.

import { state, refreshLearningData, domainMap, pathCertifications } from "../state.js";
import { markForReview, saveAnswers } from "../learning.js";
import { renderItem } from "../itemRenderer.js";
import { el, clear, shuffle, certLabel, disclaimerNote } from "../utils.js";

const MINI_EXAM_COUNT = 10;
const MINI_EXAM_SECONDS = 10 * 60;
let cancelExam;

export function leave() {
  cancelExam?.();
}

export async function render(container) {
  clear(container);
  container.appendChild(el("h1", { text: "Frage- und Prüfungsmodus" }));

  await refreshLearningData();
  const activePath = state.settings.certificationPath;
  const certifications = pathCertifications(activePath);
  // Bei Foundations-only/Administrator-only gibt es innerhalb des Pfads nur eine Zertifizierung —
  // der Zertifizierungsfilter wird dann gar nicht erst angezeigt (fest auf den Pfad gesetzt), um
  // Verwirrung zu vermeiden. Nur administrator-full bietet die Wahl zwischen Beide/Foundations/Administrator.
  const filters = { certification: activePath === "administrator-full" ? "both" : activePath, examDomainId: "all", cefr: "both", format: "all", difficulty: "all", errorStatus: "all" };
  const formHost = el("div", { class: "card" });
  container.appendChild(formHost);
  renderFilterForm(formHost, filters, activePath, certifications);

  const actionsWrap = el("div", { class: "quiz-actions" });
  const freeBtn = el("button", { class: "primary-btn", text: "Freies Üben starten", attrs: { type: "button" } });
  const examBtn = el("button", { class: "secondary-btn", text: `Mini-Prüfung starten (${MINI_EXAM_COUNT} Fragen, ${MINI_EXAM_SECONDS / 60} Min.)`, attrs: { type: "button" } });
  actionsWrap.appendChild(freeBtn);
  actionsWrap.appendChild(examBtn);
  container.appendChild(actionsWrap);

  const runHost = el("div");
  container.appendChild(runHost);

  freeBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems(), filters);
    if (pool.length === 0) {
      alert("Keine Inhalte für diese Filterkombination gefunden.");
      return;
    }
    leave();
    startFreePractice(runHost, shuffle(pool));
  });

  examBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems().filter((i) => i.contentType === "question" || i.contentType === "readingPassage"), filters);
    if (pool.length < 3) {
      alert("Zu wenige Fragen für diese Filterkombination (mindestens 3 nötig).");
      return;
    }
    leave();
    startMiniExam(runHost, selectExamItems(pool, domainMap(), MINI_EXAM_COUNT));
  });
}

// ---------- Filterformular ----------

function renderFilterForm(host, filters, activePath, certifications) {
  clear(host);
  host.appendChild(el("h2", { text: "Filter" }));
  // Domain-Auswahl nur mit Domains des aktiven Lernpfads bestücken (bei administrator-full: beide Domain-Sets).
  const domains = [...domainMap().values()].filter((d) => certifications.includes(d.certification));

  const row1 = el("div", { class: "filter-row" });
  if (activePath === "administrator-full") {
    row1.appendChild(selectField("Zertifizierung", filters, "certification", [
      ["both", "Beide (Foundations + Administrator)"], ["foundations", "Nur Foundations"], ["administrator", "Nur Administrator"]
    ]));
  }
  row1.appendChild(selectField("Exam-Domain", filters, "examDomainId", [
    ["all", "Alle"], ...domains.map((d) => [d.id, `${d.name} (${certLabel(d.certification)})`])
  ]));
  row1.appendChild(selectField("CEFR-Level", filters, "cefr", [
    ["both", "Beide"], ["B1", "B1"], ["B2", "B2"]
  ]));
  host.appendChild(row1);

  const row2 = el("div", { class: "filter-row" });
  row2.appendChild(selectField("Übungsformat", filters, "format", [
    ["all", "Alle"], ["vocabulary", "Vokabel im Kontext"], ["definition", "Definitions-Matching"],
    ["question", "Szenario-Frage"], ["readingPassage", "Reading-Passage"]
  ]));
  row2.appendChild(selectField("Schwierigkeit", filters, "difficulty", [
    ["all", "Alle"], ["easy", "Leicht"], ["medium", "Mittel"], ["hard", "Schwer"]
  ]));
  row2.appendChild(selectField("Fehlerstatus", filters, "errorStatus", [
    ["all", "Alle"], ["wrong", "Nur zuletzt falsch"], ["later", "Als 'später wiederholen' markiert"], ["new", "Nur neue Inhalte"]
  ]));
  host.appendChild(row2);
}

function selectField(label, filters, key, options) {
  const wrap = el("label", { class: "filter-field" });
  wrap.appendChild(el("span", { text: label }));
  const select = el("select");
  options.forEach(([value, text]) => {
    const opt = el("option", { text, attrs: { value } });
    select.appendChild(opt);
  });
  select.value = filters[key];
  select.addEventListener("change", () => (filters[key] = select.value));
  wrap.appendChild(select);
  return wrap;
}

function allQuizItems() {
  const { vocabulary, definitions, readingPassages, questions } = state.content;
  return [
    ...vocabulary.map((c) => ({ content: c, contentType: "vocabulary" })),
    ...definitions.map((c) => ({ content: c, contentType: "definition" })),
    ...readingPassages.map((c) => ({ content: c, contentType: "readingPassage" })),
    ...questions.map((c) => ({ content: c, contentType: "question" }))
  ];
}

function filterPool(items, filters) {
  return items.filter((i) => {
    const c = i.content;
    if (filters.certification !== "both" && c.certification !== filters.certification) return false;
    if (filters.examDomainId !== "all" && c.examDomainId !== filters.examDomainId) return false;
    if (filters.cefr !== "both" && c.cefr !== filters.cefr) return false;
    if (filters.format !== "all" && i.contentType !== filters.format) return false;
    if (filters.difficulty !== "all" && c.difficulty !== filters.difficulty) return false;
    const progress = state.progressByContentId.get(c.id);
    if (filters.errorStatus === "wrong" && progress?.lastResult !== "incorrect") return false;
    if (filters.errorStatus === "later" && progress?.flag !== "later") return false;
    if (filters.errorStatus === "new" && progress) return false;
    return true;
  });
}

// ---------- Freies Üben ----------

function startFreePractice(runHost, pool) {
  const host = el("div");
  runHost.replaceChildren(host);
  let index = 0;
  const stats = { total: 0, correct: 0 };
  const status = el("p", { attrs: { role: "status" } });

  const progressLabel = el("p", { class: "session-progress" });
  const itemHost = el("div");
  const toolbar = el("div", { class: "quiz-toolbar" });
  const stopBtn = el("button", { class: "secondary-btn", text: "Beenden", attrs: { type: "button" } });
  const laterBtn = el("button", { class: "secondary-btn", text: "Später wiederholen markieren", attrs: { type: "button" } });
  toolbar.appendChild(laterBtn);
  toolbar.appendChild(stopBtn);

  host.appendChild(progressLabel);
  host.appendChild(toolbar);
  host.appendChild(status);
  host.appendChild(itemHost);

  stopBtn.addEventListener("click", () => showFreeResult());

  function showFreeResult() {
    clear(host);
    host.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "Freies Üben beendet" }),
      el("p", { text: `${stats.correct} / ${stats.total} richtig` })
    ]));
  }

  async function step() {
    if (index >= pool.length) {
      showFreeResult();
      return;
    }
    progressLabel.textContent = `Frage ${index + 1} von ${pool.length}`;
    const current = pool[index];
    status.textContent = "";
    laterBtn.onclick = async () => {
      laterBtn.disabled = true;
      try {
        await markForReview(current);
        if (pool[index] === current) status.textContent = "Für die Lerneinheit vorgemerkt.";
      } catch {
        if (pool[index] === current) status.textContent = "Die Markierung konnte nicht gespeichert werden.";
      } finally {
        laterBtn.disabled = false;
      }
    };
    renderItem(itemHost, current, {
      onAnswered: async (result) => {
        try {
          await saveAnswers([{ item: current, result, mode: "practice" }]);
        } catch {
          status.textContent = "Die Antwort konnte nicht gespeichert werden. Starte das freie Üben erneut.";
          return;
        }
        stats.total += 1;
        stats.correct += result.correct ? 1 : 0;
        index += 1;
        await step();
      }
    });
  }

  step();
}

/** Verteilt die Plätze nach Exam-Gewicht und füllt bei kleinen Filterpools übrige Plätze auf. */
export function selectExamItems(pool, domains, limit) {
  const groups = new Map();
  for (const item of shuffle(pool)) {
    const id = item.content.examDomainId;
    if (!groups.has(id)) groups.set(id, { items: [], weight: domains.get(id)?.weightPercent || 1, used: 0 });
    groups.get(id).items.push(item);
  }
  const entries = [...groups.values()];
  const totalWeight = entries.reduce((total, group) => total + group.weight, 0);
  const selection = [];
  const count = Math.min(limit, pool.length);
  while (selection.length < count) {
    const priority = (group) => count * group.weight / totalWeight - group.used;
    const [next] = entries.filter((group) => group.items.length)
      .sort((a, b) => priority(b) - priority(a));
    selection.push(next.items.pop());
    next.used += 1;
  }
  return shuffle(selection);
}

// ---------- Mini-Prüfung ----------

function toExamQuestion(item) {
  // Reading-Passagen werden auf ihre erste Teilfrage reduziert und bekommen das Szenario vorangestellt.
  if (item.contentType === "readingPassage") {
    const q = item.content.questions[0];
    return { ...q, scenario: item.content.scenario, source: item.content };
  }
  return { ...item.content, source: item.content };
}

function startMiniExam(runHost, pool) {
  const host = el("div");
  runHost.replaceChildren(host);
  const examQuestions = pool.map((item) => ({ item, q: toExamQuestion(item) }));
  const answers = new Map(); // contentId -> Set(optionId)
  let current = 0;
  const deadline = Date.now() + MINI_EXAM_SECONDS * 1000;
  let active = true;
  let timerHandle;

  const timerEl = el("div", { class: "quiz-timer" });
  const progressLabel = el("p", { class: "session-progress" });
  const qHost = el("div");
  const navWrap = el("div", { class: "quiz-nav" });
  const prevBtn = el("button", { class: "secondary-btn", text: "Zurück", attrs: { type: "button" } });
  const nextBtn = el("button", { class: "secondary-btn", text: "Weiter", attrs: { type: "button" } });
  const submitBtn = el("button", { class: "primary-btn", text: "Abgeben", attrs: { type: "button" } });
  navWrap.appendChild(prevBtn);
  navWrap.appendChild(nextBtn);
  navWrap.appendChild(submitBtn);
  const cancelBtn = el("button", { class: "secondary-btn", text: "Prüfung abbrechen", attrs: { type: "button" } });
  navWrap.appendChild(cancelBtn);

  host.appendChild(timerEl);
  host.appendChild(progressLabel);
  host.appendChild(qHost);
  host.appendChild(navWrap);

  function stopExam() {
    active = false;
    clearInterval(timerHandle);
    if (cancelExam === stopExam) cancelExam = null;
  }
  cancelExam = stopExam;

  function updateTimer() {
    if (!host.isConnected || location.hash !== "#/quiz") {
      stopExam();
      return;
    }
    const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    timerEl.textContent = `Verbleibende Zeit: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    if (!seconds) submit();
  }
  timerHandle = setInterval(updateTimer, 250);
  updateTimer();

  prevBtn.addEventListener("click", () => { current -= 1; renderCurrent(true); });
  nextBtn.addEventListener("click", () => { current += 1; renderCurrent(true); });
  submitBtn.addEventListener("click", submit);
  cancelBtn.addEventListener("click", () => {
    stopExam();
    clear(host);
    host.appendChild(el("p", { attrs: { role: "status" }, text: "Mini-Prüfung abgebrochen." }));
  });

  function renderCurrent(focus = false) {
    progressLabel.textContent = `Frage ${current + 1} von ${examQuestions.length}`;
    clear(qHost);
    const { item, q } = examQuestions[current];
    const card = el("div", { class: "item-card" });
    card.appendChild(disclaimerNote());
    if (q.scenario) card.appendChild(el("p", { class: "item-scenario", text: q.scenario, attrs: { lang: "en" } }));
    const question = el("p", { class: "item-question", text: q.questionText || q.text, attrs: { lang: "en", tabindex: "-1" } });
    card.appendChild(question);
    const isMulti = q.type === "multiple-select";
    if (isMulti) card.appendChild(el("p", { class: "item-hint", text: "Mehrfachauswahl möglich." }));

    const selected = answers.get(item.content.id) || new Set();
    const optsWrap = el("div", { class: "item-options item-options-list", attrs: { role: "group", "aria-label": "Antwortoptionen" } });
    q.options.forEach((opt) => {
      const btn = el("button", {
        class: "option-btn option-btn-wide" + (selected.has(opt.id) ? " option-selected" : ""),
        text: opt.text,
        attrs: { type: "button", lang: "en", "aria-pressed": String(selected.has(opt.id)) }
      });
      btn.dataset.optionId = opt.id;
      btn.addEventListener("click", () => {
        if (!active || Date.now() >= deadline) {
          updateTimer();
          return;
        }
        const set = answers.get(item.content.id) || new Set();
        if (isMulti) {
          if (set.has(opt.id)) set.delete(opt.id); else set.add(opt.id);
        } else {
          set.clear();
          set.add(opt.id);
        }
        answers.set(item.content.id, set);
        for (const option of optsWrap.children) {
          const pressed = set.has(option.dataset.optionId);
          option.classList.toggle("option-selected", pressed);
          option.setAttribute("aria-pressed", String(pressed));
        }
      });
      optsWrap.appendChild(btn);
    });
    card.appendChild(optsWrap);
    qHost.appendChild(card);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === examQuestions.length - 1;
    if (focus) question.focus();
  }

  async function submit() {
    if (!active || !host.isConnected || location.hash !== "#/quiz") return;
    stopExam();
    clear(host);
    host.appendChild(el("p", { attrs: { role: "status" }, text: "Mini-Prüfung wird ausgewertet…" }));

    let correctCount = 0;
    const reviewCards = [];
    const answered = [];
    for (const { item, q } of examQuestions) {
      const selected = answers.get(item.content.id) || new Set();
      const correctIds = new Set(q.options.filter((o) => o.correct).map((o) => o.id));
      const correct = correctIds.size === selected.size && [...correctIds].every((id) => selected.has(id));
      if (correct) correctCount += 1;

      if (selected.size) answered.push({ item, result: { correct }, mode: "exam" });

      const card = el("div", { class: "item-card" });
      const label = selected.size === 0 ? "Unbeantwortet" : correct ? "Richtig" : "Falsch";
      card.appendChild(el("p", { class: correct ? "result-correct" : "item-hint", text: label }));
      if (q.scenario) card.appendChild(el("p", { class: "item-scenario", text: q.scenario, attrs: { lang: "en" } }));
      card.appendChild(el("p", { class: "item-question", text: q.questionText || q.text, attrs: { lang: "en" } }));
      q.options.forEach((opt) => {
        const wasSelected = selected.has(opt.id);
        card.appendChild(el("p", { class: "option-explanation" }, [
          el("strong", { text: (opt.correct ? "✓ " : wasSelected ? "✗ " : "") + opt.text, attrs: { lang: "en" } }),
          document.createTextNode(" – " + opt.explanation)
        ]));
      });
      reviewCards.push(card);
    }

    try {
      if (answered.length) await saveAnswers(answered);
    } catch {
      if (host.isConnected) {
        clear(host);
        host.appendChild(el("p", { attrs: { role: "alert" }, text: "Die Prüfungsantworten konnten nicht gespeichert werden." }));
      }
      return;
    }
    if (!host.isConnected) return;
    clear(host);
    const pct = examQuestions.length ? Math.round((correctCount / examQuestions.length) * 100) : 0;
    host.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "Mini-Prüfung ausgewertet" }),
      el("p", { class: "big-number", text: `${correctCount} / ${examQuestions.length}` }),
      el("p", { text: `${pct}% · ${answered.length - correctCount} falsch · ${examQuestions.length - answered.length} unbeantwortet` })
    ]));
    reviewCards.forEach((c) => host.appendChild(c));
  }

  renderCurrent();
}
