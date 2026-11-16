import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { getDictionary } from "@/i18n";
import { LogoSymbol } from "@/components/brand/Logo";
import { Rich } from "@/components/ui/Rich";
import "./globals.css";

/**
 * 404 for any unmatched URL. It renders outside the locale layouts, so it
 * is bilingual: English first (the default language), Portuguese below.
 */
export const metadata: Metadata = {
  title: "404 — ÉTER Dental Atelier",
  description: "This page does not exist. · Esta página não existe.",
};

const versions = [
  { locale: "en", lang: "en", d: getDictionary("en").notFound },
  { locale: "pt-br", lang: "pt-BR", d: getDictionary("pt-br").notFound },
] as const;

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="relative flex min-h-[100svh] flex-col justify-between gap-16 overflow-hidden bg-ink p-[var(--gutter)] text-bone" data-theme="dark">
          <p className="t-label text-bone/50">ÉTER — Dental Atelier · 404</p>
          <div className="pointer-events-none absolute top-1/2 right-[-12vw] w-[70vmin] -translate-y-1/2 text-bone/10" aria-hidden="true">
            <LogoSymbol stroke={0.8} />
          </div>
          <div className="relative grid max-w-5xl gap-14 md:grid-cols-2">
            {versions.map(({ locale, lang, d }, i) => (
              <section key={locale} lang={lang} className="flex flex-col">
                {i === 0 ? (
                  <h1 className="t-h3 [&_.rich-em]:text-clinic-soft">
                    <Rich text={d.title} />
                  </h1>
                ) : (
                  <h2 className="t-h3 [&_.rich-em]:text-clinic-soft">
                    <Rich text={d.title} />
                  </h2>
                )}
                <p className="t-body mt-5 max-w-[36ch] text-bone/65">{d.text}</p>
                <a
                  href={`/${locale}`}
                  className="mt-8 inline-flex h-13 w-fit items-center rounded-full bg-bone px-6 font-medium text-ink transition-colors hover:bg-white"
                >
                  {d.cta}
                </a>
              </section>
            ))}
          </div>
          <p className="t-label text-bone/40">404</p>
        </main>
      </body>
    </html>
  );
}
