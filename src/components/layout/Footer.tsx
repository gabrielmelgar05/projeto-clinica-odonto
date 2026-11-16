"use client";

import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/animations/gsap";
import { riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { LogoSymbol, WORDMARK_PATHS } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Rich } from "@/components/ui/Rich";
import { navItems, siteConfig } from "@/config/site";
import { format } from "@/i18n";
import { scrollToSection } from "@/lib/scroll";

/**
 * Closing scene. The giant wordmark is drawn stroke by stroke as the page
 * reaches its end — the same construction that opened the experience.
 */
export function Footer() {
  const { dict } = useSite();
  const f = dict.footer;
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        splitReveal(q(".ft-headline")[0]);
        riseIn(q(".ft-cta"), { trigger: q(".ft-headline")[0], delay: 0.2 });
        riseIn(q(".ft-col"), { trigger: q(".ft-cols")[0], stagger: 0.08 });
        gsap.from(q(".ft-rule"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".ft-cols")[0], start: "top 90%", once: true },
        });

        // Wordmark drawn by the scroll.
        const strokes = q(".ft-word path");
        gsap.fromTo(
          strokes,
          { attr: { "stroke-dashoffset": 1 } },
          {
            attr: { "stroke-dashoffset": 0 },
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: q(".ft-word")[0], start: "top 98%", end: "bottom bottom", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          q(".ft-symbol"),
          { rotate: -90, autoAlpha: 0 },
          { rotate: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: q(".ft-word")[0], start: "top 98%", end: "bottom bottom", scrub: 0.8 } },
        );
      });
      // Without motion the wordmark is simply shown complete.
      mm.add(MQ.reduced, () => {
        gsap.set(q(".ft-word path"), { attr: { "stroke-dashoffset": 0 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} data-theme="dark" className="relative overflow-hidden bg-ink text-bone">
      <div className="shell">
        <span className="ft-rule block h-px bg-bone/12" aria-hidden="true" />

        {/* Closing statement */}
        <div className="grid-12 items-end gap-y-8 pt-[clamp(4rem,8vw,7rem)]">
          <p className="ft-headline t-h2 col-span-12 lg:col-span-8 [&_.rich-em]:text-clinic-soft">
            <Rich text={f.headline} />
          </p>
          <div className="ft-cta col-span-12 flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
            <Button href="#contact" section="contact" variant="bone" size="lg">
              {f.cta}
            </Button>
            <button
              type="button"
              onClick={() => scrollToSection("top")}
              className="group flex size-[3.75rem] items-center justify-center rounded-full border border-bone/20 transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink"
              aria-label={dict.a11y.backToTop}
            >
              <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Columns */}
        <div className="ft-cols grid-12 mt-[clamp(4rem,8vw,6rem)] gap-y-10 border-t border-bone/10 pt-10">
          <nav aria-label={dict.a11y.footerNav} className="ft-col col-span-6 md:col-span-3">
            <p className="t-label text-bone/45">{f.navigate}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {navItems.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    className="link-line text-[0.95rem] text-bone/80 hover:text-bone"
                  >
                    {dict.nav.items[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft-col col-span-6 md:col-span-3">
            <p className="t-label text-bone/45">{f.visit}</p>
            <address className="mt-4 text-[0.95rem] whitespace-pre-line text-bone/80 not-italic">{f.address}</address>
            <p className="t-label mt-5 text-bone/45">{dict.booking.hours}</p>
            <p className="mt-2 text-[0.9rem] whitespace-pre-line text-bone/70">{dict.booking.hoursValue}</p>
          </div>

          <div className="ft-col col-span-6 md:col-span-3">
            <p className="t-label text-bone/45">{f.contact}</p>
            <ul className="mt-4 flex flex-col gap-2 text-[0.95rem] text-bone/80">
              <li>
                <a className="link-line" href={siteConfig.contact.phoneHref}>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a className="link-line break-all" href={siteConfig.contact.emailHref}>
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <p className="t-label mt-6 text-bone/45">{f.follow}</p>
            <ul className="mt-3 flex flex-col gap-2 text-[0.95rem] text-bone/80">
              {siteConfig.social.map((s) => (
                <li key={s.id}>
                  <a className="group inline-flex items-center gap-1.5" href={s.href} target="_blank" rel="noopener noreferrer">
                    <span className="link-line">{s.label}</span>
                    <ArrowUpRight className="size-3.5 opacity-60 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.6} aria-hidden="true" />
                    <span className="sr-only">{dict.a11y.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-col col-span-6 flex flex-col gap-4 md:col-span-3">
            <p className="t-label text-bone/45">{f.language}</p>
            <LanguageSwitcher tone="dark" className="w-fit" />
            <p className="mt-4 max-w-[34ch] text-[0.8rem] leading-relaxed text-bone/45">{f.demoNotice}</p>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="shell mt-[clamp(3.5rem,7vw,6rem)]" aria-hidden="true">
        <div className="relative flex items-end gap-[3vw]">
          <div className="ft-symbol w-[19vw] shrink-0 text-clinic-soft">
            <LogoSymbol stroke={1.6} />
          </div>
          <svg viewBox="-3 -23 140 66" className="ft-word block h-auto w-0 min-w-0 flex-1 overflow-visible text-bone" fill="none" stroke="currentColor" strokeWidth={0.9} strokeLinecap="butt" strokeLinejoin="miter">
            {[WORDMARK_PATHS.e1, WORDMARK_PATHS.t, WORDMARK_PATHS.e2, WORDMARK_PATHS.r, WORDMARK_PATHS.accent].map((d) => (
              <path key={d} d={d} pathLength={1} strokeDasharray="1 2" />
            ))}
          </svg>
        </div>
      </div>

      {/* Legal line */}
      <div className="shell mt-10 flex flex-col gap-3 border-t border-bone/10 py-7 text-[0.8rem] text-bone/45 sm:flex-row sm:items-center sm:justify-between">
        <p>{format(f.rights, { year })}</p>
        <p>
          {f.credit} —{" "}
          {siteConfig.credit.href ? (
            <a href={siteConfig.credit.href} target="_blank" rel="noopener noreferrer" className="link-line text-bone/70">
              {siteConfig.credit.label}
            </a>
          ) : (
            <span className="text-bone/70">{siteConfig.credit.label}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
