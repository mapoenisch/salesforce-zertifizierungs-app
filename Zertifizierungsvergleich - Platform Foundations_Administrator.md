# **Zertifizierungsvergleich**

---

# **●  Salesforce Platform Foundations**  

## **●  Salesforce Platform Administrator** 

## **Salesforce CRM & Customer 360 — Grundlagen**

- **Customer 360**: Einheitliche Kundensicht über Sales, Service, Marketing, Commerce, IT hinweg (salesforce.com/ap/blog, offiziell).

- **Lightning Experience**: App Launcher, Navigation Bar, Setup-Zahnrad, Console Apps.

- **Standardobjekte**: Lead → (Convert) → Account \+ Contact (+ optional Opportunity); Case; Campaign; Activities (Task/Event); Reports & Dashboards.

- **Beziehungstypen**: Lookup (lose), Master-Detail (starke Verknüpfung, kaskadierendes Löschen, vererbte Sicherheit), Many-to-Many über Junction-Objekte.

- **Sicherheitsmodell, 4 Schichten**: Organisationsebene (Login Hours, IP-Ranges, MFA) → Objektebene (Profile/Permission Sets, CRUD) → Feldebene (Field-Level Security) → Datensatzebene (Org-Wide Defaults als restriktivste Basis, dann Role Hierarchy, Sharing Rules, Manual Sharing, Teams als *erweiternde* Mechanismen — Sharing kann nie über OWD hinaus einschränken).

- **Automatisierung**: Flow ist das aktuelle Primärwerkzeug; Workflow Rules und Process Builder sind offiziell abgekündigt (Support-Ende 31.12.2025), gelten aber weiterhin als **Legacy-Prüfungswissen** (Abgrenzung zu Flow muss erkannt werden).

- **Datenqualität**: Data Loader, Import Wizard, Duplicate Rules, Matching Rules, Validation Rules.

Diese Grundlagen bilden das inhaltliche Fundament sowohl für Foundations- als auch für Administrator-Zertifizierung

## 

## **Kennzahlenvergleich** 

## **●  offiziell verifiziert, 15.08.2026 live abgerufen**

| Kriterium | Platform Foundations | Platform Administrator |
| :---- | :---- | :---- |
| **Frühere Bezeichnung** | Salesforce Certified  Associate | Salesforce Certified Administrator (ADM-201) |
| **Fragen** | 40 Multiple-Choice \+ bis zu 5 unbewertete | 60 Multiple-Choice/-Select  \+ bis zu 5 unbewertete |
| **Zeit** | 70 Minuten | 105 Minuten |
| **Bestehensgrenze** | 62 % | 68 %: Englisch / 65 %: Japanisch |
| **Kosten** | 75 USD, Retake kostenlos | 200 USD, Retake 100 USD |
| **Voraussetzung** | Keine | Keine (empfohlen: 6+ Monate Praxiserfahrung) |
| **Exam-Version** | Winter '25 | Summer '25 |
| **Domänen** | 4 | 8 |
| **Wartung/Renewal** | Keine erforderlich | Jährliche Maintenance-Badge auf Trailhead erforderlich |

# 

# **Exam Outlines(Prüfungsübersicht)**

# **●  Platform Foundations \+ Platform Administrator**

## **Exam Outline Platform Foundations**

## **●  vollständig, wörtlich \+ deutsche Übersetzung**

### **Salesforce Ecosystem — 32%**

- Given a scenario, describe various resources available to learn and apply in-demand Salesforce skills.  
- Beschreibe anhand eines Szenarios verschiedene verfügbare Ressourcen zum

- Given a use case, identify which Salesforce Customer 360 product offerings could be used.  
- Identifiziere anhand eines Anwendungsfalls, welche Salesforce-Customer-360- Produktangebote genutzt werden könnten.

- Describe how companies use Salesforce.  
- Beschreibe, wie Unternehmen Salesforce einsetzen.

- Differentiate between various job roles and career paths in the Salesforce ecosystem.  
- Unterscheide zwischen verschiedenen Jobrollen und Karrierewegen im Salesforce-Ökosystem.


### **Navigation — 28%**

- Given a scenario, identify how a user can locate and access necessary information.  
- Identifiziere anhand eines Szenarios, wie ein Benutzer die benötigten Informationen finden und darauf zugreifen kann.

- Given a scenario, identify where Salesforce customization takes place.  
- Identifiziere anhand eines Szenarios, wo die Salesforce-Anpassung stattfindet.

### **Data Model — 25%**

- Explain the relationship between the core standard objects (account, contact, lead, opportunity, case).  
- Erkläre die Beziehung zwischen den zentralen Standardobjekten (Account, Contact, Lead, Opportunity, Case).

- Given a scenario, determine which feature to use to ensure data visibility.  
- Bestimme anhand eines Szenarios, welche Funktion verwendet werden sollte, um die Datensichtbarkeit/-transparenz sicherzustellen.

- Given a scenario, determine which tool to use to ensure data integrity.  
- Bestimme anhand eines Szenarios, welches Werkzeug verwendet werden sollte, um die Datenintegrität sicherzustellen.

### **Reports & Dashboards — 15%**

- Describe reports on Salesforce.  
- Beschreibe Berichte in Salesforce.

- Describe dashboards on Salesforce.  
- Beschreibe Dashboards in Salesforce.

## **Exam Outline Platform Foundations**

## **●  vollständig, wörtlich \+ deutsche Übersetzung**

### **Configuration and Setup — 15%**

- Describe the information found in the company settings (fiscal year, business hours, currency management, default settings).  
- Beschreibe die in den Unternehmenseinstellungen enthaltenen Informationen (Geschäftsjahr, Geschäftszeiten, Währungsverwaltung, Standardeinstellungen).

- Distinguish and understand the administration of declarative configuration of the UI (UI/UX settings, app menu, list views, global actions, Lightning App Builder).  
- Unterscheide und verstehe die Verwaltung der deklarativen UI-Konfiguration/Benutzeroberfläche (UI/UX-Einstellungen, App-Menü, Listenansichten, globale Aktionen, Lightning App Builder).

- Given a scenario, demonstrate proper setup and maintenance of users (unique username, locales, working hours, license distribution/types, deactivation implications, feature licenses, login methods).  
- Demonstriere anhand eines Szenarios die ordnungsgemäße Einrichtung und Pflege/Verwaltung von Benutzern (eindeutiger Benutzername, Gebietsschemata, Arbeitszeiten, Lizenzverteilung/-typen, Auswirkungen einer Deaktivierung, Funktionslizenzen, Anmeldemethoden).

- Explain organization Security Controls (Identity verification, Setup Audit Trail, Login Hours, Session Settings, agent access).  
- Erkläre die Sicherheitskontrollen der Organisation (Identitätsprüfung, Setup Audit Trail, Anmeldezeiten, Sitzungseinstellungen, Agentenzugriff).

- Given a user request scenario, apply appropriate security controls (Teams, Sharing hierarchy, public groups, org-wide defaults, roles, subordinates, role hierarchy, report/dashboard folders).  
- Wende anhand eines Benutzeranfrageszenarios geeignete Sicherheitskontrollen an (Teams, Freigabehierarchie, öffentliche Gruppen, organisationsweite Standardwerte, Rollen, Untergeordnete, Rollenhierarchie, Berichts-/Dashboard-Ordner).

- Given a scenario, determine appropriate use of a custom profile or permission set (profile settings, permission set group, muting).  
- Bestimme anhand eines Szenarios die geeignete Verwendung eines benutzerdefinierten Profils oder Berechtigungssatzes (Profileinstellungen, Berechtigungssatzgruppe, Muting/Deaktivierung von Berechtigungen).

### **Object Manager and Lightning App Builder — 15%**

- Describe standard object architecture and relationship model (standard object, parent/child, master-detail/lookup/junction relationships, record types, Schema Builder).  
- Beschreibe die Standardobjektarchitektur und das Beziehungsmodell (Standardobjekt, Parent/Child-, Master-Detail-/Lookup-/Junction-Beziehungen, Record Types, Schema Builder).

- Explain creation, deletion, customization of fields and page layouts on standard/custom objects; implications of deleting fields (roll-up summaries, cross-object formulas, picklist dependencies, relationship fields).  
- Erkläre das Erstellen, Löschen und Anpassen von Feldern und Seitenlayouts für Standard-/benutzerdefinierte Objekte; Auswirkungen des Löschens von Feldern (Roll-up-Summaries, Cross-Object-Formeln, Picklist-Abhängigkeiten, Beziehungsfelder).

- Given a scenario, determine how to create/assign page layouts, visibility on Lightning pages, record types, business processes for custom/standard objects (quick actions, global actions).  
- Bestimme anhand eines Szenarios, wie Seitenlayouts, die Sichtbarkeit auf Lightning-Seiten, Record Types und Geschäftsprozesse für benutzerdefinierte/Standardobjekte erstellt/zugewiesen werden (Quick Actions, Global Actions).


### **Sales and Marketing Applications — 10%**

- Given a scenario, identify capabilities/implications of the sales process (leads, opportunities, path).  
- Identifiziere anhand eines Szenarios die Fähigkeiten/Auswirkungen des Verkaufsprozesses (Leads, Opportunities, Path).

- Given a scenario, apply sales productivity features via opportunity tools (dashboards, lead scoring, Einstein for Sales, opportunity scoring, grading, home page assistant, forecasting, territory management).  
- Wende anhand eines Szenarios Funktionen zur Steigerung der Vertriebsproduktivität über Opportunity-Tools an (Dashboards, Lead-Scoring, Einstein for Sales, Opportunity Scoring, Grading, Home Page Assistant, Forecasting, Territory Management).

- Describe lead automation tools and campaign management (leads, lead convert, lead assignment rules, campaign, campaign members).  
- Beschreibe Lead-Automatisierungstools und Kampagnenmanagement (Leads, Lead Convert, Lead Assignment Rules, Campaign, Campaign Members).

### **Service and Support Applications — 10%**

- Describe case management capabilities (case, case assignment rules, queues).  
- Beschreibe die Funktionen des Case-Managements (Case, Case Assignment Rules, Queues).

- Given a scenario, identify how to automate case management (support process, case auto-response rules, case escalation, Einstein for Service).  
- Identifiziere anhand eines Szenarios, wie Case-Management automatisiert werden kann (Support Process, Case Auto-Response Rules, Case Escalation, Einstein for Service).

### **Productivity and Collaboration — 10%**

- Describe activity management (tasks, events).  
- Beschreibe das Aktivitätsmanagement (Tasks, Events).

- Describe Chatter features (groups, accessibility, internal/external users).  
- Beschreibe Chatter-Funktionen (Groups, Barrierefreiheit, interne/externe Benutzer).

- Describe Salesforce mobile app capabilities (Lightning page, app menu, visibility, branding, launchpad).  
- Beschreibe die Funktionen der Salesforce-Mobile-App (Lightning Page, App-Menü, Sichtbarkeit, Branding, Launchpad).

- Identify AppExchange use cases (managed/unmanaged packages, publishing rights, AgentExchange prompts, flows).  
- Identifiziere Anwendungsfälle für AppExchange (verwaltete/nicht verwaltete Pakete, Veröffentlichungsrechte, AgentExchange-Prompts, Flows).

### **Data and Analytics Management — 17% (größte Domäne)**

- Describe considerations for importing, updating, transferring, mass deleting, exporting, backing up data (Archival, Apex Data Loader, Import Wizard).  
- Beschreibe Überlegungen zum Importieren, Aktualisieren, Übertragen, Massendeleten, Exportieren und Sichern von Daten (Archivierung, Apex Data Loader, Import Wizard).

- Describe data validation tools (duplicate rules, matching rules, validation rules).  
- Beschreibe Datenvalidierungswerkzeuge (Duplikatregeln, Matching Rules, Validierungsregeln).

- Describe report/report-type creation options (join objects, with/without records, field renaming, formulas, bucket fields, join reports, chart settings, hide details, grouping totals, troubleshooting).  
- Beschreibe Optionen zum Erstellen von Berichten/Berichtstypen (zusammengeführte Objekte, mit/ohne Datensätze, Feldumbenennung, Formeln, Bucket Fields, Join Reports, Diagrammeinstellungen, Details ausblenden, Gruppierungssummen, Fehlerbehebung).

- Describe the sharing model's impact on reports (visibility, folder structure, sharing fields).  
- Beschreibe die Auswirkungen des Freigabemodells auf Berichte (Sichtbarkeit, Ordnerstruktur, Freigabefelder).

- Describe dashboard creation/modification options (widgets, data sources, chart types, subscribing, dynamic dashboards, org licensing limits, "view dashboard as", scheduled refresh, filters).  
- Beschreibe Optionen zum Erstellen/Ändern von Dashboards (Widgets, Datenquellen, Diagrammtypen, Abonnieren, dynamische Dashboards, Lizenzgrenzen der Organisation, „Dashboard anzeigen als“, geplante Aktualisierung, Filter).

### **Automation — 15%**

- Given a scenario, identify the appropriate automation solution (escalation rules, case/lead assignment rules, default automation user, AI).  
- Identifiziere anhand eines Szenarios die geeignete Automatisierungslösung (Eskalationsregeln, Case-/Lead-Zuweisungsregeln, Standard-Automatisierungs- benutzer, KI).

- Describe Flow capabilities/use cases/configuration (screen flows, record-triggered flows, autolaunched flows, order of execution).  
- Beschreibe die Funktionen, Anwendungsfälle und Konfiguration von Flow (Screen Flows, record-triggered Flows, autolaunched Flows, Ausführungsreihenfolge).

- Describe approval process capabilities (approver criteria, rejections, approvals).  
- Beschreibe die Funktionen von Genehmigungsprozessen (Genehmigerkriterien, Ablehnungen, Genehmigungen).

### **Agentforce — 8%**

- Describe Agentforce capabilities and use cases (use-case scenarios, when AI is appropriate, security, troubleshooting agent permissions).  
- Beschreibe die Fähigkeiten und Anwendungsfälle von Agentforce (Use-Case-Szenarien, wann KI geeignet ist, Sicherheit, Fehlerbehebung bei Agent-Berechtigungen).

- Explain how to maintain/update/install prompts and instructions in Agent Builder (light testing, conversation preview).  
- Erkläre, wie Prompts und Anweisungen im Agent Builder gepflegt, aktualisiert und installiert werden (Light Testing, Conversation Preview).

