"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE = /^[+\d][\d\s/()-]{6,}$/;

const base = "mt-2 w-full rounded-xl border bg-night/60 px-4 text-cream transition-colors placeholder:text-smoke/70 focus:border-candle focus:outline-none";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
};

export function TextField({
  id,
  label,
  error,
  className,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  min,
}: FieldProps & {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  min?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-eyebrow text-smoke">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-e` : undefined}
        className={clsx(base, "h-13 [color-scheme:dark]", error ? "border-candle" : "border-line")}
      />
      {error && (
        <p id={`${id}-e`} className="mt-1.5 text-sm text-candle">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({ id, label, error, className, value, onChange, rows = 4 }: FieldProps & { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="t-eyebrow text-smoke">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-e` : undefined}
        className={clsx(base, "py-3", error ? "border-candle" : "border-line")}
      />
      {error && (
        <p id={`${id}-e`} className="mt-1.5 text-sm text-candle">
          {error}
        </p>
      )}
    </div>
  );
}

export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { v: T; l: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="t-eyebrow text-smoke">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={clsx(
              "min-h-11 rounded-full border px-5 text-sm transition-colors duration-300",
              value === o.v ? "border-candle bg-candle text-night" : "border-line hover:border-cream/60",
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Polished success state shared by the demo forms. */
export function Success({ title, text, note, action }: { title: string; text: string; note: string; action?: ReactNode }) {
  return (
    <div className="anim-fade flex flex-col items-start py-6" role="status">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-candle text-2xl text-night" aria-hidden>
        ✓
      </span>
      <h3 className="t-h2 mt-8">{title}</h3>
      <p className="t-lead mt-4 max-w-lg text-cream/85">{text}</p>
      {action}
      <p className="mt-6 text-xs text-smoke">{note}</p>
    </div>
  );
}
