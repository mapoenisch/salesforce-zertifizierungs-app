// views/quiz.js — Frage-/Prüfungsmodus: freies Üben (mit Filtern) und zeitlimitierte Mini-Prüfung.

import { state, refreshLearningData, domainMap, pathCertifications } from "../state.js";
import { markForReview, saveAnswers } from "../learning.js";
import { renderItem } from "../itemRenderer.js";
import { el, clear, shuffle, certLabel, disclaimerNote, focusContent, confirmDialog } from "../utils.js";

const MINI_EXAM_COUNT = 10;
const MINI_EXAM_SECONDS = 10 * 60;
let activeExam;

export function hasActiveExam() {
  return Boolean(activeExam);
}

export function confirmLeave() {
  return activeExam?.confirmAbandon();
}

export function leave() {
  activeExam?.stop();
}

export async function render(container) {
  clear(container);
  const setup = el("section");
  const setupTitle = el("h1", { text: "Frage- und Prüfungsmodus" });
  setup.appendChild(setupTitle);
  container.appendChild(setup);

  await refreshLearningData();
  const activePath = state.settings.certificationPath;
  const certifications = pathCertifications(activePath);
  const filters = {
    certification: activePath === "administrator-full" ? "both" : activePath,
    examDomainId: "all", cefr: "both", format: "all", difficulty: "all", errorStatus: "all"
  };

  const actions = el("div", { class: "quiz-actions" });
  const freeBtn = el("button", { class: "primary-btn", text: "Freies Üben starten", attrs: { type: "button" } });
  const examBtn = el("button", {
    class: "secondary-btn",
    text: `Mini-Prüfung starten (${MINI_EXAM_COUNT} Fragen, ${MINI_EXAM_SECONDS / 60} Min.)`,
    attrs: { type: "button" }
  });
  actions.append(freeBtn, examBtn);
  setup.appendChild(actions);

  const status = el("p", { class: "quiz-setup-status", attrs: { role: "status" } });
  setup.appendChild(status);
  const formHost = el("details", { class: "quiz-filters" });
  formHost.appendChild(el("summary", { text: "Übungen filtern" }));
  const fields = el("div");
  formHost.appendChild(fields);
  renderFilterForm(fields, filters, activePath, certifications);
  setup.appendChild(formHost);
  fields.addEventListener("change", () => {
    const count = filterPool(allQuizItems(), filters).length;
    status.textContent = `${count} passende Übungen`;
  });

  const runHost = el("div");
  container.appendChild(runHost);

  function showSetup(message = "") {
    runHost.replaceChildren();
    setup.hidden = false;
    status.textContent = message;
    focusContent(setupTitle, { page: true });
  }

  freeBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems(), filters);
    if (!pool.length) {
      status.textContent = "Keine passenden Übungen. Passe die Filter an.";
      formHost.open = true;
      return;
    }
    setup.hidden = true;
    startFreePractice(runHost, shuffle(pool), showSetup);
  });

  examBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems().filter((item) =>
      item.contentType === "question" || item.contentType === "readingPassage"), filters);
    if (pool.length < 3) {
      status.textContent = "Für eine Mini-Prüfung brauchst du mindestens 3 Szenariofragen oder Reading-Passagen. Erweitere die Filter.";
      formHost.open = true;
      return;
    }
    setup.hidden = true;
    startMiniExam(runHost, selectExamItems(pool, domainMap(), MINI_EXAM_COUNT), showSetup);
  });
}

// ---------- Filterformular ----------

function renderFilterForm(host, filters, activePath, certifications) {
  clear(host);
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

function startFreePractice(runHost, pool, showSetup, title = "Freies Üben") {
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

  const heading = el("h1", { text: title });
  host.appendChild(heading);
  host.appendChild(progressLabel);
  host.appendChild(toolbar);
  host.appendChild(status);
  host.appendChild(itemHost);

  stopBtn.addEventListener("click", () => showFreeResult());

  function showFreeResult() {
    clear(host);
    const resultHeading = el("h1", { text: "Übung beendet" });
    const back = el("button", {
      class: "primary-btn", text: "Zur Übungsauswahl",
      attrs: { type: "button" }, on: { click: () => showSetup() }
    });
    host.append(resultHeading, el("p", { text: `${stats.correct} / ${stats.total} richtig` }), back);
    focusContent(resultHeading, { page: true });
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
  focusContent(heading, { page: true });
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

function startMiniExam(runHost, pool, showSetup) {
  const host = el("section", { class: "exam-run" });
  runHost.replaceChildren(host);
  const examQuestions = pool.map((item) => ({ item, q: toExamQuestion(item) }));
  const answers = new Map();
  const deadline = Date.now() + MINI_EXAM_SECONDS * 1000;
  let current = 0;
  let timerHandle;
  let pendingConfirmation;
  let lastTimerText = "";

  const title = el("h1", { text: "Mini-Prüfung" });
  const timer = el("p", { class: "quiz-timer", attrs: { role: "timer" } });
  const answerCount = el("p", { attrs: { role: "status" } });
  const stats = el("div", { class: "exam-stats" }, [answerCount, timer]);
  const qHost = el("div");
  const prev = el("button", { class: "secondary-btn", text: "Zurück", attrs: { type: "button" } });
  const next = el("button", { class: "secondary-btn", text: "Weiter", attrs: { type: "button" } });
  const actions = el("div", { class: "exam-actions" });
  const submitBtn = el("button", { class: "primary-btn", text: "Abgeben", attrs: { type: "button" } });
  const cancelBtn = el("button", { class: "secondary-btn", text: "Prüfung abbrechen", attrs: { type: "button" } });
  actions.append(submitBtn, cancelBtn);

  const jump = el("details", { class: "exam-jump" }, [el("summary", { text: "Fragenübersicht" })]);
  const jumpList = el("div", { class: "exam-jump-list" });
  jump.appendChild(jumpList);
  const questionButtons = examQuestions.map((_, index) => {
    const button = el("button", { class: "secondary-btn", text: String(index + 1), attrs: { type: "button" } });
    button.addEventListener("click", () => goTo(index));
    jumpList.appendChild(button);
    return button;
  });
  const navigation = el("div", { class: "quiz-nav" }, [prev, next]);
  host.append(title, stats, qHost, navigation, jump, actions);

  const attempt = { stop, confirmAbandon };
  activeExam = attempt;
  window.addEventListener("beforeunload", warnBeforeUnload);

  function warnBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = true;
  }

  function stop() {
    clearInterval(timerHandle);
    pendingConfirmation?.abort();
    window.removeEventListener("beforeunload", warnBeforeUnload);
    if (activeExam === attempt) activeExam = null;
  }

  async function ask(message, options) {
    if (pendingConfirmation || activeExam !== attempt) return false;
    const controller = new AbortController();
    pendingConfirmation = controller;
    const confirmed = await confirmDialog(message, { ...options, signal: controller.signal });
    pendingConfirmation = null;
    if (activeExam !== attempt) return false;
    if (Date.now() >= deadline) {
      submit(true);
      return false;
    }
    return confirmed;
  }

  function confirmAbandon() {
    return ask("Die Prüfung läuft noch. Wenn du sie verlässt, wird dieser Versuch verworfen.", {
      cancelText: "Weiterprüfen", confirmText: "Versuch verwerfen", danger: true
    });
  }

  function updateTimer() {
    if (!host.isConnected) {
      stop();
      return;
    }
    const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const nextText = `Restzeit ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    if (nextText !== lastTimerText) {
      lastTimerText = nextText;
      timer.textContent = nextText;
    }
    if (!seconds) submit(true);
  }

  function refreshStatus() {
    answerCount.textContent = `${answers.size} beantwortet · ${examQuestions.length - answers.size} offen`;
    for (const [index, button] of questionButtons.entries()) {
      const answered = answers.has(examQuestions[index].item.content.id);
      button.setAttribute("aria-label", `Frage ${index + 1}, ${answered ? "beantwortet" : "offen"}`);
      button.classList.toggle("exam-jump-answered", answered);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    }
  }

  function goTo(index, moveFocus = true) {
    if (activeExam !== attempt) return;
    current = index;
    const { item, q } = examQuestions[current];
    const selected = answers.get(item.content.id) || new Set();
    const card = el("div", { class: "item-card exam-question" });
    const heading = el("h2", { class: "exam-question-heading", text: `Frage ${current + 1} von ${examQuestions.length}` });
    card.append(heading);
    if (q.scenario) card.appendChild(el("p", { class: "item-scenario", text: q.scenario, attrs: { lang: "en" } }));
    card.appendChild(el("p", { class: "item-question", text: q.questionText || q.text, attrs: { lang: "en" } }));
    const multi = q.type === "multiple-select";
    if (multi) card.appendChild(el("p", { class: "item-hint", text: "Wähle alle zutreffenden Antworten." }));

    const options = el("div", {
      class: "item-options item-options-list", attrs: { role: "group", "aria-label": "Antwortoptionen" }
    });
    for (const option of q.options) {
      const button = el("button", {
        class: "option-btn option-btn-wide",
        text: option.text,
        attrs: { type: "button", lang: "en" }
      });
      button.dataset.optionId = option.id;
      button.addEventListener("click", () => {
        if (activeExam !== attempt || Date.now() >= deadline) {
          updateTimer();
          return;
        }
        const wasSelected = selected.has(option.id);
        if (!multi) selected.clear();
        if (multi && wasSelected) selected.delete(option.id);
        else selected.add(option.id);
        if (selected.size) answers.set(item.content.id, selected);
        else answers.delete(item.content.id);
        markSelection();
        refreshStatus();
      });
      options.appendChild(button);
    }
    function markSelection() {
      for (const button of options.children) {
        const pressed = selected.has(button.dataset.optionId);
        button.classList.toggle("option-selected", pressed);
        button.setAttribute("aria-pressed", String(pressed));
      }
    }
    markSelection();
    card.append(options);
    qHost.replaceChildren(card);
    prev.disabled = current === 0;
    next.disabled = current === examQuestions.length - 1;
    refreshStatus();
    if (moveFocus) focusContent(heading);
  }

  async function submit(expired = false) {
    if (activeExam !== attempt || !host.isConnected) return;
    stop();
    const calculating = el("p", { attrs: { role: "status" }, text: "Mini-Prüfung wird ausgewertet…" });
    host.replaceChildren(calculating);
    focusContent(calculating, { page: true });

    const graded = examQuestions.map(({ item, q }, index) => {
      const selected = answers.get(item.content.id) || new Set();
      const correctIds = q.options.filter((option) => option.correct).map((option) => option.id);
      const correct = correctIds.length === selected.size && correctIds.every((id) => selected.has(id));
      return { item, q, index, selected, correct };
    });
    const answered = graded.filter(({ selected }) => selected.size);
    const wrong = answered.filter(({ correct }) => !correct);
    const open = graded.filter(({ selected }) => !selected.size);
    const correctCount = answered.length - wrong.length;
    let saveError = false;

    try {
      if (answered.length) await saveAnswers(answered.map(({ item, correct }) => ({ item, result: { correct }, mode: "exam" })));
    } catch {
      saveError = true;
    }
    if (!host.isConnected) return;

    const resultTitle = el("h1", { text: "Mini-Prüfung ausgewertet" });
    const score = el("p", { class: "exam-score", text: `${correctCount} von ${graded.length} richtig` });
    const breakdown = el("p", {
      class: "item-hint",
      text: `${Math.round(correctCount / graded.length * 100)} % · ${wrong.length} falsch · ${open.length} unbeantwortet`
    });
    const resultActions = el("div", { class: "exam-actions" });
    const back = el("button", {
      class: "secondary-btn", text: "Zur Übungsauswahl",
      attrs: { type: "button" }, on: { click: () => showSetup() }
    });
    const review = [...wrong, ...open];
    if (review.length) resultActions.appendChild(el("button", {
      class: "primary-btn",
      text: wrong.length ? "Fehler gezielt üben" : "Offene Fragen üben",
      attrs: { type: "button" },
      on: { click: () => startFreePractice(runHost, review.map(({ item }) => item), showSetup, "Gezielte Wiederholung") }
    }));
    resultActions.appendChild(back);

    host.replaceChildren(resultTitle, score, breakdown);
    if (expired) host.appendChild(el("p", { text: "Die Zeit ist abgelaufen. Deine bisherigen Antworten wurden ausgewertet." }));
    if (saveError) host.appendChild(el("p", { attrs: { role: "alert" }, text: "Dein Ergebnis ist sichtbar. Der Lernstand konnte nicht gespeichert werden." }));
    host.appendChild(resultActions);
    const reviewHeading = el("h2", { text: "Antworten ansehen" });
    host.appendChild(reviewHeading);
    for (const result of [...wrong, ...open, ...graded.filter(({ correct }) => correct)]) {
      host.appendChild(renderExamReview(result));
    }
    focusContent(resultTitle, { page: true });
  }

  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  submitBtn.addEventListener("click", async () => {
    const open = examQuestions.length - answers.size;
    if (open && !(await ask(`Noch ${open} von ${examQuestions.length} Fragen sind offen. Möchtest du jetzt abgeben?`, {
      cancelText: "Weiterprüfen", confirmText: "Jetzt abgeben"
    }))) return;
    submit(Date.now() >= deadline);
  });
  cancelBtn.addEventListener("click", async () => {
    if (!(await confirmAbandon())) return;
    stop();
    showSetup("Mini-Prüfung abgebrochen.");
  });

  goTo(0, false);
  host.insertBefore(disclaimerNote(), qHost);
  timerHandle = setInterval(updateTimer, 250);
  updateTimer();
  focusContent(title, { page: true });
}

function renderExamReview({ q, index, selected, correct }) {
  const label = !selected.size ? "Unbeantwortet" : correct ? "Richtig" : "Falsch";
  const detail = el("details", { class: "exam-review" });
  detail.appendChild(el("summary", { text: `Frage ${index + 1} · ${label}` }));
  if (q.scenario) detail.appendChild(el("p", { class: "item-scenario", text: q.scenario, attrs: { lang: "en" } }));
  detail.appendChild(el("p", { class: "item-question", text: q.questionText || q.text, attrs: { lang: "en" } }));
  for (const option of q.options) {
    const verdict = option.correct ? "Richtige Option" : "Falsche Option";
    detail.appendChild(el("p", { class: "option-explanation" }, [
      el("strong", { text: option.text, attrs: { lang: "en" } }),
      document.createTextNode(` · ${verdict}${selected.has(option.id) ? " · von dir gewählt" : ""}`),
      el("br"),
      document.createTextNode(option.explanation)
    ]));
  }
  return detail;
}
