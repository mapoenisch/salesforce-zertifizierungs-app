// platforms.js — Registry der beiden Lernplattformen (Salesforce und HubSpot).
//
// Die App bildet zwei getrennte Ebenen ab:
//   1. Salesforce  — Prüfungen auf Englisch, daher mit CEFR-Einstufung und Prüfungsenglisch-Bereich.
//   2. HubSpot     — Zertifizierungen und Assessments auf Deutsch, daher ohne Englischtraining,
//                    ohne CEFR und ohne Signalwort-Analyse.
//
// Alles, was sich zwischen den Plattformen unterscheidet (Beschriftungen, sichtbare Bereiche,
// Content-Felder), steht hier an genau einer Stelle — die Views lesen es aus, statt es selbst
// zu kennen. Neue Plattformen brauchen deshalb nur einen weiteren Eintrag.

export const PLATFORMS = {
  salesforce: {
    id: "salesforce",
    label: "Salesforce",
    appTitle: "Salesforce-Zertifizierungs-Trainer",
    // Lernpfade (settings.certificationPath), die zu dieser Plattform gehören
    paths: ["foundations", "administrator", "administrator-full"],
    // Content-Certification-Tags dieser Plattform
    certifications: ["foundations", "administrator"],
    hasEnglishTraining: true,
    usesCefr: true,
    domainLabel: "Exam-Domain",
    domainsHeading: "Fortschritt je Exam-Domain",
    coverageHeading: "Domain-Abdeckung (nach offizieller Gewichtung)",
    weightingNote: "offizielle Gewichtung laut Exam Outline",
    scenarioKicker: "Szenario lesen und beantworten",
    contextLabel: "Salesforce-Kontext",
    // Feld am Content-Objekt, das den Plattformkontext einer Vokabel enthält
    contextField: "salesforceContext",
    examLanguageNote: "Prüfungssprache Englisch — der Bereich „Prüfungsenglisch\" und die CEFR-Einstufung gehören dazu."
  },
  hubspot: {
    id: "hubspot",
    label: "HubSpot",
    appTitle: "HubSpot-Zertifizierungs-Trainer",
    paths: [
      "hubspot-sales-software",
      "hubspot-inbound-sales",
      "hubspot-frictionless-sales",
      "hubspot-all"
    ],
    certifications: [
      "hubspot-sales-software",
      "hubspot-inbound-sales",
      "hubspot-frictionless-sales"
    ],
    hasEnglishTraining: false,
    usesCefr: false,
    domainLabel: "Themenbereich",
    domainsHeading: "Fortschritt je Themenbereich",
    coverageHeading: "Abdeckung der Themenbereiche (nach redaktioneller Priorität)",
    weightingNote:
      "redaktionelle Priorität, abgeleitet aus der offiziellen Lektionsdauer — HubSpot veröffentlicht keine Prozentgewichtungen",
    scenarioKicker: "Praxis-Szenario",
    contextLabel: "HubSpot-Kontext",
    contextField: "platformContext",
    examLanguageNote: "Kurse und Assessments sind auf Deutsch verfügbar — kein Englischtraining nötig."
  }
};

export const DEFAULT_PLATFORM = "salesforce";

/** Alle Plattformen als Array, in fester Reihenfolge. */
export function allPlatforms() {
  return [PLATFORMS.salesforce, PLATFORMS.hubspot];
}

/** Plattform-ID zu einem Lernpfad (settings.certificationPath). */
export function platformOfPath(path) {
  for (const p of allPlatforms()) {
    if (p.paths.includes(path)) return p.id;
  }
  return DEFAULT_PLATFORM;
}

/**
 * Plattform-ID zu einem Content-Certification-Tag.
 * Salesforce-Inhalte tragen historisch kein platform-Feld — sie fallen deshalb auf
 * "salesforce" zurück, wenn das Tag nicht zur HubSpot-Ebene gehört.
 */
export function platformOfCertification(certification) {
  for (const p of allPlatforms()) {
    if (p.certifications.includes(certification)) return p.id;
  }
  return DEFAULT_PLATFORM;
}

/** Konfigurationsobjekt zu einer Plattform-ID oder einem Lernpfad. */
export function platformConfig(idOrPath) {
  if (PLATFORMS[idOrPath]) return PLATFORMS[idOrPath];
  return PLATFORMS[platformOfPath(idOrPath)];
}

/** Plattform eines einzelnen Content-Objekts (explizites Feld schlägt Ableitung). */
export function platformOfContent(content) {
  if (content && content.platform && PLATFORMS[content.platform]) return content.platform;
  return platformOfCertification(content?.certification);
}
