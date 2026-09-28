// views/settings.js — Theme, Tagesziel, Startdatum, JSON-Export/-Import.

import { state, saveSettings } from "../state.js";
import { exportData, importData, resetAllProgress } from "../exportImport.js";
import { el, clear, confirmDialog } from "../utils.js";

export async function render(container, ctx) {
  clear(container);
  container.appendChild(el("h1", { text: "Einstellungen" }));

  // Theme
  const themeCard = el("div", { class: "card" });
  themeCard.appendChild(el("h2", { text: "Darstellung" }));
  const themeToggle = el("button", { class: "secondary-btn", text: state.settings.theme === "dark" ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln", attrs: { type: "button" } });
  themeToggle.addEventListener("click", () => {
    const next = state.settings.theme === "dark" ? "light" : "dark";
    saveSettings({ theme: next });
    document.documentElement.dataset.theme = next;
    themeToggle.textContent = next === "dark" ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln";
  });
  themeCard.appendChild(themeToggle);
  container.appendChild(themeCard);

  // Lernpfad
  const pathCard = el("div", { class: "card" });
  pathCard.appendChild(el("h2", { text: "Lernpfad" }));
  pathCard.appendChild(el("p", { class: "item-hint", text: "Bestimmt, welche Vokabeln, Übungen, das Glossar und der Wochenplan standardmäßig angezeigt werden." }));

  const pathSelectLabel = el("label", { class: "filter-field" });
  pathSelectLabel.appendChild(el("span", { text: "Aktueller Lernpfad" }));
  const pathSelect = el("select");
  [
    ["Salesforce (Prüfungssprache Englisch)", [
      ["foundations", "Salesforce Certified Platform Foundations"],
      ["administrator", "Salesforce Certified Platform Administrator (Foundations vorausgesetzt)"],
      ["administrator-full", "Salesforce Certified Platform Administrator (inkl. Foundations)"]
    ]],
    ["HubSpot (Prüfungssprache Deutsch)", [
      ["hubspot-inbound-sales", "Inbound-Sales-Zertifizierung"],
      ["hubspot-sales-software", "Software-Zertifizierung zu HubSpot Sales Hub"],
      ["hubspot-frictionless-sales", "Reibungsloser Vertrieb"],
      ["hubspot-all", "Alle drei HubSpot-Zertifizierungen nacheinander"]
    ]]
  ].forEach(([groupLabel, entries]) => {
    const group = el("optgroup", { attrs: { label: groupLabel } });
    entries.forEach(([value, text]) => group.appendChild(el("option", { text, attrs: { value } })));
    pathSelect.appendChild(group);
  });
  pathSelect.value = state.settings.certificationPath;
  pathSelect.addEventListener("change", () => {
    saveSettings({ certificationPath: pathSelect.value });
    ctx.navigate("#/dashboard");
  });
  pathSelectLabel.appendChild(pathSelect);
  pathCard.appendChild(pathSelectLabel);
  pathCard.appendChild(el("p", {
    class: "item-hint",
    text:
      "Dein Fortschritt bleibt beim Wechsel immer erhalten. Achtung bei Pfad \"Administrator (Foundations vorausgesetzt)\": " +
      "Er zeigt bewusst keine Foundations-Inhalte — nur sinnvoll, wenn du den Foundations-Stoff bereits beherrschst. " +
      "Bist du dir unsicher, wähle stattdessen \"Administrator (inkl. Foundations)\". " +
      "Die HubSpot-Pfade prüfen auf Deutsch — dort entfallen Prüfungsenglisch und CEFR-Einstufung."
  }));
  container.appendChild(pathCard);

  // Tagesziel + Startdatum
  const goalCard = el("div", { class: "card" });
  goalCard.appendChild(el("h2", { text: "Lernziel" }));

  const minutesLabel = el("label", { class: "filter-field" });
  minutesLabel.appendChild(el("span", { text: "Tagesziel (Minuten)" }));
  const minutesInput = el("input", { attrs: { type: "number", min: "5", max: "120", value: String(state.settings.dailySessionMinutesTarget) } });
  minutesInput.addEventListener("change", () => saveSettings({ dailySessionMinutesTarget: Number(minutesInput.value) || 30 }));
  minutesLabel.appendChild(minutesInput);
  goalCard.appendChild(minutesLabel);

  const startLabel = el("label", { class: "filter-field" });
  startLabel.appendChild(el("span", { text: "Startdatum der 12-Wochen-Planung" }));
  const startInput = el("input", { attrs: { type: "date", value: state.settings.startDate } });
  startInput.addEventListener("change", () => saveSettings({ startDate: startInput.value }));
  startLabel.appendChild(startInput);
  goalCard.appendChild(startLabel);

  container.appendChild(goalCard);

  // Export/Import
  const dataCard = el("div", { class: "card" });
  dataCard.appendChild(el("h2", { text: "Sicherung" }));
  dataCard.appendChild(el("p", { class: "item-hint", text: "Sichert oder überträgt deinen kompletten Lernstand (Fortschritt, Aktivität, Einstellungen) als JSON-Datei." }));

  const exportBtn = el("button", { class: "primary-btn", text: "Lernstand exportieren", attrs: { type: "button" } });
  exportBtn.addEventListener("click", () => exportData());
  dataCard.appendChild(exportBtn);

  const importLabel = el("label", { class: "secondary-btn file-input-label", text: "Lernstand importieren…" });
  const importInput = el("input", { attrs: { type: "file", accept: "application/json" } });
  importInput.style.display = "none";
  importInput.addEventListener("change", async () => {
    const file = importInput.files[0];
    if (!file) return;
    try {
      const result = await importData(file);
      alert(`Import erfolgreich: ${result.progressCount} Fortschrittsdatensätze, ${result.activityCount} Aktivitäts-Einträge.`);
      ctx.navigate("#/dashboard");
    } catch (err) {
      alert("Import fehlgeschlagen: " + err.message);
    }
  });
  importLabel.appendChild(importInput);
  dataCard.appendChild(importLabel);

  container.appendChild(dataCard);

  // Gefahrenzone: Lernfortschritt zurücksetzen
  const dangerCard = el("div", { class: "card danger-zone" });
  dangerCard.appendChild(el("h2", { text: "Gefahrenzone" }));
  dangerCard.appendChild(el("p", {
    class: "item-hint",
    text: "Setzt alle Wiederholungen, Ergebnisse und Statistiken zurück. Nützlich, wenn du die App nur angetestet hast und jetzt richtig mit deinem Lernpfad starten willst. Theme, Lernpfad-Auswahl und Tagesziel bleiben erhalten."
  }));

  const resetBtn = el("button", { class: "danger-btn", text: "Lernfortschritt löschen", attrs: { type: "button" } });
  resetBtn.addEventListener("click", async () => {
    const confirmed = await confirmDialog("Lernfortschritt wirklich löschen? Kann nicht rückgängig gemacht werden!", {
      confirmText: "Ja",
      cancelText: "Nein",
      danger: true
    });
    if (!confirmed) return;
    await resetAllProgress();
    alert("Lernfortschritt wurde gelöscht. Du startest bei null.");
    ctx.navigate("#/dashboard");
  });
  dangerCard.appendChild(resetBtn);

  container.appendChild(dangerCard);
}
