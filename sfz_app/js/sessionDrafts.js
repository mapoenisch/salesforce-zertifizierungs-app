// Entwürfe bleiben lokal und werden getrennt vom abgeschlossenen Lernstand gespeichert.
export const DAILY_DRAFT = "sfz_daily_session_v1";
export const EXAM_DRAFT = "sfz_mini_exam_v1";

export function readDraft(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function writeDraft(key, draft) {
  try {
    if (draft) localStorage.setItem(key, JSON.stringify(draft));
    else localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clearSessionDrafts() {
  const dailyCleared = writeDraft(DAILY_DRAFT, null);
  const examCleared = writeDraft(EXAM_DRAFT, null);
  return dailyCleared && examCleared;
}

export function newSessionId() {
  return Array.from(crypto.getRandomValues(new Uint32Array(4))).join("-");
}

export function readDailyDraft(date, path, items) {
  const draft = readDraft(DAILY_DRAFT);
  if (draft?.date !== date || draft.path !== path || !Array.isArray(draft.queueIds)) return null;

  const byId = new Map(items.map((item) => [item.content.id, item]));
  const index = draft.index ?? 0;
  if (!Number.isInteger(index) || index < 0 || index >= draft.queueIds.length) return null;
  const queue = draft.queueIds.map((entry) => {
    const item = byId.get(entry?.id);
    return item && { ...item, introMode: Boolean(entry.introMode) };
  });
  // Die Aufgabenposition ist Teil des Entwurfs. Fehlende Inhalte dürfen sie nicht verschieben.
  if (queue.some((item) => !item)) return null;
  return { ...draft, queue, index };
}
