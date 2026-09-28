"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ChoiceGroup, EMAIL, Success, TextArea, TextField } from "./fields";

const T = {
  sr: {
    name: "Ime i prezime",
    email: "Email",
    topic: "Tema",
    topics: { general: "Opšte pitanje", press: "Mediji", jobs: "Posao u Sutonu", supplier: "Saradnja / dobavljači" },
    msg: "Poruka",
    send: "Pošalji poruku",
    required: "Obavezno polje",
    email_e: "Unesite ispravan email",
    msg_e: "Poruka je prekratka",
    doneTitle: "Hvala na poruci.",
    doneText: "Odgovaramo radnim danima u roku od 24 sata. Za rezervacije za danas, pozovite nas.",
    note: "Demo sajt: poruka nije zaista poslata.",
  },
  en: {
    name: "Full name",
    email: "Email",
    topic: "Topic",
    topics: { general: "General question", press: "Press", jobs: "Jobs at Suton", supplier: "Suppliers & partners" },
    msg: "Message",
    send: "Send message",
    required: "Required",
    email_e: "Enter a valid email",
    msg_e: "The message is too short",
    doneTitle: "Thank you for your message.",
    doneText: "We reply within 24 hours on weekdays. For a table tonight, please give us a call.",
    note: "Demo site: no message was actually sent.",
  },
};

type Topic = keyof (typeof T)["sr"]["topics"];

export function ContactForm({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [topic, setTopic] = useState<Topic | null>("general");
  const [e, setE] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (done) return <Success title={t.doneTitle} text={t.doneText} note={t.note} />;

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(ev) => {
        ev.preventDefault();
        const err: Record<string, string> = {};
        if (!f.name.trim()) err.name = t.required;
        if (!EMAIL.test(f.email.trim())) err.email = f.email ? t.email_e : t.required;
        if (f.msg.trim().length < 10) err.msg = f.msg ? t.msg_e : t.required;
        setE(err);
        if (!Object.keys(err).length) setDone(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="c-name" label={t.name} value={f.name} onChange={(v) => setF({ ...f, name: v })} error={e.name} autoComplete="name" />
        <TextField id="c-email" label={t.email} type="email" inputMode="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} error={e.email} autoComplete="email" />
      </div>
      <ChoiceGroup label={t.topic} value={topic} onChange={setTopic} options={(Object.keys(t.topics) as Topic[]).map((v) => ({ v, l: t.topics[v] }))} />
      <TextArea id="c-msg" label={t.msg} value={f.msg} onChange={(v) => setF({ ...f, msg: v })} error={e.msg} rows={5} />
      <button type="submit" className="h-13 rounded-full bg-candle px-8 font-medium text-night">
        {t.send} →
      </button>
    </form>
  );
}
