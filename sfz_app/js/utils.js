// utils.js — kleine, geteilte Hilfsfunktionen für DOM-Aufbau, Datum und Formatierung.
// Bewusst ohne innerHTML mit dynamischen Inhalten (sichere DOM-Ausgabe, kein XSS-Risiko).

/** Erstellt ein DOM-Element mit Attributen, Klassen und Kindern. Text bleibt immer escaped (textContent). */
export function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  if (opts.on) for (const [ev, fn] of Object.entries(opts.on)) node.addEventListener(ev, fn);
  for (const child of children) {
    if (child) node.appendChild(child);
  }
  return node;
}

export function clear(container) {
  while (container.firstChild) container.removeChild(container.firstChild);
}

/** Fokussiert neuen Inhalt, ohne ihn unter die klebende Navigation zu scrollen. */
export function focusContent(element, { page = false } = {}) {
  if (!element?.isConnected) return;
  if (element.tabIndex < 0) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });
  if (page) {
    window.scrollTo(0, 0);
    return;
  }
  const top = document.querySelector(".app-header")?.getBoundingClientRect().height || 0;
  const rect = element.getBoundingClientRect();
  if (rect.top < top + 8 || rect.bottom > window.innerHeight) {
    window.scrollTo(0, Math.max(0, window.scrollY + rect.top - top - 16));
  }
}

export function todayISO(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${String(date.getFullYear()).padStart(4, "0")}-${month}-${day}`;
}

export function addCalendarDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isCalendarDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    todayISO(new Date(value + "T00:00:00")) === value;
}

/** Einfache Fortschrittsbalken-Komponente (0-100). */
export function progressBar(percent, label) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const wrap = el("div", { class: "progress-bar-wrap" });
  if (label) wrap.appendChild(el("div", { class: "progress-bar-label", text: `${label} (${pct}%)` }));
  const track = el("div", {
    class: "progress-bar-track",
    attrs: {
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": String(pct),
      ...(label && { "aria-label": label })
    }
  });
  const fill = el("div", { class: "progress-bar-fill" });
  fill.style.width = pct + "%";
  track.appendChild(fill);
  wrap.appendChild(track);
  return wrap;
}

/** Formatiert Millisekunden als "Xs" oder "Xm Ys". */
export function formatDuration(ms) {
  if (ms == null) return "–";
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec}s`;
}

/** Mischt ein Array (Fisher-Yates), gibt eine neue Kopie zurück. */
export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function certLabel(cert) {
  return cert === "administrator" ? "Administrator" : "Foundations";
}

/** Menschenlesbares Label für die drei Lernpfad-IDs (settings.certificationPath) — nicht zu verwechseln mit certLabel(), das die binäre Content-Certification einzelner Inhalte beschriftet. */
export function pathLabel(path) {
  if (path === "administrator") return "Administrator (mit Foundations-Grundwissen)";
  if (path === "administrator-full") return "Administrator (inkl. Foundations)";
  return "Foundations";
}

const DISCLAIMER = "Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage.";
export function disclaimerNote() {
  return el("p", { class: "disclaimer", text: DISCLAIMER });
}

/**
 * Zeigt einen modalen Bestätigungsdialog mit "Ja"/"Nein"-Schaltflächen und gibt ein
 * Promise<boolean> zurück (true = bestätigt). Tastaturbedienbar (Escape = Abbrechen,
 * Fokus startet auf "Nein" als sicherem Standard).
 * @param {string} message
 * @param {{confirmText?: string, cancelText?: string, danger?: boolean, signal?: AbortSignal}} [opts]
 */
export function confirmDialog(message, opts = {}) {
  const { confirmText = "Ja", cancelText = "Nein", danger = false, signal } = opts;
  if (signal?.aborted) return Promise.resolve(false);
  return new Promise((resolve) => {
    const previouslyFocused = document.activeElement;

    const overlay = el("div", { class: "modal-overlay", attrs: { role: "presentation" } });
    const box = el("div", {
      class: "modal-box",
      attrs: { role: "alertdialog", "aria-modal": "true", "aria-labelledby": "modal-dialog-text" }
    });
    box.appendChild(el("p", { attrs: { id: "modal-dialog-text" }, text: message }));

    const actions = el("div", { class: "modal-actions" });
    const cancelBtn = el("button", { class: "secondary-btn", text: cancelText, attrs: { type: "button" } });
    const confirmBtn = el("button", {
      class: danger ? "danger-btn" : "primary-btn",
      text: confirmText,
      attrs: { type: "button" }
    });

    function abort() {
      close(false);
    }

    function close(result) {
      document.removeEventListener("keydown", onKeydown);
      signal?.removeEventListener("abort", abort);
      overlay.remove();
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
      resolve(result);
    }

    function onKeydown(ev) {
      if (ev.key === "Escape") close(false);
      if (ev.key === "Tab") {
        ev.preventDefault();
        (document.activeElement === cancelBtn ? confirmBtn : cancelBtn).focus();
      }
    }

    cancelBtn.addEventListener("click", () => close(false));
    confirmBtn.addEventListener("click", () => close(true));
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) close(false);
    });
    document.addEventListener("keydown", onKeydown);
    signal?.addEventListener("abort", abort, { once: true });

    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    cancelBtn.focus();
  });
}

/**
 * Gemeinsamer Sitzungskopf mit Fortschrittstext, Prüfungsenglisch-Button und Fortschrittsbalken
 * für Lerneinheit (#/learn) und gezieltes Üben (#/quiz).
 */
export function createSessionChrome({ onOpenRef }) {
  const progressLabel = el("p", { class: "session-progress session-meta-line" });
  const refBtn = el("button", {
    class: "secondary-btn session-ref-btn",
    text: "Prüfungsenglisch",
    attrs: { type: "button" },
    on: { click: () => onOpenRef(refBtn) }
  });
  const statusBar = el("div", { class: "session-status-bar" }, [progressLabel, refBtn]);
  const sessionFill = el("div", { class: "progress-bar-fill" });
  const sessionTrack = el("div", {
    class: "progress-bar-track session-progress-track",
    attrs: { "aria-hidden": "true" }
  }, [sessionFill]);

  function update(text, percent) {
    progressLabel.textContent = text;
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    sessionFill.style.width = `${clamped}%`;
  }

  function setHidden(hidden) {
    statusBar.hidden = hidden;
    sessionTrack.hidden = hidden;
  }

  return { statusBar, progressLabel, sessionTrack, sessionFill, update, setHidden };
}
