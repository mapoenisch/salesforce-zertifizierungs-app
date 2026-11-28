// views/settings.js — Theme, Tagesziel, Startdatum, JSON-Export/-Import.

import { state, saveSettings } from "../state.js";
import { exportData, readBackup, restoreBackup, resetAllProgress } from "../exportImport.js";
import { el, clear, confirmDialog, isCalendarDate } from "../utils.js";

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
    ["foundations", "Salesforce Certified Platform Foundations"],
    ["administrator", "Salesforce Certified Platform Administrator (mit Foundations-Grundwissen)"],
    ["administrator-full", "Salesforce Certified Platform Administrator (inkl. Foundations)"]
  ].forEach(([value, text]) => {
    pathSelect.appendChild(el("option", { text, attrs: { value } }));
  });
  pathSelect.value = state.settings.certificationPath;
  const pathStatus = el("p", { class: "item-hint settings-goal-status", attrs: { role: "status" } });
  const toDashBtn = el("button", {
    class: "secondary-btn",
    text: "Zum Dashboard",
    attrs: { type: "button", hidden: "" },
    on: { click: () => ctx.navigate("#/dashboard") }
  });
  pathSelect.addEventListener("change", () => {
    saveSettings({ certificationPath: pathSelect.value });
    pathStatus.textContent = "Lernpfad gespeichert.";
    toDashBtn.hidden = false;
  });
  pathSelectLabel.appendChild(pathSelect);
  pathCard.appendChild(pathSelectLabel);
  pathCard.appendChild(pathStatus);
  pathCard.appendChild(toDashBtn);
  pathCard.appendChild(el("p", {
    class: "item-hint",
    text:
      "Dein Fortschritt bleibt beim Wechsel erhalten. Der reine Administrator-Pfad baut auf Foundations-Grundwissen auf. " +
      "Für den Einstieg in beide Themen wähle Administrator (inkl. Foundations)."
  }));
  container.appendChild(pathCard);

  // Tagesziel + Startdatum
  const goalCard = el("div", { class: "card settings-goal-card" });
  goalCard.appendChild(el("h2", { text: "Lernziel" }));

  const goalStatus = el("p", { class: "item-hint settings-goal-status", attrs: { role: "status" } });

  const minutesLabel = el("label", { class: "filter-field" });
  minutesLabel.appendChild(el("span", { text: "Tagesziel (Minuten)" }));
  const minutesInput = el("input", { attrs: { type: "number", min: "5", max: "120", value: String(state.settings.dailySessionMinutesTarget) } });
  minutesInput.addEventListener("change", () => {
    const minutes = minutesInput.valueAsNumber;
    if (Number.isInteger(minutes) && minutes >= 5 && minutes <= 120) {
      saveSettings({ dailySessionMinutesTarget: minutes });
      goalStatus.classList.remove("status-error");
      minutesInput.removeAttribute("aria-invalid");
      minutesInput.value = String(minutes);
      goalStatus.textContent = `Tagesziel auf ${minutes} Min. gespeichert.`;
    } else {
      goalStatus.classList.add("status-error");
      minutesInput.setAttribute("aria-invalid", "true");
      goalStatus.textContent = "Ungültiges Tagesziel (erlaubt: 5 bis 120 Minuten).";
    }
  });
  minutesLabel.appendChild(minutesInput);
  goalCard.appendChild(minutesLabel);

  const startLabel = el("label", { class: "filter-field" });
  startLabel.appendChild(el("span", { text: "Startdatum der 12-Wochen-Planung" }));
  const startInput = el("input", { attrs: { type: "date", value: state.settings.startDate } });
  startInput.addEventListener("change", () => {
    if (isCalendarDate(startInput.value)) {
      saveSettings({ startDate: startInput.value });
      goalStatus.classList.remove("status-error");
      startInput.removeAttribute("aria-invalid");
      startInput.value = state.settings.startDate;
      goalStatus.textContent = `Startdatum auf ${startInput.value} gespeichert.`;
    } else {
      goalStatus.classList.add("status-error");
      startInput.setAttribute("aria-invalid", "true");
      goalStatus.textContent = "Ungültiges Datum (erwartet JJJJ-MM-TT).";
    }
  });
  startLabel.appendChild(startInput);
  goalCard.appendChild(startLabel);
  goalCard.appendChild(goalStatus);

  container.appendChild(goalCard);

  // Export/Import
  const dataCard = el("div", { class: "card" });
  dataCard.appendChild(el("h2", { text: "Sicherung" }));
  dataCard.appendChild(el("p", {
    class: "item-hint",
    text: "Sichert Lernstand und Einstellungen als JSON-Datei. Beim Einspielen eines Lernstands werden bestehende Sitzungsentwürfe verworfen. Eine Sicherung ohne Lernaktivität stellt nur Einstellungen wieder her."
  }));

  const exportBtn = el("button", { class: "primary-btn", text: "Lernstand exportieren", attrs: { type: "button" } });
  const status = el("p", { attrs: { role: "status" } });
  exportBtn.addEventListener("click", async () => {
    try {
      await exportData();
    } catch {
      status.textContent = "Die Sicherung konnte nicht exportiert werden.";
    }
  });
  dataCard.appendChild(exportBtn);

  const importBtn = el("button", { class: "secondary-btn", text: "Lernstand importieren…", attrs: { type: "button" } });
  const importInput = el("input", { attrs: { type: "file", accept: ".json,application/json", hidden: "" } });
  let dataOperationPending = false;
  importBtn.addEventListener("click", () => {
    if (!dataOperationPending) importInput.click();
  });
  importInput.addEventListener("change", async () => {
    const file = importInput.files[0];
    importInput.value = "";
    if (!file || dataOperationPending) return;
    dataOperationPending = true;
    importBtn.setAttribute("aria-disabled", "true");
    status.textContent = "";
    try {
      const backup = await readBackup(file);
      if (ctx.signal.aborted) return;
      importBtn.removeAttribute("aria-disabled");
      importBtn.focus();
      const confirmed = await confirmDialog(
        backup.settingsOnly
          ? "Diese Sicherung enthält nur Einstellungen. Dein Lernstand und deine Sitzungsentwürfe bleiben erhalten."
          : `Die Sicherung enthält ${backup.progress.length} Fortschrittsdatensätze und ` +
            `${backup.activity.length} Aktivitäten. Sie ersetzt deinen Lernstand und verwirft deine Sitzungsentwürfe.`,
        {
          confirmText: backup.settingsOnly ? "Einstellungen übernehmen" : "Lernstand ersetzen",
          cancelText: "Abbrechen",
          danger: !backup.settingsOnly,
          signal: ctx.signal
        }
      );
      if (!confirmed || ctx.signal.aborted) return;
      importBtn.setAttribute("aria-disabled", "true");
      const { settingsSaved, draftsCleared } = await restoreBackup(backup);
      document.documentElement.dataset.theme = state.settings.theme;
      themeToggle.textContent = state.settings.theme === "dark" ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln";
      pathSelect.value = state.settings.certificationPath;
      minutesInput.value = state.settings.dailySessionMinutesTarget;
      startInput.value = state.settings.startDate;
      if (backup.settingsOnly) {
        status.textContent = settingsSaved ? "Einstellungen übernommen." : "Die Einstellungen konnten nicht übernommen werden.";
      } else {
        status.textContent = [
          "Lernstand importiert.",
          !settingsSaved && "Die Einstellungen konnten nicht übernommen werden.",
          !draftsCleared && "Die Sitzungsentwürfe konnten nicht gelöscht werden."
        ].filter(Boolean).join(" ");
      }
    } catch (error) {
      status.textContent = `Import fehlgeschlagen. ${error.message}`;
    } finally {
      importBtn.removeAttribute("aria-disabled");
      dataOperationPending = false;
    }
  });
  dataCard.append(importBtn, importInput, status);

  container.appendChild(dataCard);

  // Gefahrenzone: Lernfortschritt zurücksetzen
  const dangerCard = el("div", { class: "card danger-zone" });
  dangerCard.appendChild(el("h2", { text: "Gefahrenzone" }));
  dangerCard.appendChild(el("p", {
    class: "item-hint",
    text: "Löscht Wiederholungen, Ergebnisse, Statistiken und Sitzungsentwürfe. Darstellung, Lernpfad und Tagesziel bleiben erhalten."
  }));

  const resetBtn = el("button", { class: "danger-btn", text: "Lernfortschritt löschen", attrs: { type: "button" } });
  const resetStatus = el("p", { attrs: { role: "status" } });
  resetBtn.addEventListener("click", async () => {
    if (dataOperationPending) return;
    dataOperationPending = true;
    resetStatus.textContent = "";
    try {
      const confirmed = await confirmDialog("Lernfortschritt und Sitzungsentwürfe endgültig löschen?", {
        confirmText: "Fortschritt löschen",
        cancelText: "Abbrechen",
        danger: true,
        signal: ctx.signal
      });
      if (!confirmed || ctx.signal.aborted) return;
      resetBtn.setAttribute("aria-disabled", "true");
      const { settingsSaved, draftsCleared } = await resetAllProgress();
      if (!settingsSaved || !draftsCleared) {
        resetStatus.textContent = [
          "Lernstand gelöscht.",
          !settingsSaved && "Das Startdatum konnte nicht gespeichert werden.",
          !draftsCleared && "Die Sitzungsentwürfe konnten nicht gelöscht werden."
        ].filter(Boolean).join(" ");
        return;
      }
      if (!ctx.signal.aborted) ctx.navigate("#/dashboard");
    } catch {
      resetStatus.textContent = "Der Lernstand konnte nicht gelöscht werden.";
    } finally {
      resetBtn.removeAttribute("aria-disabled");
      dataOperationPending = false;
    }
  });
  dangerCard.append(resetBtn, resetStatus);

  container.appendChild(dangerCard);
}
