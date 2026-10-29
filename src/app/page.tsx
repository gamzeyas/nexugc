"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Minus, Play, Plus } from "lucide-react";
import { Badge, Eyebrow, LangSwitch, Logo, PhoneFrame, SectionHeading, primaryBtn, secondaryBtn } from "@/components/ui";
import { PricingPlans } from "@/components/pricing-plans";
import { ShowcaseVideo } from "@/components/showcase-video";
import { SiteFooter } from "@/components/site-footer";
import { useLang } from "@/lib/i18n";
import { creditsForSeconds, formatTry, INTRO_PLAN, REFERENCE_SECONDS, videoPrice, videoPriceRange } from "@/lib/pricing";
import { INFLUENCER_PRESETS } from "@/lib/presets";
import { checkScript, MAX_WORDS, MIN_WORDS } from "@/lib/script-limits";
import { useIntroUsed } from "@/lib/use-intro-used";
import { cn } from "@/lib/utils";

/** Real outputs from our own pipeline (public/showcase), only resized and loudness-matched. */
const HERO_VIDEOS = [
  { src: "/showcase/video-serum.mp4", poster: "/showcase/ugc-serum-bath.jpg", tr: "Cilt bakımı", en: "Skincare" },
  { src: "/showcase/video-coffee.mp4", poster: "/showcase/ugc-coffee-kitchen.jpg", tr: "Kahve", en: "Coffee" },
  { src: "/showcase/video-sneaker.mp4", poster: "/showcase/ugc-sneaker-steps.jpg", tr: "Ayakkabı", en: "Sneakers" },
];

/** The first card is the input photo, the rest are real outputs (video with its own poster frame). */
const GALLERY: { poster: string; video?: string; tr: string; en: string; input?: boolean }[] = [
  { poster: "/showcase/product-serum.jpg", tr: "Girdi: telefonla çekilmiş ürün fotoğrafı", en: "Input: a phone photo of the product", input: true },
  { poster: "/showcase/ugc-serum-bath.jpg", video: "/showcase/video-serum.mp4", tr: "Banyo, sabah ışığı", en: "Bathroom, morning light" },
  { poster: "/showcase/ugc-serum-bed.jpg", video: "/showcase/video-serum-bed.mp4", tr: "Akşam, yatak odası", en: "Evening, bedroom" },
  { poster: "/showcase/ugc-coffee-car.jpg", video: "/showcase/video-coffee-car.mp4", tr: "Araba içi selfie", en: "In-car selfie" },
  { poster: "/showcase/ugc-coffee-kitchen.jpg", video: "/showcase/video-coffee.mp4", tr: "Mutfak", en: "Kitchen" },
  { poster: "/showcase/ugc-sneaker-steps.jpg", video: "/showcase/video-sneaker.mp4", tr: "Kadıköy, apartman merdiveni", en: "Istanbul, front steps" },
];

const EXAMPLE_SCRIPT = {
  tr: "Bu serumun dokusuna bir bak, ne kadar hafif. Pompası da çok pratik, tek dokunuşta yeterli miktar geliyor.",
  en: "Look at the texture of this serum, it's so light. The pump is really handy too, one press gives you just enough.",
};
// The counter is computed the same way the create screen and the server price a script.
const exampleCheck = checkScript(EXAMPLE_SCRIPT.tr);

const range15 = videoPriceRange();
const intro15 = videoPrice(INTRO_PLAN);
const credits15 = creditsForSeconds(REFERENCE_SECONDS);

export default function Landing() {
  const { t } = useLang();
  const introUsed = useIntroUsed();
  const [gender, setGender] = useState<"female" | "male">("female");
  const femaleCount = INFLUENCER_PRESETS.filter((p) => p.gender === "female").length;
  const maleCount = INFLUENCER_PRESETS.length - femaleCount;
  const priceRange = `${range15.min}–${formatTry(range15.max)}`;

  const loop = [
    {
      n: "01",
      title: t("Test edeceğin ürünü seç", "Pick the product to test"),
      body: t(
        "Elinde bir ürün fotoğrafı olması yeterli. Numune göndermek, çekim günü ayarlamak yok.",
        "A product photo is all you need. No samples to ship, no shoot day to book.",
      ),
    },
    {
      n: "02",
      title: t("3–5 farklı kreatif üret", "Make 3–5 different creatives"),
      body: t(
        `Farklı yüz, farklı mekan, farklı ilk cümle. Her biri ayrı bir açı; ${REFERENCE_SECONDS} saniyelik bir video ${credits15} kredi.`,
        `Different face, setting and opening line. Each one a separate angle; a ${REFERENCE_SECONDS}-second video is ${credits15} credits.`,
      ),
    },
    {
      n: "03",
      title: t("Meta'da aynı reklam setinde yayınla", "Run them in the same Meta ad set"),
      body: t(
        "Bütçeyi bölüştür, birkaç gün bekle. Hangi ürünün ve hangi açının sattığını reklam yöneticisi gösterir.",
        "Split the budget and wait a few days. Ads Manager shows which product and angle sells.",
      ),
    },
    {
      n: "04",
      title: t("Kazananı büyüt, gerisini kapat", "Scale the winner, cut the rest"),
      body: t(
        "Tutan ürün için yeni varyasyonlar üret, kreatif yorulmadan yenile.",
        "Make fresh variations for the product that works, before the creative wears out.",
      ),
    },
  ];

  const compare = [
    {
      k: t("15 saniyelik bir video ne kadara çıkar?", "Cost of a 15 s video"),
      them: t("Genelde birkaç bin TL", "Usually a few thousand TL"),
      us: t(
        `${priceRange} (Tanışma'da ${formatTry(intro15)})`,
        `${priceRange} (${formatTry(intro15)} with Intro)`,
      ),
    },
    { k: t("Ne zaman elinde olur?", "Turnaround"), them: t("1–2 hafta", "1–2 weeks"), us: t("Birkaç dakika", "A few minutes") },
    {
      k: t("Ürünü göndermek gerekir mi?", "Ship the product?"),
      them: t("Evet, kargo + bekleme", "Yes, shipping + waiting"),
      us: t("Hayır, fotoğraf yeterli", "No, a photo is enough"),
    },
    {
      k: t("Başka bir açılış cümlesi denemek", "Trying a different hook"),
      them: t("Yeni çekim, yeni ücret", "New shoot, new fee"),
      us: t(
        `Yeni senaryo, ${REFERENCE_SECONDS} sn için ${priceRange}`,
        `New script, ${priceRange} for ${REFERENCE_SECONDS} s`,
      ),
    },
    {
      k: t("Aynı ürün, farklı yüz", "Same product, different face"),
      them: t("Yeni influencer bulmak", "Find another creator"),
      us: t(`${INFLUENCER_PRESETS.length} hazır karakterden seç`, `Pick from ${INFLUENCER_PRESETS.length} ready-made characters`),
    },
  ];

  const uses = [
    {
      title: t("Yeni ürün testi", "New product test"),
      body: t(
        "Stok almadan önce 3 ürünü aynı hafta reklama çıkar. Talebi tahmin etme, ölç.",
        "Put 3 products into ads in the same week before buying stock. Don't guess demand, measure it.",
      ),
    },
    {
      title: t("Hook testi", "Hook test"),
      body: t(
        "\"Kargo geldi, açıyorum\" mu, \"Bunu herkes yanlış kullanıyor\" mu? Aynı ürünü farklı ilk cümlelerle dene.",
        "\"Package just arrived\" or \"Everyone uses this wrong\"? Test the same product with different first lines.",
      ),
    },
    {
      title: t("Kreatif yorgunluğu", "Creative fatigue"),
      body: t(
        "Aynı videoyu çok gören kitle artık tıklamaz. Frekans artıp CTR düştüğünde yeni yüz ve yeni mekanla aynı mesajı tazele.",
        "People who've seen the same video too often stop clicking. When frequency climbs and CTR drops, refresh the same message with a new face and setting.",
      ),
    },
    {
      title: t("Kampanya ve sezon", "Campaigns & seasons"),
      body: t(
        "Efsane Cuma, Anneler Günü, okula dönüş. Takvime göre senaryoyu değiştir, aynı gün yayına al.",
        "Black Friday, Mother's Day, back to school. Swap the script for the calendar and ship the same day.",
      ),
    },
  ];

  // Ordered by what most affects the decision to buy.
  const faqs = [
    {
      q: t("Bu videoları Meta reklamlarında kullanabilir miyim?", "Can I use these in Meta ads?"),
      a: t(
        "Evet. Videolar 9:16 dikey; Reels, Stories ve TikTok formatına uygun. Meta, gerçekçi yapay zeka içeriği barındıran bazı reklamlarda bunu belirtmeni isteyebilir; yayınlamadan önce güncel reklam politikasına göz at. Videolarda kanıtlanmamış bir iddia belirtme; bu Meta kurallarına takılabilir.",
        "Yes. Videos are 9:16 vertical, fit for Reels, Stories and TikTok. Meta may ask you to disclose realistic AI content in some ads; check the current ad policy before publishing. Don't make unproven claims in your videos; they can break Meta's rules.",
      ),
    },
    {
      q: t("Abonelik var mı?", "Is there a subscription?"),
      a: t(
        "Yok. Tek seferlik kredi paketi alırsın, harcadıkça düşer; kalan kredi bakiyende kalır ve yeni paketle birleşir. Tanışma paketi ilk alıma özeldir ve bir kez alınabilir; diğer paketleri istediğin zaman tekrar alabilirsin. Ödeme Shopier üzerinden kredi kartıyla alınır.",
        "No. You buy a one-time credit pack and use it as you go; what's left stays and adds up with your next pack. The Intro pack is for your first purchase and can be bought once; you can buy the other packs again whenever you like. Payment is by card via Shopier.",
      ),
    },
    {
      q: t("Ödeme belgesi alıyor muyum?", "Do I get a payment receipt?"),
      a: t(
        "Evet. Her satın alımın için e-postana bir ödeme makbuzu gönderilir.",
        "Yes. A payment receipt is emailed to you for every purchase.",
      ),
    },
    {
      q: t("Video başarısız olursa ne oluyor?", "What if a video fails?"),
      a: t(
        "Kredi üretim başlarken ayrılır. Üretim teknik bir hatayla tamamlanmazsa ayrılan kredi otomatik olarak bakiyene geri döner.",
        "Credits are set aside when a video starts. If it fails for a technical reason, they go back to your balance automatically.",
      ),
    },
    {
      q: t("Videolar ne kadar uzun?", "How long are the videos?"),
      a: t(
        `5 ile 30 saniye arası. Senaryo ${MIN_WORDS}–${MAX_WORDS} kelime olmalı; yazarken sayaç tahmini süreyi ve kaç kredi tutacağını gösterir. 5 sn ${creditsForSeconds(5)} kredi, 15 sn ${creditsForSeconds(15)} kredi, 30 sn ${creditsForSeconds(30)} kredi.`,
        `Between 5 and 30 seconds. Scripts are ${MIN_WORDS}–${MAX_WORDS} words; a counter shows the estimated length and its credit cost as you type. 5 s is ${creditsForSeconds(5)} credits, 15 s is ${creditsForSeconds(15)}, 30 s is ${creditsForSeconds(30)}.`,
      ),
    },
    {
      q: t("Videolarda filigran var mı? Çözünürlük ne?", "Is there a watermark? What's the resolution?"),
      a: t(
        "Filigran yok. Videolar 768×1344 piksel, dikey 9:16 MP4 olarak hazırlanır.",
        "No watermark. Videos come as vertical 9:16 MP4 files at 768×1344 pixels.",
      ),
    },
    {
      q: t("Hangi dilde konuşuyorlar?", "What language do they speak?"),
      a: t(
        `Türkçe. ${femaleCount} kadın ve ${maleCount} erkek karakter var; her birinin kendine ait bir sesi ve konuşma tarzı var.`,
        `Turkish. There are ${femaleCount} female and ${maleCount} male characters, each with its own voice and delivery.`,
      ),
    },
    {
      q: t("İki kişilik diyalog yazabilir miyim?", "Can I write a two-person dialogue?"),
      a: t(
        "Şimdilik hayır. Her videoda tek kişi kameraya konuşur.",
        "Not yet. Each video has one person talking to camera.",
      ),
    },
  ];

  return (
    <div className="grain relative min-h-screen overflow-x-hidden bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" aria-label={t("NexUGC ana sayfa", "NexUGC home")}>
            <Logo size="md" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#nasil" className="hover:text-paper">{t("Nasıl çalışır", "How it works")}</a>
            <a href="#ornekler" className="hover:text-paper">{t("Örnekler", "Examples")}</a>
            <a href="#pricing" className="hover:text-paper">{t("Fiyatlar", "Pricing")}</a>
            <a href="#sss" className="hover:text-paper">{t("SSS", "FAQ")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <Link href="/auth" className="hidden text-sm font-medium text-muted hover:text-paper sm:block">
              {t("Giriş", "Sign in")}
            </Link>
            <Link href="/credits?plan=intro" className={cn(primaryBtn, "whitespace-nowrap px-3 py-2 sm:px-4")}>
              <span className="sm:hidden">{t(`${formatTry(INTRO_PLAN.priceTry)}'ye başla`, `Start for ${formatTry(INTRO_PLAN.priceTry)}`)}</span>
              <span className="hidden sm:inline">
                {t(`Tanışma paketi · ${formatTry(INTRO_PLAN.priceTry)}`, `Intro pack · ${formatTry(INTRO_PLAN.priceTry)}`)}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-20">
          <div className="space-y-7">
            <Eyebrow>{t("Meta reklamı veren e-ticaret yapan işletmeler için", "For e-commerce businesses running Meta ads")}</Eyebrow>
            <h1 className="font-display text-[42px] font-semibold leading-[1.02] sm:text-[58px]">
              {t("Bir ürünü test etmek için 3–5 kreatif lazım.", "Testing one product takes 3–5 creatives.")}{" "}
              <span className="text-muted">
                {t("Çekimsiz, influencersız, ", "Make them without a shoot, an influencer or ")}
                <span className="font-serif text-[1.08em] font-normal italic text-accent">{t("kargosuz üret.", "shipping.")}</span>
              </span>
            </h1>
            <p className="max-w-xl text-[17px] leading-relaxed text-muted">
              {t(
                "Ürün fotoğrafını yükle, karakteri seç, ne söyleyeceğini yaz. Birkaç dakika içinde dikey UGC videon hazır. Aynı ürünü farklı yüz ve açılışlarla çoğalt; hangisinin sattığını reklam söylesin.",
                "Upload a product photo, pick a character, write the lines. Your vertical UGC video is ready in minutes. Multiply the same product with different faces and openers, and let the ads tell you which one sells.",
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/credits?plan=intro" className={cn(primaryBtn, "h-12 px-6 text-[15px]")}>
                {t(
                  `${INTRO_PLAN.credits} krediyle başla — ${formatTry(INTRO_PLAN.priceTry)}`,
                  `Start with ${INTRO_PLAN.credits} credits — ${formatTry(INTRO_PLAN.priceTry)}`,
                )}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#ornekler" className={cn(secondaryBtn, "h-12 px-6 text-[15px]")}>
                <Play className="h-4 w-4" />
                {t("Örnekleri izle", "Watch examples")}
              </a>
            </div>
            <p className="text-[13px] text-faint">
              {t(
                "Abonelik yok · Tanışma paketi ilk satın almana özel · Ödeme Shopier güvencesiyle",
                "No subscription · Intro pack is for your first purchase · Payment secured by Shopier",
              )}
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
              {HERO_VIDEOS.map((v, i) => (
                <div key={v.src} className={cn("space-y-2", i === 1 && "-translate-y-6")}>
                  <PhoneFrame>
                    <ShowcaseVideo src={v.src} poster={v.poster} />
                  </PhoneFrame>
                  <p className="text-center font-mono text-[10px] uppercase tracking-wider text-faint">{t(v.tr, v.en)}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-[13px] text-muted">
              <span className="font-serif text-lg italic text-accent">↑</span>
              {t(
                "Bu videolar NexUGC ile üretildi, sonradan kurgu yapılmadı. Markalar kurgusaldır.",
                "Made with NexUGC, no editing afterwards. The brands are fictional.",
              )}
            </p>
          </div>
        </section>

        {/* Problem / comparison */}
        <section className="border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow={t("Asıl darboğaz", "The real bottleneck")}
              title={t("Reklamla ürün satmak zor değil. Reklam kreatifleri üretmek zor.", "Selling with ads isn't the hard part. Making the ad creatives is.")}
              lead={t(
                "Bir reklamın tutup tutmadığını çoğu zaman ilk birkaç saniye belirler. O birkaç saniyeyi denemek için her seferinde çekim yaptırmak, testi pahalı ve yavaş yapıyor.",
                "Whether an ad works is often decided in the first seconds. Paying for a new shoot every time you want to try those seconds makes testing slow and expensive.",
              )}
            />
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-line bg-surface text-[12px] font-semibold uppercase tracking-wide text-faint">
                <div className="px-4 py-3" />
                <div className="px-4 py-3">{t("Influencer ile UGC", "Creator UGC")}</div>
                <div className="px-4 py-3 text-accent">NexUGC</div>
              </div>
              {compare.map((row) => (
                <div key={row.k} className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-line text-sm last:border-b-0">
                  <div className="px-4 py-3.5 text-muted">{row.k}</div>
                  <div className="flex items-start gap-2 px-4 py-3.5 text-muted">
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
                    {row.them}
                  </div>
                  <div className="flex items-start gap-2 px-4 py-3.5 font-medium text-paper">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    {row.us}
                  </div>
                </div>
              ))}
              <p className="border-t border-line bg-surface px-4 py-2.5 text-[11px] text-faint">
                {t(
                  "Influencer ücretleri kişiye ve takipçi sayısına göre çok değişir; tablo genel bir karşılaştırmadır.",
                  "Creator fees vary a lot by person and audience; this is a general comparison.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* The loop */}
        <section id="nasil" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
          <SectionHeading
            eyebrow={t("Nasıl çalışır", "How it works")}
            title={
              <>
                {t("Testi sen yaparsın. ", "You run the test. ")}
                <span className="font-serif font-normal italic text-accent">{t("Kreatifi biz.", "We make the creative.")}</span>
              </>
            }
            lead={t(
              "Hangi ürünün tuttuğunu bize sormana gerek yok; reklam yöneticisi sana söyler. Bizim işimiz, o soruyu sorabilmen için yeterli sayıda video çıkarmak.",
              "You don't need us to tell you which product works; Ads Manager will. Our job is giving you enough videos to ask that question.",
            )}
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {loop.map((s) => (
              <li key={s.n} className="space-y-3 bg-ink p-6">
                <p className="font-mono text-xs text-accent">{s.n}</p>
                <h3 className="font-display text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>

          {/* What making one looks like, drawn from the real form */}
          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold">{t("1 · Kim anlatsın?", "1 · Who's talking?")}</p>
                <SampleTag />
              </div>
              <div className="mb-3 flex rounded-lg border border-line p-0.5 text-[12px] font-medium" role="tablist">
                {(
                  [
                    ["female", t("Kadın", "Women"), femaleCount],
                    ["male", t("Erkek", "Men"), maleCount],
                  ] as const
                ).map(([g, label, count]) => (
                  <button
                    key={g}
                    type="button"
                    role="tab"
                    aria-selected={gender === g}
                    onClick={() => setGender(g)}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 tabular-nums transition-colors",
                      gender === g ? "bg-paper text-ink" : "text-muted hover:text-paper",
                    )}
                  >
                    {label} · {count}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {INFLUENCER_PRESETS.filter((p) => p.gender === gender).map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.avatarUrl} alt={p.name} className="aspect-square w-full rounded-md object-cover opacity-80" />
                ))}
              </div>
              <p className="mt-4 text-[12px] text-faint">
                {t(`${INFLUENCER_PRESETS.length} karakter, her birinin kendi sesi`, `${INFLUENCER_PRESETS.length} characters, each with its own voice`)}
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold">{t("2 · Ürün ve sahne", "2 · Product & scene")}</p>
                <SampleTag />
              </div>
              <div className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/showcase/product-serum.jpg" alt="" className="h-28 w-24 rounded-md object-cover" />
                <ul className="flex flex-wrap content-start gap-2">
                  {[t("Banyo", "Bathroom"), t("Elinde tutuyor", "Holding it"), t("Doğal ışık", "Natural light")].map((c, i) => (
                    <li
                      key={c}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-[12px]",
                        i < 2 ? "border-accent bg-accent-soft text-accent" : "border-line-strong bg-ink text-paper/80",
                      )}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-[12px] text-faint">{t("Telefonla çektiğin ürün fotoğrafı yeterli", "A phone photo of the product is enough")}</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold">{t("3 · Ne söylesin?", "3 · What do they say?")}</p>
                <SampleTag />
              </div>
              <div className="rounded-lg border border-line bg-ink p-3 text-[13px] leading-relaxed text-paper/90">
                {t(EXAMPLE_SCRIPT.tr, EXAMPLE_SCRIPT.en)}
              </div>
              <p className="mt-3 text-right font-mono text-[11px] text-ok">
                {exampleCheck.words} / {MAX_WORDS} · ~{exampleCheck.seconds} {t("sn", "s")} · {exampleCheck.credits} {t("kredi", "credits")}
              </p>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-y border-line bg-surface/50">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <SectionHeading
              eyebrow={t("Ne için kullanılıyor", "What it's for")}
              title={t("Reklam hesabında her hafta karşına çıkan dört durum", "Four situations you hit in your ad account every week")}
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {uses.map((u, i) => (
                <div key={u.title} className="flex gap-5 rounded-[var(--radius-card)] border border-line bg-ink p-6">
                  <span className="font-display text-3xl font-semibold text-line-strong">{i + 1}</span>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold">{u.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{u.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="ornekler" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("Örnekler", "Examples")}
              title={t("Stüdyo değil, birinin evi.", "Not a studio. Someone's home.")}
              lead={t(
                "UGC'nin işe yaramasının sebebi sıradan görünmesi. Sahneler de öyle: banyo, mutfak, araba, kapı önü.",
                "UGC works because it looks ordinary. So do the scenes: bathroom, kitchen, car, doorstep.",
              )}
            />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {GALLERY.map((g) => (
              <figure key={g.poster} className="space-y-2">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-card)] border border-line">
                  {g.video ? (
                    <ShowcaseVideo src={g.video} poster={g.poster} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.poster} alt={t(g.tr, g.en)} loading="lazy" className="h-full w-full object-cover" />
                  )}
                  <Badge tone={g.input ? "paper" : "neutral"} className={cn("absolute left-2.5 top-2.5", !g.input && "bg-ink/75 text-paper")}>
                    {g.input ? t("Girdi", "Input") : t("NexUGC çıktısı", "NexUGC output")}
                  </Badge>
                </div>
                <figcaption className={cn("text-[12px]", g.input ? "text-paper" : "text-faint")}>{t(g.tr, g.en)}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-y border-line bg-surface/50">
          <div className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
            <SectionHeading
              eyebrow={t("Fiyatlar", "Pricing")}
              title={t("Videonun süresi kadar ödersin. Abonelik yok.", "Pay for the length you make. No subscription.")}
              lead={t(
                `Kredi al, istediğin uzunlukta videoya harca. 5 saniyelik video ${creditsForSeconds(5)}, 15 saniyelik video ${creditsForSeconds(15)} kredi. 15 saniyeden uzun videolarda üretim daha fazla işlem gerektirdiği için kredi oranı biraz artar. Üretim teknik bir hatayla tamamlanmazsa kredi otomatik geri döner.`,
                `Buy credits, spend them on any video length. A 5-second video costs ${creditsForSeconds(5)} credits, a 15-second video ${creditsForSeconds(15)}. Videos longer than 15 seconds take more processing, so the credit rate rises slightly. If a generation fails for a technical reason, your credits come back automatically.`,
              )}
            />
            <div className="mt-12">
              <PricingPlans
                introUsed={introUsed}
                action={(plan) => (
                  <Link
                    href={`/credits?plan=${plan.id}`}
                    className={cn(plan.intro ? primaryBtn : secondaryBtn, "w-full justify-center")}
                  >
                    {plan.intro ? t("Tanışma paketini al", "Get the Intro pack") : t("Satın al", "Buy")}
                  </Link>
                )}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="sss" className="mx-auto grid max-w-6xl scroll-mt-20 gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={t("SSS", "FAQ")} title={t("Sık sorulanlar", "Common questions")} />
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="flex flex-col items-start justify-between gap-8 rounded-[var(--radius-card)] border border-line bg-surface p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-xl space-y-3">
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {t("Bu hafta test edeceğin ürünü düşün.", "Think of the product you'll test this week.")}
              </h2>
              <p className="text-muted">
                {t(
                  "3–5 farklı video çıkar, aynı reklam setine koy. Birkaç gün içinde hangisinin sattığını reklam yöneticisinde görürsün.",
                  "Make 3–5 different videos and put them in the same ad set. Within a few days Ads Manager shows you which one sells.",
                )}
              </p>
            </div>
            <Link href="/credits?plan=intro" className={cn(primaryBtn, "h-12 px-6 text-[15px]")}>
              {t(`Tanışma paketiyle başla — ${formatTry(INTRO_PLAN.priceTry)}`, `Start with the Intro pack — ${formatTry(INTRO_PLAN.priceTry)}`)}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Marks the demo cards as a picture of the form, not something to fill in here. */
function SampleTag() {
  const { t } = useLang();
  return (
    <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
      {t("Örnek ekran", "Sample screen")}
    </span>
  );
}
