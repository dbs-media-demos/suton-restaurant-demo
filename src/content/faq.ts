import type { Localized } from "@/lib/i18n";

export type Faq = { q: Localized<string>; a: Localized<string>; group: "visit" | "food" | "book" };

export const faqGroups: Record<Faq["group"], Localized<string>> = {
  book: { sr: "Rezervacije", en: "Booking" },
  visit: { sr: "Dolazak i boravak", en: "Your visit" },
  food: { sr: "Hrana i piće", en: "Food & drink" },
};

export const faqs: Faq[] = [
  {
    group: "book",
    q: { sr: "Da li je potrebna rezervacija?", en: "Do I need a reservation?" },
    a: {
      sr: "Preporučujemo je, posebno petkom, subotom i za terasu u vreme zalaska. Svako veče čuvamo i nekoliko mesta za šankom za goste bez rezervacije.",
      en: "We recommend it, especially on Fridays, Saturdays and for the terrace around sunset. We always keep a few counter seats for walk-ins.",
    },
  },
  {
    group: "book",
    q: { sr: "Kako da otkažem ili promenim rezervaciju?", en: "How do I cancel or change a booking?" },
    a: {
      sr: "Pozovite nas ili odgovorite na email potvrde najkasnije 4 sata ranije. Za grupe od 8 i više osoba i za degustacioni meni molimo otkazivanje 48 sati unapred.",
      en: "Call us or reply to your confirmation email at least 4 hours ahead. For groups of 8 or more and for the tasting menu, please cancel 48 hours in advance.",
    },
  },
  {
    group: "book",
    q: { sr: "Da li organizujete privatne proslave i poslovne večere?", en: "Do you host private events and business dinners?" },
    a: {
      sr: "Da. Privatna sala prima do 16 osoba, terasa do 60, a ceo restoran do 120 gostiju. Pošaljite upit preko stranice Događaji i proslave i javićemo vam se u roku od 24 sata.",
      en: "Yes. The private room seats up to 16, the terrace up to 60 and the whole restaurant up to 120 guests. Send an inquiry from the Events & private dining page and we'll reply within 24 hours.",
    },
  },
  {
    group: "visit",
    q: { sr: "Do kada radi kuhinja?", en: "When does the kitchen close?" },
    a: {
      sr: "Kuhinja radi do 23:00 radnim danima, do ponoći petkom i subotom i do 22:00 nedeljom. Šank radi sat vremena duže.",
      en: "The kitchen serves until 11 pm Monday to Thursday, midnight on Fridays and Saturdays, and 10 pm on Sundays. The bar stays open an hour longer.",
    },
  },
  {
    group: "visit",
    q: { sr: "Kada je otvorena terasa?", en: "When is the terrace open?" },
    a: {
      sr: "Terasa na reci radi od 15. aprila do 31. oktobra. U prohladnim večerima imamo grejalice i ćebad od vune.",
      en: "The river terrace is open from 15 April to 31 October. On chilly evenings we have heaters and wool blankets.",
    },
  },
  {
    group: "visit",
    q: { sr: "Gde mogu da parkiram?", en: "Where can I park?" },
    a: {
      sr: "Najbliža je javna garaža „Obilićev venac“ (10 minuta hoda) i parking na Savskom pristaništu (zona 3). Posle 21:00 preporučujemo taksi ili CarGo; dovezaće vas do samog ulaza.",
      en: "The nearest options are the Obilićev Venac public garage (a 10-minute walk) and the Sava quay car park (zone 3). After 9 pm we recommend a taxi or CarGo, which can drop you at the door.",
    },
  },
  {
    group: "visit",
    q: { sr: "Da li su psi dobrodošli?", en: "Are dogs welcome?" },
    a: {
      sr: "Na terasi apsolutno: imamo činije za vodu i poslastice za pse. U unutrašnjoj sali, nažalost, samo psi vodiči.",
      en: "On the terrace, absolutely: we have water bowls and dog treats. Inside the dining room, only assistance dogs, sorry.",
    },
  },
  {
    group: "visit",
    q: { sr: "Da li mogu da platim karticom?", en: "Can I pay by card?" },
    a: {
      sr: "Da, primamo Visa, Mastercard, Maestro, Dinu i American Express, kao i Apple Pay i Google Pay. Račun na firmu izdajemo na licu mesta.",
      en: "Yes: Visa, Mastercard, Maestro, Dina and American Express, plus Apple Pay and Google Pay. We can issue company invoices on the spot.",
    },
  },
  {
    group: "visit",
    q: { sr: "Postoji li dress code?", en: "Is there a dress code?" },
    a: {
      sr: "Ne postoji. Dođite kako vam je udobno, od patika do večernje haljine.",
      en: "No. Come as you like, from sneakers to an evening dress.",
    },
  },
  {
    group: "food",
    q: { sr: "Imate li vegetarijanska, veganska i bezglutenska jela?", en: "Do you have vegetarian, vegan and gluten-free dishes?" },
    a: {
      sr: "Da, svako jelo na meniju je označeno. Na stranici Meni možete filtrirati jela po ishrani. Za celijakiju imamo odvojenu površinu za pripremu.",
      en: "Yes, every dish on the menu is labelled, and you can filter by diet on the Menu page. For coeliac guests we have a separate prep surface.",
    },
  },
  {
    group: "food",
    q: { sr: "Šta ako imam alergiju?", en: "What if I have an allergy?" },
    a: {
      sr: "Navedite je u rezervaciji i recite konobaru. Kuvar će vam lično potvrditi šta je bezbedno. Spisak 14 alergena dostupan je za svako jelo.",
      en: "Add it to your booking and tell your waiter. The cook will personally confirm what is safe. A list of the 14 allergens is available for every dish.",
    },
  },
  {
    group: "food",
    q: { sr: "Da li mogu da donesem svoje vino?", en: "Can I bring my own wine?" },
    a: {
      sr: "Možete, uz naknadu za otvaranje od 1.500 RSD po boci. Naknadu otpisujemo ako uz to naručite i jednu bocu sa naše karte.",
      en: "Yes, with a corkage fee of RSD 1,500 per bottle. We waive it if you also order a bottle from our list.",
    },
  },
];
