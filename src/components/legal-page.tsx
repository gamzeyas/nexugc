"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { LEGAL_DOCS } from "@/lib/legal";
import { SiteFooter } from "./site-footer";
import { LangSwitch, Logo } from "./ui";

/** Plain text page for the legal documents in src/lib/legal.ts. */
export function LegalPage({ slug }: { slug: keyof typeof LEGAL_DOCS }) {
  const { t } = useLang();
  const doc = LEGAL_DOCS[slug];
  return (
    <div className="grain relative min-h-screen bg-ink text-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link href="/" aria-label={t("NexUGC ana sayfa", "NexUGC home")}>
            <Logo size="md" />
          </Link>
          <LangSwitch />
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-3xl px-5 py-16">
        {process.env.NODE_ENV === "development" && (
          <p className="mb-8 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            Bu metin taslaktır, yayından önce hukuki kontrolden geçirilmelidir.
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{t(...doc.title)}</h1>
        <div className="mt-10 space-y-9">
          {doc.sections.map((s) => (
            <section key={s.heading[0]} className="space-y-2.5">
              <h2 className="font-display text-lg font-semibold">{t(...s.heading)}</h2>
              {s.body.map((line) => (
                <p key={line[0]} className="text-[15px] leading-relaxed text-muted">
                  {t(...line)}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
