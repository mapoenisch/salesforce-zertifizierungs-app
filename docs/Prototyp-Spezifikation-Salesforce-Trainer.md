# Prototyp-Spezifikation: Salesforce-Prüfungswerkstatt

Status: Produktentscheidungen und Abnahmeregeln. Der Prototyp ist noch nicht umgesetzt. Dieses Dokument ergänzt den Gesamtplan und ersetzt dessen offene Vorschläge durch konkrete Vorgaben. Fachliche Zuordnung: [Trailhead – Study Up on the Data Model][data-model], [Control Access to Fields][fields], [Control Access to Records][records].

## 1. Entscheidung vor der Bereichsauswahl: Was soll der Prototyp beweisen?

Die App soll Lernende nicht nur zur richtigen Antwort führen. Nach der Auflösung sollen sie in einem **neuen, anders formulierten Fall** selbst erkennen, ob die Anforderung einen Wert innerhalb eines Datensatzes oder den Zugriff auf einen konkreten Datensatz betrifft. Dazu sollen sie einen Hinweis aus der englischen Frage sinngemäß nennen. Die Begründung darf auf Deutsch erfolgen. Wir prüfen nicht, ob jemand eine Antwortbuchstabenfolge erinnert oder die richtige Einstellung im Salesforce-Setup kennt.

| Entscheidung | Festlegung |
|---|---|
| Zielgruppe | Deutschsprachige Salesforce-Einsteiger, die englische Aufgaben verstehen und fachlich einordnen wollen. |
| Pfad | **Platform Foundations**. Der Prototyp öffnet diesen Pfad direkt; eine neue Pfadauswahl ist nicht Teil des ersten Tests. |
| Bereich | **Data Model → Datensichtbarkeit → Feldzugriff vs. Datensatzzugriff**. Trailhead führt Datensichtbarkeit als Lernziel im Data-Model-Bereich auf. |
| Warum dieses Thema? | Eine kleine Änderung der englischen Anforderung ändert die fachliche Antwort. Beide Zugriffsebenen lassen sich ohne komplizierte Einrichtung, Richtlinien oder Organisationsdetails gegenüberstellen. |
| Nicht im Test | Objektrechte konfigurieren, Freigaberegeln auswählen, Fehler in einer realen Org diagnostizieren, Salesforce-Zertifizierungsreife bewerten. Objektzugriff darf Antwortalternative sein, ist aber kein separates Lernziel. |
| Arbeitsannahme | Die Fallakte kann die Aufmerksamkeit besser auf den entscheidenden Unterschied lenken. Das ist zu prüfen, kein belegtes Ergebnis. |

## 2. Was gebaut wird – und was noch nicht

**Prototyp:** Ein lokaler Browser-Durchlauf für einen Pfad. `Einstieg → Lernfall auf Englisch → Antwort → Auflösung → Folgefall → Abschluss`. Keine produktiven Lerndaten überschreiben. Teststände getrennt halten; ein Neuladen darf nicht versehentlich als neuer Versuch in die Beobachtung eingehen. Kein Login, keine neue Statistik, kein Mini-Test-Timer und keine Änderung an der bestehenden Wiederholungsplanung. Ziel sind wenige Screens, nicht der Umbau aller Pfade.

| Bildschirm | Inhalt und Verhalten |
|---|---|
| Einstieg | „Feld oder Datensatz? Entscheide in zwei kurzen Salesforce-Fällen, worauf sich die Zugriffsanforderung bezieht.“ Eine Hauptaktion: „Ersten Fall starten“. Keine Nullstatistik. |
| Lernfall | Englische Frage und drei englische Antwortoptionen. Einzelwahl, dann „Antwort prüfen“. „Deutsch anzeigen“ öffnet bei Bedarf die vollständige Übersetzung inklusive Antwortoptionen. Keine Themenzeile, die „Feld“ oder „Datensatz“ als Lösung vorwegnimmt. |
| Auflösung | Ergebnis als Text. Eine kurze Erklärung „Warum diese Antwort?“, die den englischen Hinweis mit dem Salesforce-Konzept verbindet. Dieselbe Erklärung ist bei richtigen und falschen Antworten erreichbar. Danach „Nächsten Fall öffnen“. |
| Folgefall | Neuer Fall mit anderem Kontext; keine Auflösung vor der Antwort. Im moderierten Test zuerst ohne Übersetzung beantworten und laut begründen, dann Unterstützung zulassen und getrennt dokumentieren. In der eigentlichen Lernoberfläche bleibt Deutsch auf Abruf verfügbar. |
| Abschluss | „Du hast Feldzugriff und Datensatzzugriff in zwei Fällen verglichen.“ Eine Aktion, etwa „Antworten ansehen“. Keine Aussage wie „Du beherrschst Berechtigungen“. |

Auf Mobilgeräten steht die Erklärung unter der Frage, nicht in einem seitlich wegscrollenden Bereich. Antworten, Übersetzung und Weiter-Aktion funktionieren per Tastatur. Fortschritt spricht „Frage 1 von 2“ statt nur eine Leiste. Nach Prüfung oder Seitenwechsel muss der Fokus nachvollziehbar sein; Rückmeldung muss ohne Farbe und ohne Maus verständlich sein. Bestehendes `M` und „Später wiederholen“ bleiben in der regulären Lernrunde erhalten, sind aber keine Voraussetzung für den engen Prototyp.

## 3. Fragenpaare und Lösungsschlüssel

Alle Fragen sind **selbst erstellt**. Sie sind keine offiziellen Prüfungsfragen. Im Prototyp je Person nur ein Fragenpaar zeigen. Paar A ist der Standard; Paar B prüft die umgekehrte Richtung; Paar C ist Reserve für eine zweite Runde. Die richtige Antwortposition wechselt. Deutsche Fassungen stehen als Hilfe bereit, die richtige Option und Begründung erst nach der Antwort.

| Paar | Lernfall | Folgefall | Was sich ändert |
|---|---|---|---|
| A – Salesforce-Vertrieb | A1: Feldzugriff | A2: Datensatzzugriff | Vom Wert innerhalb einer geöffneten Opportunity zu einer Opportunity, die jemand noch nicht öffnen darf. |
| B – Kundenbetreuung | B1: Datensatzzugriff | B2: Feldzugriff | Von einem bestimmten Supportfall zu einem Wert innerhalb bereits zugänglicher Supportfälle. |
| C – Reserve | C1: Feldzugriff | C2: Datensatzzugriff | Von einer Bearbeitungseinschränkung in Accounts zu einem einzelnen Kontakt eines anderen Teams. |

### A1 – Lernfall: Vertraulicher Wert in einer Opportunity

**EN:** Sales reps can open the opportunities they work on. The company wants only sales managers to see the values stored in the internal margin field. Which level of access should the company control for that requirement?

**DE:** Vertriebsmitarbeitende können die Opportunities öffnen, an denen sie arbeiten. Nur die Vertriebsleitung soll die Werte im Feld für die interne Marge sehen können. Auf welcher Ebene sollte das Unternehmen den Zugriff für diese Anforderung steuern?

- A. Record access — Datensatzzugriff
- B. Field access — Feldzugriff
- C. Object access — Objektzugriff

**Lösung: B.** Die Mitarbeitenden sollen ihre Opportunities weiter öffnen können. Beschränkt werden soll nur die Sichtbarkeit eines bestimmten Werts innerhalb dieser Datensätze. Sprachhinweis: „the values stored in …“ beschreibt den Inhalt, nicht die Opportunity als Ganzes.

### A2 – Folgefall: Opportunity eines anderen Teams

**EN:** A sales rep already works with opportunities in Salesforce. For a joint deal, a manager wants the rep to open the Northwind renewal owned by another team. No other opportunities owned by that team should become visible. Which level of access is relevant?

**DE:** Eine Vertriebsmitarbeiterin arbeitet bereits mit Opportunities in Salesforce. Für ein gemeinsames Geschäft soll sie die vom anderen Team betreute Vertragsverlängerung für Northwind öffnen können. Andere Opportunities dieses Teams sollen nicht sichtbar werden. Welche Zugriffsebene ist hier relevant?

- A. Record access — Datensatzzugriff
- B. Object access — Objektzugriff
- C. Field access — Feldzugriff

**Lösung: A.** Die Anforderung betrifft eine konkrete Opportunity. Die Person arbeitet bereits mit Opportunities, daher geht es nicht um das Objekt insgesamt. **Erwartete Begründung:** „Sie soll genau diese Opportunity öffnen, nicht einen Wert darin sehen oder alle Opportunities des Teams erhalten.“

### B1 – Lernfall: Supportfall eines anderen Teams

**EN:** A support agent can already work with cases assigned to her team. She needs to view case CS-204, which belongs to another team. Other cases from that team should remain hidden. Which level of access is relevant?

**DE:** Eine Supportmitarbeiterin kann bereits mit den Fällen ihres Teams arbeiten. Sie soll den Supportfall CS-204 eines anderen Teams sehen können. Die übrigen Fälle dieses Teams sollen verborgen bleiben. Welche Zugriffsebene ist hier relevant?

- A. Object access — Objektzugriff
- B. Field access — Feldzugriff
- C. Record access — Datensatzzugriff

**Lösung: C.** „case CS-204“ bezeichnet einen einzelnen Datensatz. Der Zugriff auf andere Fälle soll sich nicht ändern.

### B2 – Folgefall: Rückerstattungsbetrag im Support

**EN:** Support staff should keep opening the same cases as before. An internal refund amount entered on those cases should be visible only to supervisors. Which level of access should the company control?

**DE:** Supportmitarbeitende sollen weiterhin dieselben Fälle öffnen können wie bisher. Ein in diesen Fällen erfasster interner Erstattungsbetrag soll nur für Vorgesetzte sichtbar sein. Auf welcher Ebene sollte das Unternehmen den Zugriff steuern?

- A. Field access — Feldzugriff
- B. Record access — Datensatzzugriff
- C. Object access — Objektzugriff

**Lösung: A.** Die Fälle selbst bleiben zugänglich. Die Anforderung betrifft den Betrag darin; die Frage nennt bewusst nicht das Wort „field“. **Erwartete Begründung:** „Die Fälle bleiben dieselben. Nur der darin erfasste Betrag soll für bestimmte Personen sichtbar sein.“

### C1 – Reserve-Lernfall: Lesbar, aber nicht änderbar

**EN:** Account managers should keep editing the accounts they are allowed to work on. They should still see the internal risk rating on those accounts, but only compliance staff should be able to change it. Which level of access is relevant to that restriction?

**DE:** Kundenbetreuende sollen weiterhin die Accounts bearbeiten, auf die sie Zugriff haben. Die interne Risikobewertung in diesen Accounts sollen sie weiter sehen können, aber nur Mitarbeitende aus dem Compliance-Bereich dürfen sie ändern. Welche Zugriffsebene ist für diese Einschränkung relevant?

- A. Object access — Objektzugriff
- B. Record access — Datensatzzugriff
- C. Field access — Feldzugriff

**Lösung: C.** Der Account bleibt bearbeitbar; allein das Ändern der Risikobewertung wird eingeschränkt. Dieser Fall variiert die Tätigkeit: bearbeiten statt nur sehen.

### C2 – Reserve-Folgefall: Ein Kontakt für eine Übergabe

**EN:** A customer success rep can already view contacts assigned to her. For a handover, she must also be able to open Pat Keller’s contact, which is assigned to another team. The rest of that team’s contacts should remain private. Which level of access is relevant?

**DE:** Eine Mitarbeiterin im Customer Success kann bereits die ihr zugewiesenen Kontakte sehen. Für eine Übergabe soll sie zusätzlich den Kontakt von Pat Keller öffnen können, der einem anderen Team zugewiesen ist. Die übrigen Kontakte dieses Teams sollen privat bleiben. Welche Zugriffsebene ist hier relevant?

- A. Field access — Feldzugriff
- B. Record access — Datensatzzugriff
- C. Object access — Objektzugriff

**Lösung: B.** Zugriff auf das Objekt Contact besteht bereits. Die Ausnahme betrifft den einzelnen Kontakt. **Erwartete Begründung:** „Nur der Kontakt von Pat Keller soll zusätzlich geöffnet werden können, nicht die Kontakte des Teams allgemein.“

## 4. Testaufbau und Freigabe

1. **Erst fachlich gegenlesen:** Sind die englische und deutsche Fassung gleichbedeutend? Ist genau eine Zugriffsebene richtig? Verrät der Bildschirm die Antwort vorzeitig? Auflösung und Folgefall vor dem UI-Bau abnehmen.
2. **Zwei Ansichten vergleichen:** Bisheriges Layout und Fallakte zunächst mit identischer Frage, Übersetzung und Auflösung zeigen. So vergleichen wir die Darstellung und nicht einen besseren Text mit einem schlechteren. Der reguläre Ablauf einer Person soll dasselbe Paar nicht in beiden Layouts nacheinander verwenden.
3. **Kleiner Pilot:** Nach Möglichkeit vier bis sechs passende Einsteiger einplanen. Sowohl dem alten als auch dem neuen Layout Teilnehmende zuweisen und die Paare A und B über die Ansichten verteilen, soweit es die Gruppengröße erlaubt. Paar C ist Reserve, keine Pflichtwiederholung. Einen eigenen Durchlauf nur mit Tastatur und einen mit Screenreader durchführen, möglichst mit einer Person, die diesen im Alltag nutzt. Kleine Fallzahlen sind ein Hinweis für die nächste Iteration, kein Nachweis für einen dauerhaften Lerneffekt.
4. **Neutral moderieren:** „Starte die erste Aufgabe“ und für den Folgefall „Was ist deine Antwort und woran erkennst du das?“ Keine Hinweise auf „Feld“, „Datensatz“ oder das relevante Wort geben. Pro Person notieren: selbst gestartet, Übersetzung genutzt, Auflösung gefunden, Folgeantwort korrekt, Begründung fachlich passend, Hilfe erforderlich. Keine personenbezogenen Angaben nötig.
5. **Begründung auswerten:** „Richtig und begründet“ bedeutet korrekte Ebene plus Bezug zum konkreten Fall. Eine richtige Wahl ohne Bezug zum Szenario, eine Antwort erst nach Hinweis oder ein bloßer Begriff wie „Datensatz“ reicht nicht. Antworten nach Übersetzung separat notieren, nicht mit dem ersten Versuch vermischen.

**Vorgeschlagene Pilot-Freigabe:** Mindestens zwei voneinander unabhängige Personen finden im neuen Layout ohne Moderationshilfe den Einstieg, verstehen die Auflösung und lösen den englischen Folgefall mit plausibler Begründung. Keine wiederholte kritische Verwechslung und kein blockierender Tastatur- oder Screenreader-Befund. Das ist eine Mindestbedingung für die nächste Umsetzungsetappe, kein statistischer Vergleich. Wenn beide Layouts gleich gut funktionieren, die einfachere Lösung bevorzugen oder gezielt die Wirkung der sprachlichen Erklärung separat testen. Wenn der Einstieg funktioniert, der Folgefall aber scheitert, zuerst Erklärung und Fragenpaar prüfen, nicht das Dashboard neu gestalten.

## 5. Entscheidungen vor dem Bau der weiteren Bereiche

### Pfadwechsel, Verlauf und „Heute“

- Fachlich identische Aufgaben behalten eine gemeinsame Aufgaben-ID. Bewertete Antworten und fällige Wiederholungen werden bei geteilten Aufgaben nicht dupliziert. Im aktiven Pfad erscheinen nur Aufgaben, die diesem Pfad zugeordnet sind. Der Verlauf bleibt erhalten; eine zweifelhafte Übereinstimmung im Altbestand nicht automatisch zusammenführen.
- Offene reguläre Einheiten bleiben je Pfad gespeichert. Beim Wechsel bleibt der bisherige Entwurf im alten Pfad; „Heute“ zeigt nur die Aktion des aktiven Pfads. Beim expliziten Verwerfen vorher klar sagen, welche offenen Antworten verloren gehen; bereits gespeicherte frühere Leistungen werden nicht gelöscht.
- Hauptaktion auf „Heute“: fortsetzbare Lerneinheit → erster Fall des aktiven Pfads → fällige Wiederholungen → neuer Fall. Wenn das Zeitbudget die nächste Übung ausschließt, Ursache und Handlung anbieten („Zeitbudget anpassen“ oder „Ohne Zeitfilter anzeigen“). Keine Streaks und keine leeren Kennzahlen.

### Üben und Filter

- „Fehler wiederholen“ zeigt Aufgaben, deren **letzte gewertete Antwort falsch** war. Eine spätere richtige Antwort entfernt die Aufgabe aus diesem Filter. Unbeantwortete oder verworfene Aufgaben gelten nicht als gewertet. Geplante Wiederholungen sind davon getrennt.
- Thema, Fehlerstatus und Englisch-Niveau lassen sich kombinieren; Schnellwahlen verändern nur ihre eigene Dimension. Bei null Treffern relevante aktive Filter zeigen und eine Änderung anbieten, die tatsächlich Treffer liefern kann. Ohne bisherige Fehler auf thematisches Üben verweisen.

### Mini-Test: Zeit, Wertung und Ergebnis

- Standard: 10 fest ausgewählte Fragen, 10 Minuten, Englisch, keine deutsche Hilfe oder Auflösung bis zum Ergebnis und keine Pause. Nicht starten, wenn weniger als 10 geeignete Fragen vorhanden sind. Kein offizielles Prüfungsformat und keine Aussage zur Prüfungsreife.
- Ein Neuladen darf einen offenen Versuch vor Ablauf wiederherstellen, aber mit derselben Frist und den bereits gespeicherten Antworten. Nach Ablauf automatisch auswerten, beim nächsten Öffnen auf das Ergebnis führen. Explizit abbrechen oder während des Versuchs den Pfad wechseln nur nach Bestätigung: Der Versuch wird verworfen, nicht bewertet und nicht fortgesetzt. Kein Neustart des Timers durch Schließen der Ansicht.
- Pro Frage höchstens ein Punkt; bei späteren Mehrfachauswahlfragen zählt nur die exakt korrekte Auswahl, keine Teilpunkte. Nenner sind alle 10 Fragen. Unbeantwortete Fragen bringen null Punkte und werden separat ausgewiesen, nicht als falsche Antworten in „Fehler wiederholen“ übernommen. Beispiel: „7 von 10 richtig · 2 falsch · 1 unbeantwortet“.
- Kein Bestehenslabel und zunächst keine interne Schwelle. Abschluss dezent würdigen, nicht die Punktzahl als „bestanden“ feiern. Standardaktion: „Antworten überprüfen“. Nur bei mindestens zwei falschen Antworten im selben Thema und bekannter Themenstichprobe eine deskriptive Beobachtung hervorheben, z. B. „In diesem Versuch: 2 von 3 Fragen zu Berechtigungen falsch“. Bei Gleichstand oder dünner Stichprobe keine einzelne Schwäche behaupten. Aus falschen Antworten keine Sprachursache ableiten.

### Sicherheitseinschätzung, Sprache und Feinschliff

- Im Prototyp keine Sicherheitseinschätzung; die bestehende Funktion der produktiven App bleibt unverändert. Vor jeder Änderung prüfen, ob und wie die aktuelle Skala gespeicherte Bewertungen, Wiederholungstermine oder Empfehlungen beeinflusst. Ohne konkreten Nutzen: Weglassen prüfen. Mit Nutzen: optionale Stufen „Geraten · Unsicher · Sicher“ vor der Auflösung testen; keine automatische Umrechnung alter Werte ohne geprüfte Regel.
- Kein separater Beginner-Modus. „Wiederholungen“, „Prüfungsthema“ und „Englisch-Niveau“ verwenden; technische Details optional erklären. Tastaturbedienung, Fokus und statusunabhängige Textlabels sind Pflicht, Icons erst bei nachgewiesenem Orientierungsproblem.

## 6. Reihenfolge und Definition of Done

| Schritt | Ergebnis, bevor es weitergeht |
|---|---|
| 1. Redaktion | Fragenpaare und Lösungsschlüssel fachlich und sprachlich gegengelesen. |
| 2. Browser-Prototyp | Ein Pfad, ein Thema, vollständiger Durchlauf mit getrennten Testdaten; Tastatur und Screenreader ohne Blocker. |
| 3. Pilot und Überarbeitung | Beobachtungen ausgewertet; Entscheidung dokumentiert: beibehalten, ändern oder günstigeres Layout wählen. |
| 4. Pfadwahl und „Heute“ | Zustände für falsche Pfadwahl, Wiedereinstieg, Verwerfen, Wiederholungen und Zeitbudget durchgespielt. |
| 5. Üben und Mini-Test | Kombinierbare Filter, verständliche Nulltreffer, Ablauf- und Abbruchfälle sowie ehrliche Auswertung geprüft. |
| 6. Ausrollen | Bestand in geeignete Fälle, zu überarbeitende Fälle und kurze Wissensfragen eingeteilt. Nur geeignete Fälle übernehmen; bestehende Lernstände und Termine nicht unbeabsichtigt ändern. |

**Nächster konkreter Arbeitsschritt:** Paar A fachlich prüfen und den Durchlauf auf Mobil- und Desktopbreite im Browser bauen. Erst nach dem Pilot die übrigen Ansichten umbauen.

[data-model]: https://trailhead.salesforce.com/content/learn/modules/cert-prep-salesforce-certified-associate/study-up-on-the-data-model
[fields]: https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields
[records]: https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records
