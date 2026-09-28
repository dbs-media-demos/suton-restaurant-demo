import type { Localized } from "@/lib/i18n";
import type { PhotoKey } from "./photos";

export type GalleryCat = "food" | "fire" | "room" | "wine" | "river" | "people";

export const galleryCats: Record<GalleryCat, Localized<string>> = {
  food: { sr: "Hrana", en: "Food" },
  fire: { sr: "Vatra i kuhinja", en: "Fire & kitchen" },
  room: { sr: "Prostor", en: "The room" },
  wine: { sr: "Vino", en: "Wine" },
  river: { sr: "Reka", en: "River" },
  people: { sr: "Gosti", en: "Guests" },
};

type Item = { k: PhotoKey; cat: GalleryCat; alt: Localized<string> };

const i = (k: PhotoKey, cat: GalleryCat, sr: string, en: string): Item => ({ k, cat, alt: { sr, en } });

export const gallery: Item[] = [
  i("dish/sauce-pour-steak", "food", "Preliv sosa preko odreska", "Sauce poured over a steak"),
  i("fire/grill-flames-cook", "fire", "Kuvar okreće meso nad plamenom", "A cook turning meat over the flames"),
  i("room/terrace-dusk", "room", "Terasa u sumrak sa lampicama", "The terrace at dusk with string lights"),
  i("wine/pour-glass", "wine", "Točenje crvenog vina", "Pouring red wine"),
  i("river/sava-city", "river", "Sava i Beograd na vodi", "The Sava and Belgrade Waterfront"),
  i("dish/lamb-shank", "food", "Jagnjeća kolenica sa povrćem", "Lamb shank with vegetables"),
  i("people/group-toast", "people", "Društvo nazdravlja vinom", "Friends raising a toast"),
  i("chef/plating", "fire", "Slaganje tanjira", "Plating a dish"),
  i("room/candles-red", "room", "Crvene sveće na stolu", "Red candles on the table"),
  i("dish/plums-bowl", "food", "Šljive u činiji", "Plums in a bowl"),
  i("wine/cellar-arches", "wine", "Podrum sa svodovima i buradima", "A vaulted cellar with barrels"),
  i("river/bridge-night", "river", "Most na Adi noću", "The Ada Bridge at night"),
  i("fire/embers-bright", "fire", "Užaren žar", "Glowing embers"),
  i("dish/flatbread-grill", "food", "Lepinja sa mesom sa roštilja", "Flatbread with grilled meat"),
  i("people/long-table-flowers", "people", "Dugačak sto sa cvećem", "A long table with flowers"),
  i("room/bar-plants", "room", "Šank u polumraku", "The bar in low light"),
  i("chef/seasoning-steak", "fire", "Kuvar soli odrezak", "A cook seasoning a steak"),
  i("dish/desserts-two", "food", "Dva deserta", "Two desserts"),
  i("wine/shadow-glass", "wine", "Senka čaše vina", "The shadow of a wine glass"),
  i("river/bridge-dusk", "river", "Most u sumrak", "A bridge at dusk"),
  i("dish/fish", "food", "Riba na tanjiru", "A fish dish"),
  i("chef/pan-grill-flames", "fire", "Plamen iz tiganja", "Flames rising from a pan"),
  i("room/candle-flowers", "room", "Sveća i cveće", "A candle and flowers"),
  i("people/clink-red", "people", "Kucanje čašama crvenog vina", "Clinking glasses of red wine"),
  i("detail/peppers-roasted", "food", "Pečene paprike", "Roasted peppers"),
  i("wine/vine-sunset", "wine", "Vinova loza na zalasku", "Vines at sunset"),
  i("river/sunset-watch", "river", "Posmatranje zalaska nad rekom", "Watching the sunset over the river"),
  i("chef/spooning-sauce", "fire", "Sos se dodaje kašikom", "Spooning sauce onto a plate"),
  i("dish/chocolates-tart", "food", "Čokoladni tart", "A chocolate tart"),
  i("room/wine-glasses-table", "room", "Čaše na postavljenom stolu", "Glasses on a set table"),
  i("people/sommelier-table", "people", "Sommelier za stolom", "The sommelier at a table"),
  i("detail/bread-slicing", "food", "Sečenje hleba", "Slicing bread"),
  i("wine/barrel-room", "wine", "Sala sa buradima", "A barrel room"),
  i("fire/grill-over-fire", "fire", "Roštilj iznad vatre", "A grill over the fire"),
  i("river/kalemegdan-sunset", "river", "Kalemegdan na zalasku", "Kalemegdan at sunset"),
  i("room/terrace-night", "room", "Terasa noću", "The terrace at night"),
  i("dish/grilled-vegetables", "food", "Povrće sa roštilja", "Grilled vegetables"),
  i("people/couple-wine", "people", "Par uz vino", "A couple with wine"),
  i("detail/cheese-board", "food", "Daska sa sirevima", "A cheese board"),
  i("chef/plates-service", "fire", "Tanjiri spremni za serviranje", "Plates ready for service"),
];
