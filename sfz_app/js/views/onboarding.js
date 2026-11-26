// views/onboarding.js — Pflicht-Auswahl des Lernpfads beim ersten Start (oder nach Reset).
// Wird von app.js erzwungen angezeigt, solange state.settings.certificationPath nicht gesetzt ist.

import { saveSettings } from "../state.js";
import { el, clear } from "../utils.js";

const FOUNDATIONS = {
  name: "Salesforce Certified Platform Foundations",
  questions: 40,
  minutes: 70,
  passing: 62,
  fee: 75,
  retakeFee: 0,
  guide: "https://help.salesforce.com/s/articleView?id=005298979&language=en_US&type=1"
};
const ADMINISTRATOR = {
  name: "Salesforce Certified Platform Administrator",
  questions: 60,
  minutes: 105,
  passing: 68,
  fee: 200,
  retakeFee: 100,
  guide: "https://help.salesforce.com/s/articleView?id=005298966&language=en_US&type=1"
};

const PATHS = [
  {
    id: "foundations",
    title: FOUNDATIONS.name,
    subtitle: "Einstieg ohne Salesforce-Vorkenntnisse",
    exam: FOUNDATIONS,
    buttonLabel: "Foundations wählen",
    focus: "Zwölf Wochen Foundations · englische Leseübungen überwiegend auf B1."
  },
  {
    id: "administrator",
    title: ADMINISTRATOR.name,
    subtitle: "Für Lernende mit Foundations-Grundwissen",
    exam: ADMINISTRATOR,
    buttonLabel: "Administrator wählen",
    focus: "Zwölf Wochen Administrator · englische Leseübungen auf B1 und B2."
  },
  {
    id: "administrator-full",
    title: "Administrator inklusive Foundations",
    subtitle: "Gemeinsamer Lernpfad für beide Themen",
    exam: ADMINISTRATOR,
    buttonLabel: "Administrator inkl. Foundations wählen",
    focus: "Woche 1–5 Foundations, Woche 6–12 Administrator · englische Leseübungen auf B1 und B2."
  }
];

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Willkommen — welchen Lernpfad möchtest du starten?" }));
  container.appendChild(el("p", {
    text: "Salesforce nennt für beide Prüfungen keine formale Voraussetzung. Für Administrator empfiehlt Salesforce mindestens sechs Monate praktische Administrator-Erfahrung. Foundations-Grundwissen hilft beim Einstieg in den reinen Administrator-Lernpfad."
  }));

  const cardsWrap = el("div", { class: "onboarding-cards" });

  PATHS.forEach((path) => {
    const card = el("section", { class: "onboarding-card" });
    card.appendChild(el("h2", { text: path.title }));
    card.appendChild(el("p", { class: "item-hint", text: path.subtitle }));
    const list = el("ul");
    const { questions, minutes, passing, fee, retakeFee, guide } = path.exam;
    const retake = retakeFee ? `${retakeFee} USD` : "kostenlos";
    [
      `${questions} gewertete Multiple-Choice-Fragen plus bis zu fünf ungewertete · ${minutes} Minuten`,
      `${passing} % Bestehensgrenze in der englischen Prüfung · ${fee} USD, Wiederholung ${retake} (jeweils ggf. zzgl. Steuern)`,
      path.focus
    ].forEach((text) => list.appendChild(el("li", { text })));
    card.appendChild(list);
    card.appendChild(el("a", { text: "Offizieller Exam Guide", attrs: { href: guide, target: "_blank", rel: "noopener", "aria-label": `Offizieller Exam Guide · ${path.exam.name}` } }));
    const chooseBtn = el("button", { class: "primary-btn onboarding-choose-btn", text: path.buttonLabel, attrs: { type: "button" } });
    chooseBtn.addEventListener("click", () => {
      saveSettings({ certificationPath: path.id });
      ctx.navigate("#/dashboard");
    });
    card.appendChild(chooseBtn);
    cardsWrap.appendChild(card);
  });

  container.appendChild(cardsWrap);
  container.appendChild(
    el("p", {
      class: "item-hint",
      text: "Du kannst deinen Lernpfad jederzeit in den Einstellungen wechseln — dein bisheriger Fortschritt bleibt dabei erhalten."
    })
  );
}
