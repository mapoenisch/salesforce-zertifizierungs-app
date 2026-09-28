# Salesforce- & HubSpot-Zertifizierungs-Trainer

Eine schlanke, lokale Lern-App zur Vorbereitung auf **Salesforce**- und **HubSpot**-Zertifizierungen. Sie läuft komplett im Browser, braucht kein Konto und keine Internetverbindung, und plant das Lernen über einen 12-Wochen-Plan mit Spaced Repetition (SM-2).

Entstanden als privates Lernprojekt im Rahmen der DBA-Weiterbildung zum Digital Sales Manager, gedacht für alle, die sich im Selbststudium auf eine dieser Prüfungen vorbereiten.

---

## Abgedeckte Zertifizierungen

| Plattform | Zertifizierung | Prüfungssprache |
|---|---|---|
| Salesforce | Certified Platform Foundations | Englisch |
| Salesforce | Certified Platform Administrator | Englisch |
| HubSpot | Inbound Sales | Deutsch |
| HubSpot | HubSpot Sales Software | Deutsch |
| HubSpot | Reibungsloser Vertrieb (Frictionless Sales) | Deutsch |

Die Plattform und der Lernpfad werden beim ersten Start gewählt und lassen sich später in den Einstellungen wechseln. Der Fortschritt bleibt dabei erhalten.

**Unterschied der beiden Ebenen:**

- **Salesforce:** Fachwissen plus englisches Leseverständnis für die Prüfung: CEFR-Einstufung (B1/B2), Signalwort-Analyse, eigener Bereich „Prüfungsenglisch“. Die Gewichtung folgt den offiziellen Exam Outlines.
- **HubSpot:** komplett auf Deutsch, ohne Englischtraining. Statt Signalwörtern erklärt eine Ausschlusslogik, warum falsche Optionen ausscheiden. HubSpot veröffentlicht keine Prozentgewichtungen, deshalb sind die Prioritäten redaktionell aus der offiziellen Lektionsdauer abgeleitet und in der App auch so beschriftet.

---

## Schnellstart

1. Repository herunterladen (grüner Button **Code → Download ZIP**) oder `sfz_app.zip` verwenden und entpacken.
2. Im Ordner `sfz_app` das passende Startskript öffnen:
   - **macOS:** Rechtsklick auf `start-server-mac.command` → **Öffnen** (nur beim ersten Mal nötig, wegen Gatekeeper).
   - **Windows:** Doppelklick auf `start-server-windows.bat`; bei der SmartScreen-Warnung **Weitere Informationen → Trotzdem ausführen**.
3. Die App öffnet sich automatisch unter `http://localhost:8000` (ist der Port belegt, nimmt das Skript den nächsten freien).

Voraussetzung ist **Python 3** für den lokalen Webserver. Ein direkter Doppelklick auf `index.html` funktioniert nicht, weil Browser das Laden der JSON-Inhalte über `file://` blockieren.

Manuell geht es auch:

```bash
cd sfz_app
python3 -m http.server 8000
```

Ausführliche Anleitung inklusive Problemlösung: [`sfz_app/README.md`](sfz_app/README.md).

---

## Funktionen

- **Dashboard:** heutige Einheit starten, fällige Wiederholungen, Wochen-Soll/-Ist, Monatsmeilensteine, drei priorisierte Schwachpunkte.
- **Lernmodus:** tägliche Einheit von 20–40 Minuten aus Wiederholungen, neuen Begriffen, Definitions-Matching und Szenariofragen.
- **Übungsformate:** Vokabel im Kontext, Definitions-Matching (auch per Tastatur), Szenario lesen und beantworten (Single Choice / Multiple Select).
- **Frage- und Prüfungsmodus:** Filter nach Zertifizierung, Domain, Niveau, Format und Fehlerstatus; Mini-Prüfungen mit Zeitlimit; Antwortsicherheit 1–5.
- **Glossar:** Fachbegriff, deutsche Erklärung, Kontext, Beispielsatz, Verwechslungsbegriffe, persönlicher Wiederholungsstatus.
- **Fortschritt:** Trefferquote, Sicherheit, Bearbeitungszeit, Abdeckung je Domain, Wochenrückblick und eine Lernreife-Anzeige (reiner Lernindikator, keine Bestehensgarantie).
- **Datensicherung:** JSON-Export und -Import des Lernstands.
- **Bedienung:** responsive, Dark/Light Mode, Tastaturbedienung, sichtbare Fokuszustände.

---

## Content-Umfang

| Inhaltstyp | Salesforce | HubSpot |
|---|---:|---:|
| Fachbegriffe | 240 | 90 |
| Definitions-Matching | 110 | 45 |
| Szenariofragen | 190 | 75 |
| Reading-Passagen / Fallbeispiele | 95 | 24 |
| Praxisaufgaben | 30 | 12 |
| Themenbereiche (Domains) | 12 | 13 |

Alle Fragen sind selbst formuliert und als **synthetische, prüfungsähnliche Übungsfragen** gekennzeichnet. Es sind keine Originalprüfungsfragen und keine „Exam Dumps“.

---

## Projektstruktur

```
.
├── README.md                      Diese Übersicht
├── AGENTS.md                      Projektvorgaben für KI-Assistenten (Claude)
├── sfz_app/                       Die Web-App
│   ├── index.html, styles.css, app.js
│   ├── start-server-mac.command   Startskript macOS
│   ├── start-server-windows.bat   Startskript Windows
│   ├── README.md                  Ausführliche Nutzer- und Technikdoku
│   ├── js/                        ES-Module (SM-2, Datenbank, Plattformen, Views)
│   └── data/                      Lerninhalte als JSON (Salesforce + hubspot-*)
├── sfz_app.zip                    Gepackte App zum Weitergeben
├── recherche_kontext/             Recherche, Konzepte, Glossare, Quellen
└── Zertifizierungsvergleich - Platform Foundations_Administrator.md
```

Wichtige Hintergrunddokumente in `recherche_kontext/`:

- `01_Recherchebasis_und_Content-Grundlage.md`: Salesforce-Recherche, Exam Outlines, Gewichtungen, Quellen
- `02_Produkt_und_Datenkonzept.md`: User Stories, Datenmodell, SM-2-Logik
- `03_HubSpot_Recherchebasis.md`: HubSpot-Zertifizierungen, abgeleitete Prioritäten, Quellen

---

## Technik

- HTML5, modernes CSS, Vanilla JavaScript (ES-Module), kein Framework, kein Build-Schritt
- Lernstand in IndexedDB, Einstellungen in LocalStorage, alles nur lokal im Browser
- Kein Backend, kein Login, keine Cloud-Synchronisation, keine Tracking-Skripte, keine API-Keys

Neue Inhalte werden direkt in den Dateien unter `sfz_app/data/` ergänzt. Jeder Eintrag braucht mindestens eine eindeutige ID, Zertifizierung, Domain, Lernformat, Schwierigkeit und Quellenangabe (bei Salesforce zusätzlich das CEFR-Level).

---

## Grenzen

- Ergänzt die offiziellen Lernmaterialien (Trailhead, HubSpot Academy, Exam Guides), ersetzt sie aber nicht.
- Keine Bestehensgarantie: Fortschrittsanzeigen sind Lernindikatoren.
- Exam Outlines und Prüfungsbedingungen können sich ändern. Die hinterlegten Gewichtungen entsprechen dem Stand der Recherche und sollten gegen den aktuellen offiziellen Exam Guide geprüft werden.
- Der Lernstand liegt nur im jeweiligen Browser. Beim Geräte- oder Browserwechsel per JSON-Export übertragen.

---

## Rechtlicher Hinweis

Privates Lernprojekt ohne Verbindung zu Salesforce, Inc. oder HubSpot, Inc. „Salesforce“, „HubSpot“ sowie die zugehörigen Produkt- und Zertifizierungsnamen sind Marken der jeweiligen Inhaber. Alle Übungsinhalte sind eigenständig erstellt und synthetisch.
