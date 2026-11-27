// contentLoader.js — Lädt und cached die statischen JSON-Content-Dateien.

const files = {
  vocabulary: "data/vocabulary.json",
  definitions: "data/definitions.json",
  readingPassages: "data/reading-passages.json",
  questions: "data/questions.json",
  practiceTasks: "data/practice-tasks.json",
  examDomains: "data/exam-domains.json",
  weeklyPlan: "data/weekly-plan.json"
};

const cache = {};

async function loadFile(key) {
  if (cache[key]) return cache[key];
  const res = await fetch(files[key], { cache: "no-store" });
  if (!res.ok) throw new Error(`Konnte ${files[key]} nicht laden (Status ${res.status})`);
  const data = await res.json();
  cache[key] = data;
  return data;
}

export const getVocabulary = () => loadFile("vocabulary");
export const getDefinitions = () => loadFile("definitions");
export const getReadingPassages = () => loadFile("readingPassages");
export const getQuestions = () => loadFile("questions");
export const getPracticeTasks = () => loadFile("practiceTasks");
export const getExamDomains = () => loadFile("examDomains");
export const getWeeklyPlan = () => loadFile("weeklyPlan");

/** Lädt alle Content-Dateien parallel vor (für den App-Start). */
export async function loadAll() {
  const [vocabulary, definitions, readingPassages, questions, practiceTasks, examDomains, weeklyPlan] =
    await Promise.all([
      getVocabulary(),
      getDefinitions(),
      getReadingPassages(),
      getQuestions(),
      getPracticeTasks(),
      getExamDomains(),
      getWeeklyPlan()
    ]);
  return { vocabulary, definitions, readingPassages, questions, practiceTasks, examDomains, weeklyPlan };
}

/** Baut eine Lookup-Map examDomainId -> Domain-Objekt. */
export function domainMap(examDomains) {
  return new Map(examDomains.map((d) => [d.id, d]));
}

/** Baut eine Lookup-Map examDomainId -> weightPercent. */
export function domainWeightMap(examDomains) {
  return new Map(examDomains.map((d) => [d.id, d.weightPercent]));
}
