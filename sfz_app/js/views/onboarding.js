// views/onboarding.js — Pflicht-Auswahl des Lernpfads beim ersten Start (oder nach Reset).
// Wird von app.js erzwungen angezeigt, solange state.settings.certificationPath nicht gesetzt ist.

import { saveSettings } from "../state.js";
import { el, clear } from "../utils.js";

const PATHS = [
  {
    id: "foundations",
    title: "Salesforce Certified Platform Foundations",
    subtitle: "Keine Vorkenntnisse nötig — empfohlener Einstieg",
    buttonLabel: "Foundations wählen",
    facts: [
      "Keine Prüfungsvoraussetzung — für alle geeignet, auch ganz ohne Salesforce-Erfahrung",
      "40 Multiple-Choice-Fragen, 70 Minuten",
      "Bestehensgrenze: 62 %",
      "Kosten: 75 USD, Retake kostenlos",
      "Englisch-Niveau: überwiegend B1 — einfacherer Satzbau, direkt übersetzbare Fachbegriffe",
      "12-Wochen-Plan: kompletter Fokus auf Foundations-Stoff"
    ]
  },
  {
    id: "administrator",
    title: "Salesforce Certified Platform Administrator",
    subtitle: "Setzt voraus, dass du die Foundations-Prüfung bereits bestanden hast",
    buttonLabel: "Administrator wählen",
    facts: [
      "Keine formale Prüfungsvoraussetzung bei Salesforce — buchbar auch ohne Foundations-Zertifikat",
      "Aber: der Administrator-Stoff baut inhaltlich auf dem Foundations-Wissen auf (Datenmodell, Security-Basics, Navigation) und wiederholt es nicht mehr",
      "Wähle diesen Pfad nur, wenn du die Foundations-Prüfung bereits bestanden hast bzw. den Stoff sicher beherrschst",
      "60 Fragen (Multiple-Choice/-Select), 105 Minuten",
      "Bestehensgrenze: 68 % (Englisch)",
      "Kosten: 200 USD, Retake 100 USD",
      "Englisch-Niveau: B1 und B2 — mehr Fachvokabular, komplexere Szenariofragen mit Einschränkungen",
      "12-Wochen-Plan: kompletter Fokus auf Administrator-Stoff, keine Foundations-Wiederholung"
    ]
  },
  {
    id: "administrator-full",
    title: "Salesforce Certified Platform Administrator (Foundations included)",
    subtitle: "Keine Vorkenntnisse nötig — Foundations- und Administrator-Stoff in einem Plan",
    buttonLabel: "Administrator inkl. Foundations wählen",
    facts: [
      "Keine Prüfungsvoraussetzung — für alle geeignet, die direkt auf Administrator zusteuern, aber Foundations-Stoff noch nicht beherrschen",
      "12-Wochen-Plan: Woche 1-5 Foundations-Grundlagen, Woche 6-12 Administrator-Schwerpunkte",
      "Ziel-Zertifizierung ist Administrator (60 Fragen, 105 Min., Bestehensgrenze 68 %, 200 USD) — Foundations-Prüfung ist optional als Zwischenschritt",
      "Englisch-Niveau: B1 in den ersten Wochen, danach zunehmend B1/B2"
    ]
  }
];

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Willkommen — welchen Lernpfad möchtest du starten?" }));
  container.appendChild(
    el("p", {
      class: "item-hint",
      text:
        "Die drei Pfade unterscheiden sich im Umfang, im englischen Sprachniveau und in der Wochenplanung. " +
        "Wähle den Pfad, an dem du gerade arbeitest — Vokabeln, Übungen, Glossar und dein 12-Wochen-Plan werden darauf zugeschnitten."
    })
  );
  container.appendChild(
    el("p", {
      class: "item-hint onboarding-prereq-note",
      text:
        "Zur Prüfungsvoraussetzung: Salesforce verlangt formal kein bestandenes Foundations-Zertifikat, um die Administrator-Prüfung zu buchen — " +
        "beide Prüfungen sind unabhängig voneinander ablegbar. Pfad 1 und Pfad 3 setzen daher keine Vorkenntnisse voraus. " +
        "Pfad 2 setzt aber inhaltlich voraus, dass du den Foundations-Stoff bereits beherrschst (z. B. durch die bestandene Foundations-Prüfung) — " +
        "er wiederholt diesen Stoff nicht mehr."
    })
  );

  const cardsWrap = el("div", { class: "onboarding-cards" });

  PATHS.forEach((path) => {
    const card = el("button", { class: "onboarding-card", attrs: { type: "button" } });
    card.appendChild(el("h2", { text: path.title }));
    card.appendChild(el("p", { class: "item-hint", text: path.subtitle }));
    const list = el("ul");
    path.facts.forEach((f) => list.appendChild(el("li", { text: f })));
    card.appendChild(list);
    card.appendChild(el("span", { class: "primary-btn onboarding-choose-btn", text: path.buttonLabel }));

    card.addEventListener("click", () => {
      saveSettings({ certificationPath: path.id });
      ctx.navigate("#/dashboard");
    });
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
