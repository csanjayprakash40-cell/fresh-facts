// Keep the active filters together so all controls can be combined predictably.
const state = { category: "all", benefit: "", favoritesOnly: false, search: "" };
const favoriteStorageKey = "fresh-facts-favorites";
const themeStorageKey = "fresh-facts-theme";
const languageStorageKey = "fresh-facts-language";
const translations = {
  en: {
    pageTitle: "Fresh Facts — Good things grow here",
    metaDescription: "Explore the nutrients and everyday health benefits of fruits and vegetables with Fresh Facts.",
    skipLink: "Skip to content", homeAria: "Fresh Facts home", mainNavAria: "Main navigation",
    languageLabel: "Choose language", themeDarkLabel: "Switch to dark mode", themeLightLabel: "Switch to light mode",
    themeTitle: "Toggle dark mode", favoritesLabel: "Favorites", navHome: "Home", navBrowse: "Browse", navAbout: "About",
    heroEyebrow: "A little goodness, every day", heroTitleLine1: "Good things", heroTitleLine2: "grow ",
    heroTitleAccent: "here.", heroDescription: "A fresh look at the fruits and veggies that help you feel your best.",
    heroCta: "Explore the produce", heroNote: "Everyday ingredients. Feel-good facts.",
    heroArtAria: "Illustration of colorful fresh produce", heroSticker: "Eat the rainbow",
    searchLabel: "Find your feel-good food", searchPlaceholder: "Try “eyes” or “spinach”...",
    searchHint: "Search produce, nutrients, or benefits", browseEyebrow: "The good stuff",
    browseTitleLead: "Meet your ", browseTitleAccent: "produce",
    sectionIntro: "Small, colorful choices can make a lovely difference.",
    filterProduceAria: "Filter produce", filterAll: "All", filterFruits: "Fruits", filterVegetables: "Vegetables",
    sortLabel: "Sort", sortAria: "Sort produce", sortFeatured: "Featured", sortAZ: "A to Z",
    benefitFilterAria: "Filter by benefit", benefitPrompt: "I'm looking for", benefitHeart: "Heart",
    benefitEyes: "Eyes", benefitSkin: "Skin", benefitImmunity: "Immunity", benefitBones: "Bones",
    benefitDigestion: "Digestion", emptyTitle: "No produce found just yet",
    emptyText: "Try another search or clear your filters.", clearFilters: "Show all produce",
    aboutBadge: "FRESH FACTS", aboutEyebrow: "A note from our little garden", aboutTitleLead: "Good food info,",
    aboutTitleAccent: "without the fuss.",
    aboutText: "Fresh Facts makes it easier to get curious about what’s on your plate. Explore everyday produce, learn about its nutrients, and find simple ways to enjoy more variety.",
    medicalLead: "A little important note:",
    medicalText: "This site shares general educational information, not medical advice. Nutrition needs vary from person to person. Talk with a qualified healthcare professional about personal health concerns.",
    footerMade: "Made for curious eaters, everywhere.",
    footerDisclaimer: "General information only—not medical advice. Sources: USDA FoodData Central and public nutrition guidance from the NIH Office of Dietary Supplements. Always check with a healthcare professional for advice specific to you.",
    backToTop: "Back to top ↑", closeDetails: "Close details",
    benefitTitle: "The good to know", nutritionTitle: "Vitamins & minerals",
    tipsTitle: "Easy ways to enjoy it", seasonTitle: "Best season", careTitle: "A note of care",
    cardDetailsLabel: "Get the good details →", addFavorite: "Add {name} to favorites",
    removeFavorite: "Remove {name} from favorites", resultOne: "item", resultMany: "items"
  },
  te: {
    pageTitle: "ఫ్రెష్ ఫ్యాక్ట్స్ — మంచి విషయాలు ఇక్కడే",
    metaDescription: "పండ్లు, కూరగాయల్లోని పోషకాలు మరియు ఆరోగ్యానికి అవి చేసే మేలును ఫ్రెష్ ఫ్యాక్ట్స్‌లో తెలుసుకోండి.",
    skipLink: "విషయానికి వెళ్లండి", homeAria: "ఫ్రెష్ ఫ్యాక్ట్స్ హోమ్", mainNavAria: "ప్రధాన నావిగేషన్",
    languageLabel: "భాషను ఎంచుకోండి", themeDarkLabel: "డార్క్ మోడ్‌కు మారండి",
    themeLightLabel: "లైట్ మోడ్‌కు మారండి", themeTitle: "డార్క్ మోడ్ మార్చండి",
    favoritesLabel: "ఇష్టమైనవి", navHome: "హోమ్", navBrowse: "చూడండి", navAbout: "మా గురించి",
    heroEyebrow: "ప్రతిరోజూ కొంచెం మంచితనం", heroTitleLine1: "మంచి విషయాలు",
    heroTitleLine2: "పెరిగేది ", heroTitleAccent: "ఇక్కడే.",
    heroDescription: "మీ ఆరోగ్యానికి తోడ్పడే పండ్లు, కూరగాయలను కొత్తగా తెలుసుకోండి.",
    heroCta: "పండ్లూ కూరగాయలూ చూడండి", heroNote: "రోజూ తినే పదార్థాలు. ఉపయోగకరమైన విషయాలు.",
    heroArtAria: "రంగురంగుల తాజా పండ్లు, కూరగాయల చిత్రం", heroSticker: "రంగుల పండ్లు తినండి",
    searchLabel: "మీకు నచ్చే ఆరోగ్యకరమైన ఆహారం వెతకండి",
    searchPlaceholder: "“చూపు” లేదా “పాలకూర” అని వెతకండి...",
    searchHint: "పండ్లు, పోషకాలు లేదా ప్రయోజనాల కోసం వెతకండి",
    browseEyebrow: "మంచి విషయాలు", browseTitleLead: "మీ కోసం ", browseTitleAccent: "పండ్లూ కూరగాయలూ",
    sectionIntro: "చిన్న చిన్న రంగుల ఎంపికలు మంచి మార్పు తీసుకురాగలవు.",
    filterProduceAria: "పండ్లు, కూరగాయలను వడపోసి చూడండి", filterAll: "అన్నీ",
    filterFruits: "పండ్లు", filterVegetables: "కూరగాయలు",
    sortLabel: "క్రమం", sortAria: "క్రమాన్ని ఎంచుకోండి", sortFeatured: "ప్రత్యేకంగా", sortAZ: "అక్షర క్రమం",
    benefitFilterAria: "ప్రయోజనం ఆధారంగా వడపోసి చూడండి", benefitPrompt: "నాకు కావాల్సింది",
    benefitHeart: "గుండె ఆరోగ్యం", benefitEyes: "చూపు", benefitSkin: "చర్మం",
    benefitImmunity: "రోగనిరోధక శక్తి", benefitBones: "ఎముకలు", benefitDigestion: "జీర్ణక్రియ",
    emptyTitle: "ఇక్కడ ఇంకా ఏవి దొరకలేదు", emptyText: "మరో పదంతో వెతకండి లేదా ఎంపికలను తీసేయండి.",
    clearFilters: "అన్నీ చూపించండి", aboutBadge: "ఫ్రెష్ ఫ్యాక్ట్స్", aboutEyebrow: "మా చిన్న తోట నుంచి ఒక మాట",
    aboutTitleLead: "మంచి ఆహార సమాచారం,", aboutTitleAccent: "సులభంగా.",
    aboutText: "మీరు తినే ఆహారం గురించి తెలుసుకోవడం ఫ్రెష్ ఫ్యాక్ట్స్ సులభం చేస్తుంది. రోజూ వాడే పండ్లు, కూరగాయలు, వాటిలోని పోషకాలు, వాటిని తినే సులభమైన మార్గాలు తెలుసుకోండి.",
    medicalLead: "ఒక ముఖ్యమైన విషయం:",
    medicalText: "ఈ వెబ్‌సైట్‌లో సాధారణ అవగాహన కోసం మాత్రమే సమాచారం ఉంది; ఇది వైద్య సలహా కాదు. ప్రతి ఒక్కరి పోషక అవసరాలు వేర్వేరుగా ఉంటాయి. మీ ఆరోగ్య సమస్యల గురించి అర్హత కలిగిన వైద్య నిపుణుడిని సంప్రదించండి.",
    footerMade: "ఆసక్తిగా తెలుసుకునే ప్రతి ఒక్కరి కోసం.",
    footerDisclaimer: "ఇది సాధారణ సమాచారం మాత్రమే; వైద్య సలహా కాదు. ఆధారాలు: USDA FoodData Central మరియు NIH Office of Dietary Supplements పోషక మార్గదర్శకాలు. మీకు సరిపోయే సలహా కోసం వైద్య నిపుణుడిని సంప్రదించండి.",
    backToTop: "పైకి వెళ్లండి ↑", closeDetails: "వివరాలు మూసివేయండి",
    benefitTitle: "తెలుసుకోవాల్సిన మంచి విషయం", nutritionTitle: "విటమిన్లు, ఖనిజాలు",
    tipsTitle: "తినడానికి సులభమైన మార్గాలు", seasonTitle: "మంచి పంట కాలం", careTitle: "జాగ్రత్తగా ఉండండి",
    cardDetailsLabel: "మరిన్ని వివరాలు →", addFavorite: "{name}ను ఇష్టమైన వాటిలో చేర్చండి",
    removeFavorite: "{name}ను ఇష్టమైన వాటి నుంచి తీసేయండి", resultOne: "పదార్థం", resultMany: "పదార్థాలు"
  }
};
let language = "en";
let favorites = loadFavorites();

// Get an interface label in the selected language and fill simple name placeholders.
function localizedText(key, replacements = {}) {
  let value = translations[language][key];
  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replace(`{${name}}`, replacement);
  });
  return value;
}

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
  card.className = `produce-card ${item.category.en}`;

  const cardTop = document.createElement("div");
  cardTop.className = "card-top";
  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent = item.category[language];
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "favorite-button";
  favoriteButton.type = "button";
  favoriteButton.dataset.favorite = item.name.en;
  const isFavorite = favorites.includes(item.name.en);
  favoriteButton.setAttribute("aria-label", localizedText(isFavorite ? "removeFavorite" : "addFavorite", { name: item.name[language] }));
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.textContent = isFavorite ? "♥" : "♡";
  cardTop.append(category, favoriteButton);

  const detailsButton = document.createElement("button");
  detailsButton.className = "card-details";
  detailsButton.type = "button";
  detailsButton.dataset.details = item.name.en;
  const visual = document.createElement("span");
  visual.className = "card-emoji";
  visual.setAttribute("aria-hidden", "true");
  visual.textContent = item.emoji;
  const name = document.createElement("span");
  name.className = "card-name";
  name.textContent = item.name[language];
  const nutrientSummary = document.createElement("span");
  nutrientSummary.className = "nutrient-summary";
  nutrientSummary.textContent = item.nutrients[language].join(" · ");
  const benefitSummary = document.createElement("span");
  benefitSummary.className = "benefit-summary";
  benefitSummary.textContent = item.benefits[language][0];
  const linkLabel = document.createElement("span");
  linkLabel.className = "card-link-label";
  linkLabel.textContent = localizedText("cardDetailsLabel");
  detailsButton.append(visual, name, nutrientSummary, benefitSummary, linkLabel);
  card.append(cardTop, detailsButton);
  return card;
}

// Match the search and selected filters, sort if requested, and update the grid.
function renderProduce() {
  const query = state.search.trim().toLocaleLowerCase(language);
  const matchingItems = produceData.filter((item) => {
    const searchableText = [
      ...Object.values(item.name),
      ...Object.values(item.category),
      ...Object.values(item.nutrients).flat(),
      ...Object.values(item.benefits).flat(),
      ...Object.values(item.vitaminsMinerals).flat(),
      ...Object.values(item.season),
      ...Object.values(item.tips).flat(),
      ...Object.values(item.careful),
      ...Object.values(item.tags).flat()
    ].join(" ").toLocaleLowerCase(language);
    return (state.category === "all" || item.category.en === state.category)
      && (!state.benefit || item.tags.en.includes(state.benefit))
      && (!state.favoritesOnly || favorites.includes(item.name.en))
      && (!query || searchableText.includes(query));
  });

  if (document.getElementById("sort-select").value === "az") {
    matchingItems.sort((first, second) => first.name[language].localeCompare(second.name[language], language));
  }
  const grid = document.getElementById("produce-grid");
  grid.replaceChildren(...matchingItems.map(createProduceCard));
  const resultUnit = matchingItems.length === 1 ? localizedText("resultOne") : localizedText("resultMany");
  document.getElementById("result-count").textContent = `${matchingItems.length} ${resultUnit}`;
  document.getElementById("all-count").textContent = String(produceData.length);
  document.getElementById("empty-state").hidden = matchingItems.length > 0;
  document.getElementById("favorites-toggle").setAttribute("aria-pressed", String(state.favoritesOnly));
  document.getElementById("favorite-count").textContent = String(favorites.length);
}

// Find an item and render all of its information in the keyboard-accessible dialog.
function openDetails(name) {
  const item = produceData.find((produce) => produce.name.en === name);
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
  category.textContent = item.category[language];
  const title = document.createElement("h2");
  title.id = "dialog-title";
  title.dataset.produceName = item.name.en;
  title.textContent = item.name[language];
  titleGroup.append(category, title);
  heading.append(emoji, titleGroup);

  const benefits = document.createElement("section");
  benefits.className = "detail-block";
  benefits.append(createDetailHeading(localizedText("benefitTitle")), makeList(item.benefits[language], "detail-list"));
  const nutrition = document.createElement("section");
  nutrition.className = "detail-block";
  nutrition.append(createDetailHeading(localizedText("nutritionTitle")), makePills(item.vitaminsMinerals[language]));
  const tips = document.createElement("section");
  tips.className = "detail-block";
  tips.append(createDetailHeading(localizedText("tipsTitle")), makeList(item.tips[language], "detail-list"));
  const care = createDetailBlock(localizedText("careTitle"), item.careful[language]);
  care.classList.add("care-note");
  content.append(heading, benefits, nutrition, createDetailBlock(localizedText("seasonTitle"), item.season[language]), tips, care);
  const dialog = document.getElementById("details-dialog");
  if (!dialog.open) dialog.showModal();
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
  themeButton.setAttribute("aria-label", localizedText(isDark ? "themeLightLabel" : "themeDarkLabel"));
  themeButton.title = localizedText("themeTitle");
  themeButton.querySelector("span").textContent = isDark ? "☀" : "☾";
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    console.warn("Fresh Facts could not save the theme preference.", error);
  }
}

// Update static labels, page language, and the saved language choice without reloading.
function applyLanguage(selectedLanguage) {
  language = selectedLanguage === "te" ? "te" : "en";
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = localizedText(key);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(",").forEach((attributeMap) => {
      const [attribute, key] = attributeMap.trim().split(":");
      element.setAttribute(attribute, localizedText(key));
    });
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  const isDark = document.documentElement.dataset.theme === "dark";
  const themeButton = document.getElementById("theme-toggle");
  themeButton.setAttribute("aria-label", localizedText(isDark ? "themeLightLabel" : "themeDarkLabel"));
  themeButton.title = localizedText("themeTitle");
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch (error) {
    console.warn("Fresh Facts could not save the language preference.", error);
  }
  renderProduce();
  const dialogTitle = document.getElementById("dialog-title");
  if (document.getElementById("details-dialog").open && dialogTitle) {
    openDetails(dialogTitle.dataset.produceName);
  }
}

// Gently shift each background shape at a different speed as the pointer moves.
function initializeBackgroundParallax() {
  const backdrop = document.getElementById("produce-backdrop");
  const shapes = backdrop.querySelectorAll(".background-shape");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  let animationFrame = 0;
  function moveShapes(pointerX, pointerY) {
    animationFrame = 0;
    const horizontal = (pointerX / window.innerWidth - 0.5) * 24;
    const vertical = (pointerY / window.innerHeight - 0.5) * 24;
    shapes.forEach((shape) => {
      const depth = Number(shape.dataset.depth);
      shape.style.setProperty("--shape-x", `${horizontal * depth}px`);
      shape.style.setProperty("--shape-y", `${vertical * depth}px`);
    });
  }

  window.addEventListener("pointermove", (event) => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(() => moveShapes(event.clientX, event.clientY));
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    shapes.forEach((shape) => {
      shape.style.setProperty("--shape-x", "0px");
      shape.style.setProperty("--shape-y", "0px");
    });
  });
}

// Wire up all page controls after both the HTML and local produce data are available.
function initializePage() {
  initializeBackgroundParallax();
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
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
  let savedLanguage = "en";
  try {
    savedLanguage = localStorage.getItem(languageStorageKey) || "en";
  } catch (error) {
    console.warn("Fresh Facts could not read the saved language preference.", error);
  }
  applyLanguage(savedLanguage === "te" ? "te" : "en");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

// Initialize the interactive page once the browser has parsed the document.
document.addEventListener("DOMContentLoaded", initializePage);
