"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LOGO_SIZES = {
  sm: { mark: "h-5 w-5 text-[11px]", text: "text-base" },
  md: { mark: "h-7 w-7 text-sm", text: "text-lg" },
  lg: { mark: "h-9 w-9 text-base", text: "text-2xl" },
};

/** Wordmark: a solid orange tile + set type, instead of the old glowing icon. */
export function Logo({ size = "md", className = "" }: { size?: keyof typeof LOGO_SIZES; className?: string }) {
  const s = LOGO_SIZES[size];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={cn("grid place-items-center rounded-[6px] bg-accent font-display font-bold text-ink", s.mark)}
      >
        N
      </span>
      <span className={cn("font-display font-semibold tracking-tight text-paper", s.text)}>
        Nex<span className="text-accent">UGC</span>
      </span>
    </div>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-full border border-line p-0.5 text-[11px] font-semibold" role="group" aria-label="Language">
      {(["tr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            lang === l ? "bg-paper text-ink" : "text-muted hover:text-paper",
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const VARIANTS = {
  primary: "bg-accent text-ink hover:bg-[#ff9d26] active:translate-y-px",
  default: "bg-paper text-ink hover:bg-white active:translate-y-px",
  outline: "border border-line-strong text-paper hover:border-paper/40 hover:bg-paper/[0.04]",
  ghost: "text-muted hover:text-paper hover:bg-paper/[0.05]",
};
const SIZES = {
  sm: "h-8 px-3 text-[13px]",
  default: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

/** Class string for plain <button>/<a> elements that should look like the primary button. */
export const primaryBtn =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-[#ff9d26] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40";

export const secondaryBtn =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-paper/40 hover:bg-paper/[0.04]";

export function Chip({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors",
        selected
          ? "border-accent bg-accent-soft text-accent"
          : "border-line text-muted hover:border-line-strong hover:text-paper",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[var(--radius-card)] border border-line bg-surface", className)}>{children}</div>;
}

const BADGE_TONES = {
  neutral: "border-line-strong text-muted",
  accent: "border-accent/40 bg-accent-soft text-accent",
  ok: "border-ok/40 bg-ok/10 text-ok",
  danger: "border-danger/40 bg-danger/10 text-danger",
  paper: "border-transparent bg-paper text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof BADGE_TONES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small uppercase label used above section titles ("01 — Sunucu"). */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn("font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-faint", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl font-semibold leading-[1.08] text-paper sm:text-[40px]">{title}</h2>
      {lead && <p className="text-[17px] leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

/** Label + hint wrapper for form controls. */
export function Field({
  label,
  hint,
  optional,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[13px] font-semibold text-paper">
        {label}
        {optional && <span className="ml-1.5 font-normal text-faint">{t("opsiyonel", "optional")}</span>}
      </p>
      {children}
      {hint && <p className="text-[12px] leading-snug text-faint">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-line bg-ink px-3.5 text-sm text-paper placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

export const textareaClass =
  "w-full resize-none rounded-lg border border-line bg-ink text-sm leading-relaxed text-paper placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

/** A 9:16 phone-shaped frame for showing real video/image output. */
export function PhoneFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("relative aspect-[9/16] overflow-hidden rounded-[22px] border border-line-strong bg-surface-2 p-1", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-ink">{children}</div>
    </div>
  );
}
