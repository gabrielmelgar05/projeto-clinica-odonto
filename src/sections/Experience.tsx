"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/animations/gsap";
import { clipReveal, riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rich } from "@/components/ui/Rich";
import { experienceImages } from "@/data/technology";

/**
 * The journey as a measured timeline: a sticky, oversized stage numeral
 * rolls to each step as it crosses the centre of the screen, a ring
 * fills with overall progress and a hairline is drawn down the path.
 */
export function Experience() {
  const { dict } = useSite();
  const e = dict.experience;
  const steps = e.steps;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current });
        splitReveal(q(".exp-title")[0]);
        riseIn(q(".exp-intro"), { trigger: q(".exp-intro")[0] });

        // Progress line down the journey.
        gsap.fromTo(
          q(".exp-line-fill"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".exp-steps")[0], start: "top 60%", end: "bottom 60%", scrub: 0.5 } },
        );

        q<HTMLElement>(".exp-step").forEach((step) => {
          riseIn(step.querySelectorAll("[data-step-rise]"), { trigger: step, start: "top 78%", stagger: 0.07 });
          clipReveal(step.querySelector(".exp-frame"), { from: "left", start: "top 80%" });
          gsap.from(step.querySelector(".exp-node"), {
            scale: 0,
            duration: 0.9,
            ease: "back.out(2.5)",
            scrollTrigger: { trigger: step, start: "top 60%", once: true },
          });
        });
      });

      // Sticky numeral & ring — desktop.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const strip = q(".exp-num-strip");
        const titles = q(".exp-name-strip");
        const go = (i: number) => {
          gsap.to(strip, { yPercent: (-100 * i) / steps.length, duration: 1, ease: "expo.inOut", overwrite: true });
          gsap.to(titles, { yPercent: (-100 * i) / steps.length, duration: 0.9, ease: "expo.inOut", overwrite: true });
        };
        q<HTMLElement>(".exp-step").forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && go(i),
          });
        });
        gsap.fromTo(
          q(".exp-ring-fill"),
          { attr: { "stroke-dashoffset": 1 } },
          {
            attr: { "stroke-dashoffset": 0 },
            ease: "none",
            scrollTrigger: { trigger: q(".exp-steps")[0], start: "top 55%", end: "bottom 55%", scrub: 0.5 },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" data-theme="light" aria-labelledby="experience-title" className="relative bg-bone section-pad">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="04" className="text-graphite">
              {e.label}
            </SectionLabel>
          </div>
          <h2 id="experience-title" data-section-focus className="exp-title t-h2 col-span-12 lg:col-span-6">
            <Rich text={e.title} />
          </h2>
          <p className="exp-intro t-body col-span-12 max-w-[40ch] self-end text-pretty text-graphite md:col-span-8 lg:col-span-3">{e.intro}</p>
        </div>

        <div className="grid-12 mt-[clamp(4rem,9vw,8rem)]">
          {/* Sticky numeral */}
          <div className="col-span-5 hidden lg:block" aria-hidden="true">
            <div className="sticky top-[calc(var(--nav-h)+3rem)] flex h-[calc(100svh-var(--nav-h)-6rem)] max-h-[46rem] flex-col justify-between">
              <div className="h-[0.8em] overflow-hidden text-[clamp(10rem,19vw,19rem)] leading-[0.8] tracking-[-0.07em] text-ink">
                <div className="exp-num-strip flex flex-col">
                  {steps.map((_, i) => (
                    <span key={i} className="block h-[0.8em]">
                      0{i + 1}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <svg viewBox="0 0 100 100" className="size-24 -rotate-90 text-ink">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
                  <circle
                    className="exp-ring-fill"
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#263d4c"
                    strokeWidth="1.5"
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1}
                  />
                </svg>
                <div className="flex flex-col gap-1">
                  <span className="t-label text-graphite">{e.stage}</span>
                  <span className="block h-[1.25em] overflow-hidden text-[1.6rem] leading-[1.25em] tracking-[-0.03em]">
                    <span className="exp-name-strip flex flex-col">
                      {steps.map((s) => (
                        <span key={s.title} className="block h-[1.25em] whitespace-nowrap">
                          {s.title}
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="exp-steps relative col-span-12 lg:col-span-6 lg:col-start-7">
            <span className="absolute top-0 bottom-0 left-[0.6875rem] w-px bg-ink/12 lg:left-0" aria-hidden="true">
              <span className="exp-line-fill absolute inset-0 origin-top bg-abyss" />
            </span>

            {steps.map((step, i) => (
              <li key={step.title} className="exp-step relative pb-20 pl-12 last:pb-0 lg:min-h-[78vh] lg:pb-28 lg:pl-14">
                <span
                  className="exp-node absolute top-1.5 left-0 flex size-[1.4rem] items-center justify-center rounded-full border border-abyss/40 bg-bone lg:-left-[0.6875rem]"
                  aria-hidden="true"
                >
                  <span className="size-1.5 rounded-full bg-abyss" />
                </span>

                <p data-step-rise className="t-label flex items-center gap-3 text-graphite">
                  <span>
                    {e.stage} 0{i + 1}
                  </span>
                  <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
                  <span aria-hidden="true">0{steps.length}</span>
                </p>
                <h3 data-step-rise className="t-h3 mt-4">
                  {step.title}
                </h3>
                <p data-step-rise className="t-body mt-4 max-w-[48ch] text-pretty text-graphite">
                  {step.text}
                </p>

                <ImageSlot
                  image={experienceImages[i]}
                  bleed={0}
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="exp-frame mt-8 aspect-[3/2] rounded-[calc(var(--radius-frame)*0.85)]"
                />

                <div data-step-rise className="mt-7">
                  <p className="t-label text-graphite">{e.expect}</p>
                  <ul className="mt-3 grid gap-x-6 sm:grid-cols-3">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-3 border-t border-ink/12 py-3 text-[0.92rem] leading-snug">
                        <span className="mt-[0.55em] h-px w-3 shrink-0 bg-abyss" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
