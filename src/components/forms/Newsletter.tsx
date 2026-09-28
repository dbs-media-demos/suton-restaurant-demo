"use client";

import { useId, useState } from "react";
import type { Dict } from "@/i18n/dict";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter({ dict }: { dict: Dict }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="anim-fade flex items-center gap-3 text-cream" role="status">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-candle text-night" aria-hidden>
          ✓
        </span>
        {dict.footer.newsThanks}
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!EMAIL.test(value.trim())) return setError(dict.form.email);
        setError(null);
        setDone(true);
      }}
    >
      <label htmlFor={id} className="sr-only">
        {dict.footer.newsPlaceholder}
      </label>
      <div className="flex items-center gap-2 border-b border-cream/30 pb-2 focus-within:border-candle">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={dict.footer.newsPlaceholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent text-cream placeholder:text-smoke focus:outline-none"
        />
        <button type="submit" className="h-11 shrink-0 rounded-full px-4 text-sm font-medium text-candle hover:text-candle-2">
          {dict.footer.newsCta} →
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-candle" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
