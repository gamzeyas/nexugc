/**
 * Credit pricing, the single source of truth for the pricing page, the create screen and the
 * server. Prices are VAT-inclusive totals in TRY.
 */

/** Stored on every payment and video charge so old records keep their meaning. */
export const PRICING_VERSION = "v2";

/** Longest video a single job can produce. */
export const MAX_VIDEO_SECONDS = 30;

/** Credits per video by duration: a video of up to `upTo` seconds costs `credits`. */
export const DURATION_TIERS = [
  { upTo: 5, credits: 2 },
  { upTo: 10, credits: 4 },
  { upTo: 15, credits: 6 },
  { upTo: 20, credits: 9 },
  { upTo: 25, credits: 11 },
  { upTo: 30, credits: 13 },
] as const;

/** Credits a video of `seconds` costs, or null when the length is outside 0 < s <= 30. */
export function creditsForSeconds(seconds: number): number | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return DURATION_TIERS.find((tier) => seconds <= tier.upTo)?.credits ?? null;
}

/** How many videos of one length a credit amount covers, and what is left over. */
export function capacity(credits: number, seconds: number) {
  const cost = creditsForSeconds(seconds);
  if (!cost) return { count: 0, left: credits };
  const count = Math.floor(credits / cost);
  return { count, left: credits - count * cost };
}

/** `[[30, 3], [15, 5]]` = three 30 s videos and five 15 s videos. */
export type Mix = [seconds: number, count: number][];

export function mixCredits(mix: Mix) {
  return mix.reduce((sum, [seconds, count]) => sum + (creditsForSeconds(seconds) ?? 0) * count, 0);
}

export type Plan = {
  id: string;
  name: string;
  nameEn: string;
  credits: number;
  priceTry: number;
  /** Only for a customer's first successful purchase, once. */
  intro?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "intro",
    name: "Tanışma",
    nameEn: "Intro",
    credits: 18,
    priceTry: 399,
    intro: true,
  },
  {
    id: "starter",
    name: "Başlangıç",
    nameEn: "Starter",
    credits: 30,
    priceTry: 1190,
  },
  {
    id: "maker",
    name: "Üretici",
    nameEn: "Maker",
    credits: 90,
    priceTry: 3490,
  },
  {
    id: "studio",
    name: "Stüdyo",
    nameEn: "Studio",
    credits: 240,
    priceTry: 8990,
  },
  {
    id: "agency",
    name: "Ajans",
    nameEn: "Agency",
    credits: 600,
    priceTry: 21990,
  },
];

/** The video lengths offered in the pricing calculator. */
export const PICKER_SECONDS = [5, 10, 15, 20, 25, 30] as const;

/** The length the site quotes prices in ("≈ 15 adet 15 saniyelik video"). */
export const REFERENCE_SECONDS = 15;

/** Packs anyone can buy any number of times, smallest first. */
export const REGULAR_PLANS = PLANS.filter((p) => !p.intro).sort((a, b) => a.priceTry - b.priceTry);
export const INTRO_PLAN = PLANS.find((p) => p.intro)!;

/** Price of one credit in a pack, in TRY (unrounded). */
export const creditPrice = (plan: Plan) => plan.priceTry / plan.credits;

/** What a video of `seconds` costs in TRY when paid with credits from `plan`, rounded. */
export const videoPrice = (plan: Plan, seconds = REFERENCE_SECONDS) =>
  Math.round(creditPrice(plan) * (creditsForSeconds(seconds) ?? 0));

/** Cheapest and dearest price of a reference video across the regular packs. */
export function videoPriceRange(seconds = REFERENCE_SECONDS) {
  const prices = REGULAR_PLANS.map((p) => videoPrice(p, seconds));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** How much cheaper a credit is in the Intro pack than in the smallest regular pack, in whole percent. */
export function introSavingsPercent() {
  return Math.round((1 - creditPrice(INTRO_PLAN) / creditPrice(REGULAR_PLANS[0])) * 100);
}

/**
 * The cheapest regular pack that covers `credits`, and what is left over; null when even the
 * biggest pack is too small. The Intro pack is offered separately, only to first-time buyers.
 */
export function recommendPlan(credits: number) {
  const plan = REGULAR_PLANS.find((p) => p.credits >= credits);
  return plan ? { plan, left: plan.credits - credits } : null;
}

/** Ready-made mixes the calculator can fill in. */
export const EXAMPLE_MIXES: { tr: string; en: string; mix: Mix }[] = [
  { tr: "Yeni ürün testi", en: "New product test", mix: [[15, 5]] },
  { tr: "Hook testi", en: "Hook test", mix: [[5, 10]] },
  { tr: "Sezon kampanyası", en: "Seasonal campaign", mix: [[30, 3], [15, 5]] },
];

export function findPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatTry(amount: number) {
  return `${amount.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺`;
}
