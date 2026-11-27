// itemRenderer.js — Rendert ein einzelnes Lern-/Übungselement (Vokabel, Matching, Frage, Reading-Passage)
// und ruft nach Abschluss onAnswered({correct, confidence, responseTimeMs}) auf.
// Wird sowohl vom Lernmodus (learn.js) als auch vom freien Üben (quiz.js) genutzt.

import { state, domainMap } from "./state.js";
import { computeNextProgress, emptyProgress } from "./sm2.js";
import { el, clear, shuffle, disclaimerNote, focusContent } from "./utils.js";

function renderItemMetaPills(content, opts = {}) {
  if (!content) return null;
  const domain = domainMap().get(content.examDomainId);
  const cefrClass = content.cefr === "B2" ? "meta-pill meta-pill-b2" : "meta-pill meta-pill-b1";
  return el("div", { class: "meta-pills item-meta-pills" }, [
    opts.isIntro && el("span", { class: "meta-pill meta-pill-intro", text: "Neue Vokabel" }),
    domain && el("span", { class: "meta-pill", text: domain.name }),
    content.cefr && el("span", { class: cefrClass, text: `CEFR ${content.cefr}` })
  ]);
}

/**
 * @param {HTMLElement} container
 * @param {{content:object, contentType:string}} item
 * @param {{onAnswered: (result:{correct:boolean, confidence:number, responseTimeMs:number}) => void}} handlers
 */
export function renderItem(container, item, { onAnswered }) {
  clear(container);
  const startTime = performance.now();
  const { content, contentType } = item;

  if (contentType === "vocabulary" && item.introMode) renderVocabularyIntro(container, content, startTime, onAnswered);
  else if (contentType === "vocabulary") renderVocabulary(container, content, startTime, onAnswered);
  else if (contentType === "definition") renderDefinition(container, content, startTime, onAnswered);
  else if (contentType === "question") renderQuestion(container, content, {}, startTime, onAnswered);
  else if (contentType === "readingPassage") renderReadingPassage(container, content, startTime, onAnswered);
  else container.appendChild(el("p", { text: "Unbekannter Inhaltstyp." }));
  focusContent(container.querySelector("h2"));
}

// ---------- Neue Vokabel kennenlernen (Karteikarte, keine Abfrage) ----------
// Wird nur beim allerersten Kontakt mit einer Vokabel gezeigt (siehe learn.js buildQueue).
// Keine Antwortoptionen, keine Wertung, keine Sicherheitsabfrage — nur ansehen und weiter.
// Die eigentliche, aktiv abgefragte Vokabel-im-Kontext-Übung (renderVocabulary) folgt erst
// beim nächsten fälligen SM-2-Kontakt.

function renderVocabularyIntro(container, content, startTime, onAnswered) {
  const card = el("div", { class: "item-card vocab-intro-card" });
  card.appendChild(el("h2", { class: "vocab-intro-term", text: content.term, attrs: { lang: "en" } }));
  const meta = renderItemMetaPills(content, { isIntro: true });
  if (meta) card.appendChild(meta);
  const exampleSentence = content.clozeSentence.replace("____", content.term);
  card.appendChild(el("p", { class: "example-sentence" }, [el("strong", { text: "Beispiel: " }), el("span", { text: exampleSentence, attrs: { lang: "en" } })]));
  card.appendChild(el("p", {}, [el("strong", { text: "Deutsch: " }), document.createTextNode(content.germanExplanation)]));
  card.appendChild(el("p", {}, [el("strong", { text: "Salesforce-Kontext: " }), document.createTextNode(content.salesforceContext)]));
  card.appendChild(el("p", { class: "memory-hook" }, [el("strong", { text: "Merksatz: " }), document.createTextNode(content.memoryHook)]));
  if (content.confusableTerms?.length) {
    card.appendChild(el("p", { class: "confusable" }, [
      el("strong", { text: "Verwechslungsgefahr: " }),
      el("span", { text: content.confusableTerms.join(", "), attrs: { lang: "en" } })
    ]));
  }
  card.appendChild(el("p", { class: "item-hint", text: "Diese Vokabel wird dir in einer der nächsten Einheiten aktiv abgefragt." }));

  const continueBtn = el("button", { class: "primary-btn", text: "Verstanden — weiter", attrs: { type: "button" } });
  continueBtn.addEventListener(
    "click",
    () => {
      continueBtn.disabled = true;
      const responseTimeMs = performance.now() - startTime;
      onAnswered({ correct: true, confidence: null, responseTimeMs });
    },
    { once: true }
  );
  const fastTrackBtn = el("button", {
    class: "secondary-btn",
    text: "Ich kenne das — direkt abfragen",
    attrs: { type: "button" }
  });
  fastTrackBtn.addEventListener(
    "click",
    () => {
      clear(container);
      renderVocabulary(container, content, performance.now(), (result) =>
        onAnswered({ ...result, fastTracked: true }));
      focusContent(container.querySelector("h2"));
    },
    { once: true }
  );
  card.appendChild(el("div", { class: "quiz-actions" }, [continueBtn, fastTrackBtn]));
  bindItemShortcuts(card, () => ({ onEnter: () => triggerContinueShortcut(card), onSpace: () => triggerContinueShortcut(card) }));
  container.appendChild(card);
}

function markOptionState(btn, isCorrect, isChosenWrong) {
  if (isCorrect) {
    btn.classList.add("option-correct");
    btn.appendChild(el("span", { class: "option-result-tag", text: "✓ Richtig", attrs: { lang: "de" } }));
  } else if (isChosenWrong) {
    btn.classList.add("option-incorrect");
    btn.appendChild(el("span", { class: "option-result-tag", text: "✗ Falsch gewählt", attrs: { lang: "de" } }));
  }
}

// ---------- Vokabel im Kontext ----------

let activeShortcutCleanup = null;

function bindItemShortcuts(root, getHandlers) {
  if (activeShortcutCleanup) activeShortcutCleanup();
  function onKeydown(ev) {
    if (!root.isConnected) {
      cleanup();
      return;
    }
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    const handlers = getHandlers();
    if (/^[1-9]$/.test(ev.key)) {
      const n = Number(ev.key);
      if (handlers.onNumber?.(n)) ev.preventDefault();
    } else if (ev.key === "Enter" && tag !== "BUTTON" && tag !== "A" && tag !== "SUMMARY") {
      if (handlers.onEnter?.()) ev.preventDefault();
    } else if (ev.key === " " && tag !== "BUTTON" && tag !== "A" && tag !== "SUMMARY") {
      if (handlers.onSpace?.()) ev.preventDefault();
    }
  }
  function cleanup() {
    document.removeEventListener("keydown", onKeydown);
    if (activeShortcutCleanup === cleanup) activeShortcutCleanup = null;
  }
  document.addEventListener("keydown", onKeydown);
  activeShortcutCleanup = cleanup;
}

export function addOptionKeycap(btn, idx) {
  if (idx < 9) btn.prepend(el("kbd", { class: "keycap", text: String(idx + 1), attrs: { "aria-hidden": "true" } }));
}

function renderVocabulary(container, content, startTime, onAnswered) {
  const card = el("div", { class: "item-card" });
  card.appendChild(el("h2", { class: "item-title", text: "Vokabel im Kontext" }));
  const meta = renderItemMetaPills(content);
  if (meta) card.appendChild(meta);
  card.appendChild(el("p", { class: "item-cloze", text: content.clozeSentence, attrs: { lang: "en" } }));

  const optionsWrap = el("div", { class: "item-options" });
  let answered = false;

  const optButtons = shuffle(content.options).map((opt, idx) => {
    const btn = el("button", { class: "option-btn", attrs: { type: "button", lang: "en" } }, [
      el("span", { class: "option-text", text: opt })
    ]);
    addOptionKeycap(btn, idx);
    btn.dataset.option = opt;
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = opt === content.correctOption;
      [...optionsWrap.children].forEach((b) => {
        b.disabled = true;
        markOptionState(b, b.dataset.option === content.correctOption, !correct && b === btn);
      });
      showVocabExplanation(card, content, correct, startTime, onAnswered);
    });
    optionsWrap.appendChild(btn);
    return btn;
  });

  bindItemShortcuts(card, () => ({
    onNumber: (n) => {
      if (!answered && n <= optButtons.length) { optButtons[n - 1].click(); return true; }
      return triggerConfidenceShortcut(card, n);
    },
    onEnter: () => triggerContinueShortcut(card)
  }));

  card.appendChild(optionsWrap);
  container.appendChild(card);
}

function showVocabExplanation(card, content, correct, startTime, onAnswered) {
  const panel = el("div", { class: "explanation-panel" });
  panel.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig!" : "Nicht ganz." }));
  if (!correct) {
    panel.appendChild(el("p", {}, [
      el("strong", { text: "Richtige Antwort: " }),
      el("span", { text: content.correctOption, attrs: { lang: "en" } })
    ]));
  }
  panel.appendChild(el("p", {}, [el("strong", { text: "Erklärung: " }), document.createTextNode(content.germanExplanation)]));
  panel.appendChild(el("p", {}, [el("strong", { text: "Salesforce-Kontext: " }), document.createTextNode(content.salesforceContext)]));
  panel.appendChild(el("p", { class: "memory-hook" }, [el("strong", { text: "Merksatz: " }), document.createTextNode(content.memoryHook)]));
  if (content.confusableTerms?.length) {
    panel.appendChild(el("p", { class: "confusable" }, [
      el("strong", { text: "Verwechslungsgefahr: " }),
      el("span", { text: content.confusableTerms.join(", "), attrs: { lang: "en" } })
    ]));
  }
  card.appendChild(panel);
  appendConfidenceAndContinue(card, content, correct, startTime, onAnswered);
}

// ---------- Definitions-Matching ----------

function triggerConfidenceShortcut(root, n) {
  if (n < 1 || n > 3) return false;
  const btn = root.querySelector(`.confidence-btn:nth-of-type(${n})`);
  if (!btn || btn.disabled) return false;
  btn.click();
  return true;
}

function triggerContinueShortcut(root) {
  const btn = root.querySelector(".confidence-wrap .primary-btn, .passage-subquestion .primary-btn, .vocab-intro-card .primary-btn");
  if (!btn || btn.disabled) return false;
  btn.click();
  return true;
}

function renderDefinition(container, content, startTime, onAnswered) {
  const card = el("div", { class: "item-card" });
  card.appendChild(el("h2", { class: "item-title", text: "Definitions-Matching" }));
  const meta = renderItemMetaPills(content);
  if (meta) card.appendChild(meta);
  card.appendChild(el("p", { class: "item-term", text: content.term, attrs: { lang: "en" } }));
  card.appendChild(el("p", { class: "item-hint" }, [
    document.createTextNode("Wähle die passende Definition"),
    el("span", { class: "pointer-fine-only", text: " (auch mit Tasten 1–4 oder Tab + Enter bedienbar)" }),
    document.createTextNode(".")
  ]));

  const allDefs = shuffle([content.definition, ...content.distractorDefinitions]);
  const optionsWrap = el("div", { class: "item-options item-options-list" });
  let answered = false;

  const optButtons = allDefs.map((defText, idx) => {
    const btn = el("button", { class: "option-btn option-btn-wide", attrs: { type: "button", lang: "en" } }, [
      el("span", { class: "option-text", text: defText })
    ]);
    addOptionKeycap(btn, idx);
    btn.dataset.option = defText;
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = defText === content.definition;
      [...optionsWrap.children].forEach((b) => {
        b.disabled = true;
        markOptionState(b, b.dataset.option === content.definition, !correct && b === btn);
      });

      const panel = el("div", { class: "explanation-panel" });
      panel.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig!" : "Nicht ganz." }));
      if (!correct) {
        panel.appendChild(el("p", {}, [
          el("strong", { text: "Richtige Definition: " }),
          el("span", { text: content.definition, attrs: { lang: "en" } })
        ]));
      }
      panel.appendChild(el("p", {}, [el("strong", { text: "Erklärung: " }), document.createTextNode(content.germanExplanation)]));
      card.appendChild(panel);
      appendConfidenceAndContinue(card, content, correct, startTime, onAnswered);
    });
    optionsWrap.appendChild(btn);
    return btn;
  });

  bindItemShortcuts(card, () => ({
    onNumber: (n) => {
      if (!answered && n <= optButtons.length) { optButtons[n - 1].click(); return true; }
      return triggerConfidenceShortcut(card, n);
    },
    onEnter: () => triggerContinueShortcut(card)
  }));

  card.appendChild(optionsWrap);
  container.appendChild(card);
}

// ---------- Szenario-Frage (auch als Baustein für Reading-Passagen) ----------

/**
 * @param {HTMLElement} container
 * @param {object} questionContent
 * @param {{disclaimerAlreadyShown?: boolean, skipConfidence?: boolean}} opts
 *   skipConfidence: true, wenn diese Frage nur eine Teilfrage einer Reading-Passage ist —
 *   dann wird hier keine eigene Sicherheitsabfrage gezeigt (das übernimmt die Passage als Ganzes),
 *   sondern nur ein einfacher "Weiter"-Button, der direkt {correct} zurückmeldet.
 */
function renderQuestion(container, questionContent, opts, startTime, onAnswered) {
  const card = el("div", { class: opts.embedded ? "passage-subquestion" : "item-card" });
  const headingText = opts.subTotal > 1 ? `Teilfrage ${opts.subIndex + 1} von ${opts.subTotal}` : "Szenario-Frage";
  card.appendChild(el(opts.skipConfidence ? "h3" : "h2", { class: "item-title", text: headingText }));
  if (!opts.embedded) {
    const meta = renderItemMetaPills(questionContent);
    if (meta) card.appendChild(meta);
  }
  if (!opts.disclaimerAlreadyShown) {
    card.appendChild(disclaimerNote());
    if (questionContent.scenario) card.appendChild(el("p", { class: "item-scenario", text: questionContent.scenario, attrs: { lang: "en" } }));
  }
  card.appendChild(el("p", { class: "item-question", text: questionContent.questionText || questionContent.text, attrs: { lang: "en" } }));

  const isMulti = questionContent.type === "multiple-select";
  if (isMulti) card.appendChild(el("p", { class: "item-hint", text: "Mehrfachauswahl möglich — wähle alle zutreffenden Antworten." }));

  const optionsWrap = el("div", { class: "item-options item-options-list" });
  const selected = new Set();
  let answered = false;

  const options = questionContent.options;
  let submitBtn;
  const optButtons = options.map((opt, idx) => {
    const btn = el("button", {
      class: "option-btn option-btn-wide",
      attrs: { type: "button", lang: "en", ...(isMulti && { "aria-pressed": "false" }) }
    }, [el("span", { class: "option-text", text: opt.text })]);
    addOptionKeycap(btn, idx);
    btn.addEventListener("click", () => {
      if (answered) return;
      if (isMulti) {
        if (selected.has(opt.id)) selected.delete(opt.id);
        else selected.add(opt.id);
        btn.classList.toggle("option-selected", selected.has(opt.id));
        btn.setAttribute("aria-pressed", String(selected.has(opt.id)));
        submitBtn.disabled = selected.size === 0;
        return;
      }
      selected.add(opt.id);
      submit();
    });
    optionsWrap.appendChild(btn);
    btn.dataset.optId = opt.id;
    return btn;
  });
  card.appendChild(optionsWrap);

  if (isMulti) {
    submitBtn = el("button", { class: "primary-btn", text: "Antwort abgeben", attrs: { type: "button", disabled: "" } });
    submitBtn.addEventListener("click", () => submit());
    card.appendChild(submitBtn);
  }

  const shortcutScope = opts.shortcutScope || card;
  bindItemShortcuts(shortcutScope, () => ({
    onNumber: (n) => {
      if (!answered && n <= optButtons.length) { optButtons[n - 1].click(); return true; }
      if (!opts.skipConfidence) return triggerConfidenceShortcut(shortcutScope, n);
      return false;
    },
    onEnter: () => {
      if (!answered && isMulti && submitBtn && !submitBtn.disabled) { submitBtn.click(); return true; }
      return triggerContinueShortcut(shortcutScope);
    }
  }));

  function submit() {
    if (answered) return;
    answered = true;
    if (submitBtn) submitBtn.disabled = true;
    const correctIds = new Set(options.filter((o) => o.correct).map((o) => o.id));
    const correct =
      correctIds.size === selected.size && [...correctIds].every((id) => selected.has(id));

    [...optionsWrap.children].forEach((btn) => {
      btn.disabled = true;
      const opt = options.find((o) => o.id === btn.dataset.optId);
      markOptionState(btn, opt.correct, !opt.correct && selected.has(opt.id));
    });

    const panel = el("div", { class: "explanation-panel" });
    panel.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig!" : "Nicht ganz." }));
    if (questionContent.germanExplanation) {
      panel.appendChild(el("p", {}, [el("strong", { text: "Fachliche Erklärung: " }), document.createTextNode(questionContent.germanExplanation)]));
    }
    if (questionContent.signalWordAnalysis?.length) {
      const sig = el("div", { class: "signal-words" });
      sig.appendChild(el("strong", { text: "Signalwort-Analyse:" }));
      const list = el("ul");
      questionContent.signalWordAnalysis.forEach((s) => list.appendChild(el("li", { text: s })));
      sig.appendChild(list);
      panel.appendChild(sig);
    }
    const details = el("details", { class: "explanation-details" }, [
      el("summary", { text: `Alle Antwortoptionen im Detail (${options.length})` })
    ]);
    options.forEach((opt) => {
      details.appendChild(el("p", { class: "option-explanation" }, [
        el("strong", { text: (opt.correct ? "✓ " : "✗ ") + opt.text, attrs: { lang: "en" } }),
        document.createTextNode(" – " + opt.explanation)
      ]));
    });
    panel.appendChild(details);
    card.appendChild(panel);

    if (opts.skipConfidence) {
      // Teilfrage einer Reading-Passage: keine eigene Sicherheitsabfrage, nur einfacher Weiter-Button.
      const bar = el("div", { class: "session-action-bar" });
      const continueBtn = el("button", { class: "primary-btn", text: "Weiter", attrs: { type: "button" } });
      continueBtn.addEventListener(
        "click",
        () => {
          continueBtn.disabled = true;
          onAnswered({ correct });
        },
        { once: true }
      );
      bar.appendChild(continueBtn);
      card.appendChild(bar);
      focusContent(panel.querySelector("p"));
    } else {
      appendConfidenceAndContinue(card, questionContent, correct, startTime, onAnswered);
    }
  }

  container.appendChild(card);
}

// ---------- Reading-Passage (Szenario + eine oder mehrere Fragen nacheinander) ----------

function renderReadingPassage(container, content, startTime, onAnswered) {
  const wrap = el("div", { class: "item-card" });
  wrap.appendChild(el("h2", { class: "item-title", text: "Szenario lesen und beantworten" }));
  const meta = renderItemMetaPills(content);
  if (meta) wrap.appendChild(meta);
  wrap.appendChild(disclaimerNote());
  wrap.appendChild(el("p", { class: "item-scenario", text: content.scenario, attrs: { lang: "en" } }));

  const recapList = el("ul", { class: "passage-recap", attrs: { hidden: "" } });
  wrap.appendChild(recapList);

  const questions = content.questions || [];
  let index = 0;
  let allCorrect = true;

  const questionHost = el("div", { class: "passage-question-host" });
  wrap.appendChild(questionHost);
  container.appendChild(wrap);

  function next() {
    if (index >= questions.length) {
      clear(questionHost);
      const panel = el("div", { class: "explanation-panel" });
      panel.appendChild(el("p", {
        class: allCorrect ? "result-correct" : "result-incorrect",
        text: allCorrect ? "Alle Teilfragen richtig beantwortet!" : "Passage abgeschlossen — nicht alle Teilfragen waren richtig."
      }));
      if (content.signalWordAnalysis?.length) {
        const sig = el("div", { class: "signal-words" });
        sig.appendChild(el("strong", { text: "Signalwort-Analyse (gesamte Passage):" }));
        const list = el("ul");
        content.signalWordAnalysis.forEach((s) => list.appendChild(el("li", { text: s })));
        sig.appendChild(list);
        panel.appendChild(sig);
      }
      if (content.germanExplanation) {
        panel.appendChild(el("p", {}, [el("strong", { text: "Fachliche Erklärung: " }), document.createTextNode(content.germanExplanation)]));
      }
      wrap.appendChild(panel);
      bindItemShortcuts(wrap, () => ({
        onNumber: (n) => triggerConfidenceShortcut(wrap, n),
        onEnter: () => triggerContinueShortcut(wrap)
      }));
      appendConfidenceAndContinue(wrap, content, allCorrect, startTime, onAnswered);
      return;
    }
    clear(questionHost);
    const q = questions[index];
    renderQuestion(questionHost, q, {
      disclaimerAlreadyShown: true,
      skipConfidence: true,
      embedded: true,
      subIndex: index,
      subTotal: questions.length,
      shortcutScope: wrap
    }, startTime, (result) => {
      if (!result.correct) allCorrect = false;
      recapList.hidden = false;
      recapList.appendChild(el("li", { class: result.correct ? "recap-correct" : "recap-incorrect" }, [
        el("strong", { text: `Teilfrage ${index + 1}: ${result.correct ? "✓ Richtig" : "✗ Nicht ganz"}` }),
        document.createTextNode(` — ${q.questionText || q.text}`)
      ]));
      index += 1;
      next();
      if (index < questions.length) focusContent(questionHost.querySelector("h3"));
    });
  }

  next();
}

// Die einzelnen Teilfragen einer Reading-Passage zeigen (skipConfidence) keine eigene
// Sicherheitsabfrage — nur ein einfacher "Weiter"-Button. Die Sicherheitsabfrage und der
// Aufruf von onAnswered (mit Confidence/Bearbeitungszeit) erfolgen erst einmalig am Ende
// der gesamten Passage.

// ---------- Gemeinsame Sicherheitsabfrage + Weiter-Button ----------

const CONFIDENCE_LEVELS = [
  { key: "1", label: "Geraten", value: 1 },
  { key: "2", label: "Unsicher", value: 3 },
  { key: "3", label: "Sicher", value: 5 }
];

function formatSm2Preview(existingProgress, correct, confidence) {
  const next = computeNextProgress(existingProgress || {}, { correct, confidence });
  if (next.flag === "relearn") return "Morgen erneut lernen";
  if (next.intervalDays === 1) {
    return next.flag === "later" ? "Wiederholung: morgen (vorgemerkt)" : "Nächste Wiederholung: morgen";
  }
  return `Nächste Wiederholung: in ${next.intervalDays} Tagen`;
}

function appendConfidenceAndContinue(host, content, correct, startTime, onAnswered) {
  const responseTimeMs = performance.now() - startTime;
  const existingProgress = content?.id ? state.progressByContentId.get(content.id) || emptyProgress(content, "") : {};
  const wrap = el("div", { class: "confidence-wrap session-action-bar" });

  const headerRow = el("div", { class: "confidence-header" });
  const label = "Wie sicher warst du dir? (optional)";
  headerRow.appendChild(el("span", { class: "confidence-label", text: label }));
  const sm2Preview = el("span", {
    class: "sm2-preview",
    text: formatSm2Preview(existingProgress, correct, null),
    attrs: { role: "status" }
  });
  headerRow.appendChild(sm2Preview);
  wrap.appendChild(headerRow);

  const controlsRow = el("div", { class: "confidence-controls-row" });
  const scale = el("div", { class: "confidence-scale", attrs: { role: "group", "aria-label": label } });
  let chosen = null;

  CONFIDENCE_LEVELS.forEach(({ key, label: text, value }) => {
    const b = el("button", {
      class: "confidence-btn",
      attrs: { type: "button", "aria-pressed": "false", "data-confidence": String(value) }
    }, [
      el("kbd", { class: "keycap", text: key, attrs: { "aria-hidden": "true" } }),
      el("span", { text })
    ]);
    b.addEventListener("click", () => {
      chosen = chosen === value ? null : value;
      for (const button of scale.children) {
        const pressed = Number(button.dataset.confidence) === chosen;
        button.classList.toggle("confidence-selected", pressed);
        button.setAttribute("aria-pressed", String(pressed));
      }
      sm2Preview.textContent = formatSm2Preview(existingProgress, correct, chosen);
    });
    scale.appendChild(b);
  });
  controlsRow.appendChild(scale);

  const continueBtn = el("button", {
    class: "primary-btn confidence-continue-btn",
    attrs: { type: "button" }
  }, [
    document.createTextNode("Weiter "),
    el("kbd", { class: "keycap", text: "↵", attrs: { "aria-hidden": "true" } })
  ]);
  continueBtn.addEventListener(
    "click",
    () => {
      continueBtn.disabled = true;
      onAnswered({ correct, confidence: chosen, responseTimeMs });
    },
    { once: true }
  );
  controlsRow.appendChild(continueBtn);
  wrap.appendChild(controlsRow);
  const directPanel = [...host.children].find((child) => child.classList?.contains("explanation-panel"));
  (directPanel || host).appendChild(wrap);
  focusContent(host.querySelector(".result-correct, .result-incorrect") || wrap.querySelector("span"));
}
