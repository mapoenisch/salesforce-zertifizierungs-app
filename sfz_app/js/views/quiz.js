// views/quiz.js — Frage-/Prüfungsmodus: freies Üben (mit Filtern) und zeitlimitierte Mini-Prüfung.

import { state, refreshProgress, refreshActivity, domainMap, pathCertifications, activePlatform } from "../state.js";
import * as db from "../db.js";
import * as sm2 from "../sm2.js";
import { renderItem } from "../itemRenderer.js";
import { el, clear, shuffle, todayISO, certLabel, disclaimerNote } from "../utils.js";

const MINI_EXAM_COUNT = 10;
const MINI_EXAM_SECONDS = 10 * 60;

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Frage- und Prüfungsmodus" }));

  const activePath = state.settings.certificationPath;
  const certifications = pathCertifications(activePath);
  // Deckt der Lernpfad mehrere Zertifizierungen ab (administrator-full, hubspot-all), lässt sich
  // zwischen ihnen filtern; sonst ist der Filter fest auf die eine Zertifizierung des Pfads gesetzt.
  const filters = { certification: certifications.length > 1 ? "both" : certifications[0], examDomainId: "all", cefr: "both", format: "all", difficulty: "all", errorStatus: "all" };
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
    const pool = filterPool(allQuizItems(), filters, certifications);
    if (pool.length === 0) {
      alert("Keine Inhalte für diese Filterkombination gefunden.");
      return;
    }
    startFreePractice(runHost, shuffle(pool), ctx);
  });

  examBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems().filter((i) => i.contentType === "question" || i.contentType === "readingPassage"), filters, certifications);
    if (pool.length < 3) {
      alert("Zu wenige Fragen für diese Filterkombination (mindestens 3 nötig).");
      return;
    }
    const selection = shuffle(pool).slice(0, Math.min(MINI_EXAM_COUNT, pool.length));
    startMiniExam(runHost, selection, ctx);
  });
}

// ---------- Filterformular ----------

function renderFilterForm(host, filters, activePath, certifications) {
  clear(host);
  host.appendChild(el("h2", { text: "Filter" }));
  const platform = activePlatform();
  // Bereichsauswahl nur mit den Themenbereichen des aktiven Lernpfads bestücken.
  const domains = [...domainMap().values()].filter((d) => certifications.includes(d.certification));

  const row1 = el("div", { class: "filter-row" });
  if (certifications.length > 1) {
    row1.appendChild(selectField("Zertifizierung", filters, "certification", [
      ["both", "Alle im Lernpfad"], ...certifications.map((c) => [c, certLabel(c)])
    ]));
  }
  row1.appendChild(selectField(platform.domainLabel, filters, "examDomainId", [
    ["all", "Alle"], ...domains.map((d) => [d.id, `${d.name} (${certLabel(d.certification)})`])
  ]));
  if (platform.usesCefr) {
    row1.appendChild(selectField("CEFR-Level", filters, "cefr", [
      ["both", "Beide"], ["B1", "B1"], ["B2", "B2"]
    ]));
  }
  host.appendChild(row1);

  const row2 = el("div", { class: "filter-row" });
  row2.appendChild(selectField("Übungsformat", filters, "format", [
    ["all", "Alle"], ["vocabulary", "Vokabel im Kontext"], ["definition", "Definitions-Matching"],
    ["question", "Szenario-Frage"], ["readingPassage", platform.scenarioKicker]
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

function filterPool(items, filters, certifications) {
  return items.filter((i) => {
    const c = i.content;
    // Grundfilter: nur Inhalte des aktiven Lernpfads — trennt Salesforce- und HubSpot-Ebene.
    if (certifications && certifications.length && !certifications.includes(c.certification)) return false;
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

function startFreePractice(host, pool, ctx) {
  clear(host);
  let index = 0;
  const stats = { total: 0, correct: 0 };

  const progressLabel = el("p", { class: "session-progress" });
  const itemHost = el("div");
  const toolbar = el("div", { class: "quiz-toolbar" });
  const stopBtn = el("button", { class: "secondary-btn", text: "Beenden", attrs: { type: "button" } });
  const laterBtn = el("button", { class: "secondary-btn", text: "Später wiederholen markieren", attrs: { type: "button" } });
  toolbar.appendChild(laterBtn);
  toolbar.appendChild(stopBtn);

  host.appendChild(progressLabel);
  host.appendChild(toolbar);
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
    laterBtn.onclick = async () => {
      await markLater(current);
    };
    renderItem(itemHost, current, {
      onAnswered: async (result) => {
        await persistAnswer(current, result);
        stats.total += 1;
        stats.correct += result.correct ? 1 : 0;
        index += 1;
        await step();
      }
    });
  }

  step();
}

async function markLater(item) {
  const existing = state.progressByContentId.get(item.content.id) || sm2.emptyProgress(item.content, item.contentType);
  const updated = { ...existing, flag: "later" };
  await db.putProgress(updated);
  await refreshProgress();
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

function startMiniExam(host, pool, ctx) {
  clear(host);
  const examQuestions = pool.map((item) => ({ item, q: toExamQuestion(item) }));
  const answers = new Map(); // contentId -> Set(optionId)
  let current = 0;
  let secondsLeft = MINI_EXAM_SECONDS;
  let submitted = false;

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

  host.appendChild(timerEl);
  host.appendChild(progressLabel);
  host.appendChild(qHost);
  host.appendChild(navWrap);

  const timerHandle = setInterval(() => {
    secondsLeft -= 1;
    timerEl.textContent = `Verbleibende Zeit: ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;
    if (secondsLeft <= 0) {
      clearInterval(timerHandle);
      submit();
    }
  }, 1000);
  timerEl.textContent = `Verbleibende Zeit: ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  prevBtn.addEventListener("click", () => { current = Math.max(0, current - 1); renderCurrent(); });
  nextBtn.addEventListener("click", () => { current = Math.min(examQuestions.length - 1, current + 1); renderCurrent(); });
  submitBtn.addEventListener("click", () => { clearInterval(timerHandle); submit(); });

  function renderCurrent() {
    progressLabel.textContent = `Frage ${current + 1} von ${examQuestions.length}`;
    clear(qHost);
    const { item, q } = examQuestions[current];
    const card = el("div", { class: "item-card" });
    card.appendChild(disclaimerNote(item.content.disclaimer));
    if (q.scenario) card.appendChild(el("p", { class: "item-scenario", text: q.scenario }));
    card.appendChild(el("p", { class: "item-question", text: q.questionText || q.text }));
    const isMulti = q.type === "multiple-select";
    if (isMulti) card.appendChild(el("p", { class: "item-hint", text: "Mehrfachauswahl möglich." }));

    const selected = answers.get(item.content.id) || new Set();
    const optsWrap = el("div", { class: "item-options item-options-list" });
    q.options.forEach((opt) => {
      const btn = el("button", {
        class: "option-btn option-btn-wide" + (selected.has(opt.id) ? " option-selected" : ""),
        text: opt.text,
        attrs: { type: "button" }
      });
      btn.addEventListener("click", () => {
        const set = answers.get(item.content.id) || new Set();
        if (isMulti) {
          if (set.has(opt.id)) set.delete(opt.id); else set.add(opt.id);
        } else {
          set.clear();
          set.add(opt.id);
        }
        answers.set(item.content.id, set);
        renderCurrent();
      });
      optsWrap.appendChild(btn);
    });
    card.appendChild(optsWrap);
    qHost.appendChild(card);
    prevBtn.disabled = current === 0;
  }

  async function submit() {
    if (submitted) return;
    submitted = true;
    clear(host);

    let correctCount = 0;
    const reviewCards = [];
    for (const { item, q } of examQuestions) {
      const selected = answers.get(item.content.id) || new Set();
      const correctIds = new Set(q.options.filter((o) => o.correct).map((o) => o.id));
      const correct = correctIds.size === selected.size && [...correctIds].every((id) => selected.has(id));
      if (correct) correctCount += 1;

      await persistAnswer(item, { correct, confidence: 3, responseTimeMs: null });

      const card = el("div", { class: "item-card" });
      card.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig" : "Falsch" }));
      if (q.scenario) card.appendChild(el("p", { class: "item-scenario", text: q.scenario }));
      card.appendChild(el("p", { class: "item-question", text: q.questionText || q.text }));
      q.options.forEach((opt) => {
        const wasSelected = selected.has(opt.id);
        card.appendChild(el("p", { class: "option-explanation" }, [
          el("strong", { text: (opt.correct ? "✓ " : wasSelected ? "✗ " : "") + opt.text + ": " }),
          document.createTextNode(opt.explanation)
        ]));
      });
      reviewCards.push(card);
    }

    await refreshProgress();
    await refreshActivity();

    const pct = examQuestions.length ? Math.round((correctCount / examQuestions.length) * 100) : 0;
    host.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "Mini-Prüfung ausgewertet" }),
      el("p", { class: "big-number", text: `${correctCount} / ${examQuestions.length}` }),
      el("p", { text: `${pct}%` })
    ]));
    reviewCards.forEach((c) => host.appendChild(c));
  }

  renderCurrent();
}

async function persistAnswer(item, result) {
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
