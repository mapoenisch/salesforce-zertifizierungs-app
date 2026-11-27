# Gesamtplan: Umbau des Salesforce-Zertifizierungs-Trainers

> Überarbeitete Fassung nach der Schwachstellenprüfung. Status: Umsetzungsplan, kein Bericht über bereits implementierte Änderungen.

## 1. Zielbild und Umfang

Der Trainer wird zur **Prüfungswerkstatt**: Ein konkreter Salesforce-Fall auf Englisch führt zu einer Entscheidung. Die Auflösung erklärt, welches fachliche oder sprachliche Detail entscheidend war. Ein neuer, anders formulierter Fall zeigt, ob die Lernenden diese Unterscheidung selbst anwenden können.

Der erste Umbau beweist diesen Ablauf für **einen bestehenden Lernpfad und ein enges Thema**, bevor Navigation, Pfadwahl und Fragenbestand breit geändert werden. Die bestehende Lernrunde mit einer Aufgabe pro Bildschirm, Fortschrittsanzeige, `M` für „Später wiederholen“ und Rundenabschluss bleibt erhalten. Nicht Teil des Umbaus: Streak-Verlust, Badge-Sammlung, KI-Avatar, separater Einsteigermodus oder ein größerer technischer Neuaufbau.

## 2. Produktregeln: Lernen, gezielt üben und testen

| Modus | Wer bestimmt die Aufgaben? | Deutsche Hilfe und Feedback | Zweck |
|---|---|---|---|
| **Lernen** | Die App führt durch die nächste passende Aufgabe oder Wiederholung. | Übersetzung bei Bedarf; fachliche Auflösung direkt nach der Antwort. | Einen Unterschied verstehen und auf einen neuen Fall anwenden. |
| **Gezielt üben** | Lernende wählen Thema, eigene Fehler oder Englisch-Niveau. | Übersetzung bei Bedarf; fachliche Auflösung direkt nach der Antwort. | Ein selbst gewähltes Thema vertiefen oder eigene Antworten nacharbeiten. |
| **Mini-Test** | Der Versuch stellt eine feste Anzahl englischer Aufgaben unter Zeitlimit. | Keine deutsche Übersetzung, Sprachnotiz oder Auflösung während des Versuchs. Danach stehen Übersetzung und Fachfeedback zur Verfügung. | Leistung in diesem Versuch unter den angegebenen Bedingungen beobachten, nicht Fachwissen und Sprachleistung getrennt messen. |

Vorgesehene Navigation nach dem Prototyp: `Heute · Lernen · Üben & Testen · Glossar · Fortschritt`. „Heute“ beantwortet „Was mache ich jetzt?“. „Fortschritt“ zeigt bearbeitete Inhalte und belegbare Beobachtungen; es ist kein Prüfungsreife-Indikator. Der aktive Bereich ist auf Mobilgeräten und Desktop erkennbar, „Einstellungen“ erscheint pro Ansicht nur einmal. Icons sind kein Pflichtumfang; zuerst werden Labels und Orientierung getestet.

## 3. Emotional Journey: Einstieg, Abschluss und Rückkehr

| Moment | Umsetzung | Abnahme |
|---|---|---|
| **Pfadwahl** | Die bestehenden Pfade mit „Für dich, wenn …“ erläutern. Foundations als bedingte Empfehlung für Salesforce-Neulinge sichtbar machen. Lernumfang und Sprachfokus zeigen; Prüfungsdetails bleiben aufklappbar. | Eine neue Person kann ihre Wahl begründen und findet die Wechselmöglichkeit. |
| **Start ohne Lerndaten** | Ersten Fall kurz ankündigen; eine Hauptaktion „Ersten Fall starten“. Keine 0 %, keine leeren Balken und keine noch gesperrte Analyse. | Eine neue Person findet den Einstieg ohne Anleitung. |
| **Lernrunde** | Bestehenden Fortschritt und Rundenabschluss erhalten. „Später wiederholen“ lässt sich direkt rückgängig machen. Keine zusätzliche Schrittfolge nur für eine bessere Inszenierung. | Vormerken und Rückgängig funktionieren auch per Tastatur; Status ist nicht nur visuell erkennbar. |
| **Einheit abgeschlossen** | Konkret benennen, was geübt wurde, z. B. „Du hast Feldzugriff und Datensatzzugriff in englischen Fragen unterschieden.“ Einen nächsten Schritt anbieten; Praxisaufgabe nur optional. | Die Aussage beschreibt die bearbeitete Aufgabe, nicht eine ungemessene Kompetenz. |
| **Rückkehr** | Gespeicherte Einheit fortsetzen oder über eine untergeordnete Aktion beenden bzw. neu beginnen. Keine verlorene Serie und kein künstlicher Rückstand. | Ein alter Entwurf blockiert den Einstieg nicht dauerhaft. |
| **Mini-Test beendet** | Ergebnis, belegbare Beobachtung und nächste Aktion vor der Detailtabelle zeigen. Ein erreichtes internes Trainingsziel kann dezent markiert werden. | Die Auswertung bleibt bei gutem, schwachem oder uneindeutigem Ergebnis verständlich. |

### Zustandsregeln für „Heute“

1. **Fortsetzbare Lerneinheit:** „Einheit fortsetzen“; „Einheit beenden / neu beginnen“ bleibt erreichbar. Vor dem Verwerfen wird klar, was verloren geht.
2. **Noch keine Einheit abgeschlossen:** „Ersten Fall starten“. Startet die Person einen anderen Pfad, bezieht sich die Beschriftung auf dessen tatsächlichen Lernstand.
3. **Wiederholungen verfügbar:** „Wiederholungen starten“, mit Thema nur dann, wenn es tatsächlich in der Auswahl vorkommt.
4. **Nichts fällig:** „Neuen Fall üben“. Wenn keine neuen Aufgaben verfügbar sind, ehrlich auf die vorhandene Übungs- oder Wiederholungsmöglichkeit verweisen.
5. **Zeitbudget schließt alle passenden Aufgaben aus:** Diesen Zustand vor dem Anzeigen einer nicht verfügbaren Hauptaktion abfangen. Ursache nennen und „Zeitbudget anpassen“ oder „Ohne Zeitfilter anzeigen“ anbieten.

Mini-Tests nicht als offene Lerneinheiten behandeln. Einen Versuch nur als fortsetzbar anzeigen, wenn die vorhandenen Zeit- und Wiederherstellungsregeln das tatsächlich erlauben. Beim Pfadwechsel als Soll prüfen: abgeschlossene Antworten bleiben im Verlauf, die Startseite zeigt den gewählten Pfad, und eine offene Einheit wird nicht stillschweigend verworfen. Vor Umsetzung klären, welche Inhalte und Wiederholungen pfadübergreifend geteilt werden können; keine stillen Änderungen an gespeicherten Daten.

## 4. Design Specificity: die Fallakte

Die Fallakte ist ein wiedererkennbares Format für Szenariofragen, keine Pflichtschablone für jede Karte. Ihr Mittelpunkt ist die englische Aufgabe; nach der Antwort folgt **eine zentrale Erklärung**: „Warum diese Antwort?“

| Element | Wann es erscheint | Beispiel |
|---|---|---|
| Englischer Fall und konkrete Entscheidung | Pflicht für die neu ausgearbeiteten Fallfragen. | „A sales rep can open an opportunity but can’t edit one field.“ |
| Deutsche Übersetzung | Pflicht im Inhalt; in Lern- und Übungsmodus auf Abruf, im Mini-Test erst in der Auswertung. | „Ein Vertriebsmitarbeiter kann eine Opportunity öffnen, aber ein einzelnes Feld nicht bearbeiten.“ |
| Fachliche Auflösung | Pflicht. Kurz erklären, welches Detail die Entscheidung trägt und, falls hilfreich, warum eine naheliegende Alternative nicht passt. | „Der Datensatz lässt sich bereits öffnen. Gefragt ist nach der Bearbeitung eines bestimmten Felds.“ |
| Sprachnotiz | Nur wenn eine Formulierung die Entscheidung beeinflusst oder leicht missverstanden wird. Kein zusätzlicher Kasten, wenn die zentrale Erklärung ausreicht. | „one field“ grenzt die Frage auf ein einzelnes Feld ein. |
| Praxisaufgabe | Nur bei erkennbarem Mehrwert, optional nach der Einheit. | In einer Übungsumgebung vergleichen, was sich bei geändertem Feld- und Datensatzzugriff jeweils ändert. |

Die dunkle Palette und das ruhige Sitzungsdesign bleiben; Blau kennzeichnet Aktionen, Gold einen tatsächlichen Abschluss. Farbe trägt keinen Status allein. Erklärungen bleiben auf dem Smartphone in sinnvoller Lesereihenfolge. Im Mini-Test keine Themenüberschrift anzeigen, wenn sie die Antwort verrät. Fachlich eindeutige Kurzfragen dürfen Kurzfragen bleiben. Vor der Ausweitung den Bestand in „direkt geeignet“, „redaktionell überarbeiten“ und „bewusst kurz belassen“ einteilen.

## 5. Üben, Mini-Test und ehrliche Auswertung

### Gezielt üben

- Den Unterschied direkt erklären: „Wähle ein Thema oder übe eigene Fehler. Du bekommst die Erklärung nach jeder Antwort.“
- Themen, etwa „Security and Access“, durchsuchbar machen. Thema, „Fehler wiederholen“ und Englisch-Niveau lassen sich kombinieren; eine Schnellwahl verändert nur den betreffenden Filter.
- Aktive Filter sichtbar und einzeln entfernbar machen. Bei null Treffern die Kombination zeigen und einen konkreten Ausweg anbieten, z. B. „B2-Filter entfernen“, wenn das tatsächlich Treffer liefert. Ohne eigene Fehler auf eine Themenübung verweisen.

### Mini-Test

- Vor dem Start deutlich ansagen: `10 Fragen · 10 Minuten · auf Englisch · keine Pause · Auflösung am Ende`. Das Format ist ein internes Training, keine offizielle Prüfungssimulation mit nachgewiesener Aussagekraft.
- Offene und beantwortete Fragen unterscheidbar machen. Beim Verlassen erläutern, ob und bis wann der Versuch fortgesetzt werden kann oder verworfen wird. Abgelaufene Versuche nicht als offen anbieten.
- Die Auswertung in der Reihenfolge `Ergebnis → Beobachtung → nächste Aktion → Detailübersicht` aufbauen. Bei abgelaufener Zeit unbeantwortete Aufgaben separat kennzeichnen und verständlich erklären, wie sie im Ergebnis berücksichtigt werden.
- „8 von 10 richtig“ ist eine Beobachtung. „Zwei Fehler betrafen in diesem Versuch Berechtigungen“ ist nur zulässig, wenn die Antworten das belegen. Kein „Dein Englisch ist zu schwach“, „Berechtigungen sind deine Schwäche“ oder „Du bist prüfungsreif“ aus einem einzelnen Versuch ableiten. Ohne klares Muster lautet die Aktion „Antworten überprüfen“.

## 6. Persona Red Flags: verbindliche Abnahmepfade

| Persona | Aufgabe | Bestanden, wenn … |
|---|---|---|
| **Jordan – zum ersten Mal hier** | Einen Pfad wählen, einen Fall starten, nach der Auflösung einen zweiten Fall lösen und den passenden Modus finden. | Jordan startet ohne Einweisung, kann den Pfad bei Bedarf wechseln und erklärt, wer im jeweiligen Modus die Aufgaben auswählt und wann Feedback kommt. |
| **Alex – will schnell arbeiten** | Ohne Maus starten, beantworten und weitergehen; `M` nutzen; Thema, „Fehler“ und „B2“ zusammen einstellen. | Die Tastatur reicht aus, `M` greift nicht in Texteingaben ein, und Filter überschreiben sich nicht. |
| **Sam – nutzt Screenreader und Tastatur** | Eine Aufgabe bearbeiten, Fortschritt erfassen, im Mini-Test zu einer offenen Frage springen und danach das Ergebnis verstehen. | Ansagen wie „Frage 3 von 10“ und „Frage 4, unbeantwortet“ sind verständlich. Fokus, Rückmeldung und Ergebnis sind ohne visuelle Hinweise nachvollziehbar. Falls die Sicherheitsskala bleibt, ist auch sie mit verständlichen Bezeichnungen und Auswahlstatus bedienbar. |

Zugängliche Namen, Fokus und Tastaturbedienung sind ab dem ersten Prototyp Teil der Abnahme. Der komplette Testpfad über alle Bereiche folgt erst, sobald diese Bereiche umgesetzt sind.

## 7. Questions to Consider: Entscheidungen und offene Prüfungen

| Thema | Entscheidung |
|---|---|
| **Streak oder Fälligkeitszahl?** | Kein Streak. Abgeschlossene Einheiten können als Zusatzinformation erscheinen. Die nächste Handlung führt; Zahlen stehen nicht für sich. „Tag 3“ nur verwenden, wenn es einen echten Tagesplan gibt. |
| **Drei statt fünf Sicherheitsstufen?** | Nicht im ersten Umbau ändern. Zuerst klären, ob die Angabe die Wiederholungsplanung, Auswertung oder nächste Aufgabe sinnvoll beeinflusst. Falls nicht, Weglassen prüfen. Falls ja, „Geraten · Unsicher · Sicher“ optional und vor der Auflösung testen. Selbsteinschätzung bleibt von Richtigkeit getrennt. Bei Einfluss auf die bestehende Wiederholungsplanung erst Auswirkungen auf alte Bewertungen und Termine klären. |
| **Beginner-Modus?** | Kein zweiter Modus. „Wiederholungen“, „Prüfungsthema“ und „Englisch-Niveau“ als Standardsprache. Technische Details optional verlinken. „Morgen“ nur verwenden, wenn eine Wiederholung tatsächlich morgen ansteht. |

## 8. Umsetzungspakete und Freigaben

| Paket | Umfang | Freigabe für den nächsten Schritt |
|---|---|---|
| **0 – Regeln und Ausgangslage** | Die drei Modi verbindlich beschreiben. Aktuelle UI im Browser auf Mobil- und Desktopbreite ansehen. Bestehendes Falllayout als Vergleich sichern. Einen Pfad und ein Thema festlegen. | Aufgabenauswahl, Übersetzung, Feedback und zulässige Ergebnisaussagen sind festgelegt. |
| **1 – Enger Browser-Prototyp** | Nur `Einstieg → Fall → Auflösung → neuer Fall` für einen Pfad bauen. Ein Fall zu Feld- versus Datensatzzugriff und ein anders formulierter Folgefall reichen als Start. Keine Migration, neue Statistik oder Sicherheitsskala. | Einstieg, Verständnis, Anwendung im Folgefall und zugängliche Bedienung separat prüfen. Erst bei plausibler Verbesserung ausweiten; bei Problemen zuerst den betroffenen Schritt überarbeiten. |
| **2 – Pfadwahl, Heute und Wiedereinstieg** | Erst nach Paket 1 die bestehende Pfadwahl überarbeiten, Wechsel und gespeicherte Sitzungen klären und die Startseitenzustände einführen. | Neues Profil, falsche Pfadwahl, abgebrochene Einheit, keine fällige Aufgabe und zu kleines Zeitbudget sind praktisch getestet. |
| **3 – Üben und Mini-Test** | Modi und Filter trennen, Ergebnis neu aufbauen, offene, abgebrochene und abgelaufene Versuche prüfen. | Die Modi sind vor dem Start verständlich. Nulltreffer und schwache, starke oder uneindeutige Versuche liefern eine ehrliche nächste Aktion. Alex und Sam können ihre vollständigen Wege durchspielen. |
| **4 – Ausrollen und Feinschliff** | Fragenbestand sichten und das bewährte Muster selektiv übertragen. Ladezustand, Theme-Anzeige und Navigation abrunden. Sicherheitsskala nur bei geklärtem Nutzen separat testen. | Mobile und Desktop-Ansicht, Tastatur, Screenreader, Kontrast und reduzierte Bewegung geprüft. Bestehende Fortschrittsdaten und Sitzungsfunktionen sind nicht unbeabsichtigt verändert. |

## 9. Abnahme: Was hat sich tatsächlich verbessert?

1. **Einstieg:** Findet eine neue Person die erste Aufgabe, ohne sich zuerst durch Kennzahlen oder Fachjargon zu arbeiten?
2. **Verständnis:** Kann sie nach der Auflösung in eigenen Worten erklären, welches Detail wichtig war?
3. **Transfer:** Kann sie bei einem neuen, anders formulierten Fall unterscheiden, ob es um Datensatz- oder Feldzugriff geht, und die Wahl begründen? Für den Layoutvergleich denselben Ausgangsinhalt im bisherigen Layout und in der Fallakte verwenden. Wenn möglich, Reihenfolge variieren oder verschiedene Personen einsetzen, damit die zweite Ansicht nicht allein vom ersten Durchlauf profitiert.
4. **Barrierefreiheit:** Funktioniert derselbe Ablauf mit Tastatur und Screenreader, einschließlich Rückmeldung und nächster Aktion?
5. **Ergebnis und Wiederkehr:** Gibt die App einen nachvollziehbaren nächsten Schritt, ohne Ursachen, Prüfungsreife oder Lernrückstand zu erfinden?

Ein kleiner Prototypentest kann aufdecken, ob die Fallakte im nächsten Fall hilft. Er belegt noch keinen dauerhaften Lernerfolg. Wenn Personen den Einstieg finden, aber den Folgefall nicht begründen können, zuerst die Erklärung und die Aufgaben überarbeiten – nicht das Dashboard. Wiedererkennung ohne Logo ist ein ergänzender Gestaltungscheck, kein Ersatz für den Transfer.

## Grundlage

- Ausgangsplan: `Gesamtplan-Umbau.md`, in dieser Fassung überarbeitet.
- [Impeccable Critique – Salesforce-Zertifizierungs-Trainer](Impeccable-Critique-Salesforce-Zertifizierungs-Trainer.md): Quellcode- und Strukturprüfung ohne visuelles Browser-Overlay.
- Schwachstellenprüfung zum Gesamtplan: Testzweck, Fehlerinterpretation, kleinerer Prototyp, Modusgrenzen, Pfadwechsel, Inhaltsaufwand und Sicherheitsskala.
