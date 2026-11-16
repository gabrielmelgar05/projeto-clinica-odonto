"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, SplitText, useGSAP, MQ } from "@/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Button } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CornerMarks, Dimension } from "@/components/ui/CornerMarks";
import { LogoSymbol } from "@/components/brand/Logo";
import { scrollToSection } from "@/lib/scroll";

export function Hero() {
  const { dict, phase } = useSite();
  const h = dict.hero;
  const root = useRef<HTMLElement>(null);

  // Entrance — starts the instant the preloader begins to split open.
  useGSAP(
    () => {
      if (phase === "loading") return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };

        if (!motion) {
          gsap.from(q("[data-hero-fade]"), { autoAlpha: 0, duration: 0.6, stagger: 0.04 });
          return;
        }

        // Split each headline line on its own so the line spans (and their
        // indents / scroll offsets) stay in place while the masks animate.
        const lines = q(".hero-title > span");
        const frame = q(".hero-frame")[0];
        const media = frame?.querySelector("[data-slot-media]");
        const split = SplitText.create(lines, { type: "lines", mask: "lines", linesClass: "split-line" });

        const tl = gsap.timeline({
          delay: 0.2,
          // Hand the headline back to natural text flow once it has landed.
          onComplete: () => split.revert(),
        });

        tl.from(split.lines, { yPercent: 118, rotate: 3, transformOrigin: "0% 0%", duration: 1.75, stagger: 0.12, ease: "expo.out" }, 0)
          // The photo opens from its horizon — the same gesture as the preloader.
          .fromTo(frame, { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.inOut", clearProps: "clipPath" }, 0)
          .fromTo(media ?? [], { scale: 1.4 }, { scale: 1, duration: 2.4, ease: "expo.out" }, 0.15)
          .from(q("[data-hero-rise]"), { y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.07, ease: "expo.out" }, 0.55)
          .from(q(".hero-badge"), { scale: 0.4, rotate: -120, autoAlpha: 0, duration: 1.6, ease: "expo.out" }, 0.8)
          .from(q(".hero-marks"), { autoAlpha: 0, scale: 1.06, duration: 1.2, ease: "expo.out" }, 1)
          .from(q(".hero-chip"), { y: 24, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 1.1)
          .from(q("[data-dim-line]"), { scaleX: 0, duration: 1.2, ease: "expo.inOut", stagger: 0.1 }, 1.1);

        // Ambient motion.
        gsap.to(q(".hero-badge-ring"), { rotation: 360, duration: 28, repeat: -1, ease: "none", svgOrigin: "50 50" });
        gsap.fromTo(q(".hero-scroll-dot"), { yPercent: -100 }, { yPercent: 340, duration: 1.8, repeat: -1, ease: "power2.inOut" });

        // Scroll-linked: the photo drifts, the headline lines part ways.
        gsap.to(media ?? [], {
          yPercent: 9,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        if (desktop) {
          gsap.to(q(".hero-title > span:nth-child(1)"), {
            xPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to(q(".hero-title > span:nth-child(2)"), {
            xPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to(q(".hero-badge"), {
            yPercent: 60,
            rotate: 40,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [phase === "loading"] },
  );

  return (
    <section
      ref={root}
      id="top"
      data-theme="light"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-bone pt-[calc(var(--nav-h)+1.75rem)] lg:pt-[calc(var(--nav-h)+2.5rem)]"
    >
      <div className="shell">
        {/* Meta row */}
        <div className="grid-12 items-start gap-y-3 text-graphite">
          <div data-hero-rise data-hero-fade className="col-span-7 lg:col-span-4">
            <SectionLabel index="00">{h.index}</SectionLabel>
          </div>
          <p data-hero-rise data-hero-fade className="t-label hidden lg:col-span-3 lg:col-start-6 lg:block">
            {h.location}
          </p>
          <p data-hero-rise data-hero-fade className="t-label col-span-5 text-right whitespace-pre-line lg:col-span-3 lg:col-start-10">
            {h.schedule}
          </p>
        </div>

        {/* Headline */}
        <div className="relative mt-[clamp(1.75rem,5.5vh,4rem)]">
          <h1
            id="hero-title"
            data-hero-fade
            className="hero-title text-[12.4vw] leading-[0.9] tracking-[-0.05em] text-ink sm:text-[11vw] lg:text-[7.5vw] 2xl:text-[min(7.5vw,9.75rem)] lg:[&>span:first-child]:pl-[16.6667%]"
          >
            <Rich text={h.headline} />
          </h1>

          {/* Seal — rotating annotation that also scrolls to the next chapter */}
          <button
            type="button"
            onClick={() => scrollToSection("about")}
            aria-label={dict.a11y.scrollDown}
            data-hero-fade
            className="hero-badge group absolute top-[-0.5rem] right-0 hidden size-[clamp(7rem,9.5vw,9.5rem)] items-center justify-center rounded-full text-ink lg:flex"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
              <defs>
                <path id="hero-badge-path" d="M50 50 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
              </defs>
              <g className="hero-badge-ring">
                <text className="fill-current font-mono text-[7.4px] tracking-[0.12em] uppercase">
                  <textPath href="#hero-badge-path" textLength={248} lengthAdjust="spacing">
                    {h.badge}
                  </textPath>
                </text>
              </g>
              <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeOpacity="0.15" />
            </svg>
            <span className="relative flex size-12 items-center justify-center rounded-full bg-ink text-bone transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-110">
              <ArrowDown className="size-4 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0.5" strokeWidth={1.6} />
            </span>
          </button>
        </div>

        {/* Lower composition */}
        <div className="grid-12 mt-[clamp(1.75rem,4.5vh,3.25rem)] gap-y-9 pb-12 lg:pb-16">
          <div className="col-span-12 flex flex-col lg:col-span-4 lg:pr-4">
            <p data-hero-rise data-hero-fade className="t-body max-w-[40ch] text-pretty text-graphite">
              {h.subheadline}
            </p>
            <div data-hero-rise data-hero-fade className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="#contact" section="contact" size="lg">
                {h.primaryCta}
              </Button>
              <Button href="#treatments" section="treatments" variant="line" size="lg" icon="down">
                {h.secondaryCta}
              </Button>
            </div>

            <div data-hero-rise data-hero-fade className="mt-auto hidden flex-col gap-8 pt-12 text-graphite lg:flex">
              <Dimension label={h.dimension} />
              <div className="flex items-center gap-4" aria-hidden="true">
                <span className="relative block h-12 w-px overflow-hidden bg-ink/12">
                  <span className="hero-scroll-dot absolute inset-x-0 top-0 h-1/4 bg-ink" />
                </span>
                <span className="t-label">{h.scroll}</span>
              </div>
            </div>
          </div>

          <div className="relative col-span-12 lg:col-span-8">
            <ImageSlot
              image="hero"
              priority
              bleed={9}
              sizes="(min-width: 1024px) 64vw, 100vw"
              className="hero-frame aspect-[4/5] rounded-[var(--radius-frame)] sm:aspect-[16/10] lg:aspect-auto lg:h-[clamp(23rem,54vh,42rem)]"
            >
              <CornerMarks className="hero-marks inset-4 text-bone/45 sm:inset-5" />
              <p className="t-label absolute top-6 left-6 z-[1] text-bone/75 sm:top-7 sm:left-8">{h.figure}</p>

              <div className="hero-chip absolute right-4 bottom-12 left-4 z-[1] flex items-center gap-4 rounded-2xl bg-ink/35 p-3.5 pr-5 text-bone ring-1 ring-bone/15 backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[22rem]">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-bone/10">
                  <LogoSymbol className="w-7" stroke={4.5} />
                </span>
                <span className="flex flex-col">
                  <span className="text-[0.95rem] font-medium tracking-[-0.01em]">{h.chipTitle}</span>
                  <span className="text-[0.85rem] text-bone/70">{h.chipText}</span>
                </span>
              </div>
            </ImageSlot>
          </div>
        </div>
      </div>
    </section>
  );
}
