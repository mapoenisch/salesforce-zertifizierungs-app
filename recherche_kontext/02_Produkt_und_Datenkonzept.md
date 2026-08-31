# Salesforce-Zertifizierungs-App — Produkt- und Datenkonzept (Lieferung 2)

**Stand: 15.08.2026 · Für: Marc Poenisch · Basis: 01_Recherchebasis_und_Content-Grundlage.md**

Dieses Dokument übersetzt die Recherche aus Lieferung 1 in ein bauFähiges Konzept: User Stories, Informationsarchitektur, Dateistruktur, JSON-Datenmodell mit Beispieldaten, SM-2-Logik und MVP-Abgrenzung. Noch kein Code — das ist Lieferung 3.

**Offener Punkt aus Lieferung 1 (Kapitel 11.1) entschieden:** Der Prototyp startet mit der MVP-Mindestanforderung (40 Vokabeln / 30 Fragen / 15 Matching / 15 Reading-Passagen / 5 Praxisaufgaben), da das die Projektvorgabe für Lieferung 3 ist. Die Zielgröße von 90 Vokabeln / 60 Fragen aus Kapitel 6.2 bleibt das Ausbauziel für spätere Iterationen (Phase 7 laut Projektanweisung).

---

## 1. MVP-User-Stories (max. 10)

1. Als Lernender sehe ich auf dem Dashboard sofort, wie viele Wiederholungen heute fällig sind, damit ich ohne Nachdenken direkt starten kann.
2. Als Lernender starte ich mit einem Klick eine tägliche Einheit (20–40 Min.), die automatisch fällige Wiederholungen, neue Begriffe, Matching und eine Reading-Passage kombiniert.
3. Als Lernender übe ich Vokabeln im Lückentext-Format und bekomme direkt nach der Antwort deutsche Erklärung, Salesforce-Kontext und Merksatz.
4. Als Lernender ordne ich Fachbegriffe ihren Definitionen zu (Auswahl oder Drag-and-Drop, tastaturbedienbar) und sehe sofort, was richtig/falsch war.
5. Als Lernender lese ich eine kurze englische Szenario-Passage, beantworte eine Verständnisfrage und erhalte danach fachliche Erklärung, Ausschlusslogik und Signalwort-Analyse.
6. Als Lernender vergebe ich nach jeder Antwort eine Sicherheit (1–5), damit das System meine Wiederholungen realistisch plant.
7. Als Lernender sehe ich im Glossar jeden Begriff mit Kontext, Beispielsatz, CEFR-Level und häufigen Verwechslungsbegriffen und kann gezielt danach filtern.
8. Als Lernender starte ich eine zeitlich begrenzte Mini-Prüfung, gefiltert nach Zertifizierung, Domain, CEFR-Level oder Fehlerstatus.
9. Als Lernender sehe ich meinen Fortschritt gegen den 12-Wochen-Plan: Wochen-Soll vs. Wochen-Ist, Monatsmeilenstein, Abdeckung je Exam-Domain.
10. Als Lernender exportiere und importiere ich meinen kompletten Lernstand als JSON-Datei, damit ich ihn sichern oder auf ein anderes Gerät übertragen kann.

---

## 2. Informationsarchitektur

```
App
├── Dashboard (Startseite)
│   ├── "Heutige Einheit starten" (Primäraktion)
│   ├── Fällige Wiederholungen (Zähler)
│   ├── Wochen-Soll vs. Wochen-Ist
│   ├── Monatsmeilenstein-Status
│   ├── Fortschritt: Foundations vs. Administrator
│   ├── Fortschritt je Exam-Domain
│   ├── Fortschritt B1 vs. B2
│   └── Top-3-Schwachpunkte
│
├── Lernmodus (tägliche Einheit)
│   ├── Schritt 1: Fällige SM-2-Wiederholungen
│   ├── Schritt 2: Neue Vokabeln (Lückentext)
│   ├── Schritt 3: Definitions-Matching
│   ├── Schritt 4: Reading-Passage(n) + Frage(n)
│   ├── Schritt 5: Kurzer Lernhinweis / optionale Playground-Aufgabe
│   └── Abschluss: Sitzungs-Zusammenfassung
│
├── Frage-/Prüfungsmodus
│   ├── Freies Üben (Filter: Zertifizierung, Domain, CEFR, Format, Schwierigkeit, Fehlerstatus)
│   └── Mini-Prüfung (Zeitlimit, feste Fragenzahl, Auswertung erst nach Abgabe)
│
├── Glossar
│   ├── Suche + Filter (Domain, CEFR, Zertifizierung, Wiederholungsstatus)
│   └── Detailkarte je Begriff
│
├── Fortschritt
│   ├── Trefferquote, Sicherheit, Bearbeitungszeit
│   ├── Domain-Abdeckung nach offizieller Gewichtung
│   ├── Fällige/überfällige Wiederholungen
│   ├── Wochen-/Monatsziel-Erreichung
│   └── Schwachpunktanalyse
│
└── Einstellungen
    ├── Dark/Light Mode
    ├── Tagesziel (Minuten)
    └── JSON-Export/-Import
```

Navigation: einfache obere/seitliche Navigationsleiste mit fünf Hauptpunkten (Dashboard, Lernen, Prüfung, Glossar, Fortschritt), Einstellungen über Icon. Vollständig per Tastatur bedienbar, sichtbare Fokuszustände.

---

## 3. Dateistruktur

```
salesforce_zertifizierungs_app/
├── index.html
├── styles.css
├── app.js                        # Einstiegspunkt, initialisiert DB, Router, Views
├── js/
│   ├── db.js                     # IndexedDB-Wrapper (Stores: learningProgress, settings-cache)
│   ├── sm2.js                    # SM-2-Algorithmus, Priorisierungslogik
│   ├── contentLoader.js          # Lädt/cached die JSON-Dateien aus data/
│   ├── state.js                  # Zentraler App-State (kein Framework, einfacher Store)
│   ├── weeklyPlan.js             # Soll-Ist-Vergleich, Meilenstein-Logik
│   ├── exportImport.js           # JSON-Export/-Import des Lernstands
│   └── views/
│       ├── dashboard.js
│       ├── learn.js
│       ├── quiz.js
│       ├── glossary.js
│       ├── progress.js
│       └── settings.js
├── data/
│   ├── questions.json
│   ├── vocabulary.json
│   ├── reading-passages.json
│   ├── definitions.json
│   ├── practice-tasks.json
│   ├── exam-domains.json
│   └── weekly-plan.json
├── 01_Recherchebasis_und_Content-Grundlage.md
└── 02_Produkt_und_Datenkonzept.md
```

`settings` (Theme, Tagesziel etc.) liegt in LocalStorage, nicht als Datei. `learningProgress`/`reviewSchedule` sind IndexedDB-Stores zur Laufzeit, keine statischen JSON-Dateien — sie werden aus den Content-JSONs referenziert (per `contentId`), aber getrennt gespeichert, damit Content-Updates den Lernfortschritt nicht überschreiben.

---

## 4. JSON-Datenmodell mit Beispieldatensätzen

Gemeinsame Pflichtfelder aller Content-Typen: `id`, `certification`, `examDomainId`, `cefr`, `format`, `difficulty`, `source`.

### 4.1 `exam-domains.json`

Referenztabelle für Gewichtungen — Grundlage der Priorisierungslogik.

```json
[
  {
    "id": "adm-config-setup",
    "certification": "administrator",
    "name": "Configuration and Setup",
    "weightPercent": 15,
    "source": "help.salesforce.com Exam Guide Administrator, Artikel 005298966, abgerufen 15.08.2026"
  },
  {
    "id": "adm-data-analytics",
    "certification": "administrator",
    "name": "Data and Analytics Management",
    "weightPercent": 17,
    "source": "help.salesforce.com Exam Guide Administrator, Artikel 005298966, abgerufen 15.08.2026"
  },
  {
    "id": "fnd-ecosystem",
    "certification": "foundations",
    "name": "Salesforce Ecosystem",
    "weightPercent": 32,
    "source": "help.salesforce.com Exam Guide Foundations, Artikel 005298979, abgerufen 15.08.2026"
  }
]
```

*(Vollständige Liste: 8 Administrator-Domains + 4 Foundations-Domains aus Kapitel 3.2/3.3 der Recherchebasis.)*

### 4.2 `vocabulary.json` — Format "Vokabel im Kontext"

```json
[
  {
    "id": "vocab-adm-001",
    "certification": "administrator",
    "examDomainId": "adm-config-setup",
    "cefr": "B1",
    "format": "vocabulary-in-context",
    "difficulty": "easy",
    "term": "Permission Set",
    "clozeSentence": "A ____ lets an administrator grant additional access to a user without changing their profile.",
    "options": ["Permission Set", "Role Hierarchy", "Sharing Rule", "Public Group"],
    "correctOption": "Permission Set",
    "germanExplanation": "Eine Sammlung zusätzlicher Berechtigungen, die einem einzelnen Nutzer zusätzlich zum Profil zugewiesen wird.",
    "salesforceContext": "Wird genutzt, wenn ein Nutzer über sein Standardprofil hinaus punktuell mehr Rechte braucht, ohne ein neues Profil anzulegen.",
    "memoryHook": "Permission Set = Zusatzrechte oben drauf, nicht Ersatz fürs Profil.",
    "confusableTerms": ["Profile", "Permission Set Group"],
    "source": "01_Recherchebasis_und_Content-Grundlage.md, Kapitel 7.1"
  }
]
```

### 4.3 `definitions.json` — Format "Definitions-Matching"

```json
[
  {
    "id": "def-adm-001",
    "certification": "administrator",
    "examDomainId": "adm-object-manager",
    "cefr": "B2",
    "format": "definition-matching",
    "difficulty": "medium",
    "term": "Master-Detail Relationship",
    "definition": "A relationship where the child record's existence and record-level security depend entirely on its parent; deleting the parent deletes all related children.",
    "distractorDefinitions": [
      "A loose relationship where the child record can exist independently of the parent.",
      "A relationship type used only to link two custom objects in a many-to-many pattern.",
      "A field-level setting that restricts which users can edit a record."
    ],
    "germanExplanation": "Starke Objektbeziehung: Kind-Datensatz kann ohne Eltern-Datensatz nicht existieren; Löschen des Eltern-Datensatzes löscht auch alle Kind-Datensätze.",
    "source": "01_Recherchebasis_und_Content-Grundlage.md, Kapitel 7.1"
  }
]
```

### 4.4 `reading-passages.json` — Format "Szenario lesen und beantworten"

```json
[
  {
    "id": "read-adm-001",
    "certification": "administrator",
    "examDomainId": "adm-automation",
    "cefr": "B2",
    "format": "scenario-reading",
    "difficulty": "medium",
    "disclaimer": "Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage.",
    "scenario": "Universal Containers wants incoming support cases to be automatically routed to the correct queue based on case priority. The solution must work without writing any Apex code and must ensure that cases are escalated if no agent responds within 24 hours.",
    "questions": [
      {
        "id": "read-adm-001-q1",
        "type": "single-choice",
        "text": "What should the administrator configure to meet this requirement?",
        "options": [
          { "id": "a", "text": "A case assignment rule combined with an escalation rule.", "correct": true,
            "explanation": "Assignment rules route cases declaratively by criteria (e.g. priority); escalation rules handle the 24-hour SLA — both without Apex." },
          { "id": "b", "text": "A custom Apex trigger on the Case object.", "correct": false,
            "explanation": "Verstößt gegen 'without writing any Apex code' — technisch möglich, aber ausgeschlossen." },
          { "id": "c", "text": "A single validation rule on the Case object.", "correct": false,
            "explanation": "Validation Rules verhindern falsche Dateneingabe, lösen aber keine Zuweisung oder Eskalation aus." },
          { "id": "d", "text": "Manually reassigning cases each morning.", "correct": false,
            "explanation": "Kein automatisierter, skalierbarer Prozess — erfüllt die Anforderung nicht." }
        ]
      }
    ],
    "signalWordAnalysis": [
      "'without writing any Apex code' schließt Options c/b mit Code-Bezug aktiv aus.",
      "'ensure that' markiert eine Pflichtbedingung (24-Std.-Eskalation), die die Lösung vollständig erfüllen muss."
    ],
    "germanExplanation": "Case Assignment Rules übernehmen die regelbasierte Verteilung, Escalation Rules die zeitbasierte Nacheskalation — beides deklarativ ohne Code.",
    "source": "Eigene Formulierung nach Muster des offiziellen Practice Tests (developer.salesforce.com, THI-000393), Struktur siehe Recherchebasis Kapitel 4.1/8"
  }
]
```

### 4.5 `questions.json` — allgemeiner Fragenpool (Übung + Mini-Prüfungen)

Gleiche Grundstruktur wie eine einzelne Reading-Frage, aber ohne längere Passage — für schnelle Wiederholungsrunden und Mini-Prüfungen.

```json
[
  {
    "id": "q-adm-001",
    "certification": "administrator",
    "examDomainId": "adm-data-analytics",
    "cefr": "B1",
    "format": "scenario-question",
    "difficulty": "easy",
    "disclaimer": "Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage.",
    "questionText": "An administrator needs to load 50,000 new contact records into Salesforce in one operation. Which tool is most appropriate?",
    "type": "single-choice",
    "options": [
      { "id": "a", "text": "Data Loader", "correct": true, "explanation": "Für große Datenmengen (>50.000 Datensätze empfohlen ab, hier klar geeignet) ist der Data Loader das Standardwerkzeug." },
      { "id": "b", "text": "Import Wizard", "correct": false, "explanation": "Import Wizard ist für kleinere Mengen (bis 50.000) und weniger Objekttypen gedacht — funktioniert, ist aber nicht 'most appropriate' bei dieser Größenordnung." },
      { "id": "c", "text": "Report Export", "correct": false, "explanation": "Reports exportieren Daten, importieren sie aber nicht." },
      { "id": "d", "text": "Duplicate Rule", "correct": false, "explanation": "Duplicate Rules verhindern Duplikate, sind kein Importwerkzeug." }
    ],
    "signalWordAnalysis": ["'most appropriate' verlangt Abwägung zwischen mehreren technisch funktionierenden Tools."],
    "germanExplanation": "Data Loader ist das Werkzeug für große, wiederkehrende Datenoperationen; Import Wizard eher für kleine, einmalige Importe.",
    "source": "Eigene Formulierung, Struktur siehe Recherchebasis Kapitel 4/8"
  }
]
```

### 4.6 `practice-tasks.json` — Praxisaufgaben Playground/Developer Edition

```json
[
  {
    "id": "task-adm-001",
    "certification": "administrator",
    "examDomainId": "adm-automation",
    "cefr": "B1",
    "format": "practice-task",
    "difficulty": "medium",
    "title": "Screen Flow für Lead-Erfassung bauen",
    "instructions": "Erstelle im Trailhead Playground einen Screen Flow, der drei Eingabefelder für einen neuen Lead abfragt und den Lead automatisch anlegt. Prüfe anschließend, ob eine Assignment Rule den Lead korrekt zuweist.",
    "environment": "Trailhead Playground oder Developer Edition",
    "estimatedMinutes": 30,
    "source": "Eigene Aufgabenstellung, angelehnt an Trailhead-Modul 'Build Flows with Flow Builder' (offiziell, trailhead.salesforce.com)"
  }
]
```

### 4.7 `weekly-plan.json` — Wochen-Sollwerte (statisch, aus Kapitel 9)

```json
[
  {
    "week": 1,
    "focus": "Setup: Trailhead-Account, Playground, Exam Guides lesen",
    "newVocabTarget": 10,
    "reviewsTarget": 0,
    "readingExercisesTarget": 1,
    "milestone": "Setup abgeschlossen"
  },
  {
    "week": 4,
    "focus": "Foundations: Reports & Dashboards + Wiederholung",
    "newVocabTarget": 6,
    "reviewsTarget": 20,
    "readingExercisesTarget": 3,
    "milestone": "Monat 1: ≥80 % in Foundations-Übungsfragen"
  }
]
```

*(Alle 12 Wochen werden 1:1 aus der Tabelle in Recherchebasis Kapitel 9 übernommen.)*

### 4.8 `learningProgress` — IndexedDB-Store (kein statisches JSON, Laufzeitdaten)

```json
{
  "contentId": "vocab-adm-001",
  "contentType": "vocabulary",
  "certification": "administrator",
  "examDomainId": "adm-config-setup",
  "cefr": "B1",
  "repetitions": 3,
  "lastResult": "correct",
  "confidence": 4,
  "responseTimeMs": 8200,
  "easeFactor": 2.5,
  "intervalDays": 6,
  "nextReviewDate": "2026-08-21",
  "flag": null
}
```

`flag`: `"relearn"` | `"later"` | `null`. Index in IndexedDB auf `nextReviewDate` und `contentId` (Primärschlüssel).

### 4.9 `reviewSchedule` — abgeleitete Sicht, kein Extra-Store

Wird zur Laufzeit aus `learningProgress` berechnet (Filter `nextReviewDate <= heute`, sortiert nach Überfälligkeit). Kein doppelter Datenbestand nötig — vermeidet Inkonsistenzen zwischen Store und Sicht.

### 4.10 `settings` — LocalStorage, kein IndexedDB

```json
{
  "theme": "dark",
  "dailySessionMinutesTarget": 30,
  "startDate": "2026-05-18",
  "certificationFocus": "both"
}
```

---

## 5. SM-2-Logik (angepasst)

**Eingaben pro Antwort:** `correct` (bool), `confidence` (1–5), `responseTimeMs`.

**Schritt 1 — Quality-Mapping (SM-2 braucht eine Qualität 0–5):**

| correct | confidence | quality (q) |
|---|---|---|
| nein | 1–2 | 0 |
| nein | 3–4 | 1 |
| nein | 5 | 2 |
| ja | 1 | 3 |
| ja | 2–3 | 4 |
| ja | 4–5 | 5 |

**Schritt 2 — Ease-Factor-Update:**

`EF' = EF + (0.1 − (5−q) × (0.08 + (5−q) × 0.02))`, minimal begrenzt auf `EF' ≥ 1.3`.

**Schritt 3 — Intervall-Update:**

- Wenn `q < 3` (falsch beantwortet): `repetitions = 0`, `intervalDays = 1` (morgen erneut fällig), Flag `"relearn"`.
- Wenn `q ≥ 3` (richtig beantwortet):
  - `repetitions = 1` → `intervalDays = 1`
  - `repetitions = 2` → `intervalDays = 6`
  - `repetitions > 2` → `intervalDays = round(vorheriges Intervall × EF')`
  - `repetitions += 1`

`nextReviewDate = heute + intervalDays`.

**Priorisierung der täglichen Einheit** (unverändert aus Projektanweisung, hier operationalisiert):

1. `nextReviewDate <= heute` (überfällig), sortiert nach Überfälligkeitsdauer.
2. Inhalte mit `flag === "relearn"`.
3. Inhalte mit `flag === "later"` bzw. `confidence <= 2` bei letzter richtiger Antwort.
4. Neue Inhalte aus hoch gewichteten Domains zuerst (Sortierung nach `examDomains.weightPercent` absteigend).
5. Restliche neue Inhalte gemäß `weekly-plan.json`-Sollwert der aktuellen Woche.

---

## 6. Abgrenzung: nicht im MVP

- Audio, Aussprache, Speech-to-Text, Text-to-Speech, freies Sprechen.
- Freies Schreiben, komplexe KI-Textbewertung.
- Backend, Login, Cloud-Sync, externe Datenbank, API-Keys.
- Elo-, Bayesian-Knowledge-Tracing- oder andere komplexe Rating-Systeme (bewusst SM-2 statt komplexerer Modelle).
- Mehr als die drei definierten Übungsformate (Vokabel im Kontext, Definitions-Matching, Szenario lesen und beantworten).
- Gamification-Elemente (Punkte, Badges, Streaks) — nicht ausgeschlossen für spätere Iteration, aber kein MVP-Bestandteil.
- Mehrsprachige UI — Bedienoberfläche Deutsch, Lerninhalte Englisch mit deutscher Erklärung.
- Zusätzliche Content-Typen über die sieben definierten JSON-Strukturen hinaus.

---

## 7. Nachtrag (nach Lieferung 3): Verpflichtende Lernpfad-Auswahl

**Anlass:** Die App wird nicht nur von Marc, sondern auch von Mitlernenden aus der Weiterbildung "Digital Sales Management" genutzt. Diese unterscheiden sich erheblich im Englisch-Ausgangsniveau, und Foundations/Administrator unterscheiden sich deutlich im Inhalts- und Sprachumfang (Foundations überwiegend B1, Administrator B1+B2 mit deutlich mehr Fachvokabular). Deshalb wählt jede Person beim ersten Start genau einen Lernpfad, statt beide Zertifizierungen standardmäßig gemischt angezeigt zu bekommen.

**Änderungen am Konzept:**

- Neue Pflicht-Ansicht **Onboarding**, die vor dem Dashboard steht: zwei Auswahlkarten (Foundations / Administrator) mit den wichtigsten Fakten (Fragenzahl, Zeit, Bestehensgrenze, CEFR-Schwerpunkt, Zielgruppe). Ohne Auswahl ist keine andere Ansicht erreichbar.
- `settings.certificationPath` ersetzt `settings.certificationFocus`. Werte: `null` (noch nicht gewählt, erzwingt Onboarding), `"foundations"`, `"administrator"`. Es gibt bewusst **keine** "Beide"-Option mehr als Startzustand — das entspricht der Projektanweisung "zwischen zwei Lernpfaden entscheiden".
- **Pfadwechsel jederzeit möglich** über Einstellungen. Das deckt weiterhin Marcs eigenes Ziel ab, am Ende beide Zertifizierungen zu machen: Er wählt zuerst Foundations, legt die Prüfung ab, wechselt danach in den Einstellungen auf Administrator. Fortschrittsdaten beider Pfade bleiben in IndexedDB erhalten und werden nur je nach aktivem Pfad ein-/ausgeblendet — nichts geht beim Wechsel verloren.
- `weekly-plan.json` besteht jetzt aus **zwei vollständigen 12-Wochen-Tracks** (Feld `certification` pro Wocheneintrag) statt einem gemeinsamen Plan, der Foundations und Administrator nacheinander in einem Rutsch abarbeitet. Begründung: Ein Administrator-only-Lernender braucht von Woche 1 an Administrator-Inhalte, nicht erst ab Woche 6; ein Foundations-only-Lernender profitiert bei so kleinem Inhaltsumfang (12 Vokabeln, 10 Fragen, 5 Matching, 4 Reading) von einem stärker wiederholungsbasierten 12-Wochen-Track statt einem künstlich verkürzten. Beide Tracks bleiben mit dem 3-Monats-Rahmen und den Monatsmeilensteinen aus Kapitel 9 der Recherchebasis konsistent.
- Dashboard, Lernmodus, Glossar und Fortschritt filtern jetzt standardmäßig auf `settings.certificationPath`. Der Prüfungsmodus-Filter ("Zertifizierung") bleibt zusätzlich frei wählbar, damit z. B. Marc kurz in den jeweils anderen Pfad hineinschauen kann, ohne den aktiven Lernpfad zu wechseln.

*(Hinweis: Punkt "Pfadwechsel jederzeit möglich" oben beschreibt ein manuelles Nacheinander-Abarbeiten von zwei Pfaden. Das wurde in Nachtrag 2 durch einen expliziten dritten Lernpfad ersetzt, siehe unten.)*

## 7a. Nachtrag 2 (nach Nachtrag 1): Drei statt zwei Lernpfade — Prüfungsvoraussetzung richtiggestellt

**Anlass:** Nachtrag 1 ging implizit davon aus, dass die Administrator-Prüfung das bestandene Foundations-Zertifikat voraussetzt, und modellierte den Weg "erst Foundations, dann Administrator" als manuellen Pfadwechsel in den Einstellungen. Das ist **fachlich nicht korrekt**: Salesforce verlangt für keine der beiden Prüfungen eine bestandene Vorprüfung — beide sind unabhängig voneinander buchbar (Quellen: [Salesforce Ben – Administrator Guide](https://www.salesforceben.com/salesforce-administrator-certification/), [Salesforce Ben – Platform Foundations Guide](https://www.salesforceben.com/salesforce-associate-certification-guide-tips/), beide abgerufen 15.08.2026). Inhaltlich baut der Administrator-Stoff aber auf dem Foundations-Stoff auf (Datenmodell, Navigation, Security-Basics werden nicht erneut erklärt) — das ist der eigentliche Grund für einen kombinierten Pfad, nicht eine formale Prüfungsvoraussetzung.

**Änderungen am Konzept:**

- `settings.certificationPath` hat jetzt drei mögliche Werte: `"foundations"`, `"administrator"`, `"administrator-full"`.
  - `"foundations"`: nur Foundations-Stoff, keine Vorkenntnisse nötig (unverändert zu Nachtrag 1).
  - `"administrator"`: nur Administrator-Stoff, **setzt inhaltlich bestandenes Foundations-Wissen voraus** (keine formale Prüfungspflicht, aber der Plan wiederholt Foundations-Inhalte bewusst nicht).
  - `"administrator-full"` (neu): Zielzertifizierung ist Administrator, aber der 12-Wochen-Plan integriert die Foundations-Grundlagen für Lernende ohne Vorkenntnisse — keine Prüfungsvoraussetzung nötig.
- `data/weekly-plan.json` enthält jetzt **drei** vollständige 12-Wochen-Tracks statt zwei. Der neue `administrator-full`-Track splittet die 12 Wochen **5/7**: Woche 1-5 Foundations-Grundlagen (Setup, Ecosystem, Navigation, Data Model, Reports & Dashboards, Mini-Prüfung), Woche 6-12 Administrator-Schwerpunkte (Configuration/Object Manager, Data & Analytics, Automation, Sales/Service Apps, Productivity & Agentforce, zwei Prüfungssimulationen). Die 5/7-Aufteilung (statt 6/6) wurde gewählt, weil der Administrator-Stoff mengenmäßig deutlich größer ist (28 von 40 Vokabeln, 11 von 15 Reading-Passagen, 20 von 30 Fragen sind Administrator-getaggt) und höher gewichtete Domains wie Data & Analytics Management (17 %) mehr Zeit brauchen als der schmalere Foundations-Stoff.
- Jeder Wocheneintrag trägt zusätzlich ein `phase`-Feld (`"foundations"` oder `"administrator"`). Bei den Einzelpfaden ist das trivial identisch mit dem Pfad selbst; bei `administrator-full` steuert es, aus welchem Content-Pool der Lernmodus in der jeweiligen Woche neue (noch nicht bearbeitete) Inhalte zieht. Fällige SM-2-Wiederholungen sind davon unabhängig — einmal eingeführte Foundations-Inhalte werden auch in der Administrator-Phase (Woche 6-12) planmäßig weiter wiederholt, statt zu "verschwinden".
- Neue Helper-Funktion `pathCertifications(path)` in `state.js` bildet einen Lernpfad auf die binären Content-Certification-Tags ab (`["foundations"]`, `["administrator"]` bzw. `["foundations","administrator"]`). Dashboard, Lernmodus, Glossar und Fortschritt nutzen sie für Filterung, Domain-Anzeige und Wochen-Ist-Berechnung.
- Prüfungsmodus-Filter ("Zertifizierung") wird nur noch bei `administrator-full` überhaupt angezeigt (Optionen: Beide / Nur Foundations / Nur Administrator). Bei den beiden Einzelpfaden gibt es innerhalb des Pfads ohnehin nur eine Zertifizierung — der Filter würde nur unnötige Verwirrungsgefahr für Lernende mit niedrigerem Englischniveau schaffen und wurde deshalb entfernt statt nur umbenannt.
- Onboarding weist jetzt explizit auf die (fehlende) formale Prüfungsvoraussetzung hin und macht transparent, dass nur Pfad "Administrator (Foundations vorausgesetzt)" Vorkenntnisse verlangt.

## 8. Nächster Schritt

Lieferung 3: vollständiger, direkt lauffähiger Code (`index.html`, `styles.css`, `app.js`, sowie alle `data/*.json`-Dateien) mit den MVP-Mindestinhalten (30 Fragen, 40 Vokabeln, 15 Matching-Aufgaben, 15 Reading-Passagen, 5 Praxisaufgaben), gewichtet nach der offiziellen Administrator-Domain-Verteilung aus Kapitel 6.2 der Recherchebasis.
