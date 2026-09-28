import { hours, site } from "./site";

/** Current weekday + minutes-after-midnight in Belgrade, regardless of the visitor's timezone. */
export function belgradeNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus =
  | { state: "open"; closesAt: number; kitchenAt: number; kitchenOpen: boolean }
  | { state: "closed"; opensAt: number; opensToday: boolean };

export function openStatus(date = new Date()): OpenStatus {
  const { day, minutes } = belgradeNow(date);
  // Still inside yesterday's late opening (e.g. Friday until 01:00)?
  const yesterday = hours[(day + 6) % 7];
  if (yesterday.close > 1440 && minutes < yesterday.close - 1440) {
    return {
      state: "open",
      closesAt: yesterday.close,
      kitchenAt: yesterday.kitchen,
      kitchenOpen: minutes < yesterday.kitchen - 1440,
    };
  }
  const today = hours[day];
  if (minutes >= today.open && minutes < today.close) {
    return { state: "open", closesAt: today.close, kitchenAt: today.kitchen, kitchenOpen: minutes < today.kitchen };
  }
  if (minutes < today.open) return { state: "closed", opensAt: today.open, opensToday: true };
  return { state: "closed", opensAt: hours[(day + 1) % 7].open, opensToday: false };
}

/**
 * Sunset time for Belgrade on a given date (NOAA solar calculator, ±1 min).
 * Returns a Date in UTC; format it with the Belgrade timezone.
 */
export function sunsetFor(date = new Date(), lat = site.geo.lat, lng = site.geo.lng): Date {
  const rad = Math.PI / 180;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + 0.5);
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl)) / rad;
  const sunsetUtcMinutes = 720 - 4 * (lng - ha) - eqTime;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) + sunsetUtcMinutes * 60000);
}

export const formatBelgradeTime = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date);
