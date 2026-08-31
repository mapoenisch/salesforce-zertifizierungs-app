# Salesforce CRM & Zwei Zertifizierungen: Recherche & Lernplan für Marc (Stand: August 2026)

## TL;DR
- **Reihenfolge & Machbarkeit:** Marc sollte zuerst die **Salesforce Certified Platform Foundations** (PLAT-101, früher "Salesforce Certified Associate", 40 Fragen, 70 Min., 62 % Bestehensgrenze, 75 USD, Retake kostenlos) und danach die deutlich anspruchsvollere **Salesforce Certified Platform Administrator** (60 Fragen, 105 Min., 68 % englische Version, 200 USD) ablegen. Die Foundations ist keine formale Voraussetzung, aber die logische Rampe.
- **3 Monate / 5 Std. pro Woche = ~60 Std. Zusatzaufwand** – das reicht bei einem absoluten Einsteiger realistisch für die Foundations, ist für die Admin-Prüfung aber knapp; Salesforce empfiehlt für Admin mindestens 6 Monate praktische Administrationserfahrung. Da Marc parallel in seiner Weiterbildung die Software-Bedienung praktisch lernt, ist BEIDES machbar, aber ambitioniert (eigene Einschätzung, kein Fakt).
- **Kostenlos & offiziell üben:** Trailhead-Account + Trailhead Playground bzw. Developer Edition Org (developer.salesforce.com/signup) – beides gratis. Exam Dumps (ExamTopics etc.) sind zu meiden (Verstoß gegen den Salesforce Certification Program Agreement, Prüfungsstoff veraltet/falsch).

## Key Findings

**1. Beide Prüfungen sind aktuell umbenannt worden.** Das frühere "Salesforce Certified Associate" heißt seit 2025 offiziell "Salesforce Certified Platform Foundations" (PLAT-101). Das frühere "Salesforce Certified Administrator" (ADM-201) heißt seit Dezember 2025 "Salesforce Certified Platform Administrator". Bereits erworbene Zertifikate bleiben gültig; die Umbenennung ist inhaltlich weitgehend kosmetisch, aber die Admin-Prüfung wurde am 15. Dezember 2025 inhaltlich überarbeitet.

**2. Die Admin-Prüfung hat seit Dez. 2025 eine neue Struktur** mit einem neuen 8 %-Themenbereich "Agentforce" (KI) und stärkerer Gewichtung von "Data and Analytics Management" (17 %, zuvor 14 %; Salesforce Ben, "Salesforce Platform Admin Exam Updated for 2026": "Data & Analytics Management taking up the largest part of the exam at 17% – up from 14%"). Prozess-Builder und Workflow-Rules sind zugunsten von Flow abgekündigt – der Support endete zum 31. Dezember 2025 (Migration über das offizielle "Migrate to Flow"-Tool).

**3. Offizielle Zahlen (verifiziert über help.salesforce.com):**
- Foundations: 40 Fragen + bis zu 5 ungewertete, 70 Min., **62 %**, 75 USD, Retake kostenlos, keine Voraussetzung, Version Winter '25.
- Administrator: 60 Fragen + bis zu 5 ungewertete, 105 Min., **68 % (englische Version; japanische Version 65 %)**, 200 USD (Retake 100 USD), keine formale Voraussetzung, aber ≥ 6 Monate Praxis empfohlen, Version Summer '25.

**4. Der Lernhebel liegt bei Foundations auf "Salesforce Ecosystem" (32 %) und "Navigation" (28 %)** – zusammen 60 % und gut auswendig-/konzeptlernbar. Bei Admin liegen die schwersten Brocken auf Data & Analytics (17 %), Configuration/Setup (15 %), Object Manager (15 %) und Automation/Flow (15 %) – diese erfordern echte Hands-on-Übung.

## Details

### A) Salesforce CRM & Customer 360 – Grundlagen

**Zweck & Funktionsweise.** Salesforce ist eine cloudbasierte CRM-Plattform (Customer-Relationship-Management). Kerngedanke von **Customer 360** ist, alle kundenbezogenen Daten aus Vertrieb, Service, Marketing, Commerce und IT in einer einheitlichen Sicht zu verbinden, sodass jede Abteilung dieselbe 360-Grad-Kundensicht hat. Laut Salesforce selbst: "Customer 360 goes beyond just sales, service and marketing. It includes the full range of Salesforce technology – uniting commerce, IT, and analytics – in one connected system." (salesforce.com/ap/blog, offiziell, abgerufen 14.08.2026). Typische Einsatzszenarien: Kunden-Onboarding, Lead-Management, personalisierter Service, Kampagnensteuerung, Umsatzprognosen.

**Bedienkonzept / Lightning Experience.** Die moderne Oberfläche heißt **Lightning Experience**. Zentrale Navigationselemente (offiziell laut Trailhead, abgerufen 14.08.2026):
- **App Launcher** (9-Punkte-Symbol): Wechsel zwischen Apps (Sales, Service, Custom Apps, Connected Apps) und Suche nach Objekten/Items.
- **Navigation Bar** (obere Leiste): App-Name plus zugehörige Tabs (Objekte wie Accounts, Contacts, Opportunities); anpassbar per Stiftsymbol.
- **Global Actions / Suche / Setup-Zahnrad** (Konfigurationsbereich).
- **Console Apps** (z. B. Sales Console, Service Console): Split-View mit Listenansicht plus geöffneten Datensätzen in Sub-Tabs – ideal für schnelles Fallmanagement.

**Zentrale Standardobjekte & Datenmodell** (belegt über EBQ, Aptitude8, Salesforce-Dev-Blog, abgerufen 14.08.2026):
- **Lead:** Noch nicht qualifizierter Interessent; existiert unabhängig von Accounts/Contacts. Wird per "Convert" in Account + Contact (+ optional Opportunity) umgewandelt.
- **Account:** Firma/Organisation (bzw. Person Account), das zentrale Objekt ("top of the food chain"); Elternsatz für Contacts und Opportunities.
- **Contact:** Einzelperson, immer einem Account zugeordnet.
- **Opportunity:** Konkreter Verkaufsdeal mit Phasen (Stages); verknüpft mit Account und Contact.
- **Case:** Serviceanfrage/Problem eines Kunden.
- **Campaign:** Marketing-Initiative zur Lead-/Opportunity-Generierung, inkl. ROI-Tracking.
- **Activities:** Tasks (Aufgaben) und Events (Termine), die an Datensätzen hängen.
- **Reports & Dashboards:** Auswertungen und deren grafische Verdichtung.

**Beziehungstypen:** Lookup (lose Verknüpfung, Kind existiert unabhängig), Master-Detail (starke Verknüpfung, Kind erbt Sicherheit, Löschung kaskadiert), Many-to-Many über Junction-Objekte (zwei Master-Detail-Beziehungen).

**Grundbegriffe** (Admin-/Foundations-Niveau):
- **Org:** eine Salesforce-Instanz (multi-tenant).
- **App:** Sammlung von Tabs/Objekten für einen Anwendungsfall.
- **Object / Record / Field:** Tabelle / Zeile / Spalte.
- **Profile:** Basis-Berechtigungen (CRUD, Feldzugriff); ein User hat genau ein Profil.
- **Permission Set:** Zusatzberechtigungen oben drauf; mehrere pro User möglich (Salesforce-Empfehlung: Permission Sets statt breiter Profile).
- **Role / Role Hierarchy:** steuert Datensatz-Sichtbarkeit (record-level), nicht Funktionsrechte; bildet Datenzugriffshierarchie ab.
- **Flow:** Salesforces primäres Automatisierungswerkzeug (Screen Flows, Record-Triggered Flows, Autolaunched Flows).
- **Validation Rule:** Client-seitige Regel, die Daten vor dem Speichern prüft.
- **Page Layout:** Anordnung von Feldern/Buttons auf einem Datensatz.
- **Record Type:** Ermöglicht verschiedene Geschäftsprozesse/Layouts/Picklisten pro Objekt; **kein** Sicherheitsinstrument.
- **Sharing Rules:** Erweitern den Datensatzzugriff über die OWD-Basis hinaus.

**Sicherheitskonzept (4 Schichten – prüfungsrelevant):**
1. **Organisationsebene** (Login-Hours, IP-Ranges, MFA – seit 2026 verpflichtend).
2. **Objektebene** (CRUD über Profile/Permission Sets).
3. **Feldebene** (Field-Level Security – verbirgt sensible Felder unabhängig vom Page Layout).
4. **Datensatzebene**: **Org-Wide Defaults (OWD)** setzen die restriktivste Basis ("lock down first"), dann öffnen **Role Hierarchy** (nach oben), **Sharing Rules** (seitlich/nach unten), **Manual Sharing**, **Teams** und **Apex Managed Sharing** den Zugriff selektiv. Kernprinzip (Salesforce-Dev-Blog, offiziell): Sharing kann Zugriff nur *erweitern*, nie über die OWD hinaus einschränken.

**Anwender- vs. Administratorperspektive:** Anwender arbeiten mit Datensätzen (Leads pflegen, Opportunities schließen, Cases lösen, Reports laufen lassen) und personalisieren nur ihre eigene Umgebung (Tabs, Locale, Passwort). Admins konfigurieren im **Setup** (Object Manager, Flows, Security, User Management, Reports-Infrastruktur).

**Typische Geschäftsprozesse:**
- **Sales Cloud:** Lead → Konvertierung → Opportunity-Pipeline → Forecasting, Products/Price Books, Quotes.
- **Service Cloud:** Case-Management, Queues, Assignment/Escalation Rules, Web-to-Case, Email-to-Case, Service Console.
- **Marketing:** Campaigns, Web-to-Lead, Lead Assignment.
- **Collaboration (Chatter):** Gruppen, Posts, Dateien, Following.
- **Reporting:** Report-Formate (Tabular, Summary, Matrix, Joined), Dashboards, Subscriptions.

### B) Kostenlose Hands-on-Übungsumgebung (offiziell, Schritt für Schritt)

Es gibt zwei legale, kostenlose Optionen (Quelle: help.salesforce.com "How to Sign Up for Trailhead with a Developer Edition" + Trailhead-Modul "Set Up Your Training Playground", offiziell, abgerufen 14.08.2026):

**Option 1 – Trailhead Playground (empfohlen für Einsteiger):**
1. Kostenlosen Trailhead-Account auf trailhead.salesforce.com anlegen (per E-Mail, Google oder LinkedIn).
2. In einem beliebigen Hands-on-Challenge-Abschnitt unten auf den Pfeil neben "Launch" klicken → "Create a Trailhead Playground".
3. Erstellung dauert ca. 3–4 Minuten. Man kann bis zu 10 Playgrounds anlegen.
- Playgrounds sind vorbefüllt mit Beispieldaten und den für Challenges nötigen (unmanaged) Packages. Sie sind "sicher, wegwerfbar" – Fehler sind egal.

**Option 2 – Developer Edition Org (dauerhaft, voll funktionsfähig):**
1. developer.salesforce.com/signup aufrufen, Formular ausfüllen.
2. Als **Username** eine E-Mail-*ähnliche*, eindeutige Zeichenfolge wählen, die keine echte, bereits genutzte Login-Adresse ist (z. B. name@meinuebung.com).
3. Aktivierungs-E-Mail bestätigen ("Verify Account"), Passwort setzen.
- Läuft nicht ab, solange man sich mindestens alle 6 Monate einmal einloggt.

**Wichtig:** URL, Username und Passwort sichern, sonst Zugriffsverlust.

### C) Salesforce Certified Platform Foundations (aktueller Stand)

**Zielgruppe / Voraussetzung:** Absolute Einsteiger mit 0–6 Monaten Salesforce-Erfahrung, Studierende, Quereinsteiger. Keine formale Voraussetzung, keine technische Vorerfahrung nötig (Salesforce Ben, seriöse Sekundärquelle; help.salesforce.com, offiziell). Christine Marshall (12x zertifizierte Salesforce-MVP) warnt jedoch: "do not mistakenly believe that this is an easy exam ... the questions and possible answers are tricky and worded in a way to deliberately confuse you" (Salesforce Ben, seriöse Sekundärquelle, aktualisiert 29.07.2025).

**Prüfungsformat (offiziell verifiziert, help.salesforce.com Exam Guide, abgerufen 14.08.2026):**
- 40 Multiple-Choice/Multiple-Select-Fragen + bis zu 5 ungewertete.
- 70 Minuten.
- Bestehensgrenze: 62 %.
- Kosten: 75 USD; Retake kostenlos.
- Online-Proctored ODER Testcenter.
- Keine Voraussetzung; Version richtet sich nach Winter '25.
- Besonderheit (Salesforce Ben, Sekundärquelle): nur **drei** Antwortoptionen pro Frage (statt üblich vier) – tendenziell leichter.

**Exam Outline mit Gewichtung (offiziell verifiziert):**
1. **Salesforce Ecosystem – 32 %** (CRM-Grundlagen, Customer 360, Produkt-Suite/Clouds, Trailhead, Trailblazer Community, Multi-Tenancy, Karrierewege).
2. **Navigation – 28 %** (Setup, Lizenzen/Org-Infos, List Views/Kanban, Suche, Personalisierung, AppExchange, Lightning App Builder).
3. **Data Model – 25 %** (Standardobjekte & Beziehungen, Roles/Profiles/Permission Sets, Record Types, Page Layouts, Feldsichtbarkeit, Validation Rules).
4. **Reports & Dashboards – 15 %** (Report-Formate, Custom Report Types, Bucket Fields, Conditional Formatting, Subscriptions, Dashboard-Komponenten/Filter).

**Offizielle Lernressourcen:**
- Trailhead-Trail "Prepare for your Salesforce Platform Foundations Certification" (trailhead.salesforce.com).
- Cert-Prep-Modul mit ~25 Min. Übungsfragen/Flashcards.
- Neues Modul "Agentforce Key Components: Quick Look" wurde ergänzt.

**Praktisch üben vs. konzeptionell lernen:** Ecosystem (32 %) und Teile von Navigation sind gut konzeptionell/auswendig lernbar. Data Model und Reports & Dashboards (zusammen 40 %) profitieren stark von Hands-on-Übung im Playground.

### D) Salesforce Certified Platform Administrator (aktueller Stand)

**Zielgruppe / Voraussetzung:** Personen mit Salesforce-Admin-Erfahrung; "accidental admins". Salesforce empfiehlt (keine formale Voraussetzung) mindestens 6 Monate praktische Administrationserfahrung – Salesforce Ben, "Salesforce Certified Platform Administrator Guide & Tips": "6+ months of platform administration experience is required". Die Admin-Zertifizierung gilt als Basis-Credential nahezu jeder Salesforce-Rolle und ist Voraussetzung für viele weiterführende Zertifizierungen; ihr wirtschaftlicher Wert ist belegbar: zertifizierte US-Admins verdienen laut Salesforce Ben Salary Survey 2025-26 einen Median von ca. 92.000 USD, und Salesforce selbst nennt für die Admin-Rolle ein "148% job growth ... in the past 5 years (US data)".

**Prüfungsformat (offiziell verifiziert, help.salesforce.com Exam Guide, abgerufen 14.08.2026):**
- 60 Multiple-Choice/Multiple-Select-Fragen + bis zu 5 ungewertete.
- 105 Minuten.
- Bestehensgrenze: **68 % (englische Version)**; die japanische Version liegt bei 65 % – daher die widersprüchlichen Angaben in Sekundärquellen.
- Kosten: 200 USD; Retake 100 USD.
- Online-Proctored ODER Testcenter.
- Version richtet sich nach Summer '25.

**Exam Outline mit Gewichtung (offiziell verifiziert, gültig seit 15.12.2025; refreshed Blueprint bestätigt im offiziellen Salesforce-Admins-Blog, 22.01.2026):**
1. **Configuration and Setup – 15 %** (Security-Grundlagen, Profile/Permission Sets, Rollen, Sharing, FLS, Org-Infos, Audit Trail).
2. **Object Manager and Lightning App Builder – 15 %** (Standard-/Custom-Objekte, Beziehungen, Felder, Page Layouts, Record Types, Lightning-Seiten).
3. **Sales and Marketing Applications – 10 %** (Opportunities, Forecasting, Leads/Konvertierung, Campaigns, Einstein Scoring).
4. **Service and Support Applications – 10 %** (Cases, Queues, Assignment/Escalation Rules, Web-/Email-to-Case, Service Console).
5. **Productivity and Collaboration – 10 %** (Activities, Chatter, Mobile App, AppExchange/AgentExchange).
6. **Data and Analytics Management – 17 %** (größter Block: Import/Export/Data Loader, Validation/Duplicate Rules, Report-Formate, Dashboards).
7. **Automation – 15 %** (Flow Builder in allen Varianten, Approval Processes, Order of Execution – Process Builder/Workflow Rules abgekündigt).
8. **Agentforce – 8 %** (neuer KI-Block: Agentforce-Fähigkeiten, Einsatzszenarien, Sicherheits-/Berechtigungs-Troubleshooting, Prompts in Agent Builder). Entspricht etwa 5 von 60 gewerteten Fragen.

**Offizielle Lernressourcen:**
- Trailmix "Prepare for your Salesforce Platform Administrator Certification" (trailhead.salesforce.com).
- Admin Beginner Trail + Admin Intermediate Trail.
- Cert-Prep-Module (Setup and Objects; Applications and Activities; Data and Automation).
- Offizieller Administrator Practice Test (developer.salesforce.com, 30 Fragen).

**Unterschied zu Foundations:** Deutlich größere thematische Breite (8 statt 4 Domänen), höhere Bestehensgrenze (68 % vs. 62 %), mehr Fragen (60 vs. 40), vier Antwortoptionen statt drei, und – entscheidend – der Fokus liegt auf *Konfiguration/Umsetzung* ("wie"), nicht nur auf *Verständnis* ("warum"). Erfordert echte Hands-on-Praxis, besonders bei Flow, Security und Data Management.

### E) Prüfungsstrategie & Entscheidungshilfe

**Vergleichstabelle:**

| Kriterium | Platform Foundations | Platform Administrator |
|---|---|---|
| Früherer Name | Salesforce Certified Associate | Salesforce Certified Administrator (ADM-201) |
| Zielgruppe | Absolute Einsteiger (0–6 Mon.) | (Angehende) Admins, empf. ≥ 6 Mon. Praxis |
| Fragen | 40 (+ bis 5 ungewertet) | 60 (+ bis 5 ungewertet) |
| Antwortoptionen | 3 | 4 |
| Zeit | 70 Min. | 105 Min. |
| Bestehensgrenze | 62 % | 68 % (EN) / 65 % (JP) |
| Kosten | 75 USD (Retake gratis) | 200 USD (Retake 100 USD) |
| Domänen | 4 | 8 |
| Schwerpunkt | Verständnis/Konzept ("warum") | Konfiguration/Praxis ("wie") |
| Schwierigkeit | Einsteiger (aber nicht trivial) | Anspruchsvoll (Breite + Tiefe) |
| Empf. Reihenfolge | **1. zuerst** | **2. danach** |

**Empfehlung zur Reihenfolge:** Foundations zuerst. Begründung: Sie ist günstig, hat kostenlosen Retake, baut Vokabular und Ökosystemwissen auf und deckt sich thematisch mit den einfacheren Teilen der Admin-Prüfung (Data Model, Reports & Dashboards, Security-Basics). Christine Marshall (Salesforce Ben, seriöse Sekundärquelle) nennt Foundations explizit "the ideal precursor to the Salesforce Platform Administrator certification". Ein früher Erfolg schafft zudem Motivation.

**Aktuelle Versionsänderungen:**
- "Associate" → "Platform Foundations": Umbenennung 2025; die Prüfungsbuchung wurde am 13. Juli 2025 von WebAssessor auf Trailhead umgestellt (letzter WebAssessor-Registrierungstag 30. Juni 2025) (Steadman Brown, Sekundärquelle).
- "Administrator" → "Platform Administrator": Umbenennung im Rahmen der Zertifizierungs-Umstellung; inhaltliches Update am 15.12.2025 (neuer Agentforce-Block 8 %, Data & Analytics auf 17 % hoch von 14 %, Flow-only) (Salesforce Ben + admin.salesforce.com, offiziell).
- Breiterer Kontext: Salesforce benennt zum 24. Juli 2026 16 Zertifizierungen um (meist mit "Agentforce" im Namen; offizieller Salesforce-Blog "The Salesforce Certification Lifecycle": "we're updating the names of 16 certifications, effective July 24, 2026") und zieht zum 1. Februar 2027 24 Zertifizierungen zurück (Salesforce Ben: letzter Registrierungstag 24. Juli 2026, letzter Prüfungstag 31. August 2026). Platform Foundations und Platform Administrator sind NICHT davon betroffen und bleiben stabile Einstiegs-Credentials.

**Typische Stolperfallen (klar als Erfahrungsberichte gekennzeichnet):**
- **Erfahrungsbericht (Salesforce Ben/Marshall):** Antwortmuster – oft eine richtige, eine klar falsche und eine "scheinbar richtige, aber nicht Best Practice" Option. Immer nach dem Standard-Feature / Best Practice entscheiden.
- **Erfahrungsbericht:** Fragen sind stark szenario- und wortlastig ("wordy"); mehrfach lesen, Schlüsselhinweise im Text suchen; "Mark for Review" nutzen.
- **Erfahrungsbericht (Reddit, r/salesforce via Salesforce Ben):** Ein Nutzer kommentierte "Genuinely surprised it's only 8% Agentforce weighing" – der KI-Block ist klein (~5 Fragen), kann aber über Bestehen entscheiden; nicht überinvestieren, aber nicht ignorieren.
- **Erfahrungsbericht (BridgeGPT-Blog, Sekundärquelle):** Trailhead-Module sind teils "hand-holdy" – reines Klicken erzeugt Badges ohne echtes Architekturverständnis; deshalb im Playground frei experimentieren.

**Themen mit hohem Lernhebel:**
- Foundations: "Salesforce Ecosystem" (32 %) + "Navigation" (28 %) = 60 % des Examens, gut konzeptionell lernbar.
- Admin: "Data and Analytics Management" (17 %) + "Automation/Flow" (15 %) sind gewichtig; Flow ist lernbar, aber übungsintensiv – hoher ROI bei gezieltem Hands-on.

**Machbarkeit in 3 Monaten bei 5 Std./Woche (klar gekennzeichnete Einschätzung, kein Fakt):**
- 3 Monate × ~5 Std. ≈ 60 Std. Zusatzaufwand, PLUS die praktische Software-Bedienung aus Marcs regulärer Weiterbildung.
- Konkrete Sekundärquellen-Benchmarks: Clientell/getclientell (2026) beziffert den durchschnittlichen erfolgreichen Admin-Kandidaten auf "68+ hours over 4-6 weeks preparing"; absolute Einsteiger ohne CRM-Erfahrung eher 100–200 Std. über 3–6 Monate (BridgeGPT).
- **Einschätzung:** Die Foundations ist mit ~15–25 Std. gut in 3–5 Wochen zu schaffen. Die Admin-Prüfung ist bei nur 60 Zusatzstunden für einen Einsteiger knapp – realistisch wird sie machbar, WENN (a) die Weiterbildung tatsächlich substanzielle Hands-on-Zeit in Sales/Service Cloud liefert und (b) Marc diese Praxis als Prüfungsübung nutzt. Andernfalls sollte die Admin-Prüfung ggf. 4–8 Wochen nach hinten geschoben werden.

## Recommendations

**Phase 1 (Woche 1): Setup & Orientierung.**
- Trailhead-Account anlegen, Trailhead Playground erstellen.
- Offizielle Exam Guides beider Prüfungen von help.salesforce.com herunterladen und als Master-Checkliste nutzen.
- Marcs HubSpot-Wissen aktiv als Analogie nutzen (Lead/Contact/Deal-Pipeline ↔ Lead/Contact/Opportunity).

**Phase 2 (Wochen 2–5): Foundations-Vorbereitung (~20 Std.).**
- Trailmix "Prepare for your Salesforce Platform Foundations Certification" + Cert-Prep-Modul durcharbeiten.
- Data Model und Reports & Dashboards im Playground praktisch nachbauen.
- Foundations-Prüfung am Ende von Phase 2 buchen und ablegen.
- **Benchmark:** Erst buchen, wenn in offiziellen/seriösen Übungsfragen konstant ≥ 80 % erreicht werden (Puffer über 62 %).

**Phase 3 (Wochen 6–12): Administrator-Vorbereitung (~35–40 Std.).**
- Admin Beginner + Intermediate Trail, dann Admin-Trailmix + drei Cert-Prep-Module.
- Schwerpunkt Hands-on: Flow Builder (alle Typen), Security (OWD/Roles/Sharing/FLS), Data Loader/Import Wizard, Reports/Dashboards.
- Offiziellen Administrator Practice Test + seriöse Übungsprüfungen (z. B. Salesforce Ben Free Practice Exam) nutzen.
- Agentforce-Block (8 %) über das offizielle Trailhead-Modul abdecken – nicht überinvestieren.
- **Benchmark zum Buchen:** konstant ≥ 75 % in seriösen Voll-Übungsprüfungen; besonders Data & Analytics, Automation, Object Manager sicher.

**Schwellen, die die Empfehlung ändern:**
- Erreicht Marc bis Woche 8 in Admin-Übungsprüfungen nicht ≥ 65 %, sollte die Admin-Prüfung auf Monat 4 verschoben werden, statt einen 200-USD-Fehlversuch zu riskieren.
- Liefert die reguläre Weiterbildung wenig echte Konfigurationspraxis, sollte Marc wöchentlich 1–2 Std. gezieltes Playground-Bauen einplanen.

**Was zu meiden ist:** Exam Dumps / "Braindumps" (ExamTopics, Dumps4Free, PassLeader etc.) – sie verstoßen gegen den Salesforce Certification Program Agreement, enthalten oft veraltete/falsche Antworten und gefährden die Zertifizierung. Salesforce verlangt ausdrücklich die Nutzung "Salesforce-approved study materials available on Trailhead".

## Caveats

- **Versionsstände:** Foundations = Winter '25, Administrator = Summer '25 (offizielle Exam Guides). Salesforce aktualisiert Prüfungen mehrmals jährlich – Marc sollte die Exam Guides kurz vor Buchung erneut prüfen.
- **Bestehensgrenze Admin:** Die 68 % gelten für die englische Prüfung; die japanische liegt bei 65 %. Deutschsprachige Verfügbarkeit/Score bitte im Exam Guide bzw. bei Buchung verifizieren.
- **Sprachverfügbarkeit:** Ob beide Prüfungen aktuell auf Deutsch angeboten werden, wurde hier nicht abschließend verifiziert – vor Buchung auf trailhead.salesforce.com/credentials prüfen.
- **Pass-Rates:** Clientell/getclientell (2026, Sekundärquelle): "The Salesforce Admin certification pass rate is approximately 60% on the first attempt ... community estimates from thousands of candidates consistently land between 60 and 68%." Salesforce veröffentlicht keine offiziellen Quoten.
- **Aufwandsschätzungen** (60 Std., 68+ Std., 100–200 Std. etc.) sind Einschätzungen aus Sekundärquellen bzw. eigene Ableitungen, keine offiziellen Salesforce-Angaben; individuelle Lerngeschwindigkeit variiert stark.
- **Sekundärquellen** (Salesforce Ben, Steadman Brown, getclientell, BridgeGPT) sind seriös, aber nicht offiziell; alle Kernzahlen wurden gegen help.salesforce.com gegengeprüft.