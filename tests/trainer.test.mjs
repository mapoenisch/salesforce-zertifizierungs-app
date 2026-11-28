import assert from "node:assert/strict";
import test from "node:test";
import * as sm2 from "../sfz_app/js/sm2.js";
import * as plan from "../sfz_app/js/weeklyPlan.js";
import { dueItems, summarizeActivity } from "../sfz_app/js/learning.js";
import { selectExamItems, expandExamItems } from "../sfz_app/js/views/quiz.js";
import { selectSessionItems } from "../sfz_app/js/views/learn.js";
import { validateBackup } from "../sfz_app/js/exportImport.js";

process.env.TZ = "Europe/Berlin";

test("erste Vokabelabfrage bleibt am nächsten lokalen Kalendertag", () => {
  assert.equal(sm2.introProgress({}, "vocabulary", new Date(2026, 10, 26, 0, 30)).nextReviewDate, "2026-11-27");
});

test("Woche beginnt auch nach einer Zeitumstellung um Mitternacht", () => {
  assert.equal(plan.getCurrentWeekNumber("2026-03-23", new Date(2026, 2, 30, 0, 30)), 2);
  assert.equal(plan.weekDateRange("2026-03-23", 1).weekEnd.getHours(), 0);
});

test("Aktivitäten nach Ende des Plans gehören zur aktuellen Woche", () => {
  const later = new Date(2026, 10, 26, 16);
  const week = plan.getCurrentWeekNumber("2026-08-01", later);
  const events = [{ ts: later.toISOString(), certification: "foundations", correct: true }];
  assert.ok(week > 12);
  assert.equal(plan.computeWeekActual(events, "2026-08-01", week, ["foundations"]).totalAnswers, 1);
});

test("Wochenempfehlung berücksichtigt auch fehlendes Reading und Vokabular", () => {
  const text = plan.buildWeeklyRecommendation({
    weekTarget: { newVocabTarget: 15, reviewsTarget: 10, readingExercisesTarget: 4 },
    weekActual: { newVocab: 0, reviews: 5, readingExercises: 0, totalAnswers: 5, accuracy: 100 },
    weakDomains: []
  });
  assert.match(text, /Vokabeln/);
  assert.match(text, /Reading/);
});

test("lange SM-2-Serien behalten ein gültiges Fälligkeitsdatum", () => {
  let progress = {};
  for (let i = 0; i < 60; i++) {
    progress = sm2.computeNextProgress(progress, { correct: true, confidence: 5 }, new Date(2026, 10, 26));
  }
  assert.match(progress.nextReviewDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(progress.intervalDays <= 3650);
});

test("fehlende Antwortsicherheit wird für die Statistik nicht künstlich ergänzt", () => {
  const next = sm2.computeNextProgress({}, { correct: true }, new Date(2026, 10, 26));
  assert.equal(next.confidence, null);
  assert.equal(next.responseTimeMs, null);
  assert.equal(next.flag, null);
  assert.equal(next.intervalDays, 1);
});

test("Fälligkeit berücksichtigt Fehler, eingeplante Fragen und ältere Markierungen", () => {
  const items = ["intro", "wrong", "future", "manual", "new"].map((id) => ({ content: { id } }));
  const records = new Map([
    ["intro", { flag: "intro", nextReviewDate: "2026-11-26" }],
    ["wrong", { flag: "relearn", nextReviewDate: "2026-11-26", repetitions: 0 }],
    ["future", { flag: "later", nextReviewDate: "2026-11-27" }],
    ["manual", { flag: "later", nextReviewDate: null }],
    ["orphan", { nextReviewDate: "2026-11-24" }]
  ]);
  assert.deepEqual(dueItems(items, records, "2026-11-26").map(({ content }) => content.id), ["wrong", "manual", "intro"]);
});

test("eine falsche Antwort zählt als bearbeitet, für Festigung zählen verschiedene Tage", () => {
  const event = (id, day, correct) => ({ contentId: id, ts: `2026-11-${String(day).padStart(2, "0")}T11:00:00Z`, correct });
  const { answered, consolidated } = summarizeActivity([
    event("a", 5, true), event("a", 5, true),
    event("b", 5, true), event("b", 6, true),
    event("c", 5, false),
    event("d", 5, true), event("d", 6, true), event("d", 7, false)
  ], new Map());
  assert.deepEqual([...answered], ["a", "b", "c", "d"]);
  assert.deepEqual([...consolidated], ["b"]);
});

test("Monatsmeilensteine summieren nur Aktivitäten bis zum Planmonat", () => {
  const weekly = Array.from({ length: 12 }, (_, i) => ({
    week: i + 1, certification: "foundations", newVocabTarget: 5, reviewsTarget: 8, readingExercisesTarget: 2
  }));
  const activity = [
    { ts: "2026-11-20T08:00:00Z", certification: "foundations", contentType: "vocabulary", isNew: true, correct: null },
    { ts: "2026-11-29T08:00:00Z", certification: "foundations", contentType: "readingPassage", isNew: false, correct: true }
  ];
  const month = plan.computeMilestoneProgress(weekly, activity, "2026-11-01", 1, "foundations", ["foundations"]);
  assert.deepEqual(month.target, { newVocabTarget: 20, reviewsTarget: 32, readingExercisesTarget: 8 });
  assert.equal(month.actual.newVocab, 1);
  assert.equal(month.actual.reviews, 0);
});

test("Prüfungsauswahl verwendet Exam-Gewichte und füllt den Filterpool auf", () => {
  const fixture = (domain, count) => Array.from({ length: count }, (_, i) => ({ content: { id: domain + i, examDomainId: domain } }));
  const weights = new Map([["a", { weightPercent: 70 }], ["b", { weightPercent: 30 }]]);
  const selection = selectExamItems([...fixture("a", 10), ...fixture("b", 10)], weights, 10);
  assert.equal(selection.filter(({ content }) => content.examDomainId === "a").length, 7);
  const smallPool = selectExamItems([...fixture("a", 1), ...fixture("b", 4)], weights, 10);
  assert.equal(smallPool.length, 5);
  assert.equal(new Set(smallPool.map(({ content }) => content.id)).size, 5);
});

test("Import validiert Version, Inhalte und leere Sicherungen und akzeptiert gemischte Altbestände", () => {
  const content = { id: "def-fnd-001", certification: "foundations", examDomainId: "fnd-ecosystem", cefr: "B1" };
  const items = [{ content, contentType: "definition" }];
  const record = sm2.emptyProgress(content, "definition");
  const legacy = { exportVersion: 1, learningProgress: [record, { certification: "hubspot-inbound-sales" }],
    activityLog: [], settings: { certificationPath: "hubspot-all", theme: "light" } };
  assert.deepEqual(validateBackup(legacy, items), { progress: [record], activity: [], settings: { theme: "light" } });
  assert.throws(() => validateBackup({ ...legacy, exportVersion: 2 }, items), /Version/);
  assert.throws(() => validateBackup({ ...legacy, learningProgress: [] }, items), /keinen Salesforce-Lernstand/);
  assert.throws(() => validateBackup({ ...legacy, learningProgress: [{ ...record, contentId: "unbekannt" }] }, items), /Aufgaben-ID/);
});

test("Tageseinheit reserviert Budget für neue Inhalte trotz vieler fälliger Passagen", () => {
  const due = Array.from({ length: 10 }, (_, i) => ({ content: { id: "due-" + i }, contentType: "readingPassage" }));
  const fresh = Array.from({ length: 5 }, (_, i) => ({ content: { id: "voc-" + i }, contentType: "vocabulary", introMode: true }));
  const selected = selectSessionItems(due, fresh, 20);
  const dueCount = selected.filter((x) => x.content.id.startsWith("due-")).length;
  const freshCount = selected.filter((x) => x.content.id.startsWith("voc-")).length;
  assert.ok(dueCount >= 1 && dueCount <= 4);
  assert.ok(freshCount >= 1);
  const onlyDue = selectSessionItems(due, [], 20);
  assert.equal(onlyDue.length, 5);
});

test("Mini-Prüfung fächert mehrteilige Reading-Passagen vollständig auf", () => {
  const pool = [
    {
      contentType: "readingPassage",
      content: {
        id: "rp-1",
        scenario: "Scenario",
        questions: [
          { questionText: "Q1", options: [{ id: "a", text: "A", correct: true }] },
          { questionText: "Q2", options: [{ id: "b", text: "B", correct: true }] }
        ]
      }
    },
    {
      contentType: "question",
      content: { id: "q-1", questionText: "Q3", options: [{ id: "c", text: "C", correct: true }] }
    }
  ];
  const expanded = expandExamItems(pool);
  assert.equal(expanded.length, 3);
  assert.deepEqual(expanded.map((e) => e.key), ["rp-1#0", "rp-1#1", "q-1"]);
  assert.equal(expanded[1].q.scenario, "Scenario");
});

test("eine leere Salesforce-Sicherung mit Einstellungen ist wieder einlesbar", () => {
  const backup = {
    exportVersion: 1, trainer: "salesforce", learningProgress: [], activityLog: [],
    settings: { theme: "light", certificationPath: "foundations" }
  };
  assert.deepEqual(validateBackup(backup, []), {
    progress: [], activity: [], settings: backup.settings, settingsOnly: true
  });
});

test("Prüfungswiederholung übernimmt bei Passagen nur die gewählten Teilfragen", async () => {
  const { reviewPracticeItems } = await import("../sfz_app/js/views/quiz.js");
  const questions = [{ questionText: "Falsch" }, { questionText: "Offen" }, { questionText: "Richtig" }];
  const passage = { contentType: "readingPassage", content: { id: "rp-1", questions, scenario: "Kontext" } };
  const expanded = expandExamItems([passage]);
  const [retry] = reviewPracticeItems([expanded[0]]);
  assert.equal(retry.content.id, "rp-1");
  assert.equal(retry.content.scenario, "Kontext");
  assert.deepEqual(retry.content.questions.map(({ questionText }) => questionText), ["Falsch"]);
  assert.equal(passage.content.questions.length, 3);
});
