# Fall A2: Zugriff auf eine bestimmte Opportunity

**Status:** Spezifikation für den Browser-Prototyp, noch nicht umgesetzt.  
**Einordnung:** Platform Foundations → Data Model → Datensichtbarkeit.  
**Position:** Zweiter Fall des Standardpaars A. Er folgt auf A1 „Vertraulicher Wert in einer Opportunity“. Dieses Dokument spezifiziert A2 als eigenen Bildschirm, einschließlich Inhalten, Verhalten, Test und Abnahme.

## 1. Lernziel und Abgrenzung

In Fall A1 konnten die Vertriebsmitarbeitenden ihre Opportunities bereits öffnen. Die Anforderung betraf einen Wert **innerhalb** dieser Datensätze. In A2 hat die Vertriebsmitarbeiterin grundsätzlich Zugang zu Opportunities, benötigt aber Zugriff auf **eine bestimmte Opportunity** eines anderen Teams. Der Gegenstand der Entscheidung wechselt vom Feld zum Datensatz.

**Erfolgsfrage:** Erkennt die Person in der englischen Aufgabenstellung eigenständig, dass sie einen einzelnen Datensatz öffnen soll? Kann sie auf Deutsch oder Englisch erklären, woran sie das erkennt?

Die Aufgabe fragt ausdrücklich nach der **Zugriffsebene**, nicht nach einer Freigaberegel, einem Permission Set oder einer konkreten Änderung im Setup. Salesforce unterscheidet zwei Ebenen, die hier gegeneinander abgegrenzt werden: Zugriff auf einzelne Datensätze und Zugriff auf Felder. [Trailhead: Datensatzzugriff][records] · [Trailhead: Feldzugriff][fields]

## 2. Aufgabeninhalt für die App

### Vor der Antwort: sichtbare Oberfläche

**Fortschritt:** `Frage 2 von 2`  
**Neutrale Überschrift:** `Gemeinsames Geschäft`  
**Hinweis:** `Wähle eine Antwort.`

Die redaktionelle Überschrift dieses Dokuments, das Lernziel und die Lösung werden vor der Antwort **nicht** angezeigt. Die englische Frage steht im Mittelpunkt; die deutsche Fassung ist über „Deutsch anzeigen“ abrufbar.

### Englisch – Standardansicht

> A sales rep already works with opportunities in Salesforce. For a joint deal, a manager wants the rep to open the Northwind renewal owned by another team. No other opportunities owned by that team should become visible. Which level of access is relevant?

| Position | Antwort |
|---|---|
| A | Record access |
| B | Object access |
| C | Field access |

### Deutsch – auf Abruf

> Eine Vertriebsmitarbeiterin arbeitet bereits mit Opportunities in Salesforce. Für ein gemeinsames Geschäft soll sie die Opportunity zur Vertragsverlängerung von Northwind öffnen können. Diese gehört einem anderen Team. Dessen übrige Opportunities sollen für sie nicht sichtbar werden. Welche Zugriffsebene ist hier relevant?

| Position | Antwort |
|---|---|
| A | Datensatzzugriff |
| B | Objektzugriff |
| C | Feldzugriff |

Die Übersetzung lässt sich öffnen und schließen, ohne die Antwortauswahl zu verlieren. Sie übersetzt den Fall vollständig, markiert aber vor der Antwort keine Schlüsselformulierung.

### Nach der Antwort: Lösung und Rückmeldung

**Richtig:** A – `Record access / Datensatzzugriff`.

> Die Mitarbeiterin arbeitet bereits mit Opportunities. Neu ist nur, dass sie die Opportunity zur Vertragsverlängerung von Northwind öffnen können soll. Die übrigen Opportunities des Teams bleiben verborgen. Die Anforderung betrifft somit einen einzelnen Datensatz – nicht das Opportunity-Objekt insgesamt und nicht einen Wert innerhalb einer Opportunity.

| Gewählte Antwort | Kurze Rückmeldung |
|---|---|
| A · Record access | „Richtig. Die Anforderung betrifft genau eine Opportunity.“ |
| B · Object access | „Nicht ganz. Sie arbeitet bereits mit Opportunities. Es geht darum, welche einzelne Opportunity sie zusätzlich öffnen kann.“ |
| C · Field access | „Nicht ganz. Sie soll eine Opportunity öffnen können. Die Aufgabe beschränkt oder erweitert nicht den Zugriff auf einen Wert in einem Feld.“ |

Im Bildschirm erscheint **eine** Erklärung. Bei B oder C kann der jeweilige Rückmeldungssatz die zentrale Erklärung einleiten; er ist kein zusätzliches Kartenmodul. Ein kurzer Sprachhinweis ist optional: „open the Northwind renewal“ meint hier das Öffnen dieser konkreten Opportunity. Entscheidend ist der Bezug im ganzen Satz, nicht das isolierte Verb „open“.

**Abschlussaktion:** `Einheit abschließen`. Anschließend: „Du hast in zwei Vertriebsfällen zwischen Feldzugriff und Datensatzzugriff unterschieden.“ Keine Aussage über Prüfungsreife oder die Ursache einer falschen Antwort.

## 3. Warum A2 als Folgefall funktioniert

| Merkmal | A1: vertrauliche Marge | A2: Northwind-Verlängerung |
|---|---|---|
| Gemeinsamer Rahmen | Opportunities im Vertrieb | Opportunities im Vertrieb |
| Was jemand tun soll | Einen bestimmten Wert sehen dürfen | Eine bestimmte Opportunity öffnen dürfen |
| Was sich nicht ändert | Die bestehenden Opportunities bleiben zugänglich | Die übrigen Opportunities des anderen Teams bleiben unzugänglich |
| Richtige Ebene | Feldzugriff | Datensatzzugriff |
| Richtige Position | B | A |

Die begründete Antwort auf A2 muss auf den konkreten Fall eingehen. Akzeptable Beispiele:

- „Sie soll nur die Northwind-Opportunity öffnen. Die anderen bleiben unsichtbar.“
- „Sie hat schon Zugriff auf Opportunities. Jetzt geht es um diesen einen Datensatz.“
- “She already works with opportunities and only needs to open this one.”

Nicht ausreichend sind „A“, „Datensatz“, „weil da Opportunity steht“ oder „weil da *open* steht“. Opportunity und das Öffnen kamen bereits im Lernfall vor. Sie sind für sich genommen keine Entscheidungshilfe.

## 4. Ablauf und Bedienung

1. Nach der Auflösung von A1 öffnet „Nächsten Fall öffnen“ A2. Fokus auf die Aufgabenüberschrift; Fortschritt lautet „Frage 2 von 2“.
2. Die drei Antworten sind als zusammengehörige Einzelwahl bedienbar. „Antwort prüfen“ wertet erst nach expliziter Aktivierung. Fehlt eine Auswahl, erscheint der Text „Wähle eine Antwort“ und der Fokus führt zur Auswahl zurück.
3. Nach der Prüfung sieht die Person, welche Antwort sie gewählt hat, welche richtig ist und warum. Die Rückmeldung muss auch ohne Farbe verständlich sein und darf beim Wechsel nicht unbemerkt bleiben.
4. Die gewertete Antwort wird im Prototyp nicht überschrieben. Ein absichtlicher neuer Durchlauf ist ein neuer Versuch. Für den Test zählt die erste abgegebene Antwort.
5. Auf schmalen Bildschirmen stehen Auflösung und Abschlussaktion unter der Aufgabe. Die Reihenfolge am Bildschirm entspricht der Tastatur- und Lesereihenfolge. In der englischen Frage und den englischen Antwortoptionen die Sprache semantisch als Englisch kennzeichnen; Übersetzung und Bedienelemente bleiben deutsch.
6. A2 gehört zum geführten Prototyp, **nicht** zum zeitgesteuerten Mini-Test. Kein Timer, keine Sicherheitsskala, keine neue Wiederholungslogik und keine Übernahme der Testantworten in den produktiven Lernstand.

## 5. Pilot: prüfen, ob sich die Entscheidung übertragen lässt

**Standardablauf:** A1 mit seiner Auflösung bearbeiten, dann A2 im selben Layout. Keine zweite Runde mit demselben Paar für dieselbe Person im anderen Layout. Bei einem Vergleich zwischen bisheriger Ansicht und Fallakte bleiben Frage, Reihenfolge der Optionen, Übersetzung und Auflösung identisch. Werden verschiedene Paare eingesetzt, die Paare nicht jeweils nur einem Layout zuordnen.

**Neutrale Moderation:** „Welche Antwort wählst du und woran erkennst du das?“ Im Pilot um einen ersten Versuch ohne Übersetzung bitten, sofern die Person dazu bereit ist. Wird die Übersetzung schon vorher benötigt, nicht sperren: als unterstützt erfassen und separat auswerten. Die Begründung wird im Versuch vor der Auflösung erfasst, nicht nachträglich aus dem Feedback abgeleitet. In der App selbst keine zusätzliche Pflichttexteingabe einbauen.

| Beobachtung | Einstufung |
|---|---|
| Richtige Ebene, konkreter Bezug zu Northwind oder zum gezielten Zugriff auf einen einzelnen Datensatz, ohne Hilfe | Unabhängig gelöst und begründet |
| Richtige Ebene, aber nur Antwortwort, Buchstabe oder isoliertes Signalwort genannt | Richtig gewählt, Verständnis nicht gezeigt |
| Richtige Ebene und plausible Begründung erst nach Übersetzung oder Hinweis | Unterstützt gelöst; Art der Hilfe separat notieren |
| Falsche Ebene oder keine nachvollziehbare Einordnung | Transfer in diesem Durchlauf nicht gezeigt; keine Sprach- oder Wissensdiagnose ableiten |

**Beobachtungsbogen:** `Layout | Fallpaar | Übersetzung vor Antwort (ja/nein) | erste Antwort | Begründung sinngemäß | Moderationshilfe | Einstufung | Bedienhindernis`. Keine personenbezogenen Daten nötig.

Wenn mehrere Personen „Object access“ wählen, zuerst prüfen, ob die englische und deutsche Fassung klar machen, dass die Person bereits mit Opportunities arbeitet. Wenn „Field access“ überwiegt, A1-Auflösung und A2-Begründungen prüfen: Wurde der Unterschied zwischen dem Wert und dem ganzen Datensatz verstanden? Nicht automatisch den Folgefall durch stärkeres Hervorheben der Lösung vereinfachen.

## 6. Abnahme vor dem nächsten Umsetzungsschritt

- [ ] A2 ist fachlich eindeutig und die deutsche Fassung ändert nicht die Anforderung.
- [ ] Titel, Themenanzeige und Übersetzung verraten die Zugriffsebene nicht vor der Antwort.
- [ ] Nach dem Wechsel von A1 wird „Frage 2 von 2“ verständlich angezeigt und vorgelesen.
- [ ] Auswahl, Übersetzung, Prüfen und Abschließen funktionieren auf Mobilgeräten und mit Tastatur; Screenreader lesen Auswahl und Rückmeldung nachvollziehbar.
- [ ] Die gewertete Antwort bleibt beim Öffnen und Schließen der Übersetzung erhalten; Testdaten bleiben getrennt von produktiven Lernständen.
- [ ] Im Pilot werden richtige Antworten mit und ohne plausible Begründung getrennt erfasst. Für die Freigabe des neuen Layouts zeigen mindestens zwei unabhängige Personen im Pilot den Transfer ohne Moderationshilfe; ein kleiner Pilot ist kein Nachweis für dauerhaften Lernerfolg.

**Nächster Arbeitsschritt:** A1 und A2 fachlich gemeinsam gegenlesen, dann beide im selben Browser-Durchlauf testen. A2 ist eigenständig spezifiziert, aber sein Wert als Folgefall lässt sich erst zusammen mit A1 beurteilen.

[records]: https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records
[fields]: https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields
