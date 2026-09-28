"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { ChoiceGroup, EMAIL, PHONE, Success, TextArea, TextField } from "./fields";

const T = {
  sr: {
    steps: ["Povod", "Detalji", "Kontakt"],
    type: "Kakav događaj planirate?",
    types: { birthday: "Rođendan", business: "Poslovna večera", wedding: "Venčanje / veridba", family: "Porodično slavlje", other: "Nešto drugo" },
    space: "Prostor",
    spaces: { private: "Privatna sala (do 16)", terrace: "Terasa (do 60)", whole: "Ceo restoran (do 120)", unsure: "Predložite vi" },
    date: "Željeni datum",
    guests: "Broj gostiju",
    budget: "Okvirni budžet po osobi",
    budgets: { a: "do 5.000 RSD", b: "5.000–8.000 RSD", c: "8.000+ RSD" },
    name: "Ime i prezime",
    company: "Firma (opciono)",
    email: "Email",
    phone: "Telefon",
    msg: "Recite nam nešto više (meni, muzika, torta…)",
    next: "Dalje",
    back: "Nazad",
    send: "Pošalji upit",
    required: "Obavezno polje",
    email_e: "Unesite ispravan email",
    phone_e: "Unesite ispravan broj telefona",
    guests_e: "Unesite broj gostiju (8–120)",
    doneTitle: "Upit je stigao.",
    doneText: "Menadžerka događaja Jovana javiće vam se u roku od 24 sata sa predlogom menija i ponudom.",
    note: "Demo sajt: upit nije zaista poslat.",
  },
  en: {
    steps: ["Occasion", "Details", "Contact"],
    type: "What are you planning?",
    types: { birthday: "Birthday", business: "Business dinner", wedding: "Wedding / engagement", family: "Family celebration", other: "Something else" },
    space: "Space",
    spaces: { private: "Private room (up to 16)", terrace: "Terrace (up to 60)", whole: "Whole restaurant (up to 120)", unsure: "You suggest" },
    date: "Preferred date",
    guests: "Number of guests",
    budget: "Approximate budget per person",
    budgets: { a: "up to RSD 5,000", b: "RSD 5,000–8,000", c: "RSD 8,000+" },
    name: "Full name",
    company: "Company (optional)",
    email: "Email",
    phone: "Phone",
    msg: "Tell us more (menu, music, cake…)",
    next: "Next",
    back: "Back",
    send: "Send inquiry",
    required: "Required",
    email_e: "Enter a valid email",
    phone_e: "Enter a valid phone number",
    guests_e: "Enter the number of guests (8–120)",
    doneTitle: "Your inquiry is in.",
    doneText: "Jovana, our events manager, will get back to you within 24 hours with a suggested menu and a quote.",
    note: "Demo site: no inquiry was actually sent.",
  },
};

type Type = keyof (typeof T)["sr"]["types"];
type Space = keyof (typeof T)["sr"]["spaces"];
type Budget = keyof (typeof T)["sr"]["budgets"];

/** Three-step private dining inquiry. Validates, then shows a success state (nothing is sent). */
export function InquiryForm({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [step, setStep] = useState(0);
  const [type, setType] = useState<Type | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [c, setC] = useState({ name: "", company: "", email: "", phone: "", msg: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (done) return <Success title={t.doneTitle} text={t.doneText} note={t.note} />;

  const check1 = () => {
    const err: Record<string, string> = {};
    if (!date) err.date = t.required;
    const g = Number(guests);
    if (!g || g < 8 || g > 120) err.guests = t.guests_e;
    setE(err);
    return !Object.keys(err).length;
  };
  const check2 = () => {
    const err: Record<string, string> = {};
    if (!c.name.trim()) err.name = t.required;
    if (!EMAIL.test(c.email.trim())) err.email = c.email ? t.email_e : t.required;
    if (!PHONE.test(c.phone.trim())) err.phone = c.phone ? t.phone_e : t.required;
    setE(err);
    return !Object.keys(err).length;
  };

  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        if (check2()) setDone(true);
      }}
    >
      <ol className="mb-10 grid grid-cols-3 gap-3">
        {t.steps.map((s, i) => (
          <li key={s}>
            <div className="h-px bg-line">
              <div className="h-px origin-left bg-candle transition-transform duration-700" style={{ transform: `scaleX(${step >= i ? 1 : 0})` }} />
            </div>
            <p className={clsx("t-eyebrow mt-3", step === i ? "text-candle" : "text-smoke")} aria-current={step === i ? "step" : undefined}>
              0{i + 1} · {s}
            </p>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="anim-fade space-y-8">
          <ChoiceGroup label={t.type} value={type} onChange={setType} options={(Object.keys(t.types) as Type[]).map((v) => ({ v, l: t.types[v] }))} />
          <ChoiceGroup label={t.space} value={space} onChange={setSpace} options={(Object.keys(t.spaces) as Space[]).map((v) => ({ v, l: t.spaces[v] }))} />
          <div className="flex justify-end">
            <button type="button" disabled={!type} onClick={() => setStep(1)} className="h-13 rounded-full bg-candle px-8 font-medium text-night disabled:opacity-40">
              {t.next} →
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="anim-fade space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="i-date" label={t.date} type="date" value={date} onChange={setDate} error={e.date} min={new Date().toISOString().slice(0, 10)} />
            <TextField id="i-guests" label={t.guests} type="number" inputMode="numeric" value={guests} onChange={setGuests} error={e.guests} />
          </div>
          <ChoiceGroup label={t.budget} value={budget} onChange={setBudget} options={(Object.keys(t.budgets) as Budget[]).map((v) => ({ v, l: t.budgets[v] }))} />
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(0)} className="h-13 rounded-full border border-line px-7 hover:border-cream">
              ← {t.back}
            </button>
            <button type="button" onClick={() => check1() && setStep(2)} className="h-13 rounded-full bg-candle px-8 font-medium text-night">
              {t.next} →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="anim-fade space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="i-name" label={t.name} value={c.name} onChange={(v) => setC({ ...c, name: v })} error={e.name} autoComplete="name" />
            <TextField id="i-company" label={t.company} value={c.company} onChange={(v) => setC({ ...c, company: v })} autoComplete="organization" />
            <TextField id="i-email" label={t.email} type="email" inputMode="email" value={c.email} onChange={(v) => setC({ ...c, email: v })} error={e.email} autoComplete="email" />
            <TextField id="i-phone" label={t.phone} type="tel" inputMode="tel" value={c.phone} onChange={(v) => setC({ ...c, phone: v })} error={e.phone} autoComplete="tel" />
          </div>
          <TextArea id="i-msg" label={t.msg} value={c.msg} onChange={(v) => setC({ ...c, msg: v })} />
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setStep(1)} className="h-13 rounded-full border border-line px-7 hover:border-cream">
              ← {t.back}
            </button>
            <button type="submit" className="h-13 rounded-full bg-candle px-8 font-medium text-night">
              {t.send}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
