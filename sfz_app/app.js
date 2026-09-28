// app.js — Einstiegspunkt: initialisiert State, Theme und den Hash-Router.

import { state, init, activePlatform } from "./js/state.js";
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
  const platform = activePlatform();
  const titleEl = document.querySelector(".app-title");
  if (titleEl) titleEl.textContent = platform.appTitle;
  for (const [hash, label] of Object.entries(navLabels)) {
    // Der Bereich "Prüfungsenglisch" gehört nur zu Plattformen mit englischsprachiger Prüfung.
    if (hash === "#/exam-english" && !platform.hasEnglishTraining) continue;
    const link = document.createElement("a");
    link.href = hash;
    link.textContent = label;
    link.className = "nav-link";
    if (location.hash === hash || (!location.hash && hash === "#/dashboard")) link.classList.add("nav-link-active");
    navRoot.appendChild(link);
  }
}

async function renderRoute() {
  // Ohne gewählten Lernpfad landet jede Route zwingend im Onboarding (siehe Produktkonzept, Kapitel 7 Nachtrag).
  if (!state.settings.certificationPath && location.hash !== "#/onboarding") {
    location.hash = "#/onboarding";
    return;
  }

  const hash = location.hash || "#/dashboard";
  // Lernpfade mit deutschsprachiger Prüfung (HubSpot) haben keinen Prüfungsenglisch-Bereich.
  if (hash === "#/exam-english" && !activePlatform().hasEnglishTraining) {
    location.hash = "#/dashboard";
    return;
  }
  const view = routes[hash] || dashboard;
  buildNav();
  try {
    await view.render(appRoot, ctx);
  } catch (err) {
    console.error(err);
    appRoot.textContent = "";
    const p = document.createElement("p");
    p.textContent = "Beim Laden dieser Ansicht ist ein Fehler aufgetreten: " + err.message;
    appRoot.appendChild(p);
  }
}

async function boot() {
  document.documentElement.dataset.theme = state.settings.theme;
  appRoot.textContent = "Lade Lerninhalte…";
  await init();
  window.addEventListener("hashchange", renderRoute);
  if (!state.settings.certificationPath) {
    location.hash = "#/onboarding";
  } else if (!location.hash) {
    location.hash = "#/dashboard";
  } else {
    await renderRoute();
  }
}

boot();
