"use client";

import { useMemo, useRef, useState } from "react";
import { useClientValue } from "@/lib/hooks";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { FloorPlan, type Area } from "./FloorPlan";
import { Mark } from "@/components/brand/Logo";

const T = {
  sr: {
    steps: ["Kada", "Gde", "Vaši podaci"],
    when: "Izaberite datum i vreme",
    date: "Datum",
    time: "Vreme",
    guests: "Broj gostiju",
    guestsBig: "Za više od 12 osoba pošaljite upit za proslavu.",
    full: "popunjeno",
    today: "Danas",
    tomorrow: "Sutra",
    where: "Gde želite da sedite?",
    areas: {
      indoor: { t: "Sala", d: "Topla sala sa pogledom na kuhinju i reku kroz velike prozore. Za sve prilike." },
      terrace: { t: "Terasa na reci", d: "Uz samu Savu, sa grejalicama i ćebadima. Najlepše u vreme zalaska sunca." },
      counter: { t: "Šank kuhinje", d: "Osam visokih stolica na metar od žara. Najviše 4 osobe po rezervaciji." },
    },
    terraceClosed: "Terasa radi od 15. aprila do 31. oktobra.",
    counterMax: "Šank prima najviše 4 osobe po rezervaciji.",
    who: "Na koje ime?",
    name: "Ime i prezime",
    phone: "Telefon",
    email: "Email",
    occasion: "Povod (opciono)",
    occasions: ["Bez posebnog povoda", "Rođendan", "Godišnjica", "Poslovna večera", "Prvi sastanak"],
    notes: "Alergije, posebne želje (opciono)",
    consent: "Slažem se da me Suton kontaktira u vezi sa ovom rezervacijom.",
    next: "Dalje",
    back: "Nazad",
    confirm: "Potvrdi rezervaciju",
    sending: "Čuvamo vaš sto…",
    required: "Obavezno polje",
    invalidEmail: "Unesite ispravan email",
    invalidPhone: "Unesite ispravan broj telefona",
    pick: "Izaberite datum, vreme i mesto",
    summary: "Vaša rezervacija",
    people: (n: number) => `${n} ${n === 1 ? "osoba" : n < 5 ? "osobe" : "osoba"}`,
    doneTitle: "Sto je vaš.",
    doneText: "Poslali smo potvrdu na vaš email. Ako kasnite više od 15 minuta, javite nam se.",
    code: "Broj rezervacije",
    calendar: "Dodaj u kalendar",
    again: "Nova rezervacija",
    demo: "Demo sajt: rezervacija nije zaista poslata.",
    river: "SAVA",
    kitchen: "Kuhinja · žar",
  },
  en: {
    steps: ["When", "Where", "Your details"],
    when: "Choose a date and time",
    date: "Date",
    time: "Time",
    guests: "Guests",
    guestsBig: "For more than 12 guests, send us a private dining inquiry.",
    full: "full",
    today: "Today",
    tomorrow: "Tomorrow",
    where: "Where would you like to sit?",
    areas: {
      indoor: { t: "Dining room", d: "A warm room looking onto the kitchen and, through tall windows, the river. For any occasion." },
      terrace: { t: "River terrace", d: "Right on the Sava, with heaters and blankets. Best at sunset." },
      counter: { t: "Kitchen counter", d: "Eight tall seats a metre from the embers. Up to 4 guests per booking." },
    },
    terraceClosed: "The terrace is open from 15 April to 31 October.",
    counterMax: "The counter takes up to 4 guests per booking.",
    who: "Whose name is the table under?",
    name: "Full name",
    phone: "Phone",
    email: "Email",
    occasion: "Occasion (optional)",
    occasions: ["No special occasion", "Birthday", "Anniversary", "Business dinner", "First date"],
    notes: "Allergies, special requests (optional)",
    consent: "I agree that Suton may contact me about this booking.",
    next: "Next",
    back: "Back",
    confirm: "Confirm booking",
    sending: "Holding your table…",
    required: "Required",
    invalidEmail: "Enter a valid email",
    invalidPhone: "Enter a valid phone number",
    pick: "Choose a date, time and seat",
    summary: "Your booking",
    people: (n: number) => `${n} ${n === 1 ? "guest" : "guests"}`,
    doneTitle: "The table is yours.",
    doneText: "We've sent a confirmation to your email. If you're running more than 15 minutes late, let us know.",
    code: "Booking number",
    calendar: "Add to calendar",
    again: "New booking",
    demo: "Demo site: no booking was actually sent.",
    river: "SAVA",
    kitchen: "Kitchen · fire",
  },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+\d][\d\s/()-]{6,}$/;

/** Deterministic "busy" slots so the demo feels alive. */
const isFull = (date: string, time: string) => {
  let h = 0;
  for (const ch of date + time) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 7 === 0 || (time >= "19:30" && time <= "20:30" && h % 3 === 0);
};

function slotsFor(d: Date) {
  const day = d.getDay();
  const last = day === 5 || day === 6 ? 23 * 60 : day === 0 ? 21 * 60 : 22 * 60;
  const out: string[] = [];
  for (let m = 12 * 60; m <= last; m += 30) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 ? "30" : "00"}`);
  return out;
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function ReservationWidget({ locale, eventsHref }: { locale: Locale; eventsHref: string }) {
  const t = T[locale];
  const [step, setStep] = useState(0);
  const [picked, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState<Area | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", occasion: 0, notes: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // The date list only exists in the browser (avoids a server/client date mismatch).
  const today = useClientValue(() => iso(new Date()));
  const days = useMemo(() => {
    if (!today) return [];
    const [y, m, d] = today.split("-").map(Number);
    return Array.from({ length: 21 }, (_, i) => new Date(y, m - 1, d + i));
  }, [today]);
  const date = picked ?? today;

  const dateObj = useMemo(() => days.find((d) => iso(d) === date) ?? null, [days, date]);
  const slots = useMemo(() => {
    if (!dateObj) return [];
    const now = new Date();
    const today = iso(now) === date;
    const nowM = now.getHours() * 60 + now.getMinutes() + 60;
    return slotsFor(dateObj).map((s) => {
      const [h, m] = s.split(":").map(Number);
      return { s, past: today && h * 60 + m < nowM, full: isFull(date!, s) };
    });
  }, [dateObj, date]);

  const terraceOpen = useMemo(() => {
    if (!dateObj) return true;
    const md = (dateObj.getMonth() + 1) * 100 + dateObj.getDate();
    return md >= 415 && md <= 1031;
  }, [dateObj]);

  const dateLabel = (d: Date, i: number) =>
    i === 0 ? t.today : i === 1 ? t.tomorrow : d.toLocaleDateString(locale === "sr" ? "sr-Latn-RS" : "en-GB", { weekday: "short" });
  const longDate = dateObj?.toLocaleDateString(locale === "sr" ? "sr-Latn-RS" : "en-GB", { weekday: "long", day: "numeric", month: "long" });

  const go = (n: number) => {
    const el = panel.current;
    const change = () => {
      setStep(n);
      requestAnimationFrame(() => heading.current?.focus());
    };
    if (!el || prefersReducedMotion()) return change();
    gsap.to(el, {
      opacity: 0,
      y: -16,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        change();
        gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" });
      },
    });
    const top = el.closest("section")?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 80, behavior: "smooth" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.required;
    if (!PHONE.test(form.phone.trim())) e.phone = form.phone.trim() ? t.invalidPhone : t.required;
    if (!EMAIL.test(form.email.trim())) e.email = form.email.trim() ? t.invalidEmail : t.required;
    if (!form.consent) e.consent = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setCode(`SUT-${(date ?? "").slice(5).replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`);
      go(3);
    }, 1100);
  };

  const ics = () => {
    if (!date || !time) return;
    const [h, m] = time.split(":").map(Number);
    const start = `${date.replace(/-/g, "")}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
    const endH = h + 2;
    const end = `${date.replace(/-/g, "")}T${String(endH).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Suton//Reservation//EN",
      "BEGIN:VEVENT",
      `UID:${code}@suton.rs`,
      `DTSTART;TZID=Europe/Belgrade:${start}`,
      `DTEND;TZID=Europe/Belgrade:${end}`,
      `SUMMARY:Suton · ${t.people(guests)}`,
      `LOCATION:${site.street}, ${site.city}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "suton.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const canNext0 = !!date && !!time;
  const canNext1 = !!area && !(area === "terrace" && !terraceOpen) && !(area === "counter" && guests > 4);
  const areaLabels = { indoor: t.areas.indoor.t, terrace: t.areas.terrace.t, counter: t.areas.counter.t, river: t.river, kitchen: t.kitchen };

  const field = (key: "name" | "phone" | "email", label: string, type: string, auto: string) => (
    <div>
      <label htmlFor={`r-${key}`} className="t-eyebrow text-smoke">
        {label}
      </label>
      <input
        id={`r-${key}`}
        type={type}
        autoComplete={auto}
        inputMode={key === "phone" ? "tel" : key === "email" ? "email" : undefined}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `r-${key}-e` : undefined}
        className={clsx(
          "mt-2 h-13 w-full rounded-xl border bg-night/60 px-4 text-cream transition-colors focus:border-candle focus:outline-none",
          errors[key] ? "border-candle" : "border-line",
        )}
      />
      {errors[key] && (
        <p id={`r-${key}-e`} className="mt-1.5 text-sm text-candle">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
      <div className="min-w-0">
        {/* Progress */}
        {step < 3 && (
          <ol className="mb-10 grid grid-cols-3 gap-3">
            {t.steps.map((s, i) => (
              <li key={s} className="min-w-0">
                <div className="h-px w-full overflow-hidden bg-line">
                  <div className="h-px bg-candle transition-transform duration-700 ease-[var(--ease-out-expo)]" style={{ transform: `scaleX(${step >= i ? 1 : 0})`, transformOrigin: "left" }} />
                </div>
                <p className={clsx("t-eyebrow mt-3 truncate", step === i ? "text-candle" : "text-smoke")} aria-current={step === i ? "step" : undefined}>
                  0{i + 1} · {s}
                </p>
              </li>
            ))}
          </ol>
        )}

        <div ref={panel}>
          {step === 0 && (
            <div>
              <h2 ref={heading} tabIndex={-1} className="t-h3 outline-none">
                {t.when}
              </h2>
              <fieldset className="mt-8">
                <legend className="t-eyebrow text-smoke">{t.date}</legend>
                <div className="no-scrollbar -mx-[var(--gutter)] mt-3 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:px-0">
                  {days.map((d, i) => {
                    const v = iso(d);
                    const on = v === date;
                    return (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          setDate(v);
                          setTime(null);
                        }}
                        className={clsx(
                          "flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors duration-300",
                          on ? "border-candle bg-candle text-night" : "border-line hover:border-cream/50",
                        )}
                      >
                        <span className="text-[0.7rem] uppercase tracking-wider opacity-80">{dateLabel(d, i)}</span>
                        <span className="t-serif t-num text-2xl leading-none">{d.getDate()}</span>
                        <span className="text-[0.65rem] opacity-70">{d.toLocaleDateString(locale === "sr" ? "sr-Latn-RS" : "en-GB", { month: "short" })}</span>
                      </button>
                    );
                  })}
                  {days.length === 0 && <span className="h-20" />}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="t-eyebrow text-smoke">{t.time}</legend>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {slots.map(({ s, past, full }) => {
                    const on = s === time;
                    const disabled = past || full;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={disabled}
                        aria-pressed={on}
                        onClick={() => setTime(s)}
                        className={clsx(
                          "t-num relative h-12 rounded-xl border text-sm transition-colors duration-300",
                          on && "border-candle bg-candle text-night",
                          !on && !disabled && "border-line hover:border-cream/50",
                          disabled && "cursor-not-allowed border-transparent bg-char/60 text-smoke/60 line-through",
                        )}
                      >
                        {s}
                        {full && !past && <span className="sr-only"> ({t.full})</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="t-eyebrow text-smoke">{t.guests}</legend>
                <div className="mt-3 flex items-center gap-4">
                  <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-12 w-12 place-items-center rounded-full border border-line text-xl hover:border-cream" aria-label="−">
                    −
                  </button>
                  <output className="t-serif t-num w-24 text-center text-4xl" aria-live="polite">
                    {guests}
                  </output>
                  <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="grid h-12 w-12 place-items-center rounded-full border border-line text-xl hover:border-cream" aria-label="+">
                    +
                  </button>
                  <span className="text-smoke">{t.people(guests).replace(/^\d+ /, "")}</span>
                </div>
                {guests >= 12 && (
                  <p className="mt-3 text-sm text-candle">
                    <a href={eventsHref} className="link-underline">
                      {t.guestsBig} →
                    </a>
                  </p>
                )}
              </fieldset>

              <div className="mt-10 flex justify-end">
                <button type="button" disabled={!canNext0} onClick={() => go(1)} className="h-13 rounded-full bg-candle px-8 font-medium text-night transition-opacity disabled:opacity-40">
                  {t.next} →
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 ref={heading} tabIndex={-1} className="t-h3 outline-none">
                {t.where}
              </h2>
              <div className="mt-8 grid gap-8">
                <div className="grid gap-3" role="radiogroup" aria-label={t.where}>
                  {(["indoor", "terrace", "counter"] as Area[]).map((a) => {
                    const on = area === a;
                    const blocked = (a === "terrace" && !terraceOpen) || (a === "counter" && guests > 4);
                    return (
                      <button
                        key={a}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        disabled={blocked}
                        onClick={() => setArea(a)}
                        className={clsx(
                          "rounded-2xl border p-5 text-left transition-colors duration-300",
                          on ? "border-candle bg-candle/10" : "border-line hover:border-cream/40",
                          blocked && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="t-serif text-2xl">{t.areas[a].t}</span>
                          <span className={clsx("grid h-6 w-6 place-items-center rounded-full border", on ? "border-candle bg-candle" : "border-line")} aria-hidden>
                            {on && <span className="h-2 w-2 rounded-full bg-night" />}
                          </span>
                        </span>
                        <span className="mt-2 block text-sm text-smoke">
                          {blocked ? (a === "terrace" ? t.terraceClosed : t.counterMax) : t.areas[a].d}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="rounded-2xl border border-line bg-night/40 p-4 text-cream lg:hidden">
                  <FloorPlan area={area} labels={areaLabels} />
                </div>
              </div>
              <div className="mt-10 flex justify-between">
                <button type="button" onClick={() => go(0)} className="h-13 rounded-full border border-line px-7 hover:border-cream">
                  ← {t.back}
                </button>
                <button type="button" disabled={!canNext1} onClick={() => go(2)} className="h-13 rounded-full bg-candle px-8 font-medium text-night transition-opacity disabled:opacity-40">
                  {t.next} →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={submit} noValidate>
              <h2 ref={heading} tabIndex={-1} className="t-h3 outline-none">
                {t.who}
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">{field("name", t.name, "text", "name")}</div>
                {field("phone", t.phone, "tel", "tel")}
                {field("email", t.email, "email", "email")}
                <div>
                  <label htmlFor="r-occ" className="t-eyebrow text-smoke">
                    {t.occasion}
                  </label>
                  <select
                    id="r-occ"
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: Number(e.target.value) })}
                    className="mt-2 h-13 w-full rounded-xl border border-line bg-night/60 px-4 text-cream focus:border-candle focus:outline-none"
                  >
                    {t.occasions.map((o, i) => (
                      <option key={o} value={i}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="r-notes" className="t-eyebrow text-smoke">
                    {t.notes}
                  </label>
                  <textarea
                    id="r-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-line bg-night/60 px-4 py-3 text-cream focus:border-candle focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-cream/85">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? "r-consent-e" : undefined}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--candle)]"
                    />
                    {t.consent}
                  </label>
                  {errors.consent && (
                    <p id="r-consent-e" className="mt-1.5 text-sm text-candle">
                      {errors.consent}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-10 flex justify-between gap-4">
                <button type="button" onClick={() => go(1)} className="h-13 rounded-full border border-line px-7 hover:border-cream">
                  ← {t.back}
                </button>
                <button type="submit" disabled={sending} className="h-13 rounded-full bg-candle px-8 font-medium text-night transition-opacity disabled:opacity-70">
                  {sending ? t.sending : t.confirm}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center" role="status">
              <div className="arch-soft relative w-full max-w-sm overflow-hidden border border-candle/50 bg-[linear-gradient(180deg,rgb(227_168_87/0.18),rgb(110_31_42/0.25)_55%,var(--char))] px-8 pb-10 pt-16">
                <Mark className="mx-auto h-14 w-14 text-cream" />
                <h2 ref={heading} tabIndex={-1} className="t-h2 mt-6 text-[2.6rem] outline-none">
                  {t.doneTitle}
                </h2>
                <dl className="mt-8 space-y-3 border-t border-dashed border-cream/25 pt-6 text-left text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-smoke">{t.date}</dt>
                    <dd className="text-right capitalize">{longDate}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-smoke">{t.time}</dt>
                    <dd className="t-num">{time}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-smoke">{t.guests}</dt>
                    <dd>{t.people(guests)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-smoke">{t.steps[1]}</dt>
                    <dd>{area && t.areas[area].t}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-dashed border-cream/25 pt-3">
                    <dt className="text-smoke">{t.code}</dt>
                    <dd className="t-num text-candle">{code}</dd>
                  </div>
                </dl>
              </div>
              <p className="mt-8 max-w-md text-cream/85">{t.doneText}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={ics} className="h-12 rounded-full bg-candle px-6 font-medium text-night">
                  {t.calendar}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTime(null);
                    setArea(null);
                    setForm({ name: "", phone: "", email: "", occasion: 0, notes: "", consent: false });
                    go(0);
                  }}
                  className="h-12 rounded-full border border-line px-6 hover:border-cream"
                >
                  {t.again}
                </button>
              </div>
              <p className="mt-6 text-xs text-smoke">{t.demo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Live summary */}
      {step < 3 && (
        <aside className="h-fit rounded-[1.5rem] border border-line bg-char/70 p-6 lg:sticky lg:top-28" aria-live="polite">
          <p className="t-eyebrow text-candle">{t.summary}</p>
          <p className="t-serif mt-4 text-2xl capitalize">{longDate ?? "—"}</p>
          <p className="t-num mt-1 text-smoke">
            {time ?? "--:--"} · {t.people(guests)}
          </p>
          <p className="mt-1 text-smoke">{area ? t.areas[area].t : t.pick}</p>
          <div className="mt-6 hidden text-cream lg:block">
            <FloorPlan area={area} labels={areaLabels} />
          </div>
        </aside>
      )}
    </div>
  );
}
