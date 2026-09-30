/**
 * Business facts for the fictional restaurant, used across pages, structured data and OG images.
 * Suton is a Scale by Noon concept site: every name, number and review here is invented.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://suton-restaurant-demo.vercel.app").replace(/\/$/, "");

export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const site = {
  name: "Suton",
  fullName: "Suton — kuhinja & vino",
  url: siteUrl,
  email: "sto@suton.rs",
  phone: "+381110000000",
  phoneDisplay: "+381 11 000 0000",
  street: "Karađorđeva bb",
  streetNote: { sr: "Savsko pristanište", en: "Sava river quay" },
  neighbourhood: "Savamala",
  postalCode: "11000",
  city: "Beograd",
  cityEn: "Belgrade",
  country: "RS",
  geo: { lat: 44.8148, lng: 20.4516 },
  timezone: "Europe/Belgrade",
  priceRange: "RSD 3.000–6.500",
  cuisine: ["Balkan", "Serbian", "Modern European", "Grill"],
  rating: { value: 4.8, count: 1184 },
  founded: 2019,
  instagram: "https://www.instagram.com/",
  agencyUrl: "https://www.scalebynoon.com",
} as const;

export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

/**
 * Opening hours (Belgrade time). Days: 0 = Sunday … 6 = Saturday.
 * `close` past midnight is written as 24:00 / 25:00 so ranges stay simple.
 */
export type DayHours = { open: number; close: number; kitchen: number };

const weekday: DayHours = { open: 12 * 60, close: 24 * 60, kitchen: 23 * 60 };
const weekend: DayHours = { open: 12 * 60, close: 25 * 60, kitchen: 24 * 60 };
const sunday: DayHours = { open: 12 * 60, close: 23 * 60, kitchen: 22 * 60 };

export const hours: Record<number, DayHours> = {
  0: sunday,
  1: weekday,
  2: weekday,
  3: weekday,
  4: weekday,
  5: weekend,
  6: weekend,
};

/** Rows for the hours table, Monday first. */
export const hoursRows = [
  { days: { sr: "Pon – Čet", en: "Mon – Thu" }, schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday"], ...weekday },
  { days: { sr: "Pet – Sub", en: "Fri – Sat" }, schemaDays: ["Friday", "Saturday"], ...weekend },
  { days: { sr: "Nedelja", en: "Sunday" }, schemaDays: ["Sunday"], ...sunday },
] as const;

export const terraceSeason = { sr: "15. april – 31. oktobar", en: "15 April – 31 October" };

export const fmtTime = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
