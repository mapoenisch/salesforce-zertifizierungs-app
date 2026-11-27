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
    const onOptionInput = document.activeElement?.matches?.(".fall-option-input");
    if ((tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") && !onOptionInput) return;

    const handlers = getHandlers();
    const isSelectionBtn = document.activeElement?.matches?.(".option-btn, .confidence-btn, .language-slip-btn");
    if (/^[1-9]$/.test(ev.key)) {
      const n = Number(ev.key);
      if (handlers.onNumber?.(n)) ev.preventDefault();
    } else if (ev.key === "Enter" && ((tag !== "BUTTON" && tag !== "A" && tag !== "SUMMARY") || isSelectionBtn)) {
      if (handlers.onEnter?.()) ev.preventDefault();
    } else if (ev.key === " " && tag !== "BUTTON" && tag !== "A" && tag !== "SUMMARY" && !onOptionInput) {
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
  let chosenOption = null;
  let chosenBtn = null;

  const submitBtn = el("button", {
    class: "primary-btn",
    text: "Prüfen",
    attrs: { type: "button", disabled: "" }
  });

  const optButtons = shuffle(content.options).map((opt, idx) => {
    const btn = el("button", { class: "option-btn", attrs: { type: "button", lang: "en", "aria-pressed": "false" } }, [
      el("span", { class: "option-text", text: opt })
    ]);
    addOptionKeycap(btn, idx);
    btn.dataset.option = opt;
    btn.addEventListener("click", () => {
      if (answered) return;
      chosenOption = opt;
      chosenBtn = btn;
      for (const b of optButtons) {
        const isSel = b === btn;
        b.classList.toggle("option-selected", isSel);
        b.setAttribute("aria-pressed", String(isSel));
      }
      submitBtn.disabled = false;
    });
    optionsWrap.appendChild(btn);
    return btn;
  });

  submitBtn.addEventListener("click", () => {
    if (answered || chosenOption == null) return;
    answered = true;
    submitBtn.disabled = true;
    const correct = chosenOption === content.correctOption;
    [...optionsWrap.children].forEach((b) => {
      b.disabled = true;
      markOptionState(b, b.dataset.option === content.correctOption, !correct && b === chosenBtn);
    });
    showVocabExplanation(card, content, correct, startTime, onAnswered);
  });

  bindItemShortcuts(card, () => ({
    onNumber: (n) => {
      if (!answered && n <= optButtons.length) { optButtons[n - 1].click(); return true; }
      if (answered) return triggerConfidenceShortcut(card, n);
      return false;
    },
    onEnter: () => {
      if (!answered && !submitBtn.disabled) { submitBtn.click(); return true; }
      return triggerContinueShortcut(card);
    }
  }));

  card.appendChild(optionsWrap);
  card.appendChild(submitBtn);
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
  appendConfidenceAndContinue(card, content, correct, startTime, onAnswered, {
    showConfidence: state.progressByContentId.has(content.id)
  });
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
  let chosenDef = null;
  let chosenBtn = null;

  const submitBtn = el("button", {
    class: "primary-btn",
    text: "Prüfen",
    attrs: { type: "button", disabled: "" }
  });

  const optButtons = allDefs.map((defText, idx) => {
    const btn = el("button", { class: "option-btn option-btn-wide", attrs: { type: "button", lang: "en", "aria-pressed": "false" } }, [
      el("span", { class: "option-text", text: defText })
    ]);
    addOptionKeycap(btn, idx);
    btn.dataset.option = defText;
    btn.addEventListener("click", () => {
      if (answered) return;
      chosenDef = defText;
      chosenBtn = btn;
      for (const b of optButtons) {
        const isSel = b === btn;
        b.classList.toggle("option-selected", isSel);
        b.setAttribute("aria-pressed", String(isSel));
      }
      submitBtn.disabled = false;
    });
    optionsWrap.appendChild(btn);
    return btn;
  });

  submitBtn.addEventListener("click", () => {
    if (answered || chosenDef == null) return;
    answered = true;
    submitBtn.disabled = true;
    const correct = chosenDef === content.definition;
    [...optionsWrap.children].forEach((b) => {
      b.disabled = true;
      markOptionState(b, b.dataset.option === content.definition, !correct && b === chosenBtn);
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
    appendConfidenceAndContinue(card, content, correct, startTime, onAnswered, {
      showConfidence: state.progressByContentId.has(content.id)
    });
  });

  bindItemShortcuts(card, () => ({
    onNumber: (n) => {
      if (!answered && n <= optButtons.length) { optButtons[n - 1].click(); return true; }
      if (answered) return triggerConfidenceShortcut(card, n);
      return false;
    },
    onEnter: () => {
      if (!answered && !submitBtn.disabled) { submitBtn.click(); return true; }
      return triggerContinueShortcut(card);
    }
  }));

  card.appendChild(optionsWrap);
  card.appendChild(submitBtn);
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
let fallakteCounter = 0;

function optionLetter(idx) {
  return String.fromCharCode(65 + idx);
}

function renderQuestion(container, questionContent, opts, startTime, onAnswered) {
  fallakteCounter += 1;
  const instanceName = `fall-q-${fallakteCounter}`;
  const isMulti = questionContent.type === "multiple-select";
  const card = el("div", { class: opts.embedded ? "passage-subquestion fallakte-embedded" : "fallakte" });

  if (!opts.embedded) {
    const domain = domainMap().get(questionContent.examDomainId);
    const sourceParts = [domain?.name, questionContent.cefr ? `CEFR ${questionContent.cefr}` : ""].filter(Boolean);
    card.appendChild(el("header", { class: "fallakte-head" }, [
      el("h2", { class: "fallakte-step", text: "Szenario-Frage" }),
      sourceParts.length ? el("p", { class: "fallakte-source", text: sourceParts.join(" · ") }) : null
    ]));
  } else {
    const headingText = opts.subTotal > 1 ? `Teilfrage ${opts.subIndex + 1} von ${opts.subTotal}` : "Szenario-Frage";
    card.appendChild(el("h3", { class: "fallakte-heading", text: headingText }));
  }

  if (!opts.disclaimerAlreadyShown) {
    card.appendChild(disclaimerNote());
    if (questionContent.scenario) {
      card.appendChild(el("p", { class: "item-scenario", text: questionContent.scenario, attrs: { lang: "en" } }));
    }
  }
  card.appendChild(el("p", {
    class: "fallakte-question",
    text: questionContent.questionText || questionContent.text,
    attrs: { lang: "en" }
  }));

  if (questionContent.questionTextDe) {
    const deText = el("p", {
      class: "item-question-de",
      text: questionContent.questionTextDe,
      attrs: { lang: "de", hidden: "" }
    });
    const deToggle = el("button", {
      class: "secondary-btn translation-toggle",
      text: "Deutsch anzeigen",
      attrs: { type: "button", "aria-expanded": "false" }
    });
    deToggle.addEventListener("click", () => {
      const show = deText.hidden;
      deText.hidden = !show;
      deToggle.textContent = show ? "Deutsch ausblenden" : "Deutsch anzeigen";
      deToggle.setAttribute("aria-expanded", String(show));
    });
    card.append(deToggle, deText);
  }

  if (isMulti) {
    card.appendChild(el("p", { class: "item-hint", text: "Mehrfachauswahl möglich — wähle alle zutreffenden Antworten." }));
  }

  const fieldset = el("fieldset", { class: "fall-options" }, [
    el("legend", { class: "visually-hidden", text: "Antwort auswählen" })
  ]);
  const selected = new Set();
  let answered = false;

  const error = el("p", { class: "fall-error", attrs: { role: "alert" } });
  error.hidden = true;

  const options = questionContent.options;
  const optRows = options.map((opt, idx) => {
    const input = el("input", {
      class: isMulti ? "fall-option-input fall-option-checkbox" : "fall-option-input",
      attrs: {
        type: isMulti ? "checkbox" : "radio",
        name: instanceName,
        value: opt.id
      }
    });
    const row = el("label", {
      class: "fall-option",
      attrs: { "data-opt-id": opt.id }
    }, [
      input,
      el("span", { class: "fall-option-letter", text: optionLetter(idx), attrs: { "aria-hidden": "true" } }),
      el("span", { class: "fall-option-text", text: opt.text, attrs: { lang: "en" } })
    ]);
    input.addEventListener("change", () => {
      if (answered) return;
      if (isMulti) {
        if (input.checked) selected.add(opt.id);
        else selected.delete(opt.id);
      } else {
        selected.clear();
        if (input.checked) selected.add(opt.id);
      }
      error.hidden = true;
    });
    fieldset.appendChild(row);
    return { input, row, opt };
  });
  card.appendChild(fieldset);
  card.appendChild(error);

  const submitBtn = el("button", {
    class: "primary-btn fall-check-btn",
    text: isMulti ? "Antwort abgeben" : "Antwort prüfen",
    attrs: { type: "button" }
  });
  const actionsWrap = el("div", { class: "fall-actions" }, [submitBtn]);
  submitBtn.addEventListener("click", () => submit());
  card.appendChild(actionsWrap);

  const shortcutScope = opts.shortcutScope || card;
  bindItemShortcuts(shortcutScope, () => ({
    onNumber: (n) => {
      if (!answered && n <= optRows.length) {
        const entry = optRows[n - 1];
        if (isMulti) entry.input.checked = !entry.input.checked;
        else entry.input.checked = true;
        entry.input.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      if (answered && !opts.skipConfidence) return triggerConfidenceShortcut(shortcutScope, n);
      return false;
    },
    onEnter: () => {
      if (!answered) { submit(); return true; }
      return triggerContinueShortcut(shortcutScope);
    }
  }));

  function submit() {
    if (answered) return;
    if (selected.size === 0) {
      error.textContent = isMulti ? "Wähle mindestens eine Antwort." : "Wähle eine Antwort.";
      error.hidden = false;
      optRows[0]?.input.focus();
      return;
    }
    answered = true;
    error.hidden = true;
    actionsWrap.hidden = true;

    const correctIds = new Set(options.filter((o) => o.correct).map((o) => o.id));
    const correct =
      correctIds.size === selected.size && [...correctIds].every((id) => selected.has(id));

    for (const { input, row, opt } of optRows) {
      input.disabled = true;
      const isChosenWrong = !opt.correct && selected.has(opt.id);
      if (opt.correct) {
        row.classList.add("fall-option-correct");
        row.appendChild(el("span", { class: "fall-option-tag fall-option-tag-correct", text: "✓ Richtig" }));
      } else if (isChosenWrong) {
        row.classList.add("fall-option-wrong");
        row.appendChild(el("span", { class: "fall-option-tag fall-option-tag-wrong", text: "✗ Deine Wahl" }));
      }
    }

    const correctLabels = options
      .map((opt, idx) => (opt.correct ? `${optionLetter(idx)} · ${opt.text}` : null))
      .filter(Boolean);

    const resolution = el("div", { class: "fall-resolution" });
    const verdict = el("p", { class: "fall-verdict", attrs: { tabindex: "-1" } }, [
      el("span", {
        class: `fall-option-tag ${correct ? "fall-option-tag-correct" : "fall-option-tag-wrong"}`,
        text: correct ? "✓ Richtig" : "✗ Nicht ganz"
      }),
      el("span", {
        class: "fall-verdict-answer",
        text: ` ${correctLabels.length > 1 ? "Richtige Antworten" : "Richtige Antwort"}: ${correctLabels.join(" / ")}`
      })
    ]);
    resolution.appendChild(verdict);

    if (questionContent.germanExplanation) {
      resolution.appendChild(el("h3", { class: "fall-why-heading", text: "Warum diese Antwort?" }));
      resolution.appendChild(el("p", { text: questionContent.germanExplanation }));
    }

    if (questionContent.signalWordAnalysis?.length) {
      const sig = el("div", { class: "fall-language-note" });
      sig.appendChild(el("strong", { text: "Sprachhinweis:" }));
      const list = el("ul", { class: "fall-signal-list" });
      questionContent.signalWordAnalysis.forEach((s) => list.appendChild(el("li", { text: s })));
      sig.appendChild(list);
      resolution.appendChild(sig);
    }

    const details = el("details", { class: "explanation-details" }, [
      el("summary", { text: `Alle Antwortoptionen im Detail (${options.length})` })
    ]);
    options.forEach((opt, idx) => {
      details.appendChild(el("p", { class: "option-explanation" }, [
        el("strong", { text: `${opt.correct ? "✓ " : "✗ "}${optionLetter(idx)}. ${opt.text}`, attrs: { lang: "en" } }),
        document.createTextNode(" – " + opt.explanation)
      ]));
    });
    resolution.appendChild(details);
    card.appendChild(resolution);

    if (opts.skipConfidence) {
      const bar = el("div", { class: "fall-next-row" });
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
      focusContent(verdict);
    } else {
      appendConfidenceAndContinue(card, questionContent, correct, startTime, onAnswered);
      focusContent(verdict);
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

  const recapList = el("ul", { class: "passage-recap", attrs: { hidden: "", "aria-live": "polite" } });
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

function formatSm2Preview(existingProgress, correct, confidence, languageSlip = false) {
  const next = computeNextProgress(existingProgress || {}, { correct, confidence, languageSlip });
  if (languageSlip && !correct) {
    return next.intervalDays === 1
      ? "Wiederholung: morgen (Sprachfehler — Intervall bleibt)"
      : `Wiederholung: in ${next.intervalDays} Tagen (Sprachfehler — Intervall bleibt)`;
  }
  if (next.flag === "relearn") return "Morgen erneut lernen";
  if (next.intervalDays === 1) {
    return next.flag === "later" ? "Wiederholung: morgen (vorgemerkt)" : "Nächste Wiederholung: morgen";
  }
  return `Nächste Wiederholung: in ${next.intervalDays} Tagen`;
}

function appendConfidenceAndContinue(host, content, correct, startTime, onAnswered, { showConfidence = true } = {}) {
  const responseTimeMs = performance.now() - startTime;
  const existingProgress = content?.id ? state.progressByContentId.get(content.id) || emptyProgress(content, "") : {};
  const wrap = el("div", { class: "confidence-wrap session-action-bar" });

  let chosen = null;
  let languageSlip = false;

  const headerRow = el("div", { class: "confidence-header" });
  const label = "Wie sicher warst du dir? (optional)";
  if (showConfidence) {
    headerRow.appendChild(el("span", { class: "confidence-label", text: label }));
  }
  const sm2Preview = el("span", {
    class: "sm2-preview",
    text: formatSm2Preview(existingProgress, correct, null, false)
  });
  headerRow.appendChild(sm2Preview);
  wrap.appendChild(headerRow);

  if (!correct) {
    const slipBtn = el("button", {
      class: "secondary-btn language-slip-btn",
      text: "Sprachfehler, nicht Fachfehler",
      attrs: { type: "button", "aria-pressed": "false" }
    });
    slipBtn.addEventListener("click", () => {
      languageSlip = !languageSlip;
      slipBtn.classList.toggle("confidence-selected", languageSlip);
      slipBtn.setAttribute("aria-pressed", String(languageSlip));
      sm2Preview.setAttribute("aria-live", "polite");
      sm2Preview.textContent = formatSm2Preview(existingProgress, correct, chosen, languageSlip);
    });
    wrap.appendChild(slipBtn);
  }

  const controlsRow = el("div", { class: "confidence-controls-row" });
  if (showConfidence) {
    const scale = el("div", { class: "confidence-scale", attrs: { role: "group", "aria-label": label } });

    CONFIDENCE_LEVELS.forEach(({ key, label: text, value }) => {
      const b = el("button", {
        class: "confidence-btn",
        attrs: {
          type: "button",
          "aria-pressed": "false",
          "data-confidence": String(value),
          "aria-label": `${text} – Sicherheit ${value} von 5`
        }
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
        sm2Preview.setAttribute("aria-live", "polite");
        sm2Preview.textContent = formatSm2Preview(existingProgress, correct, chosen, languageSlip);
      });
      scale.appendChild(b);
    });
    controlsRow.appendChild(scale);
  }

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
      onAnswered({ correct, confidence: chosen, responseTimeMs, languageSlip });
    },
    { once: true }
  );
  controlsRow.appendChild(continueBtn);
  wrap.appendChild(controlsRow);
  const directPanel = [...host.children].find((child) => child.classList?.contains("explanation-panel"));
  (directPanel || host).appendChild(wrap);
  focusContent(host.querySelector(".result-correct, .result-incorrect") || wrap.querySelector("span"));
}
