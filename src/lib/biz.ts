import { fmtTime, hours, site } from "./site";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

/** The fictional restaurant as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "sr",
  name: site.fullName,
  shortName: site.name,
  tagline: null,
  area: site.neighbourhood,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  address: { street: site.street, city: site.city, region: "", postal: site.postalCode, full: `${site.street}, ${site.postalCode} ${site.city}` },
  timezone: site.timezone,
  // Past-midnight closing (24:00, 25:00) reads as "until late" here
  hours: [0, 1, 2, 3, 4, 5, 6].map((day): DayHours => ({ day, open: fmtTime(hours[day].open), close: hours[day].close >= 1440 ? "23:59" : fmtTime(hours[day].close) })),
  hoursSummary: "",
  rating: { ...site.rating },
  preview: false,
};
