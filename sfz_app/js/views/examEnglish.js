// views/examEnglish.js — Statische Referenzseite: Analyse des in den Salesforce-Zertifizierungsprüfungen
// verwendeten Englisch (Satzbau, Signalwörter, CEFR-Einordnung, Lesestrategie, seriöse Quellen).
// Bewusst ohne Filter/Interaktion — reiner Lesestoff, siehe Kapitel 4 der Recherchebasis
// (01_Recherchebasis_und_Content-Grundlage.md).

import { el } from "../utils.js";

export async function render(container) {
  container.textContent = "";

  const wrap = el("div", { class: "exam-english-view" });
  wrap.appendChild(el("h1", { text: "Prüfungsenglisch" }));

  wrap.appendChild(
    el("p", {
      class: "item-hint",
      text:
        "Quelle dieser Analyse: eigene Auswertung des offiziellen Salesforce Administrator Practice Tests " +
        "(developer.salesforce.com/files/ti/thi/THI-000393), der Formulierungen aus den offiziellen Exam Outlines " +
        "(z. B. „given a scenario“, „describe“, „explain how to“) sowie der CEFR-Referenzbeschreibungen des " +
        "Europarats (Common European Framework of Reference for Languages). Abgerufen am 15.08.2026."
    })
  );

  wrap.appendChild(section1());
  wrap.appendChild(section2());
  wrap.appendChild(section3());
  wrap.appendChild(section4());
  wrap.appendChild(section5());
  wrap.appendChild(section6());

  container.appendChild(wrap);
}

function card(titleText) {
  const c = el("div", { class: "card" });
  c.appendChild(el("h2", { text: titleText }));
  return c;
}

function bullets(items) {
  const list = el("ul");
  items.forEach(({ term, text }) => {
    const li = el("li");
    if (term) {
      li.appendChild(el("strong", { text: term + " – " }));
      li.appendChild(document.createTextNode(text));
    } else {
      li.textContent = text;
    }
    list.appendChild(li);
  });
  return list;
}

function section1() {
  const c = card("1. Aufbau der Szenariofragen");
  c.appendChild(
    el("p", {
      text:
        "Fast jede Salesforce-Szenariofrage folgt einer festen Zwei-Satz-Anatomie. Ein reales Beispiel aus dem " +
        "offiziellen Practice Test zeigt das:"
    })
  );

  const quote = el("div", { class: "item-scenario" });
  quote.appendChild(
    el("p", {
      text:
        "„A sales manager from Universal Containers wants to assign leads that come in from its website to queues. " +
        "What standard process can the app builder recommend?“"
    })
  );
  c.appendChild(quote);

  c.appendChild(
    el("p", {
      class: "item-hint",
      text:
        "Antwortoptionen u. a.: „Create a lead assignment rule that sort leads into queues.“ (richtig) · " +
        "„Create a manual process…“ · „Create an Apex class…“ · „Create a default lead owner…“"
    })
  );

  c.appendChild(el("h3", { text: "Die Zwei-Satz-Anatomie" }));
  c.appendChild(
    bullets([
      {
        term: "Satz 1 – Setup-Satz",
        text:
          'fiktive Firma (meist „Universal Containers“) + Rolle + Bedürfnis/Problem ("wants to…", "needs to…", ' +
          '"is concerned that…").'
      },
      {
        term: "Satz 2 – Frage-Satz",
        text:
          'direkte Interrogativ-Frage nach der Lösung ("What standard process…", "Which two…", "What should the ' +
          'administrator recommend?").'
      }
    ])
  );

  c.appendChild(
    el("p", {
      text:
        "Die falschen Antwortoptionen sind syntaktisch fast identisch zur richtigen – der Unterschied liegt im " +
        "Fachbegriff, nicht in der Grammatik. Nicht der Satzbau ist die Hürde, sondern das gezielte Wiedererkennen " +
        "des korrekten Fachbegriffs."
    })
  );
  return c;
}

function section2() {
  const c = card("2. Wiederkehrende Formulierungen – Funktion und Fallen");
  const wrap = el("div", { class: "signal-words" });
  wrap.appendChild(
    bullets([
      {
        term: "given a scenario",
        text:
          "Funktion: signalisiert, dass eine Situationsbeschreibung folgt, keine reine Faktenfrage. Falle: " +
          "erwartet Anwendung, nicht nur Definition."
      },
      {
        term: "most appropriate / best solution / best practice",
        text:
          "Funktion: verlangt eine Bewertung zwischen mehreren technisch funktionierenden Optionen. Falle: " +
          "mehrere Antworten „funktionieren“, nur eine ist Best Practice."
      },
      {
        term: "which two / select two / choose all that apply",
        text:
          "Funktion: markiert Multiple-Select statt Single-Choice. Falle: übersehen führt automatisch zu einer " +
          "unvollständigen, falschen Antwort."
      },
      {
        term: "based on the requirement",
        text:
          "Funktion: verweist zurück auf eine zuvor im Text genannte Einschränkung. Falle: erfordert Rückbezug – " +
          "die Anforderung aus Satz 1 muss gemerkt/markiert werden."
      },
      {
        term: "ensure that",
        text:
          "Funktion: kennzeichnet eine Zielbedingung, die die Lösung erfüllen MUSS. Falle: Lösungen, die die " +
          "meisten, aber nicht alle Bedingungen erfüllen, sind falsch."
      },
      {
        term: "without code / declaratively / without using Apex",
        text:
          "Funktion: schließt Code-Lösungen explizit aus. Falle: technisch korrekte, aber code-basierte " +
          "Antwortoptionen sind bewusste Distraktoren."
      },
      {
        term: "at least / no more than / up to",
        text: "Funktion: Quantoren, die exakte Ober-/Untergrenzen setzen. Falle: Off-by-one-Fehler bei ungenauem Lesen."
      },
      {
        term: "identify / describe / determine",
        text:
          "Funktion: aus den offiziellen Exam Outlines selbst – zeigt die kognitive Stufe der Frage. Falle: " +
          '"identify" verlangt Erkennen, "determine" verlangt Ableiten/Entscheiden – eine höhere Stufe als reines ' +
          "Erkennen."
      }
    ])
  );
  c.appendChild(wrap);
  return c;
}

function section3() {
  const c = card("3. Negationen, Modalverben, Präpositionen");
  c.appendChild(
    bullets([
      {
        term: "Negationen",
        text:
          '"should NOT", "cannot be modified", "is not recommended" – stehen in Antwortoptionen oft am Satzende ' +
          "versteckt und verlangen doppelt genaues Lesen, da eine verneinte richtige Aussage leicht als falsch " +
          "markiert wird und umgekehrt."
      },
      {
        term: "Modalverben nach Stärke geordnet",
        text:
          "must (zwingend) > should (empfohlen/Best Practice) > can/could (technisch möglich, nicht zwingend). Die " +
          "Prüfung nutzt diese Abstufung gezielt, um zwischen „funktioniert“ und „ist die beste Lösung“ zu " +
          "unterscheiden."
      },
      {
        term: "Präpositionen mit Bedeutungsverschiebung",
        text:
          '"assigned to a queue" vs. "assigned by a rule" – die falsche Präposition ändert den technischen ' +
          'Sachverhalt vollständig; wichtig bei Objektbeziehungen ("related to", "child of", "shared with").'
      }
    ])
  );
  return c;
}

function section4() {
  const c = card("4. CEFR-Einordnung: B1 vs. B2");
  c.appendChild(
    el("p", {
      text:
        "Grundlage sind die offiziellen Europarat-Deskriptoren für Leseverständnis. Diese Regel bestimmt, welche " +
        "Inhalte in der App als B1 bzw. B2 gekennzeichnet werden:"
    })
  );

  c.appendChild(el("h3", { text: "B1 – Hauptpunkte bei vertrauten Themen, klare Standardsprache" }));
  c.appendChild(
    bullets([
      { text: "einfacher Satzbau (ein Hauptsatz, maximal ein Nebensatz)" },
      { text: "konkrete, direkt übersetzbare Fachbegriffe (Lead, Account, Report, Field, User)" },
      { text: "direkte Frage ohne mehrfache Bedingungen" }
    ])
  );

  c.appendChild(el("h3", { text: "B2 – Hauptaussagen komplexer, auch abstrakter Fachtexte" }));
  c.appendChild(
    bullets([
      { text: "mehrfache Satzverschachtelung (Bedingungssatz + Zielsatz + Einschränkung, wie im Beispiel oben)" },
      { text: "abstrakte Mehrwortbegriffe (Role Hierarchy, Sharing Rule, Cross-Object Formula, Order of Execution)" },
      { text: "notwendige Ausschlusslogik zwischen mehreren plausiblen Distraktoren" }
    ])
  );

  c.appendChild(
    el("p", {
      class: "item-hint",
      text:
        "Faustregel: Ist eine Frage in einem Satz ohne Nebenbedingung beantwortbar und muss nur ein Fachbegriff " +
        'erkannt werden → B1. Muss zusätzlich eine Einschränkung ("ensure that…", "without code…", "based on the ' +
        "requirement…“) berücksichtigt und mindestens ein naheliegender Distraktor aktiv ausgeschlossen werden → B2."
    })
  );
  return c;
}

function section5() {
  const c = card("5. Lesestrategie: die Drei-Schritt-Methode");
  const list = el("ol");
  [
    {
      term: "Wer + was + Bedingung markieren",
      text:
        'Firma/Rolle identifizieren, das eigentliche Bedürfnis unterstreichen, Einschränkungen ("ensure that", ' +
        '"without code", "at least") separat notieren.'
    },
    {
      term: "Frageart erkennen",
      text:
        'Single-Choice ("What…", "Which…") vs. Multiple-Select ("Which two…", "Select all…"); Bewertungsfrage ' +
        '("most appropriate", "best") vs. Faktenfrage ("describe", "what is").'
    },
    {
      term: "Antwortoptionen durch Ausschluss prüfen",
      text:
        "zuerst technisch unmögliche/falsche Fachbegriffe streichen, dann unter den verbleibenden „funktionierenden“ " +
        "Optionen die Best-Practice-Option anhand der in Schritt 1 markierten Einschränkungen auswählen."
    }
  ].forEach(({ term, text }) => {
    const li = el("li");
    li.appendChild(el("strong", { text: term + ": " }));
    li.appendChild(document.createTextNode(text));
    list.appendChild(li);
  });
  c.appendChild(list);
  c.appendChild(
    el("p", {
      class: "item-hint",
      text: "Diese Drei-Schritt-Logik steckt auch hinter der Signalwort-Analyse, die du bei jeder Szenariofrage in der App findest."
    })
  );
  return c;
}

function section6() {
  const c = card("6. Weiterführende Informationen: seriöse und unseriöse Quellen");

  c.appendChild(el("h3", { text: "Empfohlen" }));
  c.appendChild(
    bullets([
      {
        term: "Offizieller Exam Guide + offizieller Practice Test",
        text: "developer.salesforce.com – höchste Verlässlichkeit, direkt von Salesforce."
      },
      {
        term: "Trailhead",
        text: "Trailmixes, Module und Superbadges zu den jeweiligen Exam-Domains – offiziell und kostenlos."
      },
      {
        term: "Seriöse Drittanbieter",
        text:
          "z. B. Focus on Force / K2 University, Mike Wheelers Udemy-Kurse, Buch „Salesforce Certified Platform " +
          "Administrator Study Guide“ (O’Reilly, Wheeler, 2025) – nur als persönliche Lern- und Benchmark-Quelle " +
          "geeignet, keine Inhalte daraus kopieren."
      }
    ])
  );

  c.appendChild(el("h3", { text: "Strikt meiden" }));
  c.appendChild(
    bullets([
      {
        term: "Exam-Dump-Seiten",
        text:
          "z. B. ExamTopics, DumpsGate, Edurely, PassItExams-Dumps u. Ä. – Verstoß gegen das Salesforce " +
          "Certification Program Agreement, Risiko des Zertifikatsentzugs. Diese Seiten verbreiten teils geleakte " +
          "Originalfragen ohne Genehmigung – rechtlich und fachlich unseriös, unabhängig davon, wie „echt“ sie wirken."
      }
    ])
  );

  c.appendChild(
    el("p", {
      class: "disclaimer",
      text:
        "Alle Übungsinhalte in dieser App sind eigenständig formuliert und an den öffentlichen Exam Objectives " +
        "orientiert – keine Originalprüfungsfragen."
    })
  );
  return c;
}
