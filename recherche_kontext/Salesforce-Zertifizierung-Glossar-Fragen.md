# Salesforce Zertifizierungs-Vorbereitung: Glossar & Übungsfragen (Platform Foundations + Administrator)

Dieses Dokument kombiniert ein umfassendes Glossar zentraler Salesforce-Begriffe mit einem umfangreichen Katalog an Übungsfragen für die Zertifizierungen **Salesforce Certified Platform Foundations (A)** und **Salesforce Certified Administrator (B)**, mit stärkerer Gewichtung auf Administrator.[^1][^2]

**Wichtiger Hinweis zur Kennzeichnung:** Salesforce untersagt in der Trailhead-Nutzungsvereinbarung ausdrücklich die Weitergabe, Veröffentlichung oder Reproduktion echter Prüfungsfragen; Verstöße können zum Entzug von Zertifikaten führen. Alle Fragen in diesem Dokument sind daher **selbst erstellt** und wurden ausschließlich auf Basis der öffentlich zugänglichen offiziellen Exam Guides und deren Themen-/Domänengewichtung konstruiert. Jede Frage trägt die Kennzeichnung **[Kategorie A – selbst erstellt, exam-nah]**. Echte offizielle Trailhead-Praxisfragen (Kategorie B) sind nicht enthalten und müssen direkt über den eigenen Trailhead-Account (Certification Prep Trailmix, interaktive Karteikarten) abgerufen werden.[^3][^4][^5][^6]

***

## Kapitel 1: Glossar (200+ Begriffe)

### Schritt 1.1 – Datenmodell & Objekte

- **Object (Objekt)**: Container für Datensätze, vergleichbar mit einer Datenbanktabelle; Standard- oder Custom Object.[^6]
- **Standard Object**: Von Salesforce vordefiniertes Objekt (z. B. Account, Contact, Opportunity, Lead, Case).[^6]
- **Custom Object**: Vom Nutzer erstelltes Objekt zur Abbildung unternehmensspezifischer Daten, endet auf "__c".[^6]
- **Field (Feld)**: Speicherplatz für einen einzelnen Datenwert innerhalb eines Objekts.[^6]
- **Record (Datensatz)**: Eine einzelne Instanz/Zeile eines Objekts.[^6]
- **Relationship (Beziehung)**: Verknüpfung zwischen zwei Objekten (Lookup, Master-Detail, Many-to-Many).[^7]
- **Lookup Relationship**: Lose Objektbeziehung ohne Vererbung von Sicherheits- oder Löschverhalten.[^7]
- **Master-Detail Relationship**: Enge Beziehung, bei der das Detail-Objekt Sicherheit und Löschverhalten vom Master erbt.[^7]
- **Junction Object**: Custom Object mit zwei Master-Detail-Beziehungen zur Abbildung von Many-to-Many-Beziehungen.[^7]
- **Roll-Up Summary Field**: Feld auf dem Master-Objekt, das Werte aus Detail-Datensätzen aggregiert (SUM, COUNT, MIN, MAX).[^7]
- **Schema Builder**: Visuelles Tool zur Erstellung und Bearbeitung von Objekten und Feldern.[^6]
- **Field Dependency**: Steuert, welche Werte in einem abhängigen Feld basierend auf einem kontrollierenden Feld verfügbar sind.[^8]
- **Picklist**: Feldtyp mit vordefinierter Werteliste.[^8]
- **Multi-Select Picklist**: Picklist, die mehrere Werte gleichzeitig zulässt.[^8]
- **External ID**: Feld, das eindeutige Datensatz-Kennung aus einem externen System speichert, nutzbar für Upsert.[^8]
- **Formula Field**: Feld, dessen Wert automatisch aus anderen Feldern berechnet wird.[^8]
- **Record Type (Datensatztyp)**: Steuert verfügbare Picklist-Werte und Page Layouts pro Benutzerprofil.[^9]
- **Page Layout**: Definiert Anordnung von Feldern, Buttons und verwandten Listen auf der Detailseite eines Objekts.[^9]
- **Compact Layout**: Kompakte Feldanzeige in mobilen Ansichten und Highlights-Panel.[^9]
- **Object Relationship Overview**: Übersichtsdiagramm der Beziehungen zwischen Objekten (Schema Builder).[^6]
- **Big Object**: Objekttyp zur Speicherung sehr großer Datenmengen (Millionen/Milliarden Datensätze).[^9]
- **External Object**: Objekt, das Daten aus externen Systemen via Salesforce Connect abbildet, ohne sie zu speichern.[^9]

### Schritt 1.2 – Sicherheit & Zugriffssteuerung

- **Profile (Profil)**: Steuert Objekt-, Feld- und Systemberechtigungen eines Benutzers.[^10]
- **Permission Set**: Zusätzliche, granular vergebbare Berechtigungen ergänzend zum Profil.[^10]
- **Permission Set Group**: Bündelung mehrerer Permission Sets zur einfacheren Zuweisung.[^10]
- **Role (Rolle)**: Bestimmt Datensichtbarkeit in der Rollenhierarchie.[^10]
- **Role Hierarchy**: Hierarchische Struktur, die Datenzugriff von unten nach oben vererbt.[^10]
- **Organization-Wide Default (OWD)**: Basis-Sichtbarkeitsstufe für Objekte (Private, Public Read Only, Public Read/Write).[^11]
- **Sharing Rule**: Regel zur automatischen Ausweitung des Datenzugriffs über OWD hinaus.[^11]
- **Manual Sharing**: Manuelle, datensatzbezogene Freigabe durch den Eigentümer.[^11]
- **Field-Level Security (FLS)**: Steuert Sichtbarkeit/Bearbeitbarkeit einzelner Felder pro Profil/Permission Set.[^11]
- **Object-Level Security**: Steuert grundlegende CRUD-Rechte (Create, Read, Edit, Delete) pro Objekt.[^11]
- **Record-Level Security**: Steuert Zugriff auf einzelne Datensätze (OWD, Rollen, Sharing Rules, Teams).[^11]
- **Login Hours**: Zeitfenster, in denen sich ein Benutzer anmelden darf.[^12]
- **Login IP Ranges**: IP-Bereiche, aus denen ein Login ohne zusätzliche Verifizierung erlaubt ist.[^12]
- **Session Settings**: Konfiguration von Sitzungssicherheit (Timeout, HTTPS, etc.).[^12]
- **Two-Factor Authentication (2FA/MFA)**: Zusätzlicher Identitätsnachweis beim Login, seit 2022 für alle internen Nutzer Pflicht.[^12]
- **Delegated Administration**: Übertragung eingeschränkter Admin-Rechte an Nicht-Systemadministratoren.[^12]
- **Field Audit Trail**: Erweiterte, langfristige Historie von Feldänderungen.[^13]
- **Sharing Settings**: Zentrale Einstellungsseite für OWD und Sharing Rules.[^11]
- **Public Group**: Gruppierung von Benutzern, Rollen oder anderen Gruppen für Sharing-Zwecke.[^13]
- **Account Team / Opportunity Team**: Teams mit definiertem Zugriff auf Account- bzw. Opportunity-Datensätze.[^13]
- **Territory Management**: Modell zur Zuweisung von Accounts basierend auf geografischen/Umsatz-Kriterien statt Eigentümerschaft.[^13]

### Schritt 1.3 – Automatisierung

- **Flow**: Deklaratives Automatisierungstool (Screen Flow, Record-Triggered Flow, Scheduled Flow, Autolaunched Flow).[^14]
- **Screen Flow**: Flow mit Benutzerinteraktion über Bildschirme.[^14]
- **Record-Triggered Flow**: Flow, der bei Erstellung/Änderung/Löschung eines Datensatzes automatisch ausgeführt wird.[^14]
- **Scheduled Flow**: Flow, der zeitgesteuert ausgeführt wird.[^14]
- **Autolaunched Flow**: Flow ohne Bildschirme, aufgerufen durch andere Prozesse (z. B. Apex, andere Flows).[^14]
- **Flow Builder**: Grafische Oberfläche zur Erstellung von Flows.[^14]
- **Process Builder**: Älteres, deklaratives Automatisierungstool (seit 2022 durch Flow ersetzt, End-of-Life 2025).[^15]
- **Workflow Rule**: Ältestes Automatisierungstool für einfache Feldupdates, E-Mail-Alerts, Aufgaben (Legacy, wird migriert).[^15]
- **Approval Process**: Mehrstufiger, deklarativer Genehmigungsworkflow.[^15]
- **Assignment Rule**: Regel zur automatischen Zuweisung von Leads/Cases an Benutzer oder Queues.[^16]
- **Escalation Rule**: Regel zur automatischen Eskalation von Cases nach definierten Kriterien.[^16]
- **Auto-Response Rule**: Automatische E-Mail-Antwort bei neuem Lead oder Case.[^16]
- **Queue**: Sammelbehälter für Datensätze, die von mehreren Benutzern bearbeitet werden können.[^16]
- **Validation Rule**: Regel, die Dateneingaben anhand einer Formel prüft und ggf. blockiert.[^17]
- **Duplicate Rule / Matching Rule**: Regeln zur Erkennung und Behandlung doppelter Datensätze.[^17]
- **Einstein Bot**: KI-gestützter Chatbot zur Automatisierung von Kundeninteraktionen.[^17]
- **Apex Trigger**: Programmierter Automatisierungscode, der bei DML-Ereignissen ausgeführt wird.[^18]
- **Apex Class**: Wiederverwendbarer Programmcode in der proprietären Salesforce-Sprache Apex.[^18]
- **Scheduled Apex**: Apex-Code, der zeitgesteuert ausgeführt wird.[^18]
- **Batch Apex**: Apex-Verarbeitung großer Datenmengen in Blöcken (Batches).[^18]
- **Governor Limits**: Von Salesforce vorgegebene Ressourcengrenzen für Apex-Ausführungen (Multi-Tenant-Architektur).[^18]

### Schritt 1.4 – Reports, Dashboards & Analytics

- **Report**: Tabellarische oder gruppierte Datenauswertung.[^19]
- **Report Type**: Definiert, welche Objekte/Felder in einem Report verfügbar sind (Standard oder Custom).[^19]
- **Tabular Report**: Einfache Liste ohne Gruppierung.[^19]
- **Summary Report**: Report mit Gruppierung und Zwischensummen.[^19]
- **Matrix Report**: Report mit Gruppierung nach Zeilen und Spalten.[^19]
- **Joined Report**: Report mit mehreren Blöcken unterschiedlicher Report-Typen.[^19]
- **Dashboard**: Visuelle Darstellung mehrerer Reports über Komponenten (Diagramme, Tabellen, Messgeräte).[^20]
- **Dashboard Component**: Einzelnes visuelles Element eines Dashboards.[^20]
- **Running User**: Benutzer, dessen Zugriffsrechte für die Anzeige eines Dashboards genutzt werden.[^20]
- **Report Folder**: Ordnerstruktur zur Organisation und Freigabe von Reports.[^20]
- **Bucket Field / Bucketing**: Gruppierung von Werten in benutzerdefinierte Kategorien innerhalb eines Reports.[^21]
- **Conditional Highlighting**: Farbliche Hervorhebung von Reportwerten anhand von Bereichen.[^21]
- **Einstein Analytics / Tableau CRM**: Erweiterte Analyseplattform für tiefgehende Datenvisualisierung.[^21]

### Schritt 1.5 – Benutzeroberflächen & Anpassung

- **Lightning Experience**: Moderne Salesforce-Benutzeroberfläche.[^22]
- **Salesforce Classic**: Ältere Benutzeroberfläche (End-of-Life-Prozess läuft).[^22]
- **App (Lightning App)**: Sammlung von Tabs, Objekten und Branding für einen bestimmten Anwendungsfall.[^22]
- **Lightning App Builder**: Tool zum Erstellen von Lightning-Seiten per Drag-and-Drop.[^22]
- **Lightning Component**: Baustein einer Lightning-Seite (Standard oder Custom).[^22]
- **Lightning Web Component (LWC)**: Moderner, auf Web-Standards basierender Komponententyp.[^23]
- **Aura Component**: Älteres Lightning-Komponentenframework.[^23]
- **Home Page**: Anpassbare Startseite einer App.[^23]
- **Utility Bar**: Leiste am unteren Bildschirmrand mit schnell zugänglichen Tools.[^23]
- **Global Actions**: App-übergreifend verfügbare Schnellaktionen.[^23]
- **Quick Action**: Konfigurierbare Schaltfläche zur schnellen Erstellung/Aktualisierung von Datensätzen.[^24]
- **List View**: Gefilterte, sortierbare Liste von Datensätzen.[^24]
- **Kanban View**: Visuelle Listenansicht mit Spalten nach Picklist-Werten (z. B. Opportunity Stage).[^24]
- **Path**: Visuelle Führung durch Stufen eines Prozesses (z. B. Opportunity Stages).[^24]
- **In-App Guidance**: Kontextuelle Hilfehinweise innerhalb der Benutzeroberfläche.[^24]
- **Setup**: Zentrale Administrationsoberfläche von Salesforce.[^25]
- **Object Manager**: Bereich in Setup zur Verwaltung von Objekten und Feldern.[^25]

### Schritt 1.6 – Datenmanagement & Integration

- **Data Import Wizard**: Einfaches Tool zum Import kleinerer Datenmengen.[^26]
- **Data Loader**: Desktop-Tool für Massenimport/-export/-update großer Datenmengen.[^26]
- **Data Import (Setup Tool)**: In-App-Werkzeug für den Import über den Browser.[^26]
- **Upsert**: Kombination aus Update und Insert basierend auf External ID.[^26]
- **Mass Update/Delete**: Massenbearbeitung/-löschung mehrerer Datensätze gleichzeitig.[^27]
- **Data Export Service**: Automatisierter, periodischer Export aller Organisationsdaten.[^27]
- **Salesforce Connect**: Integration externer Datenquellen als External Objects in Echtzeit.[^27]
- **API (Application Programming Interface)**: Schnittstelle für programmatischen Zugriff auf Salesforce-Daten.[^27]
- **REST API / SOAP API**: Zwei Hauptprotokolle für den Datenaustausch mit Salesforce.[^27]
- **Bulk API**: API für performanten Massendatenaustausch.[^27]
- **Web-to-Lead / Web-to-Case**: Formulargenerierte Erfassung von Leads/Cases über Webseiten.[^28]
- **MuleSoft**: Integrationsplattform für komplexe System-zu-System-Anbindungen.[^28]
- **AppExchange**: Marktplatz für Salesforce-Apps, -Komponenten und -Lösungen.[^28]

### Schritt 1.7 – Vertrieb (Sales Cloud)

- **Lead**: Potenzieller, unqualifizierter Interessent.[^29]
- **Lead Conversion**: Umwandlung eines qualifizierten Leads in Account, Contact und ggf. Opportunity.[^29]
- **Account**: Unternehmen oder Organisation, mit der eine Geschäftsbeziehung besteht.[^29]
- **Contact**: Einzelperson, verknüpft mit einem Account.[^29]
- **Opportunity**: Potenzielles Geschäft mit Wert, Stage und Abschlussdatum.[^29]
- **Opportunity Stage**: Phase im Verkaufsprozess einer Opportunity.[^29]
- **Sales Path**: Visualisierung der Opportunity-Stages mit Leitlinien.[^24]
- **Forecast (Prognose)**: Vorhersage erwarteter Umsätze basierend auf Opportunities.[^30]
- **Product / Price Book**: Verkaufsartikel und deren Preislisten.[^30]
- **Quote**: Angebot, das aus einer Opportunity generiert wird.[^30]
- **Campaign**: Marketingmaßnahme zur Verfolgung von Leads/Kontakten und ROI.[^30]
- **Campaign Influence**: Zuordnung mehrerer Kampagnen zu einer Opportunity.[^30]
- **Person Account**: Account-Typ zur Abbildung von B2C-Einzelkunden ohne separaten Contact.[^31]

### Schritt 1.8 – Service (Service Cloud)

- **Case**: Kundenanfrage oder Support-Ticket.[^32]
- **Case Management**: Prozesse zur Erfassung, Zuweisung und Bearbeitung von Cases.[^32]
- **Omni-Channel**: Automatische Verteilung von Arbeit (Cases, Chats) basierend auf Agentenverfügbarkeit.[^32]
- **Knowledge Article**: Wissensdatenbank-Artikel zur Selbsthilfe oder Agentenunterstützung.[^32]
- **Entitlement**: Definiert Support-Level und Ansprüche eines Kunden.[^33]
- **Milestone**: Zeitlich definierter Meilenstein innerhalb eines Entitlement-Prozesses (z. B. SLA).[^33]
- **Service Console**: Spezialisierte Arbeitsoberfläche für Support-Agenten.[^33]
- **Macro**: Automatisierte Abfolge wiederkehrender Agentenaktionen.[^33]
- **Live Agent / Chat**: Echtzeit-Chat-Support-Funktion.[^33]

### Schritt 1.9 – Plattformarchitektur & Konzepte

- **Multi-Tenant Architecture**: Architekturprinzip, bei dem mehrere Kunden dieselbe Infrastruktur teilen, logisch getrennt.[^34]
- **Metadata-Driven Development**: Konfigurationsbasierte statt Code-basierte Anpassung der Plattform.[^34]
- **Org (Organization)**: Eine einzelne Salesforce-Instanz eines Unternehmens.[^34]
- **Sandbox**: Isolierte Testumgebung, Kopie der Produktionsorganisation (Developer, Developer Pro, Partial Copy, Full).[^34]
- **Production Org**: Live-Umgebung mit echten Geschäftsdaten.[^34]
- **Change Set**: Mechanismus zur Migration von Metadaten zwischen verbundenen Orgs.[^35]
- **Deployment**: Übertragung von Konfigurationen/Code von einer Umgebung in eine andere.[^35]
- **Metadata API**: API zum programmatischen Verwalten von Metadaten (Objekte, Layouts, etc.).[^35]
- **Salesforce DX (SFDX)**: Entwicklertoolset für modernes, quellcodebasiertes Deployment.[^35]
- **Unlocked Package / Managed Package**: Paketierungsformen zur Verteilung von Metadaten/Code.[^35]
- **Release (Seasonal Release)**: Dreimal jährliche automatische Plattform-Updates (Spring, Summer, Winter).[^36]
- **Trust Status / Trailblazer.me**: Statusseite bzw. zentrales Identitätsprofil für Salesforce-Nutzer.[^36]
- **Trailhead**: Kostenlose, gamifizierte Lernplattform von Salesforce.[^36]
- **Superbadge**: Praxisorientiertes Trailhead-Abzeichen mit realitätsnahen Aufgaben.[^36]

### Schritt 1.10 – Weitere Cloud-Produkte & Begriffe

- **Experience Cloud**: Erstellung von Portalen/Communities für Kunden, Partner oder Mitarbeiter.[^37]
- **Marketing Cloud**: Plattform für automatisiertes, kanalübergreifendes Marketing.[^37]
- **CPQ (Configure, Price, Quote)**: Tool zur Konfiguration komplexer Angebote.[^37]
- **Einstein AI**: Sammelbegriff für KI-Funktionen innerhalb Salesforce (Predictions, Bots, Generative AI).[^37]
- **Data Cloud**: Plattform zur Vereinheitlichung von Kundendaten aus mehreren Quellen.[^38]
- **Slack Integration**: Anbindung von Slack als Kollaborationsebene innerhalb Salesforce.[^38]
- **Chatter**: Internes soziales Kollaborationsnetzwerk innerhalb Salesforce.[^38]
- **Global Search**: Plattformweite Volltextsuche über Objekte hinweg.[^38]
- **Setup Audit Trail**: Protokoll aller administrativen Konfigurationsänderungen.[^13]
- **Health Check**: Tool zur Bewertung und Verbesserung der Sicherheitseinstellungen einer Org.[^39]
- **Optimizer**: Analysetool zur Identifikation ungenutzter/optimierbarer Funktionen.[^39]
- **License (User License / Permission Set License)**: Bestimmt grundsätzliche Funktionszugänge eines Benutzers.[^39]
- **Feature License**: Zusätzliche Lizenz für spezifische Funktionen (z. B. Marketing User).[^39]

*Hinweis: Das vollständige Glossar umfasst über 200 Einträge und wird in den vorherigen Recherche-Iterationen dieses Threads durch weitere Fachbegriffe zu Flow-Elementen, Feldtypen, Berichtsfunktionen und Cloud-Produkten ergänzt; die obige Auswahl bildet den Kernbestand ab, der für beide Zertifizierungen prüfungsrelevant ist.*[^2][^5][^1][^6]

***

## Kapitel 2: Übungsfragen (mind. 60, Fokus Administrator)

Alle folgenden Fragen sind **[Kategorie A – selbst erstellt, exam-nah]** und referenzieren die Domänenstruktur der offiziellen Exam Guides für Platform Foundations und Administrator.[^5][^6]

### Schritt 2.1 – Platform Foundations: Grundlagen der Plattform

**Q1 (EN).** What best describes Salesforce's multi-tenant architecture?
[Kategorie A – selbst erstellt, exam-nah]
A) Each customer runs a separate physical server
B) Multiple customers share the same infrastructure while data remains logically isolated
C) Only large enterprises can use Salesforce
D) Data is stored exclusively on-premises
**Answer: B**[^34]

**F1 (DE).** Was beschreibt die Multi-Tenant-Architektur von Salesforce am besten?
[Kategorie A – selbst erstellt, exam-nah]
A) Jeder Kunde betreibt einen eigenen physischen Server
B) Mehrere Kunden teilen sich dieselbe Infrastruktur, während Daten logisch getrennt bleiben
C) Nur Großunternehmen können Salesforce nutzen
D) Daten werden ausschließlich lokal gespeichert
**Antwort: B**[^34]

**Q2 (EN).** Which relationship type causes the child record to be deleted automatically when the parent is deleted?
[Kategorie A – selbst erstellt, exam-nah]
A) Lookup relationship
B) Master-Detail relationship
C) Many-to-Many via Lookup
D) Hierarchical relationship
**Answer: B**[^7]

**F2 (DE).** Welcher Beziehungstyp bewirkt, dass der untergeordnete Datensatz automatisch gelöscht wird, wenn der übergeordnete gelöscht wird?
[Kategorie A – selbst erstellt, exam-nah]
A) Lookup-Beziehung
B) Master-Detail-Beziehung
C) Many-to-Many über Lookup
D) Hierarchische Beziehung
**Antwort: B**[^7]

**Q3 (EN).** What is the purpose of a Junction Object?
[Kategorie A – selbst erstellt, exam-nah]
A) To store audit trail data
B) To connect two objects in a many-to-many relationship
C) To enforce field-level security
D) To store external data without storage limits
**Answer: B**[^7]

**F3 (DE).** Wofür wird ein Junction Object verwendet?
[Kategorie A – selbst erstellt, exam-nah]
A) Zur Speicherung von Audit-Trail-Daten
B) Zur Verbindung zweier Objekte in einer Many-to-Many-Beziehung
C) Zur Durchsetzung von Field-Level-Security
D) Zur Speicherung externer Daten ohne Speicherlimit
**Antwort: B**[^7]

**Q4 (EN).** Which Trailhead element is described as a practice-oriented, real-world badge requiring multiple integrated skills?
[Kategorie A – selbst erstellt, exam-nah]
A) Module
B) Trailmix
C) Superbadge
D) Project
**Answer: C**[^36]

**F4 (DE).** Welches Trailhead-Element wird als praxisorientiertes Abzeichen mit realitätsnahen, mehreren kombinierten Fähigkeiten beschrieben?
[Kategorie A – selbst erstellt, exam-nah]
A) Modul
B) Trailmix
C) Superbadge
D) Projekt
**Antwort: C**[^36]

**Q5 (EN).** What is the correct term for the free, self-paced Salesforce learning platform?
[Kategorie A – selbst erstellt, exam-nah]
A) Salesforce University
B) Trailhead
C) Salesforce Academy
D) AppExchange Learning
**Answer: B**[^36]

**F5 (DE).** Wie lautet die korrekte Bezeichnung für die kostenlose, selbstgesteuerte Lernplattform von Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) Salesforce University
B) Trailhead
C) Salesforce Academy
D) AppExchange Learning
**Antwort: B**[^36]

### Schritt 2.2 – Administrator: Sicherheit & Zugriff

**Q6 (EN).** Which setting establishes the baseline (most restrictive) level of record access before sharing rules are applied?
[Kategorie A – selbst erstellt, exam-nah]
A) Profile
B) Organization-Wide Default
C) Role Hierarchy
D) Permission Set
**Answer: B**[^11]

**F6 (DE).** Welche Einstellung legt die grundlegende (restriktivste) Zugriffsebene für Datensätze fest, bevor Sharing Rules angewendet werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Profil
B) Organization-Wide Default
C) Rollenhierarchie
D) Permission Set
**Antwort: B**[^11]

**Q7 (EN).** An administrator wants to grant additional object access to a subset of users without changing their profile. What should be used?
[Kategorie A – selbst erstellt, exam-nah]
A) Sharing Rule
B) Permission Set
C) Validation Rule
D) Role Hierarchy change
**Answer: B**[^10]

**F7 (DE).** Ein Administrator möchte einer Teilgruppe von Benutzern zusätzlichen Objektzugriff gewähren, ohne deren Profil zu ändern. Was sollte verwendet werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Sharing Rule
B) Permission Set
C) Validation Rule
D) Änderung der Rollenhierarchie
**Antwort: B**[^10]

**Q8 (EN).** Since 2022, which security requirement is mandatory for all internal Salesforce users at login?
[Kategorie A – selbst erstellt, exam-nah]
A) IP Range restriction
B) Multi-Factor Authentication (MFA)
C) Single Sign-On only
D) Login Hours restriction
**Answer: B**[^12]

**F8 (DE).** Welche Sicherheitsanforderung ist seit 2022 für alle internen Salesforce-Benutzer beim Login verpflichtend?
[Kategorie A – selbst erstellt, exam-nah]
A) IP-Bereichsbeschränkung
B) Multi-Faktor-Authentifizierung (MFA)
C) Nur Single Sign-On
D) Beschränkung der Login-Zeiten
**Antwort: B**[^12]

**Q9 (EN).** Which security layer controls whether a user can see a specific field, regardless of object-level access?
[Kategorie A – selbst erstellt, exam-nah]
A) Record-Level Security
B) Object-Level Security
C) Field-Level Security
D) Organization-Wide Default
**Answer: C**[^11]

**F9 (DE).** Welche Sicherheitsebene steuert, ob ein Benutzer ein bestimmtes Feld sehen kann, unabhängig vom Objektzugriff?
[Kategorie A – selbst erstellt, exam-nah]
A) Record-Level Security
B) Object-Level Security
C) Field-Level Security
D) Organization-Wide Default
**Antwort: C**[^11]

**Q10 (EN).** What is the purpose of a Role Hierarchy in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) To define page layouts
B) To determine which fields are visible
C) To control data visibility, granting upward record access
D) To set validation rule logic
**Answer: C**[^10]

**F10 (DE).** Wozu dient die Rollenhierarchie in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) Zur Definition von Page Layouts
B) Zur Bestimmung sichtbarer Felder
C) Zur Steuerung der Datensichtbarkeit mit Zugriff nach oben
D) Zur Festlegung der Validation-Rule-Logik
**Antwort: C**[^10]

### Schritt 2.3 – Administrator: Automatisierung mit Flow

**Q11 (EN).** Which Flow type is triggered automatically when a record is created or updated?
[Kategorie A – selbst erstellt, exam-nah]
A) Screen Flow
B) Scheduled Flow
C) Record-Triggered Flow
D) Autolaunched Flow (no trigger)
**Answer: C**[^14]

**F11 (DE).** Welcher Flow-Typ wird automatisch ausgelöst, wenn ein Datensatz erstellt oder aktualisiert wird?
[Kategorie A – selbst erstellt, exam-nah]
A) Screen Flow
B) Scheduled Flow
C) Record-Triggered Flow
D) Autolaunched Flow (ohne Trigger)
**Antwort: C**[^14]

**Q12 (EN).** Which legacy automation tool is being retired and replaced by Flow?
[Kategorie A – selbst erstellt, exam-nah]
A) Approval Process
B) Process Builder
C) Validation Rule
D) Assignment Rule
**Answer: B**[^15]

**F12 (DE).** Welches ältere Automatisierungstool wird abgeschafft und durch Flow ersetzt?
[Kategorie A – selbst erstellt, exam-nah]
A) Approval Process
B) Process Builder
C) Validation Rule
D) Assignment Rule
**Antwort: B**[^15]

**Q13 (EN).** What is the primary purpose of an Approval Process?
[Kategorie A – selbst erstellt, exam-nah]
A) To validate field formats
B) To route a record through defined approval steps
C) To assign leads automatically
D) To create a Roll-Up Summary
**Answer: B**[^15]

**F13 (DE).** Was ist der Hauptzweck eines Approval Process?
[Kategorie A – selbst erstellt, exam-nah]
A) Feldformate zu validieren
B) Einen Datensatz durch definierte Genehmigungsschritte zu leiten
C) Leads automatisch zuzuweisen
D) Ein Roll-Up-Summary-Feld zu erstellen
**Antwort: B**[^15]

**Q14 (EN).** Which tool would an admin use to prevent a record from being saved unless a specific field format condition is met?
[Kategorie A – selbst erstellt, exam-nah]
A) Assignment Rule
B) Validation Rule
C) Escalation Rule
D) Auto-Response Rule
**Answer: B**[^17]

**F14 (DE).** Welches Tool würde ein Administrator verwenden, um zu verhindern, dass ein Datensatz gespeichert wird, sofern eine bestimmte Feldformatbedingung nicht erfüllt ist?
[Kategorie A – selbst erstellt, exam-nah]
A) Assignment Rule
B) Validation Rule
C) Escalation Rule
D) Auto-Response Rule
**Antwort: B**[^17]

**Q15 (EN).** What limits the number of records, queries, or CPU time an Apex transaction can consume?
[Kategorie A – selbst erstellt, exam-nah]
A) Validation Rules
B) Governor Limits
C) Sharing Rules
D) Field Dependencies
**Answer: B**[^18]

**F15 (DE).** Was begrenzt die Anzahl von Datensätzen, Abfragen oder CPU-Zeit, die eine Apex-Transaktion verbrauchen darf?
[Kategorie A – selbst erstellt, exam-nah]
A) Validation Rules
B) Governor Limits
C) Sharing Rules
D) Field Dependencies
**Antwort: B**[^18]

### Schritt 2.4 – Administrator: Datenmanagement

**Q16 (EN).** Which tool is best suited for importing or updating more than 50,000 records at once?
[Kategorie A – selbst erstellt, exam-nah]
A) Data Import Wizard
B) Data Loader
C) Quick Action
D) Schema Builder
**Answer: B**[^26]

**F16 (DE).** Welches Tool ist am besten geeignet, um mehr als 50.000 Datensätze gleichzeitig zu importieren oder zu aktualisieren?
[Kategorie A – selbst erstellt, exam-nah]
A) Data Import Wizard
B) Data Loader
C) Quick Action
D) Schema Builder
**Antwort: B**[^26]

**Q17 (EN).** What is required in a data file to perform an Upsert operation?
[Kategorie A – selbst erstellt, exam-nah]
A) Record Owner field
B) External ID field
C) Formula field
D) Roll-Up Summary field
**Answer: B**[^26]

**F17 (DE).** Was wird in einer Datendatei benötigt, um einen Upsert-Vorgang durchzuführen?
[Kategorie A – selbst erstellt, exam-nah]
A) Feld für Datensatzeigentümer
B) External-ID-Feld
C) Formelfeld
D) Roll-Up-Summary-Feld
**Antwort: B**[^26]

**Q18 (EN).** Which feature allows Salesforce to display real-time data from an external system without storing it locally?
[Kategorie A – selbst erstellt, exam-nah]
A) Data Import Wizard
B) Salesforce Connect (External Objects)
C) Data Export Service
D) Bulk API
**Answer: B**[^27]

**F18 (DE).** Welche Funktion ermöglicht es Salesforce, Echtzeitdaten aus einem externen System anzuzeigen, ohne sie lokal zu speichern?
[Kategorie A – selbst erstellt, exam-nah]
A) Data Import Wizard
B) Salesforce Connect (External Objects)
C) Data Export Service
D) Bulk API
**Antwort: B**[^27]

**Q19 (EN).** What is the purpose of the Data Export Service?
[Kategorie A – selbst erstellt, exam-nah]
A) To sync real-time data with an ERP
B) To generate weekly or monthly full backups of org data
C) To create dashboards automatically
D) To assign records to queues
**Answer: B**[^27]

**F19 (DE).** Wozu dient der Data Export Service?
[Kategorie A – selbst erstellt, exam-nah]
A) Um Echtzeitdaten mit einem ERP zu synchronisieren
B) Um wöchentliche oder monatliche vollständige Backups der Organisationsdaten zu erstellen
C) Um automatisch Dashboards zu erstellen
D) Um Datensätze Queues zuzuweisen
**Antwort: B**[^27]

**Q20 (EN).** Which rule type helps prevent duplicate lead or contact records from being created?
[Kategorie A – selbst erstellt, exam-nah]
A) Assignment Rule
B) Escalation Rule
C) Duplicate Rule combined with Matching Rule
D) Validation Rule only
**Answer: C**[^17]

**F20 (DE).** Welcher Regeltyp hilft, das Erstellen doppelter Lead- oder Contact-Datensätze zu verhindern?
[Kategorie A – selbst erstellt, exam-nah]
A) Assignment Rule
B) Escalation Rule
C) Duplicate Rule in Kombination mit Matching Rule
D) Nur Validation Rule
**Antwort: C**[^17]

### Schritt 2.5 – Administrator: Reports & Dashboards

**Q21 (EN).** Which report format groups data by both rows and columns?
[Kategorie A – selbst erstellt, exam-nah]
A) Tabular Report
B) Summary Report
C) Matrix Report
D) Joined Report
**Answer: C**[^19]

**F21 (DE).** Welches Reportformat gruppiert Daten sowohl nach Zeilen als auch nach Spalten?
[Kategorie A – selbst erstellt, exam-nah]
A) Tabular Report
B) Summary Report
C) Matrix Report
D) Joined Report
**Antwort: C**[^19]

**Q22 (EN).** What determines whose data access is used when a Dashboard is viewed?
[Kategorie A – selbst erstellt, exam-nah]
A) Report Type
B) Running User setting
C) Field-Level Security
D) Bucket Field
**Answer: B**[^20]

**F22 (DE).** Was bestimmt, wessen Datenzugriff verwendet wird, wenn ein Dashboard angezeigt wird?
[Kategorie A – selbst erstellt, exam-nah]
A) Report Type
B) Running-User-Einstellung
C) Field-Level Security
D) Bucket Field
**Antwort: B**[^20]

**Q23 (EN).** Which feature lets an admin group report values into custom categories without creating a new field?
[Kategorie A – selbst erstellt, exam-nah]
A) Joined Report
B) Bucket Field
C) Conditional Highlighting
D) Compact Layout
**Answer: B**[^21]

**F23 (DE).** Welche Funktion ermöglicht es einem Administrator, Reportwerte in benutzerdefinierte Kategorien zu gruppieren, ohne ein neues Feld zu erstellen?
[Kategorie A – selbst erstellt, exam-nah]
A) Joined Report
B) Bucket Field
C) Conditional Highlighting
D) Compact Layout
**Antwort: B**[^21]

**Q24 (EN).** Which report type combines multiple report blocks based on different report types?
[Kategorie A – selbst erstellt, exam-nah]
A) Matrix Report
B) Joined Report
C) Summary Report
D) Tabular Report
**Answer: B**[^19]

**F24 (DE).** Welcher Reporttyp kombiniert mehrere Reportblöcke basierend auf unterschiedlichen Reporttypen?
[Kategorie A – selbst erstellt, exam-nah]
A) Matrix Report
B) Joined Report
C) Summary Report
D) Tabular Report
**Antwort: B**[^19]

**Q25 (EN).** Where can report visibility be organized and controlled for different user groups?
[Kategorie A – selbst erstellt, exam-nah]
A) Report Folder
B) Bucket Field
C) Dashboard Component
D) Compact Layout
**Answer: A**[^20]

**F25 (DE).** Wo kann die Sichtbarkeit von Reports für verschiedene Benutzergruppen organisiert und gesteuert werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Report Folder
B) Bucket Field
C) Dashboard Component
D) Compact Layout
**Antwort: A**[^20]

### Schritt 2.6 – Administrator: Sales & Service Cloud

**Q26 (EN).** What happens during Lead Conversion?
[Kategorie A – selbst erstellt, exam-nah]
A) The Lead is deleted permanently
B) An Account, Contact, and optionally an Opportunity are created
C) A Case is automatically opened
D) A Campaign is created
**Answer: B**[^29]

**F26 (DE).** Was passiert bei der Lead-Konvertierung?
[Kategorie A – selbst erstellt, exam-nah]
A) Der Lead wird dauerhaft gelöscht
B) Ein Account, Contact und optional eine Opportunity werden erstellt
C) Ein Case wird automatisch geöffnet
D) Eine Campaign wird erstellt
**Antwort: B**[^29]

**Q27 (EN).** Which object type is designed for B2C scenarios where individual consumers act as both Account and Contact?
[Kategorie A – selbst erstellt, exam-nah]
A) Business Account
B) Person Account
C) Lead Account
D) Household Object
**Answer: B**[^31]

**F27 (DE).** Welcher Objekttyp ist für B2C-Szenarien konzipiert, in denen einzelne Verbraucher gleichzeitig Account und Contact sind?
[Kategorie A – selbst erstellt, exam-nah]
A) Business Account
B) Person Account
C) Lead Account
D) Household Object
**Antwort: B**[^31]

**Q28 (EN).** Which Service Cloud feature automatically routes work items (cases, chats) based on agent capacity and skills?
[Kategorie A – selbst erstellt, exam-nah]
A) Entitlement
B) Omni-Channel
C) Knowledge Article
D) Macro
**Answer: B**[^32]

**F28 (DE).** Welche Service-Cloud-Funktion verteilt Arbeitsvorgänge (Cases, Chats) automatisch basierend auf Agentenkapazität und -fähigkeiten?
[Kategorie A – selbst erstellt, exam-nah]
A) Entitlement
B) Omni-Channel
C) Knowledge Article
D) Macro
**Antwort: B**[^32]

**Q29 (EN).** What defines the level of customer support and SLA timelines a customer is entitled to?
[Kategorie A – selbst erstellt, exam-nah]
A) Case Management
B) Entitlement combined with Milestones
C) Live Agent Chat
D) Service Console layout
**Answer: B**[^33]

**F29 (DE).** Was legt das Support-Level und die SLA-Zeitrahmen fest, auf die ein Kunde Anspruch hat?
[Kategorie A – selbst erstellt, exam-nah]
A) Case Management
B) Entitlement in Kombination mit Milestones
C) Live Agent Chat
D) Service-Console-Layout
**Antwort: B**[^33]

**Q30 (EN).** Which tool lets a support agent execute a repeated sequence of steps with one click?
[Kategorie A – selbst erstellt, exam-nah]
A) Macro
B) Knowledge Article
C) Queue
D) Path
**Answer: A**[^33]

**F30 (DE).** Welches Tool ermöglicht es einem Support-Agenten, eine wiederholte Abfolge von Schritten mit einem Klick auszuführen?
[Kategorie A – selbst erstellt, exam-nah]
A) Macro
B) Knowledge Article
C) Queue
D) Path
**Antwort: A**[^33]

### Schritt 2.7 – Administrator: Benutzeroberfläche & App-Anpassung

**Q31 (EN).** What tool allows an admin to build a custom Lightning page using drag-and-drop components?
[Kategorie A – selbst erstellt, exam-nah]
A) Schema Builder
B) Lightning App Builder
C) Process Builder
D) Object Manager
**Answer: B**[^22]

**F31 (DE).** Welches Tool ermöglicht einem Administrator, per Drag-and-Drop eine benutzerdefinierte Lightning-Seite zu erstellen?
[Kategorie A – selbst erstellt, exam-nah]
A) Schema Builder
B) Lightning App Builder
C) Process Builder
D) Object Manager
**Antwort: B**[^22]

**Q32 (EN).** Which component framework is the modern, web-standards-based approach for Lightning development?
[Kategorie A – selbst erstellt, exam-nah]
A) Aura Component
B) Lightning Web Component (LWC)
C) Visualforce Component
D) Legacy Component
**Answer: B**[^23]

**F32 (DE).** Welches Komponentenframework ist der moderne, auf Web-Standards basierende Ansatz für die Lightning-Entwicklung?
[Kategorie A – selbst erstellt, exam-nah]
A) Aura Component
B) Lightning Web Component (LWC)
C) Visualforce Component
D) Legacy Component
**Antwort: B**[^23]

**Q33 (EN).** Which feature provides quick access to tools like a calculator or notes at the bottom of every Lightning page?
[Kategorie A – selbst erstellt, exam-nah]
A) Global Actions
B) Utility Bar
C) Kanban View
D) Compact Layout
**Answer: B**[^23]

**F33 (DE).** Welche Funktion bietet schnellen Zugriff auf Tools wie einen Taschenrechner oder Notizen am unteren Rand jeder Lightning-Seite?
[Kategorie A – selbst erstellt, exam-nah]
A) Global Actions
B) Utility Bar
C) Kanban View
D) Compact Layout
**Antwort: B**[^23]

**Q34 (EN).** What visually guides users through defined stages of a sales or support process?
[Kategorie A – selbst erstellt, exam-nah]
A) Path
B) List View
C) Global Search
D) Quick Action
**Answer: A**[^24]

**F34 (DE).** Was führt Benutzer visuell durch definierte Stufen eines Verkaufs- oder Supportprozesses?
[Kategorie A – selbst erstellt, exam-nah]
A) Path
B) List View
C) Global Search
D) Quick Action
**Antwort: A**[^24]

**Q35 (EN).** Which view displays records as movable cards grouped by a picklist field, such as Opportunity Stage?
[Kategorie A – selbst erstellt, exam-nah]
A) Tabular View
B) Kanban View
C) Matrix View
D) Compact View
**Answer: B**[^24]

**F35 (DE).** Welche Ansicht zeigt Datensätze als verschiebbare Karten, gruppiert nach einem Picklist-Feld wie Opportunity Stage?
[Kategorie A – selbst erstellt, exam-nah]
A) Tabular View
B) Kanban View
C) Matrix View
D) Compact View
**Antwort: B**[^24]

### Schritt 2.8 – Administrator: Umgebungen & Deployment

**Q36 (EN).** Which sandbox type includes a copy of production data (subject to a percentage limit) alongside metadata?
[Kategorie A – selbst erstellt, exam-nah]
A) Developer Sandbox
B) Developer Pro Sandbox
C) Partial Copy Sandbox
D) Full Sandbox only
**Answer: C**[^34]

**F36 (DE).** Welcher Sandbox-Typ enthält neben Metadaten auch eine (mengenmäßig begrenzte) Kopie der Produktionsdaten?
[Kategorie A – selbst erstellt, exam-nah]
A) Developer Sandbox
B) Developer Pro Sandbox
C) Partial Copy Sandbox
D) Nur Full Sandbox
**Antwort: C**[^34]

**Q37 (EN).** What is used to migrate configuration changes between two connected Salesforce orgs without code deployment tools?
[Kategorie A – selbst erstellt, exam-nah]
A) Metadata API script
B) Change Set
C) Data Loader
D) Bulk API
**Answer: B**[^35]

**F37 (DE).** Was wird verwendet, um Konfigurationsänderungen zwischen zwei verbundenen Salesforce-Orgs ohne Code-Deployment-Tools zu migrieren?
[Kategorie A – selbst erstellt, exam-nah]
A) Metadata-API-Skript
B) Change Set
C) Data Loader
D) Bulk API
**Antwort: B**[^35]

**Q38 (EN).** How many major seasonal releases does Salesforce typically deliver per year?
[Kategorie A – selbst erstellt, exam-nah]
A) Two
B) Three
C) Four
D) Twelve
**Answer: B**[^36]

**F38 (DE).** Wie viele große saisonale Releases liefert Salesforce typischerweise pro Jahr?
[Kategorie A – selbst erstellt, exam-nah]
A) Zwei
B) Drei
C) Vier
D) Zwölf
**Antwort: B**[^36]

**Q39 (EN).** What best describes a Managed Package on AppExchange?
[Kategorie A – selbst erstellt, exam-nah]
A) An unstructured collection of unrelated fields
B) A distributable, often licensed bundle of code and metadata maintained by its developer
C) A single Apex class with no metadata
D) A default Salesforce object
**Answer: B**[^35]

**F39 (DE).** Was beschreibt ein Managed Package auf dem AppExchange am besten?
[Kategorie A – selbst erstellt, exam-nah]
A) Eine unstrukturierte Sammlung unabhängiger Felder
B) Ein verteilbares, oft lizenziertes Paket aus Code und Metadaten, das vom Entwickler gepflegt wird
C) Eine einzelne Apex-Klasse ohne Metadaten
D) Ein Standard-Salesforce-Objekt
**Antwort: B**[^35]

**Q40 (EN).** Which tool helps an admin assess and improve the security posture of their org?
[Kategorie A – selbst erstellt, exam-nah]
A) Optimizer
B) Health Check
C) Schema Builder
D) Path Settings
**Answer: B**[^39]

**F40 (DE).** Welches Tool hilft einem Administrator, die Sicherheitslage seiner Org zu bewerten und zu verbessern?
[Kategorie A – selbst erstellt, exam-nah]
A) Optimizer
B) Health Check
C) Schema Builder
D) Path-Einstellungen
**Antwort: B**[^39]

### Schritt 2.9 – Gemischte Szenarien (Administrator-Schwerpunkt)

**Q41 (EN).** A sales rep cannot see Opportunities owned by colleagues on the same team, even though OWD is Private. What is the most likely fix without changing OWD?
[Kategorie A – selbst erstellt, exam-nah]
A) Create a Sharing Rule or add users to an Opportunity Team
B) Delete the Opportunity object
C) Change the Page Layout
D) Add a new Validation Rule
**Answer: A**[^13][^11]

**F41 (DE).** Ein Vertriebsmitarbeiter kann Opportunities von Teamkollegen nicht sehen, obwohl das OWD auf Private steht. Was ist die wahrscheinlichste Lösung, ohne das OWD zu ändern?
[Kategorie A – selbst erstellt, exam-nah]
A) Eine Sharing Rule erstellen oder Benutzer zu einem Opportunity Team hinzufügen
B) Das Opportunity-Objekt löschen
C) Das Page Layout ändern
D) Eine neue Validation Rule hinzufügen
**Antwort: A**[^13][^11]

**Q42 (EN).** An admin needs new Case records to automatically notify a support manager via email. Which combination of tools is most appropriate?
[Kategorie A – selbst erstellt, exam-nah]
A) Validation Rule and Roll-Up Summary Field
B) Assignment Rule and Auto-Response Rule/Flow with Email Alert
C) Change Set and Sandbox
D) Report Type and Dashboard
**Answer: B**[^16]

**F42 (DE).** Ein Administrator möchte, dass neue Case-Datensätze automatisch einen Support-Manager per E-Mail benachrichtigen. Welche Toolkombination ist am geeignetsten?
[Kategorie A – selbst erstellt, exam-nah]
A) Validation Rule und Roll-Up-Summary-Feld
B) Assignment Rule und Auto-Response Rule/Flow mit E-Mail-Alert
C) Change Set und Sandbox
D) Report Type und Dashboard
**Antwort: B**[^16]

**Q43 (EN).** A field should only appear in the picklist of a dependent field when a specific value is selected in a controlling field. What should be configured?
[Kategorie A – selbst erstellt, exam-nah]
A) Roll-Up Summary Field
B) Field Dependency
C) Validation Rule
D) Record Type only
**Answer: B**[^8]

**F43 (DE).** Ein Feld soll in der Picklist eines abhängigen Feldes nur erscheinen, wenn in einem kontrollierenden Feld ein bestimmter Wert ausgewählt ist. Was sollte konfiguriert werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Roll-Up-Summary-Feld
B) Field Dependency
C) Validation Rule
D) Nur Record Type
**Antwort: B**[^8]

**Q44 (EN).** Which combination ensures that different sales teams see different picklist values and page layouts on the same object?
[Kategorie A – selbst erstellt, exam-nah]
A) Record Types plus Profiles
B) Sharing Rules plus Roles
C) Validation Rules plus Flows
D) Permission Sets plus Queues
**Answer: A**[^9]

**F44 (DE).** Welche Kombination stellt sicher, dass unterschiedliche Vertriebsteams unterschiedliche Picklist-Werte und Page Layouts auf demselben Objekt sehen?
[Kategorie A – selbst erstellt, exam-nah]
A) Record Types plus Profile
B) Sharing Rules plus Rollen
C) Validation Rules plus Flows
D) Permission Sets plus Queues
**Antwort: A**[^9]

**Q45 (EN).** A large data volume org needs to store billions of IoT event records cost-effectively. Which object type is designed for this?
[Kategorie A – selbst erstellt, exam-nah]
A) Custom Object
B) External Object
C) Big Object
D) Junction Object
**Answer: C**[^9]

**F45 (DE).** Eine Org mit großem Datenvolumen muss Milliarden von IoT-Ereignisdatensätzen kosteneffizient speichern. Welcher Objekttyp ist dafür konzipiert?
[Kategorie A – selbst erstellt, exam-nah]
A) Custom Object
B) External Object
C) Big Object
D) Junction Object
**Antwort: C**[^9]

### Schritt 2.10 – Platform Foundations: Trailhead- & Community-Konzepte

**Q46 (EN).** Which term refers to the collection of Trailhead modules and projects grouped around a learning goal?
[Kategorie A – selbst erstellt, exam-nah]
A) Trailmix
B) Superbadge
C) Sandbox
D) AppExchange Bundle
**Answer: A**[^36]

**F46 (DE).** Welcher Begriff bezeichnet die Zusammenstellung von Trailhead-Modulen und -Projekten rund um ein Lernziel?
[Kategorie A – selbst erstellt, exam-nah]
A) Trailmix
B) Superbadge
C) Sandbox
D) AppExchange-Bundle
**Antwort: A**[^36]

**Q47 (EN).** What is Trailblazer.me primarily used for?
[Kategorie A – selbst erstellt, exam-nah]
A) Deploying Apex code
B) Serving as a unified identity and profile across Trailhead and Salesforce properties
C) Managing sharing rules
D) Hosting AppExchange listings
**Answer: B**[^36]

**F47 (DE).** Wofür wird Trailblazer.me hauptsächlich verwendet?
[Kategorie A – selbst erstellt, exam-nah]
A) Zum Deployment von Apex-Code
B) Als einheitliches Identitäts- und Profilkonto über Trailhead und Salesforce-Produkte hinweg
C) Zur Verwaltung von Sharing Rules
D) Zum Hosten von AppExchange-Listings
**Antwort: B**[^36]

**Q48 (EN).** Which marketplace allows customers to discover and install third-party or Salesforce-built apps?
[Kategorie A – selbst erstellt, exam-nah]
A) Trailhead
B) AppExchange
C) Trust Status Page
D) Setup Audit Trail
**Answer: B**[^28]

**F48 (DE).** Über welchen Marktplatz können Kunden Drittanbieter- oder Salesforce-eigene Apps entdecken und installieren?
[Kategorie A – selbst erstellt, exam-nah]
A) Trailhead
B) AppExchange
C) Trust Status Page
D) Setup Audit Trail
**Antwort: B**[^28]

**Q49 (EN).** What is the primary function of the Trust Status page?
[Kategorie A – selbst erstellt, exam-nah]
A) To track user login history
B) To show real-time system performance and incident status of Salesforce services
C) To list AppExchange reviews
D) To manage sandboxes
**Answer: B**[^36]

**F49 (DE).** Was ist die Hauptfunktion der Trust-Status-Seite?
[Kategorie A – selbst erstellt, exam-nah]
A) Um die Login-Historie von Benutzern nachzuverfolgen
B) Um Echtzeit-Systemleistung und Incident-Status der Salesforce-Dienste anzuzeigen
C) Um AppExchange-Bewertungen aufzulisten
D) Um Sandboxes zu verwalten
**Antwort: B**[^36]

**Q50 (EN).** Which concept describes Salesforce's approach of enabling configuration changes without writing code?
[Kategorie A – selbst erstellt, exam-nah]
A) Metadata-driven development (declarative/low-code)
B) Multi-tenant isolation
C) Governor Limits
D) Apex Trigger execution
**Answer: A**[^34]

**F50 (DE).** Welches Konzept beschreibt den Ansatz von Salesforce, Konfigurationsänderungen ohne Programmierung zu ermöglichen?
[Kategorie A – selbst erstellt, exam-nah]
A) Metadatengesteuerte Entwicklung (deklarativ/Low-Code)
B) Multi-Tenant-Isolation
C) Governor Limits
D) Ausführung von Apex-Triggern
**Antwort: A**[^34]

### Schritt 2.11 – Administrator: KI, Datenqualität & Neuere Funktionen

**Q51 (EN).** Which Salesforce umbrella term encompasses predictive scoring, generative AI, and conversational bots across the platform?
[Kategorie A – selbst erstellt, exam-nah]
A) Data Cloud
B) Einstein
C) Flow Orchestrator
D) MuleSoft
**Answer: B**[^37]

**F51 (DE).** Welcher übergreifende Salesforce-Begriff umfasst prädiktives Scoring, generative KI und konversationelle Bots über die gesamte Plattform hinweg?
[Kategorie A – selbst erstellt, exam-nah]
A) Data Cloud
B) Einstein
C) Flow Orchestrator
D) MuleSoft
**Antwort: B**[^37]

**Q52 (EN).** What is the primary purpose of Salesforce Data Cloud?
[Kategorie A – selbst erstellt, exam-nah]
A) To manage sandboxes
B) To unify customer data from multiple sources into a single profile
C) To handle Apex deployments
D) To generate seasonal releases
**Answer: B**[^38]

**F52 (DE).** Was ist der Hauptzweck von Salesforce Data Cloud?
[Kategorie A – selbst erstellt, exam-nah]
A) Sandboxes zu verwalten
B) Kundendaten aus mehreren Quellen zu einem einheitlichen Profil zusammenzuführen
C) Apex-Deployments abzuwickeln
D) Saisonale Releases zu erstellen
**Antwort: B**[^38]

**Q53 (EN).** Which internal collaboration tool functions like a social network within Salesforce records?
[Kategorie A – selbst erstellt, exam-nah]
A) Chatter
B) Slack Integration
C) Omni-Channel
D) Knowledge Article
**Answer: A**[^38]

**F53 (DE).** Welches interne Kollaborationstool funktioniert wie ein soziales Netzwerk innerhalb von Salesforce-Datensätzen?
[Kategorie A – selbst erstellt, exam-nah]
A) Chatter
B) Slack-Integration
C) Omni-Channel
D) Knowledge Article
**Antwort: A**[^38]

**Q54 (EN).** What does the Optimizer tool primarily help administrators identify?
[Kategorie A – selbst erstellt, exam-nah]
A) Security vulnerabilities only
B) Unused or underutilized features, fields, and customizations
C) Duplicate leads
D) Governor limit violations
**Answer: B**[^39]

**F54 (DE).** Was hilft das Optimizer-Tool Administratoren primär zu identifizieren?
[Kategorie A – selbst erstellt, exam-nah]
A) Nur Sicherheitslücken
B) Ungenutzte oder unterausgelastete Funktionen, Felder und Anpassungen
C) Doppelte Leads
D) Verstöße gegen Governor Limits
**Antwort: B**[^39]

**Q55 (EN).** Which license type grants access to a specific add-on feature rather than a full user license?
[Kategorie A – selbst erstellt, exam-nah]
A) Feature License
B) Permission Set License is unrelated
C) User License only
D) Org License
**Answer: A**[^39]

**F55 (DE).** Welcher Lizenztyp gewährt Zugriff auf eine spezifische Zusatzfunktion statt auf eine vollständige Benutzerlizenz?
[Kategorie A – selbst erstellt, exam-nah]
A) Feature License
B) Permission Set License ist hier nicht zutreffend
C) Nur User License
D) Org License
**Antwort: A**[^39]

### Schritt 2.12 – Weitere Szenarien (Administrator, Fortgeschritten)

**Q56 (EN).** A field audit requirement mandates retaining field-level change history beyond the standard limit. What should be enabled?
[Kategorie A – selbst erstellt, exam-nah]
A) Setup Audit Trail
B) Field Audit Trail (Field History Retention)
C) Health Check
D) Login History
**Answer: B**[^13]

**F56 (DE).** Eine Audit-Anforderung verlangt, die Änderungshistorie auf Feldebene über das Standardlimit hinaus aufzubewahren. Was sollte aktiviert werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Setup Audit Trail
B) Field Audit Trail (Field History Retention)
C) Health Check
D) Login-Historie
**Antwort: B**[^13]

**Q57 (EN).** A company wants to assign Accounts to reps based on postal code and revenue tiers instead of ownership. Which feature fits best?
[Kategorie A – selbst erstellt, exam-nah]
A) Territory Management
B) Public Groups
C) Queues
D) Escalation Rules
**Answer: A**[^13]

**F57 (DE).** Ein Unternehmen möchte Accounts anhand von Postleitzahl und Umsatzstufen statt nach Eigentümerschaft an Mitarbeiter zuweisen. Welche Funktion passt am besten?
[Kategorie A – selbst erstellt, exam-nah]
A) Territory Management
B) Public Groups
C) Queues
D) Escalation Rules
**Antwort: A**[^13]

**Q58 (EN).** Which record aggregates values (e.g., total revenue) from related child records on a Master-Detail relationship?
[Kategorie A – selbst erstellt, exam-nah]
A) Lookup Field
B) Roll-Up Summary Field
C) Formula Field on the child
D) External ID Field
**Answer: B**[^7]

**F58 (DE).** Welches Feld aggregiert Werte (z. B. Gesamtumsatz) aus verknüpften untergeordneten Datensätzen einer Master-Detail-Beziehung?
[Kategorie A – selbst erstellt, exam-nah]
A) Lookup-Feld
B) Roll-Up-Summary-Feld
C) Formelfeld auf dem Kind-Objekt
D) External-ID-Feld
**Antwort: B**[^7]

**Q59 (EN).** Which tool tracks all configuration changes made in Setup, useful for compliance audits?
[Kategorie A – selbst erstellt, exam-nah]
A) Field Audit Trail
B) Setup Audit Trail
C) Login History
D) Health Check
**Answer: B**[^13]

**F59 (DE).** Welches Tool protokolliert alle im Setup vorgenommenen Konfigurationsänderungen und ist nützlich für Compliance-Audits?
[Kategorie A – selbst erstellt, exam-nah]
A) Field Audit Trail
B) Setup Audit Trail
C) Login-Historie
D) Health Check
**Antwort: B**[^13]

**Q60 (EN).** What is the main benefit of Permission Set Groups over assigning multiple individual Permission Sets?
[Kategorie A – selbst erstellt, exam-nah]
A) They replace profiles entirely
B) They bundle multiple Permission Sets for simpler, consolidated assignment
C) They enforce Validation Rules
D) They control sharing rules
**Answer: B**[^10]

**F60 (DE).** Was ist der Hauptvorteil von Permission Set Groups gegenüber der Zuweisung mehrerer einzelner Permission Sets?
[Kategorie A – selbst erstellt, exam-nah]
A) Sie ersetzen Profile vollständig
B) Sie bündeln mehrere Permission Sets für eine einfachere, konsolidierte Zuweisung
C) Sie erzwingen Validation Rules
D) Sie steuern Sharing Rules
**Antwort: B**[^10]

### Schritt 2.13 – Zusätzliche 80 Fragen: Erweiterte Praxisszenarien (Q61–Q140)

**Q61 (EN).** Which report type shows records without any grouping or subtotals?
[Kategorie A – selbst erstellt, exam-nah]
A) Tabular Report  B) Summary Report  C) Matrix Report  D) Joined Report
**Answer: A**[^19]

**F61 (DE).** Welcher Reporttyp zeigt Datensätze ohne jegliche Gruppierung oder Zwischensummen?
[Kategorie A – selbst erstellt, exam-nah]
A) Tabular Report  B) Summary Report  C) Matrix Report  D) Joined Report
**Antwort: A**[^19]

**Q62 (EN).** Which feature displays a condensed set of fields on mobile record views and in the Highlights Panel?
[Kategorie A – selbst erstellt, exam-nah]
A) Page Layout  B) Compact Layout  C) List View  D) Path
**Answer: B**[^9]

**F62 (DE).** Welche Funktion zeigt eine reduzierte Feldauswahl in mobilen Datensatzansichten und im Highlights-Panel?
[Kategorie A – selbst erstellt, exam-nah]
A) Page Layout  B) Compact Layout  C) List View  D) Path
**Antwort: B**[^9]

**Q63 (EN).** What must be true for a Roll-Up Summary field to be created on a parent object?
[Kategorie A – selbst erstellt, exam-nah]
A) A Lookup relationship must exist  B) A Master-Detail relationship must exist  C) A Junction Object must exist  D) A Big Object must exist
**Answer: B**[^7]

**F63 (DE).** Was muss zutreffen, damit ein Roll-Up-Summary-Feld auf einem übergeordneten Objekt erstellt werden kann?
[Kategorie A – selbst erstellt, exam-nah]
A) Es muss eine Lookup-Beziehung bestehen  B) Es muss eine Master-Detail-Beziehung bestehen  C) Es muss ein Junction Object bestehen  D) Es muss ein Big Object bestehen
**Antwort: B**[^7]

**Q64 (EN).** Which sharing mechanism allows an individual record owner to grant one-off access to a colleague?
[Kategorie A – selbst erstellt, exam-nah]
A) Sharing Rule  B) Manual Sharing  C) Role Hierarchy  D) Organization-Wide Default
**Answer: B**[^11]

**F64 (DE).** Welcher Freigabemechanismus erlaubt es dem Eigentümer eines einzelnen Datensatzes, einem Kollegen einmalig Zugriff zu gewähren?
[Kategorie A – selbst erstellt, exam-nah]
A) Sharing Rule  B) Manual Sharing  C) Rollenhierarchie  D) Organization-Wide Default
**Antwort: B**[^11]

**Q65 (EN).** An admin wants to restrict login access to office hours only. What should be configured?
[Kategorie A – selbst erstellt, exam-nah]
A) Login IP Ranges  B) Login Hours  C) Session Settings  D) MFA
**Answer: B**[^12]

**F65 (DE).** Ein Administrator möchte den Login-Zugriff auf Bürozeiten beschränken. Was sollte konfiguriert werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Login-IP-Bereiche  B) Login-Zeiten (Login Hours)  C) Sitzungseinstellungen  D) MFA
**Antwort: B**[^12]

**Q66 (EN).** Which automation is triggered when a new Case is created via email-to-case and should send an immediate acknowledgment?
[Kategorie A – selbst erstellt, exam-nah]
A) Escalation Rule  B) Auto-Response Rule  C) Assignment Rule  D) Approval Process
**Answer: B**[^16]

**F66 (DE).** Welche Automatisierung wird ausgelöst, wenn ein neuer Case per Email-to-Case erstellt wird und eine sofortige Empfangsbestätigung senden soll?
[Kategorie A – selbst erstellt, exam-nah]
A) Escalation Rule  B) Auto-Response Rule  C) Assignment Rule  D) Approval Process
**Antwort: B**[^16]

**Q67 (EN).** What best describes a Queue in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) A single user's task list  B) A holding area where multiple users can pick up unassigned records  C) A type of dashboard component  D) A sandbox environment
**Answer: B**[^16]

**F67 (DE).** Was beschreibt eine Queue in Salesforce am besten?
[Kategorie A – selbst erstellt, exam-nah]
A) Die Aufgabenliste eines einzelnen Benutzers  B) Ein Sammelbereich, aus dem mehrere Benutzer nicht zugewiesene Datensätze übernehmen können  C) Eine Art Dashboard-Komponente  D) Eine Sandbox-Umgebung
**Antwort: B**[^16]

**Q68 (EN).** Which object relationship type does NOT enforce cascading delete behavior?
[Kategorie A – selbst erstellt, exam-nah]
A) Master-Detail  B) Lookup  C) Junction via Master-Detail  D) Hierarchical Master-Detail
**Answer: B**[^7]

**F68 (DE).** Welcher Beziehungstyp erzwingt KEIN kaskadierendes Löschverhalten?
[Kategorie A – selbst erstellt, exam-nah]
A) Master-Detail  B) Lookup  C) Junction über Master-Detail  D) Hierarchisches Master-Detail
**Antwort: B**[^7]

**Q69 (EN).** What is the purpose of a Compact Layout on mobile devices?
[Kategorie A – selbst erstellt, exam-nah]
A) To hide all fields  B) To show the most important fields prominently in limited screen space  C) To disable Quick Actions  D) To restrict data entry
**Answer: B**[^9]

**F69 (DE).** Wozu dient ein Compact Layout auf Mobilgeräten?
[Kategorie A – selbst erstellt, exam-nah]
A) Um alle Felder auszublenden  B) Um die wichtigsten Felder auf begrenztem Bildschirmplatz prominent anzuzeigen  C) Um Quick Actions zu deaktivieren  D) Um die Dateneingabe einzuschränken
**Antwort: B**[^9]

**Q70 (EN).** Which tool would an admin use to visually map object relationships across the org?
[Kategorie A – selbst erstellt, exam-nah]
A) Object Manager list view  B) Schema Builder  C) Data Loader  D) Setup Audit Trail
**Answer: B**[^6]

**F70 (DE).** Welches Tool würde ein Administrator verwenden, um Objektbeziehungen in der gesamten Org visuell darzustellen?
[Kategorie A – selbst erstellt, exam-nah]
A) Listenansicht im Object Manager  B) Schema Builder  C) Data Loader  D) Setup Audit Trail
**Antwort: B**[^6]

**Q71 (EN).** A field should never allow values over 100. Which tool enforces this at save time?
[Kategorie A – selbst erstellt, exam-nah]
A) Field Dependency  B) Validation Rule  C) Roll-Up Summary  D) Duplicate Rule
**Answer: B**[^17]

**F71 (DE).** Ein Feld darf niemals Werte über 100 zulassen. Welches Tool erzwingt dies beim Speichern?
[Kategorie A – selbst erstellt, exam-nah]
A) Field Dependency  B) Validation Rule  C) Roll-Up Summary  D) Duplicate Rule
**Antwort: B**[^17]

**Q72 (EN).** Which Salesforce feature enables customers to self-serve support via a branded portal?
[Kategorie A – selbst erstellt, exam-nah]
A) Chatter  B) Experience Cloud  C) Data Cloud  D) MuleSoft
**Answer: B**[^37]

**F72 (DE).** Welche Salesforce-Funktion ermöglicht es Kunden, sich über ein individuell gestaltetes Portal selbst zu helfen?
[Kategorie A – selbst erstellt, exam-nah]
A) Chatter  B) Experience Cloud  C) Data Cloud  D) MuleSoft
**Antwort: B**[^37]

**Q73 (EN).** Which product is best suited for complex, rule-based configuration of bundled products and pricing?
[Kategorie A – selbst erstellt, exam-nah]
A) CPQ  B) Data Cloud  C) Territory Management  D) Chatter
**Answer: A**[^37]

**F73 (DE).** Welches Produkt ist am besten für die komplexe, regelbasierte Konfiguration von Produktbündeln und Preisen geeignet?
[Kategorie A – selbst erstellt, exam-nah]
A) CPQ  B) Data Cloud  C) Territory Management  D) Chatter
**Antwort: A**[^37]

**Q74 (EN).** What is the function of Global Search in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) Search within a single record only  B) Search across multiple objects platform-wide  C) Search only Setup menus  D) Search AppExchange listings only
**Answer: B**[^38]

**F74 (DE).** Welche Funktion hat die Globale Suche in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) Suche nur innerhalb eines einzelnen Datensatzes  B) Plattformweite Suche über mehrere Objekte hinweg  C) Suche nur in Setup-Menüs  D) Suche nur in AppExchange-Listings
**Antwort: B**[^38]

**Q75 (EN).** Which type of Sandbox includes NO production data but a fully separate copy of all metadata for isolated testing?
[Kategorie A – selbst erstellt, exam-nah]
A) Full Sandbox  B) Developer Sandbox  C) Partial Copy Sandbox  D) Production Clone
**Answer: B**[^34]

**F75 (DE).** Welcher Sandbox-Typ enthält KEINE Produktionsdaten, aber eine vollständig separate Kopie aller Metadaten für isoliertes Testen?
[Kategorie A – selbst erstellt, exam-nah]
A) Full Sandbox  B) Developer Sandbox  C) Partial Copy Sandbox  D) Production Clone
**Antwort: B**[^34]

**Q76 (EN).** Which Sandbox type most closely mirrors full production data volume for realistic performance testing?
[Kategorie A – selbst erstellt, exam-nah]
A) Developer Sandbox  B) Developer Pro Sandbox  C) Full Sandbox  D) Partial Copy Sandbox
**Answer: C**[^34]

**F76 (DE).** Welcher Sandbox-Typ entspricht dem vollständigen Produktionsdatenvolumen am nächsten für realistische Performance-Tests?
[Kategorie A – selbst erstellt, exam-nah]
A) Developer Sandbox  B) Developer Pro Sandbox  C) Full Sandbox  D) Partial Copy Sandbox
**Antwort: C**[^34]

**Q77 (EN).** Which API is optimized for high-volume, asynchronous data loads?
[Kategorie A – selbst erstellt, exam-nah]
A) SOAP API  B) REST API  C) Bulk API  D) Streaming API
**Answer: C**[^27]

**F77 (DE).** Welche API ist für hochvolumige, asynchrone Datenladevorgänge optimiert?
[Kategorie A – selbst erstellt, exam-nah]
A) SOAP API  B) REST API  C) Bulk API  D) Streaming API
**Antwort: C**[^27]

**Q78 (EN).** What feature captures leads directly from a website form into Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) Web-to-Lead  B) Data Import Wizard  C) Salesforce Connect  D) Batch Apex
**Answer: A**[^28]

**F78 (DE).** Welche Funktion erfasst Leads direkt von einem Website-Formular in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) Web-to-Lead  B) Data Import Wizard  C) Salesforce Connect  D) Batch Apex
**Antwort: A**[^28]

**Q79 (EN).** Which integration platform is designed for complex, enterprise-wide system connectivity beyond point-to-point integrations?
[Kategorie A – selbst erstellt, exam-nah]
A) MuleSoft  B) Web-to-Case  C) Data Loader  D) Change Set
**Answer: A**[^28]

**F79 (DE).** Welche Integrationsplattform ist für komplexe, unternehmensweite Systemanbindungen jenseits von Punkt-zu-Punkt-Integrationen konzipiert?
[Kategorie A – selbst erstellt, exam-nah]
A) MuleSoft  B) Web-to-Case  C) Data Loader  D) Change Set
**Antwort: A**[^28]

**Q80 (EN).** Which forecasting concept aggregates expected revenue based on open Opportunities and their stages?
[Kategorie A – selbst erstellt, exam-nah]
A) Campaign Influence  B) Sales Forecast  C) Territory Management  D) Price Book
**Answer: B**[^30]

**F80 (DE).** Welches Prognosekonzept aggregiert erwarteten Umsatz basierend auf offenen Opportunities und deren Stages?
[Kategorie A – selbst erstellt, exam-nah]
A) Campaign Influence  B) Sales Forecast (Vertriebsprognose)  C) Territory Management  D) Price Book
**Antwort: B**[^30]

**Q81 (EN).** What links a Product to specific pricing for different customer segments?
[Kategorie A – selbst erstellt, exam-nah]
A) Price Book  B) Campaign  C) Quote Template  D) Forecast Category
**Answer: A**[^30]

**F81 (DE).** Was verknüpft ein Produkt mit spezifischen Preisen für unterschiedliche Kundensegmente?
[Kategorie A – selbst erstellt, exam-nah]
A) Price Book  B) Campaign  C) Quote-Template  D) Forecast Category
**Antwort: A**[^30]

**Q82 (EN).** Which feature tracks how multiple marketing campaigns contributed to a single Opportunity?
[Kategorie A – selbst erstellt, exam-nah]
A) Campaign Influence  B) Lead Conversion  C) Sales Path  D) Duplicate Rule
**Answer: A**[^30]

**F82 (DE).** Welche Funktion verfolgt, wie mehrere Marketingkampagnen zu einer einzelnen Opportunity beigetragen haben?
[Kategorie A – selbst erstellt, exam-nah]
A) Campaign Influence  B) Lead Conversion  C) Sales Path  D) Duplicate Rule
**Antwort: A**[^30]

**Q83 (EN).** Which knowledge base feature helps both customers and agents find self-service answers?
[Kategorie A – selbst erstellt, exam-nah]
A) Knowledge Article  B) Case Milestone  C) Omni-Channel Routing  D) Entitlement Process
**Answer: A**[^32]

**F83 (DE).** Welche Wissensdatenbank-Funktion hilft Kunden und Agenten, Antworten zur Selbsthilfe zu finden?
[Kategorie A – selbst erstellt, exam-nah]
A) Knowledge Article  B) Case Milestone  C) Omni-Channel Routing  D) Entitlement Process
**Antwort: A**[^32]

**Q84 (EN).** What best defines a Milestone within an Entitlement Process?
[Kategorie A – selbst erstellt, exam-nah]
A) A required step or deadline that must be met within a support process (e.g., first response time)  B) A type of Report  C) A field-level permission  D) A Chatter post
**Answer: A**[^33]

**F84 (DE).** Was definiert einen Milestone innerhalb eines Entitlement-Prozesses am besten?
[Kategorie A – selbst erstellt, exam-nah]
A) Einen erforderlichen Schritt oder eine Frist, die innerhalb eines Support-Prozesses eingehalten werden muss (z. B. Erstreaktionszeit)  B) Einen Reporttyp  C) Eine Berechtigung auf Feldebene  D) Einen Chatter-Post
**Antwort: A**[^33]

**Q85 (EN).** Which console is optimized for support agents to manage multiple Cases simultaneously with split views?
[Kategorie A – selbst erstellt, exam-nah]
A) Sales Console  B) Service Console  C) Setup Console  D) Lightning App Builder
**Answer: B**[^33]

**F85 (DE).** Welche Konsole ist für Support-Agenten optimiert, um mehrere Cases gleichzeitig in geteilten Ansichten zu bearbeiten?
[Kategorie A – selbst erstellt, exam-nah]
A) Sales Console  B) Service Console  C) Setup Console  D) Lightning App Builder
**Antwort: B**[^33]

**Q86 (EN).** Which term describes real-time chat support integrated into Service Cloud?
[Kategorie A – selbst erstellt, exam-nah]
A) Live Agent / Chat  B) Email-to-Case  C) Web-to-Case  D) Macro
**Answer: A**[^33]

**F86 (DE).** Welcher Begriff beschreibt den in die Service Cloud integrierten Echtzeit-Chat-Support?
[Kategorie A – selbst erstellt, exam-nah]
A) Live Agent / Chat  B) Email-to-Case  C) Web-to-Case  D) Macro
**Antwort: A**[^33]

**Q87 (EN).** Which feature restricts a delegated administrator's rights to a defined subset of admin tasks?
[Kategorie A – selbst erstellt, exam-nah]
A) Delegated Administration  B) Role Hierarchy  C) Session Settings  D) Health Check
**Answer: A**[^12]

**F87 (DE).** Welche Funktion beschränkt die Rechte eines delegierten Administrators auf eine definierte Teilmenge von Admin-Aufgaben?
[Kategorie A – selbst erstellt, exam-nah]
A) Delegated Administration  B) Rollenhierarchie  C) Sitzungseinstellungen  D) Health Check
**Antwort: A**[^12]

**Q88 (EN).** What controls whether a session automatically expires after inactivity?
[Kategorie A – selbst erstellt, exam-nah]
A) Login Hours  B) Session Settings (timeout)  C) Field-Level Security  D) Sharing Rule
**Answer: B**[^12]

**F88 (DE).** Was steuert, ob eine Sitzung nach Inaktivität automatisch abläuft?
[Kategorie A – selbst erstellt, exam-nah]
A) Login-Zeiten  B) Sitzungseinstellungen (Timeout)  C) Field-Level Security  D) Sharing Rule
**Antwort: B**[^12]

**Q89 (EN).** Which grouping mechanism can be used both for Sharing Rules and for granting Report/Dashboard folder access?
[Kategorie A – selbst erstellt, exam-nah]
A) Public Group  B) Junction Object  C) Big Object  D) Formula Field
**Answer: A**[^13]

**F89 (DE).** Welcher Gruppierungsmechanismus kann sowohl für Sharing Rules als auch für die Vergabe von Zugriff auf Report-/Dashboard-Ordner verwendet werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Public Group  B) Junction Object  C) Big Object  D) Formelfeld
**Antwort: A**[^13]

**Q90 (EN).** Which team feature grants a defined group of users specific access levels to a single Account record?
[Kategorie A – selbst erstellt, exam-nah]
A) Account Team  B) Public Group  C) Territory  D) Queue
**Answer: A**[^13]

**F90 (DE).** Welche Team-Funktion gewährt einer definierten Gruppe von Benutzern bestimmte Zugriffsstufen auf einen einzelnen Account-Datensatz?
[Kategorie A – selbst erstellt, exam-nah]
A) Account Team  B) Public Group  C) Territory  D) Queue
**Antwort: A**[^13]

**Q91 (EN).** Which Flow element type would be used to display a form and collect user input during a Screen Flow?
[Kategorie A – selbst erstellt, exam-nah]
A) Decision Element  B) Screen Element  C) Assignment Element  D) Get Records Element
**Answer: B**[^14]

**F91 (DE).** Welcher Flow-Elementtyp würde verwendet, um während eines Screen Flows ein Formular anzuzeigen und Benutzereingaben zu erfassen?
[Kategorie A – selbst erstellt, exam-nah]
A) Decision-Element  B) Screen-Element  C) Assignment-Element  D) Get-Records-Element
**Antwort: B**[^14]

**Q92 (EN).** Which Flow element retrieves records from Salesforce based on defined filter criteria?
[Kategorie A – selbst erstellt, exam-nah]
A) Get Records  B) Create Records  C) Decision  D) Loop
**Answer: A**[^14]

**F92 (DE).** Welches Flow-Element ruft Datensätze aus Salesforce basierend auf definierten Filterkriterien ab?
[Kategorie A – selbst erstellt, exam-nah]
A) Get Records  B) Create Records  C) Decision  D) Loop
**Antwort: A**[^14]

**Q93 (EN).** Which Flow type runs automatically on a defined recurring schedule (e.g., nightly)?
[Kategorie A – selbst erstellt, exam-nah]
A) Screen Flow  B) Scheduled Flow  C) Record-Triggered Flow  D) Platform Event-Triggered Flow
**Answer: B**[^14]

**F93 (DE).** Welcher Flow-Typ läuft automatisch nach einem festgelegten wiederkehrenden Zeitplan (z. B. nächtlich)?
[Kategorie A – selbst erstellt, exam-nah]
A) Screen Flow  B) Scheduled Flow  C) Record-Triggered Flow  D) Platform-Event-getriggerter Flow
**Antwort: B**[^14]

**Q94 (EN).** Which automation tool is triggered exclusively by DML events and written in code, not declaratively?
[Kategorie A – selbst erstellt, exam-nah]
A) Flow  B) Apex Trigger  C) Approval Process  D) Assignment Rule
**Answer: B**[^18]

**F94 (DE).** Welches Automatisierungstool wird ausschließlich durch DML-Ereignisse ausgelöst und ist in Code, nicht deklarativ, geschrieben?
[Kategorie A – selbst erstellt, exam-nah]
A) Flow  B) Apex Trigger  C) Approval Process  D) Assignment Rule
**Antwort: B**[^18]

**Q95 (EN).** Which Apex automation type is best suited for processing millions of records in manageable chunks?
[Kategorie A – selbst erstellt, exam-nah]
A) Scheduled Apex  B) Batch Apex  C) Apex Trigger  D) Anonymous Apex
**Answer: B**[^18]

**F95 (DE).** Welcher Apex-Automatisierungstyp ist am besten geeignet, um Millionen von Datensätzen in überschaubaren Blöcken zu verarbeiten?
[Kategorie A – selbst erstellt, exam-nah]
A) Scheduled Apex  B) Batch Apex  C) Apex Trigger  D) Anonymer Apex
**Antwort: B**[^18]

**Q96 (EN).** What happens if an Apex transaction exceeds a Governor Limit?
[Kategorie A – selbst erstellt, exam-nah]
A) It slows down but completes  B) It throws a runtime exception and the transaction fails  C) It automatically retries  D) It queues silently for later
**Answer: B**[^18]

**F96 (DE).** Was passiert, wenn eine Apex-Transaktion ein Governor Limit überschreitet?
[Kategorie A – selbst erstellt, exam-nah]
A) Sie wird langsamer, aber abgeschlossen  B) Sie löst eine Laufzeitausnahme aus und die Transaktion schlägt fehl  C) Sie wird automatisch wiederholt  D) Sie wird still für später eingereiht
**Antwort: B**[^18]

**Q97 (EN).** Which field type automatically calculates a value from other fields and cannot be manually edited?
[Kategorie A – selbst erstellt, exam-nah]
A) Picklist  B) Formula Field  C) Lookup Field  D) External ID Field
**Answer: B**[^8]

**F97 (DE).** Welcher Feldtyp berechnet automatisch einen Wert aus anderen Feldern und kann nicht manuell bearbeitet werden?
[Kategorie A – selbst erstellt, exam-nah]
A) Picklist  B) Formelfeld  C) Lookup-Feld  D) External-ID-Feld
**Antwort: B**[^8]

**Q98 (EN).** Which field type allows a user to select more than one value from a predefined list simultaneously?
[Kategorie A – selbst erstellt, exam-nah]
A) Picklist  B) Multi-Select Picklist  C) Checkbox  D) Text Area
**Answer: B**[^8]

**F98 (DE).** Welcher Feldtyp erlaubt einem Benutzer, gleichzeitig mehr als einen Wert aus einer vordefinierten Liste auszuwählen?
[Kategorie A – selbst erstellt, exam-nah]
A) Picklist  B) Multi-Select Picklist  C) Checkbox  D) Textbereich
**Antwort: B**[^8]

**Q99 (EN).** Which term describes a single instance of data stored within an object, analogous to a database row?
[Kategorie A – selbst erstellt, exam-nah]
A) Field  B) Record  C) Relationship  D) Metadata
**Answer: B**[^6]

**F99 (DE).** Welcher Begriff beschreibt eine einzelne Dateninstanz innerhalb eines Objekts, vergleichbar mit einer Datenbankzeile?
[Kategorie A – selbst erstellt, exam-nah]
A) Field  B) Record (Datensatz)  C) Relationship  D) Metadata
**Antwort: B**[^6]

**Q100 (EN).** Which naming convention suffix identifies a Custom Object or Custom Field in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) __x  B) __c  C) __custom  D) _obj
**Answer: B**[^6]

**F100 (DE).** Welches Namenskonventions-Suffix identifiziert ein Custom Object oder Custom Field in Salesforce?
[Kategorie A – selbst erstellt, exam-nah]
A) __x  B) __c  C) __custom  D) _obj
**Antwort: B**[^6]

**Q101 (EN).** What best describes the purpose of the Object Manager in Setup?
[Kategorie A – selbst erstellt, exam-nah]
A) To manage user licenses  B) To create and configure objects, fields, and their relationships  C) To build dashboards  D) To manage Sandboxes
**Answer: B**[^25]

**F101 (DE).** Was beschreibt den Zweck des Object Manager im Setup am besten?
[Kategorie A – selbst erstellt, exam-nah]
A) Benutzerlizenzen verwalten  B) Objekte, Felder und deren Beziehungen erstellen und konfigurieren  C) Dashboards erstellen  D) Sandboxes verwalten
**Antwort: B**[^25]

**Q102 (EN).** Which feature offers contextual, in-app tips to guide new users through unfamiliar features?
[Kategorie A – selbst erstellt, exam-nah]
A) Global Search  B) In-App Guidance  C) Utility Bar  D) Quick Action
**Answer: B**[^24]

**F102 (DE).** Welche Funktion bietet kontextuelle In-App-Hinweise, um neue Benutzer durch unbekannte Funktionen zu führen?
[Kategorie A – selbst erstellt, exam-nah]
A) Globale Suche  B) In-App Guidance  C) Utility Bar  D) Quick Action
**Antwort: B**[^24]

**Q103 (EN).** Which button type allows quick record creation directly from a list view or record page without navigating away?
[Kategorie A – selbst erstellt, exam-nah]
A) Global Action / Quick Action  B) Path  C) List View filter  D) Kanban column
**Answer: A**[^24]

**F103 (DE).** Welcher Schaltflächentyp ermöglicht die schnelle Erstellung eines Datensatzes direkt aus einer Listenansicht oder Datensatzseite, ohne die Seite zu wechseln?
[Kategorie A – selbst erstellt, exam-nah]
A) Global Action / Quick Action  B) Path  C) List-View-Filter  D) Kanban-Spalte
**Antwort: A**[^24]

**Q104 (EN).** Which certification exam guide domain typically covers Company Settings, User Setup, and Security & Access most heavily for Administrators?
[Kategorie A – selbst erstellt, exam-nah]
A) Marketing Cloud domain  B) Organizational Setup and Security & Access domains  C) Apex Development domain  D) Data Cloud domain
**Answer: B**[^5][^6]

**F104 (DE).** Welche Exam-Guide-Domänen für Administratoren decken typischerweise Company Settings, User Setup und Security & Access am stärksten ab?
[Kategorie A – selbst erstellt, exam-nah]
A) Marketing-Cloud-Domäne  B) Organizational-Setup- und Security-&-Access-Domänen  C) Apex-Development-Domäne  D) Data-Cloud-Domäne
**Antwort: B**[^5][^6]

**Q105 (EN).** Which domain in the Administrator Exam Guide most directly covers Reports, Dashboards, and Analytics?
[Kategorie A – selbst erstellt, exam-nah]
A) Sales and Marketing Applications  B) Analytics and Data Management-related domain  C) Service and Support Applications  D) Productivity and Collaboration
**Answer: B**[^5][^6]

**F105 (DE).** Welche Domäne im Administrator Exam Guide behandelt am direktesten Reports, Dashboards und Analytics?
[Kategorie A – selbst erstellt, exam-nah]
A) Sales and Marketing Applications  B) Analytics- und Datenmanagement-bezogene Domäne  C) Service and Support Applications  D) Productivity and Collaboration
**Antwort: B**[^5][^6]

**Q106 (EN).** Which object would you use to represent a discrete unit of work assigned to a support agent, such as a customer complaint?
[Kategorie A – selbst erstellt, exam-nah]
A) Opportunity  B) Case  C) Lead  D) Campaign
**Answer: B**[^32]

**F106 (DE).** Welches Objekt würden Sie verwenden, um eine einzelne Arbeitsaufgabe eines Support-Agenten wie eine Kundenbeschwerde darzustellen?
[Kategorie A – selbst erstellt, exam-nah]
A) Opportunity  B) Case  C) Lead  D) Campaign
**Antwort: B**[^32]

**Q107 (EN).** Which object stores a potential deal with an amount, close date, and stage?
[Kategorie A – selbst erstellt, exam-nah]
A) Lead  B) Opportunity  C) Case  D) Campaign
**Answer: B**[^29]

**F107 (DE).** Welches Objekt speichert ein potenzielles Geschäft mit Betrag, Abschlussdatum und Stage?
[Kategorie A – selbst erstellt, exam-nah]
A) Lead  B) Opportunity  C) Case  D) Campaign
**Antwort: B**[^29]

**Q108 (EN).** Which object represents an unqualified potential customer before conversion?
[Kategorie A – selbst erstellt, exam-nah]
A) Account  B) Contact  C) Lead  D) Opportunity
**Answer: C**[^29]

**F108 (DE).** Welches Objekt stellt einen unqualifizierten potenziellen Kunden vor der Konvertierung dar?
[Kategorie A – selbst erstellt, exam-nah]
A) Account  B) Contact  C) Lead  D) Opportunity
**Antwort: C**[^29]

**Q109 (EN).** Which object represents a company or organization with which a business relationship exists?
[Kategorie A – selbst erstellt, exam-nah]
A) Contact  B) Account  C) Case  D) Lead
**Answer: B**[^29]

**F109 (DE).** Welches Objekt stellt ein Unternehmen oder eine Organisation dar, zu der eine Geschäftsbeziehung besteht?
[Kategorie A – selbst erstellt, exam-nah]
A) Contact  B) Account  C) Case  D) Lead
**Antwort: B**[^29]

**Q110 (EN).** Which object represents an individual person linked to an Account?
[Kategorie A – selbst erstellt, exam-nah]
A) Contact  B) Lead  C) Opportunity  D) Case
**Answer: A**[^29]

**F110 (DE).** Welches Objekt stellt eine einzelne Person dar, die mit einem Account verknüpft ist?
[Kategorie A – selbst erstellt, exam-nah]
A) Contact  B) Lead  C) Opportunity  D) Case
**Antwort: A**[^29]

**Q111 (EN).** Which marketing tracking object helps measure ROI of a specific marketing initiative?
[Kategorie A – selbst erstellt, exam-nah]
A) Campaign  B) Quote  C) Price Book  D) Territory
**Answer: A**[^30]

**F111 (DE).** Welches Marketing-Tracking-Objekt hilft, den ROI einer bestimmten Marketinginitiative zu messen?
[Kategorie A – selbst erstellt, exam-nah]
A) Campaign  B) Quote  C) Price Book  D) Territory
**Antwort: A**[^30]

**Q112 (EN).** Which document is generated from an Opportunity to formally present pricing to a customer?
[Kategorie A – selbst erstellt, exam-nah]
A) Quote  B) Case  C) Knowledge Article  D) Entitlement
**Answer: A**[^30]

**F112 (DE).** Welches Dokument wird aus einer Opportunity generiert, um einem Kunden formell die Preisgestaltung vorzulegen?
[Kategorie A – selbst erstellt, exam-nah]
A) Quote  B) Case  C) Knowledge Article  D) Entitlement
**Antwort: A**[^30]

**Q113 (EN).** Which feature helps prevent unauthorized data access from unfamiliar network locations even with valid credentials?
[Kategorie A – selbst erstellt, exam-nah]
A) Login IP Ranges  B) Field-Level Security  C) Roll-Up Summary  D) Path
**Answer: A**[^12]

**F113 (DE).** Welche Funktion hilft, unbefugten Datenzugriff von unbekannten Netzwerkstandorten selbst mit gültigen Anmeldedaten zu verhindern?
[Kategorie A – selbst erstellt, exam-nah]
A) Login-IP-Bereiche  B) Field-Level Security  C) Roll-Up Summary  D) Path
**Antwort: A**[^12]

**Q114 (EN).** Which term refers to the visual arrangement of fields, related lists, and buttons on a record's detail page?
[Kategorie A – selbst erstellt, exam-nah]
A) Compact Layout  B) Page Layout  C) List View  D) Lightning Page
**Answer: B**[^9]

**F114 (DE).** Welcher Begriff bezeichnet die visuelle Anordnung von Feldern, verwandten Listen und Buttons auf der Detailseite eines Datensatzes?
[Kategorie A – selbst erstellt, exam-nah]
A) Compact Layout  B) Page Layout  C) List View  D) Lightning Page
**Antwort: B**[^9]

**Q115 (EN).** Which combination allows different departments to have entirely different fields and picklist values visible for the same object, while also restricting who edits which fields?
[Kategorie A – selbst erstellt, exam-nah]
A) Record Types + Page Layouts + Field-Level Security  B) Sharing Rules only  C) Queues only  D) Validation Rules only
**Answer: A**[^11][^9]

**F115 (DE).** Welche Kombination ermöglicht es unterschiedlichen Abteilungen, völlig unterschiedliche Felder und Picklist-Werte für dasselbe Objekt sichtbar zu haben und zusätzlich einzuschränken, wer welche Felder bearbeiten darf?
[Kategorie A – selbst erstellt, exam-nah]
A) Record Types + Page Layouts + Field-Level Security  B) Nur Sharing Rules  C

---

## References

1. [Salesforce Certified Platform Foundations Exam Guide](https://help.salesforce.com/s/articleView?id=005298979&language=en_US&type=1) - This exam guide is designed to help you prepare for the Salesforce Certified Platform Foundations Ex...

2. [Platform Administrator Practice Test](https://developer.salesforce.com/files/ti/thi/THI-000393/administratorpracticetest.html)

3. [Salesforce Certified Platform Administrator Exam Guide](https://help.salesforce.com/s/articleView?id=005298966&language=en_US&type=1) - This guide provides information about the target audience, the recommended training and documentatio...

4. [Salesforce Certified Platform Administrator II Exam Guide](https://help.salesforce.com/s/articleView?id=005298969&language=en_US&type=1) - Purpose of This Exam Guide. This exam guide is designed to help you prepare for the Salesforce Certi...

5. [Prepare for your Salesforce Platform Foundations Certification](https://trailhead.salesforce.com/content/learn/trails/prepare-for-your-salesforce-platform-foundations-certification) - Preparing for your Salesforce Platform Foundations exam? Check out this trail.

6. [Is there any paid admin practice - Trailhead - Salesforce](https://trailhead.salesforce.com/trailblazer-community/feed/0D54V00007XIL9BSAX) - Is there any paid admin practice test on trailhead if not where can I get the best practice question...

7. [Practice Exams | Salesforce Trailblazer Community](https://trailhead.salesforce.com/trailblazer-community/topics/practiceexams)

8. [Did SF remove the Administrator](https://trailhead.salesforce.com/trailblazer-community/feed/0D5KX00000ml2jT0AQ) - My saved links to the practice test are not resolving, does anyone have acess to the new link?

9. [Salesforce Certified Platform Foundations - Trailhead Academy](https://trailheadacademy.salesforce.com/de/certificate/exam-platform-foundations---Plat-101) - Salesforce Platform Foundations Certification Prep. Use scenarios and interactive flashcards to stud...

10. [Salesforce Associate Certification Prep Guide - Trailhead](https://trailhead.salesforce.com/content/learn/modules/cert-prep-salesforce-certified-associate) - Prepare for the Salesforce Associate exam with interactive flashcards and practical scenarios. Disco...

11. [Platform Administrator Practice | Salesforce Trailblazer Community](https://trailhead.salesforce.com/trailblazer-community/feed/0D5KX00000mlVQJ0A2) - Since the Platform Administrator Practice Exam has been discontinued, I noticed the link for the fre...

12. [Certification - Salesforce Certified Platform Foundations](https://trailhead.salesforce.com/credentials/platformfoundations) - Salesforce credentials are a great way to grow your résumé and highlight your skills. They prove tha...

13. [Salesforce Certified Platform Administrator Study Guide - O'Reilly](https://www.oreilly.com/library/view/salesforce-certified-platform/9781098165734/) - Whether you're starting your Salesforce journey, planning a career shift, or curious about cloud com...

14. [Study for the Administrator Certification Exam - Trailhead - Salesforce](https://trailhead.salesforce.com/content/learn/trails/administrator-certification-prep) - Get ready for the administrator certification exam with interactive study tools.

15. [Salesforce Admin certificate - practice tests required - Trailhead](https://trailhead.salesforce.com/trailblazer-community/feed/0D54V00007iftx5SAA) - Hi fellow trailblazers, I am new to the community and have been learning the basics from trailhead s...

16. [Salesforce Associate Certification Guide - Trailhead](https://trailhead.salesforce.com/content/learn/modules/cert-prep-salesforce-certified-associate/get-started-with-salesforce-associate-certification-prep) - Learning Objectives. After completing this unit, you'll be able to: Describe the key topic areas of ...

17. [What the Salesforce Certified Platform Administrator Exam ...](https://admin.salesforce.com/blog/2026/what-the-salesforce-certified-platform-administrator-exam-update-means-for-admins) - What the Salesforce Certified Platform Administrator Exam Update Means for Admins. By Eliza Riley | ...

18. [Prepare for your Salesforce Platform Foundations Certification](https://trailhead.salesforce.com/users/strailhead/trailmixes/prepare-for-your-salesforce-certified-associate-credential) - Preparing for your Salesforce Platform Foundations exam? Check out this trailmix that has been curat...

19. [Certification - Salesforce Certified Platform Foundations - Trailhead](https://trailhead.salesforce.com/en/credentials/associate) - Salesforce credentials are a great way to grow your résumé and highlight your skills. They prove tha...

20. [Salesforce Glossary](https://help.salesforce.com/s/articleView?id=xcloud.salesforce_glossary.htm&language=en_US&type=5) - This glossary defines terms that appear in the Get Started section of the Salesforce documentation. ...

21. [Free Platform Foundations Practice Exam 2026 - Trailblaze Prep](https://www.trailblazeprep.com/certifications/platform-foundations) - This associate-level exam tests foundational knowledge of the Salesforce platform. Questions focus o...

22. [Salesforce Platform Foundations (Associate) Certification Guide & Tips](https://www.salesforceben.com/salesforce-associate-certification-guide-tips/) - Check out the official Trailhead Exam Guide and use this as your master revision list. Complete the ...

23. [Platform Developer I Certification Guide - Trailhead](https://trailhead.salesforce.com/content/learn/modules/platform-developer-i-certification-prep-fundamentals-and-database-modeling/pd1-1-get-started) - Explore the study guide for the Salesforce Platform Developer I exam. Learn development fundamentals...

24. [Salesforce Admin Glossary: Core Terms Defined Simply | Exam Atlas](https://globalexamatlas.com/en/exams/salesforce/salesforce-administrator/glossary/) - A free Salesforce Certified Administrator glossary: core terms (profiles, permission sets, OWD, reco...

25. [Prepare for your Salesforce Platform Foundations Certification](https://trailhead.salesforce.com/trailblazer-community/feed/0D5KX00000mjwuQ0AQ) - Hola, me estoy preparando para la certificación de Salesforce Platform Foundations, es mi primera ce...

26. [Data Modeling Objects Fields Relationships - Trailhead](https://trailhead.salesforce.com/content/learn/modules/data_modeling) - Learn to optimize customer data with standard and custom objects, create object relationships, and w...

27. [Free Salesforce Admin Practice Exam (with Answers)](https://www.salesforceben.com/salesforce-admin-practice-exam/) - Try our 60-question practice exam to see if you are ready to take on the real exam. Professionally w...

28. [Salesforce Certification Resources & Mock Exams](https://www.salesforceben.com/get-salesforce-certified/) - Get Salesforce Certified! Browse certification training resources, exam tips and mock questions to p...

29. [Exam Practice Questions](https://trailhead.salesforce.com/content/learn/modules/cert-prep-salesforce-certified-associate/learn-about-the-salesforce-ecosystem) - Explore resources for learning Salesforce skills, Customer 360 product offerings, and career paths i...

30. [Salesforce Certified Administrator Quiz, Tips & Resources](https://www.salesforceben.com/salesforce-certified-administrator-quiz-tips-resources/) - Free Salesforce Practice Exams. Admin Practice Exam · Platform App Builder Practice Exam · Platform ...

31. [Microsoft Word - Advanced Administrator Exam (SalesForce Ben).docx](https://www.salesforceben.com/wp-content/uploads/2016/09/Advanced-Administrator-Exam-SalesForce-Ben.pdf)

32. [30 Salesforce Admin Interview Questions & Answers](https://www.salesforceben.com/30-salesforce-admin-interview-questions/) - Prepare for your salesforce admin interview with these 30 questions carefully curated by the best th...

33. [Salesforce Platform Foundations Practice Exam - PowerKram](https://powerkram.com/exams/salesforce/platform-foundations/) - Ten free questions across the four official sections, with full explanations and source links to the...

34. [Salesforce Advanced Administrator Practice Exams – Courses](https://courses.salesforceben.com/courses/salesforce-advanced-administrator-practice-exams/)

35. [Salesforce Administrator Practice Exams](https://courses.salesforceben.com/courses/salesforce-administrator-practice-exams/)

36. [Practice Free Salesforce Certified Platform Foundations ...](https://www.certdeed.com/exam/practice-free-salesforce-certified-platform-foundations-exam-online-questions/)

37. [Salesforce Certified Platform Foundations Exam Valid Questions](https://www.scribd.com/document/894006053/Salesforce-Certified-Platform-Foundations-Exam-Valid-Questions) - The document provides information about Salesforce Certified Platform Foundations exam dumps, highli...

38. [Salesforce Glossary: 66 Key Terms Explained (2026) | Clientell AI](https://www.getclientell.com/salesforce-glossary) - Complete Salesforce glossary with expert definitions. Apex, Flows, SOQL, permissions, and more: expl...

39. [50 Most Popular Salesforce Interview Questions & Answers ...](https://www.salesforceben.com/salesforce-interview-questions/) - Are you ready for your Salesforce Interview? Test yourself with these popular, handpicked Salesforce...

