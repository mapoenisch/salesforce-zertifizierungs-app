// views/glossary.js — Durchsuchbares Glossar aller Vokabeln mit Filtern und persönlichem Wiederholungsstatus.

import { state, domainMap, pathCertifications } from "../state.js";
import { el, clear, certLabel } from "../utils.js";

const PAGE_SIZE = 40;

export async function render(container) {
  clear(container);
  container.appendChild(el("h1", { text: "Glossar" }));

  const activePath = state.settings.certificationPath;
  const certifications = pathCertifications(activePath);
  // Bei Foundations-only/Administrator-only wird der Zertifizierungsfilter gar nicht erst angezeigt
  // (fest auf den Pfad gesetzt). Nur administrator-full bietet Beide/Foundations/Administrator zur Wahl.
  const filters = { search: "", certification: activePath === "administrator-full" ? "both" : activePath, examDomainId: "all", cefr: "both" };
  const domainsById = domainMap();
  const domains = [...domainsById.values()].filter((d) => certifications.includes(d.certification));
  const indexedVocab = state.content.vocabulary.map((v) => ({
    v,
    termLower: v.term.toLowerCase(),
    explanationLower: v.germanExplanation.toLowerCase()
  }));

  const formCard = el("div", { class: "card" });
  const searchInput = el("input", { attrs: { type: "text", placeholder: "Begriff suchen…" } });
  searchInput.addEventListener("input", () => { filters.search = searchInput.value.toLowerCase(); renderList(); });
  formCard.appendChild(el("label", { class: "filter-field" }, [el("span", { text: "Suche" }), searchInput]));

  const row = el("div", { class: "filter-row" });
  if (activePath === "administrator-full") {
    row.appendChild(selectField("Zertifizierung", filters, "certification", [
      ["both", "Beide (Foundations + Administrator)"], ["foundations", "Nur Foundations"], ["administrator", "Nur Administrator"]
    ], renderListRef));
  }
  row.appendChild(selectField("Exam-Domain", filters, "examDomainId", [
    ["all", "Alle"], ...domains.map((d) => [d.id, `${d.name} (${certLabel(d.certification)})`])
  ], renderListRef));
  row.appendChild(selectField("CEFR-Level", filters, "cefr", [
    ["both", "Beide"], ["B1", "B1"], ["B2", "B2"]
  ], renderListRef));
  formCard.appendChild(row);
  container.appendChild(formCard);

  const countStatus = el("p", { class: "glossary-count", attrs: { role: "status" } });
  container.appendChild(countStatus);

  const listHost = el("div", { class: "glossary-list" });
  container.appendChild(listHost);

  function renderListRef() { renderList(); }

  function renderList() {
    clear(listHost);
    const matches = indexedVocab
      .filter(({ v, termLower, explanationLower }) => {
        if (filters.certification !== "both" && v.certification !== filters.certification) return false;
        if (filters.examDomainId !== "all" && v.examDomainId !== filters.examDomainId) return false;
        if (filters.cefr !== "both" && v.cefr !== filters.cefr) return false;
        if (filters.search && !termLower.includes(filters.search) && !explanationLower.includes(filters.search)) return false;
        return true;
      })
      .map(({ v }) => v);

    if (matches.length === 0) {
      countStatus.textContent = "0 Treffer";
      listHost.appendChild(el("p", { text: "Keine Treffer." }));
      return;
    }

    let rendered = 0;
    function appendBatch() {
      const nextSlice = matches.slice(rendered, rendered + PAGE_SIZE);
      const frag = document.createDocumentFragment();
      nextSlice.forEach((v) => frag.appendChild(renderCard(v, domainsById.get(v.examDomainId))));
      listHost.appendChild(frag);
      rendered += nextSlice.length;
      countStatus.textContent = rendered < matches.length
        ? `${rendered} von ${matches.length} Begriffen angezeigt`
        : `${matches.length} ${matches.length === 1 ? "Begriff" : "Begriffe"}`;
      if (rendered < matches.length) {
        const moreBtn = el("button", {
          class: "secondary-btn",
          text: `Weitere Begriffe anzeigen (${matches.length - rendered} verbleibend)`,
          attrs: { type: "button" }
        });
        moreBtn.addEventListener("click", () => {
          moreBtn.remove();
          appendBatch();
        });
        listHost.appendChild(moreBtn);
      }
    }

    appendBatch();
  }

  renderList();
}

function renderCard(v, domain) {
  const progress = state.progressByContentId.get(v.id);
  const statusText = !progress
    ? "Noch nicht gelernt"
    : progress.flag === "intro"
    ? `Kennengelernt, erste Abfrage ab ${progress.nextReviewDate}`
    : progress.flag === "relearn"
    ? "Muss erneut gelernt werden"
    : progress.flag === "later"
    ? `Später wiederholen${progress.nextReviewDate ? ` ab ${progress.nextReviewDate}` : ""}`
    : `Wiederholungen: ${progress.repetitions}, nächste Wiederholung: ${progress.nextReviewDate}`;

  const exampleSentence = v.clozeSentence.replace("____", v.term);

  const card = el("div", { class: "card glossary-card" });
  card.appendChild(el("h2", { text: v.term, attrs: { lang: "en" } }));
  card.appendChild(el("p", { class: "item-hint", text: `${certLabel(v.certification)} · ${domain?.name || v.examDomainId} · CEFR ${v.cefr}` }));
  card.appendChild(el("p", {}, [el("strong", { text: "Deutsch: " }), document.createTextNode(v.germanExplanation)]));
  card.appendChild(el("p", {}, [el("strong", { text: "Kontext: " }), document.createTextNode(v.salesforceContext)]));
  card.appendChild(el("p", { class: "example-sentence" }, [el("strong", { text: "Beispiel: " }), el("span", { text: exampleSentence, attrs: { lang: "en" } })]));
  if (v.confusableTerms?.length) {
    card.appendChild(el("p", { class: "confusable" }, [el("strong", { text: "Verwechslungsgefahr: " }), el("span", { text: v.confusableTerms.join(", "), attrs: { lang: "en" } })]));
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
