# Salesforce-Zertifizierungs-Trainer

Eine schlanke, lokale Lern-App zur Vorbereitung auf die Zertifizierungen **Salesforce Certified Platform Foundations** und **Salesforce Certified Platform Administrator** — mit Fokus auf Salesforce-Fachwissen und englisches Leseverständnis für die Prüfung.

Diese App wurde für die Mitlernenden der DBA-Weiterbildung zum Digital Sales Manager gebaut und ist für alle gedacht, die sich im Selbststudium auf eine der beiden Prüfungen vorbereiten.

---

## 1. App starten

### ⚠️ Wichtig: Sicherheitswarnung beim allerersten Start

Windows und macOS zeigen bei **jedem** heruntergeladenen Startskript eine Warnung — das ist normal, kein Fehler und keine Virenmeldung. Es bedeutet nur: "Dieses Skript stammt nicht aus dem offiziellen App Store." Diese Warnung erscheint **einmalig**, nicht bei jedem weiteren Start.

**Windows — SmartScreen-Warnung ("Der Computer wurde durch Windows geschützt"):**

1. Es erscheint ein blaues Fenster mit Titel "Windows hat den Start dieser App verhindert".
2. Klicke **links unten klein** auf den Link **"Weitere Informationen"** (nicht auf das X klicken!).
3. Es erscheint jetzt ein neuer Button **"Trotzdem ausführen"** — darauf klicken.
4. Ab jetzt startet das Skript beim nächsten Doppelklick ohne erneute Warnung.

**macOS — Gatekeeper-Warnung ("kann nicht geöffnet werden, da der Entwickler nicht verifiziert werden kann"):**

1. **Nicht** einfach doppelklicken, wenn die Warnung erscheint — dann gibt es nur "OK" ohne Startmöglichkeit.
2. Stattdessen: **Rechtsklick** (bzw. zwei Finger auf dem Trackpad) auf `start-server-mac.command` → **Öffnen** wählen.
3. Im folgenden Dialog erneut auf **Öffnen** klicken (jetzt gibt es diese Option zusätzlich zu "Abbrechen").
4. Ab jetzt funktioniert auch ein normaler Doppelklick ohne erneute Warnung.

Falls trotz dieser Schritte nichts passiert: siehe Abschnitt 11 "Häufige Fragen" weiter unten.

### Schnellstart (empfohlen)

**macOS:**

1. Rechtsklick auf `start-server-mac.command` im Finder → **Öffnen** → im Dialog erneut **Öffnen** bestätigen (siehe Warnhinweis oben — nur beim allerersten Start nötig).
2. Der Browser öffnet sich automatisch mit der App (`http://localhost:8000`, ggf. ein anderer freier Port).
3. Zum Beenden: das Terminal-Fenster schließen oder `Strg+C` drücken.

**Windows:**

1. Doppelklick auf `start-server-windows.bat` im Explorer.
2. Bei der SmartScreen-Warnung: **Weitere Informationen** → **Trotzdem ausführen** (siehe Warnhinweis oben — nur beim allerersten Start nötig).
3. Der Browser öffnet sich automatisch mit der App (`http://localhost:8000`, ggf. ein anderer freier Port).
4. Zum Beenden: das Konsolenfenster schließen oder `Strg+C` drücken.
5. Voraussetzung: Python 3 muss installiert sein (https://www.python.org/downloads/), beim Installieren die Option "Add python.exe to PATH" aktivieren.

### Warum kein einfacher Doppelklick auf `index.html`?

Die App lädt ihre Lerninhalte (`data/*.json`) und JavaScript-Module per `fetch()`. Browser blockieren das aus Sicherheitsgründen, wenn `index.html` direkt als Datei (`file://…`) geöffnet wird — die Seite bleibt dann leer oder zeigt einen Ladefehler. Über einen lokalen Webserver (`http://localhost`) funktioniert alles normal.

### Alternative: manueller Start

Falls `start-server-mac.command` bzw. `start-server-windows.bat` nicht funktioniert (z. B. kein Python installiert), im Terminal:

```bash
cd /pfad/zum/Ordner/salesforce_hubspot_zertifizierungs_app
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen. Wer lieber Node.js nutzt, kann alternativ `npx serve` im selben Ordner ausführen.

### Systemvoraussetzungen

- Ein aktueller Desktop-Browser (Chrome, Firefox, Safari oder Edge; jeweils eine aktuelle Version). Die App nutzt moderne Web-Standards (ES-Module, IndexedDB) und läuft nicht in sehr alten Browserversionen.
- Python 3 (für den mitgelieferten Start-Server) **oder** eine andere Möglichkeit, einen lokalen Webserver zu starten.
- Keine Internetverbindung nötig, sobald die Dateien lokal vorliegen — die App lädt keine externen Ressourcen nach.

### Lernstand sichern

Der Fortschritt liegt lokal im Browser (IndexedDB), gebunden an Browser + Port. Unter **Einstellungen → Sicherung** kann der komplette Lernstand jederzeit als JSON-Datei exportiert und auf einem anderen Rechner oder nach einem Browser-Reset wieder importiert werden. Empfehlenswert: regelmäßig exportieren, besonders vor größeren System- oder Browser-Updates oder vor dem Löschen von Browserdaten ("Verlauf/Cache leeren" kann IndexedDB mit löschen).

---

## 2. Ziel der App

Die App bereitet gezielt auf zwei offizielle Salesforce-Zertifizierungen vor:

- **Salesforce Certified Platform Foundations** — Einstiegszertifizierung ohne Vorkenntnisse, deckt Salesforce-Ökosystem, Navigation, Datenmodell sowie Reports & Dashboards ab.
- **Salesforce Certified Platform Administrator** — baut auf dem Foundations-Wissen auf und deckt Configuration & Setup, Object Manager & Lightning App Builder, Sales & Marketing, Service & Support, Data & Analytics Management, Automation und Agentforce ab.

Der Trainingsumfang ist bewusst eng gefasst auf das, was für das Bestehen der Prüfung tatsächlich zählt:

- Salesforce-Fachwissen entlang der offiziellen Exam-Domains und ihrer Gewichtung.
- Englisches Leseverständnis speziell für Prüfungsfragen und Antwortoptionen (Satzbau, Signalwörter, typische Formulierungen).
- Salesforce-Fachvokabular auf CEFR-Niveau B1/B2.
- Prüfungsähnliche Szenariofragen zum Trainieren von Entscheidungslogik.
- Spaced Repetition und Fortschrittsmessung gegen ein realistisches 12-Wochen-Lernziel.

**Nicht** Bestandteil der App: Hörverständnis, Aussprachetraining, Sprechübungen, freies Schreiben oder eine KI-gestützte Sprachbewertung. Der Fokus liegt ausschließlich auf Lesen, Verstehen und Anwenden von Fachwissen.

---

## 3. Für wen ist die App gedacht?

Für alle, die sich selbstständig auf die Foundations- oder Administrator-Prüfung vorbereiten — unabhängig vom Vorwissen. Beim ersten Start wählt man einen von drei Lernpfaden, die sich in Umfang, Vorkenntnissen und Wochenplanung unterscheiden:

| Lernpfad | Für wen geeignet | Inhalt |
|---|---|---|
| **Foundations** | Einstieg ohne Vorkenntnisse | Nur Foundations-Stoff, 12-Wochen-Plan komplett darauf ausgerichtet |
| **Administrator (Foundations vorausgesetzt)** | Foundations-Prüfung bereits bestanden bzw. Stoff sicher beherrscht | Nur Administrator-Stoff, keine Wiederholung der Foundations-Grundlagen |
| **Administrator (inkl. Foundations)** | Direktes Ziel Administrator, aber Foundations-Stoff noch nicht sicher | Woche 1–5 Foundations-Grundlagen, Woche 6–12 Administrator-Schwerpunkte, in einem gemeinsamen Plan |

Der Lernpfad lässt sich jederzeit in den Einstellungen wechseln, ohne dass bereits erzielter Fortschritt verloren geht.

---

## 4. Funktionsweise und Bereiche der App

### Dashboard

Startseite mit direktem Zugriff auf die wichtigste Aktion. Zeigt:

- **"Heutige Einheit starten"** als Hauptaktion, inklusive Anzahl fälliger Wiederholungen.
- Fällige Wiederholungen im Überblick.
- Wochen-Soll vs. Wochen-Ist (neue Vokabeln, Wiederholungen, Reading-Übungen) für die laufende der 12 Wochen.
- Aktuellen Monatsmeilenstein (Monat 1–3).
- Fortschritt je Exam-Domain, gewichtet nach offizieller Prüfungsrelevanz.
- Fortschritt B1 vs. B2.
- Die drei größten aktuellen Schwachpunkte (Domains mit niedrigster Trefferquote, ab mindestens 3 Antworten).

### Lernmodus ("Heutige Einheit")

Die tägliche Einheit (ca. 20–40 Minuten) kombiniert automatisch:

- Fällige Spaced-Repetition-Wiederholungen (siehe Abschnitt 6), priorisiert nach Überfälligkeit.
- Neue Vokabeln — werden zunächst als Karteikarte vorgestellt (Begriff, Beispielsatz, deutsche Erklärung, Salesforce-Kontext, Merksatz, mögliche Verwechslungsbegriffe) und erst in einer der nächsten Einheiten aktiv abgefragt.
- Definitions-Matching-Aufgaben.
- Kurze englische Reading-Passagen mit Verständnisfragen.
- Am Ende jeder Einheit optional eine praktische Übungsaufgabe für den Trailhead Playground oder eine Developer Edition.

Eine Einheit läuft in Runden ab: Nach jeder Runde kann man freiwillig weiterlernen (wenn noch fälliges oder neues Material vorhanden ist) oder für den Tag abschließen. Am Ende gibt es eine Zusammenfassung (Trefferquote, Anzahl neu kennengelernter Vokabeln).

### Frage- und Prüfungsmodus

Zwei Modi für gezieltes Üben abseits der Tageseinheit:

- **Freies Üben**: beliebig viele Fragen/Übungen nacheinander, mit umfangreichen Filtern (siehe unten) und der Option, einzelne Inhalte als "später wiederholen" zu markieren.
- **Mini-Prüfung**: 10 zufällig ausgewählte Szenariofragen/Reading-Passagen mit 10 Minuten Zeitlimit, Navigation zwischen Fragen, Auswertung erst nach dem Abgeben, inklusive Erklärung zu jeder Antwortoption.

Unterstützte Fragetypen: Single Choice und Multiple Select. Nach jeder Antwort (außer in der Mini-Prüfung, dort erst am Ende) folgt eine Sicherheitsabfrage (1 = geraten bis 5 = sehr sicher) sowie eine ausführliche Erklärung der richtigen und falschen Antwortoptionen inklusive Analyse relevanter englischer Signalwörter.

**Filteroptionen** im Frage- und Prüfungsmodus sowie im Glossar:

- Zertifizierung (bei Lernpfad "Administrator inkl. Foundations": Beide / nur Foundations / nur Administrator)
- Exam-Domain
- CEFR-Level (B1 / B2 / beide)
- Übungsformat (Vokabel im Kontext / Definitions-Matching / Szenario-Frage / Reading-Passage)
- Schwierigkeitsgrad (leicht / mittel / schwer)
- Fehlerstatus (nur zuletzt falsch beantwortet / als "später wiederholen" markiert / nur neue, noch nicht bearbeitete Inhalte)

### Glossar

Durchsuchbares Nachschlagewerk aller Salesforce-Fachbegriffe. Zu jedem Begriff:

- Englischer Fachbegriff und deutsche Erklärung.
- Salesforce-Kontext und Beispielsatz.
- CEFR-Level und Themenblock (Exam-Domain).
- Häufige Verwechslungsbegriffe, sofern relevant.
- Persönlicher Wiederholungsstatus (noch nicht gelernt / kennengelernt / muss erneut gelernt werden / später wiederholen / nächste Wiederholung am …).

Filterbar nach Zertifizierung, Exam-Domain, CEFR-Level und per Freitextsuche.

### Prüfungsenglisch

Statische Referenzseite (kein Filter, keine Interaktion) mit der Analyse des in den Salesforce-Zertifizierungsprüfungen verwendeten Englisch — Quelle direkt am Seitenanfang, danach Abschnitte mit Überschriften und Aufzählungen:

- Aufbau der Szenariofragen (Zwei-Satz-Anatomie) anhand einer realen Beispielfrage aus dem offiziellen Practice Test.
- Wiederkehrende Formulierungen ("given a scenario", "most appropriate", "which two" u. a.) mit Funktion und typischer Falle.
- Negationen, Modalverben und Präpositionen mit Bedeutungsverschiebung.
- CEFR-Einordnung B1 vs. B2 inkl. Faustregel für die Content-Erstellung.
- Die Drei-Schritt-Lesestrategie.
- Weiterführende Quellen mit Verlässlichkeitseinordnung (empfohlen vs. strikt zu meiden, z. B. Exam-Dump-Seiten).

Inhaltliche Grundlage: Kapitel 4 und 5 der Recherchebasis (`01_Recherchebasis_und_Content-Grundlage.md`).

### Fortschritt

Detaillierte Auswertung des eigenen Lernstands:

- Gesamtstatistik: Trefferquote, durchschnittliche Antwortsicherheit, durchschnittliche Bearbeitungszeit, Anzahl kennengelernter (aber noch nicht abgefragter) Vokabeln.
- Fällige und überfällige Wiederholungen.
- Zielerreichung der aktuellen Woche und des aktuellen Monatsmeilensteins als Soll-Ist-Vergleich.
- Wochenrückblick: Trefferquote und Wiederholungsquote der laufenden Woche, die drei schwächsten Themen dieser Woche und eine konkrete, regelbasierte Empfehlung für die nächsten Tage.
- Domain-Abdeckung entsprechend der offiziellen Prüfungsgewichtung (welcher Anteil der Inhalte je Domain bereits gefestigt ist).
- Schwachpunktanalyse über den gesamten bisherigen Lernverlauf (ab mindestens 3 Antworten pro Domain).

Ein Hinweistext macht an mehreren Stellen deutlich: Die Fortschrittsanzeige ist ein **Lernindikator**, keine Garantie fürs Bestehen der Prüfung.

### Einstellungen

- Darstellung: Dark Mode / Light Mode.
- Lernpfad wechseln (Foundations / Administrator / Administrator inkl. Foundations) — Fortschritt bleibt erhalten.
- Tagesziel in Minuten und Startdatum der 12-Wochen-Planung anpassen.
- Lernstand als JSON exportieren oder importieren (siehe Abschnitt 1, "Lernstand sichern").
- Gefahrenzone: kompletten Lernfortschritt zurücksetzen (mit Sicherheitsabfrage) — Theme, Lernpfad und Tagesziel bleiben dabei erhalten.

---

## 5. Übungsformate im Detail

Die App implementiert bewusst genau drei Übungsformate:

1. **Vokabel im Kontext** — englischer Lückentext, in dem der passende Salesforce-Fachbegriff aus mehreren Optionen ausgewählt wird. Nach der Antwort folgen deutsche Erklärung, Salesforce-Kontext und ein Merksatz.
2. **Definitions-Matching** — Zuordnung eines Fachbegriffs zur passenden Definition unter mehreren Distraktoren. Vollständig per Tastatur bedienbar (Tab + Enter).
3. **Szenario lesen und beantworten** — kurzer englischer Szenariotext (Reading-Passage) mit einer oder mehreren Verständnisfragen (Single Choice oder Multiple Select), prüfungsnahen Antwortoptionen, fachlicher Erklärung und Analyse der englischen Signalwörter im Text.

Jede Szenariofrage ist eindeutig gekennzeichnet als: *"Synthetische, prüfungsähnliche Übungsfrage – keine Originalprüfungsfrage."*

---

## 6. Spaced Repetition (SM-2)

Die App nutzt ein transparentes Wiederholungssystem nach dem SM-2-Prinzip, angepasst auf zwei CEFR-Level und den engen Themenrahmen Salesforce-Zertifizierung. Nach jeder Antwort werden Ease-Factor, Wiederholungsintervall und nächstes Fälligkeitsdatum aus Korrektheit und selbst eingeschätzter Antwortsicherheit (1–5) neu berechnet.

Priorisierung der täglichen Einheit, in dieser Reihenfolge:

1. Überfällige Wiederholungen.
2. Als "erneut lernen" markierte Inhalte (zuletzt falsch beantwortet).
3. Als "später wiederholen" markierte Inhalte (richtig, aber unsicher beantwortet).
4. Neue Inhalte aus hoch gewichteten Exam-Domains.
5. Restliche neue Inhalte gemäß Wochenplan.

Neue Vokabeln werden beim ersten Kontakt nur als Karteikarte gezeigt (kein Wertungsversuch); die erste echte Abfrage folgt automatisch beim nächsten fälligen Kontakt.

---

## 7. Content-Umfang (aktueller Stand)

| Inhaltstyp | Anzahl |
|---|---|
| Fachbegriffe (Vokabular) | 240 |
| Definitions-Matching-Aufgaben | 110 |
| Szenariofragen | 190 |
| Reading-Passagen mit Verständnisfragen | 95 |
| Praktische Übungsaufgaben (Playground/Developer Edition) | 30 |
| Exam-Domains (Foundations + Administrator) | 12 |

Alle Inhalte sind selbst erstellt und eindeutig als synthetisch gekennzeichnet — sie orientieren sich in Umfang und Häufigkeit an der jeweiligen offiziellen Themengewichtung der Exam Outlines, sind aber keine Originalprüfungsfragen und keine "Exam Dumps".

Die zugrundeliegende Recherche zu Salesforce CRM, den offiziellen Exam Outlines, den Themengewichtungen und dem prüfungsrelevanten Fachenglisch findet sich in `01_Recherchebasis_und_Content-Grundlage.md`; das Produkt- und Datenkonzept in `02_Produkt_und_Datenkonzept.md`.

---

## 8. Grenzen der App

Wichtig für die richtige Einordnung:

- **Kein Ersatz für offizielle Lernmaterialien.** Die App ergänzt, ersetzt aber nicht Trailhead-Module, den offiziellen Exam Guide oder praktische Übung in einer echten Salesforce-Umgebung (Trailhead Playground / Developer Edition).
- **Keine Bestehensgarantie.** Fortschrittsanzeigen und die "Lernreife" sind Indikatoren, keine Vorhersage des Prüfungsergebnisses.
- **Keine Originalprüfungsfragen.** Alle Fragen, Definitionen und Reading-Passagen sind eigenständig formuliert und prüfungsähnlich, aber synthetisch. Die App verwendet und speichert keine geleakten oder als "Dumps" kursierenden Inhalte.
- **Kein Hör- oder Sprechtraining.** Der Fokus liegt ausschließlich auf Leseverständnis und Fachvokabular; Audio, Aussprache, Speech-to-Text/Text-to-Speech und freies Schreiben sind bewusst nicht enthalten.
- **Begrenztes Sprachniveau.** Die App deckt bewusst nur CEFR B1 und B2 ab — das entspricht dem in den Prüfungen tatsächlich vorausgesetzten Leseverständnis, nicht allgemeinem Englischlernen.
- **Rein lokal, kein Abgleich zwischen Geräten.** Es gibt kein Konto, kein Backend und keine Cloud-Synchronisation. Der Lernstand liegt ausschließlich im Browser des jeweiligen Geräts (IndexedDB) und muss über den JSON-Export manuell übertragen werden, wenn man Gerät oder Browser wechselt.
- **Kein automatischer Content-Nachschub.** Neue Inhalte, aktualisierte Exam-Gewichtungen oder Korrekturen müssen manuell in die `data/*.json`-Dateien eingepflegt werden; die App lädt nichts automatisch aus dem Internet nach.
- **Exam Outlines können sich ändern.** Salesforce passt Prüfungsformate und Themengewichtungen von Zeit zu Zeit an. Die in dieser App hinterlegten Gewichtungen entsprechen dem Stand der Recherche (siehe Quellenangaben in `01_Recherchebasis_und_Content-Grundlage.md`) und sollten bei Zweifeln gegen den aktuellen offiziellen Exam Guide geprüft werden.

---

## 9. Datenschutz und Datenspeicherung

- Es werden keine personenbezogenen Daten erhoben, keine Accounts angelegt und keine Daten an Dritte oder an einen Server übertragen.
- Der komplette Lernfortschritt (Wiederholungen, Antworten, Einstellungen) bleibt lokal im Browser (IndexedDB und LocalStorage).
- Der JSON-Export/-Import dient ausschließlich der eigenen Sicherung bzw. Übertragung des Lernstands und wird nirgendwo automatisch hochgeladen.
- Die App enthält keine API-Keys, keine Secrets und keine Tracking-Skripte.

---

## 10. Technischer Aufbau (für technisch interessierte Nutzer:innen)

- Reines HTML5, modernes CSS und Vanilla JavaScript (ES-Module) — kein Framework, kein Build-Schritt nötig.
- Persistenz: LocalStorage für Einstellungen, IndexedDB für Lernfortschritt und Aktivitätsprotokoll.
- Statische JSON-Dateien im Ordner `data/` enthalten sämtliche Lerninhalte (Vokabular, Definitionen, Reading-Passagen, Fragen, Praxisaufgaben, Exam-Domains, Wochenplan).
- Responsive Layout für Desktop, Tablet und Smartphone; Dark Mode und Light Mode; durchgängig tastaturbedienbar mit sichtbaren Fokuszuständen.
- Sichere DOM-Ausgabe ohne ungeprüfte HTML-Injektion von Inhalten (kein `innerHTML` mit dynamischen Nutzerdaten).

Verzeichnisstruktur:

```
salesforce_hubspot_zertifizierungs_app/
├── index.html              Einstiegspunkt
├── app.js                  Router und App-Initialisierung
├── styles.css               Gesamtes Styling (Dark/Light Mode)
├── start-server-mac.command      Startskript für macOS
├── start-server-windows.bat      Startskript für Windows
├── js/
│   ├── state.js              Zentraler App-State
│   ├── db.js                 IndexedDB-Zugriff (Fortschritt, Aktivität)
│   ├── sm2.js                 Spaced-Repetition-Logik
│   ├── contentLoader.js       Laden der JSON-Inhalte
│   ├── itemRenderer.js        Rendering der Übungsformate
│   ├── weeklyPlan.js           12-Wochen-Soll/Ist-Berechnung
│   ├── exportImport.js         JSON-Export/-Import, Reset
│   ├── utils.js                Geteilte Hilfsfunktionen
│   └── views/                  Dashboard, Lernen, Prüfung, Glossar, Prüfungsenglisch, Fortschritt, Einstellungen, Onboarding
└── data/
    ├── vocabulary.json
    ├── definitions.json
    ├── reading-passages.json
    ├── questions.json
    ├── practice-tasks.json
    ├── exam-domains.json
    └── weekly-plan.json
```

---

## 11. Häufige Fragen / Problemlösung

**Die Seite bleibt leer oder zeigt einen Ladefehler.**
Fast immer, weil `index.html` direkt per Doppelklick geöffnet wurde statt über den lokalen Server. Bitte `start-server-mac.command` (macOS) bzw. `start-server-windows.bat` (Windows) verwenden (siehe Abschnitt 1).

**Die Sicherheitswarnung lässt sich nicht wegklicken, oder es gibt keinen "Trotzdem ausführen"/"Öffnen"-Button.**
- Windows: Falls "Weitere Informationen" fehlt, wurde die Datei evtl. blockiert heruntergeladen. Rechtsklick auf `start-server-windows.bat` → **Eigenschaften** → unten bei "Sicherheit" das Kästchen **"Zulassen"** aktivieren → **OK**. Danach normal per Doppelklick starten.
- macOS: Falls Rechtsklick → Öffnen nichts bringt, unter **Systemeinstellungen → Datenschutz & Sicherheit** ganz unten prüfen, ob eine Meldung zur blockierten App erscheint, und dort **"Dennoch öffnen"** wählen.
- Bei Unternehmens-/Schul-Rechnern mit zentraler IT-Verwaltung kann die Ausführung von Skripten grundsätzlich gesperrt sein — dann hilft nur der manuelle Start (siehe "Alternative: manueller Start" oben) oder Rücksprache mit der IT.

**Windows meldet "Python wurde nicht gefunden".**
Python 3 ist nicht installiert oder war beim Installieren nicht mit "Add python.exe to PATH" aktiviert. Python nachinstallieren (https://www.python.org/downloads/) und dabei diese Option setzen, dann Rechner ggf. neu starten und `start-server-windows.bat` erneut versuchen.

**Mein Fortschritt ist nach einem Browser-Update oder dem Leeren des Verlaufs weg.**
IndexedDB kann beim Löschen von Browserdaten mit entfernt werden. Deshalb vor größeren Änderungen am System immer über Einstellungen → Sicherung exportieren.

**Ich möchte auf einem zweiten Gerät weiterlernen.**
Lernstand auf dem ersten Gerät exportieren (Einstellungen → Sicherung → Lernstand exportieren), Datei auf das zweite Gerät übertragen und dort importieren.

**Ich habe aus Versehen einen falschen Lernpfad gewählt.**
Kein Problem — der Lernpfad lässt sich in den Einstellungen jederzeit wechseln, ohne dass Fortschritt verloren geht.

---

## 12. Rechtlicher Hinweis

Diese App ist ein privates Lernprojekt und steht in keiner Verbindung zu Salesforce.com, Inc. "Salesforce" sowie zugehörige Produkt- und Zertifizierungsnamen sind Marken von Salesforce. Alle Übungsinhalte sind eigenständig erstellt und synthetisch; es werden keine Originalprüfungsfragen, geleakten Inhalte oder "Exam Dumps" verwendet, gespeichert oder verbreitet.


## HubSpot-Ebene (zweite Plattform)

Die App deckt zwei getrennte Zertifizierungswelten ab. Die Plattform wird im Onboarding gewählt
und ist später unter Einstellungen → Lernpfad umstellbar; der Fortschritt beider Plattformen
bleibt dabei erhalten.

| | Salesforce | HubSpot |
|---|---|---|
| Prüfungssprache | Englisch | Deutsch |
| Lernpfade | Foundations, Administrator, Administrator inkl. Foundations | Inbound Sales, Sales Hub Software, Reibungsloser Vertrieb, alle drei nacheinander |
| Prüfungsenglisch-Bereich | ja | nein |
| CEFR-Einstufung (B1/B2) | ja | nein |
| Gewichtung der Themenbereiche | offizielle Exam-Outline-Gewichtung | redaktionelle Priorität, abgeleitet aus der offiziellen Lektionsdauer |

Weil die drei HubSpot-Zertifizierungen auf Deutsch abgelegt werden, enthält diese Ebene bewusst
kein Englisch- und Leseverständnistraining: keine CEFR-Level, keine Signalwort-Analyse, alle
Inhalte auf Deutsch. Statt der Signalwort-Analyse zeigen HubSpot-Fragen eine **Ausschlusslogik**,
die begründet, warum die falschen Optionen ausscheiden.

### Neue Dateien

- `js/platforms.js` — Registry beider Plattformen: Beschriftungen, sichtbare Bereiche, Content-Felder
- `data/hubspot-vocabulary.json` (90), `data/hubspot-definitions.json` (45),
  `data/hubspot-questions.json` (75), `data/hubspot-reading-passages.json` (24),
  `data/hubspot-practice-tasks.json` (12), `data/hubspot-domains.json` (13),
  `data/hubspot-weekly-plan.json` (4 Lernpfade à 12 Wochen)

Die Salesforce-Dateien bleiben unverändert; `js/contentLoader.js` lädt beide Ebenen und führt sie
zusammen. Getrennt werden sie über das `certification`-Tag jedes Inhalts.

### Herkunft der HubSpot-Prioritäten

HubSpot veröffentlicht für diese Zertifizierungen **keine** prozentualen Themengewichtungen. Die
Prozentwerte der HubSpot-Themenbereiche sind deshalb redaktionell aus der offiziellen
Lektionsdauer abgeleitet (`priorityType: "editorialPriority"`) und werden in der Oberfläche auch
so beschriftet. Details, Quellen und Abrufdaten: `recherche_kontext/03_HubSpot_Recherchebasis.md`.

Nicht öffentlich dokumentiert und deshalb nirgends behauptet: Fragenanzahl, Zeitlimit,
Bestehensgrenze und Gültigkeitsdauer der HubSpot-Zertifizierungen. Sie stehen im jeweiligen Kurs
unter „Prüfung". Bestätigt ist: Wiederholung frühestens 12 Stunden nach dem letzten Versuch.
