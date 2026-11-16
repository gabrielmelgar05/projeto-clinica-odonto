"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rich } from "@/components/ui/Rich";
import { LogoSymbol } from "@/components/brand/Logo";

/**
 * Manifesto. The page darkens from paper to ink as the section arrives;
 * then, held in place by CSS sticky, the statement lights up word by word
 * while the brand symbol turns and a photograph opens inside its orbit.
 */
export function Philosophy() {
  const { dict } = useSite();
  const p = dict.philosophy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        // Paper → ink as the chapter enters.
        gsap.fromTo(
          root.current,
          { backgroundColor: "#f7f7f5", color: "#101112" },
          {
            backgroundColor: "#101112",
            color: "#f7f7f5",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 20%", scrub: true },
          },
        );

        const statement = q(".ph-statement")[0];
        const scrubRange = desktop
          ? { trigger: q(".ph-track")[0], start: "top top", end: "bottom bottom" }
          : { trigger: statement, start: "top 85%", end: "bottom 40%" };

        SplitText.create(statement, {
          type: "words",
          wordsClass: "split-word",
          autoSplit: true,
          aria: "auto",
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                stagger: 0.12,
                ease: "none",
                scrollTrigger: { ...scrubRange, end: desktop ? "70% bottom" : scrubRange.end, scrub: 0.6 },
              },
            );
          },
        });

        gsap.fromTo(
          q(".ph-symbol"),
          { rotate: -50 },
          { rotate: 10, ease: "none", scrollTrigger: { ...scrubRange, scrub: true } },
        );
        gsap.fromTo(
          q(".ph-circle"),
          { scale: 0.15, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { ...scrubRange, end: desktop ? "75% bottom" : scrubRange.end, scrub: true } },
        );
        gsap.fromTo(
          q(".ph-circle [data-slot-media]"),
          { scale: 1.6 },
          { scale: 1, ease: "none", scrollTrigger: { ...scrubRange, scrub: true } },
        );
        gsap.from(q(".ph-foot > *"), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".ph-foot")[0], start: "top 92%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="philosophy"
      data-theme="dark"
      aria-labelledby="philosophy-label"
      className="relative bg-ink text-bone"
    >
      <div className="ph-track relative lg:h-[230vh] motion-reduce:lg:h-auto">
        <div className="relative flex flex-col overflow-hidden lg:sticky lg:top-0 lg:h-screen motion-reduce:lg:static motion-reduce:lg:h-auto">
          {/* Symbol + photograph in its orbit */}
          <div
            className="ph-symbol-wrap pointer-events-none relative mx-auto mt-20 w-[78vw] max-w-[30rem] lg:absolute lg:top-1/2 lg:right-[-6vw] lg:mt-0 lg:w-[min(86vh,52vw)] lg:max-w-none lg:-translate-y-1/2"
            aria-hidden="true"
          >
            <div className="ph-circle absolute top-[11.67%] left-[11.67%] size-[76.67%] overflow-hidden rounded-full">
              <ImageSlot image="philosophy" sizes="(min-width: 1024px) 40vw, 70vw" showLabel={false} alt="" className="absolute inset-0" />
            </div>
            <div className="ph-symbol relative text-current opacity-50">
              <LogoSymbol stroke={0.5} />
            </div>
          </div>

          <div className="shell relative z-[1] flex flex-1 flex-col justify-between gap-12 pt-16 pb-[clamp(5rem,10vw,7rem)] lg:pt-[calc(var(--nav-h)+3rem)] lg:pb-14">
            <SectionLabel as="h2" id="philosophy-label" index="06" className="opacity-70">
              {p.label}
            </SectionLabel>

            <p data-section-focus className="ph-statement max-w-[13ch] text-[clamp(3rem,8.4vw,9.5rem)] leading-[0.92] tracking-[-0.05em] [&_.rich-em]:text-clinic-soft">
              <Rich text={p.statement} />
            </p>

            <div className="ph-foot flex flex-col gap-4 sm:max-w-[44ch]">
              <p className="t-body text-pretty opacity-70">{p.body}</p>
              <p className="t-label opacity-60">{p.signature}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
