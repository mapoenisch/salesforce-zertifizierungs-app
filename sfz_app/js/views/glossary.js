// views/glossary.js — Durchsuchbares Glossar aller Vokabeln mit Filtern und persönlichem Wiederholungsstatus.

import { state, domainMap, pathCertifications, activePlatform } from "../state.js";
import { platformConfig, platformOfContent } from "../platforms.js";
import { el, clear, certLabel } from "../utils.js";

export async function render(container) {
  clear(container);
  container.appendChild(el("h1", { text: "Glossar" }));

  const activePath = state.settings.certificationPath;
  const certifications = pathCertifications(activePath);
  const platform = activePlatform();
  // Deckt der Lernpfad mehrere Zertifizierungen ab (administrator-full, hubspot-all), lässt sich
  // zwischen ihnen filtern; sonst ist der Filter fest auf die eine Zertifizierung des Pfads gesetzt.
  const multiCert = certifications.length > 1;
  const filters = { search: "", certification: multiCert ? "both" : certifications[0], examDomainId: "all", cefr: "both" };
  const domains = [...domainMap().values()].filter((d) => certifications.includes(d.certification));

  const formCard = el("div", { class: "card" });
  const searchInput = el("input", { attrs: { type: "text", placeholder: "Begriff suchen…" } });
  searchInput.addEventListener("input", () => { filters.search = searchInput.value.toLowerCase(); renderList(); });
  formCard.appendChild(el("label", { class: "filter-field" }, [el("span", { text: "Suche" }), searchInput]));

  const row = el("div", { class: "filter-row" });
  if (multiCert) {
    row.appendChild(selectField("Zertifizierung", filters, "certification", [
      ["both", "Alle im Lernpfad"], ...certifications.map((c) => [c, certLabel(c)])
    ], renderListRef));
  }
  row.appendChild(selectField(platform.domainLabel, filters, "examDomainId", [
    ["all", "Alle"], ...domains.map((d) => [d.id, `${d.name} (${certLabel(d.certification)})`])
  ], renderListRef));
  if (platform.usesCefr) {
    row.appendChild(selectField("CEFR-Level", filters, "cefr", [
      ["both", "Beide"], ["B1", "B1"], ["B2", "B2"]
    ], renderListRef));
  }
  formCard.appendChild(row);
  container.appendChild(formCard);

  const listHost = el("div", { class: "glossary-list" });
  container.appendChild(listHost);

  function renderListRef() { renderList(); }

  function renderList() {
    clear(listHost);
    const items = state.content.vocabulary.filter((v) => {
      // Grundfilter: nur Inhalte des aktiven Lernpfads — trennt Salesforce- und HubSpot-Ebene.
      if (!certifications.includes(v.certification)) return false;
      if (filters.certification !== "both" && v.certification !== filters.certification) return false;
      if (filters.examDomainId !== "all" && v.examDomainId !== filters.examDomainId) return false;
      if (filters.cefr !== "both" && v.cefr !== filters.cefr) return false;
      if (filters.search && !v.term.toLowerCase().includes(filters.search) && !v.germanExplanation.toLowerCase().includes(filters.search)) return false;
      return true;
    });

    if (items.length === 0) {
      listHost.appendChild(el("p", { text: "Keine Treffer." }));
      return;
    }

    items.forEach((v) => listHost.appendChild(renderCard(v)));
  }

  renderList();
}

function renderCard(v) {
  const domain = domainMap().get(v.examDomainId);
  const progress = state.progressByContentId.get(v.id);
  const statusText = !progress
    ? "Noch nicht gelernt"
    : progress.flag === "intro"
    ? `Kennengelernt, erste Abfrage ab ${progress.nextReviewDate}`
    : progress.flag === "relearn"
    ? "Muss erneut gelernt werden"
    : progress.flag === "later"
    ? "Später wiederholen"
    : `Wiederholungen: ${progress.repetitions}, nächste Wiederholung: ${progress.nextReviewDate}`;

  const exampleSentence = v.clozeSentence.replace("____", v.term);

  const card = el("div", { class: "card glossary-card" });
  card.appendChild(el("h3", { text: v.term }));
  const cfg = platformConfig(platformOfContent(v));
  const meta = [certLabel(v.certification), domain?.name || v.examDomainId];
  if (cfg.usesCefr && v.cefr) meta.push(`CEFR ${v.cefr}`);
  card.appendChild(el("p", { class: "item-hint", text: meta.join(" · ") }));
  card.appendChild(el("p", {}, [el("strong", { text: "Deutsch: " }), document.createTextNode(v.germanExplanation)]));
  const ctxText = v[cfg.contextField] || v.platformContext || v.salesforceContext || "";
  if (ctxText) card.appendChild(el("p", {}, [el("strong", { text: "Kontext: " }), document.createTextNode(ctxText)]));
  card.appendChild(el("p", { class: "example-sentence" }, [el("strong", { text: "Beispiel: " }), document.createTextNode(exampleSentence)]));
  if (v.confusableTerms?.length) {
    card.appendChild(el("p", { class: "confusable" }, [el("strong", { text: "Verwechslungsgefahr: " }), document.createTextNode(v.confusableTerms.join(", "))]));
  }
  card.appendChild(el("p", { class: "review-status" }, [el("strong", { text: "Status: " }), document.createTextNode(statusText)]));
  return card;
}

function selectField(label, filters, key, options, onChange) {
  const wrap = el("label", { class: "filter-field" });
  wrap.appendChild(el("span", { text: label }));
  const select = el("select");
  options.forEach(([value, text]) => select.appendChild(el("option", { text, attrs: { value } })));
  select.value = filters[key];
  select.addEventListener("change", () => { filters[key] = select.value; onChange(); });
  wrap.appendChild(select);
  return wrap;
}
