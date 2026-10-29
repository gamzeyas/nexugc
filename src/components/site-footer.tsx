"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { LEGAL_PAGES } from "@/lib/site";
import { Logo } from "./ui";

const PRODUCT_LINKS = [
  { href: "/#nasil", tr: "Nasıl çalışır", en: "How it works" },
  { href: "/#ornekler", tr: "Örnekler", en: "Examples" },
  { href: "/#pricing", tr: "Fiyatlar", en: "Pricing" },
  { href: "/#sss", tr: "SSS", en: "FAQ" },
];

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 text-[13px] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Link href="/" aria-label={t("NexUGC ana sayfa", "NexUGC home")} className="inline-block">
            <Logo size="sm" />
          </Link>
          <p className="max-w-xs leading-relaxed text-muted">
            {t(
              "Meta reklamı veren e-ticaret yapan işletmeler için yapay zeka UGC videoları.",
              "AI UGC videos for e-commerce businesses running Meta ads.",
            )}
          </p>
        </div>
        <nav aria-label={t("Ürün", "Product")} className="space-y-2.5">
          <p className="font-semibold text-paper">{t("Ürün", "Product")}</p>
          <ul className="space-y-2 text-muted">
            {PRODUCT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">
                  {t(l.tr, l.en)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("Yasal", "Legal")} className="space-y-2.5">
          <p className="font-semibold text-paper">{t("Yasal", "Legal")}</p>
          <ul className="space-y-2 text-muted">
            {LEGAL_PAGES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">
                  {t(l.tr, l.en)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[12px] text-faint">© 2026 NexUGC</p>
      </div>
    </footer>
  );
}
