import type { Localized } from "@/lib/i18n";
import type { PhotoKey } from "./photos";

export type SutonEvent = {
  id: string;
  slug: Localized<string>;
  title: Localized<string>;
  kicker: Localized<string>;
  /** ISO start/end in Belgrade time. */
  start: string;
  end: string;
  when: Localized<string>;
  price: number;
  priceNote: Localized<string>;
  seats: number;
  image: PhotoKey;
  gallery: PhotoKey[];
  summary: Localized<string>;
  body: Localized<string[]>;
  programme: Localized<{ time?: string; title: string; text: string }[]>;
};

export const events: SutonEvent[] = [
  {
    id: "prokupac",
    slug: { sr: "vece-prokupca", en: "prokupac-night" },
    title: { sr: "Veče Prokupca", en: "Prokupac Night" },
    kicker: { sr: "Vinska večera · 5 sledova", en: "Wine dinner · 5 courses" },
    start: "2026-10-15T19:30:00+02:00",
    end: "2026-10-15T23:30:00+02:00",
    when: { sr: "Četvrtak, 15. oktobar 2026. u 19:30", en: "Thursday 15 October 2026, 7:30 pm" },
    price: 6900,
    priceNote: { sr: "po osobi, sa vinima", en: "per person, wines included" },
    seats: 36,
    image: "wine/pour-red",
    gallery: ["wine/cellar-arches", "dish/lamb-shank", "people/sommelier-table", "wine/vine-sunset"],
    summary: {
      sr: "Pet sledova sa žara i pet čaša Prokupca, sorte koja je hiljadu godina rasla po brdima južne Srbije. Za stolom je vinar iz Župe.",
      en: "Five courses from the fire and five glasses of Prokupac, the grape that has grown on the hills of southern Serbia for a thousand years. The winemaker from Župa joins us at the table.",
    },
    body: {
      sr: [
        "Prokupac je dugo bio vino za svaki dan: lagano, kiselkasto, iz balona. Danas ga nova generacija vinara iz Župe i Toplice pravi ozbiljno, sa niskim prinosima i dugim odležavanjem, i dobija vino koje stoji rame uz rame sa najboljim crvenim vinima Evrope.",
        "Za ovo veče šef Andrej je napravio meni koji prati pet različitih lica Prokupca: od svežeg roze vina uz dimljenu pastrmku, do vina iz amfore uz teleći obraz koji se krčkao dvanaest sati pored žara.",
        "Broj mesta je ograničen na 36, za zajedničkim stolom u glavnoj sali. Dress code: kako vam je udobno.",
      ],
      en: [
        "For years Prokupac was an everyday wine: light, sharp, poured from a demijohn. Today a new generation of winemakers in Župa and Toplica treats it seriously, with low yields and long ageing, and the result stands shoulder to shoulder with Europe's best reds.",
        "For this evening Chef Andrej built a menu around five faces of Prokupac: from a fresh rosé with beech-smoked trout to an amphora-aged red with veal cheek braised for twelve hours beside the fire.",
        "Seating is limited to 36 guests at one long table in the main room. Dress code: whatever makes you comfortable.",
      ],
    },
    programme: {
      sr: [
        { time: "19:30", title: "Dobrodošlica na terasi", text: "Prokupac roze i proja iz žara sa kajmakom." },
        { time: "20:00", title: "Pastrmka dimljena na bukvi", text: "Kiselo mleko, kopar, prvi crveni Prokupac." },
        { time: "20:45", title: "Pečene paprike i orasi", text: "Prokupac iz čelika, mlad i živahan." },
        { time: "21:30", title: "Teleći obraz, 12 sati", text: "Pire od celera, Prokupac iz amfore." },
        { time: "22:30", title: "Šljive u vinu", text: "Sladoled od kajmaka, desertni Prokupac." },
      ],
      en: [
        { time: "7:30 pm", title: "Welcome on the terrace", text: "Prokupac rosé and cornbread from the embers with kajmak." },
        { time: "8:00 pm", title: "Beech-smoked trout", text: "Cultured milk, dill, the first red Prokupac." },
        { time: "8:45 pm", title: "Roasted peppers and walnuts", text: "Steel-aged Prokupac, young and lively." },
        { time: "9:30 pm", title: "Veal cheek, 12 hours", text: "Celeriac purée, amphora Prokupac." },
        { time: "10:30 pm", title: "Plums in wine", text: "Kajmak ice cream, dessert Prokupac." },
      ],
    },
  },
  {
    id: "fire-tasting",
    slug: { sr: "degustacija-iz-vatre", en: "fire-tasting-menu" },
    title: { sr: "Iz vatre: degustacioni meni", en: "From the Fire: tasting menu" },
    kicker: { sr: "Šankom kuhinje · 8 sledova", en: "Kitchen counter · 8 courses" },
    start: "2026-11-06T20:00:00+01:00",
    end: "2026-11-28T23:59:00+01:00",
    when: { sr: "Petkom i subotom u novembru, od 20:00", en: "Fridays and Saturdays in November, from 8 pm" },
    price: 8900,
    priceNote: { sr: "po osobi · uparivanje vina 4.900", en: "per person · wine pairing RSD 4,900" },
    seats: 8,
    image: "chef/pan-grill-flames",
    gallery: ["chef/plating", "fire/grill-hands", "dish/sauce-pour-steak", "chef/burning-fire"],
    summary: {
      sr: "Osam mesta za šankom kuhinje, na metar od žara. Osam sledova koje šef Andrej priprema pred vama, bez menija unapred.",
      en: "Eight seats at the kitchen counter, one metre from the fire. Eight courses Chef Andrej cooks in front of you, with no menu in advance.",
    },
    body: {
      sr: [
        "Šank kuhinje je najtoplije mesto u Sutonu, doslovno. Sedite na visokim hrastovim stolicama, gledate kako se bukva pretvara u žar, a šef vam svaki slog iznosi lično i priča odakle stiže.",
        "Meni se menja iz nedelje u nedelju, prema onome što stigne sa salaša u Kovilju, iz voćnjaka ispod Rudnika i sa pijace na Zelenom vencu. Javite nam alergije pri rezervaciji i prilagodićemo svaki slog.",
      ],
      en: [
        "The kitchen counter is the warmest seat at Suton, literally. You sit on tall oak stools, watch beech wood turn to embers, and the chef brings every course over personally and tells you where it came from.",
        "The menu changes week to week, following whatever arrives from the farm in Kovilj, the orchards below Mount Rudnik and the Zeleni Venac market. Tell us about allergies when you book and we will adapt every course.",
      ],
    },
    programme: {
      sr: [
        { title: "Osam sledova", text: "Od sirovog do dimljenog, od žara do pepela." },
        { title: "Opciono uparivanje", text: "Šest srpskih vina i jedna rakija od dunje." },
        { title: "Trajanje", text: "Oko dva i po sata. Početak u 20:00, tačno." },
      ],
      en: [
        { title: "Eight courses", text: "From raw to smoked, from embers to ash." },
        { title: "Optional pairing", text: "Six Serbian wines and one quince rakija." },
        { title: "Duration", text: "About two and a half hours. Starts at 8 pm sharp." },
      ],
    },
  },
  {
    id: "sunday-lunch",
    slug: { sr: "nedeljni-rucak-na-reci", en: "sunday-river-lunch" },
    title: { sr: "Nedeljni ručak na reci", en: "Sunday River Lunch" },
    kicker: { sr: "Porodični ručak · svake nedelje", en: "Family-style lunch · every Sunday" },
    start: "2026-10-04T12:00:00+02:00",
    end: "2026-10-04T16:00:00+02:00",
    when: { sr: "Svake nedelje, 12:00 – 16:00", en: "Every Sunday, 12 – 4 pm" },
    price: 3900,
    priceNote: { sr: "po osobi · deca do 12 godina 1.900", en: "per person · children under 12 RSD 1,900" },
    seats: 60,
    image: "people/long-table-flowers",
    gallery: ["room/terrace-dusk", "dish/flatbread-grill", "detail/bread-slicing", "people/group-toast"],
    summary: {
      sr: "Onako kako se nedeljom ručalo kod bake: činije na sredini stola, jagnjetina ispod sača i tamburaši do kasnog popodneva.",
      en: "Sunday lunch the way grandma made it: shared bowls in the middle of the table, lamb under the sač bell and tamburica music into the late afternoon.",
    },
    body: {
      sr: [
        "Nedeljom otvaramo velika vrata ka reci i postavljamo duge stolove. Sve stiže na sredinu: proja, pečene paprike, salata od paradajza sa lukom, jagnjetina ispod sača i krompir iz žara, a na kraju krempita.",
        "Tamburaški trio svira od 13 do 15 časova. Deca imaju svoj kutak sa bojankama i limunadom od zove, a psi su dobrodošli na terasi.",
      ],
      en: [
        "On Sundays we open the big doors to the river and set long tables. Everything arrives in the middle: cornbread, roasted peppers, tomato and onion salad, lamb under the sač and potatoes from the embers, then krempita to finish.",
        "A tamburica trio plays from 1 to 3 pm. Kids get their own corner with colouring books and elderflower lemonade, and dogs are welcome on the terrace.",
      ],
    },
    programme: {
      sr: [
        { time: "12:00", title: "Otvaramo vrata", text: "Hladna predjela i domaći hleb na stolu." },
        { time: "13:00", title: "Tamburaši", text: "Stari gradski i vojvođanski repertoar." },
        { time: "13:30", title: "Jagnjetina ispod sača", text: "Iznosi se u gvozdenim tavama na sredinu stola." },
      ],
      en: [
        { time: "12:00", title: "Doors open", text: "Cold starters and homemade bread on the table." },
        { time: "1:00 pm", title: "Tamburica", text: "Old Belgrade and Vojvodina songs." },
        { time: "1:30 pm", title: "Lamb under the sač", text: "Served in iron pans in the middle of the table." },
      ],
    },
  },
];

export const getEvent = (locale: "sr" | "en", slug: string) => events.find((e) => e.slug[locale] === slug);
