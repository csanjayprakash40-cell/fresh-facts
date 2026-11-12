// Keep the active filters together so all controls can be combined predictably.
const state = { category: "all", benefit: "", favoritesOnly: false, search: "" };
const favoriteStorageKey = "fresh-facts-favorites";
const themeStorageKey = "fresh-facts-theme";
let favorites = loadFavorites();

// Read saved favorites and safely handle disabled or malformed browser storage.
function loadFavorites() {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
    return Array.isArray(savedFavorites) ? savedFavorites.filter((name) => typeof name === "string") : [];
  } catch (error) {
    console.warn("Fresh Facts could not read saved favorites.", error);
    return [];
  }
}

// Save favorites without interrupting the page if browser storage is unavailable.
function saveFavorites() {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Fresh Facts could not save favorites in this browser.", error);
  }
}

// Create a list using text nodes so item copy is never interpreted as HTML.
function makeList(items, className) {
  const list = document.createElement("ul");
  list.className = className;
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  });
  return list;
}

// Build an accessible produce card with separate controls for details and favorites.
function createProduceCard(item) {
  const card = document.createElement("article");
  card.className = `produce-card ${item.category}`;

  const cardTop = document.createElement("div");
  cardTop.className = "card-top";
  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent = item.category;
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "favorite-button";
  favoriteButton.type = "button";
  favoriteButton.dataset.favorite = item.name;
  const isFavorite = favorites.includes(item.name);
  favoriteButton.setAttribute("aria-label", `${isFavorite ? "Remove" : "Add"} ${item.name} ${isFavorite ? "from" : "to"} favorites`);
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.textContent = isFavorite ? "♥" : "♡";
  cardTop.append(category, favoriteButton);

  const detailsButton = document.createElement("button");
  detailsButton.className = "card-details";
  detailsButton.type = "button";
  detailsButton.dataset.details = item.name;
  const visual = document.createElement("span");
  visual.className = "card-emoji";
  visual.setAttribute("aria-hidden", "true");
  visual.textContent = item.emoji;
  const name = document.createElement("span");
  name.className = "card-name";
  name.textContent = item.name;
  const nutrientSummary = document.createElement("span");
  nutrientSummary.className = "nutrient-summary";
  nutrientSummary.textContent = item.nutrients.join(" · ");
  const benefitSummary = document.createElement("span");
  benefitSummary.className = "benefit-summary";
  benefitSummary.textContent = item.benefits[0];
  const linkLabel = document.createElement("span");
  linkLabel.className = "card-link-label";
  linkLabel.textContent = "Get the good details →";
  detailsButton.append(visual, name, nutrientSummary, benefitSummary, linkLabel);
  card.append(cardTop, detailsButton);
  return card;
}

// Match the search and selected filters, sort if requested, and update the grid.
function renderProduce() {
  const query = state.search.trim().toLowerCase();
  const matchingItems = produceData.filter((item) => {
    const searchableText = [item.name, item.category, ...item.nutrients, ...item.benefits, ...item.tags].join(" ").toLowerCase();
    return (state.category === "all" || item.category === state.category)
      && (!state.benefit || item.tags.includes(state.benefit))
      && (!state.favoritesOnly || favorites.includes(item.name))
      && (!query || searchableText.includes(query));
  });

  if (document.getElementById("sort-select").value === "az") {
    matchingItems.sort((first, second) => first.name.localeCompare(second.name));
  }
  const grid = document.getElementById("produce-grid");
  grid.replaceChildren(...matchingItems.map(createProduceCard));
  document.getElementById("result-count").textContent = `${matchingItems.length} ${matchingItems.length === 1 ? "item" : "items"}`;
  document.getElementById("all-count").textContent = String(produceData.length);
  document.getElementById("empty-state").hidden = matchingItems.length > 0;
  document.getElementById("favorites-toggle").setAttribute("aria-pressed", String(state.favoritesOnly));
  document.getElementById("favorite-count").textContent = String(favorites.length);
}

// Find an item and render all of its information in the keyboard-accessible dialog.
function openDetails(name) {
  const item = produceData.find((produce) => produce.name === name);
  if (!item) return;

  const content = document.getElementById("dialog-content");
  content.replaceChildren();
  const heading = document.createElement("div");
  heading.className = "dialog-heading";
  const emoji = document.createElement("span");
  emoji.className = "dialog-emoji";
  emoji.setAttribute("aria-hidden", "true");
  emoji.textContent = item.emoji;
  const titleGroup = document.createElement("div");
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = item.category;
  const title = document.createElement("h2");
  title.id = "dialog-title";
  title.textContent = item.name;
  titleGroup.append(category, title);
  heading.append(emoji, titleGroup);

  const benefits = document.createElement("section");
  benefits.className = "detail-block";
  benefits.append(createDetailHeading("The good to know"), makeList(item.benefits, "detail-list"));
  const nutrition = document.createElement("section");
  nutrition.className = "detail-block";
  nutrition.append(createDetailHeading("Vitamins & minerals"), makePills(item.vitaminsMinerals));
  const tips = document.createElement("section");
  tips.className = "detail-block";
  tips.append(createDetailHeading("Easy ways to enjoy it"), makeList(item.tips, "detail-list"));
  const care = createDetailBlock("A note of care", item.careful);
  care.classList.add("care-note");
  content.append(heading, benefits, nutrition, createDetailBlock("Best season", item.season), tips, care);
  document.getElementById("details-dialog").showModal();
}

// Create a heading element for one of the details sections.
function createDetailHeading(text) {
  const heading = document.createElement("h3");
  heading.textContent = text;
  return heading;
}

// Create a labeled details section containing one paragraph of copy.
function createDetailBlock(title, text) {
  const section = document.createElement("section");
  section.className = "detail-block";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  section.append(createDetailHeading(title), paragraph);
  return section;
}

// Render vitamin and mineral names as compact, readable tags.
function makePills(items) {
  const pills = document.createElement("div");
  pills.className = "nutrition-pills";
  items.forEach((item) => {
    const pill = document.createElement("span");
    pill.textContent = item;
    pills.append(pill);
  });
  return pills;
}

// Apply a category or benefit filter and keep its active state visible to assistive technology.
function updateFilter(button) {
  const filterType = button.dataset.filterType;
  const filterValue = button.dataset.filterValue;
  if (filterType === "category") {
    document.querySelectorAll('[data-filter-type="category"]').forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    state.category = filterValue;
  } else {
    state.benefit = state.benefit === filterValue ? "" : filterValue;
    document.querySelectorAll('[data-filter-type="benefit"]').forEach((filterButton) => {
      const isActive = filterButton.dataset.filterValue === state.benefit;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
  }
  renderProduce();
}

// Set the page theme, update the toggle label, and persist the choice when possible.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const themeButton = document.getElementById("theme-toggle");
  const isDark = theme === "dark";
  themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeButton.querySelector("span").textContent = isDark ? "☀" : "☾";
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    console.warn("Fresh Facts could not save the theme preference.", error);
  }
}

// Wire up all page controls after both the HTML and local produce data are available.
function initializePage() {
  const searchInput = document.getElementById("search-input");
  document.querySelectorAll("[data-filter-type]").forEach((button) => {
    button.addEventListener("click", () => updateFilter(button));
  });
  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    renderProduce();
  });
  document.getElementById("sort-select").addEventListener("change", renderProduce);
  document.getElementById("favorites-toggle").addEventListener("click", (event) => {
    event.preventDefault();
    state.favoritesOnly = !state.favoritesOnly;
    renderProduce();
    document.getElementById("browse").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("theme-toggle").addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
  document.getElementById("produce-grid").addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      const name = favoriteButton.dataset.favorite;
      favorites = favorites.includes(name) ? favorites.filter((favorite) => favorite !== name) : [...favorites, name];
      saveFavorites();
      renderProduce();
      return;
    }
    const detailsButton = event.target.closest("[data-details]");
    if (detailsButton) openDetails(detailsButton.dataset.details);
  });
  document.getElementById("dialog-close").addEventListener("click", () => {
    document.getElementById("details-dialog").close();
  });
  document.getElementById("clear-filters").addEventListener("click", () => {
    state.category = "all";
    state.benefit = "";
    state.favoritesOnly = false;
    state.search = "";
    searchInput.value = "";
    document.getElementById("sort-select").value = "featured";
    document.querySelectorAll("[data-filter-type]").forEach((button) => {
      const isAll = button.dataset.filterType === "category" && button.dataset.filterValue === "all";
      button.classList.toggle("active", isAll);
      button.setAttribute("aria-pressed", String(isAll));
    });
    renderProduce();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
      document.getElementById("home").scrollIntoView({ behavior: "smooth" });
    }
  });

  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem(themeStorageKey) || "light";
  } catch (error) {
    console.warn("Fresh Facts could not read the saved theme preference.", error);
  }
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  renderProduce();
}

// Initialize the interactive page once the browser has parsed the document.
document.addEventListener("DOMContentLoaded", initializePage);
