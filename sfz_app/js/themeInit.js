try {
  const raw = localStorage.getItem("salesforce-trainer-settings") ?? localStorage.getItem("sfz-app-settings");
  const theme = raw && JSON.parse(raw)?.theme;
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {}
