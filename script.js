// Keep the active filters together so all controls can be combined predictably.
const state = { category: "all", benefit: "", favoritesOnly: false, search: "" };
let selectedGoal = "";
const goalDefinitions = {
  Eyes: { translationKey: "goalEyes", keywords: ["eye", "vision", "beta-carotene", "vitamin a", "lutein"] },
  Heart: { translationKey: "goalHeart", keywords: ["heart", "unsaturated fat"] },
  Skin: { translationKey: "goalSkin", keywords: ["skin", "collagen", "vitamin e"] },
  Energy: { translationKey: "goalEnergy", keywords: ["energy", "iron", "vitamin b6", "b vitamins", "riboflavin", "niacin"] },
  Immunity: { translationKey: "goalImmunity", keywords: ["immune", "vitamin c"] },
  Bones: { translationKey: "goalBones", keywords: ["bone", "vitamin k", "calcium", "manganese"] }
};
const favoriteStorageKey = "fresh-facts-favorites";
const themeStorageKey = "fresh-facts-theme";
const languageStorageKey = "fresh-facts-language";
const cardStyleStorageKey = "fresh-facts-card-style";
const calmModeStorageKey = "fresh-facts-calm-mode";
const warnedMissingTranslations = new Set();
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver = null;
const translations = {
  en: {
    pageTitle: "Fresh Facts — Good things grow here",
    metaDescription: "Explore the nutrients and everyday health benefits of fruits and vegetables with Fresh Facts.",
    homeAria: "Fresh Facts home", mainNavAria: "Main navigation",
    languageLabel: "Choose language", cardStyleLabel: "Card style", stylePastel: "Pastel",
    styleTropical: "Tropical", styleMinimal: "Minimal",
    themeDarkLabel: "Switch to dark mode", themeLightLabel: "Switch to light mode",
    themeTitle: "Change color mode", calmMode: "Calm mode", calmModeOn: "On", calmModeOff: "Off",
    favoritesLabel: "Favorites", navBrowse: "Browse",
    searchOpen: "Open search", searchClose: "Close",
    searchLabel: "Search fruits and vegetables",
    searchPlaceholder: "Try “spinach” or “పాలకూర”...",
    searchHint: "Search by name, nutrient, or benefit",
    heroEyebrow: "A little goodness, every day", heroTitleLine1: "Good things",
    heroTitleLine2: "grow ", heroTitleAccent: "here.",
    heroDescription: "A fresh look at the fruits and veggies that help you feel your best.",
    greetingMorning: "Good morning! Here's to a fresh start.",
    greetingAfternoon: "Good afternoon! Find a little fresh goodness.",
    greetingEvening: "Good evening! Take a moment for something fresh.",
    heroCta: "Browse all", goalPickerTitle: "What do you need?",
    goalEyes: "Eyes", goalHeart: "Heart", goalSkin: "Skin", goalEnergy: "Energy",
    goalImmunity: "Immunity", goalBones: "Bones",
    goalResultsTitle: "Foods for {goal}",
    goalEmpty: "No foods match this goal yet.",
    favoriteEmptyTitle: "Your favorites garden is ready to grow",
    favoriteEmptyText: "Tap a heart on any food card to save it here.",
    fifthFavorite: "Fresh! You saved five favorites.",
    browseEyebrow: "The good stuff",
    browseTitleLead: "Meet your ", browseTitleAccent: "produce",
    sectionIntro: "Small, colorful choices can make a lovely difference.",
    shortcutsEyebrow: "Quick picks", shortcutsTitle: "Find your next good thing",
    shortcutsIntro: "Choose a shortcut to jump to matching foods.",
    shortcutsAria: "Quick produce filters", shortcutFruits: "Fruits",
    shortcutVegetables: "Vegetables", shortcutEyes: "Eye health",
    shortcutHeart: "Heart health", shortcutImmunity: "Immunity", shortcutFavorites: "Favorites",
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
    aboutThanks: "Thank you for caring about your health!",
    footerMade: "Made for curious eaters, everywhere.",
    backToTop: "Back to top ↑", closeDetails: "Close details",
    benefitTitle: "Benefits", nutritionTitle: "Vitamins and minerals",
    tipsTitle: "Tips", seasonTitle: "Best season",
    modelAlt: "3D model of {name}",
    cardDetailsLabel: "More details →", addFavorite: "Add {name} to favorites",
    removeFavorite: "Remove {name} from favorites", resultOne: "item", resultMany: "items"
  },
  te: {
    pageTitle: "ఫ్రెష్ ఫ్యాక్ట్స్ — మంచి విషయాలు ఇక్కడే",
    metaDescription: "పండ్లు, కూరగాయల్లోని పోషకాలు మరియు ఆరోగ్యానికి అవి చేసే మేలును ఫ్రెష్ ఫ్యాక్ట్స్‌లో తెలుసుకోండి.",
    homeAria: "ఫ్రెష్ ఫ్యాక్ట్స్ హోమ్", mainNavAria: "ప్రధాన నావిగేషన్",
    languageLabel: "భాషను ఎంచుకోండి", cardStyleLabel: "కార్డు శైలి", stylePastel: "పాస్టెల్",
    styleTropical: "ట్రాపికల్", styleMinimal: "మినిమల్", themeDarkLabel: "డార్క్ మోడ్‌కు మారండి",
    themeLightLabel: "లైట్ మోడ్‌కు మారండి", themeTitle: "రంగు మోడ్ మార్చండి",
    calmMode: "ప్రశాంత మోడ్", calmModeOn: "ఆన్", calmModeOff: "ఆఫ్",
    favoritesLabel: "ఇష్టమైనవి", navBrowse: "చూడండి",
    searchOpen: "వెతకండి", searchClose: "మూసివేయండి",
    searchLabel: "పండ్లు, కూరగాయల కోసం వెతకండి",
    searchPlaceholder: "“పాలకూర” లేదా “spinach” అని వెతకండి...",
    searchHint: "పేరు, పోషకం లేదా ప్రయోజనంతో వెతకండి",
    heroEyebrow: "ప్రతిరోజూ కొంచెం మంచితనం", heroTitleLine1: "మంచి విషయాలు",
    heroTitleLine2: "ఇక్కడే ", heroTitleAccent: "పెరుగుతాయి.",
    heroDescription: "పండ్లు, కూరగాయల్లోని మంచి విషయాలను తెలుసుకోండి.",
    greetingMorning: "శుభోదయం! ఈ రోజు కొత్తగా మొదలుపెడదాం.",
    greetingAfternoon: "శుభ మధ్యాహ్నం! తాజా మంచి ఆహారాన్ని చూడండి.",
    greetingEvening: "శుభ సాయంత్రం! మీ కోసం మంచి ఆహారాన్ని ఎంచుకోండి.",
    heroCta: "అన్నీ చూడండి", goalPickerTitle: "మీకు ఏది కావాలి?",
    goalEyes: "కళ్లు", goalHeart: "గుండె", goalSkin: "చర్మం", goalEnergy: "శక్తి",
    goalImmunity: "రోగనిరోధక శక్తి", goalBones: "ఎముకలు",
    goalResultsTitle: "{goal} కోసం ఆహారాలు",
    goalEmpty: "ఈ లక్ష్యానికి సరిపోయే ఆహారాలు లేవు. మరో లక్ష్యాన్ని ఎంచుకోండి.",
    favoriteEmptyTitle: "మీ ఇష్టమైన ఆహారాల తోటను పెంచండి",
    favoriteEmptyText: "ఏదైనా ఆహార కార్డుపై గుండె గుర్తును నొక్కితే అది ఇక్కడ కనిపిస్తుంది.",
    fifthFavorite: "బాగుంది! ఐదు ఇష్టమైన ఆహారాలను దాచారు.",
    browseEyebrow: "మంచి విషయాలు", browseTitleLead: "మీ కోసం ", browseTitleAccent: "పండ్లూ కూరగాయలూ",
    sectionIntro: "చిన్న చిన్న రంగుల ఎంపికలు మంచి మార్పు తీసుకురాగలవు.",
    shortcutsEyebrow: "త్వరగా చూడండి", shortcutsTitle: "మీకు కావాల్సినవి ఒక్కచోట",
    shortcutsIntro: "ఒక ఎంపికపై నొక్కితే, సంబంధిత ఆహారాల దగ్గరకు వెళ్తారు.",
    shortcutsAria: "పండ్లు, కూరగాయలను త్వరగా వడపోసి చూడండి",
    shortcutFruits: "పండ్లు", shortcutVegetables: "కూరగాయలు",
    shortcutEyes: "కంటి ఆరోగ్యం", shortcutHeart: "గుండె ఆరోగ్యం",
    shortcutImmunity: "రోగనిరోధక శక్తి", shortcutFavorites: "ఇష్టమైనవి",
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
    aboutText: "మీ ప్లేట్‌లోని ఆహారం గురించి తెలుసుకోవడం ఫ్రెష్ ఫ్యాక్ట్స్‌తో సులభం. రోజూ తినే పండ్లు, కూరగాయలు, వాటిలోని పోషకాలు, వాటిని ఆస్వాదించే సులభమైన మార్గాలు చూడండి.",
    aboutThanks: "మీ ఆరోగ్యం గురించి శ్రద్ధ చూపుతున్నందుకు ధన్యవాదాలు!",
    footerMade: "ఆసక్తిగా తెలుసుకునే ప్రతి ఒక్కరి కోసం.",
    backToTop: "పైకి వెళ్లండి ↑", closeDetails: "వివరాలు మూసివేయండి",
    benefitTitle: "ప్రయోజనాలు", nutritionTitle: "విటమిన్లు, ఖనిజాలు",
    tipsTitle: "చిట్కాలు", seasonTitle: "మంచి పంట కాలం",
    modelAlt: "{name} యొక్క 3D నమూనా",
    cardDetailsLabel: "మరిన్ని వివరాలు →", addFavorite: "{name}ను ఇష్టమైన వాటిలో చేర్చండి",
    removeFavorite: "{name}ను ఇష్టమైన వాటి నుంచి తీసేయండి", resultOne: "పదార్థం", resultMany: "పదార్థాలు"
  }
};
let language = "en";
let favorites = loadFavorites();

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

// Calm mode and the operating-system setting both turn off movement effects.
function motionDisabled() {
  return document.documentElement.dataset.calmMode === "true" || prefersReducedMotion.matches;
}

function observeForReveal(element) {
  element.classList.add("reveal-on-scroll");
  if (motionDisabled() || !revealObserver) {
    element.classList.add("is-visible");
    return;
  }
  revealObserver.observe(element);
}

function initializeScrollReveals() {
  if (motionDisabled() || !("IntersectionObserver" in window)) {
    document.querySelectorAll("main .section-wrap, .about-thanks").forEach((element) => {
      element.classList.add("reveal-on-scroll", "is-visible");
    });
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("main .section-wrap, .about-thanks").forEach(observeForReveal);
}

function animateHeadline() {
  const title = document.getElementById("hero-title");
  let wordIndex = 0;
  title.querySelectorAll("[data-i18n]").forEach((part, partIndex) => {
    const words = part.textContent.trim().split(/\s+/).filter(Boolean);
    part.replaceChildren();
    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "headline-word";
      wordSpan.style.setProperty("--word-delay", `${wordIndex * 100}ms`);
      wordSpan.textContent = word;
      part.append(wordSpan);
      if (index < words.length - 1) part.append(" ");
      wordIndex += 1;
    });
    if (partIndex === 1) part.append(" ");
  });
}

function updateFriendlyGreeting() {
  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? "greetingMorning" : hour < 18 ? "greetingAfternoon" : "greetingEvening";
  document.getElementById("friendly-greeting").textContent = localizedText(greetingKey);
}

function applyCalmMode(enabled) {
  const isEnabled = Boolean(enabled);
  document.documentElement.dataset.calmMode = String(isEnabled);
  const button = document.getElementById("calm-toggle");
  button.setAttribute("aria-pressed", String(isEnabled));
  document.getElementById("calm-mode-state").textContent = localizedText(isEnabled ? "calmModeOn" : "calmModeOff");
  if (isEnabled) {
    document.querySelectorAll(".reveal-on-scroll").forEach((element) => element.classList.add("is-visible"));
  }
  try {
    localStorage.setItem(calmModeStorageKey, String(isEnabled));
  } catch (error) {
    console.warn("Fresh Facts could not save the calm mode preference.", error);
  }
}

function initializeCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!window.matchMedia("(pointer: fine)").matches) return;
  window.addEventListener("pointermove", (event) => {
    if (motionDisabled() || event.pointerType !== "mouse") {
      glow.classList.remove("is-active");
      return;
    }
    glow.style.setProperty("--cursor-x", `${event.clientX}px`);
    glow.style.setProperty("--cursor-y", `${event.clientY}px`);
    glow.classList.add("is-active");
  }, { passive: true });
  document.addEventListener("pointerleave", () => glow.classList.remove("is-active"));
}

function announceMagic(message) {
  const announcement = document.getElementById("magic-announcement");
  announcement.textContent = "";
  window.requestAnimationFrame(() => { announcement.textContent = message; });
}

function showFavoriteSparkles(button) {
  if (motionDisabled()) return;
  const bounds = button.getBoundingClientRect();
  const burst = document.createElement("span");
  burst.className = "favorite-sparkle-burst";
  burst.setAttribute("aria-hidden", "true");
  burst.style.setProperty("--burst-x", `${bounds.left + bounds.width / 2}px`);
  burst.style.setProperty("--burst-y", `${bounds.top + bounds.height / 2}px`);
  ["✦", "🍃", "✧", "✦", "🍃"].forEach((symbol, index) => {
    const sparkle = document.createElement("span");
    sparkle.textContent = symbol;
    const angle = (index * Math.PI * 2) / 5;
    sparkle.style.setProperty("--sparkle-x", `${Math.cos(angle) * 32}px`);
    sparkle.style.setProperty("--sparkle-y", `${Math.sin(angle) * 32}px`);
    burst.append(sparkle);
  });
  document.body.append(burst);
  window.setTimeout(() => burst.remove(), 850);
}

function showFifthFavoriteBurst() {
  if (motionDisabled()) return;
  const burst = document.createElement("div");
  burst.className = "fresh-confetti";
  burst.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "fresh-confetti-label";
  label.textContent = localizedText("fifthFavorite");
  burst.append(label);
  for (let index = 0; index < 24; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--confetti-x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--confetti-delay", `${Math.random() * 250}ms`);
    burst.append(piece);
  }
  document.body.append(burst);
  announceMagic(localizedText("fifthFavorite"));
  window.setTimeout(() => burst.remove(), 1900);
}

// Show Telugu food data when available, otherwise fall back to its English copy.
function localizedFoodValue(item, field) {
  const values = item[field];
  if (!values || typeof values !== "object" || Array.isArray(values)) return values || "";

  const selectedValue = values[language];
  if (Array.isArray(selectedValue) && selectedValue.length > 0) return selectedValue;
  if (typeof selectedValue === "string" && selectedValue.trim()) return selectedValue;
  return values.en || "";
}

// Find the source benefit that best matches the selected goal.
function getGoalBenefitIndex(item, goalName) {
  const goal = goalDefinitions[goalName];
  if (!goal) return -1;

  const benefits = item.benefits.en.map((benefit) => benefit.toLowerCase());
  return benefits.findIndex((benefit) => goal.keywords.some((keyword) => benefit.includes(keyword)));
}

// Show or hide the header search and keep its button state accessible.
function setSearchOpen(isOpen, returnFocus = false) {
  const searchPopover = document.getElementById("search-popover");
  const searchToggle = document.getElementById("search-toggle");
  searchPopover.hidden = !isOpen;
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    document.getElementById("search-input").focus();
  } else if (returnFocus) {
    searchToggle.focus();
  }
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
  } else {
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
  if (revealObserver) {
    container.querySelectorAll(".reveal-on-scroll").forEach((element) => revealObserver.unobserve(element));
  }
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
function createProduceCard(item, showSeasonBadge = false, goalName = "", entryIndex = 0) {
  const card = document.createElement("article");
  card.className = `produce-card ${item.category.en} reveal-on-scroll card-tilt`;
  card.style.setProperty("--entry-delay", `${Math.min(entryIndex, 6) * 55}ms`);

  const cardTop = document.createElement("div");
  cardTop.className = "card-top";
  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent = localizedFoodValue(item, "category");
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "favorite-button";
  favoriteButton.type = "button";
  favoriteButton.dataset.favorite = item.name.en;
  const isFavorite = favorites.includes(item.name.en);
  const localizedName = localizedFoodValue(item, "name");
  favoriteButton.setAttribute("aria-label", localizedText(isFavorite ? "removeFavorite" : "addFavorite", { name: localizedName }));
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  const favoriteIcon = document.createElement("span");
  favoriteIcon.setAttribute("aria-hidden", "true");
  favoriteIcon.textContent = isFavorite ? "♥" : "♡";
  favoriteButton.append(favoriteIcon);
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
  name.textContent = localizedName;
  const benefitSummary = document.createElement("span");
  benefitSummary.className = "benefit-summary";
  const benefits = localizedFoodValue(item, "benefits");
  const benefitIndex = goalName ? getGoalBenefitIndex(item, goalName) : 0;
  benefitSummary.textContent = benefits[benefitIndex >= 0 ? benefitIndex : 0] || "";
  const linkLabel = document.createElement("span");
  linkLabel.className = "card-link-label";
  linkLabel.textContent = localizedText("cardDetailsLabel");
  detailsButton.append(visual, name, benefitSummary, linkLabel);
  card.append(cardTop, detailsButton);
  observeForReveal(card);
  let touchIsDown = false;
  card.addEventListener("pointermove", (event) => {
    if (motionDisabled() || (event.pointerType !== "mouse" && !touchIsDown)) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
  }, { passive: true });
  card.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") touchIsDown = true;
  }, { passive: true });
  const resetTilt = () => {
    touchIsDown = false;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };
  card.addEventListener("pointerup", resetTilt);
  card.addEventListener("pointercancel", resetTilt);
  card.addEventListener("pointerleave", resetTilt);
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
  grid.replaceChildren(...featuredItems.map((item, index) => createProduceCard(item, false, "", index)));
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
  grid.replaceChildren(...inSeasonItems.map((item, index) => createProduceCard(item, true, "", index)));
  document.getElementById("in-season-empty").hidden = inSeasonItems.length > 0;
}

function renderHomeFoodSections() {
  renderFeaturedFoods();
  renderInSeasonFoods();
}

// Keep the goal selection in sync and show matching produce cards below the buttons.
function renderGoalFoods() {
  const results = document.getElementById("goal-results");
  const grid = document.getElementById("goal-results-grid");
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.goal === selectedGoal));
  });
  results.hidden = !selectedGoal;
  releaseProduceModels(grid);

  if (!selectedGoal) {
    grid.replaceChildren();
    return;
  }

  const goal = goalDefinitions[selectedGoal];
  const matchingItems = produceData.filter((item) => getGoalBenefitIndex(item, selectedGoal) >= 0);

  document.getElementById("goal-results-title").textContent = localizedText("goalResultsTitle", {
    goal: localizedText(goal.translationKey)
  });
  document.getElementById("goal-empty").hidden = matchingItems.length > 0;
  grid.replaceChildren(...matchingItems.map((item, index) => createProduceCard(item, false, selectedGoal, index)));
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
  grid.replaceChildren(...matchingItems.map((item, index) => createProduceCard(item, false, "", index)));
  const resultUnit = matchingItems.length === 1 ? localizedText("resultOne") : localizedText("resultMany");
  document.getElementById("result-count").textContent = `${matchingItems.length} ${resultUnit}`;
  document.getElementById("all-count").textContent = String(produceData.length);
  const emptyState = document.getElementById("empty-state");
  const isEmptyFavorites = state.favoritesOnly && favorites.length === 0 && !query
    && state.category === "all" && !state.benefit;
  emptyState.hidden = matchingItems.length > 0;
  emptyState.classList.toggle("favorites-empty", isEmptyFavorites);
  document.getElementById("empty-illustration").textContent = isEmptyFavorites ? "💚" : "🧺";
  document.getElementById("empty-title").textContent = localizedText(isEmptyFavorites ? "favoriteEmptyTitle" : "emptyTitle");
  document.getElementById("empty-text").textContent = localizedText(isEmptyFavorites ? "favoriteEmptyText" : "emptyText");
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
  const glowColors = {
    Carrot: "rgb(240 120 50 / 38%)",
    Broccoli: "rgb(76 154 98 / 38%)",
    Strawberry: "rgb(223 82 100 / 38%)"
  };
  const foodHue = [...item.name.en].reduce((total, character) => total + character.charCodeAt(0), 0) % 360;
  const foodGlow = glowColors[item.name.en] || `hsla(${foodHue}, 72%, 56%, 0.3)`;
  modelViewer.style.setProperty("--food-glow", foodGlow);
  const titleGroup = document.createElement("div");
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = item.category[language];
  const title = document.createElement("h2");
  title.id = "dialog-title";
  title.dataset.produceName = item.name.en;
  title.textContent = localizedFoodValue(item, "name");
  titleGroup.append(category, title);
  heading.append(modelViewer, titleGroup);

  const benefits = document.createElement("section");
  benefits.className = "detail-block";
  benefits.append(createDetailHeading(localizedText("benefitTitle")), makeAnimatedBenefitList(localizedFoodValue(item, "benefits")));
  const nutrition = document.createElement("section");
  nutrition.className = "detail-block";
  nutrition.append(createDetailHeading(localizedText("nutritionTitle")), makePills(localizedFoodValue(item, "vitaminsMinerals")));
  const tips = document.createElement("section");
  tips.className = "detail-block";
  tips.append(createDetailHeading(localizedText("tipsTitle")), makeList(localizedFoodValue(item, "tips"), "detail-list"));
  content.append(
    heading,
    benefits,
    nutrition,
    createDetailBlock(localizedText("seasonTitle"), localizedFoodValue(item, "season")),
    tips
  );
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

function makeAnimatedBenefitList(items) {
  const list = document.createElement("ul");
  list.className = "detail-list detail-benefits-list";
  items.forEach((text, index) => {
    const item = document.createElement("li");
    item.style.setProperty("--benefit-delay", `${index * 100}ms`);
    const icon = document.createElement("span");
    icon.className = "benefit-sparkle";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "✦";
    const label = document.createElement("span");
    label.textContent = text;
    item.append(icon, label);
    list.append(item);
  });
  return list;
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
  document.getElementById("browse").scrollIntoView({ behavior: "smooth" });
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
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  const isDark = document.documentElement.dataset.theme === "dark";
  const themeButton = document.getElementById("theme-toggle");
  themeButton.setAttribute("aria-label", localizedText(isDark ? "themeLightLabel" : "themeDarkLabel"));
  themeButton.title = localizedText("themeTitle");
  document.getElementById("calm-mode-state").textContent = localizedText(
    document.documentElement.dataset.calmMode === "true" ? "calmModeOn" : "calmModeOff"
  );
  animateHeadline();
  updateFriendlyGreeting();
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch (error) {
    console.warn("Fresh Facts could not save the language preference.", error);
  }
  renderProduce();
  renderHomeFoodSections();
  renderGoalFoods();
  const dialogTitle = document.getElementById("dialog-title");
  if (document.getElementById("details-dialog").open && dialogTitle) {
    openDetails(dialogTitle.dataset.produceName);
  }
}

// Gently shift each background shape at a different speed as the pointer moves.
function initializeBackgroundParallax() {
  const backdrop = document.getElementById("produce-backdrop");
  const shapes = backdrop.querySelectorAll(".background-shape");

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
    if (motionDisabled() || event.pointerType !== "mouse") return;
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
  initializeScrollReveals();
  initializeCursorGlow();
  initializeBackgroundParallax();
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
  const searchInput = document.getElementById("search-input");
  const searchToggle = document.getElementById("search-toggle");
  const searchPopover = document.getElementById("search-popover");
  searchToggle.addEventListener("click", () => {
    setSearchOpen(searchToggle.getAttribute("aria-expanded") !== "true");
  });
  document.getElementById("search-close").addEventListener("click", () => setSearchOpen(false, true));
  document.addEventListener("pointerdown", (event) => {
    if (!searchPopover.hidden && !document.getElementById("header-search").contains(event.target)) {
      setSearchOpen(false);
    }
  });
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGoal = selectedGoal === button.dataset.goal ? "" : button.dataset.goal;
      renderGoalFoods();
    });
  });
  document.querySelectorAll("[data-shortcut-category], [data-shortcut-benefit], [data-shortcut-favorites]").forEach((button) => {
    button.addEventListener("click", () => applyShortcutFilter(button));
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
  document.getElementById("calm-toggle").addEventListener("click", () => {
    applyCalmMode(document.documentElement.dataset.calmMode !== "true");
  });
  document.getElementById("card-style-select").addEventListener("change", (event) => {
    applyCardStyle(event.currentTarget.value);
  });
  document.getElementById("main").addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      const name = favoriteButton.dataset.favorite;
      const addingFavorite = !favorites.includes(name);
      if (addingFavorite) showFavoriteSparkles(favoriteButton);
      favorites = addingFavorite ? [...favorites, name] : favorites.filter((favorite) => favorite !== name);
      saveFavorites();
      if (addingFavorite && favorites.length === 5) showFifthFavoriteBurst();
      renderProduce();
      renderHomeFoodSections();
      renderGoalFoods();
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
    if (event.key === "Escape" && !searchPopover.hidden) {
      setSearchOpen(false, true);
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setSearchOpen(true);
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
  let savedCalmMode = false;
  try {
    savedCalmMode = localStorage.getItem(calmModeStorageKey) === "true";
  } catch (error) {
    console.warn("Fresh Facts could not read the saved calm mode preference.", error);
  }
  applyCardStyle(savedCardStyle);
  applyLanguage(savedLanguage === "te" ? "te" : "en");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  applyCalmMode(savedCalmMode);
}

// Initialize the interactive page once the browser has parsed the document.
document.addEventListener("DOMContentLoaded", initializePage);
