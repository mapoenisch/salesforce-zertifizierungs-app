// views/onboarding.js — Pflicht-Auswahl von Plattform und Lernpfad beim ersten Start (oder nach Reset).
// Wird von app.js erzwungen angezeigt, solange state.settings.certificationPath nicht gesetzt ist.
//
// Zwei Schritte:
//   1. Plattform wählen (Salesforce oder HubSpot)
//   2. Lernpfad innerhalb der Plattform wählen
// Der zweite Schritt lässt sich über „Andere Plattform wählen" jederzeit zurücksetzen.

import { saveSettings } from "../state.js";
import { allPlatforms } from "../platforms.js";
import { el, clear } from "../utils.js";

const PATHS = {
  salesforce: [
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
  ],
  hubspot: [
    {
      id: "hubspot-inbound-sales",
      title: "Inbound-Sales-Zertifizierung",
      subtitle: "Methodik-Zertifizierung — empfohlener Einstieg, kein Produktzugang nötig",
      buttonLabel: "Inbound Sales wählen",
      facts: [
        "Offiziell: 7 Lektionen, 22 Videos, 5 Quizspiele, 3 Std. 20 Min. Kursdauer",
        "Kostenlos, Kurs und Prüfung auf Deutsch verfügbar",
        "Inhalt: Interessenten identifizieren, kontaktieren, Situation erkunden, beraten",
        "Kein HubSpot-Account mit kostenpflichtiger Edition nötig — reine Methodik",
        "Fragenanzahl, Zeitlimit und Bestehensgrenze veröffentlicht HubSpot nicht öffentlich; sie stehen im Kurs unter „Prüfung\"",
        "Wiederholung frühestens 12 Stunden nach dem letzten Versuch"
      ]
    },
    {
      id: "hubspot-sales-software",
      title: "Software-Zertifizierung zu HubSpot Sales Hub",
      subtitle: "Produktzertifizierung — Tools und Einstellungen im CRM",
      buttonLabel: "Sales Hub Software wählen",
      facts: [
        "Offiziell: 5 Lektionen, 19 Videos, 4 Quizspiele, 5 praktische Übungen, 2 Std. 9 Min. Kursdauer",
        "Kostenlos, Kurs und Prüfung auf Deutsch verfügbar, Abschluss über eine Multiple-Choice-Prüfung",
        "Inhalt: Leads erkennen, Kontaktaufnahme-Tools, Deals verwalten, Vertriebsberichte",
        "Zielgruppe laut HubSpot: Nutzende von Sales Hub Professional und Enterprise — zum Üben genügt ein kostenloser Account, einzelne Tools (Sequenzen, Leitfäden) sind dort aber nicht verfügbar",
        "Fragenanzahl, Zeitlimit und Bestehensgrenze veröffentlicht HubSpot nicht öffentlich; sie stehen im Kurs unter „Prüfung\"",
        "Wiederholung frühestens 12 Stunden nach dem letzten Versuch"
      ]
    },
    {
      id: "hubspot-frictionless-sales",
      title: "Reibungsloser Vertrieb",
      subtitle: "Prozess- und Teamebene — Reibung erkennen und entfernen",
      buttonLabel: "Reibungsloser Vertrieb wählen",
      facts: [
        "Offiziell: 5 Lektionen, 12 Videos, 2 Std. 6 Min. Kursdauer",
        "Kostenlos, Kurs und Prüfung auf Deutsch verfügbar",
        "Inhalt: Reibungspunkte identifizieren, Team befähigen, am Käufer ausrichten, Lernkultur aufbauen",
        "Kein Produktzugang nötig — Schwerpunkt liegt auf Prozess und Zusammenarbeit",
        "Fragenanzahl, Zeitlimit und Bestehensgrenze veröffentlicht HubSpot nicht öffentlich; sie stehen im Kurs unter „Prüfung\"",
        "Wiederholung frühestens 12 Stunden nach dem letzten Versuch"
      ]
    },
    {
      id: "hubspot-all",
      title: "Alle drei HubSpot-Zertifizierungen",
      subtitle: "Ein 12-Wochen-Plan über alle drei Prüfungen nacheinander",
      buttonLabel: "Alle drei wählen",
      facts: [
        "Woche 1-4: Inbound Sales (Methodik), danach Prüfung",
        "Woche 5-9: Sales Hub Software (Produkt), danach Prüfung",
        "Woche 10-12: Reibungsloser Vertrieb (Prozess), danach Prüfung",
        "Empfohlene Reihenfolge: erst Methodik, dann Werkzeug, dann Prozess",
        "Wiederholungen laufen über alle bereits gelernten Inhalte hinweg weiter"
      ]
    }
  ]
};

const PLATFORM_INTRO = {
  salesforce:
    "Die Salesforce-Prüfungen werden auf Englisch abgelegt. Dieser Bereich trainiert deshalb zusätzlich " +
    "Prüfungsenglisch und stuft alle Inhalte nach CEFR-Niveau (B1/B2) ein.",
  hubspot:
    "Die drei HubSpot-Zertifizierungen sind auf Deutsch verfügbar. Dieser Bereich enthält deshalb kein " +
    "Englischtraining und keine CEFR-Einstufung — nur Fachinhalte, Begriffe und Praxisszenarien auf Deutsch."
};

export async function render(container, ctx) {
  let selectedPlatform = null;

  function renderPlatformStep() {
    clear(container);
    container.appendChild(el("h1", { text: "Willkommen — welche Plattform möchtest du trainieren?" }));
    container.appendChild(
      el("p", {
        class: "item-hint",
        text:
          "Die App deckt zwei getrennte Zertifizierungswelten ab. Wähle zuerst die Plattform, " +
          "danach den konkreten Lernpfad. Wechseln kannst du später jederzeit in den Einstellungen — " +
          "dein Fortschritt bleibt für beide Plattformen erhalten."
      })
    );

    const wrap = el("div", { class: "onboarding-cards" });
    allPlatforms().forEach((platform) => {
      const card = el("button", { class: "onboarding-card", attrs: { type: "button" } });
      card.appendChild(el("h2", { text: platform.label }));
      card.appendChild(el("p", { class: "item-hint", text: PLATFORM_INTRO[platform.id] }));
      const list = el("ul");
      PATHS[platform.id].forEach((p) => list.appendChild(el("li", { text: p.title })));
      card.appendChild(list);
      card.appendChild(
        el("span", { class: "primary-btn onboarding-choose-btn", text: `${platform.label} wählen` })
      );
      card.addEventListener("click", () => {
        selectedPlatform = platform.id;
        renderPathStep();
      });
      wrap.appendChild(card);
    });
    container.appendChild(wrap);
  }

  function renderPathStep() {
    clear(container);
    const platformLabel = selectedPlatform === "hubspot" ? "HubSpot" : "Salesforce";
    container.appendChild(el("h1", { text: `${platformLabel}: welchen Lernpfad möchtest du starten?` }));
    container.appendChild(el("p", { class: "item-hint", text: PLATFORM_INTRO[selectedPlatform] }));

    if (selectedPlatform === "salesforce") {
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
    } else {
      container.appendChild(
        el("p", {
          class: "item-hint onboarding-prereq-note",
          text:
            "Alle drei HubSpot-Zertifizierungen sind kostenlos, unabhängig voneinander buchbar und auf Deutsch verfügbar. " +
            "Fragenanzahl, Zeitlimit und Bestehensgrenze veröffentlicht HubSpot nicht auf den öffentlichen Kursseiten — " +
            "sie sind im jeweiligen Kurs unter „Prüfung\" einsehbar. Angaben geprüft am 11.09.2026."
        })
      );
    }

    const cardsWrap = el("div", { class: "onboarding-cards" });
    PATHS[selectedPlatform].forEach((path) => {
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

    const backBtn = el("button", {
      class: "secondary-btn",
      text: "Andere Plattform wählen",
      attrs: { type: "button" }
    });
    backBtn.addEventListener("click", () => renderPlatformStep());
    container.appendChild(backBtn);

    container.appendChild(
      el("p", {
        class: "item-hint",
        text: "Du kannst Plattform und Lernpfad jederzeit in den Einstellungen wechseln — dein bisheriger Fortschritt bleibt dabei erhalten."
      })
    );
  }

  renderPlatformStep();
}
