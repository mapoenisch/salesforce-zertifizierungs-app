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

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Einfache Fortschrittsbalken-Komponente (0-100). */
export function progressBar(percent, label) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const wrap = el("div", { class: "progress-bar-wrap" });
  if (label) wrap.appendChild(el("div", { class: "progress-bar-label", text: `${label} (${pct}%)` }));
  const track = el("div", { class: "progress-bar-track" });
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

const CERT_LABELS = {
  foundations: "Foundations",
  administrator: "Administrator",
  "hubspot-sales-software": "Sales Hub Software",
  "hubspot-inbound-sales": "Inbound Sales",
  "hubspot-frictionless-sales": "Reibungsloser Vertrieb"
};

export function certLabel(cert) {
  return CERT_LABELS[cert] || cert || "Foundations";
}

/** Menschenlesbares Label für die drei Lernpfad-IDs (settings.certificationPath) — nicht zu verwechseln mit certLabel(), das die binäre Content-Certification einzelner Inhalte beschriftet. */
const PATH_LABELS = {
  foundations: "Salesforce Foundations",
  administrator: "Salesforce Administrator (Foundations vorausgesetzt)",
  "administrator-full": "Salesforce Administrator (inkl. Foundations)",
  "hubspot-sales-software": "HubSpot Sales Hub Software",
  "hubspot-inbound-sales": "HubSpot Inbound Sales",
  "hubspot-frictionless-sales": "HubSpot Reibungsloser Vertrieb",
  "hubspot-all": "HubSpot — alle drei Zertifizierungen"
};

export function pathLabel(path) {
  return PATH_LABELS[path] || "Salesforce Foundations";
}

/**
 * Beschriftet die Gewichtung eines Themenbereichs. Salesforce nutzt die offiziellen
 * Exam-Weightings; HubSpot veröffentlicht keine Prozentgewichtungen, dort steht eine
 * redaktionell aus der offiziellen Lektionsdauer abgeleitete Priorität — sie wird auch so benannt.
 */
export function domainWeightLabel(domain) {
  if (!domain || typeof domain.weightPercent !== "number") return "";
  return domain.priorityType === "editorialPriority"
    ? `${domain.weightPercent} % redaktionell`
    : `${domain.weightPercent} %`;
}

const DISCLAIMER = "Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage.";
/** @param {string} [text] inhaltsspezifischer Hinweis (z. B. HubSpot-Wortlaut), sonst Standardtext. */
export function disclaimerNote(text) {
  return el("p", { class: "disclaimer", text: text || DISCLAIMER });
}

/**
 * Zeigt einen modalen Bestätigungsdialog mit "Ja"/"Nein"-Schaltflächen und gibt ein
 * Promise<boolean> zurück (true = bestätigt). Tastaturbedienbar (Escape = Abbrechen,
 * Fokus startet auf "Nein" als sicherem Standard).
 * @param {string} message
 * @param {{confirmText?: string, cancelText?: string, danger?: boolean}} [opts]
 */
export function confirmDialog(message, opts = {}) {
  const { confirmText = "Ja", cancelText = "Nein", danger = false } = opts;
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

    function close(result) {
      document.removeEventListener("keydown", onKeydown);
      overlay.remove();
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
      resolve(result);
    }

    function onKeydown(ev) {
      if (ev.key === "Escape") close(false);
    }

    cancelBtn.addEventListener("click", () => close(false));
    confirmBtn.addEventListener("click", () => close(true));
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) close(false);
    });
    document.addEventListener("keydown", onKeydown);

    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    cancelBtn.focus();
  });
}
