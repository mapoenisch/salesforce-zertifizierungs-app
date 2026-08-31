# **Salesforce Zertifizierungs-Vorbereitung: Glossar** 

    
**Glossar**: über 200 Begriffe aus beiden Zertifizierungen (Platform Foundations \+ Platform Administrator), thematisch gruppiert. 

# **Glossar (Platform Foundations & Administrator)** 

**Schritt 1.1 – Grundlagen der Salesforce-Plattform** 

| Begriff  | Erklärung  |
| :---- | :---- |
| Org (Organization)  | Eine einzelne Salesforce-Instanz mit eigenen Daten, Nutzern und Konfiguration.  |
| Instance  | Der physische/virtuelle Server-Cluster, auf dem eine Org läuft.  |
| Multitenancy  | Architekturprinzip, bei dem viele Orgs dieselbe Infrastruktur teilen, aber logisch getrennt sind.  |
| Metadata-Driven  Architecture  | Salesforce speichert Konfiguration als Metadaten statt als Code, was Anpassungen ohne Programmierung erlaubt.  |
| Salesforce Customer 360  | Sammelbegriff für alle Salesforce-Cloud-Produkte, die auf einer gemeinsamen Kundendatenplattform basieren.  |
| Sales Cloud  | Salesforce-Produkt für Vertriebsprozesse (Leads, Opportunities, Forecasting).  |
| Service Cloud  | Salesforce-Produkt für Kundenservice (Cases, Knowledge, Entitlements).  |
| Marketing Cloud  | Salesforce-Produkt für Marketing-Automatisierung und Customer Journeys.  |
| Experience Cloud  | Plattform zum Erstellen von Portalen/Communities für Kunden, Partner oder Mitarbeiter.  |
| Data Cloud  | Salesforce-Datenplattform zur Vereinheitlichung von Kundendaten aus mehreren Quellen.  |
| Trailhead  | Salesforces kostenlose Lernplattform mit Modulen, Trails und Superbadges.  |
| Trailmix  | Eine individuell zusammengestellte Sammlung von Trailhead-Inhalten.  |
| Trailblazer Community  | Salesforce-Nutzer-Community für Austausch und Networking.  |
| AppExchange  | Marktplatz für Salesforce-Apps und \-Integrationen von Drittanbietern.  |
| Developer Edition  | Kostenlose Salesforce-Org zum Testen und Üben.  |
| Sandbox  | Kopie einer Produktions-Org zum Testen ohne Live-Daten zu beeinflussen.  |
| Production Org  | Die produktiv genutzte, "echte" Salesforce-Umgebung eines Unternehmens.  |
| Lightning Experience  | Die moderne Salesforce-Benutzeroberfläche.  |
| Salesforce Classic  | Die ältere, klassische Salesforce-Benutzeroberfläche.  |
| App Launcher  | Menü zum Wechseln zwischen Salesforce-Apps.  |
| Setup Menu  | Zentrale Konfigurationsoberfläche für Administratoren.  |
| Object Manager  | Bereich im Setup zur Verwaltung von Objekten, Feldern und Layouts.  |
| App (Lightning App)  |  Sammlung von Tabs, Objekten und Branding für einen bestimmten Anwendungsfall. |
| Lightning App Builder  |  Tool zum Erstellen von Lightning-Seiten per Drag-and-Drop. |
| Lightning Component  |  Baustein einer Lightning-Seite (Standard oder Custom).  |
| Lightning Web  Component (LWC)  |  Moderner, auf Web-Standards basierender Komponententyp. |
| Aura Component  |  Älteres Lightning-Komponentenframework. |
| Home Page  |  Anpassbare Startseite einer App. |
| Utility Bar  |  Leiste am unteren Bildschirmrand mit schnell zugänglichen Tools. |
| Global Actions  |  App-übergreifend verfügbare Schnellaktionen. |
| Quick Action  |  Konfigurierbare Schaltfläche zur schnellen Erstellung/Aktualisierung von Datensätzen. |
| List View  |  Gefilterte, sortierbare Liste von Datensätzen. |
| Kanban View  |  Visuelle Listenansicht mit Spalten nach Picklist-Werten (z. B. Opportunity Stage). |
| Path  |  Visuelle Führung durch Stufen eines Prozesses (z. B. Opportunity Stages). |
| In-App Guidance  |  Kontextuelle Hilfehinweise innerhalb der Benutzeroberfläche. |
| Setup  |  Zentrale Administrationsoberfläche von Salesforce. |

 

**Schritt 1.2 – Datenmodell: Objekte, Felder, Beziehungen** 

| Begriff  | Erklärung  |
| :---- | :---- |
| Standard Object  | Von Salesforce vordefiniertes Objekt (z. B. Account, Contact, Opportunity).  |
| Custom Object  | Vom Nutzer erstelltes, individuelles Objekt.  |
| Field  | Ein einzelnes Datenattribut eines Objekts (z. B. Name, E-Mail).  |
| Custom Field  | Ein vom Nutzer erstelltes zusätzliches Feld.  |
| Record  | Ein einzelner Datensatz innerhalb eines Objekts.  |
| Text Field  | Feldtyp für kurze Textwerte.  |
| Number Field  | Feldtyp für numerische Werte.  |
| Currency Field  | Feldtyp für Geldbeträge inkl. Währungsformatierung.  |
| Percent Field  | Feldtyp zur Darstellung von Prozentwerten.  |
| Date Field  | Feldtyp für ein Kalenderdatum.  |
| Date/Time Field  | Feldtyp für Datum plus Uhrzeit.  |
| Picklist  | Dropdown-Feld mit vordefinierten Auswahlwerten.  |
| Multi-Select Picklist  | Picklist, bei der mehrere Werte gleichzeitig ausgewählt werden können.  |
| Lookup Relationship  | Lose Verknüpfung zwischen zwei Objekten ohne Löschabhängigkeit.  |
| Master-Detail Relationship  | Enge Verknüpfung, bei der das Detail-Objekt vom Master abhängt (Kaskadenlöschung, RollupZusammenfassung).  |
| Roll-Up Summary Field  | Feld auf dem Master-Objekt, das Werte aus verknüpften Detail-Datensätzen aggregiert.  |
| Formula Field  | Berechnetes Feld basierend auf einer definierten Formel.  |
| External ID Field  | Feld zur eindeutigen Identifikation von Datensätzen bei Integrationen.  |
| Junction Object  | Custom Object zur Abbildung von Many-to-Many-Beziehungen zwischen zwei Objekten.  |
| Schema Builder  | Visuelles Tool zur Darstellung und Bearbeitung des Datenmodells.  |
| Field Dependency  | Regel, bei der die Werte eines Picklist-Feldes von einem anderen Feld abhängen.  |
| Field-Level Security  | Einstellung, die steuert, wer ein bestimmtes Feld sehen/bearbeiten darf.  |
| Record Type  | Ermöglicht unterschiedliche Picklist-Werte und Page Layouts für denselben Objekttyp.  |
| Page Layout  | Definiert Anordnung von Feldern, Buttons und verwandten Listen auf einem Datensatz.  |
| Compact Layout  | Kompakte Ansicht der wichtigsten Felder eines Datensatzes (z. B. in der Highlights-Leiste).  |
| Lightning Record Page  | Individuell anpassbare Detailseite eines Datensatzes in Lightning.  |
| Related List  | Liste verknüpfter Datensätze auf einer Objektseite.  |
| Global Picklist Value Set  | Zentral verwaltete Picklist-Werte, die über mehrere Felder hinweg genutzt werden können.  |
| Object (Objekt)  | Container für Datensätze, vergleichbar mit einer Datenbanktabelle; Standard- oder Custom Object  |
| Field (Feld)  | Speicherplatz für einen einzelnen Datenwert innerhalb eines Objekts. |
| Record (Datensatz)  | Eine einzelne Instanz/Zeile eines Objekts. |
| Relationship (Beziehung)  | Verknüpfung zwischen zwei Objekten (Lookup, Master-Detail, Many-to-Many). |
| External ID  | Feld, das eindeutige Datensatz-Kennung aus einem externen System speichert, nutzbar für Upsert. |
| Record Type (Datensatztyp)  | Steuert verfügbare Picklist-Werte und Page Layouts pro Benutzerprofil. |
| Object Relationship Overview  | Übersichtsdiagramm der Beziehungen zwischen Objekten (Schema Builder). |
| Big Object  | Objekttyp zur Speicherung sehr großer Datenmengen (Millionen/Milliarden Datensätze). |
| External Object  | Objekt, das Daten aus externen Systemen via Salesforce Connect abbildet, ohne sie zu speichern. |

 

**Schritt 1.3 – Sicherheitsmodell** 

| Begriff  | Erklärung  |
| :---- | :---- |
| Organization-Wide Defaults  (OWD) | Basiszugriffsebene, die den Standardzugriff auf Datensätze eines Objekts unternehmensweit festlegt. |
| Role Hierarchy | Struktur, die festlegt, welche Nutzer automatisch Zugriff auf Datensätze untergeordneter Rollen erhalten. |
| Sharing Rule | Regel, die den Zugriff auf Datensätze über OWD/Rollenhierarchie hinaus erweitert. |
| Criteria-Based Sharing Rule | Sharing Rule, die auf Feldwerten eines Datensatzes basiert. |
| Owner-Based Sharing Rule | Sharing Rule, die auf dem Besitzer eines Datensatzes basiert. |
| Manual Sharing | Individuelle, manuelle Freigabe eines einzelnen Datensatzes. |
| Profile | Definiert Basisberechtigungen eines Nutzers (Objektzugriff, Feldsicherheit, Systemberechtigungen). |
| Permission Set | Zusätzliche Berechtigungen, die einem Nutzer über das Profil hinaus zugewiesen werden. |
| Permission Set Group | Bündelung mehrerer Permission Sets zu einer Einheit. |
| Object-Level Security | Steuert, ob ein Nutzer überhaupt auf ein Objekt zugreifen darf (CRUD). |
| Record-Level Security | Steuert, welche einzelnen Datensätze ein Nutzer sehen darf. |
| Field-Level Security (FLS) | Steuert, welche Felder ein Nutzer sehen/bearbeiten darf. |
| CRUD | Abkürzung für Create, Read, Update, Delete – Grundrechte auf Objektebene. |
| View All / Modify All | Objektberechtigung, die vollen Zugriff auf alle Datensätze eines Objekts unabhängig von Sharing gewährt. |
| Login Hours | Einstellung, die festlegt, zu welchen Uhrzeiten sich ein Nutzer anmelden darf. |
| Login IP Ranges | Einstellung, die den Zugriff auf bestimmte IP-Adressbereiche beschränkt. |
| Session Settings | Konfiguration zu Sitzungsdauer, Timeout und Sicherheitsrichtlinien. |
| Two-Factor Authentication  (2FA/MFA) | Zusätzliche Sicherheitsebene bei der Anmeldung, meist über eine zweite Methode wie App oder SMS. |
| Password Policy | Regelwerk zu Passwortanforderungen (Länge, Komplexität, Ablauf). |
| Delegated Administration | Übertragung eingeschränkter Administrationsaufgaben an Nicht-Administratoren. |
| Public Groups | Sammlung von Nutzern, Rollen oder anderen Gruppen zur vereinfachten Freigabe. |
| Queue | Sammelpunkt für Datensätze (z. B. Cases, Leads), auf die ein Team gemeinsam zugreift. |
| Profile (Profil)  |  Steuert Objekt-, Feld- und Systemberechtigungen eines Benutzers.\[^10\]  |
| Role (Rolle)  |  Bestimmt Datensichtbarkeit in der Rollenhierarchie.\[^10\]  |
| Organization-Wide Default  (OWD)  |  Basis-Sichtbarkeitsstufe für Objekte (Private, Public Read Only, Public  Read/Write).\[^11\]  |
| Field Audit Trail  |  Erweiterte, langfristige Historie von Feldänderungen.\[^13\]  |
| Sharing Settings  |  Zentrale Einstellungsseite für OWD und Sharing Rules.\[^11\]  |
| Public Group  |  Gruppierung von Benutzern, Rollen oder anderen Gruppen für Sharing-Zwecke.\[^13\]  |
| Account Team / Opportunity  Team  |  Teams mit definiertem Zugriff auf Account- bzw. Opportunity-Datensätze.\[^13\]  |
| Territory Management  |  Modell zur Zuweisung von Accounts basierend auf geografischen/Umsatz-Kriterien statt Eigentümerschaft.\[^13\]  |

**Schritt 1.4 – Automatisierung** 

| Begriff  | Erklärung  |
| :---- | :---- |
| Flow Builder | Visuelles Tool zur Erstellung von Automatisierungen ohne Code. |
| Screen Flow | Flow-Typ mit Benutzeroberfläche zur Dateneingabe durch Nutzer. |
| Record-Triggered Flow | Flow, der automatisch bei Erstellung/Änderung/Löschung eines Datensatzes ausgelöst wird. |
| Scheduled Flow | Flow, der zu festgelegten Zeitpunkten automatisch ausgeführt wird. |
| Auto-Response Rule | Regel, die automatisch eine E-Mail-Antwort bei neuen Leads/Cases sendet. |
| Before-Save Flow | Record-Triggered Flow, der vor dem Speichern eines Datensatzes läuft (performanter für einfache Feldupdates). |
| After-Save Flow | Record-Triggered Flow, der nach dem Speichern läuft (z. B. für E-Mails, Aufgaben). |
| Validation Rule | Regel, die verhindert, dass Datensätze mit ungültigen Werten gespeichert werden. |
| Approval Process | Mehrstufiger, automatisierter Genehmigungsworkflow für Datensätze. |
| Approval Step | Einzelner Schritt innerhalb eines Approval Process mit eigenen Kriterien und Genehmigern. |
| Workflow Rule | Älteres (deprecated) Automatisierungswerkzeug, mittlerweile durch Flow ersetzt. |
| Process Builder | Älteres (deprecated) grafisches Automatisierungswerkzeug, Vorgänger von Flow. |
| Assignment Rule | Regel zur automatischen Zuweisung von Leads oder Cases an Nutzer/Queues. |
| Escalation Rule | Regel, die Cases bei Nichterfüllung von Kriterien automatisch eskaliert. |
| Auto-Response Rule | Regel, die automatisch eine E-Mail-Antwort bei neuen Leads/Cases sendet. |
| Entitlement Process | Definiert Support-Level und SLA-Zeitrahmen für Kunden. |
| Milestone | Ein zeitgebundenes Ziel innerhalb eines Entitlement-Prozesses (z. B. Erstreaktionszeit). |
| Formula (in Automation) | Logischer Ausdruck zur Berechnung von Werten oder Bedingungen. |
| Decision Element (Flow) | Flow-Element, das den Ablauf basierend auf Bedingungen verzweigt. |
| Loop Element (Flow) | Flow-Element zur Iteration über eine Sammlung von Datensätzen. |
| Get/Create/Update/Delete Records (Flow) | Flow-Datenelemente zum Lesen und Manipulieren von Datensätzen. |
| Subflow | Ein Flow, der innerhalb eines anderen Flows aufgerufen wird. |
| Flow Trigger Order | Reihenfolge, in der mehrere Record-Triggered Flows auf demselben Objekt ausgeführt werden. |
| Flow  | Deklaratives Automatisierungstool (Screen Flow, Record-Triggered Flow, Scheduled  Flow, Autolaunched Flow). |
| Autolaunched Flow  |  Flow ohne Bildschirme, aufgerufen durch andere Prozesse (z. B. Apex, andere Flows).  |
| Duplicate Rule / Matching Rule  |  Regeln zur Erkennung und Behandlung doppelter Datensätze. |
| Einstein Bot  |  KI-gestützter Chatbot zur Automatisierung von Kundeninteraktionen. |
| Apex Trigger  |  Programmierter Automatisierungscode, der bei DML-Ereignissen ausgeführt wird. |
| Apex Class  |  Wiederverwendbarer Programmcode in der proprietären Salesforce-Sprache Apex. |
| Scheduled Apex  |  Apex-Code, der zeitgesteuert ausgeführt wird. |
| Batch Apex  |  Apex-Verarbeitung großer Datenmengen in Blöcken (Batches).  |
| Governor Limits  |  Von Salesforce vorgegebene Ressourcengrenzen für Apex-Ausführungen (Multi- Tenant-Architektur). |

 

**Schritt 1.5 – Berichte, Dashboards & Datenmanagement** 

| Begriff  | Erklärung  |
| :---- | :---- |
| Report | Zusammenstellung von Datensätzen nach bestimmten Filtern und Feldern. |
| Report Type | Definiert, welche Objekte und Felder in einem Report verfügbar sind. |
| Tabular Report | Einfache Listenansicht ohne Gruppierung. |
| Summary Report | Report mit Gruppierung und Zwischensummen. |
| Matrix Report | Report mit Gruppierung nach Zeilen UND Spalten. |
| Joined Report | Report, der mehrere Report-Typen in einem Dokument kombiniert. |
| Bucket Field | Report-Feld, das Werte in benutzerdefinierte Kategorien gruppiert. |
| Cross Filter | Report-Filter, der Datensätze basierend auf verwandten/nicht verwandten Objekten filtert. |
| Report Subscription | Automatischer, wiederholter Versand eines Reports per E-Mail. |
| Dashboard | Visuelle Darstellung von Report-Daten über Diagramme und Kennzahlen. |
| Dynamic Dashboard | Dashboard, das Daten basierend auf den Zugriffsrechten des jeweiligen Betrachters anzeigt. |
| Dashboard Component | Einzelnes visuelles Element (Diagramm, Tabelle) innerhalb eines Dashboards. |
| Data Import Wizard | Einfaches Tool zum Import kleinerer Datenmengen über die Benutzeroberfläche. |
| Data Loader | Leistungsfähiges Desktop-Tool für Massenimport/-export/-löschung großer Datenmengen. |
| Upsert | Kombinierte Insert/Update-Operation basierend auf einem eindeutigen Identifikator. |
| Duplicate Rule | Regel zur Erkennung potenzieller Duplikate bei der Dateneingabe. |
| Matching Rule | Regelwerk, das definiert, wie Duplikate erkannt werden (Basis für Duplicate Rules). |
| Data Quality | Maß für Vollständigkeit, Genauigkeit und Konsistenz von Daten. |
| Mass Delete | Funktion zum gleichzeitigen Löschen mehrerer Datensätze. |
| Storage Limits | Begrenzung des verfügbaren Daten- und Dateispeichers einer Org. |
| Running User  |  Benutzer, dessen Zugriffsrechte für die Anzeige eines Dashboards genutzt werden.\[^20\]  |
| Report Folder  |  Ordnerstruktur zur Organisation und Freigabe von Reports.\[^20\]  |
| Bucket Field / Bucketing  |  Gruppierung von Werten in benutzerdefinierte Kategorien innerhalb eines Reports.\[^21\]  |
| Conditional Highlighting  |  Farbliche Hervorhebung von Reportwerten anhand von Bereichen.\[^21\]  |
| Einstein Analytics / Tableau  CRM  |  Erweiterte Analyseplattform für tiefgehende Datenvisualisierung.\[^21\]  |

 

**Schritt 1.6 – Vertrieb (Sales Cloud)** 

| Begriff | Erklärung |
| :---- | :---- |
| Lead | Potenzieller Kunde, der noch nicht als Account/Contact/Opportunity qualifiziert ist. |
| Lead Conversion | Prozess der Umwandlung eines Leads in Account, Contact und optional Opportunity. |
| Account | Datensatz für ein Unternehmen oder eine Organisation als Kunde. |
| Contact | Datensatz für eine Einzelperson, meist verknüpft mit einem Account. |
| Opportunity | Datensatz für einen potenziellen Verkaufsabschluss. |
| Opportunity Stage | Phase im Verkaufsprozess einer Opportunity (z. B. Prospecting, Closed Won). |
| Sales Path | Visuelle Anleitung, die Nutzer durch die Stufen eines Prozesses führt. |
| Pricebook | Sammlung von Produkten mit zugehörigen Preisen. |
| Product | Ein verkaufsfähiger Artikel oder eine Dienstleistung im System. |
| Quote | Formales Preisangebot für einen Kunden basierend auf einer Opportunity. |
| Campaign | Marketingaktion zur Nachverfolgung von Leads/Kontakten und ROI. |
| Campaign Influence | Funktion zur Zuordnung mehrerer Kampagnen zu einer Opportunity. |
| Forecasting | Prognosewerkzeug zur Vorhersage künftiger Verkaufszahlen. |
| Contact Role | Definiert die Rolle eines Kontakts im Kontext einer Opportunity. |
| Forecast (Prognose) | Vorhersage erwarteter Umsätze basierend auf Opportunities. |
| Product / Price Book | Verkaufsartikel und deren Preislisten. |
| Person Account | Account-Typ zur Abbildung von B2C-Einzelkunden ohne separaten Contact. |

 

**Schritt 1.7 – Service (Service Cloud)** 

| Begriff  | Erklärung  |
| :---- | :---- |
| Case | Datensatz zur Nachverfolgung eines Kundenanliegens/-problems. |
| Case Assignment Rule | Regel zur automatischen Zuweisung neuer Cases. |
| Case Escalation Rule | Regel zur automatischen Eskalation nicht bearbeiteter Cases. |
| Knowledge Article | Wissensdatenbank-Artikel zur Selbsthilfe oder internen Nutzung. |
| Knowledge Article Lifecycle | Status eines Artikels: Draft, Published, Archived. |
| Omni-Channel | Funktion zur automatischen Verteilung von Arbeit (Cases, Chats) an verfügbare Agenten. |
| Service Console | Speziell für Support-Mitarbeiter optimierte Arbeitsoberfläche. |
| Entitlement | Definiert den Support-Umfang, den ein Kunde erhält. |
| Macro | Vordefinierte Abfolge von Aktionen, die ein Agent mit einem Klick ausführen kann. |
| Case Management  |  Prozesse zur Erfassung, Zuweisung und Bearbeitung von Cases.  |
| Live Agent / Chat  |  Echtzeit-Chat-Support-Funktion. |

 

**Schritt 1.8 – Produktivität & Zusammenarbeit** 

| Begriff | Erklärung |
| :---- | :---- |
| Chatter | Salesforce-interne Social-Collaboration-Funktion. |
| Task | Aktivität mit Fälligkeitsdatum, die einem Nutzer zugewiesen ist. |
| Event | Terminbasierte Aktivität im Kalender. |
| Activity Timeline | Chronologische Übersicht von Aufgaben und Ereignissen auf einem Datensatz. |
| Email Integration | Verbindung von Salesforce mit Outlook oder Gmail. |
| Global Search | Salesforce-weite Suchfunktion über mehrere Objekte hinweg. |
| Favorites | Möglichkeit, häufig genutzte Seiten für schnellen Zugriff zu markieren. |
| Lightning App | Zusammenstellung von Objekten, Tabs und Branding zu einer Anwendungseinheit. |

 

**Schritt 1.9 – Lightning App Builder & Anpassung** 

| Begriff | Erklärung |
| :---- | :---- |
| Home Page Layout | Konfigurierbare Startseite, die je nach Nutzerprofil unterschiedlich sein kann. |
| App Manager | Bereich im Setup zur Verwaltung von Lightning Apps. |
| Custom Tab | Nutzerdefinierter Reiter zur Anzeige eines Objekts oder Inhalts. |
| Theme/Branding | Visuelle Anpassung von Farben und Logo einer Org. |
| Path (UI) | Visuelle Prozessleiste, die den Fortschritt eines Datensatzes zeigt. |

 

**Schritt 1.10 – KI und Agentforce** 

| Begriff | Erklärung |
| :---- | :---- |
| Agentforce | Salesforce-Plattform für autonome KI-Agenten innerhalb von Geschäftsprozessen. |
| Agent Builder | Tool zum Erstellen, Testen und Konfigurieren von Agentforce-Agenten. |
| Prompt | Anweisung/Text, der das Verhalten eines KI-Agenten oder einer Einstein-Funktion steuert. |
| Agent Action | Konkrete Aufgabe, die ein Agentforce-Agent ausführen kann (z. B. Datensatz aktualisieren). |
| Conversation Preview | Testfunktion im Agent Builder zur Vorschau des Agentenverhaltens vor Veröffentlichung. |
| Einstein | Sammelbegriff für Salesforces KI-Funktionen (Vorhersagen, generative KI). |
| Trust Layer | Sicherheitsschicht, die sicherstellt, dass KI-Funktionen Kundendaten datenschutzkonform verarbeiten. |
| Guardrails | Regeln/Beschränkungen, die das Verhalten eines KI-Agenten einschränken. |

 

**Schritt 1.11 – Karriere, Rollen & Ökosystem** 

| Begriff | Erklärung |
| ----- | :---- |
| Salesforce Administrator | Rolle, die Salesforce konfiguriert, Nutzer verwaltet und den täglichen Betrieb unterstützt. |
| Salesforce Developer | Rolle, die individuelle Lösungen mittels Code (Apex, LWC) entwickelt. |
| Salesforce Architect | Rolle, die technische Gesamtlösungen und Systemdesign verantwortet. |
| Salesforce Consultant | Rolle, die Kundenanforderungen in Salesforce-Lösungen übersetzt. |
| Trailblazer | Bezeichnung für aktive Mitglieder der Salesforce-Community/des Ökosystems. |
| Superbadge | Praxisorientierte, anspruchsvollere Trailhead-Auszeichnung mit realistischen Szenarien. |
| Ohana | Salesforce-Begriff (hawaiianisch für "Familie") für die gesamte Unternehmens- und NutzerCommunity. |
| Certification Maintenance | Pflicht zur regelmäßigen Aktualisierung von Zertifizierungen über Trailhead-Module. |

**Schritt 1.6 – Datenmanagement & Integration /** **Plattformarchitektur & Konzepte**

| Begriff | Erklärung |
| :---- | :---- |
| Data Import (Setup Tool) | In-App-Werkzeug für den Import über den Browser. |
| Mass Update/Delete | Massenbearbeitung/-löschung mehrerer Datensätze gleichzeitig. |
| Data Export Service | Automatisierter, periodischer Export aller Organisationsdaten.\] |
| Salesforce Connect | Integration externer Datenquellen als External Objects in Echtzeit. |
| API (Application Programming Interface) | Schnittstelle für programmatischen Zugriff auf Salesforce-Daten. |
| REST API / SOAP API | Zwei Hauptprotokolle für den Datenaustausch mit Salesforce. |
| Bulk API | API für performanten Massendatenaustausch. |
| Web-to-Lead / Web-to-Case | Formulargenerierte Erfassung von Leads/Cases über Webseiten. |
| MuleSoft | Integrationsplattform für komplexe System-zu-System-Anbindungen. |
| Multi-Tenant Architecture | Architekturprinzip, bei dem mehrere Kunden dieselbe Infrastruktur teilen, logisch getrennt. |
| Metadata-Driven Development | Konfigurationsbasierte statt Code-basierte Anpassung der Plattform. |
| Change Set | Mechanismus zur Migration von Metadaten zwischen verbundenen Orgs. |
| Deployment | Übertragung von Konfigurationen/Code von einer Umgebung in eine andere. |
| Metadata API | API zum programmatischen Verwalten von Metadaten (Objekte, Layouts, etc.). |
| Salesforce DX (SFDX) | Entwicklertoolset für modernes, quellcodebasiertes Deployment. |
| Unlocked Package / Managed Package | Paketierungsformen zur Verteilung von Metadaten/Code. |
| Release (Seasonal Release) | Dreimal jährliche automatische Plattform-Updates (Spring, Summer, Winter). |
| Trust Status / Trailblazer.me | Statusseite bzw. zentrales Identitätsprofil für Salesforce-Nutzer. |

**Schritt 1.10 – Weitere Cloud-Produkte & Begriffe** 

| Begriff | Erklärung |
| :---- | :---- |
| CPQ (Configure, Price, Quote) | Tool zur Konfiguration komplexer Angebote. |
| Einstein AI | Sammelbegriff für KI-Funktionen innerhalb Salesforce (Predictions, Bots, Generative AI). |
| Slack Integration | Anbindung von Slack als Kollaborationsebene innerhalb Salesforce. |
| Setup Audit Trail | Protokoll aller administrativen Konfigurationsänderungen. |
| Health Check | Tool zur Bewertung und Verbesserung der Sicherheitseinstellungen einer Org. |
| Optimizer | Analysetool zur Identifikation ungenutzter/optimierbarer Funktionen. |
| License (User License / Permission Set License) | Bestimmt grundsätzliche Funktionszugänge eines Benutzers. |
| Feature License | Zusätzliche Lizenz für spezifische Funktionen (z. B. Marketing User). |

 

 