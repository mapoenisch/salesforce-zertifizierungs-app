// contentLoader.js — Lädt und cached die statischen JSON-Content-Dateien.

// Jede Content-Art wird aus mehreren Dateien geladen und zusammengeführt: zuerst die
// Salesforce-Ebene, danach die HubSpot-Ebene. Unterschieden werden die Inhalte über ihr
// certification-Tag (siehe js/platforms.js) — nachgelagerte Filter bleiben unverändert.
const files = {
  vocabulary: ["data/vocabulary.json", "data/hubspot-vocabulary.json"],
  definitions: ["data/definitions.json", "data/hubspot-definitions.json"],
  readingPassages: ["data/reading-passages.json", "data/hubspot-reading-passages.json"],
  questions: ["data/questions.json", "data/hubspot-questions.json"],
  practiceTasks: ["data/practice-tasks.json", "data/hubspot-practice-tasks.json"],
  examDomains: ["data/exam-domains.json", "data/hubspot-domains.json"],
  weeklyPlan: ["data/weekly-plan.json", "data/hubspot-weekly-plan.json"]
};

const cache = {};

async function loadFile(key) {
  if (cache[key]) return cache[key];
  const parts = await Promise.all(
    files[key].map(async (path) => {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Konnte ${path} nicht laden (Status ${res.status})`);
      return res.json();
    })
  );
  const data = parts.flat();
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
