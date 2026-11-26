// app.js — Einstiegspunkt: initialisiert State, Theme und den Hash-Router.

import { state, init } from "./js/state.js";
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
  "#/exam-english": "Prüfungsenglisch",
  "#/progress": "Fortschritt",
  "#/settings": "Einstellungen"
};

const appRoot = document.getElementById("app");
const navRoot = document.getElementById("nav");

const ctx = {
  navigate(hash) {
    if (location.hash === hash) {
      renderRoute();
    } else {
      location.hash = hash;
    }
  }
};

function buildNav() {
  navRoot.textContent = "";
  // Solange kein Lernpfad gewählt ist, gibt es keine Navigation — das Onboarding ist die einzige Ansicht.
  if (!state.settings.certificationPath) return;
  for (const [hash, label] of Object.entries(navLabels)) {
    const link = document.createElement("a");
    link.href = hash;
    link.textContent = label;
    link.className = "nav-link";
    if (location.hash === hash || (!location.hash && hash === "#/dashboard")) {
      link.classList.add("nav-link-active");
      link.setAttribute("aria-current", "page");
    }
    navRoot.appendChild(link);
  }
}

let currentView;
let viewController;

async function renderRoute() {
  // Ohne gewählten Lernpfad landet jede Route zwingend im Onboarding (siehe Produktkonzept, Kapitel 7 Nachtrag).
  if (!state.settings.certificationPath && location.hash !== "#/onboarding") {
    location.hash = "#/onboarding";
    return;
  }

  const hash = location.hash || "#/dashboard";
  const view = routes[hash] || dashboard;
  viewController?.abort();
  currentView?.leave?.();
  viewController = new AbortController();
  currentView = view;
  buildNav();
  const viewRoot = document.createElement("div");
  appRoot.replaceChildren(viewRoot);
  try {
    await view.render(viewRoot, { ...ctx, signal: viewController.signal });
  } catch (error) {
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = `Die Ansicht konnte nicht geladen werden. ${error.message}`;
    viewRoot.replaceChildren(message);
  }
}

async function boot() {
  document.documentElement.dataset.theme = state.settings.theme;
  appRoot.textContent = "Lade Lerninhalte…";
  try {
    await init();
  } catch (error) {
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
    return;
  }
  window.addEventListener("hashchange", renderRoute);
  if (!state.settings.certificationPath && location.hash !== "#/onboarding") {
    location.hash = "#/onboarding";
  } else if (!location.hash || location.hash === "#app") {
    location.hash = "#/dashboard";
  } else {
    await renderRoute();
  }
}

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  appRoot.focus();
  appRoot.scrollIntoView();
});

boot();
