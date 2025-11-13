const curatedArticles = [
  {
    title: "RBI signals liquidity pause as core inflation softens",
    summary:
      "Policy-makers hint that cash tightening will ease if the upcoming CPI release confirms a broad-based slowdown.",
    link: "https://www.livemint.com/",
    source: "LiveMint",
    updated: "2025-11-13T04:30:00Z",
    categories: ["markets", "policy", "india"],
    tags: ["RBI", "Inflation"],
  },
  {
    title: "US CPI print keeps December cut debate alive",
    summary:
      "Headline inflation cooled to 2.3% while services stayed sticky, keeping the Fed cautious but markets optimistic.",
    link: "https://www.wsj.com/",
    source: "WSJ",
    updated: "2025-11-12T23:00:00Z",
    categories: ["markets", "policy"],
    tags: ["Federal Reserve", "Rates"],
  },
  {
    title: "ISRO clears avionics review for reusable launch",
    summary:
      "The Gaganyaan team wrapped its third systems test and eyes a 2026 demo flight for the semi-reusable booster.",
    link: "https://www.thehindu.com/",
    source: "The Hindu",
    updated: "2025-11-12T17:10:00Z",
    categories: ["tech", "india"],
    tags: ["Space", "ISRO"],
  },
  {
    title: "India–UAE trade corridor adds logistics green lane",
    summary:
      "A new customs workflow trims dwell time by 18% for electronics and pharma shipments across Jebel Ali.",
    link: "https://www.businesstoday.in/",
    source: "Business Today",
    updated: "2025-11-13T05:15:00Z",
    categories: ["india", "markets"],
    tags: ["Logistics", "Trade"],
  },
  {
    title: "Singapore MAS flags AI model risk in fintech audits",
    summary:
      "Regulator will require provenance logs for LLM-based advisory tools after finding hallucinated recommendations.",
    link: "https://www.channelnewsasia.com/",
    source: "CNA",
    updated: "2025-11-12T15:00:00Z",
    categories: ["tech", "policy"],
    tags: ["AI Governance"],
  },
  {
    title: "EU carbon border tax enters dry-run window",
    summary:
      "Steel and cement exporters must now file embedded-emissions declarations ahead of the 2026 tariff switch-on.",
    link: "https://www.ft.com/",
    source: "FT",
    updated: "2025-11-12T12:20:00Z",
    categories: ["climate", "policy"],
    tags: ["CBAM", "Trade"],
  },
  {
    title: "Hydrogen storage startup raises $42M for solid cells",
    summary:
      "French-Indian joint venture claims a 20% density gain using modular solid-state cartridges aimed at trucking depots.",
    link: "https://techcrunch.com/",
    source: "TechCrunch",
    updated: "2025-11-11T21:45:00Z",
    categories: ["tech", "climate"],
    tags: ["Hydrogen", "Startups"],
  },
  {
    title: "Monsoon deficit narrows after Bay system revives rains",
    summary:
      "IMD now expects the seasonal shortfall to close near 2% with fresh inflows across the southern peninsula.",
    link: "https://indianexpress.com/",
    source: "Indian Express",
    updated: "2025-11-13T02:05:00Z",
    categories: ["india", "climate"],
    tags: ["Weather"],
  },
];

const newsGrid = document.querySelector("[data-news-grid]");
const filterGroup = document.querySelector("[data-filter-group]");
const clockEl = document.querySelector("[data-clock]");
const yearEl = document.querySelector("[data-year]");

const formatRelativeTime = (isoString) => {
  const date = new Date(isoString);
  const diff = date.getTime() - Date.now();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }
  return rtf.format(days, "day");
};

const renderCards = (filter = "all") => {
  if (!newsGrid) return;
  newsGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  curatedArticles
    .filter((article) => {
      if (filter === "all") return true;
      return article.categories.includes(filter);
    })
    .forEach((article) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        <div class="news-card__meta">
          <span>${article.source}</span>
          <span>${formatRelativeTime(article.updated)}</span>
        </div>
        <a href="${article.link}" target="_blank" rel="noopener">
          <h3>${article.title}</h3>
        </a>
        <p>${article.summary}</p>
        <div class="news-card__tags">
          ${article.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
      `;
      fragment.appendChild(card);
    });

  if (!fragment.children.length) {
    const empty = document.createElement("p");
    empty.textContent = "No stories in this stream yet. Check back soon.";
    newsGrid.appendChild(empty);
  } else {
    newsGrid.appendChild(fragment);
  }
};

const updateClock = () => {
  if (!clockEl) return;
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZoneName: "short",
  });
  clockEl.textContent = formatter.format(new Date());
};

filterGroup?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const { filter } = target.dataset;
  if (!filter) return;

  filterGroup
    .querySelectorAll(".filter")
    .forEach((btn) => btn.classList.remove("is-active"));
  target.classList.add("is-active");
  renderCards(filter);
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

renderCards("all");
updateClock();
setInterval(updateClock, 60_000);
