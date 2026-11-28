import { state, allLearnableContent, refreshLearningData } from "./state.js";
import { updateLearningData } from "./db.js";
import { computeNextProgress, emptyProgress, introProgress, prioritizeDue } from "./sm2.js";
import { addCalendarDays, todayISO } from "./utils.js";

/** Dieselbe Aufgabenmenge für Einheiten und Anzeigen, einschließlich früherer Markierungen ohne Datum. */
export function dueItems(items, progressById, today) {
  const due = [];
  for (const item of items) {
    const progress = progressById.get(item.content.id);
    if (!progress) continue;
    if (progress.nextReviewDate ? progress.nextReviewDate <= today : progress.flag === "later") {
      due.push({ ...item, progress });
    }
  }
  return prioritizeDue(due, today);
}

export function dueForPath(certifications, today = todayISO()) {
  const items = allLearnableContent().filter(({ content }) => certifications.includes(content.certification));
  return dueItems(items, state.progressByContentId, today);
}

/** Speichert Antworten als gemeinsamen Fortschritts- und Aktivitätsstand. */
export async function saveAnswers(answers, submissionId) {
  const now = new Date();
  await updateLearningData(answers.map(({ item, result, mode }) => ({
    contentId: item.content.id,
    apply(existing) {
      if (item.introMode && existing) return null;
      const base = existing || emptyProgress(item.content, item.contentType);
      const progress = item.introMode
        ? introProgress(item.content, item.contentType, now)
        : { ...base, ...computeNextProgress(base, result, now) };
      const { contentId, contentType, certification, examDomainId } = progress;
      return {
        progress,
        activity: {
          contentId, contentType, certification, examDomainId,
          ts: now.toISOString(),
          mode,
          isNew: !existing || (!existing.lastResult && existing.flag === "later" && existing.intervalDays === 0),
          isIntro: Boolean(item.introMode),
          correct: progress.lastResult == null ? null : result.correct,
          confidence: progress.confidence,
          responseTimeMs: progress.responseTimeMs
        }
      };
    }
  })), submissionId);
  await refreshLearningData();
}

export async function markForReview(item, now = new Date()) {
  return markManyForReview([item], now);
}

export async function markManyForReview(items, now = new Date()) {
  if (!items.length) return;
  const tomorrow = todayISO(addCalendarDays(now, 1));
  await updateLearningData(items.map((item) => ({
    contentId: item.content.id,
    apply(existing) {
      const progress = existing || emptyProgress(item.content, item.contentType);
      const date = existing?.nextReviewDate;
      return {
        progress: {
          ...progress,
          flag: "later",
          nextReviewDate: date && date < tomorrow ? date : tomorrow
        }
      };
    }
  })));
  await refreshLearningData();
}

export async function unmarkForReview(item) {
  await updateLearningData([{
    contentId: item.content.id,
    apply(existing) {
      if (!existing || existing.flag !== "later") return null;
      return { progress: { ...existing, flag: null } };
    }
  }]);
  await refreshLearningData();
}

export function computeWeakDomains(activity, domains, { minAnswers = 3, threshold = 80 } = {}) {
  const byDomain = new Map();
  for (const a of activity) {
    if (!a.examDomainId || typeof a.correct !== "boolean") continue;
    if (!byDomain.has(a.examDomainId)) byDomain.set(a.examDomainId, { correct: 0, total: 0 });
    const entry = byDomain.get(a.examDomainId);
    entry.total += 1;
    if (a.correct) entry.correct += 1;
  }
  const practiced = [...byDomain.entries()]
    .filter(([, v]) => v.total >= minAnswers)
    .map(([id, v]) => ({
      id,
      name: domains.get(id)?.name || id,
      accuracy: Math.round((v.correct / v.total) * 100),
      total: v.total
    }));
  const weak = practiced
    .filter((d) => d.accuracy < threshold)
    .sort((a, b) => a.accuracy - b.accuracy);
  return { weak, practiced };
}

export function summarizeActivity(activity, progressById) {
  const answered = new Set();
  const correctDays = new Map();
  const ordered = activity.filter((event) => typeof event.correct === "boolean")
    .sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts));

  for (const { contentId, correct, ts } of ordered) {
    answered.add(contentId);
    if (!correct) {
      correctDays.delete(contentId);
      continue;
    }
    const date = new Date(ts);
    if (!Number.isFinite(date.getTime())) continue;
    if (!correctDays.has(contentId)) correctDays.set(contentId, new Set());
    correctDays.get(contentId).add(todayISO(date));
  }

  for (const [id, progress] of progressById) {
    if (progress.lastResult) answered.add(id);
    if (progress.lastResult === "incorrect") correctDays.delete(id);
  }
  const consolidated = new Set([...correctDays].filter(([, days]) => days.size >= 2).map(([id]) => id));
  return { answered, consolidated };
}
