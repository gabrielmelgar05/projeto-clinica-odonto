import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, localeMeta, locales } from "@/i18n";
import { siteConfig } from "@/config/site";
import { fontVariables } from "../fonts";
import "../globals.css";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const d = getDictionary(locale);
  const other = locales.filter((l) => l !== locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: d.meta.title,
    description: d.meta.description,
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt-br",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: siteConfig.name,
      title: d.meta.ogTitle,
      description: d.meta.ogDescription,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: other.map((l) => localeMeta[l].ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: d.meta.ogTitle,
      description: d.meta.ogDescription,
    },
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables}>
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
