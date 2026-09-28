"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";
import { Mark } from "@/components/brand/Logo";
import { formatRsd } from "@/content/menu";
import type { Locale } from "@/lib/i18n";
import { ChoiceGroup, EMAIL, Success, TextArea, TextField } from "./fields";

const T = {
  sr: {
    choose: "Izaberite poklon",
    amounts: "Iznos",
    experiences: "Doživljaj",
    exp: {
      tasting: { t: "Iz vatre za dvoje", d: "Degustacioni meni od 8 sledova za šankom kuhinje", p: 17800 },
      sunset: { t: "Zalazak za dvoje", d: "Sto na terasi, 3 slede i boca vina po izboru sommeliera", p: 12900 },
    },
    custom: "Drugi iznos",
    to: "Za koga je poklon",
    from: "Od koga",
    msg: "Poruka na kartici (do 140 znakova)",
    delivery: "Isporuka",
    deliveries: { email: "Emailom primaocu", print: "PDF za štampu", pickup: "Preuzimanje u restoranu (kutija od hrasta)" },
    buyer: "Vaš email",
    buy: "Nastavi na plaćanje",
    required: "Obavezno polje",
    email_e: "Unesite ispravan email",
    amount_e: "Izaberite iznos (najmanje 2.000 RSD)",
    valid: "Važi 12 meseci",
    card: "Poklon kartica",
    placeholderTo: "Ana",
    placeholderMsg: "Za jedno veče na obali. Srećan rođendan!",
    doneTitle: "Poklon je spreman.",
    doneText: "Karticu sa jedinstvenim kodom šaljemo odmah nakon plaćanja. Važi 12 meseci, za sva jela, pića i događaje.",
    note: "Demo sajt: plaćanje nije deo ovog prikaza i ništa nije naplaćeno.",
    code: "Kod",
  },
  en: {
    choose: "Choose a gift",
    amounts: "Amount",
    experiences: "Experience",
    exp: {
      tasting: { t: "From the fire for two", d: "The 8-course tasting menu at the kitchen counter", p: 17800 },
      sunset: { t: "Sunset for two", d: "A terrace table, 3 courses and a bottle picked by the sommelier", p: 12900 },
    },
    custom: "Other amount",
    to: "Who is it for",
    from: "From",
    msg: "Message on the card (up to 140 characters)",
    delivery: "Delivery",
    deliveries: { email: "Email to the recipient", print: "Print-at-home PDF", pickup: "Pick up at the restaurant (oak gift box)" },
    buyer: "Your email",
    buy: "Continue to payment",
    required: "Required",
    email_e: "Enter a valid email",
    amount_e: "Choose an amount (at least RSD 2,000)",
    valid: "Valid for 12 months",
    card: "Gift card",
    placeholderTo: "Anna",
    placeholderMsg: "For one evening by the river. Happy birthday!",
    doneTitle: "Your gift is ready.",
    doneText: "We send the card with its unique code right after payment. Valid for 12 months on all food, drinks and events.",
    note: "Demo site: payment is not part of this preview and nothing was charged.",
    code: "Code",
  },
};

const AMOUNTS = [3000, 5000, 10000];
type Exp = "tasting" | "sunset";
type Delivery = "email" | "print" | "pickup";

/** Gift card builder with a live, tilting card preview. */
export function GiftCardBuilder({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [amount, setAmount] = useState<number | null>(5000);
  const [exp, setExp] = useState<Exp | null>(null);
  const [custom, setCustom] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [delivery, setDelivery] = useState<Delivery | null>("email");
  const [buyer, setBuyer] = useState("");
  const [e, setE] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  const value = exp ? t.exp[exp].p : amount ?? (Number(custom) || 0);

  const tilt = (ev: React.PointerEvent) => {
    const el = card.current;
    if (!el || isTouch() || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 16, rotateX: -y * 12, duration: 0.6, ease: "power3.out" });
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const untilt = () => card.current && gsap.to(card.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" });

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const err: Record<string, string> = {};
    if (!value || value < 2000) err.amount = t.amount_e;
    if (!to.trim()) err.to = t.required;
    if (!from.trim()) err.from = t.required;
    if (!EMAIL.test(buyer.trim())) err.buyer = buyer ? t.email_e : t.required;
    setE(err);
    if (!Object.keys(err).length) setDone(true);
  };

  const preview = (
    <div className="[perspective:1200px]" onPointerMove={tilt} onPointerLeave={untilt}>
      <div
        ref={card}
        className="arch-soft relative mx-auto aspect-[3/4.2] w-full max-w-[22rem] overflow-hidden border border-candle/40 bg-[radial-gradient(120%_80%_at_50%_0%,#3a1a1f,var(--night)_70%)] p-7 shadow-[0_40px_120px_-30px_rgb(110_31_42/0.7)] [transform-style:preserve-3d]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,30%),rgb(240_194_125/0.28),transparent_45%)]" aria-hidden />
        <div className="relative flex h-full flex-col items-center text-center">
          <Mark className="mt-6 h-16 w-16 text-cream" />
          <p className="t-eyebrow mt-4 text-candle">{t.card}</p>
          <p className="t-serif t-num mt-6 text-[2.6rem] leading-none">{value ? formatRsd(value, locale) : "—"}</p>
          {exp && <p className="t-serif mt-2 text-lg italic text-cream/85">{t.exp[exp].t}</p>}
          <div className="mt-auto w-full border-t border-dashed border-cream/25 pt-5 text-left text-sm">
            <p className="text-smoke">
              {locale === "sr" ? "Za" : "For"} <span className="t-serif text-lg text-cream">{to || t.placeholderTo}</span>
            </p>
            <p className="mt-2 line-clamp-3 italic text-cream/85">“{msg || t.placeholderMsg}”</p>
            {from && <p className="mt-2 text-right text-smoke">— {from}</p>}
          </div>
          <p className="t-eyebrow mt-4 text-[0.6rem] text-smoke">SUTON · {t.valid}</p>
        </div>
      </div>
    </div>
  );

  if (done) {
    return (
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {preview}
        <Success title={t.doneTitle} text={t.doneText} note={t.note} />
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <div className="space-y-9">
        <fieldset>
          <legend className="t-h3">{t.choose}</legend>
          <p className="t-eyebrow mt-6 text-smoke">{t.amounts}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={!exp && amount === a}
                onClick={() => {
                  setExp(null);
                  setAmount(a);
                }}
                className={clsx("t-num min-h-12 rounded-full border px-5 transition-colors", !exp && amount === a ? "border-candle bg-candle text-night" : "border-line hover:border-cream/60")}
              >
                {formatRsd(a, locale)}
              </button>
            ))}
            <label className={clsx("flex min-h-12 items-center gap-2 rounded-full border px-5", !exp && amount === null ? "border-candle" : "border-line")}>
              <span className="text-sm text-smoke">{t.custom}</span>
              <input
                type="number"
                inputMode="numeric"
                min={2000}
                step={500}
                value={custom}
                onFocus={() => {
                  setExp(null);
                  setAmount(null);
                }}
                onChange={(ev) => setCustom(ev.target.value)}
                className="t-num w-24 bg-transparent text-cream focus:outline-none"
                aria-label={t.custom}
              />
            </label>
          </div>
          <p className="t-eyebrow mt-7 text-smoke">{t.experiences}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(Object.keys(t.exp) as Exp[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={exp === k}
                onClick={() => setExp(k)}
                className={clsx("rounded-2xl border p-5 text-left transition-colors", exp === k ? "border-candle bg-candle/10" : "border-line hover:border-cream/40")}
              >
                <span className="t-serif block text-xl">{t.exp[k].t}</span>
                <span className="mt-1 block text-sm text-smoke">{t.exp[k].d}</span>
                <span className="t-num mt-3 block text-candle">{formatRsd(t.exp[k].p, locale)}</span>
              </button>
            ))}
          </div>
          {e.amount && <p className="mt-2 text-sm text-candle">{e.amount}</p>}
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="g-to" label={t.to} value={to} onChange={setTo} error={e.to} autoComplete="off" />
          <TextField id="g-from" label={t.from} value={from} onChange={setFrom} error={e.from} autoComplete="name" />
          <TextArea id="g-msg" label={t.msg} value={msg} onChange={(v) => setMsg(v.slice(0, 140))} rows={3} className="sm:col-span-2" />
        </div>

        <ChoiceGroup label={t.delivery} value={delivery} onChange={setDelivery} options={(Object.keys(t.deliveries) as Delivery[]).map((v) => ({ v, l: t.deliveries[v] }))} />

        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <TextField id="g-buyer" label={t.buyer} type="email" inputMode="email" value={buyer} onChange={setBuyer} error={e.buyer} autoComplete="email" />
          <button type="submit" className="h-13 rounded-full bg-candle px-8 font-medium text-night">
            {t.buy} · <span className="t-num">{value ? formatRsd(value, locale) : "—"}</span>
          </button>
        </div>
      </div>

      <div className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">{preview}</div>
    </form>
  );
}
