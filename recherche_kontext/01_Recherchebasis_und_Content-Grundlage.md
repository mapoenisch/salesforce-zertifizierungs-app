# Salesforce-Zertifizierungs-App — Konsolidierte Recherchebasis & Content-Grundlage (Lieferung 1)

**Stand: 15.08.2026 · Für: Marc Poenisch · Zertifizierungen: Salesforce Certified Platform Foundations + Salesforce Certified Platform Administrator**

Dieses Dokument führt die beiden bereits vorhandenen Rechercheberichte im Projektordner ("Salesforce CRM & Zwei Zertifizierungen" und "Seriöse Übungsfragen-Quellen") zusammen, korrigiert einen Faktenwiderspruch zwischen ihnen anhand frisch abgerufener offizieller Quellen und ergänzt die laut Projektanweisung fehlenden Bausteine: **Prüfungsenglisch-Analyse, vollständiges Vokabular-/Themeninventar, Wochenplan mit Soll-Werten und Content-Spezifikation für Reading-Passagen.** Es enthält noch keinen Code — das ist gemäß verbindlicher Reihenfolge erst Lieferung 3.

---

## 0. TL;DR — was sich gegenüber den bisherigen Berichten ändert

1. **Faktenkorrektur (wichtig):** Die Bestehensgrenze der Administrator-Prüfung ist **68 % (Englisch) / 65 % (Japanisch)** — nicht 65 % pauschal. Der zweite gespeicherte Bericht hatte 65 % als "mathematisch konsistenter" fälschlich bevorzugt. Ich habe den offiziellen Exam Guide heute direkt abgerufen (help.salesforce.com, Artikel-ID 005298966, Renderzeitstempel 2026-08-13) — dort steht wörtlich: *"Passing score: English version 68%; Japanese version 65%."* Das ist jetzt zweifelsfrei bestätigt.
2. **Neu ergänzt:** Vollständige, wortgetreue Exam-Objectives beider Prüfungen (nicht nur Domänen-Namen und Prozente, sondern jeder einzelne Prüfungspunkt) — direkt von help.salesforce.com übernommen. Das ist die verlässlichste Grundlage für die Content-Priorisierung.
3. **Neu ergänzt:** Der komplette Abschnitt **Prüfungsenglisch** (Kapitel 4) fehlte in beiden bisherigen Berichten vollständig, obwohl er laut Projektanweisung explizit Teil von Lieferung 1 sein muss.
4. **Neu ergänzt:** Ein echtes **Vokabular- und Themeninventar** (Kapitel 7) mit rund 90 Fachbegriffen, nach Exam-Domain gruppiert, CEFR-getaggt und proportional zur offiziellen Gewichtung verteilt — bisher gab es nur eine grobe Themenliste ohne Umfang oder CEFR-Zuordnung.
5. **Neu ergänzt:** Ein echter **12-Wochen-Plan mit Wochen-Soll-Werten** (Kapitel 9) statt der bisherigen 3 groben Phasen.
6. **Neu ergänzt:** Eine **Content-Spezifikation für Reading-Passagen** (Kapitel 8), abgeleitet aus dem tatsächlichen offiziellen Practice-Test-Format (live abgerufen).
7. **Unverändert übernommen und weiterhin gültig:** CRM-Grundlagenbericht (Kapitel 2), rechtliche Einordnung zu Übungsfragen-Anbietern (Kapitel 5), Empfehlung zur Prüfungsreihenfolge Foundations → Administrator.

---

## 1. Quellenbericht mit Verlässlichkeitsbewertung

| Quelle | Typ | Verlässlichkeit | Verwendung | Abrufdatum |
|---|---|---|---|---|
| help.salesforce.com — Exam Guide Platform Administrator (Artikel 005298966) | Offiziell, Primärquelle | **Sehr hoch** | Bestehensgrenze, Gewichtung, vollständige Exam Objectives | 15.08.2026 (live abgerufen) |
| help.salesforce.com — Exam Guide Platform Foundations (Artikel 005298979) | Offiziell, Primärquelle | **Sehr hoch** | Bestehensgrenze, Gewichtung, vollständige Exam Objectives | 15.08.2026 (live abgerufen) |
| developer.salesforce.com — Administrator Practice Test (THI-000393) | Offiziell, Primärquelle | **Sehr hoch** | Reales Fragenformat, Satzstruktur-Vorlage, Feedback-Anatomie | 15.08.2026 (live abgerufen) |
| trailhead.salesforce.com — Trailmixes, Superbadges, Module | Offiziell | Sehr hoch | Lernressourcen-Empfehlungen | 14.08.2026 (aus Vorrecherche) |
| admin.salesforce.com — Blog "What the ... Exam Update Means for Admins" (E. Riley, 22.01.2026) | Offiziell (Salesforce-Autorin) | Hoch | Kontext zum Dezember-2025-Refresh | 14.08.2026 (aus Vorrecherche) |
| salesforce.com/blog — "The Salesforce Certification Lifecycle" | Offiziell | Hoch | Umbenennungen/Retirements 2026–2027 | 14.08.2026 (aus Vorrecherche) |
| Salesforce Ben (salesforceben.com) | Seriöse Sekundärquelle, Branchenmedium | Hoch, aber nicht offiziell | Einordnung, Erfahrungsberichte, Kontext | 14.08.2026 |
| Focus on Force / K2 University | Kommerzieller Drittanbieter, breite Reputation | Mittel–hoch (Aktualität schwankt) | Nur als Struktur-/Benchmark-Referenz, keine Fragenübernahme | 14.08.2026 |
| Mike Wheeler / Udemy-Kurse | Kommerzieller Drittanbieter, hohe Bewertungszahl | Mittel–hoch | Nur als Struktur-/Benchmark-Referenz | 14.08.2026 |
| getclientell.com, Reddit r/salesforce, BridgeGPT, Apex Hours | Community/Sekundärquellen | Mittel (Einzelmeinungen, teils veraltet) | Nur als ergänzende Erfahrungswerte, klar gekennzeichnet | 14.08.2026 |
| Exam-Dump-Seiten (ExamTopics, dumpsgate, edurely, passitexams u. Ä.) | Nicht seriös / Verstoß gegen Salesforce Certification Program Agreement | **Nicht verwendet** | Bewusst nicht als Quelle herangezogen | — |

**Verlässlichkeits-Prinzip für die App:** Für alle Grading-relevanten Fakten (Bestehensgrenze, Gewichtung, Fragenzahl, Zeit, Kosten) gilt ausschließlich der offizielle Exam Guide als Quelle. Sekundärquellen dienen nur zur Einordnung von Erfahrungswerten (Schwierigkeit, Lernzeit, Stolperfallen) und werden im Content-Modell als "Erfahrungsbericht, keine offizielle Aussage" gekennzeichnet.

---

## 2. Salesforce CRM & Customer 360 — Grundlagen

*(Übernommen und weiterhin gültig aus dem bestehenden Bericht "Salesforce CRM & Zwei Zertifizierungen", dort Abschnitt A — hier als Kurzreferenz für die Content-Architektur.)*

- **Customer 360**: Einheitliche Kundensicht über Sales, Service, Marketing, Commerce, IT hinweg (salesforce.com/ap/blog, offiziell).
- **Lightning Experience**: App Launcher, Navigation Bar, Setup-Zahnrad, Console Apps.
- **Standardobjekte**: Lead → (Convert) → Account + Contact (+ optional Opportunity); Case; Campaign; Activities (Task/Event); Reports & Dashboards.
- **Beziehungstypen**: Lookup (lose), Master-Detail (starke Verknüpfung, kaskadierendes Löschen, vererbte Sicherheit), Many-to-Many über Junction-Objekte.
- **Sicherheitsmodell, 4 Schichten**: Organisationsebene (Login Hours, IP-Ranges, MFA) → Objektebene (Profile/Permission Sets, CRUD) → Feldebene (Field-Level Security) → Datensatzebene (Org-Wide Defaults als restriktivste Basis, dann Role Hierarchy, Sharing Rules, Manual Sharing, Teams als *erweiternde* Mechanismen — Sharing kann nie über OWD hinaus einschränken).
- **Automatisierung**: Flow ist das aktuelle Primärwerkzeug; Workflow Rules und Process Builder sind offiziell abgekündigt (Support-Ende 31.12.2025), gelten aber weiterhin als **Legacy-Prüfungswissen** (Abgrenzung zu Flow muss erkannt werden).
- **Datenqualität**: Data Loader, Import Wizard, Duplicate Rules, Matching Rules, Validation Rules.

Diese Grundlagen bilden das inhaltliche Fundament sowohl für Foundations- als auch für Administrator-Content und werden in Kapitel 7 als Vokabular operationalisiert.

---

## 3. Zertifizierungsvergleich — mit vollständigen, wortgetreuen Exam Objectives

### 3.1 Kennzahlenvergleich (offiziell verifiziert, 15.08.2026 live abgerufen)

| Kriterium | Platform Foundations | Platform Administrator |
|---|---|---|
| Frühere Bezeichnung | Salesforce Certified Associate | Salesforce Certified Administrator (ADM-201) |
| Fragen | 40 Multiple-Choice + bis zu 5 unbewertete | 60 Multiple-Choice/-Select + bis zu 5 unbewertete |
| Zeit | 70 Minuten | 105 Minuten |
| **Bestehensgrenze** | **62 %** | **68 % (Englisch) / 65 % (Japanisch)** |
| Kosten | 75 USD, Retake kostenlos | 200 USD, Retake 100 USD |
| Voraussetzung | Keine | Keine (empfohlen: 6+ Monate Praxiserfahrung) |
| Exam-Version | Winter '25 | Summer '25 |
| Domänen | 4 | 8 |
| Wartung/Renewal | Keine erforderlich | Jährliche Maintenance-Badge auf Trailhead erforderlich |

### 3.2 Exam Outline Platform Foundations — vollständig, wörtlich

**Salesforce Ecosystem — 32 %**
- Given a scenario, describe various resources available to learn and apply in-demand Salesforce skills.
- Given a use case, identify which Salesforce Customer 360 product offerings could be used.
- Describe how companies use Salesforce.
- Differentiate between various job roles and career paths in the Salesforce ecosystem.

**Navigation — 28 %**
- Given a scenario, identify how a user can locate and access necessary information.
- Given a scenario, identify where Salesforce customization takes place.

**Data Model — 25 %**
- Explain the relationship between the core standard objects (account, contact, lead, opportunity, case).
- Given a scenario, determine which feature to use to ensure data visibility.
- Given a scenario, determine which tool to use to ensure data integrity.

**Reports & Dashboards — 15 %**
- Describe reports on Salesforce.
- Describe dashboards on Salesforce.

### 3.3 Exam Outline Platform Administrator — vollständig, wörtlich

**Configuration and Setup — 15 %**
- Describe the information found in the company settings (fiscal year, business hours, currency management, default settings).
- Distinguish and understand the administration of declarative configuration of the UI (UI/UX settings, app menu, list views, global actions, Lightning App Builder).
- Given a scenario, demonstrate proper setup and maintenance of users (unique username, locales, working hours, license distribution/types, deactivation implications, feature licenses, login methods).
- Explain organization Security Controls (Identity verification, Setup Audit Trail, Login Hours, Session Settings, agent access).
- Given a user request scenario, apply appropriate security controls (Teams, Sharing hierarchy, public groups, org-wide defaults, roles, subordinates, role hierarchy, report/dashboard folders).
- Given a scenario, determine appropriate use of a custom profile or permission set (profile settings, permission set group, muting).

**Object Manager and Lightning App Builder — 15 %**
- Describe standard object architecture and relationship model (standard object, parent/child, master-detail/lookup/junction relationships, record types, Schema Builder).
- Explain creation, deletion, customization of fields and page layouts on standard/custom objects; implications of deleting fields (roll-up summaries, cross-object formulas, picklist dependencies, relationship fields).
- Given a scenario, determine how to create/assign page layouts, visibility on Lightning pages, record types, business processes for custom/standard objects (quick actions, global actions).

**Sales and Marketing Applications — 10 %**
- Given a scenario, identify capabilities/implications of the sales process (leads, opportunities, path).
- Given a scenario, apply sales productivity features via opportunity tools (dashboards, lead scoring, Einstein for Sales, opportunity scoring, grading, home page assistant, forecasting, territory management).
- Describe lead automation tools and campaign management (leads, lead convert, lead assignment rules, campaign, campaign members).

**Service and Support Applications — 10 %**
- Describe case management capabilities (case, case assignment rules, queues).
- Given a scenario, identify how to automate case management (support process, case auto-response rules, case escalation, Einstein for Service).

**Productivity and Collaboration — 10 %**
- Describe activity management (tasks, events).
- Describe Chatter features (groups, accessibility, internal/external users).
- Describe Salesforce mobile app capabilities (Lightning page, app menu, visibility, branding, launchpad).
- Identify AppExchange use cases (managed/unmanaged packages, publishing rights, AgentExchange prompts, flows).

**Data and Analytics Management — 17 % (größte Domäne)**
- Describe considerations for importing, updating, transferring, mass deleting, exporting, backing up data (Archival, Apex Data Loader, Import Wizard).
- Describe data validation tools (duplicate rules, matching rules, validation rules).
- Describe report/report-type creation options (join objects, with/without records, field renaming, formulas, bucket fields, join reports, chart settings, hide details, grouping totals, troubleshooting).
- Describe the sharing model's impact on reports (visibility, folder structure, sharing fields).
- Describe dashboard creation/modification options (widgets, data sources, chart types, subscribing, dynamic dashboards, org licensing limits, "view dashboard as", scheduled refresh, filters).

**Automation — 15 %**
- Given a scenario, identify the appropriate automation solution (escalation rules, case/lead assignment rules, default automation user, AI).
- Describe Flow capabilities/use cases/configuration (screen flows, record-triggered flows, autolaunched flows, order of execution).
- Describe approval process capabilities (approver criteria, rejections, approvals).

**Agentforce — 8 %**
- Describe Agentforce capabilities and use cases (use-case scenarios, when AI is appropriate, security, troubleshooting agent permissions).
- Explain how to maintain/update/install prompts and instructions in Agent Builder (light testing, conversation preview).

**Empfohlene offizielle Lernressourcen (Administrator):** Trailmix "Prepare for Your Salesforce Platform Administrator Certification", Superbadge "Object Relationships", Superbadge "Flow Administration", Kurs CRT101 ("Prepare for your Administrator Certification Exam"), Kurs ADX201.

### 3.4 Empfehlung zur Reihenfolge

Unverändert: **Foundations zuerst**, dann Administrator. Begründung siehe Kapitel 6 (Roadmap) — günstiger Einstieg, kostenloser Retake, baut Ökosystem-Vokabular auf, das die Administrator-Domänen Configuration/Object Manager/Data direkt vorbereitet.

---

## 4. Prüfungsenglisch — Satzstrukturen, Signalwörter, CEFR-Einordnung, Lesestrategien

*(Dieser Abschnitt war in beiden bisherigen Berichten nicht enthalten und wird hier erstmals recherchiert und dokumentiert. Grundlage: der real abgerufene offizielle Practice Test [developer.salesforce.com/files/ti/thi/THI-000393], die Formulierungen aus den offiziellen Exam Outlines selbst — z. B. "Given a scenario", "describe", "explain how to" — sowie die CEFR-Referenzbeschreibungen des Europarats.)*

### 4.1 Reale Beispielfrage aus dem offiziellen Practice Test (zur Strukturanalyse)

> *"A sales manager from Universal Containers wants to assign leads that come in from its website to queues. What standard process can the app builder recommend?"*
> Antwortoptionen u. a.: "Create a lead assignment rule that sort leads into queues." (richtig) / "Create a manual process..." / "Create an Apex class..." / "Create a default lead owner..." / "Create anything..."

Diese Frage zeigt die typische Zwei-Satz-Anatomie fast aller Salesforce-Szenariofragen:
1. **Satz 1 — Setup-Satz:** [Fiktive Firma, meist "Universal Containers"] + Rolle + Bedürfnis/Problem ("wants to...", "needs to...", "is concerned that...").
2. **Satz 2 — Frage-Satz:** Direkte Interrogativ-Frage nach der Lösung ("What standard process...", "Which two...", "What should the administrator recommend?").

Auffällig: Die falschen Antwortoptionen sind oft syntaktisch fast identisch zur richtigen ("Create a lead assignment rule..." vs. "Create a manual process...", "Create an Apex class...") — der Unterschied liegt ausschließlich im Fachbegriff, nicht in der Grammatik. Das bedeutet: **Nicht die Satzstruktur ist die Hürde, sondern das gezielte Wiedererkennen des korrekten Fachbegriffs.**

### 4.2 Wiederkehrende Formulierungen — Funktion und Fallen

| Formulierung | Funktion im Satz | Fallenpotenzial |
|---|---|---|
| "given a scenario" | Signalisiert: es folgt eine Situationsbeschreibung, keine reine Faktenfrage | Erwartet Anwendung, nicht nur Definition |
| "most appropriate" / "best solution" / "best practice" | Verlangt eine *Bewertung* zwischen mehreren technisch funktionierenden Optionen | Mehrere Antworten "funktionieren", nur eine ist Best Practice — Falle für technisch correct, aber nicht empfohlene Optionen |
| "which two" / "select two" / "choose all that apply" | Markiert Multiple-Select statt Single-Choice | Übersehen führt zu automatisch falscher (unvollständiger) Antwort |
| "based on the requirement" | Verweist zurück auf eine zuvor im Text genannte Einschränkung | Erfordert Rückbezug — Anforderung im ersten Satz muss gemerkt/markiert werden |
| "ensure that" | Kennzeichnet eine Zielbedingung, die die Lösung erfüllen MUSS | Lösungen, die die meisten, aber nicht alle "ensure that"-Bedingungen erfüllen, sind falsch |
| "without code" / "declaratively" / "without using Apex" | Schließt Code-Lösungen explizit aus | Technisch correct, aber code-basierte Antwortoptionen sind bewusste Distraktoren |
| "at least" / "no more than" / "up to" | Quantoren, die exakte Ober-/Untergrenzen setzen | Off-by-one-Fehler bei ungenauem Lesen |
| "given a scenario, identify/describe/determine" | Aus den offiziellen Exam Outlines selbst — zeigt kognitive Stufe der Frage | "identify" = Erkennen, "determine" = Ableiten/Entscheiden — höhere Stufe als reines Erkennen |

### 4.3 Negationen, Modalverben, Präpositionen

- **Negationen:** "should NOT", "cannot be modified", "is not recommended" — in Multiple-Choice-Antworten oft am Satzende versteckt; verlangen doppelt genaues Lesen, da eine verneinte richtige Aussage leicht als falsch markiert wird und umgekehrt.
- **Modalverben nach Stärke geordnet:** *must* (zwingend) > *should* (empfohlen/Best Practice) > *can/could* (technisch möglich, nicht zwingend). Die Prüfung nutzt diese Abstufung gezielt, um zwischen "funktioniert" und "ist die beste Lösung" zu unterscheiden.
- **Präpositionen mit Bedeutungsverschiebung:** "assigned **to** a queue" vs. "assigned **by** a rule" — falsche Präposition ändert den technischen Sachverhalt vollständig; wichtig bei Objektbeziehungen ("related **to**", "child **of**", "shared **with**").

### 4.4 CEFR-Einordnung — Klassifizierungsregel für die App

Basierend auf den offiziellen Europarat-Deskriptoren (Council of Europe, CEFR Reading Comprehension):

- **B1 ("kann Hauptpunkte verstehen bei vertrauten Themen, klare Standardsprache"):** Einsatz für Inhalte mit
  - einfachem Satzbau (ein Haupt-, maximal ein Nebensatz),
  - konkreten, direkt übersetzbaren Fachbegriffen (Lead, Account, Report, Field, User),
  - direkter Frage ohne mehrfache Bedingungen.
- **B2 ("kann Hauptaussagen komplexer Texte zu konkreten und abstrakten Themen verstehen, auch Fachdiskussionen im eigenen Gebiet"):** Einsatz für Inhalte mit
  - mehrfacher Satzverschachtelung (Bedingungssatz + Zielsatz + Einschränkung, wie im echten Practice-Test-Beispiel oben),
  - abstrakten/technischen Mehrwortbegriffen (Role Hierarchy, Sharing Rule, Cross-Object Formula, Order of Execution),
  - notwendiger Ausschlusslogik zwischen mehreren plausiblen Distraktoren.

**Faustregel für die Content-Erstellung:** Wenn eine Frage in einem Satz ohne Nebenbedingung beantwortbar ist und nur ein Fachbegriff erkannt werden muss → B1. Wenn zusätzlich eine Einschränkung ("ensure that…", "without code…", "based on the requirement…") berücksichtigt und mindestens ein naheliegender Distraktor aktiv ausgeschlossen werden muss → B2.

### 4.5 Lesestrategie (für die Lernhinweise in der App)

Dreischritt-Methode, abgeleitet aus der Satzstruktur-Analyse:

1. **Wer + was + Bedingung markieren:** Firma/Rolle identifizieren, das eigentliche Bedürfnis unterstreichen, Einschränkungen ("ensure that", "without code", "at least") separat notieren.
2. **Frageart erkennen:** Single-Choice ("What...", "Which...") vs. Multiple-Select ("Which two...", "Select all..."); Bewertungsfrage ("most appropriate", "best") vs. Faktenfrage ("describe", "what is").
3. **Antwortoptionen durch Ausschluss prüfen:** Zuerst technisch unmögliche/falsche Fachbegriffe streichen, dann unter den verbleibenden "funktionierenden" Optionen die Best-Practice-Option anhand der in Schritt 1 markierten Einschränkungen auswählen.

Diese Drei-Schritt-Logik wird in Lieferung 2 als fester Bestandteil der Erklärungstexte zu jeder Szenariofrage übernommen (Pflichtfeld "Signalwort-Analyse" pro Frage, siehe Kapitel 8).

---

## 5. Seriöse Übungsfragen-Quellen & rechtliche Einordnung

*(Übernommen und weiterhin gültig aus dem bestehenden Bericht "Seriöse Übungsfragen-Quellen"; hier zusammengefasst, Details dort nachlesbar.)*

- **Höchste Verlässlichkeit:** Offizieller Exam Guide + offizieller Administrator Practice Test (developer.salesforce.com) + Trailhead-Trailmixes/Module/Superbadges.
- **Seriöse Drittanbieter (nur als persönliche Lern-/Benchmark-Quelle, NICHT zum Kopieren):** Focus on Force/K2 University, Mike Wheelers Udemy-Kurse ("Salesforce Platform Administrator Practice Tests – 6 Pack!"), Buch "Salesforce Certified Platform Administrator Study Guide" (O'Reilly, Wheeler, 2025).
- **Rechtlich strikt zu meiden:** Alle Exam-Dump-Seiten (ExamTopics, dumpsgate, edurely, passitexams-Dumps u. Ä.) — Verstoß gegen das Salesforce Certification Program Agreement, Risiko von Zertifikatsentzug.
- **Zulässiger Weg für die eigene App:** Ausschließlich eigenständig formulierte, an den öffentlichen Exam Objectives orientierte Szenariofragen — mit Pflichtkennzeichnung *"Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage."*

---

## 6. Priorisierte Content-Roadmap nach offizieller Gewichtung

### 6.1 Verteilungslogik

Die Anzahl neuer Begriffe, Wiederholungen und Übungsfragen pro Domain soll proportional zur offiziellen Prozentgewichtung sein. Formel: `Anteil_Domain = Gewichtung_% / 100 × Gesamtzahl_Content`.

### 6.2 Administrator — Content-Anteile bei Zielgröße 90 Vokabeln / 60 Übungsfragen (Beispielrechnung für Lieferung 2)

| Domain | Gewichtung | Ziel-Vokabelanteil (von 90) | Ziel-Fragenanteil (von 60) |
|---|---|---|---|
| Data and Analytics Management | 17 % | 15 | 10 |
| Configuration and Setup | 15 % | 14 | 9 |
| Object Manager and Lightning App Builder | 15 % | 14 | 9 |
| Automation | 15 % | 14 | 9 |
| Sales and Marketing Applications | 10 % | 9 | 6 |
| Service and Support Applications | 10 % | 9 | 6 |
| Productivity and Collaboration | 10 % | 9 | 6 |
| Agentforce | 8 % | 7 | 5 |
| **Summe** | **100 %** | **~90** (Rundungsdifferenz) | **60** |

### 6.3 Foundations — Content-Anteile bei Zielgröße 40 Vokabeln / 30 Übungsfragen

| Domain | Gewichtung | Ziel-Vokabelanteil (von 40) | Ziel-Fragenanteil (von 30) |
|---|---|---|---|
| Salesforce Ecosystem | 32 % | 13 | 10 |
| Navigation | 28 % | 11 | 8 |
| Data Model | 25 % | 10 | 8 |
| Reports & Dashboards | 15 % | 6 | 4 |

### 6.4 Lernhebel-Priorisierung (unverändert aus Vorrecherche bestätigt)

- **Foundations:** Ecosystem (32 %) + Navigation (28 %) = 60 % — gut konzeptionell/auswendig lernbar, hoher Return on Invest für schnelle erste Zertifizierung.
- **Administrator:** Data & Analytics (17 %) + Automation (15 %) + Configuration (15 %) + Object Manager (15 %) = 62 % — erfordert echte Hands-on-Übung im Playground, nicht nur Vokabellernen.
- **Agentforce (8 %):** klein, aber nicht ignorierbar — ca. 5 von 60 gewerteten Fragen; laut offiziellem Exam Guide nur zwei Teilaspekte (Anwendungsfälle/Sicherheit + Agent-Builder-Pflege), daher gut eingrenzbar.

---

## 7. Vokabular- und Themeninventar

**Hinweis zur CEFR-Zuordnung:** B1 = einfacher, direkt übersetzbarer Einzelbegriff; B2 = zusammengesetzter/abstrakter Fachbegriff oder Prozessbegriff (siehe Klassifizierungsregel Kapitel 4.4). Diese Tags sind Arbeitsvorschläge für Lieferung 2 und sollten bei der Frageerstellung im Einzelfall validiert werden.

### 7.1 Administrator-Domänen

**Configuration and Setup (15 %)**
| Begriff | CEFR |
|---|---|
| Company Settings | B1 |
| Fiscal Year | B1 |
| Business Hours | B1 |
| Currency Management | B2 |
| App Menu | B1 |
| List View | B1 |
| Global Action | B2 |
| Lightning App Builder | B2 |
| User License | B1 |
| Feature License | B2 |
| Login Hours | B1 |
| Session Settings | B2 |
| Setup Audit Trail | B2 |
| Identity Verification | B2 |
| Sharing Rule | B2 |
| Public Group | B1 |
| Org-Wide Default (OWD) | B2 |
| Role Hierarchy | B2 |
| Profile | B1 |
| Permission Set | B1 |
| Permission Set Group | B2 |
| Muting Permission Set | B2 |

**Object Manager and Lightning App Builder (15 %)**
| Begriff | CEFR |
|---|---|
| Object | B1 |
| Field | B1 |
| Record | B1 |
| Record Type | B2 |
| Page Layout | B1 |
| Lookup Relationship | B2 |
| Master-Detail Relationship | B2 |
| Junction Object | B2 |
| Schema Builder | B2 |
| Roll-Up Summary Field | B2 |
| Cross-Object Formula | B2 |
| Picklist Dependency | B2 |
| Quick Action | B1 |

**Sales and Marketing Applications (10 %)**
| Begriff | CEFR |
|---|---|
| Lead | B1 |
| Opportunity | B1 |
| Sales Path | B2 |
| Lead Scoring | B2 |
| Opportunity Scoring | B2 |
| Forecasting | B2 |
| Territory Management | B2 |
| Lead Convert | B1 |
| Lead Assignment Rule | B2 |
| Campaign | B1 |
| Campaign Member | B1 |

**Service and Support Applications (10 %)**
| Begriff | CEFR |
|---|---|
| Case | B1 |
| Case Assignment Rule | B2 |
| Queue | B1 |
| Support Process | B2 |
| Auto-Response Rule | B2 |
| Case Escalation Rule | B2 |

**Productivity and Collaboration (10 %)**
| Begriff | CEFR |
|---|---|
| Task | B1 |
| Event | B1 |
| Chatter Group | B1 |
| AppExchange | B1 |
| Managed Package | B2 |
| Unmanaged Package | B2 |
| Salesforce Mobile App | B1 |

**Data and Analytics Management (17 %, größte Domäne)**
| Begriff | CEFR |
|---|---|
| Data Loader | B1 |
| Import Wizard | B1 |
| Data Export | B1 |
| Data Archival | B2 |
| Duplicate Rule | B2 |
| Matching Rule | B2 |
| Validation Rule | B2 |
| Report Type | B1 |
| Bucket Field | B2 |
| Joined Report | B2 |
| Dashboard Component | B1 |
| Dynamic Dashboard | B2 |
| Report Folder | B1 |
| Filter Logic | B2 |
| Chart Settings | B1 |

**Automation (15 %)**
| Begriff | CEFR |
|---|---|
| Flow | B1 |
| Screen Flow | B2 |
| Record-Triggered Flow | B2 |
| Autolaunched Flow | B2 |
| Order of Execution | B2 |
| Approval Process | B2 |
| Escalation Rule | B2 |
| Assignment Rule | B1 |
| Default Automation User | B2 |
| Workflow Rule (Legacy) | B1 |
| Process Builder (Legacy) | B1 |

**Agentforce (8 %)**
| Begriff | CEFR |
|---|---|
| Agentforce | B1 |
| Agent Builder | B2 |
| Prompt | B1 |
| Conversation Preview | B2 |
| Agent Permission | B2 |

*(Insgesamt ~90 Begriffe für die Administrator-Zertifizierung; deckt alle acht Domänen proportional zur Gewichtung ab und übertrifft die MVP-Mindestanforderung von 40 Begriffen.)*

### 7.2 Foundations-Domänen (Ergänzung)

**Salesforce Ecosystem (32 %):** Customer 360, CRM, Cloud Computing, Trailhead, Trailblazer Community, Multi-Tenancy, Sales Cloud, Service Cloud, Career Path, Salesforce Certification.

**Navigation (28 %):** App Launcher, Navigation Bar, Setup, List View, Global Search, Personal Settings, Kanban View, Lightning App Builder (Basiskonzept).

**Data Model (25 %):** Account, Contact, Lead, Opportunity, Case, Data Visibility, Data Integrity, Standard Object, Custom Object.

**Reports & Dashboards (15 %):** Report, Dashboard, Report Format, Dashboard Widget.

---

## 8. Content-Spezifikation für B1/B2-Reading-Passagen

Anatomie (abgeleitet aus dem echten offiziellen Practice Test, siehe Kapitel 4.1), verbindlich für jede Frage in Lieferung 2/3:

1. **Setup-Satz:** Fiktive Firma (z. B. "Universal Containers" oder frei erfunden) + Rolle + Bedürfnis/Problem.
2. **Anforderungs-/Einschränkungssatz** (optional, oft für B2-Fragen): "ensure that…", "without code…", "based on the requirement…".
3. **Frage:** Single-Choice ("What...", "Which...") oder Multiple-Select ("Which two...").
4. **3–5 Antwortoptionen**, davon mindestens ein technisch plausibler, aber nicht Best-Practice-Distraktor.
5. **Pro Antwortoption:** kurze Begründung richtig/falsch (wie im offiziellen Test).
6. **Pflichtfelder pro Frage:** Zertifizierung, Exam-Domain, Gewichtungsbereich, CEFR-Level, Schwierigkeitsgrad, Signalwort-Analyse (welche der in Kapitel 4.2–4.3 genannten Marker vorkommen), deutsche fachliche Erklärung, Kennzeichnung *"Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage."*

---

## 9. Zwölf-Wochen-Lernplan mit Wochen-Soll-Werten

Rahmen: max. 5 Std./Woche zusätzliches Sprach-/Zertifizierungstraining (separat von der praktischen Software-Bedienung in der Weiterbildung).

| Woche | Fokus | Neue Vokabeln | Wiederholungen (SM-2) | Reading-Übungen | Meilenstein |
|---|---|---|---|---|---|
| 1 | Setup: Trailhead-Account, Playground, Exam Guides lesen | 10 (Ecosystem) | – | 1 | Setup abgeschlossen |
| 2 | Foundations: Ecosystem + Navigation | 12 | 10 | 2 | — |
| 3 | Foundations: Data Model | 10 | 15 | 3 | — |
| 4 | Foundations: Reports & Dashboards + Wiederholung | 6 | 20 | 3 | **Monat 1: ≥80 % in Foundations-Übungsfragen** |
| 5 | Foundations-Prüfung buchen & ablegen; Puffer | – | 15 | 2 | **Foundations-Prüfung abgelegt** |
| 6 | Administrator: Configuration and Setup | 14 | 15 | 3 | — |
| 7 | Administrator: Object Manager and Lightning App Builder | 14 | 20 | 3 | — |
| 8 | Administrator: Data and Analytics Management (größte Domain) | 15 | 20 | 4 | **Monat 2: ≥65 % in Admin-Übungsprüfungen (Schwellenwert)** |
| 9 | Administrator: Automation (Flow-Schwerpunkt, hands-on) | 14 | 20 | 4 | — |
| 10 | Administrator: Sales/Service/Productivity (10+10+10 %) | 27 | 20 | 4 | — |
| 11 | Administrator: Agentforce + gezielte Fehlerwiederholung | 7 | 25 | 3 | **Monat 3: ≥75 % in vollständigen Mini-Prüfungen** |
| 12 | Volle Prüfungssimulationen, Schwachpunkt-Fokus, Buchung | – | 25 | 3 | **Administrator-Prüfung ablegen** |

**Monatsmeilensteine (aus Projektanweisung übernommen und mit Wochenplan verknüpft):**
- **Monat 1 (Wochen 1–4):** Salesforce-Grundlagen, B1-Vokabular, erste Szenariofragen — Ziel Foundations-Reife.
- **Monat 2 (Wochen 5–8):** Administrator-Schwerpunkte, B2-Leseverständnis, erste Mini-Prüfungen.
- **Monat 3 (Wochen 9–12):** Gezielte Wiederholung, Fehlerfokus, Prüfungssimulationen, Praxistraining.

**Schwellenwerte, die den Plan ändern (aus Vorrecherche übernommen):** Werden bis Woche 8 keine ≥65 % in Admin-Übungsprüfungen erreicht, sollte die Administrator-Prüfung auf Monat 4 verschoben werden, statt einen kostenpflichtigen Fehlversuch (200 USD) zu riskieren.

---

## 10. Abgrenzung: Fakten / Annahmen / Empfehlungen

**Bestätigte Fakten (offiziell, live verifiziert 15.08.2026):**
- Alle Zahlen in Kapitel 3.1 (Fragenzahl, Zeit, Bestehensgrenze, Kosten, Voraussetzungen, Exam-Version).
- Alle Exam Objectives in Kapitel 3.2/3.3 (wortgetreu von help.salesforce.com).
- Format des offiziellen Practice Tests (Kapitel 4.1, live abgerufen).
- CEFR-Deskriptoren für B1/B2 Reading (Council of Europe, Kapitel 4.4).

**Eigene Einschätzungen/Ableitungen (kein offizieller Fakt):**
- Die Machbarkeit "beide Zertifizierungen in 3 Monaten bei 5 Std./Woche" (siehe Vorrecherche, dort ausführlich mit Bandbreiten von Sekundärquellen belegt — bleibt eine Einschätzung, keine Garantie).
- Die CEFR-Zuordnung der einzelnen Vokabeln in Kapitel 7 (eigene Klassifizierung nach der in 4.4 hergeleiteten Regel, nicht amtlich).
- Die konkreten Wochen-Soll-Werte in Kapitel 9 (eigene Verteilung basierend auf offizieller Gewichtung, keine Salesforce-Vorgabe).
- Buchungs-Benchmarks (≥80 % Foundations, ≥65–75 % Admin) — aus Sekundärquellen-Bandbreiten abgeleitete Empfehlung.

**Empfehlungen (Handlungsvorschläge, keine Fakten):**
- Reihenfolge Foundations vor Administrator.
- Content-Verteilung proportional zur Prüfungsgewichtung (Kapitel 6).
- Drei-Schritt-Lesestrategie (Kapitel 4.5) als festen Bestandteil der Lernhinweise.

---

## 11. Offene Punkte vor Lieferung 2

1. **Bestätigung durch Marc:** Passt die Zielgröße 90 Administrator-Vokabeln / 60 Fragen (Kapitel 6.2), oder soll die MVP-Mindestanforderung (40 Vokabeln / 30 Fragen laut Projektanweisung) als harte Obergrenze für den ersten Prototyp gelten und der Rest erst iterativ ergänzt werden?
2. Regelmäßige Neuprüfung nötig: Exam-Version ist "Summer '25" (Administrator) bzw. "Winter '25" (Foundations) — bei einem neuen Salesforce-Release-Zyklus vor Prüfungsbuchung erneut gegen help.salesforce.com prüfen.
3. Sprachverfügbarkeit der Prüfungen auf Deutsch weiterhin nicht abschließend verifiziert — vor Buchung auf trailhead.salesforce.com/credentials prüfen (unverändert aus Vorrecherche).

**Nächster konkreter Schritt:** Nach Freigabe dieses Dokuments folgt Lieferung 2 (User Stories, Informationsarchitektur, Dateistruktur, JSON-Datenmodell mit Beispieldatensätzen, SM-2-Logik-Beschreibung) — weiterhin ohne Code.
