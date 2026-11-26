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
    title: "Foundations",
    subtitle: "Einstieg ohne Salesforce-Vorkenntnisse",
    exam: FOUNDATIONS,
    buttonLabel: "Foundations wählen",
    focus: "12 Wochen Foundations · Leseübungen überwiegend B1."
  },
  {
    id: "administrator",
    title: "Administrator",
    subtitle: "Für Lernende mit Foundations-Grundwissen",
    exam: ADMINISTRATOR,
    buttonLabel: "Administrator wählen",
    focus: "12 Wochen Administrator · Leseübungen auf B1 und B2."
  },
  {
    id: "administrator-full",
    title: "Administrator inklusive Foundations",
    subtitle: "Für den Einstieg in beide Themen",
    exam: ADMINISTRATOR,
    buttonLabel: "Administrator inkl. Foundations wählen",
    focus: "5 Wochen Grundlagen, 7 Wochen Administration · Leseübungen auf B1 und B2."
  }
];

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Wähle deinen Lernpfad" }));
  container.appendChild(el("p", {
    text: "Du kannst den Pfad später in den Einstellungen wechseln. Dein Lernfortschritt bleibt erhalten."
  }));

  const cards = el("div", { class: "onboarding-cards" });
  for (const path of PATHS) {
    const choose = el("button", { class: "primary-btn onboarding-choose-btn", text: path.buttonLabel, attrs: { type: "button" } });
    choose.addEventListener("click", () => {
      saveSettings({ certificationPath: path.id });
      ctx.navigate("#/dashboard");
    });
    cards.appendChild(el("section", { class: "onboarding-card" }, [
      el("h2", { text: path.title }),
      el("p", { class: "onboarding-fit", text: path.subtitle }),
      el("p", { class: "item-hint", text: path.focus }),
      choose,
      examDetails(path.exam)
    ]));
  }
  container.appendChild(cards);
}

function examDetails(exam) {
  const { name, questions, minutes, passing, fee, retakeFee, guide } = exam;
  const retake = retakeFee ? `${retakeFee} USD` : "kostenlos";
  const facts = [
    `${questions} gewertete Multiple-Choice-Fragen plus bis zu fünf ungewertete · ${minutes} Minuten`,
    `${passing} % Bestehensgrenze in der englischen Prüfung`,
    `${fee} USD Prüfungsgebühr, Wiederholung ${retake} (jeweils ggf. zzgl. Steuern)`,
    "Salesforce nennt keine formale Prüfungsvoraussetzung."
  ];
  if (exam === ADMINISTRATOR) facts.push("Salesforce empfiehlt mindestens sechs Monate praktische Erfahrung in der Administration.");

  return el("details", { class: "onboarding-details" }, [
    el("summary", { text: "Prüfungsdetails" }),
    el("p", { text: name, attrs: { lang: "en" } }),
    el("ul", {}, facts.map((text) => el("li", { text }))),
    el("a", {
      text: "Offizieller Exam Guide",
      attrs: { href: guide, target: "_blank", rel: "noopener", "aria-label": `Offizieller Exam Guide · ${name}` }
    })
  ]);
}
