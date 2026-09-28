// itemRenderer.js — Rendert ein einzelnes Lern-/Übungselement (Vokabel, Matching, Frage, Reading-Passage)
// und ruft nach Abschluss onAnswered({correct, confidence, responseTimeMs}) auf.
// Wird sowohl vom Lernmodus (learn.js) als auch vom freien Üben (quiz.js) genutzt.

import { el, clear, shuffle, disclaimerNote } from "./utils.js";
import { platformConfig, platformOfContent } from "./platforms.js";

/** Label und Text des Plattformkontexts einer Vokabel (Salesforce- bzw. HubSpot-Kontext). */
function contextParts(content) {
  const cfg = platformConfig(platformOfContent(content));
  const text = content[cfg.contextField] || content.platformContext || content.salesforceContext || "";
  return { label: cfg.contextLabel, text };
}

/** Analyseliste unter einer Antwort: Signalwörter (Salesforce) bzw. Ausschlusslogik (HubSpot). */
function analysisBlock(items, heading) {
  const wrap = el("div", { class: "signal-words" });
  wrap.appendChild(el("strong", { text: heading }));
  const list = el("ul");
  items.forEach((s) => list.appendChild(el("li", { text: s })));
  wrap.appendChild(list);
  return wrap;
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
}

// ---------- Neue Vokabel kennenlernen (Karteikarte, keine Abfrage) ----------
// Wird nur beim allerersten Kontakt mit einer Vokabel gezeigt (siehe learn.js buildQueue).
// Keine Antwortoptionen, keine Wertung, keine Sicherheitsabfrage — nur ansehen und weiter.
// Die eigentliche, aktiv abgefragte Vokabel-im-Kontext-Übung (renderVocabulary) folgt erst
// beim nächsten fälligen SM-2-Kontakt.

function renderVocabularyIntro(container, content, startTime, onAnswered) {
  const card = el("div", { class: "item-card vocab-intro-card" });
  card.appendChild(el("h3", { class: "item-kicker", text: "Neue Vokabel" }));
  card.appendChild(el("p", { class: "vocab-intro-term", text: content.term }));
  const exampleSentence = content.clozeSentence.replace("____", content.term);
  card.appendChild(el("p", { class: "example-sentence" }, [el("strong", { text: "Beispiel: " }), document.createTextNode(exampleSentence)]));
  card.appendChild(el("p", {}, [el("strong", { text: "Deutsch: " }), document.createTextNode(content.germanExplanation)]));
  const introCtx = contextParts(content);
  if (introCtx.text) {
    card.appendChild(el("p", {}, [el("strong", { text: introCtx.label + ": " }), document.createTextNode(introCtx.text)]));
  }
  card.appendChild(el("p", { class: "memory-hook" }, [el("strong", { text: "Merksatz: " }), document.createTextNode(content.memoryHook)]));
  if (content.confusableTerms?.length) {
    card.appendChild(el("p", { class: "confusable" }, [
      el("strong", { text: "Verwechslungsgefahr: " }),
      document.createTextNode(content.confusableTerms.join(", "))
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
  card.appendChild(continueBtn);
  container.appendChild(card);
  continueBtn.focus();
}

// ---------- Vokabel im Kontext ----------

function renderVocabulary(container, content, startTime, onAnswered) {
  const card = el("div", { class: "item-card" });
  card.appendChild(el("h3", { class: "item-kicker", text: "Vokabel im Kontext" }));
  card.appendChild(el("p", { class: "item-cloze", text: content.clozeSentence }));

  const optionsWrap = el("div", { class: "item-options" });
  let answered = false;

  shuffle(content.options).forEach((opt) => {
    const btn = el("button", { class: "option-btn", text: opt, attrs: { type: "button" } });
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = opt === content.correctOption;
      [...optionsWrap.children].forEach((b) => {
        b.disabled = true;
        if (b.textContent === content.correctOption) b.classList.add("option-correct");
      });
      if (!correct) btn.classList.add("option-incorrect");
      showVocabExplanation(card, content, correct, startTime, onAnswered);
    });
    optionsWrap.appendChild(btn);
  });

  card.appendChild(optionsWrap);
  container.appendChild(card);
}

function showVocabExplanation(card, content, correct, startTime, onAnswered) {
  const panel = el("div", { class: "explanation-panel" });
  panel.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig!" : "Nicht ganz." }));
  panel.appendChild(el("p", {}, [el("strong", { text: "Erklärung: " }), document.createTextNode(content.germanExplanation)]));
  const explCtx = contextParts(content);
  if (explCtx.text) {
    panel.appendChild(el("p", {}, [el("strong", { text: explCtx.label + ": " }), document.createTextNode(explCtx.text)]));
  }
  panel.appendChild(el("p", { class: "memory-hook" }, [el("strong", { text: "Merksatz: " }), document.createTextNode(content.memoryHook)]));
  if (content.confusableTerms?.length) {
    panel.appendChild(el("p", { class: "confusable" }, [
      el("strong", { text: "Verwechslungsgefahr: " }),
      document.createTextNode(content.confusableTerms.join(", "))
    ]));
  }
  card.appendChild(panel);
  appendConfidenceAndContinue(card, correct, startTime, onAnswered);
}

// ---------- Definitions-Matching ----------

function renderDefinition(container, content, startTime, onAnswered) {
  const card = el("div", { class: "item-card" });
  card.appendChild(el("h3", { class: "item-kicker", text: "Definitions-Matching" }));
  card.appendChild(el("p", { class: "item-term", text: content.term }));
  card.appendChild(el("p", { class: "item-hint", text: "Wähle die passende Definition (auch mit Tab + Enter bedienbar)." }));

  const allDefs = shuffle([content.definition, ...content.distractorDefinitions]);
  const optionsWrap = el("div", { class: "item-options item-options-list" });
  let answered = false;

  allDefs.forEach((defText) => {
    const btn = el("button", { class: "option-btn option-btn-wide", text: defText, attrs: { type: "button" } });
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = defText === content.definition;
      [...optionsWrap.children].forEach((b) => {
        b.disabled = true;
        if (b.textContent === content.definition) b.classList.add("option-correct");
      });
      if (!correct) btn.classList.add("option-incorrect");

      const panel = el("div", { class: "explanation-panel" });
      panel.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig!" : "Nicht ganz." }));
      panel.appendChild(el("p", {}, [el("strong", { text: "Erklärung: " }), document.createTextNode(content.germanExplanation)]));
      card.appendChild(panel);
      appendConfidenceAndContinue(card, correct, startTime, onAnswered);
    });
    optionsWrap.appendChild(btn);
  });

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
  const card = el("div", { class: "item-card" });
  card.appendChild(el("h3", { class: "item-kicker", text: "Szenario-Frage" }));
  if (!opts.disclaimerAlreadyShown) card.appendChild(disclaimerNote(questionContent.disclaimer));
  card.appendChild(el("p", { class: "item-question", text: questionContent.questionText || questionContent.text }));

  const isMulti = questionContent.type === "multiple-select";
  if (isMulti) card.appendChild(el("p", { class: "item-hint", text: "Mehrfachauswahl möglich — wähle alle zutreffenden Antworten." }));

  const optionsWrap = el("div", { class: "item-options item-options-list" });
  const selected = new Set();
  let answered = false;

  const options = questionContent.options;
  options.forEach((opt) => {
    const btn = el("button", { class: "option-btn option-btn-wide", text: opt.text, attrs: { type: "button" } });
    btn.addEventListener("click", () => {
      if (answered) return;
      if (isMulti) {
        btn.classList.toggle("option-selected");
        if (selected.has(opt.id)) selected.delete(opt.id);
        else selected.add(opt.id);
        return;
      }
      selected.add(opt.id);
      submit();
    });
    optionsWrap.appendChild(btn);
    btn.dataset.optId = opt.id;
  });
  card.appendChild(optionsWrap);

  if (isMulti) {
    const submitBtn = el("button", { class: "primary-btn", text: "Antwort abgeben", attrs: { type: "button" } });
    submitBtn.addEventListener("click", () => submit());
    card.appendChild(submitBtn);
  }

  function submit() {
    if (answered) return;
    answered = true;
    const correctIds = new Set(options.filter((o) => o.correct).map((o) => o.id));
    const correct =
      correctIds.size === selected.size && [...correctIds].every((id) => selected.has(id));

    [...optionsWrap.children].forEach((btn) => {
      btn.disabled = true;
      const opt = options.find((o) => o.id === btn.dataset.optId);
      if (opt.correct) btn.classList.add("option-correct");
      else if (selected.has(opt.id)) btn.classList.add("option-incorrect");
    });

    const panel = el("div", { class: "explanation-panel" });
    panel.appendChild(el("p", { class: correct ? "result-correct" : "result-incorrect", text: correct ? "Richtig!" : "Nicht ganz." }));
    options.forEach((opt) => {
      panel.appendChild(el("p", { class: "option-explanation" }, [
        el("strong", { text: (opt.correct ? "✓ " : "✗ ") + opt.text + ": " }),
        document.createTextNode(opt.explanation)
      ]));
    });
    if (questionContent.signalWordAnalysis?.length) {
      panel.appendChild(analysisBlock(questionContent.signalWordAnalysis, "Signalwort-Analyse:"));
    }
    // HubSpot-Inhalte trainieren kein Englisch, sondern die Ausschlusslogik der Antwortoptionen.
    if (questionContent.answerLogic?.length) {
      panel.appendChild(analysisBlock(questionContent.answerLogic, "Ausschlusslogik:"));
    }
    if (questionContent.germanExplanation) {
      panel.appendChild(el("p", {}, [el("strong", { text: "Fachliche Erklärung: " }), document.createTextNode(questionContent.germanExplanation)]));
    }
    card.appendChild(panel);

    if (opts.skipConfidence) {
      // Teilfrage einer Reading-Passage: keine eigene Sicherheitsabfrage, nur einfacher Weiter-Button.
      const continueBtn = el("button", { class: "primary-btn", text: "Weiter", attrs: { type: "button" } });
      continueBtn.addEventListener(
        "click",
        () => {
          continueBtn.disabled = true;
          onAnswered({ correct });
        },
        { once: true }
      );
      card.appendChild(continueBtn);
      continueBtn.focus();
    } else {
      appendConfidenceAndContinue(card, correct, startTime, onAnswered);
    }
  }

  container.appendChild(card);
}

// ---------- Reading-Passage (Szenario + eine oder mehrere Fragen nacheinander) ----------

function renderReadingPassage(container, content, startTime, onAnswered) {
  const wrap = el("div", { class: "item-card" });
  wrap.appendChild(el("h3", { class: "item-kicker", text: platformConfig(platformOfContent(content)).scenarioKicker }));
  wrap.appendChild(disclaimerNote(content.disclaimer));
  wrap.appendChild(el("p", { class: "item-scenario", text: content.scenario }));
  container.appendChild(wrap);

  const questions = content.questions || [];
  let index = 0;
  let allCorrect = true;

  const questionHost = el("div");
  container.appendChild(questionHost);

  function next() {
    if (index >= questions.length) {
      clear(questionHost);
      const panel = el("div", { class: "explanation-panel" });
      if (content.signalWordAnalysis?.length) {
        panel.appendChild(analysisBlock(content.signalWordAnalysis, "Signalwort-Analyse (gesamte Passage):"));
      }
      if (content.answerLogic?.length) {
        panel.appendChild(analysisBlock(content.answerLogic, "Ausschlusslogik (gesamtes Szenario):"));
      }
      if (content.germanExplanation) {
        panel.appendChild(el("p", {}, [el("strong", { text: "Fachliche Erklärung: " }), document.createTextNode(content.germanExplanation)]));
      }
      container.appendChild(panel);
      appendConfidenceAndContinue(container, allCorrect, startTime, onAnswered);
      return;
    }
    clear(questionHost);
    const q = questions[index];
    const host = el("div");
    questionHost.appendChild(host);
    renderQuestion(host, q, { disclaimerAlreadyShown: true, skipConfidence: true }, startTime, (result) => {
      if (!result.correct) allCorrect = false;
      index += 1;
      next();
    });
  }

  next();
}

// Die einzelnen Teilfragen einer Reading-Passage zeigen (skipConfidence) keine eigene
// Sicherheitsabfrage — nur ein einfacher "Weiter"-Button. Die Sicherheitsabfrage und der
// Aufruf von onAnswered (mit Confidence/Bearbeitungszeit) erfolgen erst einmalig am Ende
// der gesamten Passage.

// ---------- Gemeinsame Sicherheitsabfrage + Weiter-Button ----------

function appendConfidenceAndContinue(host, correct, startTime, onAnswered) {
  const wrap = el("div", { class: "confidence-wrap" });
  wrap.appendChild(el("p", { class: "item-hint", text: "Wie sicher warst du dir? (1 = geraten, 5 = sehr sicher)" }));
  const scale = el("div", { class: "confidence-scale" });
  let chosen = 3;

  const btns = [1, 2, 3, 4, 5].map((n) => {
    const b = el("button", { class: "confidence-btn" + (n === 3 ? " confidence-selected" : ""), text: String(n), attrs: { type: "button" } });
    b.addEventListener("click", () => {
      chosen = n;
      scale.querySelectorAll(".confidence-btn").forEach((x) => x.classList.remove("confidence-selected"));
      b.classList.add("confidence-selected");
    });
    scale.appendChild(b);
    return b;
  });
  wrap.appendChild(scale);

  const continueBtn = el("button", { class: "primary-btn", text: "Weiter", attrs: { type: "button" } });
  continueBtn.addEventListener(
    "click",
    () => {
      continueBtn.disabled = true;
      const responseTimeMs = performance.now() - startTime;
      onAnswered({ correct, confidence: chosen, responseTimeMs });
    },
    { once: true }
  );
  wrap.appendChild(continueBtn);
  host.appendChild(wrap);
  continueBtn.focus();
}
