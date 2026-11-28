// views/quiz.js — Frage-/Prüfungsmodus: freies Üben (mit Filtern) und zeitlimitierte Mini-Prüfung.

import { state, refreshLearningData, domainMap, pathCertifications } from "../state.js";
import { EXAM_DRAFT, newSessionId, readDraft, writeDraft } from "../sessionDrafts.js";
import { markForReview, unmarkForReview, saveAnswers } from "../learning.js";
import { renderItem } from "../itemRenderer.js";
import { openExamEnglishModal } from "./examEnglish.js";
import { el, clear, shuffle, certLabel, disclaimerNote, focusContent, confirmDialog, createSessionChrome } from "../utils.js";

const MINI_EXAM_COUNT = 10;
const MINI_EXAM_SECONDS = 10 * 60;
const MIN_EXAM_ITEMS = 3;

function optionLetter(idx) {
  return String.fromCharCode(65 + idx);
}

function isExamEligible(item) {
  return item.contentType === "question" || item.contentType === "readingPassage";
}

function formatQuestionCountLabel(count) {
  return `${count} Frage${count === 1 ? "" : "n"}`;
}

/** Berechnet verfügbare Aufgaben und konkrete Filterhinweise getrennt für Gezielt üben und Mini-Prüfung. */
export function summarizeQuizPools(items, filters, domains, {
  progressById = state.progressByContentId,
  limit = MINI_EXAM_COUNT,
  defaultFilters = null
} = {}) {
  const practicePool = filterPool(items, filters, progressById);
  const examAll = items.filter(isExamEligible);
  const examPool = filterPool(examAll, filters, progressById);
  const examRunnable = examPool.length >= MIN_EXAM_ITEMS;
  const examHasMultiPart = examPool.length > limit &&
    examPool.some((item) => (item.content.questions?.length || 1) > 1);
  const examQuestionCount = !examRunnable
    ? 0
    : examPool.length <= limit
      ? expandExamItems(examPool).length
      : limit;

  let examReason = "";
  let examFix = null;
  if (!examRunnable) {
    if (filters.format === "vocabulary" || filters.format === "definition") {
      const fmtName = filters.format === "vocabulary" ? "Vokabel im Kontext" : "Definitions-Matching";
      examReason = `„${fmtName}“ gibt es nur bei Gezielt üben. Die Mini-Prüfung nutzt Szenario-Fragen und Reading-Passagen.`;
      const fixedCount = filterPool(examAll, { ...filters, format: "all" }, progressById).length;
      if (fixedCount >= MIN_EXAM_ITEMS) {
        examFix = { label: "Format für Mini-Prüfung auf prüfbare Fragen umstellen", patch: { format: "all" } };
      } else if (defaultFilters) {
        examFix = { label: "Filter zurücksetzen", patch: { ...defaultFilters } };
      }
    } else {
      examReason = examPool.length === 0
        ? "Keine Szenario-Fragen oder Reading-Passagen für den aktuellen Filter."
        : `Nur ${formatQuestionCountLabel(examPool.length)} im aktuellen Filter — für eine Mini-Prüfung sind mindestens ${MIN_EXAM_ITEMS} nötig.`;
      if (defaultFilters) {
        examFix = { label: "Filter zurücksetzen", patch: { ...defaultFilters } };
      }
    }
  }

  return {
    practiceCount: practicePool.length,
    examEligibleCount: examPool.length,
    examQuestionCount,
    examHasMultiPart,
    examRunnable,
    examReason,
    examFix
  };
}

let activeExam;

function loadMiniExam(path) {
  const saved = readDraft(EXAM_DRAFT);
  if (saved?.path !== path || !Number.isFinite(saved.deadline) ||
      !Array.isArray(saved.examKeys) || !saved.examKeys.length) return null;
  return saved;
}

export function hasActiveExam() {
  return Boolean(activeExam);
}

export function confirmLeave() {
  return activeExam?.confirmAbandon();
}

export function leave() {
  activeExam?.stop();
}

export async function render(container, ctx) {
  clear(container);
  const setup = el("section");
  const setupTitle = el("h1", { text: "Üben & Mini-Prüfung" });
  const refBtn = el("button", {
    class: "secondary-btn compact-link-btn",
    text: "Leitfaden: Prüfungsenglisch",
    attrs: { type: "button" },
    on: { click: () => openExamEnglishModal(refBtn, "Zurück zu Üben & Mini-Prüfung") }
  });
  const headRow = el("div", { class: "view-header-row" }, [setupTitle, refBtn]);
  setup.appendChild(headRow);
  setup.appendChild(el("p", {
    class: "view-lead",
    text: "Gezielt üben nutzt alle Formate und erklärt jede Antwort sofort. Die Mini-Prüfung wählt nur Szenario-Fragen und Reading-Passagen (mindestens 3) und wertet erst am Ende aus."
  }));
  container.appendChild(setup);

  await refreshLearningData();
  if (ctx.signal.aborted) return;
  const activePath = state.settings.certificationPath;
  const certifications = pathCertifications(activePath);
  const queryParams = new URLSearchParams(location.hash.split("?")[1] || "");
  const requestedDomain = queryParams.get("domain");
  const validDomain = requestedDomain && domainMap().has(requestedDomain) ? requestedDomain : "all";
  const defaultFilters = {
    certification: activePath === "administrator-full" ? "both" : activePath,
    examDomainId: "all", cefr: "both", format: "all", difficulty: "all", errorStatus: "all"
  };
  const filters = { ...defaultFilters, examDomainId: validDomain };

  const freeMeta = el("p", { class: "mode-card-meta" });
  const freeBtn = el("button", { class: "primary-btn", text: "Gezielt üben starten", attrs: { type: "button" } });
  const freeHint = el("p", { class: "mode-card-feedback", attrs: { role: "status", id: "mode-practice-feedback" } });
  const freeFixBtn = el("button", { class: "secondary-btn mode-fix-btn", text: "Filter zurücksetzen", attrs: { type: "button", hidden: "" } });

  const examMeta = el("p", { class: "mode-card-meta" });
  const examBtn = el("button", {
    class: "secondary-btn",
    text: `Mini-Prüfung starten (${MINI_EXAM_COUNT} Fragen, ${MINI_EXAM_SECONDS / 60} Min.)`,
    attrs: { type: "button", "aria-describedby": "mode-exam-feedback" }
  });
  const examHint = el("p", { class: "mode-card-feedback", attrs: { role: "status", id: "mode-exam-feedback" } });
  const examFixBtn = el("button", { class: "secondary-btn mode-fix-btn", attrs: { type: "button", hidden: "" } });

  const modeGrid = el("div", { class: "mode-grid" }, [
    el("section", { class: "card mode-card", attrs: { "aria-labelledby": "mode-practice-title" } }, [
      el("h2", { text: "Gezielt üben", attrs: { id: "mode-practice-title" } }),
      el("p", {
        class: "mode-card-text",
        text: "Einzelne Aufgaben mit Erklärung direkt nach der Antwort. Nutzt Vokabeln, Definitionen, Szenarien und Reading."
      }),
      freeMeta,
      freeBtn,
      freeHint,
      freeFixBtn
    ]),
    el("section", { class: "card mode-card", attrs: { "aria-labelledby": "mode-exam-title" } }, [
      el("h2", { text: "Mini-Prüfung", attrs: { id: "mode-exam-title" } }),
      el("p", {
        class: "mode-card-text",
        text: `Bis zu ${MINI_EXAM_COUNT} gemischte Szenario-Fragen und Reading-Passagen in ${MINI_EXAM_SECONDS / 60} Minuten. Auswertung erst nach dem Absenden.`
      }),
      examMeta,
      examBtn,
      examHint,
      examFixBtn
    ])
  ]);
  setup.appendChild(modeGrid);

  const filterCard = el("section", { class: "card quiz-filter-card", attrs: { "aria-labelledby": "quiz-filter-title" } });
  const filterCount = el("p", { class: "active-filter-count" });
  filterCard.appendChild(el("div", { class: "card-head-row" }, [
    el("h2", { text: "Filter", attrs: { id: "quiz-filter-title" } }),
    filterCount
  ]));
  filterCard.appendChild(el("p", {
    class: "filter-hint",
    text: "Exam-Domain = offizieller Themenbereich · CEFR = Englisch-Niveau (B1 Grundlagen, B2 komplexer). Vokabeln und Matching gelten nur für Gezielt üben."
  }));
  setup.appendChild(filterCard);

  function refreshFilterCount() {
    const active = Object.keys(defaultFilters).filter((key) => filters[key] !== defaultFilters[key]).length;
    filterCount.textContent = active === 0
      ? "Keine Filter aktiv"
      : `${active} Filter aktiv`;
    filterCount.classList.toggle("active-filter-count-on", active > 0);
  }

  const status = el("p", { class: "quiz-setup-status", attrs: { role: "status" } });
  filterCard.appendChild(status);

  const presetRow = el("div", { class: "quiz-preset-row", attrs: { role: "group", "aria-label": "Schnellfilter" } });
  const formHost = el("details", { class: "quiz-filters" });
  if (validDomain !== "all") formHost.open = true;
  formHost.appendChild(el("summary", { text: "Filter anpassen (Domain, Format, CEFR)" }));
  const fields = el("div");
  formHost.appendChild(fields);

  const savedExam = loadMiniExam(activePath);
  const pauseToSetup = () => ctx.navigate("#/quiz");
  const expired = savedExam && (savedExam.submitted || savedExam.deadline <= Date.now());
  let hasRunningDraft = Boolean(savedExam && !expired);
  let currentExamFixPatch = null;

  const presets = [
    { label: "Alle Übungen", patch: { ...defaultFilters } },
    { label: "Fehler wiederholen", patch: { ...defaultFilters, errorStatus: "wrong" } },
    { label: "Vorgemerkte", patch: { ...defaultFilters, errorStatus: "later" } },
    { label: "B2-Fokus", patch: { ...defaultFilters, cefr: "B2" } }
  ];
  let activePresetIdx = validDomain === "all" ? 0 : -1;
  let presetChips = [];

  function syncPresetChips() {
    activePresetIdx = presets.findIndex(({ patch }) =>
      Object.keys(defaultFilters).every((key) => filters[key] === patch[key])
    );
    presetChips.forEach((c, i) => {
      c.classList.toggle("confidence-selected", i === activePresetIdx);
      c.setAttribute("aria-pressed", String(i === activePresetIdx));
    });
  }

  function updateCountStatus(customStatus = "") {
    const summary = summarizeQuizPools(allQuizItems(), filters, domainMap(), { defaultFilters });
    if (customStatus) {
      status.textContent = customStatus;
    } else if (validDomain !== "all" && filters.examDomainId === validDomain) {
      status.textContent = `Gewählte Domain: ${summary.practiceCount} für Gezielt üben · ${summary.examEligibleCount} für Mini-Prüfung`;
    } else {
      status.textContent = `Treffer mit aktuellem Filter: ${summary.practiceCount} für Gezielt üben · ${summary.examEligibleCount} für Mini-Prüfung`;
    }
    refreshFilterCount();

    freeMeta.textContent = `Verfügbar: ${summary.practiceCount} Aufgabe${summary.practiceCount === 1 ? "" : "n"}`;
    freeBtn.disabled = summary.practiceCount === 0;
    freeBtn.textContent = summary.practiceCount > 0
      ? `Gezielt üben starten (${summary.practiceCount})`
      : "Keine passenden Aufgaben";
    freeHint.hidden = summary.practiceCount > 0;
    freeHint.textContent = summary.practiceCount > 0 ? "" : "Keine Aufgabe passt zum aktuellen Filter.";
    freeFixBtn.hidden = summary.practiceCount > 0;

    if (hasRunningDraft) {
      examMeta.textContent = "Aktuell läuft noch eine unterbrochene Mini-Prüfung.";
      examBtn.disabled = true;
      examBtn.textContent = "Mini-Prüfung läuft bereits";
      examHint.hidden = false;
      examHint.textContent = "Setze die laufende Prüfung oben fort oder verwirf sie für einen neuen Versuch.";
      examFixBtn.hidden = true;
      currentExamFixPatch = null;
      return;
    }

    if (!summary.examRunnable) {
      examMeta.textContent = `Prüfungsfähige Fragen im Filter: ${summary.examEligibleCount} (mind. ${MIN_EXAM_ITEMS} nötig)`;
      examBtn.disabled = true;
      examBtn.textContent = "Mini-Prüfung nicht verfügbar";
      examHint.hidden = false;
      examHint.textContent = summary.examReason;
      currentExamFixPatch = summary.examFix?.patch || null;
      examFixBtn.hidden = !summary.examFix;
      if (summary.examFix) examFixBtn.textContent = summary.examFix.label;
    } else {
      const qLabel = summary.examHasMultiPart ? `mind. ${summary.examQuestionCount}` : String(summary.examQuestionCount);
      examMeta.textContent = summary.examEligibleCount > MINI_EXAM_COUNT
        ? `Verfügbar: ${summary.examEligibleCount} Fragen (Auswahl: ${qLabel})`
        : `Verfügbar: ${qLabel} von max. ${MINI_EXAM_COUNT} Fragen`;
      examBtn.disabled = false;
      examBtn.textContent = `Mini-Prüfung starten (${qLabel} Fragen, ${MINI_EXAM_SECONDS / 60} Min.)`;
      examHint.hidden = true;
      examHint.textContent = "";
      examFixBtn.hidden = true;
      currentExamFixPatch = null;
    }
  }

  const syncFiltersUI = renderFilterForm(fields, filters, defaultFilters, activePath, certifications, () => {
    syncPresetChips();
    updateCountStatus();
  });

  function applyFilterPatch(patch) {
    Object.assign(filters, patch);
    syncPresetChips();
    syncFiltersUI();
    updateCountStatus();
  }

  freeFixBtn.addEventListener("click", () => applyFilterPatch(defaultFilters));
  examFixBtn.addEventListener("click", () => {
    if (currentExamFixPatch) applyFilterPatch(currentExamFixPatch);
  });

  presetChips = presets.map(({ label, patch }, idx) => {
    const chip = el("button", {
      class: `secondary-btn quiz-preset-chip${idx === activePresetIdx ? " confidence-selected" : ""}`,
      text: label,
      attrs: { type: "button", "aria-pressed": String(idx === activePresetIdx) }
    });
    chip.addEventListener("click", () => applyFilterPatch(patch));
    presetRow.appendChild(chip);
    return chip;
  });
  filterCard.appendChild(presetRow);
  filterCard.appendChild(formHost);
  fields.addEventListener("change", () => {
    syncPresetChips();
    updateCountStatus();
  });
  updateCountStatus();

  const runHost = el("div");
  container.appendChild(runHost);

  if (hasRunningDraft) {
    const resumeInfo = el("p");
    const resumeBanner = el("div", { class: "card studio-celebration-card" }, [
      el("h2", { text: "Laufende Mini-Prüfung gefunden" }),
      resumeInfo,
      el("div", { class: "quiz-actions" }, [
        el("button", {
          class: "primary-btn",
          text: "Prüfung fortsetzen",
          attrs: { type: "button" },
          on: {
            click: () => {
              clearInterval(resumeTimer);
              const latest = loadMiniExam(activePath);
              resumeBanner.remove();
              hasRunningDraft = false;
              updateCountStatus();
              if (!latest || latest.deadline !== savedExam.deadline || latest.sessionId !== savedExam.sessionId) {
                showSetup("Dieser Prüfungsentwurf ist nicht mehr verfügbar.");
                return;
              }
              setup.hidden = true;
              startMiniExam(runHost, [], showSetup, pauseToSetup, latest, ctx.navigate);
            }
          }
        }),
        el("button", {
          class: "secondary-btn",
          text: "Verwerfen",
          attrs: { type: "button" },
          on: {
            click: () => {
              clearInterval(resumeTimer);
              const latest = loadMiniExam(activePath);
              if (latest?.deadline === savedExam.deadline && latest.sessionId === savedExam.sessionId &&
                  !writeDraft(EXAM_DRAFT, null)) {
                status.textContent = "Der Prüfungsentwurf konnte nicht gelöscht werden.";
                return;
              }
              resumeBanner.remove();
              hasRunningDraft = false;
              showSetup("Prüfungsentwurf verworfen.");
            }
          }
        })
      ])
    ]);
    const updateResumeTime = () => {
      const remainingSec = Math.max(0, Math.ceil((savedExam.deadline - Date.now()) / 1000));
      if (remainingSec <= 0) {
        clearInterval(resumeTimer);
        resumeBanner.remove();
        hasRunningDraft = false;
        setup.hidden = true;
        startMiniExam(runHost, [], showSetup, pauseToSetup, savedExam, ctx.navigate);
        return;
      }
      const mins = Math.floor(remainingSec / 60);
      const secs = String(remainingSec % 60).padStart(2, "0");
      resumeInfo.textContent = `Die Prüfungszeit läuft weiter: aktuell noch ${mins}:${secs} Min. Restzeit · ${savedExam.answers?.length || 0} von ${savedExam.examKeys.length} Fragen beantwortet.`;
    };
    updateResumeTime();
    const resumeTimer = setInterval(updateResumeTime, 1000);
    ctx.signal.addEventListener("abort", () => clearInterval(resumeTimer), { once: true });
    setup.insertBefore(resumeBanner, modeGrid);
  }

  function showSetup(message = "") {
    runHost.replaceChildren();
    setup.hidden = false;
    updateCountStatus(message);
    focusContent(setupTitle, { page: true });
  }

  freeBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems(), filters);
    if (!pool.length) {
      updateCountStatus("Keine passenden Übungen. Passe die Filter an.");
      formHost.open = true;
      return;
    }
    setup.hidden = true;
    startFreePractice(runHost, shuffle(pool), showSetup);
  });

  examBtn.addEventListener("click", () => {
    const pool = filterPool(allQuizItems().filter(isExamEligible), filters);
    if (pool.length < MIN_EXAM_ITEMS) {
      updateCountStatus(`Für eine Mini-Prüfung brauchst du mindestens ${MIN_EXAM_ITEMS} Szenariofragen oder Reading-Passagen.`);
      formHost.open = true;
      return;
    }
    const isFiltered = Object.keys(defaultFilters).some((key) => filters[key] !== defaultFilters[key]);
    setup.hidden = true;
    startMiniExam(runHost, selectExamItems(pool, domainMap(), MINI_EXAM_COUNT), showSetup, pauseToSetup, null, ctx.navigate, { isFiltered });
  });

  if (expired) {
    setup.hidden = true;
    startMiniExam(runHost, [], showSetup, pauseToSetup, savedExam, ctx.navigate);
  }
}

// ---------- Filterformular ----------

function renderFilterForm(host, filters, defaultFilters, activePath, certifications, onReset) {
  clear(host);
  // Domain-Auswahl nur mit Domains des aktiven Lernpfads bestücken (bei administrator-full: beide Domain-Sets).
  const domains = [...domainMap().values()].filter((d) => certifications.includes(d.certification));
  const hasMultiPartPassages = state.content.readingPassages.some((p) => (p.questions?.length || 0) > 1);
  const formatOptions = [
    ["all", "Alle"],
    ["vocabulary", "Vokabel im Kontext"],
    ["definition", "Definitions-Matching"],
    ["question", "Szenario-Frage"],
    ["readingPassage", "Reading-Passage (alle)"],
    ...(hasMultiPartPassages
      ? [
          ["readingPassage-single", "Reading-Passage (einteilig)"],
          ["readingPassage-multi", "Reading-Passage (mehrteilig)"]
        ]
      : [])
  ];
  const selects = [];

  const row1 = el("div", { class: "filter-row" });
  const domField = selectField("Exam-Domain", filters, "examDomainId", [
    ["all", "Alle"], ...domains.map((d) => [d.id, `${d.name} (${certLabel(d.certification)})`])
  ]);
  selects.push({ key: "examDomainId", el: domField.querySelector("select") });
  row1.appendChild(domField);

  const fmtField = selectField("Übungsformat", filters, "format", formatOptions);
  selects.push({ key: "format", el: fmtField.querySelector("select") });
  row1.appendChild(fmtField);

  const errField = selectField("Fehlerstatus", filters, "errorStatus", [
    ["all", "Alle"], ["wrong", "Nur zuletzt falsch"], ["later", "Als 'später wiederholen' markiert"], ["new", "Nur neue Inhalte"]
  ]);
  selects.push({ key: "errorStatus", el: errField.querySelector("select") });
  row1.appendChild(errField);
  host.appendChild(row1);

  const secondaryDetails = el("details", { class: "quiz-filters-secondary" });
  secondaryDetails.appendChild(el("summary", { text: "Weitere Filter (Zertifizierung, CEFR, Schwierigkeit)" }));
  const row2 = el("div", { class: "filter-row" });
  if (activePath === "administrator-full") {
    const f = selectField("Zertifizierung", filters, "certification", [
      ["both", "Beide Pfade"], ["foundations", "Nur Foundations"], ["administrator", "Nur Administrator"]
    ]);
    selects.push({ key: "certification", el: f.querySelector("select") });
    row2.appendChild(f);
  }
  const cefrField = selectField("CEFR-Level", filters, "cefr", [
    ["both", "Beide"], ["B1", "B1"], ["B2", "B2"]
  ]);
  selects.push({ key: "cefr", el: cefrField.querySelector("select") });
  row2.appendChild(cefrField);

  const diffField = selectField("Schwierigkeit", filters, "difficulty", [
    ["all", "Alle"], ["easy", "Leicht"], ["medium", "Mittel"], ["hard", "Schwer"]
  ]);
  selects.push({ key: "difficulty", el: diffField.querySelector("select") });
  row2.appendChild(diffField);
  secondaryDetails.appendChild(row2);
  host.appendChild(secondaryDetails);

  function syncSelects() {
    for (const s of selects) s.el.value = filters[s.key];
  }

  const resetBtn = el("button", {
    class: "secondary-btn",
    text: "Filter zurücksetzen",
    attrs: { type: "button" },
    on: {
      click: () => {
        Object.assign(filters, defaultFilters);
        syncSelects();
        onReset?.();
      }
    }
  });
  host.appendChild(el("div", { class: "filter-actions-row" }, [resetBtn]));
  return syncSelects;
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

function filterPool(items, filters, progressById = state.progressByContentId) {
  return items.filter((i) => {
    const c = i.content;
    if (filters.certification !== "both" && c.certification !== filters.certification) return false;
    if (filters.examDomainId !== "all" && c.examDomainId !== filters.examDomainId) return false;
    if (filters.cefr !== "both" && c.cefr !== filters.cefr) return false;
    if (filters.format !== "all") {
      if (filters.format === "readingPassage-single") {
        if (i.contentType !== "readingPassage" || (c.questions?.length || 0) !== 1) return false;
      } else if (filters.format === "readingPassage-multi") {
        if (i.contentType !== "readingPassage" || (c.questions?.length || 0) <= 1) return false;
      } else if (i.contentType !== filters.format) {
        return false;
      }
    }
    if (filters.difficulty !== "all" && c.difficulty !== filters.difficulty) return false;
    const progress = progressById.get(c.id);
    if (filters.errorStatus === "wrong" && progress?.lastResult !== "incorrect") return false;
    if (filters.errorStatus === "later" && progress?.flag !== "later") return false;
    if (filters.errorStatus === "new" && progress) return false;
    return true;
  });
}

// ---------- Freies Üben ----------

function startFreePractice(runHost, pool, showSetup, title = "Gezielt üben") {
  const host = el("div");
  runHost.replaceChildren(host);
  let index = 0;
  const stats = { total: 0, correct: 0 };
  const status = el("p", { attrs: { role: "status" } });

  const chrome = createSessionChrome({
    onOpenRef: (btn) => openExamEnglishModal(btn, "Zurück zur Übung")
  });
  const itemHost = el("div");
  const toolbar = el("div", { class: "quiz-toolbar session-toolbar-bottom" });
  const stopBtn = el("button", { class: "secondary-btn", text: "Beenden", attrs: { type: "button" } });
  const laterBtn = el("button", {
    class: "secondary-btn",
    text: "Später wiederholen markieren",
    attrs: { type: "button", "aria-pressed": "false" }
  });
  toolbar.appendChild(laterBtn);
  toolbar.appendChild(stopBtn);

  const heading = el("h1", { text: title });
  host.append(heading, chrome.statusBar, chrome.sessionTrack, itemHost, toolbar, status);

  stopBtn.addEventListener("click", showFreeResult);

  function showFreeResult() {
    clear(host);
    const resultHeading = el("h1", { text: "Übung beendet" });
    const pct = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
    const summaryCard = el("div", { class: "card studio-celebration-card" }, [
      el("p", {
        class: "big-number",
        text: `${stats.correct} / ${stats.total}`,
        attrs: { "aria-label": `${stats.correct} von ${stats.total} richtig` }
      }),
      el("p", { text: `Trefferquote: ${pct}%` })
    ]);
    const back = el("button", {
      class: "primary-btn", text: "Zur Übungsauswahl",
      attrs: { type: "button" }, on: { click: () => showSetup() }
    });
    host.append(resultHeading, summaryCard, back);
    focusContent(resultHeading, { page: true });
  }

  async function step() {
    if (index >= pool.length) {
      showFreeResult();
      return;
    }
    chrome.update(`Frage ${index + 1} von ${pool.length}`, ((index + 1) / pool.length) * 100);
    const current = pool[index];
    status.textContent = "";
    status.setAttribute("role", "status");
    const updateLaterButton = (marked) => {
      laterBtn.textContent = marked ? "✓ Vorgemerkt" : "Später wiederholen markieren";
      laterBtn.setAttribute("aria-pressed", String(marked));
    };
    updateLaterButton(state.progressByContentId.get(current.content.id)?.flag === "later");
    laterBtn.onclick = async () => {
      laterBtn.disabled = true;
      try {
        const currentlyMarked = state.progressByContentId.get(current.content.id)?.flag === "later";
        if (currentlyMarked) await unmarkForReview(current);
        else await markForReview(current);
        if (pool[index] === current) {
          const markedNow = state.progressByContentId.get(current.content.id)?.flag === "later";
          updateLaterButton(markedNow);
          status.setAttribute("role", "status");
          status.textContent = markedNow ? "Für die Lerneinheit vorgemerkt." : "Vormerkung entfernt.";
        }
      } catch {
        if (pool[index] === current) {
          status.setAttribute("role", "alert");
          status.textContent = "Die Markierung konnte nicht gespeichert werden.";
        }
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
          focusContent(status);
          return;
        }
        stats.total += 1;
        stats.correct += result.correct ? 1 : 0;
        index += 1;
        await step();
        window.scrollTo(0, 0);
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

/** Fächert Reading-Passagen in alle Teilfragen auf, damit keine Teilfrage stillschweigend entfällt. */
export function expandExamItems(pool) {
  const expanded = [];
  for (const item of pool) {
    if (item.contentType === "readingPassage") {
      const subQuestions = item.content.questions || [];
      subQuestions.forEach((q, subIndex) => {
        expanded.push({
          item,
          key: `${item.content.id}#${subIndex}`,
          q: { ...q, scenario: item.content.scenario, source: item.content }
        });
      });
    } else {
      expanded.push({ item, key: item.content.id, q: { ...item.content, source: item.content } });
    }
  }
  return expanded;
}

/** Behält Lernstand-ID und Szenario einer Passage, übt aber nur die betroffenen Teilfragen. */
export function reviewPracticeItems(entries) {
  const items = new Map();
  for (const { item, q } of entries) {
    const id = item.content.id;
    if (item.contentType !== "readingPassage") {
      items.set(id, item);
      continue;
    }
    if (!items.has(id)) {
      items.set(id, { ...item, content: { ...item.content, questions: [] } });
    }
    items.get(id).content.questions.push(q);
  }
  return [...items.values()];
}

function startMiniExam(runHost, pool, showSetup, pauseToSetup, savedExam = null, navigate = (hash) => { location.hash = hash; }, { isFiltered = false } = {}) {
  const host = el("section", { class: "exam-run" });
  runHost.replaceChildren(host);
  const examIsFiltered = savedExam ? Boolean(savedExam.isFiltered) : Boolean(isFiltered);
  let examQuestions;
  if (savedExam) {
    const allExpanded = expandExamItems(
      allQuizItems().filter(isExamEligible)
    );
    const byKey = new Map(allExpanded.map((entry) => [entry.key, entry]));
    examQuestions = savedExam.examKeys.map((k) => byKey.get(k));
  } else {
    examQuestions = expandExamItems(pool);
  }
  if (!examQuestions.length || examQuestions.some((entry) => !entry)) {
    writeDraft(EXAM_DRAFT, null);
    showSetup("Die gespeicherte Mini-Prüfung konnte nicht wiederhergestellt werden.");
    return;
  }
  const optionsByKey = new Map(examQuestions.map(({ key, q }) => [key, new Set(q.options.map((option) => option.id))]));
  const answers = new Map();
  for (const entry of Array.isArray(savedExam?.answers) ? savedExam.answers : []) {
    if (!Array.isArray(entry)) continue;
    const [key, ids] = entry;
    if (!optionsByKey.has(key) || !Array.isArray(ids)) continue;
    const selected = ids.filter((id) => optionsByKey.get(key).has(id));
    if (selected.length) answers.set(key, new Set(selected));
  }
  const timeByKey = new Map(
    (Array.isArray(savedExam?.timeByKey) ? savedExam.timeByKey : [])
      .filter((entry) => Array.isArray(entry) && optionsByKey.has(entry[0]) && Number.isFinite(entry[1]) && entry[1] >= 0)
  );
  const sessionId = savedExam?.sessionId ?? newSessionId();
  const ownerId = newSessionId();
  let lastStoredRevision = savedExam?.revision ?? 0;
  let initialized = false;
  let superseded = false;
  const deadline = savedExam ? savedExam.deadline : Date.now() + MINI_EXAM_SECONDS * 1000;
  let current = savedExam && Number.isInteger(savedExam.current)
    ? Math.max(0, Math.min(examQuestions.length - 1, savedExam.current))
    : 0;
  let questionShownAt = performance.now();
  let currentKey = examQuestions[current]?.key ?? null;
  let timerHandle;
  let pendingConfirmation;
  let lastTimerText = "";

  const draftStatus = el("p", { class: "quiz-setup-status", attrs: { role: "status" } });

  function isOutdated() {
    const latest = readDraft(EXAM_DRAFT);
    if (!initialized) {
      if (!savedExam) return false;
      // Ältere Entwürfe erhalten ihre ID erst beim ersten Schreiben durch diesen Tab.
      return !latest || latest.sessionId !== savedExam.sessionId ||
        Boolean(latest.submitted) !== Boolean(savedExam.submitted) ||
        (latest.revision ?? 0) !== lastStoredRevision;
    }
    return !latest || latest.sessionId !== sessionId || Boolean(latest.submitted) ||
      latest.ownerId !== ownerId || (latest.revision ?? 0) !== lastStoredRevision;
  }

  function handleSuperseded() {
    if (superseded) return;
    superseded = true;
    stop();
    if (!host.isConnected) return;
    const msg = el("p", {
      attrs: { role: "alert" },
      text: "Diese Mini-Prüfung wird bereits in einem anderen Tab fortgesetzt oder wurde abgegeben. Dieser Tab wurde angehalten, damit keine Antworten verloren gehen."
    });
    const reloadBtn = el("button", {
      class: "primary-btn",
      text: "Aktuellen Stand öffnen",
      attrs: { type: "button" },
      on: { click: () => pauseToSetup() }
    });
    host.replaceChildren(el("h1", { text: "Mini-Prüfung" }), msg, reloadBtn);
    focusContent(msg, { page: true });
  }

  function persistExamState(submitted = null) {
    if (superseded || isOutdated()) {
      draftStatus.textContent = "Der Prüfungsentwurf ist in diesem Tab nicht mehr aktuell.";
      return false;
    }
    const nextRevision = lastStoredRevision + 1;
    const stored = writeDraft(EXAM_DRAFT, {
      path: state.settings.certificationPath,
      sessionId,
      ownerId,
      revision: nextRevision,
      submitted,
      isFiltered: examIsFiltered,
      deadline,
      current,
      examKeys: examQuestions.map((entry) => entry.key),
      answers: [...answers.entries()].map(([k, set]) => [k, [...set]]),
      timeByKey: [...timeByKey.entries()]
    });
    if (stored) {
      lastStoredRevision = nextRevision;
      initialized = true;
    }
    draftStatus.textContent = stored ? "" : "Der Prüfungsentwurf konnte nicht gespeichert werden.";
    return stored;
  }

  const title = el("h1", { text: "Mini-Prüfung" });
  const timer = el("p", { class: "quiz-timer", attrs: { role: "timer" } });
  const questionIndicator = el("p", { class: "exam-stat-current" });
  const answerCount = el("p", { class: "exam-stat-answered", attrs: { role: "status" } });
  const stats = el("div", { class: "exam-stats" }, [questionIndicator, answerCount, timer]);
  const qHost = el("div");
  const prev = el("button", { class: "secondary-btn", attrs: { type: "button" } }, [
    el("kbd", { class: "keycap", text: "←", attrs: { "aria-hidden": "true" } }),
    document.createTextNode(" Zurück")
  ]);
  const next = el("button", { class: "secondary-btn", attrs: { type: "button" } }, [
    document.createTextNode("Weiter "),
    el("kbd", { class: "keycap", text: "→", attrs: { "aria-hidden": "true" } })
  ]);
  const actions = el("div", { class: "exam-actions" });
  const submitBtn = el("button", { class: "primary-btn", text: "Abgeben", attrs: { type: "button" } });
  const cancelBtn = el("button", { class: "secondary-btn", text: "Prüfung abbrechen", attrs: { type: "button" } });
  const pauseBtn = el("button", {
    class: "secondary-btn",
    text: "Unterbrechen (Zeit läuft weiter)",
    attrs: { type: "button", "aria-describedby": "exam-pause-hint" }
  });
  const pauseHint = el("p", {
    class: "item-hint exam-pause-hint",
    text: "Hinweis: Beim Unterbrechen bleiben deine Antworten gespeichert, die Prüfungszeit läuft aber im Hintergrund weiter.",
    attrs: { id: "exam-pause-hint" }
  });
  actions.append(submitBtn, pauseBtn, cancelBtn);

  const jumpSummary = el("summary", {
    class: "exam-jump-summary",
    text: `Fragenübersicht (0/${examQuestions.length} beantwortet)`
  });
  const jumpList = el("div", { class: "exam-jump-list" });
  const jumpDetails = el("details", { class: "exam-jump-details" }, [jumpSummary, jumpList]);
  const jump = el("nav", { class: "exam-jump", attrs: { "aria-label": "Fragenübersicht" } }, [jumpDetails]);
  const questionButtons = examQuestions.map((_, index) => {
    const button = el("button", { class: "secondary-btn", text: String(index + 1), attrs: { type: "button" } });
    button.addEventListener("click", () => goTo(index));
    jumpList.appendChild(button);
    return button;
  });
  const navigation = el("div", { class: "quiz-nav" }, [prev, next]);
  host.append(title, stats, jump, qHost, navigation, disclaimerNote(), actions, pauseHint, draftStatus);

  function onExamKeydown(ev) {
    if (activeExam !== attempt || !host.isConnected || pendingConfirmation || document.querySelector(".modal-overlay")) return;
    if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const onOptionInput = ev.target.matches(".fall-option-input");
    if (/^[1-9]$/.test(ev.key) && qHost.contains(ev.target)) {
      const input = qHost.querySelectorAll(".fall-option-input")[Number(ev.key) - 1];
      if (input && !input.disabled) {
        ev.preventDefault();
        input.click();
      }
    } else if (ev.key === "ArrowLeft" && !onOptionInput && !prev.disabled) {
      ev.preventDefault();
      prev.click();
    } else if (ev.key === "ArrowRight" && !onOptionInput && !next.disabled) {
      ev.preventDefault();
      next.click();
    }
  }

  function onStorageChange(ev) {
    if (ev.key === EXAM_DRAFT && activeExam === attempt && isOutdated()) {
      handleSuperseded();
    }
  }

  const attempt = { stop, confirmAbandon };
  activeExam = attempt;
  window.addEventListener("pagehide", saveBeforeLeaving);
  window.addEventListener("storage", onStorageChange);
  host.addEventListener("keydown", onExamKeydown);

  function saveBeforeLeaving() {
    if (superseded || isOutdated()) return false;
    recordElapsed();
    return persistExamState();
  }

  function stop() {
    clearInterval(timerHandle);
    pendingConfirmation?.abort();
    window.removeEventListener("pagehide", saveBeforeLeaving);
    window.removeEventListener("storage", onStorageChange);
    host.removeEventListener("keydown", onExamKeydown);
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

  async function confirmAbandon() {
    const confirmed = await ask("Die Prüfung läuft noch. Wenn du sie verlässt, wird dieser Versuch verworfen.", {
      cancelText: "Weiterprüfen", confirmText: "Versuch verwerfen", danger: true
    });
    if (!confirmed) return false;
    if (isOutdated()) return true;
    if (writeDraft(EXAM_DRAFT, null)) return true;
    draftStatus.textContent = "Der Prüfungsentwurf konnte nicht gelöscht werden.";
    return false;
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

  function recordElapsed() {
    if (currentKey == null) return;
    const elapsed = Math.max(0, performance.now() - questionShownAt);
    timeByKey.set(currentKey, (timeByKey.get(currentKey) || 0) + elapsed);
    questionShownAt = performance.now();
  }

  function refreshStatus() {
    questionIndicator.textContent = `Frage ${current + 1} / ${examQuestions.length}`;
    answerCount.textContent = `${answers.size} beantwortet`;
    jumpSummary.textContent = `Fragenübersicht (${answers.size}/${examQuestions.length} beantwortet)`;
    for (const [index, button] of questionButtons.entries()) {
      const answered = answers.has(examQuestions[index].key);
      button.setAttribute("aria-label", `Frage ${index + 1}, ${answered ? "beantwortet" : "offen"}`);
      button.classList.toggle("exam-jump-answered", answered);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    }
  }

  function goTo(index, moveFocus = true) {
    if (activeExam !== attempt) return;
    if (moveFocus) recordElapsed();
    current = index;
    const { key, q } = examQuestions[current];
    currentKey = key;
    questionShownAt = performance.now();
    const selected = answers.get(key) || new Set();
    const card = el("div", { class: "item-card fallakte exam-question" });
    const heading = el("h2", { class: "fallakte-step exam-question-heading", text: `Frage ${current + 1} von ${examQuestions.length}` });
    const domain = domainMap().get(q.source?.examDomainId || q.examDomainId);
    const metaLabel = [domain?.name, q.source?.cefr || q.cefr ? `CEFR ${q.source?.cefr || q.cefr}` : ""].filter(Boolean).join(" · ");
    card.appendChild(el("header", { class: "fallakte-head" }, [
      heading,
      metaLabel ? el("p", { class: "fallakte-source", text: metaLabel }) : null
    ]));
    if (q.scenario) card.appendChild(el("p", { class: "item-scenario", text: q.scenario, attrs: { lang: "en" } }));
    card.appendChild(el("p", { class: "fallakte-question", text: q.questionText || q.text, attrs: { lang: "en" } }));
    const multi = q.type === "multiple-select";
    if (multi) card.appendChild(el("p", { class: "item-hint", text: "Wähle alle zutreffenden Antworten." }));

    const instanceName = `exam-q-${current}`;
    const fieldset = el("fieldset", { class: "fall-options" }, [
      el("legend", { class: "visually-hidden", text: "Antwort auswählen" })
    ]);
    q.options.forEach((option, idx) => {
      const input = el("input", {
        class: multi ? "fall-option-input fall-option-checkbox" : "fall-option-input",
        attrs: { type: multi ? "checkbox" : "radio", name: instanceName, value: option.id }
      });
      input.checked = selected.has(option.id);
      input.addEventListener("change", () => {
        if (activeExam !== attempt || Date.now() >= deadline) {
          updateTimer();
          return;
        }
        if (isOutdated()) {
          handleSuperseded();
          return;
        }
        const wasSelected = selected.has(option.id);
        if (!multi) selected.clear();
        if (multi && wasSelected) selected.delete(option.id);
        else selected.add(option.id);
        if (selected.size) answers.set(key, selected);
        else answers.delete(key);
        refreshStatus();
        if (!persistExamState() && isOutdated()) handleSuperseded();
      });
      fieldset.appendChild(el("label", {
        class: "fall-option",
        attrs: { "data-opt-id": option.id }
      }, [
        input,
        el("span", { class: "fall-option-letter", text: optionLetter(idx), attrs: { "aria-hidden": "true" } }),
        el("span", { class: "fall-option-text", text: option.text, attrs: { lang: "en" } })
      ]));
    });
    card.appendChild(fieldset);
    qHost.replaceChildren(card);
    prev.disabled = current === 0;
    next.disabled = current === examQuestions.length - 1;
    refreshStatus();
    if (!persistExamState() && isOutdated()) {
      handleSuperseded();
      return;
    }
    if (moveFocus) focusContent(heading);
  }

  async function submit(expired = false) {
    if (activeExam !== attempt || !host.isConnected) return;
    if (isOutdated()) {
      stop();
      pauseToSetup();
      return;
    }
    if (!savedExam?.submitted && !(savedExam?.deadline <= Date.now() && !initialized)) recordElapsed();
    const stored = persistExamState(expired ? "expired" : "manual");
    stop();
    const calculating = el("p", { attrs: { role: "status" }, text: "Mini-Prüfung wird ausgewertet…" });
    host.replaceChildren(calculating);
    focusContent(calculating, { page: true });

    const graded = examQuestions.map(({ item, key, q }, index) => {
      const selected = answers.get(key) || new Set();
      const correctIds = q.options.filter((option) => option.correct).map((option) => option.id);
      const correct = correctIds.length === selected.size && correctIds.every((id) => selected.has(id));
      return { item, key, q, index, selected, correct };
    });
    const answered = graded.filter(({ selected }) => selected.size);
    const wrong = answered.filter(({ correct }) => !correct);
    const open = graded.filter(({ selected }) => !selected.size);
    const correctCount = answered.length - wrong.length;
    let saveError = false;

    const byContentId = new Map();
    for (const entry of graded) {
      if (!entry.selected.size) continue;
      const id = entry.item.content.id;
      const existing = byContentId.get(id) || { item: entry.item, correct: true, responseTimeMs: 0 };
      if (!entry.correct) existing.correct = false;
      existing.responseTimeMs += Math.round(timeByKey.get(entry.key) || 0);
      byContentId.set(id, existing);
    }

    try {
      if (byContentId.size) {
        await saveAnswers([...byContentId.values()].map(({ item, correct, responseTimeMs }) => ({
          item,
          result: { correct, responseTimeMs },
          mode: "exam"
        })), `exam:${sessionId}`);
      }
    } catch {
      saveError = true;
    }
    if (!saveError && readDraft(EXAM_DRAFT)?.sessionId === sessionId) writeDraft(EXAM_DRAFT, null);
    if (!host.isConnected) return;

    const pct = graded.length ? Math.round((correctCount / graded.length) * 100) : 0;
    const resultTitle = el("h1", { text: expired ? "Zeit abgelaufen — Ergebnisse" : "Mini-Prüfung ausgewertet" });

    // 1) Ergebnis
    const scoreCard = el("section", { class: "card studio-celebration-card exam-result-section" }, [
      el("p", {
        class: "big-number",
        text: `${correctCount} von ${graded.length}`,
        attrs: { "aria-label": `${correctCount} von ${graded.length} richtig` }
      }),
      el("p", { text: `Trefferquote: ${pct} %` }),
      el("p", {
        class: "item-hint",
        text: `Orientierungswert: Offizielle Bestehensgrenze 62 % (Foundations, 40 Fragen) bzw. 68 % (Administrator, 60 Fragen). Hinweis: Dieses Ergebnis beruht auf einer kleinen${examIsFiltered ? " und gefilterten" : ""} Stichprobe (${graded.length} Fragen).`
      })
    ]);

    // 2) Beobachtung — nur belegbare Fakten, keine Ursachen-Vermutungen
    const observationItems = [
      `${answered.length} von ${graded.length} Fragen beantwortet`,
      `${wrong.length} falsche Antwort${wrong.length === 1 ? "" : "en"}`
    ];
    if (open.length) {
      observationItems.push(`${open.length} unbeantwortet — sie zählen im Ergebnis als nicht richtig`);
    }
    const wrongByDomain = new Map();
    for (const entry of wrong) {
      const id = entry.item.content.examDomainId;
      wrongByDomain.set(id, (wrongByDomain.get(id) || 0) + 1);
    }
    const domains = domainMap();
    const topDomain = [...wrongByDomain.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topDomain && topDomain[1] >= 2) {
      observationItems.push(`In diesem Versuch lagen ${topDomain[1]} Fehler im Bereich „${domains.get(topDomain[0])?.name || topDomain[0]}“`);
    }
    const observationCard = el("section", { class: "card exam-result-section" }, [
      el("h2", { text: "Beobachtung" }),
      el("ul", { class: "exam-observation-list" }, observationItems.map((text) => el("li", { text })))
    ]);

    // 3) Nächste Aktion
    const resultActions = el("div", { class: "exam-actions exam-result-actions" });
    const back = el("button", {
      class: "secondary-btn", text: "Zur Übungsauswahl",
      attrs: { type: "button" }, on: { click: () => showSetup() }
    });
    if (!wrong.length && !open.length) {
      resultActions.appendChild(el("button", {
        class: "primary-btn",
        text: "Weiterlernen",
        attrs: { type: "button" },
        on: { click: () => navigate("#/learn") }
      }));
    } else {
      resultActions.appendChild(el("button", {
        class: "primary-btn",
        text: wrong.length ? "Fehler gezielt üben" : "Offene Fragen üben",
        attrs: { type: "button" },
        on: { click: () => startFreePractice(runHost, reviewPracticeItems(wrong.length ? wrong : open), showSetup, wrong.length ? "Gezielte Wiederholung" : "Offene Fragen") }
      }));
      if (wrong.length && open.length) {
        resultActions.appendChild(el("button", {
          class: "secondary-btn",
          text: "Offene Fragen üben",
          attrs: { type: "button" },
          on: { click: () => startFreePractice(runHost, reviewPracticeItems(open), showSetup, "Offene Fragen") }
        }));
      }
    }
    resultActions.appendChild(back);

    host.replaceChildren(resultTitle, scoreCard, observationCard);
    if (expired) host.appendChild(el("p", { class: "item-hint", text: "Die Zeit ist abgelaufen. Deine bisherigen Antworten wurden ausgewertet." }));
    if (saveError) {
      host.appendChild(el("p", { attrs: { role: "alert" }, text: stored
        ? "Dein Ergebnis ist sichtbar. Öffne die Prüfungsansicht erneut, um das Speichern zu wiederholen."
        : "Dein Ergebnis ist sichtbar. Der Lernstand konnte nicht gespeichert werden." }));
    }
    host.appendChild(resultActions);

    // 4) Detailübersicht
    host.appendChild(el("h2", { text: "Antworten ansehen" }));
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
  pauseBtn.addEventListener("click", async () => {
    if (isOutdated()) {
      handleSuperseded();
      return;
    }
    if (Date.now() >= deadline) {
      submit(true);
      return;
    }
    const confirmed = await ask(
      "Deine Antworten bleiben gespeichert. Die Prüfungszeit läuft im Hintergrund weiter. Möchtest du die Prüfung jetzt unterbrechen?",
      { cancelText: "Weiterprüfen", confirmText: "Unterbrechen (Zeit läuft weiter)" }
    );
    if (!confirmed) return;
    if (!saveBeforeLeaving()) return;
    stop();
    pauseToSetup();
  });
  cancelBtn.addEventListener("click", async () => {
    if (!(await confirmAbandon())) return;
    stop();
    showSetup("Mini-Prüfung abgebrochen.");
  });

  if (savedExam?.submitted || deadline <= Date.now()) {
    submit(savedExam?.submitted !== "manual");
    return;
  }
  goTo(current, false);
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
  const deText = q.questionTextDe || q.textDe;
  if (deText) detail.appendChild(el("p", { class: "item-question-de", text: deText, attrs: { lang: "de" } }));
  if (q.germanExplanation) detail.appendChild(el("p", { text: q.germanExplanation }));
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
