import type { Localized } from "@/lib/i18n";

export type RegionId = "fruska-gora" | "sumadija" | "zupa" | "negotin";
export type WineColor = "white" | "orange" | "rose" | "red" | "sweet";

export type Region = {
  id: RegionId;
  name: Localized<string>;
  blurb: Localized<string>;
  grapes: string[];
  /** Position on the stylised Serbia map (viewBox 0 0 300 400). */
  pin: { x: number; y: number };
};

export const regions: Region[] = [
  {
    id: "fruska-gora",
    name: { sr: "Fruška gora", en: "Fruška Gora" },
    blurb: {
      sr: "Lesna brda iznad Dunava, manastiri i najstarija vinska tradicija u Srbiji. Sveža bela vina i legendarni Bermet.",
      en: "Loess hills above the Danube, monasteries and Serbia's oldest wine tradition. Fresh whites and the legendary Bermet.",
    },
    grapes: ["Grašac", "Neoplanta", "Probus", "Bermet"],
    pin: { x: 128, y: 70 },
  },
  {
    id: "sumadija",
    name: { sr: "Šumadija", en: "Šumadija" },
    blurb: {
      sr: "Srce Srbije: blage padine oko Oplenca i Rudnika, bogata crvena vina i aromatična tamjanika.",
      en: "The heart of Serbia: gentle slopes around Oplenac and Rudnik, rich reds and aromatic Tamjanika.",
    },
    grapes: ["Morava", "Tamjanika", "Cabernet Franc", "Prokupac"],
    pin: { x: 148, y: 176 },
  },
  {
    id: "zupa",
    name: { sr: "Župa", en: "Župa" },
    blurb: {
      sr: "Zatvorena kotlina oko Aleksandrovca, najtoplija u zemlji. Dom Prokupca i crne Tamjanike.",
      en: "A sheltered valley around Aleksandrovac, the warmest in the country. Home of Prokupac and black Tamjanika.",
    },
    grapes: ["Prokupac", "Tamjanika", "Začinak"],
    pin: { x: 170, y: 250 },
  },
  {
    id: "negotin",
    name: { sr: "Negotinska krajina", en: "Negotin" },
    blurb: {
      sr: "Istok, uz Dunav i Timok: kamene pivnice Rajca i Rogljeva i vina koja podnose i vrelinu i mraz.",
      en: "The far east, by the Danube and Timok: the stone wine cellars of Rajac and Rogljevo and wines that survive both heat and frost.",
    },
    grapes: ["Bagrina", "Crna Tamjanika", "Gamay", "Smederevka"],
    pin: { x: 250, y: 150 },
  },
];

export type Wine = {
  id: string;
  name: string;
  producer: string;
  region: RegionId;
  color: WineColor;
  grape: string;
  vintage: number;
  notes: Localized<string>;
  glass?: number;
  bottle: number;
};

export const colorLabels: Record<WineColor, Localized<string>> = {
  white: { sr: "Bela", en: "White" },
  orange: { sr: "Narandžasta", en: "Orange" },
  rose: { sr: "Roze", en: "Rosé" },
  red: { sr: "Crvena", en: "Red" },
  sweet: { sr: "Desertna", en: "Sweet" },
};

// Producers are fictional.
export const wines: Wine[] = [
  { id: "w1", name: "Lesni breg", producer: "Vinarija Dunavski venac", region: "fruska-gora", color: "white", grape: "Grašac", vintage: 2024, notes: { sr: "Zelena jabuka, lipa, slankasta završnica", en: "Green apple, linden, a saline finish" }, glass: 690, bottle: 3400 },
  { id: "w2", name: "Neoplanta Sur lie", producer: "Podrum Irig", region: "fruska-gora", color: "white", grape: "Neoplanta", vintage: 2024, notes: { sr: "Bazga, muskat, kremasta tekstura", en: "Elderflower, muscat, creamy texture" }, glass: 750, bottle: 3700 },
  { id: "w3", name: "Manastirski Probus", producer: "Vinarija Stari Ledinci", region: "fruska-gora", color: "red", grape: "Probus", vintage: 2021, notes: { sr: "Višnja, duvan, mekani tanini", en: "Sour cherry, tobacco, soft tannins" }, bottle: 5200 },
  { id: "w4", name: "Bermet Crni", producer: "Kuća Karlovci", region: "fruska-gora", color: "sweet", grape: "Bermet", vintage: 2019, notes: { sr: "Smokva, karanfilić, pelin, 20 začina", en: "Fig, clove, wormwood, twenty spices" }, glass: 890, bottle: 6800 },
  { id: "w5", name: "Oplenac Morava", producer: "Vinarija Topolski vis", region: "sumadija", color: "white", grape: "Morava", vintage: 2025, notes: { sr: "Breskva, grejpfrut, sveže i hrskavo", en: "Peach, grapefruit, crisp and fresh" }, glass: 650, bottle: 3200 },
  { id: "w6", name: "Tamjanika Rudnik", producer: "Imanje Majdan", region: "sumadija", color: "orange", grape: "Tamjanika", vintage: 2023, notes: { sr: "Tri nedelje na pokožici: kajsija, čaj, med", en: "Three weeks on skins: apricot, tea, honey" }, glass: 850, bottle: 4600 },
  { id: "w7", name: "Kraljevski Franc", producer: "Vinarija Topolski vis", region: "sumadija", color: "red", grape: "Cabernet Franc", vintage: 2020, notes: { sr: "Kupina, paprika, grafit, dug ukus", en: "Blackberry, bell pepper, graphite, long finish" }, bottle: 6900 },
  { id: "w8", name: "Šumadijski roze", producer: "Imanje Majdan", region: "sumadija", color: "rose", grape: "Prokupac / Frankovka", vintage: 2025, notes: { sr: "Jagoda, pomorandžina kora, suvo", en: "Wild strawberry, orange peel, dry" }, glass: 690, bottle: 3500 },
  { id: "w9", name: "Prokupac Amfora", producer: "Vinarija Kruševački put", region: "zupa", color: "red", grape: "Prokupac", vintage: 2022, notes: { sr: "Brusnica, zemlja, ruža, 11 meseci u amfori", en: "Cranberry, earth, rose, eleven months in amphora" }, glass: 950, bottle: 5600 },
  { id: "w10", name: "Crni kamen", producer: "Podrum Aleksandrovac", region: "zupa", color: "red", grape: "Prokupac", vintage: 2021, notes: { sr: "Šljiva, biber, hrast, snažno i sočno", en: "Plum, pepper, oak, bold and juicy" }, bottle: 4900 },
  { id: "w11", name: "Župska tamjanika", producer: "Podrum Aleksandrovac", region: "zupa", color: "white", grape: "Tamjanika", vintage: 2025, notes: { sr: "Muskat, ruža, ličija, polusuvo", en: "Muscat, rose, lychee, off-dry" }, glass: 700, bottle: 3600 },
  { id: "w12", name: "Prokupac roze", producer: "Vinarija Kruševački put", region: "zupa", color: "rose", grape: "Prokupac", vintage: 2025, notes: { sr: "Malina, lubenica, lagano", en: "Raspberry, watermelon, light" }, glass: 650, bottle: 3200 },
  { id: "w13", name: "Rajačke pivnice", producer: "Zadruga Rajac", region: "negotin", color: "red", grape: "Crna Tamjanika", vintage: 2022, notes: { sr: "Ljubičica, crni biber, sveža kiselina", en: "Violet, black pepper, bright acidity" }, glass: 890, bottle: 5100 },
  { id: "w14", name: "Bagrina", producer: "Vinarija Timočki breg", region: "negotin", color: "white", grape: "Bagrina", vintage: 2024, notes: { sr: "Dunja, bademi, mineralno", en: "Quince, almond, mineral" }, glass: 750, bottle: 3900 },
  { id: "w15", name: "Krajinski Gamay", producer: "Vinarija Timočki breg", region: "negotin", color: "red", grape: "Gamay", vintage: 2023, notes: { sr: "Trešnja, bibe, hladi se na 14°C", en: "Cherry, pepper, served chilled at 14°C" }, glass: 690, bottle: 3500 },
  { id: "w16", name: "Rogljevo Late Harvest", producer: "Zadruga Rajac", region: "negotin", color: "sweet", grape: "Smederevka", vintage: 2021, notes: { sr: "Med, suva kajsija, kandirana pomorandža", en: "Honey, dried apricot, candied orange" }, glass: 790, bottle: 5900 },
];
