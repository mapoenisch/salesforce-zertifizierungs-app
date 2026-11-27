# Salesforce-Zertifizierungs-Trainer

Lokale Lern-App zur Vorbereitung auf **Salesforce Certified Platform Foundations** und **Salesforce Certified Platform Administrator**. Entstanden als privates Lernprojekt während der DBA-Weiterbildung zum Digital Sales Manager.

Der Trainer verbindet Salesforce-Fachwissen und englisches Leseverständnis auf B1/B2-Niveau. Er bietet einen Zwölf-Wochen-Lernplan, fällige SM-2-Wiederholungen, Glossar, Mini-Prüfungen und Lernfortschritt nach Exam-Domain.

## Schnellstart

1. Öffne im Ordner `sfz_app` das Startskript für [macOS](sfz_app/start-server-mac.command) oder [Windows](sfz_app/start-server-windows.bat). Für die ZIP-Version entpacke [sfz_app.zip](sfz_app.zip) und öffne das Skript im entpackten Ordner.
2. Die App öffnet sich unter [localhost:8000](http://localhost:8000). Die Startskripte verwenden bewusst denselben Port, damit der Lernstand unter derselben Browseradresse erreichbar bleibt. Falls Port 8000 belegt ist, öffne den bereits laufenden Trainer oder beende den anderen Dienst auf diesem Port.
3. Wähle beim ersten Start deinen Lernpfad. Die Skripte benötigen Python 3.

Im Repository kannst du den Server auch manuell starten.

    cd sfz_app
    python3 serve.py 8000

Der Lernfortschritt liegt im Browser. Beim ersten Start über die bisherige Adresse und im selben Browserprofil übernimmt die App die Salesforce-Datensätze aus dem bisherigen Speicher. Eine JSON-Sicherung kannst du in den Einstellungen exportieren und importieren.

## Lerninhalte und Dokumentation

Der Trainer enthält 240 Fachbegriffe, 110 Definitions-Matching-Aufgaben, 190 Fragen, 95 Reading-Passagen und 30 Praxisaufgaben aus zwölf Exam-Domains. Die Fragen wurden für das Lernprojekt formuliert. Die Lernreifeanzeige dient als Lernindikator.

- [Nutzer- und Technikdokumentation](sfz_app/README.md)
- [Salesforce-Recherche und Quellen](recherche_kontext/01_Recherchebasis_und_Content-Grundlage.md)
- [Produkt- und Datenkonzept](recherche_kontext/02_Produkt_und_Datenkonzept.md)

Die App läuft mit HTML, CSS, JavaScript und statischen JSON-Dateien. Sie verwendet für Einstellungen und Fortschritt die Browserspeicher LocalStorage und IndexedDB.

## Regressionstests

Die Logiktests lassen sich mit Node.js 22 oder neuer und ohne Paketinstallation ausführen.

    node --test tests/trainer.test.mjs
