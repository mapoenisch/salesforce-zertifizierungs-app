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
export function renderItem(container, item, { onAnswered, draft: saved = {}, onDraftChange = () => {} }) {
  clear(container);
  const startTime = performance.now();
  const { content, contentType } = item;
  const draft = itemDraft(saved, onDraftChange);
  const fastTrack = item.introMode && draft.data.fastTracked;
  const finish = fastTrack ? (result) => onAnswered({ ...result, fastTracked: true }) : onAnswered;

  if (contentType === "vocabulary" && item.introMode && !fastTrack) {
    renderVocabularyIntro(container, content, startTime, onAnswered, draft);
  } else if (contentType === "vocabulary") renderVocabulary(container, content, startTime, finish, draft);
  else if (contentType === "definition") renderDefinition(container, content, startTime, onAnswered, draft);
  else if (contentType === "question") renderQuestion(container, content, {}, startTime, onAnswered, draft);
  else if (contentType === "readingPassage") renderReadingPassage(container, content, startTime, onAnswered, draft);
  else container.appendChild(el("p", { text: "Unbekannter Inhaltstyp." }));
  if (!container.contains(document.activeElement)) focusContent(container.querySelector("h2"));
}

function itemDraft(saved, onChange) {
  const data = { ...saved };
  return {
    data,
    update(patch) {
      Object.assign(data, patch);
      onChange(data);
    }
  };
}

function restoreOptionOrder(options, saved) {
  if (Array.isArray(saved) && saved.length === options.length &&
      new Set(saved).size === options.length && saved.every((option) => options.includes(option))) {
    return saved;
  }
  return shuffle(options);
}

// ---------- Neue Vokabel kennenlernen (Karteikarte, keine Abfrage) ----------
// Wird nur beim allerersten Kontakt mit einer Vokabel gezeigt (siehe learn.js buildQueue).
// Keine Antwortoptionen, keine Wertung, keine Sicherheitsabfrage — nur ansehen und weiter.
// Die eigentliche, aktiv abgefragte Vokabel-im-Kontext-Übung (renderVocabulary) folgt erst
// beim nächsten fälligen SM-2-Kontakt.

function renderVocabularyIntro(container, content, startTime, onAnswered, draft) {
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
      draft.update({ fastTracked: true });
      renderVocabulary(container, content, performance.now(), (result) =>
        onAnswered({ ...result, fastTracked: true }), draft);
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

function bindItemShortcuts(root, getHandlers) {
  root.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ||
        document.querySelector(".modal-overlay")) return;
    const target = event.target;
    const onOptionInput = target.matches(".fall-option-input");
    if (target.matches("input, textarea, select, [contenteditable]") && !onOptionInput) return;

    const handlers = getHandlers();
    const nativeAction = target.closest("button, a, summary, input");
    if (/^[1-9]$/.test(event.key)) {
      if (handlers.onNumber?.(Number(event.key))) event.preventDefault();
    } else if (/^[ds]$/i.test(event.key) && !nativeAction) {
      const selector = event.key.toLowerCase() === "d" ? ".translation-toggle" : ".language-slip-btn";
      const button = root.querySelector(selector);
      if (button && !button.disabled) {
        event.preventDefault();
        button.click();
      }
    } else if (!nativeAction && event.key === "Enter") {
      if (handlers.onEnter?.()) event.preventDefault();
    } else if (!nativeAction && event.key === " ") {
      if (handlers.onSpace?.()) event.preventDefault();
    }
  });
}

export function addOptionKeycap(btn, idx) {
  if (idx < 9) btn.prepend(el("kbd", { class: "keycap", text: String(idx + 1), attrs: { "aria-hidden": "true" } }));
}

function renderVocabulary(container, content, startTime, onAnswered, draft) {
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

  const options = restoreOptionOrder(content.options, draft.data.optionOrder);
  function select(btn, opt) {
    chosenOption = opt;
    chosenBtn = btn;
    for (const option of optButtons) {
      const selected = option === btn;
      option.classList.toggle("option-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    }
    submitBtn.disabled = false;
  }
  const optButtons = options.map((opt, idx) => {
    const btn = el("button", { class: "option-btn", attrs: { type: "button", lang: "en", "aria-pressed": "false" } }, [
      el("span", { class: "option-text", text: opt })
    ]);
    addOptionKeycap(btn, idx);
    btn.dataset.option = opt;
    btn.addEventListener("click", () => {
      if (answered) return;
      select(btn, opt);
      draft.update({ selected: opt, optionOrder: options });
    });
    optionsWrap.appendChild(btn);
    return btn;
  });

  submitBtn.addEventListener("click", () => {
    if (answered || chosenOption == null) return;
    answered = true;
    submitBtn.disabled = true;
    submitBtn.hidden = true;
    const correct = chosenOption === content.correctOption;
    [...optionsWrap.children].forEach((b) => {
      b.disabled = true;
      markOptionState(b, b.dataset.option === content.correctOption, !correct && b === chosenBtn);
    });
    showVocabExplanation(card, content, correct, startTime, onAnswered, draft);
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
  const savedButton = optButtons.find((btn) => btn.dataset.option === draft.data.selected);
  if (savedButton) {
    select(savedButton, draft.data.selected);
    if (draft.data.checked) submitBtn.click();
  }
}

function showVocabExplanation(card, content, correct, startTime, onAnswered, draft) {
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
    draft, showConfidence: state.progressByContentId.has(content.id)
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

function renderDefinition(container, content, startTime, onAnswered, draft) {
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

  const allDefs = restoreOptionOrder([content.definition, ...content.distractorDefinitions], draft.data.optionOrder);
  const optionsWrap = el("div", { class: "item-options item-options-list" });
  let answered = false;
  let chosenDef = null;
  let chosenBtn = null;

  const submitBtn = el("button", {
    class: "primary-btn",
    text: "Prüfen",
    attrs: { type: "button", disabled: "" }
  });

  function select(btn, definition) {
    chosenDef = definition;
    chosenBtn = btn;
    for (const option of optButtons) {
      const selected = option === btn;
      option.classList.toggle("option-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    }
    submitBtn.disabled = false;
  }
  const optButtons = allDefs.map((defText, idx) => {
    const btn = el("button", { class: "option-btn option-btn-wide", attrs: { type: "button", lang: "en", "aria-pressed": "false" } }, [
      el("span", { class: "option-text", text: defText })
    ]);
    addOptionKeycap(btn, idx);
    btn.dataset.option = defText;
    btn.addEventListener("click", () => {
      if (answered) return;
      select(btn, defText);
      draft.update({ selected: defText, optionOrder: allDefs });
    });
    optionsWrap.appendChild(btn);
    return btn;
  });

  submitBtn.addEventListener("click", () => {
    if (answered || chosenDef == null) return;
    answered = true;
    submitBtn.disabled = true;
    submitBtn.hidden = true;
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
      draft, showConfidence: state.progressByContentId.has(content.id)
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
  const savedButton = optButtons.find((btn) => btn.dataset.option === draft.data.selected);
  if (savedButton) {
    select(savedButton, draft.data.selected);
    if (draft.data.checked) submitBtn.click();
  }
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

function renderInteractiveScenario(parent, text) {
  const scenarioEl = el("p", { class: "item-scenario", text, attrs: { lang: "en" } });
  const bar = el("div", { class: "scenario-highlight-bar" });
  const toggleBtn = el("button", {
    class: "secondary-btn scenario-highlight-toggle",
    text: "Signalwörter markieren",
    attrs: { type: "button", "aria-pressed": "false" }
  });
  const hint = el("span", {
    class: "scenario-highlight-hint",
    text: "Klicke auf Begriffe im Text, um Bedingungen hervorzuheben.",
    attrs: { hidden: "" }
  });

  let active = false;
  const markedIndices = new Set();

  function renderTokens() {
    clear(scenarioEl);
    if (!active) {
      scenarioEl.textContent = text;
      return;
    }
    const parts = text.split(/(\s+)/);
    parts.forEach((part, idx) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        scenarioEl.appendChild(document.createTextNode(part));
        return;
      }
      const isMarked = markedIndices.has(idx);
      const tokenBtn = el("button", {
        class: isMarked ? "scenario-token scenario-token-marked" : "scenario-token",
        text: part,
        attrs: { type: "button", "aria-pressed": String(isMarked), lang: "en" }
      });
      tokenBtn.addEventListener("click", () => {
        if (markedIndices.has(idx)) markedIndices.delete(idx);
        else markedIndices.add(idx);
        const nowMarked = markedIndices.has(idx);
        tokenBtn.classList.toggle("scenario-token-marked", nowMarked);
        tokenBtn.setAttribute("aria-pressed", String(nowMarked));
      });
      scenarioEl.appendChild(tokenBtn);
    });
  }

  toggleBtn.addEventListener("click", () => {
    active = !active;
    toggleBtn.setAttribute("aria-pressed", String(active));
    toggleBtn.textContent = active ? "Markiermodus beenden" : "Signalwörter markieren";
    hint.hidden = !active;
    renderTokens();
  });

  bar.append(toggleBtn, hint);
  parent.append(scenarioEl, bar);
}

function renderQuestion(container, questionContent, opts, startTime, onAnswered, draft) {
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
      renderInteractiveScenario(card, questionContent.scenario);
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
      attrs: { type: "button", "aria-expanded": "false" }
    }, [
      el("kbd", { class: "keycap", text: "D", attrs: { "aria-hidden": "true" } }),
      document.createTextNode(" Deutsch anzeigen")
    ]);
    deToggle.addEventListener("click", () => {
      const show = deText.hidden;
      deText.hidden = !show;
      deToggle.replaceChildren(
        el("kbd", { class: "keycap", text: "D", attrs: { "aria-hidden": "true" } }),
        document.createTextNode(show ? " Deutsch ausblenden" : " Deutsch anzeigen")
      );
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
  const options = questionContent.options;
  const savedSelection = Array.isArray(draft.data.selected) ? draft.data.selected : [];
  const selected = new Set(options.filter((option) => savedSelection.includes(option.id)).map((option) => option.id));
  let answered = false;

  const error = el("p", { class: "fall-error", attrs: { role: "alert" } });
  error.hidden = true;

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
    input.checked = selected.has(opt.id);
    input.addEventListener("change", () => {
      if (answered) return;
      if (isMulti) {
        if (input.checked) selected.add(opt.id);
        else selected.delete(opt.id);
      } else {
        selected.clear();
        if (input.checked) selected.add(opt.id);
      }
      submitBtn.disabled = selected.size === 0;
      error.hidden = true;
      draft.update({ selected: [...selected] });
    });
    fieldset.appendChild(row);
    return { input, row, opt };
  });
  card.appendChild(fieldset);
  card.appendChild(error);

  const submitBtn = el("button", {
    class: "primary-btn fall-check-btn",
    text: isMulti ? "Antwort abgeben" : "Antwort prüfen",
    attrs: { type: "button", disabled: "" }
  });
  submitBtn.disabled = selected.size === 0;
  const actionsWrap = el("div", { class: "fall-actions" }, [submitBtn]);
  submitBtn.addEventListener("click", () => submit());
  card.appendChild(actionsWrap);

  const shortcutScope = card;
  bindItemShortcuts(shortcutScope, () => ({
    onNumber: (n) => {
      if (!answered && n <= optRows.length) {
        const entry = optRows[n - 1];
        entry.input.click();
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
      draft.update({ checked: true });
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
      appendConfidenceAndContinue(card, questionContent, correct, startTime, onAnswered, { draft });
      focusContent(verdict);
    }
  }

  container.appendChild(card);
  if (draft.data.checked && selected.size) submit();
}

// ---------- Reading-Passage (Szenario + eine oder mehrere Fragen nacheinander) ----------

function renderReadingPassage(container, content, startTime, onAnswered, draft) {
  const wrap = el("div", { class: "item-card" });
  wrap.appendChild(el("h2", { class: "item-title", text: "Szenario lesen und beantworten" }));
  const meta = renderItemMetaPills(content);
  if (meta) wrap.appendChild(meta);
  wrap.appendChild(disclaimerNote());
  renderInteractiveScenario(wrap, content.scenario);

  const recapList = el("ul", { class: "passage-recap", attrs: { hidden: "", "aria-live": "polite" } });
  wrap.appendChild(recapList);

  const questions = content.questions || [];
  const results = Array.isArray(draft.data.results)
    ? draft.data.results.slice(0, questions.length).filter((result) => typeof result === "boolean")
    : [];
  let index = results.length;

  function appendRecap(correct, questionIndex) {
    const q = questions[questionIndex];
    recapList.hidden = false;
    recapList.appendChild(el("li", { class: correct ? "recap-correct" : "recap-incorrect" }, [
      el("strong", { text: `Teilfrage ${questionIndex + 1}: ${correct ? "✓ Richtig" : "✗ Nicht ganz"}` }),
      document.createTextNode(` — ${q.questionText || q.text}`)
    ]));
  }
  results.forEach(appendRecap);

  const questionHost = el("div", { class: "passage-question-host" });
  wrap.appendChild(questionHost);
  container.appendChild(wrap);

  function next() {
    if (index >= questions.length) {
      const allCorrect = results.every(Boolean);
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
      appendConfidenceAndContinue(wrap, content, allCorrect, startTime, onAnswered, { draft });
      return;
    }
    clear(questionHost);
    const q = questions[index];
    renderQuestion(questionHost, q, {
      disclaimerAlreadyShown: true,
      skipConfidence: true,
      embedded: true,
      subIndex: index,
      subTotal: questions.length
    }, startTime, (result) => {
      results.push(result.correct);
      appendRecap(result.correct, index);
      index += 1;
      draft.update({ results, question: null });
      next();
      if (index < questions.length) focusContent(questionHost.querySelector("h3"));
    }, itemDraft(draft.data.question || {}, (question) => draft.update({ question })));
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

function appendConfidenceAndContinue(host, content, correct, startTime, onAnswered, { draft, showConfidence = true }) {
  const responseTimeMs = draft.data.responseTimeMs ?? performance.now() - startTime;
  if (!draft.data.checked) draft.update({ checked: true, responseTimeMs });
  const existingProgress = content?.id ? state.progressByContentId.get(content.id) || emptyProgress(content, "") : {};
  const wrap = el("div", { class: "confidence-wrap session-action-bar" });

  let chosen = showConfidence ? draft.data.confidence ?? null : null;
  let languageSlip = !correct && draft.data.languageSlip === true;

  const headerRow = el("div", { class: "confidence-header" });
  const label = "Wie sicher warst du dir? (optional)";
  if (showConfidence) {
    headerRow.appendChild(el("span", { class: "confidence-label", text: label }));
  }
  const sm2Preview = el("span", {
    class: "sm2-preview",
    text: formatSm2Preview(existingProgress, correct, chosen, languageSlip)
  });
  headerRow.appendChild(sm2Preview);
  wrap.appendChild(headerRow);

  if (!correct) {
    const slipWrap = el("div", { class: "language-slip-wrap" });
    const slipBtn = el("button", {
      class: `secondary-btn language-slip-btn${languageSlip ? " confidence-selected" : ""}`,
      attrs: { type: "button", "aria-pressed": String(languageSlip), "aria-describedby": "language-slip-hint" }
    }, [
      el("kbd", { class: "keycap", text: "S", attrs: { "aria-hidden": "true" } }),
      document.createTextNode(" Sprachfehler, nicht Fachfehler")
    ]);
    const slipHint = el("span", {
      class: "language-slip-hint",
      text: "Schützt dein SM-2-Intervall, wenn nur ein englisches Signalwort überlesen wurde.",
      attrs: { id: "language-slip-hint" }
    });
    slipBtn.addEventListener("click", () => {
      languageSlip = !languageSlip;
      draft.update({ languageSlip });
      slipBtn.classList.toggle("confidence-selected", languageSlip);
      slipBtn.setAttribute("aria-pressed", String(languageSlip));
      sm2Preview.setAttribute("aria-live", "polite");
      sm2Preview.textContent = formatSm2Preview(existingProgress, correct, chosen, languageSlip);
    });
    slipWrap.append(slipBtn, slipHint);
    wrap.appendChild(slipWrap);
  }

  const controlsRow = el("div", { class: "confidence-controls-row" });
  if (showConfidence) {
    const scale = el("div", { class: "confidence-scale", attrs: { role: "group", "aria-label": label } });

    CONFIDENCE_LEVELS.forEach(({ key, label: text, value }) => {
      const b = el("button", {
        class: `confidence-btn${chosen === value ? " confidence-selected" : ""}`,
        attrs: {
          type: "button",
          "aria-pressed": String(chosen === value),
          "data-confidence": String(value),
          "aria-label": `${text} – Sicherheit ${key} von 3`
        }
      }, [
        el("kbd", { class: "keycap", text: key, attrs: { "aria-hidden": "true" } }),
        el("span", { text })
      ]);
      b.addEventListener("click", () => {
        chosen = chosen === value ? null : value;
        draft.update({ confidence: chosen });
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
