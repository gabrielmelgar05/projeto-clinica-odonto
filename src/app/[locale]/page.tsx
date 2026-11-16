import { notFound } from "next/navigation";
import { getDictionary, hasLocale, localeMeta } from "@/i18n";
import { siteConfig } from "@/config/site";
import { getAvailableImages } from "@/lib/images.server";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Treatments } from "@/sections/Treatments";
import { Technology } from "@/sections/Technology";
import { Experience } from "@/sections/Experience";
import { Team } from "@/sections/Team";
import { Philosophy } from "@/sections/Philosophy";
import { Atelier } from "@/sections/Atelier";
import { Faq } from "@/sections/Faq";
import { Booking } from "@/sections/Booking";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const images = getAvailableImages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    description: dict.meta.description,
    inLanguage: localeMeta[locale].htmlLang,
  };

  return (
    <SiteProvider locale={locale} dict={dict} images={images}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[120] -translate-y-[200%] rounded-full bg-ink px-5 py-3 text-sm text-bone transition-transform focus:translate-y-0"
      >
        {dict.a11y.skipToContent}
      </a>
      <Preloader />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Treatments />
        <Technology />
        <Experience />
        <Team />
        <Philosophy />
        <Atelier />
        <Faq />
        <Booking />
      </main>
      <Footer />
    </SiteProvider>
  );
}
