import type { Localized } from "@/lib/i18n";
import type { PhotoKey } from "./photos";

export type Diet = "veg" | "vegan" | "gf" | "spicy";

export const dietLabels: Record<Diet, Localized<string>> = {
  veg: { sr: "Vegetarijansko", en: "Vegetarian" },
  vegan: { sr: "Veganski", en: "Vegan" },
  gf: { sr: "Bez glutena", en: "Gluten-free" },
  spicy: { sr: "Ljuto", en: "Spicy" },
};

export const dietShort: Record<Diet, string> = { veg: "V", vegan: "VG", gf: "GF", spicy: "🌶" };

export type Dish = {
  id: string;
  name: Localized<string>;
  desc: Localized<string>;
  price: number;
  diet: Diet[];
  image: PhotoKey;
  signature?: boolean;
};

export type MenuSection = {
  id: string;
  title: Localized<string>;
  note: Localized<string>;
  dishes: Dish[];
};

export const menuSeason = { sr: "Jesen 2026", en: "Autumn 2026" };
export const menuUpdated = "2026-09-21";

export const menu: MenuSection[] = [
  {
    id: "predjela",
    title: { sr: "Predjela", en: "Starters" },
    note: { sr: "Za sredinu stola ili samo za vas.", en: "For the middle of the table, or just for you." },
    dishes: [
      {
        id: "proja",
        name: { sr: "Proja iz žara", en: "Cornbread from the embers" },
        desc: { sr: "Kajmak iz Topole, ajvar od pečenih paprika, prstohvat dimljene soli", en: "Kajmak from Topola, roasted pepper ajvar, a pinch of smoked salt" },
        price: 690,
        diet: ["veg", "gf"],
        image: "detail/bread-tray",
        signature: true,
      },
      {
        id: "paprike",
        name: { sr: "Pečene paprike", en: "Fire-roasted peppers" },
        desc: { sr: "Belo vinsko sirće, beli luk, prženi orasi, peršun", en: "White wine vinegar, garlic, toasted walnuts, parsley" },
        price: 590,
        diet: ["vegan", "gf"],
        image: "detail/peppers-roasted",
      },
      {
        id: "pastrmka",
        name: { sr: "Pastrmka dimljena na bukvi", en: "Beech-smoked trout" },
        desc: { sr: "Pastrmka sa Vrela, kiselo mleko, kopar, kiseli luk", en: "Trout from the Vrelo spring, cultured milk, dill, pickled onion" },
        price: 1290,
        diet: ["gf"],
        image: "dish/fish",
      },
      {
        id: "tartar",
        name: { sr: "Tartar od junećeg buta", en: "Beef tartare" },
        desc: { sr: "Dimljeno žumance, prženi kapar, lepinja iz peći", en: "Smoked egg yolk, fried capers, wood-oven flatbread" },
        price: 1490,
        diet: [],
        image: "dish/raw-meat-cuts",
      },
      {
        id: "kulen",
        name: { sr: "Kulen sa salaša", en: "Farmhouse kulen" },
        desc: { sr: "Kulen od mangulice iz Kovilja, lukac, domaći hleb", en: "Mangalica kulen from Kovilj, spring onion, homemade bread" },
        price: 1190,
        diet: ["spicy"],
        image: "detail/board-food",
      },
      {
        id: "sirevi",
        name: { sr: "Sirevi iz Zlatnog brega", en: "Zlatni Breg cheeses" },
        desc: { sr: "Tri zrela kravlja i ovčja sira, lipov med, orasi", en: "Three aged cow and sheep cheeses, linden honey, walnuts" },
        price: 1390,
        diet: ["veg", "gf"],
        image: "detail/cheese-nuts",
      },
    ],
  },
  {
    id: "rostilj",
    title: { sr: "Sa roštilja", en: "From the grill" },
    note: { sr: "Bukva i hrast, bez gasa i bez žurbe.", en: "Beech and oak, no gas and no hurry." },
    dishes: [
      {
        id: "cevapi",
        name: { sr: "Ćevapi od mangulice", en: "Mangalica ćevapi" },
        desc: { sr: "Lepinja iz peći, kajmak, crni luk, ljuta papričica", en: "Wood-oven lepinja, kajmak, onion, hot pepper" },
        price: 1190,
        diet: ["spicy"],
        image: "dish/flatbread-grill",
        signature: true,
      },
      {
        id: "pljeskavica",
        name: { sr: "Pljeskavica punjena kajmakom", en: "Kajmak-stuffed pljeskavica" },
        desc: { sr: "Junetina i svinjetina, pečeni luk, urnebes", en: "Beef and pork, charred onion, urnebes cheese spread" },
        price: 1390,
        diet: ["spicy"],
        image: "fire/grill-over-fire",
      },
      {
        id: "vrat",
        name: { sr: "Svinjski vrat sa žara", en: "Pork neck from the embers" },
        desc: { sr: "Pire od pečenog luka, kiseli kupus, senf od šljive", en: "Charred onion purée, sauerkraut, plum mustard" },
        price: 1590,
        diet: ["gf"],
        image: "fire/grill-hands",
      },
      {
        id: "ribeye",
        name: { sr: "Rib-eye 300 g", en: "Rib-eye, 300 g" },
        desc: { sr: "Odležan 35 dana, mladi krompir, zelena paprika iz žara", en: "Dry-aged 35 days, new potatoes, green pepper from the embers" },
        price: 3900,
        diet: ["gf"],
        image: "dish/sauce-pour-steak",
        signature: true,
      },
      {
        id: "som",
        name: { sr: "Dunavski som sa žara", en: "Danube catfish from the grill" },
        desc: { sr: "Paprikaš sos, pečena paprika, kiselo mleko", en: "Paprikash sauce, roasted pepper, cultured milk" },
        price: 2190,
        diet: ["gf", "spicy"],
        image: "dish/fried-fish-pan",
      },
      {
        id: "bukovace",
        name: { sr: "Bukovače sa žara", en: "Oyster mushrooms from the fire" },
        desc: { sr: "Kajmak od indijskog oraha, beli luk, majčina dušica", en: "Cashew kajmak, garlic, wild thyme" },
        price: 1190,
        diet: ["vegan", "gf"],
        image: "dish/grilled-vegetables",
      },
    ],
  },
  {
    id: "glavna",
    title: { sr: "Glavna jela", en: "Mains" },
    note: { sr: "Sporo kuvano, pored vatre.", en: "Slow-cooked, beside the fire." },
    dishes: [
      {
        id: "jagnjetina",
        name: { sr: "Jagnjetina ispod sača", en: "Lamb under the sač" },
        desc: { sr: "Mladi krompir, ruzmarin, sok od pečenja", en: "New potatoes, rosemary, roasting juices" },
        price: 2690,
        diet: ["gf"],
        image: "dish/lamb-shank",
        signature: true,
      },
      {
        id: "obraz",
        name: { sr: "Teleći obraz, 12 sati", en: "Veal cheek, 12 hours" },
        desc: { sr: "Crni Prokupac, pire od celera, pečena šargarepa", en: "Red Prokupac, celeriac purée, roasted carrot" },
        price: 2390,
        diet: ["gf"],
        image: "dish/meat-veg-bowl",
      },
      {
        id: "karadjordjeva",
        name: { sr: "Karađorđeva, na naš način", en: "Karađorđeva schnitzel, our way" },
        desc: { sr: "Teleći file, kajmak, tartar od kiselih krastavaca", en: "Veal fillet, kajmak, pickled cucumber tartare" },
        price: 1890,
        diet: [],
        image: "dish/plate-wood",
      },
      {
        id: "paprike-heljda",
        name: { sr: "Punjene paprike sa heljdom", en: "Peppers stuffed with buckwheat" },
        desc: { sr: "Suve šljive, pečeni paradajz, dimljena paprika", en: "Prunes, roasted tomato, smoked paprika" },
        price: 1290,
        diet: ["vegan", "gf"],
        image: "detail/peppers-stuffed",
      },
      {
        id: "rezanci",
        name: { sr: "Domaći rezanci sa vrganjima", en: "Hand-cut noodles with porcini" },
        desc: { sr: "Vrganji sa Fruške gore, kajmak, crni biber", en: "Fruška Gora porcini, kajmak, black pepper" },
        price: 1490,
        diet: ["veg"],
        image: "dish/pasta-herb",
      },
      {
        id: "corba",
        name: { sr: "Riblja čorba sa Dunava", en: "Danube fish soup" },
        desc: { sr: "Šaran i som, ljuta paprika, domaći hleb", en: "Carp and catfish, hot paprika, homemade bread" },
        price: 990,
        diet: ["spicy"],
        image: "dish/stew-bowl",
      },
    ],
  },
  {
    id: "deserti",
    title: { sr: "Deserti", en: "Desserts" },
    note: { sr: "Za kraj, ili za početak sledeće čaše.", en: "To finish, or to start the next glass." },
    dishes: [
      {
        id: "sljive",
        name: { sr: "Šljive u Prokupcu", en: "Plums in Prokupac" },
        desc: { sr: "Sladoled od kajmaka, cimet, prženi bademi", en: "Kajmak ice cream, cinnamon, toasted almonds" },
        price: 790,
        diet: ["veg", "gf"],
        image: "dish/plums-bowl",
        signature: true,
      },
      {
        id: "krempita",
        name: { sr: "Krempita, naša", en: "Our krempita" },
        desc: { sr: "Vanila iz Madagaskara, karamelizovana kora", en: "Madagascar vanilla, caramelised crust" },
        price: 690,
        diet: ["veg"],
        image: "dish/cake-slice",
      },
      {
        id: "tufahije",
        name: { sr: "Tufahije", en: "Tufahije" },
        desc: { sr: "Jabuke iz Rudnika punjene orasima, šlag", en: "Rudnik apples stuffed with walnuts, whipped cream" },
        price: 650,
        diet: ["veg", "gf"],
        image: "dish/grilled-apples",
      },
      {
        id: "cokolada",
        name: { sr: "Čokolada, med i so", en: "Chocolate, honey and salt" },
        desc: { sr: "Tamna čokolada 70%, lipov med sa Fruške gore, morska so", en: "70% dark chocolate, Fruška Gora linden honey, sea salt" },
        price: 850,
        diet: ["veg", "gf"],
        image: "dish/chocolates-tart",
      },
      {
        id: "sorbet",
        name: { sr: "Sorbet od šljive i tamjanike", en: "Plum and Tamjanika sorbet" },
        desc: { sr: "Bez mleka, jaja i glutena", en: "No dairy, eggs or gluten" },
        price: 590,
        diet: ["vegan", "gf"],
        image: "detail/ice-cream-spoon",
      },
    ],
  },
];

export const allDishes = menu.flatMap((s) => s.dishes);
export const signatureDishes = allDishes.filter((d) => d.signature);

export const formatRsd = (n: number, locale: "sr" | "en") =>
  locale === "sr" ? `${n.toLocaleString("de-DE")} RSD` : `RSD ${n.toLocaleString("en-US")}`;
