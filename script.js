// Keep the active filters together so all controls can be combined predictably.
const state = { category: "all", benefit: "", favoritesOnly: false, search: "" };
const favoriteStorageKey = "fresh-facts-favorites";
const themeStorageKey = "fresh-facts-theme";
const languageStorageKey = "fresh-facts-language";
const cardStyleStorageKey = "fresh-facts-card-style";
const warnedMissingTranslations = new Set();
const translations = {
  en: {
    pageTitle: "Fresh Facts — Good things grow here",
    metaDescription: "Explore the nutrients and everyday health benefits of fruits and vegetables with Fresh Facts.",
    skipLink: "Skip to content", homeAria: "Fresh Facts home", mainNavAria: "Main navigation",
    languageLabel: "Choose language", menuOpen: "Open navigation menu", menuClose: "Close navigation menu",
    cardStyleLabel: "Card style", stylePastel: "Pastel",
    styleTropical: "Tropical", styleMinimal: "Minimal",
    themeDarkLabel: "Switch to dark mode", themeLightLabel: "Switch to light mode",
    themeTitle: "Toggle dark mode", favoritesLabel: "Favorites", navHome: "Home", navBrowse: "Browse", navAbout: "About",
    heroEyebrow: "A little goodness, every day", heroTitleLine1: "Good food.",
    heroTitleLine2: "Feel ", heroTitleAccent: "good.",
    heroDescription: "Friendly facts to help you enjoy more fruits and veggies.",
    heroCta: "Browse all", heroNote: "Everyday ingredients. Feel-good facts.",
    heroArtAria: "Illustration of colorful fresh produce", heroSticker: "Eat the rainbow",
    searchLabel: "Search fruits and vegetables",
    searchPlaceholder: "Try “spinach” or “పాలకూర”...",
    searchHint: "Search by name, nutrient, or benefit", browseEyebrow: "The good stuff",
    browseTitleLead: "Meet your ", browseTitleAccent: "produce",
    sectionIntro: "Small, colorful choices can make a lovely difference.",
    shortcutsEyebrow: "Quick picks", shortcutsTitle: "Find your next good thing",
    shortcutsIntro: "Choose a shortcut to jump to matching foods.",
    shortcutsAria: "Quick produce filters", shortcutFruits: "Fruits",
    shortcutVegetables: "Vegetables", shortcutEyes: "Eye health",
    shortcutHeart: "Heart health", shortcutImmunity: "Immunity", shortcutFavorites: "Favorites",
    dailyTipEyebrow: "A fresh idea for today", dailyTipTitle: "A little tip for today",
    dailyTipDetails: "See details",
    featuredEyebrow: "Fresh picks", featuredTitle: "Featured foods",
    featuredIntro: "A few colorful favorites to get you started.",
    featuredAria: "Featured fruits and vegetables",
    inSeasonEyebrow: "At their best", inSeasonTitle: "In season now",
    inSeasonIntro: "Fresh picks that are in season this month.",
    inSeasonAria: "Foods in season now", inSeasonLabel: "In season",
    inSeasonEmpty: "Nothing is listed as in season right now. Try browsing all the produce.",
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
    modelAlt: "3D model of {name}",
    cardDetailsLabel: "Get the good details →", addFavorite: "Add {name} to favorites",
    removeFavorite: "Remove {name} from favorites", resultOne: "item", resultMany: "items"
  },
  te: {
    pageTitle: "ఫ్రెష్ ఫ్యాక్ట్స్ — మంచి విషయాలు ఇక్కడే",
    metaDescription: "పండ్లు, కూరగాయల్లోని పోషకాలు మరియు ఆరోగ్యానికి అవి చేసే మేలును ఫ్రెష్ ఫ్యాక్ట్స్‌లో తెలుసుకోండి.",
    skipLink: "విషయానికి వెళ్లండి", homeAria: "ఫ్రెష్ ఫ్యాక్ట్స్ హోమ్", mainNavAria: "ప్రధాన నావిగేషన్",
    languageLabel: "భాషను ఎంచుకోండి", menuOpen: "మెనూను తెరవండి", menuClose: "మెనూను మూసివేయండి",
    cardStyleLabel: "కార్డు శైలి", stylePastel: "పాస్టెల్",
    styleTropical: "ట్రాపికల్", styleMinimal: "మినిమల్", themeDarkLabel: "డార్క్ మోడ్‌కు మారండి",
    themeLightLabel: "లైట్ మోడ్‌కు మారండి", themeTitle: "డార్క్ మోడ్ మార్చండి",
    favoritesLabel: "ఇష్టమైనవి", navHome: "హోమ్", navBrowse: "చూడండి", navAbout: "మా గురించి",
    heroEyebrow: "ప్రతిరోజూ కొంచెం మంచితనం", heroTitleLine1: "మంచి ఆహారం.",
    heroTitleLine2: "ఆరోగ్యంగా ", heroTitleAccent: "ఉండండి.",
    heroDescription: "పండ్లు, కూరగాయలను ఆస్వాదించేందుకు సులభమైన విషయాలు.",
    heroCta: "అన్నీ చూడండి", heroNote: "రోజూ తినే పదార్థాలు. ఉపయోగకరమైన విషయాలు.",
    heroArtAria: "రంగురంగుల తాజా పండ్లు, కూరగాయల చిత్రం", heroSticker: "రంగుల పండ్లు తినండి",
    searchLabel: "పండ్లు, కూరగాయల కోసం వెతకండి",
    searchPlaceholder: "“పాలకూర” లేదా “spinach” అని వెతకండి...",
    searchHint: "పేరు, పోషకం లేదా ప్రయోజనంతో వెతకండి",
    browseEyebrow: "మంచి విషయాలు", browseTitleLead: "మీ కోసం ", browseTitleAccent: "పండ్లూ కూరగాయలూ",
    sectionIntro: "చిన్న చిన్న రంగుల ఎంపికలు మంచి మార్పు తీసుకురాగలవు.",
    shortcutsEyebrow: "త్వరగా చూడండి", shortcutsTitle: "మీకు కావాల్సినవి ఒక్కచోట",
    shortcutsIntro: "ఒక ఎంపికపై నొక్కితే, సంబంధిత ఆహారాల దగ్గరకు వెళ్తారు.",
    shortcutsAria: "పండ్లు, కూరగాయలను త్వరగా వడపోసి చూడండి",
    shortcutFruits: "పండ్లు", shortcutVegetables: "కూరగాయలు",
    shortcutEyes: "కంటి ఆరోగ్యం", shortcutHeart: "గుండె ఆరోగ్యం",
    shortcutImmunity: "రోగనిరోధక శక్తి", shortcutFavorites: "ఇష్టమైనవి",
    dailyTipEyebrow: "ఈరోజు ప్రత్యేకంగా", dailyTipTitle: "ఈరోజు చిన్న ఆరోగ్య చిట్కా",
    dailyTipDetails: "వివరాలు చూడండి",
    featuredEyebrow: "తాజా ఎంపికలు", featuredTitle: "ప్రత్యేకంగా ఎంపిక చేసినవి",
    featuredIntro: "ముందుగా చూడదగిన కొన్ని పండ్లు, కూరగాయలు.",
    featuredAria: "ప్రత్యేక పండ్లు, కూరగాయలు",
    inSeasonEyebrow: "మంచి పంట కాలం", inSeasonTitle: "ఇప్పుడు సీజన్‌లో ఉన్నవి",
    inSeasonIntro: "ఈ నెలలో పండే తాజా పండ్లు, కూరగాయలు.",
    inSeasonAria: "ఇప్పుడు సీజన్‌లో ఉన్న ఆహారాలు", inSeasonLabel: "సీజన్‌లో",
    inSeasonEmpty: "ఈ నెలలో సీజన్‌కు సరిపోయే పదార్థాలు లేవు. అన్ని పండ్లు, కూరగాయలను చూడండి.",
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
    modelAlt: "{name} యొక్క 3D నమూనా",
    cardDetailsLabel: "మరిన్ని వివరాలు →", addFavorite: "{name}ను ఇష్టమైన వాటిలో చేర్చండి",
    removeFavorite: "{name}ను ఇష్టమైన వాటి నుంచి తీసేయండి", resultOne: "పదార్థం", resultMany: "పదార్థాలు"
  }
};
let language = "en";
let favorites = loadFavorites();

// Turn every tip in the produce data into a dated daily selection.
const dailyTipEntries = produceData.flatMap((item) =>
  item.tips.en.map((_, index) => ({ item, index }))
);

function getDailyTip(date = new Date()) {
  const dateNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return dailyTipEntries[dateNumber % dailyTipEntries.length];
}

const dailyTip = getDailyTip();

// Get an interface label in the selected language and fill simple name placeholders.
function localizedText(key, replacements = {}) {
  const selectedDictionary = translations[language] || translations.en;
  const selectedValue = selectedDictionary[key];
  const englishValue = translations.en[key];
  const hasSelectedValue = typeof selectedValue === "string" && selectedValue.trim().length > 0;
  const hasEnglishValue = typeof englishValue === "string" && englishValue.trim().length > 0;
  let value = hasSelectedValue
    ? selectedValue
    : hasEnglishValue
      ? englishValue
      : typeof key === "string" && key.trim()
        ? key
        : "Translation missing";
  if (!hasSelectedValue) {
    const warningKey = `${language}:${key}`;
    if (!warnedMissingTranslations.has(warningKey)) {
      const fallback = hasEnglishValue ? "using English." : "showing the translation key.";
      console.warn(`Fresh Facts is missing "${key}" in its ${language} translations; ${fallback}`);
      warnedMissingTranslations.add(warningKey);
    }
  }
  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replace(`{${name}}`, String(replacement));
  });
  return value;
}

// Keep the menu's screen-reader label in sync with its open or closed state.
function updateMenuButtonLabel() {
  const menuButton = document.getElementById("menu-toggle");
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-label", localizedText(isOpen ? "menuClose" : "menuOpen"));
}

// Open or close the small-screen navigation menu.
function setMobileMenu(isOpen) {
  const menuButton = document.getElementById("menu-toggle");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector("span").textContent = isOpen ? "×" : "☰";
  document.getElementById("main-nav").classList.toggle("open", isOpen);
  updateMenuButtonLabel();
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

// Keep only six card models active; other cards show their emoji until needed.
const maxActiveCardModels = 6;
const produceModelStates = new WeakMap();
const visibleCardModels = new Set();
const activeCardModels = new Set();
const prefersReducedModelMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let produceModelObserver = null;
let modelViewerWarningShown = false;

function warnAboutModelViewer(error) {
  if (modelViewerWarningShown) return;
  modelViewerWarningShown = true;
  console.warn("Fresh Facts is showing emoji because a 3D model could not load.", error);
}

// Start with an emoji so it is ready while a visible model loads.
function createProduceModelFrame(item, showControls = false) {
  const frame = document.createElement("div");
  frame.className = showControls
    ? "produce-model-frame detail-model-frame"
    : "produce-model-frame card-model-frame";
  if (!showControls) frame.setAttribute("aria-hidden", "true");

  const fallback = document.createElement("span");
  fallback.className = "model-fallback";
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = item.emoji;
  const loading = document.createElement("span");
  loading.className = "model-loading";
  loading.setAttribute("aria-hidden", "true");
  loading.hidden = true;
  frame.append(fallback, loading);

  const state = { item, frame, fallback, loading, showControls, viewer: null, timer: 0, failed: false };
  produceModelStates.set(frame, state);
  if (!showControls && produceModelObserver && item.model) produceModelObserver.observe(frame);
  return frame;
}

function deactivateProduceModel(state) {
  activeCardModels.delete(state);
  if (state.timer) window.clearTimeout(state.timer);
  state.timer = 0;
  if (state.viewer) state.viewer.remove();
  state.viewer = null;
  state.loading.hidden = true;
  state.fallback.hidden = false;
}

function failProduceModel(state, viewer, error) {
  if (state.viewer !== viewer) return;
  state.failed = true;
  deactivateProduceModel(state);
  warnAboutModelViewer(`${state.item.name.en}: ${error || "model failed to load"}`);
  promoteVisibleCardModels();
}

// Add a model-viewer only when a card is visible or its details are open.
function activateProduceModel(frame) {
  const state = produceModelStates.get(frame);
  if (!state || !state.item.model || state.viewer || state.failed) return;
  if (!state.showControls && activeCardModels.size >= maxActiveCardModels) return;

  const viewer = document.createElement("model-viewer");
  viewer.setAttribute("src", state.item.model);
  viewer.setAttribute("alt", state.showControls
    ? localizedText("modelAlt", { name: state.item.name[language] })
    : "");
  viewer.setAttribute("loading", state.showControls ? "eager" : "lazy");
  viewer.setAttribute("reveal", "auto");
  viewer.setAttribute("environment-image", "neutral");
  viewer.setAttribute("shadow-intensity", "0.35");
  viewer.setAttribute("exposure", "1");
  viewer.setAttribute("camera-orbit", "0deg 75deg 100%");
  viewer.setAttribute("interaction-prompt", "none");

  if (state.showControls) {
    viewer.setAttribute("camera-controls", "");
  } else if (!prefersReducedModelMotion.matches) {
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", "12deg");
    viewer.setAttribute("auto-rotate-delay", "0");
  }

  viewer.addEventListener("load", () => {
    if (state.viewer !== viewer) return;
    if (state.timer) window.clearTimeout(state.timer);
    state.timer = 0;
    state.loading.hidden = true;
    state.fallback.hidden = true;
  });
  viewer.addEventListener("error", (event) => failProduceModel(state, viewer, event.type));

  state.viewer = viewer;
  state.loading.hidden = false;
  frame.insertBefore(viewer, state.fallback);
  if (!state.showControls) activeCardModels.add(state);
  state.timer = window.setTimeout(() => {
    failProduceModel(state, viewer, "timed out while loading");
  }, 15000);
}

function promoteVisibleCardModels() {
  if (document.getElementById("details-dialog").open) return;
  visibleCardModels.forEach((state) => {
    if (activeCardModels.size < maxActiveCardModels) activateProduceModel(state.frame);
  });
}

// Remove old viewers so scrolling and re-rendering do not waste memory.
function releaseProduceModels(container) {
  container.querySelectorAll(".produce-model-frame").forEach((frame) => {
    const state = produceModelStates.get(frame);
    if (produceModelObserver) produceModelObserver.unobserve(frame);
    if (!state) return;
    visibleCardModels.delete(state);
    deactivateProduceModel(state);
    produceModelStates.delete(frame);
  });
  promoteVisibleCardModels();
}

function pauseCardProduceModels() {
  activeCardModels.forEach(deactivateProduceModel);
}

function resumeVisibleCardProduceModels() {
  promoteVisibleCardModels();
}

function initializeProduceModelObserver() {
  if (!("IntersectionObserver" in window)) {
    warnAboutModelViewer("This browser does not support lazy loading.");
    return;
  }
  prefersReducedModelMotion.addEventListener("change", (event) => {
    activeCardModels.forEach((state) => {
      if (!state.viewer) return;
      if (event.matches) {
        state.viewer.removeAttribute("auto-rotate");
      } else {
        state.viewer.setAttribute("auto-rotate", "");
        state.viewer.setAttribute("rotation-per-second", "12deg");
        state.viewer.setAttribute("auto-rotate-delay", "0");
      }
    });
  });
  produceModelObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const state = produceModelStates.get(entry.target);
      if (!state || state.showControls) return;
      if (entry.isIntersecting) {
        visibleCardModels.add(state);
        promoteVisibleCardModels();
      } else {
        visibleCardModels.delete(state);
        deactivateProduceModel(state);
        promoteVisibleCardModels();
      }
    });
  });
}

// Build an accessible produce card with separate controls for details and favorites.
function createProduceCard(item, showSeasonBadge = false) {
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
  if (showSeasonBadge) {
    const seasonBadge = document.createElement("span");
    seasonBadge.className = "season-badge";
    seasonBadge.textContent = localizedText("inSeasonLabel");
    cardTop.append(category, seasonBadge, favoriteButton);
  } else {
    cardTop.append(category, favoriteButton);
  }

  const detailsButton = document.createElement("button");
  detailsButton.className = "card-details";
  detailsButton.type = "button";
  detailsButton.dataset.details = item.name.en;
  const visual = createProduceModelFrame(item);
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

const featuredFoodNames = ["Apple", "Blueberry", "Carrot", "Spinach", "Mango", "Tomato"];

function renderFeaturedFoods() {
  const featuredItems = featuredFoodNames.map((name) => {
    const item = produceData.find((produce) => produce.name.en === name);
    if (!item) throw new Error(`Featured food "${name}" was not found in data.js.`);
    return item;
  });
  const grid = document.getElementById("featured-foods-grid");
  releaseProduceModels(grid);
  grid.replaceChildren(...featuredItems.map((item) => createProduceCard(item)));
}

// Season descriptions use Northern Hemisphere seasons; year-round foods match every month.
const monthsBySeason = {
  winter: [11, 0, 1],
  spring: [2, 3, 4],
  summer: [5, 6, 7],
  fall: [8, 9, 10]
};

function seasonIncludesMonth(seasonDescription, month) {
  const mainSeason = seasonDescription.split(";")[0].toLowerCase();
  if (mainSeason.includes("year-round")) return true;

  const range = mainSeason.match(/\b(early|late)?\s*(winter|spring|summer|fall)\s+through\s+(early|late)?\s*(winter|spring|summer|fall)\b/);
  if (range) {
    const startMonths = monthsBySeason[range[2]];
    const endMonths = monthsBySeason[range[4]];
    let currentMonth = range[1] === "late" ? startMonths[startMonths.length - 1] : startMonths[0];
    const lastMonth = range[3] === "early" ? endMonths[0] : endMonths[endMonths.length - 1];
    for (let checkedMonths = 0; checkedMonths < 12; checkedMonths += 1) {
      if (currentMonth === month) return true;
      if (currentMonth === lastMonth) return false;
      currentMonth = (currentMonth + 1) % 12;
    }
    return false;
  }

  const seasons = [...mainSeason.matchAll(/\b(early|late)?\s*(winter|spring|summer|fall)\b/g)];
  return seasons.some(([, modifier, season]) => {
    const months = monthsBySeason[season];
    if (modifier === "early") return months[0] === month;
    if (modifier === "late") return months[months.length - 1] === month;
    return months.includes(month);
  });
}

function renderInSeasonFoods(date = new Date()) {
  const currentMonth = date.getMonth();
  const inSeasonItems = produceData.filter((item) => seasonIncludesMonth(item.season.en, currentMonth));
  const grid = document.getElementById("in-season-grid");
  releaseProduceModels(grid);
  grid.replaceChildren(...inSeasonItems.map((item) => createProduceCard(item, true)));
  document.getElementById("in-season-empty").hidden = inSeasonItems.length > 0;
}

function renderHomeFoodSections() {
  renderFeaturedFoods();
  renderInSeasonFoods();
}

// Show the same date-selected tip in whichever language the visitor chose.
function renderDailyTip() {
  document.getElementById("daily-tip-food").textContent = dailyTip.item.name[language];
  document.getElementById("daily-tip-copy").textContent = dailyTip.item.tips[language][dailyTip.index];
  document.getElementById("daily-tip-emoji").textContent = dailyTip.item.emoji;
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
  releaseProduceModels(grid);
  grid.replaceChildren(...matchingItems.map(createProduceCard));
  const resultUnit = matchingItems.length === 1 ? localizedText("resultOne") : localizedText("resultMany");
  document.getElementById("result-count").textContent = `${matchingItems.length} ${resultUnit}`;
  document.getElementById("all-count").textContent = String(produceData.length);
  document.getElementById("empty-state").hidden = matchingItems.length > 0;
  document.getElementById("favorites-toggle").setAttribute("aria-pressed", String(state.favoritesOnly));
  document.getElementById("favorite-count").textContent = String(favorites.length);
  document.getElementById("shortcut-favorite-count").textContent = String(favorites.length);
  document.querySelectorAll("[data-shortcut-category], [data-shortcut-benefit], [data-shortcut-favorites]").forEach((button) => {
    const isFavoriteShortcut = button.dataset.shortcutFavorites === "true";
    const isCategoryShortcut = Boolean(button.dataset.shortcutCategory);
    const isActive = isFavoriteShortcut
      ? state.favoritesOnly
      : isCategoryShortcut
        ? state.category === button.dataset.shortcutCategory && !state.benefit && !state.favoritesOnly
        : state.benefit === button.dataset.shortcutBenefit && state.category === "all" && !state.favoritesOnly;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

// Find an item and render all of its information in the keyboard-accessible dialog.
function openDetails(name) {
  const item = produceData.find((produce) => produce.name.en === name);
  if (!item) return;

  pauseCardProduceModels();
  const content = document.getElementById("dialog-content");
  releaseProduceModels(content);
  content.replaceChildren();
  const heading = document.createElement("div");
  heading.className = "dialog-heading";
  const modelViewer = createProduceModelFrame(item, true);
  const titleGroup = document.createElement("div");
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = item.category[language];
  const title = document.createElement("h2");
  title.id = "dialog-title";
  title.dataset.produceName = item.name.en;
  title.textContent = item.name[language];
  titleGroup.append(category, title);
  heading.append(modelViewer, titleGroup);

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
  activateProduceModel(modelViewer);
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

// Clear conflicting filters, apply one quick choice, then take the visitor to Browse.
function applyShortcutFilter(button) {
  state.category = button.dataset.shortcutCategory || "all";
  state.benefit = button.dataset.shortcutBenefit || "";
  state.favoritesOnly = button.dataset.shortcutFavorites === "true";
  state.search = "";
  document.getElementById("search-input").value = "";

  document.querySelectorAll('[data-filter-type="category"]').forEach((filterButton) => {
    const isActive = filterButton.dataset.filterValue === state.category;
    filterButton.classList.toggle("active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
  document.querySelectorAll('[data-filter-type="benefit"]').forEach((filterButton) => {
    const isActive = filterButton.dataset.filterValue === state.benefit;
    filterButton.classList.toggle("active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
  renderProduce();
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  document.getElementById("browse").scrollIntoView({ behavior });
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

// Apply a safe card style, update the selector, and remember the choice.
function applyCardStyle(style) {
  const allowedStyles = ["pastel", "tropical", "minimal"];
  const selectedStyle = allowedStyles.includes(style) ? style : "pastel";
  document.documentElement.dataset.cardStyle = selectedStyle;
  document.getElementById("card-style-select").value = selectedStyle;
  try {
    localStorage.setItem(cardStyleStorageKey, selectedStyle);
  } catch (error) {
    console.warn("Fresh Facts could not save the card style preference.", error);
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
  updateMenuButtonLabel();
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
  renderDailyTip();
  renderHomeFoodSections();
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
  initializeProduceModelObserver();
  initializeBackgroundParallax();
  const menuButton = document.getElementById("menu-toggle");
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    setMobileMenu(isOpen);
  });
  document.querySelectorAll("#main-nav a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
  const searchInput = document.getElementById("search-input");
  document.querySelectorAll("[data-shortcut-category], [data-shortcut-benefit], [data-shortcut-favorites]").forEach((button) => {
    button.addEventListener("click", () => applyShortcutFilter(button));
  });
  document.getElementById("daily-tip-details").addEventListener("click", () => {
    openDetails(dailyTip.item.name.en);
  });
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
  document.getElementById("card-style-select").addEventListener("change", (event) => {
    applyCardStyle(event.currentTarget.value);
  });
  document.getElementById("main").addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      const name = favoriteButton.dataset.favorite;
      favorites = favorites.includes(name) ? favorites.filter((favorite) => favorite !== name) : [...favorites, name];
      saveFavorites();
      renderProduce();
      renderHomeFoodSections();
      return;
    }
    const detailsButton = event.target.closest("[data-details]");
    if (detailsButton) openDetails(detailsButton.dataset.details);
  });
  document.getElementById("dialog-close").addEventListener("click", () => {
    document.getElementById("details-dialog").close();
  });
  document.getElementById("details-dialog").addEventListener("close", (event) => {
    releaseProduceModels(event.currentTarget);
    resumeVisibleCardProduceModels();
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
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMobileMenu(false);
    }
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
  let savedCardStyle = "pastel";
  try {
    savedCardStyle = localStorage.getItem(cardStyleStorageKey) || "pastel";
  } catch (error) {
    console.warn("Fresh Facts could not read the saved card style preference.", error);
  }
  applyCardStyle(savedCardStyle);
  applyLanguage(savedLanguage === "te" ? "te" : "en");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

// Initialize the interactive page once the browser has parsed the document.
document.addEventListener("DOMContentLoaded", initializePage);
