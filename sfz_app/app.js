// app.js — Einstiegspunkt: initialisiert State, Theme und den Hash-Router.

import { state, init, preload } from "./js/state.js";
import { focusContent } from "./js/utils.js";
import * as onboarding from "./js/views/onboarding.js";
import * as dashboard from "./js/views/dashboard.js";
import * as learn from "./js/views/learn.js";
import * as quiz from "./js/views/quiz.js";
import * as glossary from "./js/views/glossary.js";
import * as examEnglish from "./js/views/examEnglish.js";
import * as progress from "./js/views/progress.js";
import * as settings from "./js/views/settings.js";

const routes = {
  "#/onboarding": onboarding,
  "#/dashboard": dashboard,
  "#/learn": learn,
  "#/quiz": quiz,
  "#/glossary": glossary,
  "#/exam-english": examEnglish,
  "#/progress": progress,
  "#/settings": settings
};

const navLabels = {
  "#/dashboard": "Dashboard",
  "#/learn": "Lernen",
  "#/quiz": "Prüfung",
  "#/glossary": "Glossar",
  "#/progress": "Fortschritt"
};

const appRoot = document.getElementById("app");
const navRoot = document.getElementById("nav");
const header = navRoot.parentElement;
const navToggle = document.getElementById("nav-toggle");
const settingsLink = document.getElementById("settings-link");

function setMenuOpen(open) {
  header.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

navToggle.addEventListener("click", () => setMenuOpen(navToggle.getAttribute("aria-expanded") === "false"));
header.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    navToggle.focus();
  }
});

header.addEventListener("focusout", (event) => {
  if (!header.contains(event.relatedTarget)) setMenuOpen(false);
});
document.addEventListener("pointerdown", (event) => {
  if (!header.contains(event.target)) setMenuOpen(false);
});

let currentView;
let currentHash;
let currentHistoryIndex;
let viewController;
let historyConfirmationPending = false;
let restoringHistory = false;

function historyIndex() {
  return history.state?.trainerIndex;
}

function writeHistory(method, hash, index) {
  history[method]({ ...history.state, trainerIndex: index }, "", hash);
}

const ctx = { navigate };

async function navigate(hash) {
  if (currentView?.hasActiveExam?.()) {
    if (hash === currentHash) return false;
    if (!(await currentView.confirmLeave())) return false;
  }
  if (location.hash !== hash) writeHistory("pushState", hash, currentHistoryIndex + 1);
  await renderRoute();
  return true;
}

async function onHashChange() {
  if (restoringHistory && location.hash === currentHash && historyIndex() === currentHistoryIndex) {
    restoringHistory = false;
    return;
  }
  if (location.hash === currentHash || historyConfirmationPending) return;
  if (currentView?.hasActiveExam?.()) {
    historyConfirmationPending = true;
    const approved = await currentView.confirmLeave();
    historyConfirmationPending = false;
    if (!approved && location.hash !== currentHash) {
      const entry = historyIndex();
      if (Number.isInteger(entry) && entry !== currentHistoryIndex) {
        restoringHistory = true;
        history.go(currentHistoryIndex - entry);
      } else {
        // Eine manuell eingegebene Hash-Adresse hat keine von der App erfasste Position.
        currentHistoryIndex += 1;
        writeHistory("pushState", currentHash, currentHistoryIndex);
      }
      return;
    }
    if (!approved) return;
  }
  await renderRoute();
}

function buildNav() {
  navRoot.textContent = "";
  setMenuOpen(false);
  const hasPath = Boolean(state.settings.certificationPath);
  navToggle.hidden = !hasPath;
  navRoot.hidden = !hasPath;
  if (settingsLink) settingsLink.hidden = !hasPath;
  // Solange kein Lernpfad gewählt ist, gibt es keine Navigation — das Onboarding ist die einzige Ansicht.
  if (!hasPath) return;

  const activeRoute = (location.hash || "#/dashboard").split("?")[0];
  if (settingsLink) {
    const isSettings = activeRoute === "#/settings";
    settingsLink.classList.toggle("nav-link-active", isSettings);
    if (isSettings) settingsLink.setAttribute("aria-current", "page");
    else settingsLink.removeAttribute("aria-current");
  }

  for (const [hash, label] of Object.entries(navLabels)) {
    const link = document.createElement("a");
    link.href = hash;
    link.textContent = label;
    link.className = "nav-link";
    if (activeRoute === hash || (!location.hash && hash === "#/dashboard")) {
      link.classList.add("nav-link-active");
      link.setAttribute("aria-current", "page");
    }
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (navToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        navToggle.focus();
      }
      if (hash !== currentHash) navigate(hash);
    });
    navRoot.appendChild(link);
  }
}

if (settingsLink) {
  settingsLink.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (navToggle.getAttribute("aria-expanded") === "true") setMenuOpen(false);
    if (currentHash !== "#/settings") navigate("#/settings");
  });
}

const CONTENT_FREE_ROUTES = new Set(["#/onboarding", "#/exam-english"]);

function showBootError(error) {
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = location.protocol === "file:"
    ? "Starte den Trainer über das lokale Startskript."
    : `Der Trainer konnte nicht gestartet werden. ${error.message}`;
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "primary-btn";
  retry.textContent = "Erneut laden";
  retry.addEventListener("click", () => location.reload());
  appRoot.replaceChildren(message, retry);
}

async function renderRoute() {
  // Ohne gewählten Lernpfad landet jede Route zwingend im Onboarding (siehe Produktkonzept, Kapitel 7 Nachtrag).
  if (!state.settings.certificationPath && location.hash !== "#/onboarding") {
    writeHistory("replaceState", "#/onboarding", historyIndex() ?? 0);
  }

  const hash = location.hash || "#/dashboard";
  const routeKey = hash.split("?")[0];
  if (!state.ready && !CONTENT_FREE_ROUTES.has(routeKey)) {
    appRoot.textContent = "Lade Lerninhalte…";
    try {
      await init();
    } catch (error) {
      showBootError(error);
      return;
    }
  }

  const view = routes[routeKey] || dashboard;
  viewController?.abort();
  currentView?.leave?.();
  const controller = new AbortController();
  viewController = controller;
  currentView = view;
  currentHash = hash;
  if (!Number.isInteger(historyIndex())) {
    writeHistory("replaceState", hash, (currentHistoryIndex ?? -1) + 1);
  }
  currentHistoryIndex = historyIndex();
  buildNav();
  const viewRoot = document.createElement("div");
  appRoot.replaceChildren(viewRoot);
  try {
    await view.render(viewRoot, { ...ctx, signal: controller.signal });
  } catch (error) {
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = `Die Ansicht konnte nicht geladen werden. ${error.message}`;
    viewRoot.replaceChildren(message);
  }
  if (!controller.signal.aborted && !viewRoot.contains(document.activeElement)) {
    focusContent(viewRoot.querySelector("h1") || appRoot, { page: true });
  }
}

async function boot() {
  document.documentElement.dataset.theme = state.settings.theme;
  window.addEventListener("hashchange", onHashChange);
  if (state.settings.certificationPath && (!location.hash || location.hash === "#app")) {
    writeHistory("replaceState", "#/dashboard", historyIndex() ?? 0);
  }
  await renderRoute();
  if (!state.ready) preload();
}

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  focusContent(appRoot);
});

boot();
