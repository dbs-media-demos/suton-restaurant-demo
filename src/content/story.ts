import type { Localized } from "@/lib/i18n";
import type { PhotoKey } from "./photos";

/** "Iz vatre / From the fire": the pinned horizontal chapters. */
export type Chapter = {
  id: string;
  n: string;
  title: Localized<string>;
  text: Localized<string>;
  images: [PhotoKey, PhotoKey];
  video?: string;
};

export const chapters: Chapter[] = [
  {
    id: "vatra",
    n: "01",
    title: { sr: "Vatra", en: "Fire" },
    text: {
      sr: "Svako jutro u 10 palimo bukvu i hrast. Do otvaranja od drveta ostane samo žar, i na njemu kuvamo sve: meso, ribu, povrće, pa čak i desert.",
      en: "Every morning at 10 we light beech and oak. By opening time only embers remain, and we cook everything on them: meat, fish, vegetables, even dessert.",
    },
    images: ["fire/grill-over-fire", "fire/embers-bright"],
    video: "embers",
  },
  {
    id: "zemlja",
    n: "02",
    title: { sr: "Zemlja", en: "Land" },
    text: {
      sr: "Radimo sa pet porodičnih gazdinstava iz Šumadije i Vojvodine. Meni pišemo tek kada vidimo šta je stiglo tog jutra.",
      en: "We work with five family farms in Šumadija and Vojvodina. We only write the menu once we see what arrived that morning.",
    },
    images: ["prod/wheat", "detail/veg-basket"],
  },
  {
    id: "ruke",
    n: "03",
    title: { sr: "Ruke", en: "Hands" },
    text: {
      sr: "Nema mašina za testo i nema gotovih sosova. Proja, lepinje, rezanci i kajmak nastaju u kuhinji, rukama, svaki dan.",
      en: "No dough machines and no ready-made sauces. Cornbread, flatbreads, noodles and kajmak are made in our kitchen, by hand, every day.",
    },
    images: ["chef/plating", "detail/bread-slicing"],
  },
  {
    id: "podrum",
    n: "04",
    title: { sr: "Podrum", en: "Cellar" },
    text: {
      sr: "180 etiketa, isključivo iz Srbije i regiona. Od Fruške gore do Negotina, od malih porodičnih podruma do vina iz amfore.",
      en: "180 labels, from Serbia and the region only. From Fruška Gora to Negotin, from tiny family cellars to amphora wines.",
    },
    images: ["wine/cellar-arches", "wine/pour-glasses"],
  },
  {
    id: "reka",
    n: "05",
    title: { sr: "Reka", en: "River" },
    text: {
      sr: "Na kraju svega, Sava. Sto na terasi, čaša u ruci i sunce koje polako tone iza Novog Beograda. Zato se zovemo Suton.",
      en: "And at the end of it all, the Sava. A terrace table, a glass in hand and the sun sinking slowly behind New Belgrade. That's why we're called Suton: dusk.",
    },
    images: ["river/sunset-water", "room/terrace-dusk"],
  },
];

export type Producer = {
  id: string;
  name: string;
  place: Localized<string>;
  region: Localized<string>;
  what: Localized<string>;
  since: number;
  text: Localized<string>;
  image: PhotoKey;
  detail: PhotoKey;
};

// All farms and families are fictional.
export const producers: Producer[] = [
  {
    id: "jeremic",
    name: "Salaš Jeremić",
    place: { sr: "Kovilj", en: "Kovilj" },
    region: { sr: "Vojvodina", en: "Vojvodina" },
    what: { sr: "Mangulica, kulen, slanina", en: "Mangalica pork, kulen, bacon" },
    since: 2019,
    text: {
      sr: "Dragan Jeremić drži sto dvadeset mangulica na otvorenom, među vrbama uz Dunav. Kulen suši godinu dana na tavanu salaša, na promaji sa reke.",
      en: "Dragan Jeremić keeps 120 Mangalica pigs outdoors among the willows by the Danube. His kulen dries for a whole year in the farmhouse attic, in the draught off the river.",
    },
    image: "prod/farmer",
    detail: "dish/raw-meat-cuts",
  },
  {
    id: "maric",
    name: "Voćnjak Marić",
    place: { sr: "Ispod Rudnika", en: "Below Mount Rudnik" },
    region: { sr: "Šumadija", en: "Šumadija" },
    what: { sr: "Šljive, jabuke, dunje, rakija", en: "Plums, apples, quinces, rakija" },
    since: 2019,
    text: {
      sr: "Tri generacije Marića neguju stare sorte šljive: požegaču, crvenu ranku i čačansku lepoticu. Od njih dobijamo šljive za desert i dunjevaču za kraj večeri.",
      en: "Three generations of the Marić family grow heritage plum varieties: Požegača, Crvena Ranka and Čačanska Lepotica. They give us plums for dessert and quince rakija to end the night.",
    },
    image: "prod/plums-tree",
    detail: "prod/apple-hands",
  },
  {
    id: "zlatni-breg",
    name: "Mlekara Zlatni breg",
    place: { sr: "Topola", en: "Topola" },
    region: { sr: "Šumadija", en: "Šumadija" },
    what: { sr: "Kajmak, zreli sirevi, kiselo mleko", en: "Kajmak, aged cheeses, cultured milk" },
    since: 2020,
    text: {
      sr: "Mala porodična mlekara sa četrdeset krava i dvesta ovaca. Kajmak skupljaju ručno, u drvenim čabrovima, kao pre sto godina.",
      en: "A small family dairy with forty cows and two hundred sheep. They skim kajmak by hand into wooden tubs, the way it was done a century ago.",
    },
    image: "prod/sheep",
    detail: "detail/cheese-board",
  },
  {
    id: "kosovac",
    name: "Pčelinjak Kosovac",
    place: { sr: "Vrdnik", en: "Vrdnik" },
    region: { sr: "Fruška gora", en: "Fruška Gora" },
    what: { sr: "Lipov i bagremov med, vosak", en: "Linden and acacia honey, beeswax" },
    since: 2021,
    text: {
      sr: "Milica Kosovac seli košnice po Fruškoj gori prateći cvetanje: bagrem u maju, lipa u junu. Njen lipov med ide uz naše sireve i čokoladu.",
      en: "Milica Kosovac moves her hives around Fruška Gora following the bloom: acacia in May, linden in June. Her linden honey goes with our cheeses and chocolate.",
    },
    image: "prod/beekeeper-frame",
    detail: "prod/bee-hand",
  },
  {
    id: "sirig",
    name: "Mlin Sirig",
    place: { sr: "Sirig", en: "Sirig" },
    region: { sr: "Vojvodina", en: "Vojvodina" },
    what: { sr: "Kameno mlevena pšenica i kukuruz", en: "Stone-ground wheat and cornmeal" },
    since: 2019,
    text: {
      sr: "Vodenični kamen iz 1936. godine i stare sorte pšenice i belog kukuruza. Od njihovog brašna mesimo lepinje, a od kukuruza pravimo proju iz žara.",
      en: "A millstone from 1936 and heritage varieties of wheat and white corn. Their flour goes into our flatbreads, and their cornmeal into our cornbread from the embers.",
    },
    image: "prod/field-sunset",
    detail: "detail/bread-jute",
  },
];

export type TeamMember = { name: string; role: Localized<string>; text: Localized<string>; image: PhotoKey };

export const team: TeamMember[] = [
  {
    name: "Andrej Stojković",
    role: { sr: "Šef kuhinje i suosnivač", en: "Head chef & co-founder" },
    text: {
      sr: "Odrastao u Čačku, kuvao u Kopenhagenu i San Sebastijanu, a onda se vratio kući jer je, kako kaže, „najbolji žar u Evropi od šljivovog drveta“.",
      en: "Grew up in Čačak, cooked in Copenhagen and San Sebastián, then came home because, as he puts it, “the best embers in Europe come from plum wood.”",
    },
    image: "people/chef-apron",
  },
  {
    name: "Vuk Lazić",
    role: { sr: "Sommelier", en: "Sommelier" },
    text: {
      sr: "Prošao je svaki vinski region Srbije peške i biciklom. Karta od 180 etiketa je njegova lična mapa zemlje.",
      en: "He has crossed every wine region in Serbia on foot and by bike. The 180-label list is his personal map of the country.",
    },
    image: "people/sommelier-bottle",
  },
];

export const chapterAlts: Record<"sr" | "en", Record<string, [string, string]>> = {
  sr: {
    vatra: ["Meso na roštilju iznad otvorene vatre", "Žar od bukve u kuhinji Sutona"],
    zemlja: ["Polje pšenice u Vojvodini", "Korpa sa sezonskim povrćem"],
    ruke: ["Kuvar ručno slaže tanjir", "Sečenje domaćeg hleba"],
    podrum: ["Vinski podrum sa hrastovim buradima", "Točenje crvenog vina u čaše"],
    reka: ["Zalazak sunca nad rekom", "Terasa u sumrak"],
  },
  en: {
    vatra: ["Meat grilling over an open fire", "Beech embers in the Suton kitchen"],
    zemlja: ["A wheat field in Vojvodina", "A basket of seasonal vegetables"],
    ruke: ["A cook plating by hand", "Slicing homemade bread"],
    podrum: ["A wine cellar with oak barrels", "Pouring red wine into glasses"],
    reka: ["Sunset over the river", "The terrace at dusk"],
  },
};
