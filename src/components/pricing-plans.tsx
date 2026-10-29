"use client";

import { useState, type ReactNode } from "react";
import { Calculator, ChevronDown, Lock } from "lucide-react";
import { useLang } from "@/lib/i18n";
import {
  capacity,
  creditPrice,
  creditsForSeconds,
  DURATION_TIERS,
  EXAMPLE_MIXES,
  formatTry,
  INTRO_PLAN,
  introSavingsPercent,
  mixCredits,
  PICKER_SECONDS,
  recommendPlan,
  REFERENCE_SECONDS,
  REGULAR_PLANS,
  type Mix,
  type Plan,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Badge } from "./ui";

const RECOMMENDED = "maker";

function PlanCard({
  plan,
  action,
  used,
  wide,
}: {
  plan: Plan;
  action: (plan: Plan) => ReactNode;
  used?: boolean;
  wide?: boolean;
}) {
  const { t } = useLang();
  const videos = capacity(plan.credits, REFERENCE_SECONDS).count;
  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-card)] border bg-ink p-6",
        plan.intro && !used ? "border-accent" : "border-line",
        used && "opacity-60",
        wide && "lg:grid lg:grid-cols-[1fr_1fr_auto] lg:items-center lg:gap-10",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">{t(plan.name, plan.nameEn)}</h3>
          {plan.intro && <Badge tone="accent">{t("İlk alıma özel · tek seferlik", "First purchase only · once")}</Badge>}
          {plan.id === RECOMMENDED && <Badge tone="paper">{t("Önerilen", "Recommended")}</Badge>}
        </div>
        {plan.id === REGULAR_PLANS[0].id && (
          <p className="mt-1 text-[12px] text-faint">{t("Tanışma sonrası ilk adım", "The next step after Intro")}</p>
        )}
        <p className="mt-4 font-display text-4xl font-semibold tabular-nums">{formatTry(plan.priceTry)}</p>
      </div>

      <div className={cn("mt-4 space-y-1", wide && "lg:mt-0")}>
        <p className="text-[15px] font-semibold text-accent tabular-nums">
          {plan.credits} {t("kredi", "credits")}
        </p>
        <p className="text-[12px] text-faint tabular-nums">
          ≈ {formatTry(Math.round(creditPrice(plan)))} / {t("kredi", "credit")}
        </p>
        {plan.intro && (
          <p className="text-[12px] font-medium text-ok tabular-nums">
            {t(`Kredi başına %${introSavingsPercent()} daha uygun`, `${introSavingsPercent()}% less per credit`)}
          </p>
        )}
        <p className="pt-2 text-[13px] text-paper tabular-nums">
          {t(`≈ ${videos} adet ${REFERENCE_SECONDS} saniyelik video`, `≈ ${videos} videos of ${REFERENCE_SECONDS} seconds`)}
        </p>
        <p className="text-[12px] text-faint">{t("Tek seferlik ödeme · Abonelik yok", "One-time payment · No subscription")}</p>
      </div>

      <div className={cn("mt-6 flex flex-1 items-end", wide && "lg:mt-0")}>
        {used ? (
          <p className="w-full rounded-lg border border-line px-5 py-2.5 text-center text-sm font-semibold text-muted">
            {t("Bu paketi kullandın", "You've used this pack")}
          </p>
        ) : (
          action(plan)
        )}
      </div>
    </div>
  );
}

function CombinationCalculator({ action, introUsed }: { action: (plan: Plan) => ReactNode; introUsed?: boolean }) {
  const { t } = useLang();
  const [counts, setCounts] = useState<Record<number, number>>({});
  const mix: Mix = PICKER_SECONDS.map((s) => [s, counts[s] ?? 0]);
  const needed = mixCredits(mix);
  const pick = recommendPlan(needed);
  const introFits = !introUsed && needed > 0 && needed <= INTRO_PLAN.credits;

  const fill = (example: Mix) => setCounts(Object.fromEntries(example));

  return (
    <details className="group rounded-[var(--radius-card)] border border-line bg-ink">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-accent" />
          {t("Kombinasyonunu hesapla", "Work out your mix")}
        </span>
        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-5 border-t border-line p-5">
        <p className="text-[13px] text-muted">
          {t(
            "Her süreden kaç video istediğini yaz, sana uygun paketi gösterelim.",
            "Enter how many videos you want of each length and we'll show the pack that fits.",
          )}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PICKER_SECONDS.map((s) => (
            <label key={s} className="space-y-1">
              <span className="block text-[12px] text-muted tabular-nums">
                {s} sn · {creditsForSeconds(s)} {t("kredi", "credits")}
              </span>
              <input
                type="number"
                min={0}
                max={999}
                inputMode="numeric"
                value={counts[s] || ""}
                placeholder="0"
                onChange={(e) =>
                  setCounts((c) => ({ ...c, [s]: Math.max(0, Math.min(999, Math.floor(Number(e.target.value) || 0))) }))
                }
                className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm tabular-nums text-paper placeholder:text-faint focus:border-accent focus:outline-none"
              />
            </label>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[12px] text-faint">{t("Hazır örnekler", "Examples")}</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_MIXES.map((ex) => (
              <button
                key={ex.tr}
                type="button"
                onClick={() => fill(ex.mix)}
                className="rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-line-strong hover:text-paper"
              >
                {t(ex.tr, ex.en)}: {ex.mix.map(([s, n]) => `${n} × ${s} sn`).join(" + ")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-line pt-4 text-sm tabular-nums">
          <p className="text-muted">
            {t("Gereken", "Needed")}: <span className="font-semibold text-paper">{needed} {t("kredi", "credits")}</span>
          </p>
          {needed > 0 &&
            (pick ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-ok">
                    {t("Sana uygun paket", "Your pack")}: {t(pick.plan.name, pick.plan.nameEn)} — {formatTry(pick.plan.priceTry)}
                  </p>
                  <p className="text-[13px] text-muted">
                    {t("Kalan kredi", "Credits left over")}: {pick.left}
                  </p>
                  {introFits && (
                    <p className="mt-1 text-[13px] text-muted">
                      {t(
                        `İlk alımsan: ${INTRO_PLAN.name} — ${formatTry(INTRO_PLAN.priceTry)}`,
                        `First purchase? ${INTRO_PLAN.nameEn} — ${formatTry(INTRO_PLAN.priceTry)}`,
                      )}
                    </p>
                  )}
                </div>
                <div className="sm:w-48">{action(pick.plan)}</div>
              </div>
            ) : (
              <p className="font-semibold text-accent">
                {t(
                  "Bu hacim tek pakete sığmıyor; birden fazla Ajans paketi alabilirsin, kalan kredi birleşir.",
                  "This volume doesn't fit one pack; buy several Agency packs and the credits add up.",
                )}
              </p>
            ))}
        </div>
      </div>
    </details>
  );
}

/**
 * Credit packs, the duration → credit table and a calculator that suggests a pack for a mix of
 * lengths. Used on the landing page and the credits page.
 */
export function PricingPlans({ introUsed, action }: { introUsed?: boolean; action: (plan: Plan) => ReactNode }) {
  const { t } = useLang();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] text-muted">{t("Video süresi", "Video length")}</span>
        <ul className="flex flex-wrap gap-1.5">
          {DURATION_TIERS.map((tier) => (
            <li
              key={tier.upTo}
              className="rounded-md border border-line px-3 py-1.5 text-[13px] font-medium tabular-nums text-paper"
            >
              {tier.upTo} sn
              <span className="ml-1.5 text-faint">
                {tier.credits} {t("kredi", "credits")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <PlanCard plan={INTRO_PLAN} action={action} used={introUsed} wide />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REGULAR_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} action={action} />
        ))}
      </div>

      <div className="space-y-2 text-[13px] leading-relaxed">
        <p className="text-muted">
          {t(
            "Tanışma dışındaki paketleri istediğin kadar alabilirsin; kalan kredin yeni paketle birleşir.",
            "Buy any pack other than Intro as often as you like; leftover credits add up with the new pack.",
          )}
        </p>
        <p className="flex items-center gap-2 text-paper/80">
          <Lock className="h-3.5 w-3.5 shrink-0 text-accent" />
          {t("Ödeme Shopier güvencesiyle kredi kartından alınır.", "Payment is taken by card, secured by Shopier.")}
        </p>
      </div>
      <CombinationCalculator action={action} introUsed={introUsed} />
    </div>
  );
}
