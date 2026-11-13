// Keep the active filters together so all controls can be combined predictably.
const state = { category: "all", benefit: "", favoritesOnly: false, search: "", seasonMonth: null };
let selectedGoal = "";
let selectedMonth = new Date().getMonth();
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
const journeyStorageKey = "fresh-facts-seasonal-journey";
// Three different food details open one more month.
const foodsPerJourneyUnlock = 3;
const journeyStartMonth = new Date().getMonth();
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
    themeTitle: "Change color mode", themeDarkShortLabel: "Dark", themeLightShortLabel: "Light",
    calmMode: "Calm mode", calmModeOn: "On", calmModeOff: "Off",
    favoritesLabel: "Favorites", navBrowse: "Browse",
    searchOpen: "Open search", searchClose: "Close", searchButtonLabel: "Search",
    searchLabel: "Search fruits and vegetables",
    searchPlaceholder: "Try “spinach” or “పాలకూర”...",
    searchHint: "Search by name, nutrient, or benefit",
    heroEyebrow: "A little goodness, every day", heroTitleLine1: "Good things",
    heroTitleLine2: "grow ", heroTitleAccent: "here.",
    heroDescription: "A fresh look at the fruits and veggies that help you feel your best.",
    greetingMorning: "Good morning! Here's to a fresh start.",
    greetingAfternoon: "Good afternoon! Find a little fresh goodness.",
    greetingEvening: "Good evening! Take a moment for something fresh.",
    seasonHeroEyebrow: "Your Year of Fresh Food",
    seasonHeroTitle: "Take a fresh journey through the seasons",
    seasonHeroDescription: "Follow the months, discover seasonal foods, and find simple ways to enjoy them.",
    seasonWheelEyebrow: "A path through the year",
    journeyTitle: "Choose an open month",
    journeyRouteAria: "Seasonal journey through the months",
    seasonLegendAria: "Seasons",
    seasonWinter: "Winter", seasonSpring: "Spring", seasonSummer: "Summer",
    seasonMonsoon: "Monsoon", seasonAutumn: "Autumn",
    seasonMonthEyebrow: "Month explorer",
    seasonFoodsTitle: "Fresh picks for {month}",
    seasonBenefitFallback: "A colorful food to add variety to your meals.",
    previousMonth: "Previous month", nextMonth: "Next month",
    seasonEmpty: "No foods are listed for this month yet.",
    seasonRegionNote: "Seasons vary by region. Foods with broad season notes are shown as flexible picks; ask what is fresh near you.",
    seasonItemsNote: "Here are up to six picks. Browse the full month list below.",
    seasonFallbackNote: "No exact month notes are available yet. These general foods are not confirmed as in season.",
    seasonTipHeading: "Why eat in season?",
    seasonTipFresh: "Foods in season are often fresher because they travel less.",
    seasonTipAffordable: "They can cost less when local supplies are plentiful.",
    seasonTipTastier: "Ripe, in-season produce can taste especially good.",
    seasonBrowseButton: "See all foods for this month",
    seasonFilterLabel: "Showing foods for {month}; broad season notes may also appear.",
    seasonFilterFallback: "No exact season notes for {month}; showing general foods instead.",
    clearSeasonFilter: "Clear month",
    journeyProgressLabel: "Journey progress",
    journeyDiscovered: "Foods discovered: {count} of {total}",
    journeyNextUnlock: "View {count} more different food details to open the next month.",
    journeyAllOpen: "All 12 months are open. Enjoy exploring!",
    journeySkipAhead: "Skip ahead — open all months",
    journeyStartAgain: "Start again",
    journeyLocked: "Locked",
    journeyOpen: "Open",
    journeyCurrent: "Current month",
    journeyStopAria: "{month}, {season}. {status}",
    journeyLockedStopAria: "{month} is locked. View {count} more different food details to open the next month.",
    journeyUnlockMessage: "Lovely! {month} is open. Keep exploring!",
    journeySkipMessage: "All 12 months are open. Explore at your own pace.",
    journeyResetMessage: "Journey restarted. {month} and the next month are open.",
    foodDayEyebrow: "A fresh pick for today",
    foodDayTitle: "Food of the day",
    foodDayIntro: "One seasonal food to enjoy and learn about.",
    foodDayMonth: "A pick for {month}",
    seeDetails: "See details",
    shortcutsEyebrow: "Start here",
    shortcutsTitle: "Where would you like to go?",
    shortcutsIntro: "Pick one place to explore.",
    homeBrowseShortcut: "Browse foods",
    homeFavoritesShortcut: "My favorites",
    homeGoalsShortcut: "Foods for my goals",
    goalSectionEyebrow: "Choose what matters to you",
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
    shortcutsEyebrow: "Start here", shortcutsTitle: "Where would you like to go?",
    shortcutsIntro: "Pick one place to explore.",
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
    themeDarkShortLabel: "డార్క్", themeLightShortLabel: "లైట్",
    calmMode: "ప్రశాంత మోడ్", calmModeOn: "ఆన్", calmModeOff: "ఆఫ్",
    favoritesLabel: "ఇష్టమైనవి", navBrowse: "చూడండి",
    searchOpen: "వెతకండి", searchClose: "మూసివేయండి", searchButtonLabel: "వెతకండి",
    searchLabel: "పండ్లు, కూరగాయల కోసం వెతకండి",
    searchPlaceholder: "“పాలకూర” లేదా “spinach” అని వెతకండి...",
    searchHint: "పేరు, పోషకం లేదా ప్రయోజనంతో వెతకండి",
    heroEyebrow: "ప్రతిరోజూ కొంచెం మంచితనం", heroTitleLine1: "మంచి విషయాలు",
    heroTitleLine2: "ఇక్కడే ", heroTitleAccent: "పెరుగుతాయి.",
    heroDescription: "పండ్లు, కూరగాయల్లోని మంచి విషయాలను తెలుసుకోండి.",
    greetingMorning: "శుభోదయం! ఈ రోజు కొత్తగా మొదలుపెడదాం.",
    greetingAfternoon: "శుభ మధ్యాహ్నం! తాజా మంచి ఆహారాన్ని చూడండి.",
    greetingEvening: "శుభ సాయంత్రం! మీ కోసం మంచి ఆహారాన్ని ఎంచుకోండి.",
    seasonHeroEyebrow: "తాజా ఆహారంతో మీ ఏడాది",
    seasonHeroTitle: "సీజన్ల వెంట తాజా ఆహార ప్రయాణం",
    seasonHeroDescription: "నెలనెలా దొరికే పండ్లు, కూరగాయలను తెలుసుకోండి. వాటిని సులభంగా ఎలా తినాలో చూడండి.",
    seasonWheelEyebrow: "ఏడాది పొడవునా ఒక దారి",
    journeyTitle: "తెరిచి ఉన్న నెలను ఎంచుకోండి",
    journeyRouteAria: "నెలల వెంట సీజన్ల ఆహార ప్రయాణం",
    seasonLegendAria: "ఋతువులు",
    seasonWinter: "శీతాకాలం", seasonSpring: "వసంతం", seasonSummer: "వేసవి",
    seasonMonsoon: "వర్షాకాలం", seasonAutumn: "శరదృతువు",
    seasonMonthEyebrow: "నెలను ఎంచుకోండి",
    seasonFoodsTitle: "{month} నెల తాజా ఎంపికలు",
    seasonBenefitFallback: "మీ భోజనంలో వైవిధ్యం కోసం ఈ రంగుల ఆహారాన్ని ప్రయత్నించండి.",
    previousMonth: "గత నెల", nextMonth: "తదుపరి నెల",
    seasonEmpty: "ఈ నెలకు సరిపోయే ఆహారాలు ఇంకా జాబితాలో లేవు.",
    seasonRegionNote: "పంట కాలం ప్రాంతాన్ని బట్టి మారుతుంది. కాలం స్పష్టంగా లేని ఆహారాలను కూడా ఎంపికల్లో చూపిస్తాం; మీ దగ్గర ఏవి తాజాగా ఉన్నాయో అడగండి.",
    seasonItemsNote: "ఇక్కడ ఆరు వరకు ఎంపికలు ఉన్నాయి. ఈ నెలలోని అన్ని ఆహారాలను కింద చూడండి.",
    seasonFallbackNote: "నెలల వారీ ఖచ్చితమైన వివరాలు ఇంకా లేవు. ఇవి సాధారణ ఆహార ఎంపికలు మాత్రమే; ఈ సీజన్‌లోనే దొరుకుతాయని నిర్ధారణ లేదు.",
    seasonTipHeading: "సీజన్‌లో దొరికేవి ఎందుకు తినాలి?",
    seasonTipFresh: "సీజన్‌లో దొరికేవి దూరం నుంచి రావాల్సిన అవసరం తక్కువ కాబట్టి తాజాగా ఉండొచ్చు.",
    seasonTipAffordable: "స్థానికంగా పంట ఎక్కువగా ఉన్నప్పుడు వాటి ధర తక్కువగా ఉండొచ్చు.",
    seasonTipTastier: "సరైన కాలంలో పండిన పండ్లు, కూరగాయలు రుచిగా ఉంటాయి.",
    seasonBrowseButton: "ఈ నెలలో ఉన్న అన్ని ఆహారాలు చూడండి",
    seasonFilterLabel: "{month} నెల ఆహారాలు; సాధారణ పంటకాల వివరాలున్నవి కూడా కనిపించవచ్చు.",
    seasonFilterFallback: "{month} నెలకు ఖచ్చితమైన పంటకాల వివరాలు లేవు; బదులుగా సాధారణ ఆహారాలను చూపిస్తున్నాం.",
    clearSeasonFilter: "నెల ఎంపిక తీసేయండి",
    journeyProgressLabel: "ప్రయాణ పురోగతి",
    journeyDiscovered: "తెలుసుకున్న ఆహారాలు: {count} / {total}",
    journeyNextUnlock: "తర్వాతి నెలను తెరవడానికి ఇంకా {count} వేర్వేరు ఆహారాల వివరాలు చూడండి.",
    journeyAllOpen: "12 నెలలూ తెరిచి ఉన్నాయి. మీకు నచ్చినట్లు చూడండి!",
    journeySkipAhead: "ముందుకు వెళ్లండి — అన్ని నెలలూ తెరవండి",
    journeyStartAgain: "మళ్లీ మొదలుపెట్టండి",
    journeyLocked: "లాక్‌లో ఉంది",
    journeyOpen: "తెరిచి ఉంది",
    journeyCurrent: "ప్రస్తుత నెల",
    journeyStopAria: "{month}, {season}. {status}",
    journeyLockedStopAria: "{month} ఇంకా లాక్‌లో ఉంది. దాన్ని తెరవడానికి ఇంకా {count} వేర్వేరు ఆహారాల వివరాలు చూడండి.",
    journeyUnlockMessage: "బాగుంది! {month} నెల తెరుచుకుంది. మరిన్ని ఆహారాలు తెలుసుకోండి!",
    journeySkipMessage: "12 నెలలూ తెరిచాయి. మీకు నచ్చినట్లు చూడండి.",
    journeyResetMessage: "ప్రయాణం మళ్లీ మొదలైంది. {month}, తర్వాతి నెల తెరిచి ఉన్నాయి.",
    foodDayEyebrow: "ఈ రోజు తాజా ఎంపిక",
    foodDayTitle: "రోజు ఆహారం",
    foodDayIntro: "ఈ రోజు తెలుసుకోవడానికి, ఆస్వాదించడానికి ఒక సీజన్ ఆహారం.",
    foodDayMonth: "{month} నెల నుంచి ఒక ఎంపిక",
    seeDetails: "వివరాలు చూడండి",
    shortcutsEyebrow: "ఇక్కడి నుంచి మొదలుపెట్టండి",
    shortcutsTitle: "మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?",
    shortcutsIntro: "చూడటానికి ఒక చోటును ఎంచుకోండి.",
    homeBrowseShortcut: "ఆహారాలను చూడండి",
    homeFavoritesShortcut: "నా ఇష్టమైనవి",
    homeGoalsShortcut: "నా లక్ష్యాలకు సరిపోయేవి",
    goalSectionEyebrow: "మీకు ముఖ్యమైనదాన్ని ఎంచుకోండి",
    monthNames: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"],
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
    shortcutsEyebrow: "ఇక్కడి నుంచి మొదలుపెట్టండి", shortcutsTitle: "మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?",
    shortcutsIntro: "చూడటానికి ఒక చోటును ఎంచుకోండి.",
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
let journeyProgress = loadJourneyProgress();

// Keep only known food names so old or edited saved progress stays safe.
function loadJourneyProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(journeyStorageKey) || "null");
    const knownFoods = new Set(produceData.map((item) => item.name.en));
    const discovered = Array.isArray(saved?.discovered)
      ? [...new Set(saved.discovered.filter((name) => typeof name === "string" && knownFoods.has(name)))]
      : [];
    return { discovered, skipped: saved?.skipped === true };
  } catch (error) {
    console.warn("Fresh Facts could not read seasonal journey progress.", error);
    return { discovered: [], skipped: false };
  }
}

function saveJourneyProgress() {
  try {
    localStorage.setItem(journeyStorageKey, JSON.stringify(journeyProgress));
  } catch (error) {
    console.warn("Fresh Facts could not save seasonal journey progress.", error);
  }
}

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

// Month lists use English text if a translation is missing or incomplete.
function localizedMonthNames() {
  const englishNames = translations.en.monthNames;
  const selectedNames = (translations[language] || translations.en).monthNames;
  if (!Array.isArray(selectedNames) || selectedNames.length !== 12) return englishNames;
  return selectedNames.map((name, index) => typeof name === "string" && name.trim() ? name : englishNames[index]);
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

// These broad season groups are a visual guide for India, not exact farm calendars.
const monthsBySeason = {
  winter: [11, 0, 1],
  spring: [2, 3],
  summer: [4, 5],
  monsoon: [6, 7, 8],
  fall: [9, 10]
};

function seasonIncludesMonth(seasonDescription, month) {
  if (typeof seasonDescription !== "string" || !seasonDescription.trim()) return null;
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
  if (seasons.length === 0) return null;
  return seasons.some(([, modifier, season]) => {
    const months = monthsBySeason[season];
    if (!months) return false;
    if (modifier === "early") return months[0] === month;
    if (modifier === "late") return months[months.length - 1] === month;
    return months.includes(month);
  });
}

// Prefer exact month numbers; use season text when the optional list is missing.
function itemMonthStatus(item, month) {
  const explicitMonths = item.months;
  const hasValidMonthList = Array.isArray(explicitMonths)
    && explicitMonths.length > 0
    && explicitMonths.every((number) => Number.isInteger(number) && number >= 1 && number <= 12);
  if (hasValidMonthList) return explicitMonths.includes(month + 1) ? "specific" : "not-listed";
  if (item.season.en.toLowerCase().includes("year-round")) return "year-round";
  const seasonMatch = seasonIncludesMonth(item.season.en, month);
  return seasonMatch === null ? "unclear" : seasonMatch ? "seasonal" : "not-listed";
}

function itemMatchesMonth(item, month) {
  const status = itemMonthStatus(item, month);
  return status !== "not-listed";
}

function getFoodsForMonth(month) {
  const priority = { specific: 3, seasonal: 2, "year-round": 1, unclear: 0 };
  const seasonalFoods = produceData
    .filter((item) => itemMatchesMonth(item, month))
    .sort((first, second) => priority[itemMonthStatus(second, month)] - priority[itemMonthStatus(first, month)]);
  // If season notes are incomplete, show general foods with a clear note instead of a blank month.
  return seasonalFoods.length ? seasonalFoods : [...produceData];
}

function seasonForMonth(month) {
  if (monthsBySeason.winter.includes(month)) return "winter";
  if (monthsBySeason.spring.includes(month)) return "spring";
  if (monthsBySeason.summer.includes(month)) return "summer";
  if (monthsBySeason.monsoon.includes(month)) return "monsoon";
  return "fall";
}

const seasonTranslationKeys = {
  winter: "seasonWinter",
  spring: "seasonSpring",
  summer: "seasonSummer",
  monsoon: "seasonMonsoon",
  fall: "seasonAutumn"
};
const seasonIcons = { winter: "❄️", spring: "🌷", summer: "☀️", monsoon: "🌧️", fall: "🍂" };

function unlockedJourneyMonthCount() {
  return journeyProgress.skipped
    ? 12
    : Math.min(12, 2 + Math.floor(journeyProgress.discovered.length / foodsPerJourneyUnlock));
}

function journeyMonthOffset(month) {
  return (month - journeyStartMonth + 12) % 12;
}

function isJourneyMonthUnlocked(month) {
  return journeyMonthOffset(month) < unlockedJourneyMonthCount();
}

function journeyUnlocksNeeded() {
  return foodsPerJourneyUnlock - (journeyProgress.discovered.length % foodsPerJourneyUnlock);
}

function renderJourneyProgress() {
  const progress = document.getElementById("journey-progress");
  const totalFoods = produceData.length;
  const allMonthsOpen = unlockedJourneyMonthCount() === 12;
  progress.max = Math.max(totalFoods, 1);
  progress.value = journeyProgress.discovered.length;
  document.getElementById("journey-discovered-count").textContent = localizedText("journeyDiscovered", {
    count: journeyProgress.discovered.length,
    total: totalFoods
  });
  document.getElementById("journey-unlock-hint").textContent = localizedText(
    allMonthsOpen ? "journeyAllOpen" : "journeyNextUnlock",
    { count: journeyUnlocksNeeded() }
  );
  document.getElementById("journey-skip").disabled = allMonthsOpen;
  document.getElementById("journey-map").classList.toggle("journey-complete", allMonthsOpen);

  const previousMonth = (selectedMonth + 11) % 12;
  const nextMonth = (selectedMonth + 1) % 12;
  document.getElementById("previous-month").disabled = !isJourneyMonthUnlocked(previousMonth);
  document.getElementById("next-month").disabled = !isJourneyMonthUnlocked(nextMonth);
}

function renderSeasonPath() {
  const monthNames = localizedMonthNames();
  document.documentElement.dataset.season = seasonForMonth(selectedMonth);
  const monthContainer = document.getElementById("journey-map");
  const monthButtons = Array.from({ length: 12 }, (_, month) => {
    const season = seasonForMonth(month);
    const isSelected = month === selectedMonth;
    const isUnlocked = isJourneyMonthUnlocked(month);
    const isCurrent = month === journeyStartMonth;
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const seasonLabel = document.createElement("small");
    const status = document.createElement("span");
    const statusIcon = document.createElement("span");

    button.className = "journey-stop";
    button.type = "button";
    button.dataset.month = String(month);
    button.dataset.season = season;
    button.disabled = !isUnlocked;
    button.setAttribute("aria-pressed", String(isSelected));
    button.setAttribute("aria-label", isUnlocked
      ? localizedText("journeyStopAria", {
        month: monthNames[month],
        season: localizedText(seasonTranslationKeys[season]),
        status: localizedText(isCurrent ? "journeyCurrent" : "journeyOpen")
      })
      : localizedText("journeyLockedStopAria", {
        month: monthNames[month],
        count: journeyUnlocksNeeded()
      }));

    const journeyPosition = journeyMonthOffset(month);
    const row = Math.floor(journeyPosition / 3);
    const positionInRow = journeyPosition % 3;
    const column = row % 2 === 0 ? positionInRow : 2 - positionInRow;
    button.style.gridColumn = String(column + 1);
    button.style.gridRow = String(row + 1);

    icon.className = "journey-stop-season-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = seasonIcons[season];
    copy.className = "journey-stop-copy";
    name.textContent = monthNames[month];
    seasonLabel.textContent = localizedText(seasonTranslationKeys[season]);
    copy.append(name, seasonLabel);
    status.className = "journey-stop-state";
    statusIcon.setAttribute("aria-hidden", "true");
    statusIcon.textContent = isUnlocked ? "✓" : "🔒";
    status.append(statusIcon, document.createTextNode(
      localizedText(isUnlocked ? (isCurrent ? "journeyCurrent" : "journeyOpen") : "journeyLocked")
    ));
    button.append(icon, copy, status);

    if (isSelected) {
      button.classList.add("is-selected");
      const apple = document.createElement("span");
      const smile = document.createElement("span");
      apple.className = "journey-apple";
      apple.setAttribute("aria-hidden", "true");
      apple.textContent = "🍎";
      smile.className = "journey-apple-smile";
      smile.textContent = "☺";
      apple.append(smile);
      button.append(apple);
    }

    button.addEventListener("click", (event) => selectSeasonMonth(month, true, event.detail === 0));
    button.addEventListener("keydown", (event) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!forward && !backward) return;
      event.preventDefault();
      const step = forward ? 1 : -1;
      for (let distance = 1; distance < 12; distance += 1) {
        const next = (month + step * distance + 120) % 12;
        if (!isJourneyMonthUnlocked(next)) continue;
        selectSeasonMonth(next, false, true);
        break;
      }
    });
    return button;
  });
  monthContainer.replaceChildren(...monthButtons);
  document.getElementById("season-current-label").textContent = monthNames[selectedMonth];
  document.getElementById("season-foods-title").textContent = localizedText("seasonFoodsTitle", {
    month: monthNames[selectedMonth]
  });

  const tipKey = ["seasonTipFresh", "seasonTipAffordable", "seasonTipTastier"][selectedMonth % 3];
  document.getElementById("season-tip").textContent = localizedText(tipKey);
  renderJourneyProgress();
}

function renderSeasonFoods() {
  const foods = getFoodsForMonth(selectedMonth);
  const list = document.getElementById("season-food-list");
  const itemsToShow = foods.slice(0, 6);
  const hasSeasonMatches = itemsToShow.some((item) => itemMonthStatus(item, selectedMonth) !== "not-listed");
  const note = document.getElementById("season-items-note");
  document.getElementById("season-empty").hidden = true;
  note.hidden = hasSeasonMatches && foods.length <= itemsToShow.length;
  note.textContent = localizedText(hasSeasonMatches ? "seasonItemsNote" : "seasonFallbackNote");

  list.replaceChildren(...itemsToShow.map((item) => {
    const card = document.createElement("article");
    card.className = "season-food-card";
    const emoji = document.createElement("span");
    emoji.className = "season-food-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = item.emoji;
    const copy = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = localizedFoodValue(item, "name");
    const benefit = document.createElement("p");
    const details = document.createElement("button");
    const benefits = localizedFoodValue(item, "benefits");
    benefit.textContent = Array.isArray(benefits) && benefits.length
      ? benefits[0]
      : localizedText("seasonBenefitFallback");
    copy.append(name, benefit);
    details.className = "season-food-details";
    details.type = "button";
    details.dataset.details = item.name.en;
    details.textContent = localizedText("seeDetails");
    card.append(emoji, copy, details);
    return card;
  }));
}

function renderFoodOfTheDay(date = new Date()) {
  const month = date.getMonth();
  const foods = getFoodsForMonth(month);
  const dailyFoods = foods.length ? foods : produceData;
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), month, date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000
  );
  const item = dailyFoods[dayOfYear % dailyFoods.length];
  const benefits = localizedFoodValue(item, "benefits");
  document.getElementById("food-of-day-emoji").textContent = item.emoji;
  document.getElementById("food-of-day-name").textContent = localizedFoodValue(item, "name");
  document.getElementById("food-of-day-season").textContent = localizedText("foodDayMonth", {
    month: localizedMonthNames()[month]
  });
  document.getElementById("food-of-day-benefit").textContent = Array.isArray(benefits) && benefits.length
    ? benefits[0]
    : localizedText("seasonBenefitFallback");
  document.getElementById("food-of-day-details").dataset.details = item.name.en;
}

function renderHomeFoodSections() {
  renderSeasonPath();
  renderSeasonFoods();
  renderFoodOfTheDay();
}

// Draw a colored route and connect the month stops in calendar order.
function buildJourneyRoute() {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const route = document.getElementById("journey-route-segments");
  const points = Array.from({ length: 12 }, (_, journeyPosition) => {
    const month = (journeyStartMonth + journeyPosition) % 12;
    const row = Math.floor(journeyPosition / 3);
    const positionInRow = journeyPosition % 3;
    const column = row % 2 === 0 ? positionInRow : 2 - positionInRow;
    return { x: 166 + column * 334, y: 65 + row * 130, season: seasonForMonth(month) };
  });
  route.replaceChildren();
  points.slice(1).forEach((point, index) => {
    const previous = points[index];
    const segment = document.createElementNS(svgNamespace, "path");
    segment.setAttribute("d", `M ${previous.x} ${previous.y} L ${point.x} ${point.y}`);
    segment.setAttribute("class", `journey-route-segment season-${point.season}`);
    route.append(segment);
  });
}

function initializeSeasonExplorer() {
  buildJourneyRoute();
  document.getElementById("previous-month").addEventListener("click", () => {
    selectSeasonMonth((selectedMonth + 11) % 12);
  });
  document.getElementById("next-month").addEventListener("click", () => {
    selectSeasonMonth((selectedMonth + 1) % 12);
  });
  document.getElementById("month-browse-button").addEventListener("click", () => {
    state.category = "all";
    state.benefit = "";
    state.favoritesOnly = false;
    state.search = "";
    state.seasonMonth = selectedMonth;
    document.getElementById("search-input").value = "";
    document.querySelectorAll('[data-filter-type="category"]').forEach((button) => {
      const isAll = button.dataset.filterValue === "all";
      button.classList.toggle("active", isAll);
      button.setAttribute("aria-pressed", String(isAll));
    });
    document.querySelectorAll('[data-filter-type="benefit"]').forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });
    renderProduce();
    document.getElementById("browse").scrollIntoView({ behavior: motionDisabled() ? "auto" : "smooth" });
  });
  document.getElementById("journey-skip").addEventListener("click", () => {
    journeyProgress.skipped = true;
    saveJourneyProgress();
    renderSeasonPath();
    document.getElementById("journey-feedback").textContent = localizedText("journeySkipMessage");
  });
  document.getElementById("journey-reset").addEventListener("click", () => {
    journeyProgress = { discovered: [], skipped: false };
    selectedMonth = journeyStartMonth;
    saveJourneyProgress();
    renderHomeFoodSections();
    document.getElementById("journey-feedback").textContent = localizedText("journeyResetMessage", {
      month: localizedMonthNames()[journeyStartMonth]
    });
  });
  document.getElementById("clear-season-filter").addEventListener("click", () => {
    state.seasonMonth = null;
    renderProduce();
  });
}

function selectSeasonMonth(month, revealFoods = false, focusFoods = false) {
  if (!isJourneyMonthUnlocked(month)) {
    document.getElementById("journey-feedback").textContent = localizedText("journeyLockedStopAria", {
      month: localizedMonthNames()[month],
      count: journeyUnlocksNeeded()
    });
    return;
  }
  selectedMonth = (month + 12) % 12;
  renderSeasonPath();
  renderSeasonFoods();
  if (revealFoods) {
    document.getElementById("season-month-panel").scrollIntoView({
      behavior: motionDisabled() ? "auto" : "smooth",
      block: "nearest"
    });
  }
  if (focusFoods) document.getElementById("season-foods-title").focus();
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
  const monthFoods = state.seasonMonth === null ? null : new Set(getFoodsForMonth(state.seasonMonth));
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
      && (monthFoods === null || monthFoods.has(item))
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
    && state.category === "all" && !state.benefit && state.seasonMonth === null;
  emptyState.hidden = matchingItems.length > 0;
  emptyState.classList.toggle("favorites-empty", isEmptyFavorites);
  document.getElementById("empty-illustration").textContent = isEmptyFavorites ? "💚" : "🧺";
  document.getElementById("empty-title").textContent = localizedText(isEmptyFavorites ? "favoriteEmptyTitle" : "emptyTitle");
  document.getElementById("empty-text").textContent = localizedText(isEmptyFavorites ? "favoriteEmptyText" : "emptyText");
  document.getElementById("favorites-toggle").setAttribute("aria-pressed", String(state.favoritesOnly));
  document.getElementById("favorite-count").textContent = String(favorites.length);
  document.getElementById("shortcut-favorite-count").textContent = String(favorites.length);
  const seasonFilterStatus = document.getElementById("season-filter-status");
  seasonFilterStatus.hidden = state.seasonMonth === null;
  if (state.seasonMonth !== null) {
    const hasSeasonMatches = getFoodsForMonth(state.seasonMonth)
      .some((item) => itemMonthStatus(item, state.seasonMonth) !== "not-listed");
    document.getElementById("season-filter-label").textContent = localizedText("seasonFilterLabel", {
      month: localizedMonthNames()[state.seasonMonth]
    });
    if (!hasSeasonMatches) {
      document.getElementById("season-filter-label").textContent = localizedText("seasonFilterFallback", {
        month: localizedMonthNames()[state.seasonMonth]
      });
    }
  }
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
  recordJourneyDiscovery(item);
  activateProduceModel(modelViewer);
}

// Count each food once, even if a visitor opens its details more than once.
function recordJourneyDiscovery(item) {
  if (journeyProgress.discovered.includes(item.name.en)) return;
  const previousOpenMonths = unlockedJourneyMonthCount();
  journeyProgress.discovered.push(item.name.en);
  saveJourneyProgress();

  const newlyOpenMonths = unlockedJourneyMonthCount();
  renderSeasonPath();
  if (newlyOpenMonths > previousOpenMonths) {
    const newMonth = (journeyStartMonth + previousOpenMonths) % 12;
    const unlockedStop = document.querySelector(`.journey-stop[data-month="${newMonth}"]`);
    if (unlockedStop && !motionDisabled()) {
      unlockedStop.classList.add("just-unlocked");
      window.setTimeout(() => unlockedStop.classList.remove("just-unlocked"), 1400);
    }
    document.getElementById("journey-feedback").textContent = localizedText("journeyUnlockMessage", {
      month: localizedMonthNames()[newMonth]
    });
    return;
  }
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
  state.seasonMonth = null;
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
  themeButton.querySelector(".icon-button-label").textContent = localizedText(
    isDark ? "themeLightShortLabel" : "themeDarkShortLabel"
  );
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
  themeButton.querySelector(".icon-button-label").textContent = localizedText(
    isDark ? "themeLightShortLabel" : "themeDarkShortLabel"
  );
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
  initializeSeasonExplorer();
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
  document.getElementById("home-favorites-shortcut").addEventListener("click", () => {
    state.category = "all";
    state.benefit = "";
    state.favoritesOnly = true;
    state.search = "";
    state.seasonMonth = null;
    document.getElementById("search-input").value = "";
    document.querySelectorAll('[data-filter-type="category"]').forEach((button) => {
      const isAll = button.dataset.filterValue === "all";
      button.classList.toggle("active", isAll);
      button.setAttribute("aria-pressed", String(isAll));
    });
    document.querySelectorAll('[data-filter-type="benefit"]').forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });
    renderProduce();
    document.getElementById("browse").scrollIntoView({ behavior: motionDisabled() ? "auto" : "smooth" });
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
    state.seasonMonth = null;
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
