import type { Localized } from "@/lib/i18n";

export type Review = {
  id: string;
  name: string;
  from: Localized<string>;
  rating: number;
  date: string;
  /** Language the guest originally wrote in. */
  lang: "sr" | "en";
  text: Localized<string>;
  tag: Localized<string>;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Jelena M.",
    from: { sr: "Dorćol", en: "Dorćol, Belgrade" },
    rating: 5,
    date: "2026-09-14",
    lang: "sr",
    tag: { sr: "Terasa na zalasku", en: "Sunset terrace" },
    text: {
      sr: "Rezervisali smo sto na terasi za 19:10, tačno za zalazak. Konobar je znao da slavimo godišnjicu i doneo nam dve čaše roze Prokupca kada je sunce dotaklo Savu. Jagnjetina ispod sača, bez preterivanja, najbolja u gradu.",
      en: "We booked a terrace table for 7:10 pm, right for sunset. The waiter knew it was our anniversary and brought two glasses of Prokupac rosé just as the sun touched the Sava. The lamb under the sač is, without exaggeration, the best in town.",
    },
  },
  {
    id: "r2",
    name: "Thomas K.",
    from: { sr: "Minhen, Nemačka", en: "Munich, Germany" },
    rating: 5,
    date: "2026-09-02",
    lang: "en",
    tag: { sr: "Šank kuhinje", en: "Kitchen counter" },
    text: {
      sr: "Tražili smo „najbolji restoran u Beogradu“ i ovo je bilo to. Sedeli smo za šankom kuhinje i gledali šefa kako peče paprike direktno na žaru. Sommelier nam je predstavio tri srpska vina za koja nikad nismo čuli. Tamjanika sa pokožice je otkrovenje.",
      en: "We searched for “best restaurant in Belgrade” and this was it. We sat at the kitchen counter and watched the chef roast peppers straight on the embers. The sommelier introduced us to three Serbian wines we'd never heard of. The skin-contact Tamjanika was a revelation.",
    },
  },
  {
    id: "r3",
    name: "Marko P.",
    from: { sr: "Vračar", en: "Vračar, Belgrade" },
    rating: 5,
    date: "2026-08-27",
    lang: "sr",
    tag: { sr: "Poslovna večera", en: "Business dinner" },
    text: {
      sr: "Doveo sam partnere iz Beča na poslovnu večeru. Privatna sala za dvanaest osoba, meni prilagođen jednom vegetarijancu i jednoj osobi sa celijakijom, bez ijednog pitanja viška. Račun uredno na firmu. Vraćamo se u decembru.",
      en: "I brought partners from Vienna for a business dinner. A private room for twelve, a menu adapted for one vegetarian and one coeliac guest without a single unnecessary question. Invoice to the company, no fuss. We're coming back in December.",
    },
  },
  {
    id: "r4",
    name: "Sofia R.",
    from: { sr: "Madrid, Španija", en: "Madrid, Spain" },
    rating: 5,
    date: "2026-08-19",
    lang: "en",
    tag: { sr: "Vinska karta", en: "Wine list" },
    text: {
      sr: "Nisam imala pojma da Srbija ima ovakva vina. Bermet sa Fruške gore uz čokoladu i so bio je savršen kraj. Osoblje govori odličan engleski, a meni je objašnjen bez snobizma.",
      en: "I had no idea Serbia made wines like this. The Bermet from Fruška Gora with the chocolate, honey and salt was the perfect ending. The staff speak excellent English and explained the menu with zero snobbery.",
    },
  },
  {
    id: "r5",
    name: "Ana i Nikola D.",
    from: { sr: "Zemun", en: "Zemun, Belgrade" },
    rating: 5,
    date: "2026-08-09",
    lang: "sr",
    tag: { sr: "Nedeljni ručak", en: "Sunday lunch" },
    text: {
      sr: "Nedeljni ručak sa decom i psom. Mali je dobio bojanke, pas činiju vode pre nego što smo seli, a mi krempitu koja nas je vratila u detinjstvo. Tamburaši taman glasni da se i dalje čujete za stolom.",
      en: "Sunday lunch with the kids and the dog. Our little one got colouring books, the dog got a bowl of water before we even sat down, and we got a krempita that took us straight back to childhood. The tamburica band was just loud enough that you could still talk at the table.",
    },
  },
  {
    id: "r6",
    name: "Daniel W.",
    from: { sr: "London, UK", en: "London, UK" },
    rating: 4,
    date: "2026-07-30",
    lang: "en",
    tag: { sr: "Roštilj", en: "Grill" },
    text: {
      sr: "Ćevapi od mangulice i rib-eye bili su izvanredni. Jedna zvezdica manje samo zato što je subotom uveče bučno kad se sala napuni, pa za mirnije veče tražite terasu. I dalje obavezna poseta.",
      en: "The mangalica ćevapi and the rib-eye were outstanding. One star off only because it gets loud when the room fills up on a Saturday night, so ask for the terrace if you want a quieter evening. Still a must-visit.",
    },
  },
  {
    id: "r7",
    name: "Ivana S.",
    from: { sr: "Novi Beograd", en: "New Belgrade" },
    rating: 5,
    date: "2026-07-21",
    lang: "sr",
    tag: { sr: "Veganski meni", en: "Vegan options" },
    text: {
      sr: "Kao veganka retko dobijem više od salate u „mesnim“ restoranima. Ovde su bukovače sa žara i punjene paprike sa heljdom bile glavna tema večeri i za moje društvo koje jede meso.",
      en: "As a vegan I rarely get more than a salad at “meat” restaurants. Here the grilled oyster mushrooms and buckwheat-stuffed peppers were the talk of the night, even for my meat-eating friends.",
    },
  },
  {
    id: "r8",
    name: "Luka T.",
    from: { sr: "Savski venac", en: "Savski Venac, Belgrade" },
    rating: 5,
    date: "2026-07-11",
    lang: "sr",
    tag: { sr: "Rođendan", en: "Birthday" },
    text: {
      sr: "Proslava 40. rođendana za 28 ljudi na terasi. Organizacija od prvog maila do poslednje rakije: besprekorna. Pomogli su nam i oko torte i oko muzike. Svi i dalje pričaju o tom zalasku.",
      en: "A 40th birthday for 28 people on the terrace. Organisation from the first email to the last rakija: flawless. They helped with the cake and the music too. Everyone is still talking about that sunset.",
    },
  },
];

/** Rating distribution shown in the Google-style summary. */
export const ratingBreakdown = [
  { stars: 5, share: 0.86 },
  { stars: 4, share: 0.1 },
  { stars: 3, share: 0.03 },
  { stars: 2, share: 0.007 },
  { stars: 1, share: 0.003 },
];
