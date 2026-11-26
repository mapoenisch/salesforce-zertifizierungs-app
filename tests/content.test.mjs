import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const DATA_DIR = path.resolve("sfz_app/data");
const load = (file) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));

const domains = load("exam-domains.json");
const vocabulary = load("vocabulary.json");
const definitions = load("definitions.json");
const readingPassages = load("reading-passages.json");
const questions = load("questions.json");
const practiceTasks = load("practice-tasks.json");
const weeklyPlan = load("weekly-plan.json");

test("Exam-Domains summieren sich je Zertifizierung auf exakt 100%", () => {
  const sums = new Map();
  for (const d of domains) {
    sums.set(d.certification, (sums.get(d.certification) || 0) + d.weightPercent);
  }
  assert.equal(sums.get("foundations"), 100);
  assert.equal(sums.get("administrator"), 100);
});

test("Alle Content-IDs sind global eindeutig und verweisen auf gültige Exam-Domains", () => {
  const domainMap = new Map(domains.map((d) => [d.id, d]));
  const seenIds = new Set();
  for (const item of [...vocabulary, ...definitions, ...readingPassages, ...questions, ...practiceTasks]) {
    assert.ok(item.id, "Fehlende ID");
    assert.equal(seenIds.has(item.id), false, `Doppelte ID: ${item.id}`);
    seenIds.add(item.id);
    if (item.examDomainId) {
      const domain = domainMap.get(item.examDomainId);
      assert.ok(domain, `Unbekannte Domain ${item.examDomainId} bei ${item.id}`);
      assert.equal(domain.certification, item.certification, `Zertifizierungs-Mismatch bei ${item.id}`);
    }
  }
});

test("Vokabeln, Definitionen, Fragen und Reading-Passagen sind strukturell vollständig", () => {
  for (const v of vocabulary) {
    assert.ok(v.clozeSentence?.includes("____"), `Fehlender Lückentext-Platzhalter bei ${v.id}`);
    assert.ok(v.options?.includes(v.correctOption), `correctOption fehlt in options bei ${v.id}`);
  }
  for (const d of definitions) {
    assert.ok(d.definition, `Fehlende Definition bei ${d.id}`);
    assert.ok(Array.isArray(d.distractorDefinitions) && d.distractorDefinitions.length >= 2, `Zu wenige Distraktoren bei ${d.id}`);
  }
  for (const q of questions) {
    const correctCount = (q.options || []).filter((o) => o.correct).length;
    if (q.type === "multiple-select") assert.ok(correctCount >= 2, `Multiple-Select braucht >=2 richtige Optionen bei ${q.id}`);
    else assert.equal(correctCount, 1, `Single-Choice braucht genau 1 richtige Option bei ${q.id}`);
  }
  for (const p of readingPassages) {
    assert.ok(Array.isArray(p.questions) && p.questions.length >= 1, `Reading-Passage ohne Fragen: ${p.id}`);
    for (const q of p.questions) {
      const correctCount = (q.options || []).filter((o) => o.correct).length;
      assert.ok(correctCount >= 1, `Teilfrage ohne richtige Option in ${p.id}`);
    }
  }
});

test("Wochenplan deckt alle 3 Lernpfade über 12 Wochen vollständig ab", () => {
  for (const certPath of ["foundations", "administrator", "administrator-full"]) {
    const weeks = weeklyPlan.filter((w) => w.certification === certPath).map((w) => w.week).sort((a, b) => a - b);
    assert.deepEqual(weeks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], `Unvollständiger Wochenplan für ${certPath}`);
  }
});
