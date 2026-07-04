export type MenuPrice = {
  label: string;
  value: string;
};

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  prices?: MenuPrice[];
};

export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

export const restaurant = {
  name: "Time Out",
  phone: "0469 69 22 55",
  address: "Rozenberg 9, 2400 Mol",
  tagline: "Kebab, pizza, pasta, snacks, grill en pita",
};

const size = (small: string, large: string): MenuPrice[] => [
  { label: "Klein", value: small },
  { label: "Groot", value: large },
];

const normalMega = (normal: string, mega: string): MenuPrice[] => [
  { label: "Normaal", value: normal },
  { label: "MEGA", value: mega },
];

const pizzaSize = (medium: string, large: string): MenuPrice[] => [
  { label: "M", value: medium },
  { label: "L", value: large },
];

export const menuSections: MenuSection[] = [
  {
    id: "menus",
    title: "Menu's",
    note: "Geserveerd met frieten en frisdrank.",
    items: [
      { name: "Menu broodje", price: "€12,00" },
      { name: "Menu dürüm", price: "€12,00" },
      { name: "Menu dürüm", price: "€13,00" },
      { name: "Menu kip", price: "€13,00" },
      { name: "Menu shoarma", price: "€13,00" },
      { name: "Menu köfte", price: "€13,00" },
      { name: "Huisbereide hamburger", price: "€12,00" },
      { name: "Menu hamburger", price: "€10,00" },
    ],
  },
  {
    id: "broodjes",
    title: "Broodjes",
    items: [
      { name: "Döner", prices: size("€9,00", "€14,00") },
      { name: "Kip", prices: size("€10,00", "€15,00") },
      { name: "Shoarma", prices: size("€10,00", "€15,00") },
      { name: "Köfte", prices: size("€10,00", "€15,00") },
      { name: "Mix", description: "Kip en kebab", prices: size("€11,00", "€16,00") },
      { name: "Şiş", description: "Kalfsvlees", prices: size("€11,00", "€15,00") },
      { name: "Vegetarisch", prices: size("€5,00", "€8,00") },
      { name: "Groentenburger", prices: size("€8,00", "€11,00") },
      { name: "Kip teriyaki", prices: size("€11,00", "€16,00") },
      { name: "Adana", prices: size("€9,00", "€12,00") },
      { name: "Nugget", prices: size("€8,50", "€12,00") },
      { name: "Falafel", prices: size("€8,50", "€11,50") },
    ],
  },
  {
    id: "durums",
    title: "Durums",
    items: [
      { name: "Döner", prices: size("€9,00", "€11,00") },
      { name: "Kip", prices: size("€10,00", "€11,50") },
      { name: "Shoarma", prices: size("€10,00", "€11,50") },
      { name: "Köfte", prices: size("€10,00", "€11,50") },
      { name: "Mix", description: "Kip en kebab", prices: size("€11,00", "€12,00") },
      { name: "Şiş", prices: size("€11,00", "€12,00") },
      { name: "Vegetarisch", prices: size("€5,00", "€9,00") },
      { name: "Groentenburger", prices: size("€8,00", "€10,00") },
      { name: "Kip teriyaki", prices: size("€11,00", "€15,00") },
      { name: "Adana", prices: size("€8,00", "€11,50") },
      { name: "Nugget", prices: size("€8,50", "€12,00") },
      { name: "Falafel", prices: size("€8,00", "€11,50") },
    ],
  },
  {
    id: "lahmacun",
    title: "Lahmacun",
    items: [
      { name: "Lahmacun klassiek", price: "€5,00" },
      { name: "Lahmacun kebap", price: "€10,00" },
      { name: "Lahmacun kip", price: "€10,00" },
      { name: "Lahmacun köfte", price: "€10,00" },
      { name: "Lahmacun mix", description: "Kip en kebab", price: "€12,00" },
    ],
  },
  {
    id: "kapsalon",
    title: "Kapsalon",
    items: [
      { name: "Döner", prices: normalMega("€9,00", "€14,00") },
      { name: "Kip", prices: normalMega("€11,00", "€16,00") },
      { name: "Shoarma", prices: normalMega("€11,00", "€16,00") },
      { name: "Köfte", prices: normalMega("€11,00", "€16,00") },
      { name: "Mix", description: "Kip en kebab", prices: normalMega("€12,00", "€17,00") },
      { name: "Trippel Mic", description: "Kip, kebab en shaorma", prices: normalMega("€13,00", "€18,00") },
      { name: "Adana", prices: normalMega("€11,00", "€16,00") },
      { name: "Falafel", prices: normalMega("€10,00", "€15,00") },
      { name: "Vegetarisch", prices: normalMega("€9,00", "€14,00") },
    ],
  },
  {
    id: "stoofschotels",
    title: "Stoofschotels",
    note: "Geserveerd met frieten of rijst.",
    items: [
      { name: "Stoofpot köfte", description: "Gehaktballetjes met tomatensaus", price: "€16,00" },
      { name: "Stoofpot kipfilet", description: "Roomsaus of tomatensaus", price: "€16,00" },
      { name: "Time Out", description: "Kalfsvlees met tomatensaus", price: "€17,00" },
      { name: "Stoofpot scampi", description: "Roomsaus of tomatensaus", price: "€20,00" },
    ],
  },
  {
    id: "burgers",
    title: "Burgers",
    note: "Geserveerd met frieten.",
    items: [
      { name: "Timeout Classic Cheese Burger", description: "200g", price: "€12,00" },
      { name: "Hot Chili Burger", description: "200g, jalapeño en sriracha", price: "€12,00" },
      { name: "Bacon & Cheese Burger", price: "€12,00" },
    ],
  },
  {
    id: "pastas",
    title: "Pastas",
    items: [
      { name: "Pasta Bolognese", price: "€12,00" },
      { name: "Pasta Napolitana", price: "€12,00" },
      { name: "Pasta Al Pollo", price: "€12,00" },
      { name: "Pasta Funghi", price: "€12,00" },
      { name: "Pasta BBQ Chicken", price: "€12,00" },
      { name: "Pasta Curry Oriental", price: "€12,00" },
      { name: "Pasta Pesto Chicken", price: "€12,00" },
      { name: "Pasta Arrabbiata", price: "€12,00" },
      { name: "Pasta Vegi", price: "€12,00" },
      { name: "Pasta Popeye", price: "€12,00" },
      { name: "Pasta Carbonara", price: "€12,00" },
      { name: "Pasta Quattro Formaggi", price: "€12,00" },
      { name: "Pasta Frutti di Mare", price: "€13,00" },
      { name: "Pasta Scampi", price: "€13,00" },
      { name: "Pasta Bumbush", description: "Mozarella, gouda en parmezaan", price: "€13,00" },
      { name: "Pasta Zalm", price: "€14,00" },
      { name: "Lasagna", price: "€13,00" },
    ],
  },
  {
    id: "salade",
    title: "Salade",
    items: [
      { name: "Groentensalade", description: "Sla, tomaat, komkommer, maïs, wortel en kool", price: "€6,00" },
      { name: "Herder", description: "Tomaat, ui, komkommer en peterselie", price: "€7,00" },
      { name: "Feta", description: "Groentensalade met feta", price: "€9,00" },
      { name: "Tonijn", description: "Groentensalade met tonijn", price: "€9,00" },
      { name: "Kip", description: "Groentensalade met kip", price: "€12,00" },
      { name: "Kip Hawaï", description: "Groentensalade met kip en ananas", price: "€12,00" },
      { name: "Mix", description: "Groentensalade met kip, feta en ananas", price: "€13,00" },
    ],
  },
  {
    id: "schotels",
    title: "Schotels",
    note: "Geserveerd met frieten, rijst of brood.",
    items: [
      { name: "Vegetarisch", description: "Gebakken paprika, champignon, ajuin, olijven en ananas", price: "€13,00" },
      { name: "Falafel", description: "Vegetarisch gefrituurde balletjes", price: "€15,00" },
      { name: "Kebap", description: "Kebab vlees", price: "€15,00" },
      { name: "Köfte", description: "Gegrilde gehaktbal met kruiden", price: "€16,00" },
      { name: "Adana", description: "Pikant gegrilde gehaktstaafjes", price: "€16,00" },
      { name: "Shoarma", description: "Shaorma vlees", price: "€17,00" },
      { name: "Biefstuk", price: "€22,00" },
      { name: "Kip", description: "Gegrilde kipblokjes", price: "€16,00" },
      { name: "Kip teriyaki", description: "Gegrilde kipblokjes met teriyaki", price: "€18,00" },
      { name: "Şiş kebap", description: "Kalfsbrochette", price: "€20,00" },
      { name: "Mix", description: "Kip en kebab", price: "€17,00" },
      { name: "Tribbel mix", description: "Kip, kebab en shaorma", price: "€19,00" },
      { name: "Mix grill", description: "Kip, kebab, shaorma en şiş", price: "€24,00" },
      { name: "Lamskoteletten", price: "€22,00" },
      { name: "Time Out mix grill", description: "Kebab, kip, shaorma, şiş, adana, köfte en lamskotelet", price: "€30,00" },
    ],
  },
  {
    id: "bakjes",
    title: "Bakjes",
    note: "Friet + €3.",
    items: [
      { name: "Bakje kebap", price: "€6,50" },
      { name: "Bakje kip", price: "€7,00" },
      { name: "Bakje shoarma", price: "€7,00" },
      { name: "Bakje mix", description: "Kebab en kip", price: "€7,50" },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    items: [
      { name: "Kip nuggets", description: "8 stuks", price: "€5,00" },
      { name: "Kip fingers", description: "6 stuks", price: "€5,00" },
      { name: "Hamburger", price: "€5,50" },
      { name: "Fishburger", price: "€5,50" },
      { name: "Mini loempia's", description: "6 stuks", price: "€5,00" },
      { name: "American potatoes", price: "€5,00" },
      { name: "Frikandel", price: "€2,50" },
      { name: "Frikandel met frietjes en saus", price: "€5,00" },
      { name: "Chicken wings", description: "6 stuks", price: "€5,00" },
      { name: "Chicken box", description: "5 nuggets, 5 fingers en 5 chicken wings", price: "€14,00" },
      { name: "Mexicano", price: "€5,00" },
      { name: "Hamburger deluxe", description: "Eigen gemaakt kalfsgehakt, uitgebakken tomaat en augurken", price: "€7,50" },
    ],
  },
  {
    id: "lookbroodjes",
    title: "Lookbroodjes",
    items: [
      { name: "Lookbrood natuur", price: "€3,00" },
      { name: "Lookbrood kaas", price: "€4,00" },
      { name: "Lookbrood kaas en ham", price: "€5,00" },
      { name: "Lookbrood kaas en salami", price: "€5,00" },
      { name: "Lookbrood mozzarella en tomaat", price: "€5,00" },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    items: [
      { name: "Portie pepers", price: "€1,00" },
      { name: "Rijst", price: "€4,00" },
      { name: "Frieten klein", price: "€3,50" },
      { name: "Frieten groot", price: "€4,50" },
      { name: "Vlees bij gerechten", price: "€3,00" },
      { name: "Ananas", price: "€2,00" },
      { name: "Kaas/feta", price: "€2,00" },
      { name: "Brood", price: "€2,00" },
      { name: "Special", description: "Ui, paprika en champignon", price: "€2,50" },
    ],
  },
  {
    id: "sauzen",
    title: "Sauzen",
    note: "Sauzen aan €0,50.",
    items: [
      { name: "Cocktail", price: "€0,50" },
      { name: "Look", price: "€0,50" },
      { name: "Samurai", price: "€0,50" },
      { name: "Curry", price: "€0,50" },
      { name: "Andalouse", price: "€0,50" },
      { name: "Sambal", price: "€0,50" },
      { name: "Mayo", price: "€0,50" },
      { name: "Ketchup", price: "€0,50" },
      { name: "Curry ketchup", price: "€0,50" },
      { name: "BBQ", price: "€0,50" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { name: "Chocomousse", price: "€4,00" },
      { name: "Tiramisu", price: "€4,50" },
      { name: "Baklava", description: "4 stuks", price: "€5,00" },
      { name: "Ben & Jerry's", price: "€9,00" },
    ],
  },
  {
    id: "dranken",
    title: "Dranken",
    items: [
      { name: "Ayran", description: "Koud", price: "€2,00" },
      { name: "Water plat/bruis", description: "Koud", price: "€2,50" },
      { name: "Frisdranken", description: "Koud", price: "€2,50" },
      { name: "Ice Tea", description: "Koud", price: "€2,50" },
      { name: "Minute Maid", description: "Koud", price: "€3,00" },
      { name: "Red Bull", description: "Koud", price: "€3,50" },
      { name: "Monster", description: "Koud", price: "€3,50" },
      { name: "Fles cola", description: "Koud", price: "€4,00" },
      { name: "Koffie", description: "Warm", price: "€2,50" },
      { name: "Thee", description: "Warm", price: "€2,50" },
    ],
  },
];

export const pizzaSections: MenuSection[] = [
  {
    id: "pizza-vegetarisch",
    title: "Pizza's Vegetarisch",
    note: "Familie XL + €5.",
    items: [
      { name: "Margherita", description: "Kaas", prices: pizzaSize("€10,00", "€15,00") },
      { name: "Cipolla", description: "Ui", prices: pizzaSize("€10,50", "€15,50") },
      { name: "Funghi", description: "Champignons", prices: pizzaSize("€10,50", "€15,50") },
      { name: "Popeye", description: "Room, spinazie en look", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Valentino", description: "Ui, maïs en olijf", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Venezia", description: "Parmezaan, champignon, olijf en paprika", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Vegetariana", description: "Paprika, champignon, ui, maïs en olijf", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Quattro Formaggi", description: "4 kazen", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Bumbush", description: "Mozzarella, gouda en parmezaan", prices: pizzaSize("€14,00", "€19,00") },
    ],
  },
  {
    id: "pizza-klassiek",
    title: "Pizza's Klassiek",
    items: [
      { name: "Salami", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Borongo", description: "Ham", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Paradiso", description: "Ham, paprika en ui", prices: pizzaSize("€11,00", "€16,00") },
      { name: "Capricciosa", description: "Ham en champignons", prices: pizzaSize("€11,50", "€16,50") },
      { name: "Hawaï", description: "Ham en ananas", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Rustica", description: "Ham en salami", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Chicago", description: "Ham, salami en spek", prices: pizzaSize("€13,00", "€18,00") },
    ],
  },
  {
    id: "pizza-vlees-kip",
    title: "Pizza's Vlees & Kip",
    items: [
      { name: "Kip", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Chicken Hawaï", description: "Kip en ananas", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Pollo Special", description: "Kip, paprika, champignon en ui", prices: pizzaSize("€12,50", "€17,50") },
      { name: "Chicken Cream", description: "Room, kip en champignon", prices: pizzaSize("€12,50", "€17,50") },
      { name: "BBQ Chicken", description: "Kip, paprika, ui en BBQ", prices: pizzaSize("€13,00", "€18,00") },
      { name: "Exotic Chicken", description: "Kip, ananas, mozzarella en maïs", prices: pizzaSize("€13,00", "€18,00") },
    ],
  },
  {
    id: "pizza-kebab-shoarma",
    title: "Pizza's Kebab & Shoarma",
    items: [
      { name: "Kebab", prices: pizzaSize("€11,50", "€16,50") },
      { name: "Shoarma", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Kebab Special", description: "Paprika, champignon en ui", prices: pizzaSize("€12,50", "€17,50") },
      { name: "Shoarma Special", description: "Paprika, champignon en ui", prices: pizzaSize("€12,50", "€17,50") },
      { name: "Triple Mix", description: "Kip, kebab en shoarma", prices: pizzaSize("€13,50", "€18,50") },
      { name: "Time Out", description: "Shoarma, kip, kebab en groenten", prices: pizzaSize("€14,00", "€19,00") },
      { name: "Time Out Special", description: "Time Out met spek", prices: pizzaSize("€15,00", "€20,00") },
    ],
  },
  {
    id: "pizza-pittig",
    title: "Pizza's Pittig & Speciaal",
    items: [
      { name: "Pepperoni", description: "Pikante salami, jalapeño en ui", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Diablo", description: "Pikante salami, gehakt en jalapeño", prices: pizzaSize("€13,00", "€18,00") },
      { name: "Mexicana", description: "Ui, paprika, ham en gehakt", prices: pizzaSize("€15,00", "€20,00") },
    ],
  },
  {
    id: "pizza-vis",
    title: "Pizza's Vis",
    items: [
      { name: "Tonno", description: "Tonijn, kappertjes en ui", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Ansjovis", description: "Ansjovis, kappertjes en look", prices: pizzaSize("€12,00", "€17,00") },
      { name: "Zalm", description: "Zalm, ui en look", prices: pizzaSize("€13,00", "€18,00") },
      { name: "Scampi", description: "Scampi, look en ui", prices: pizzaSize("€14,00", "€19,00") },
      { name: "Frutti di Mare", description: "Zeevruchten en look", prices: pizzaSize("€14,00", "€19,00") },
      { name: "Fishmix", description: "Zalm, tonijn en scampi", prices: pizzaSize("€14,50", "€19,50") },
    ],
  },
  {
    id: "pizza-specials",
    title: "Pizza Specials",
    items: [
      { name: "Big Ben", description: "Ei, ui en ham", price: "€14,00 XL" },
      { name: "La Gondola", description: "Garnaal", price: "€14,00 XL" },
      { name: "Mamma Mia", description: "Ham, champignon en garnaal", price: "€15,00 XL" },
      { name: "Du Chef", description: "Champignon, paprika en gehakt", price: "€15,00 XL" },
      { name: "Prinses", description: "Ham, garnaal en ananas", price: "€15,00 XL" },
      { name: "Festpizza", description: "Champignon, vlees, asperge en bearnaise", price: "€14,00 XL" },
    ],
  },
  {
    id: "kinderpizza",
    title: "Kinderpizza",
    items: [
      { name: "Pinokkio", description: "Ham, ananas en mozzarella", price: "€9,00" },
      { name: "Shero", description: "Ham, ananas en maïs", price: "€9,00" },
      { name: "Bambino", description: "Verse tomaat, kip en ananas", price: "€9,00" },
    ],
  },
];

export const offers = [
  {
    day: "Maandag",
    title: "Kapsalondag",
    items: ["Alle normale kapsalons €9,00", "Alle mega kapsalons €12,00"],
  },
  {
    day: "Dinsdag",
    title: "Pasta dag",
    items: ["Alle pasta's €9,00"],
  },
  {
    day: "Donderdag",
    title: "Pizza Dag",
    items: ["Alle medium pizza's €9,00", "Alle large pizza's €12,00"],
  },
];

export const menuSourcePages = [
  { src: "/menu-source/page-1-large.jpg", alt: "Time Out menu cover" },
  { src: "/menu-source/page-2-large.jpg", alt: "Time Out kebab, pasta and grill menu page" },
  { src: "/menu-source/page-3-large.jpg", alt: "Time Out snacks, drinks and actions menu page" },
  { src: "/menu-source/page-4-large.jpg", alt: "Time Out pizza menu page" },
];

export const allMenuSections = [...menuSections, ...pizzaSections];
