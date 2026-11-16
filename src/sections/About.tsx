"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/animations/gsap";
import { clipReveal, parallax, riseIn, scrubWords, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Dimension } from "@/components/ui/CornerMarks";

export function About() {
  const { dict } = useSite();
  const a = dict.about;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current, start: "top 80%" });
        // The statement "comes into focus" word by word as you read it.
        scrubWords(q(".about-statement")[0], { start: "top 80%", end: "bottom 55%" });

        clipReveal(q(".about-img-a")[0], { from: "bottom" });
        clipReveal(q(".about-img-b")[0], { from: "right", start: "top 92%" });
        parallax(q(".about-img-a [data-slot-media]")[0], { trigger: q(".about-img-a")[0], amount: 8 });
        parallax(q(".about-img-b [data-slot-media]")[0], { trigger: q(".about-img-b")[0], amount: 10 });
        // Detail photo floats at a different speed than the column it sits in.
        gsap.fromTo(
          q(".about-float"),
          { y: 40 },
          { y: -50, ease: "none", scrollTrigger: { trigger: q(".about-float")[0], start: "top bottom", end: "bottom top", scrub: true } },
        );

        riseIn(q(".about-support"), { trigger: q(".about-support")[0] });
        gsap.from(q(".about-rule"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.4,
          stagger: 0.12,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".about-principles")[0], start: "top 85%", once: true },
        });
        riseIn(q(".about-principle"), { trigger: q(".about-principles")[0], start: "top 85%", stagger: 0.1, y: 20 });
        riseIn(q(".about-links > *"), { trigger: q(".about-links")[0] });

        splitReveal(q(".about-quote")[0], { by: "words", stagger: 0.05 });
        gsap.from(q(".about-quote-dim [data-dim-line]"), {
          scaleX: 0,
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".about-quote")[0], start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-theme="light" aria-labelledby="about-heading" className="relative bg-bone section-pad">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel as="h2" id="about-heading" index="01" className="text-graphite">
              {a.label}
            </SectionLabel>
          </div>
          <p data-section-focus className="about-statement t-lead col-span-12 text-pretty text-ink lg:col-span-9">
            {/* First-line indent as a real element (text-indent would leak into split words). */}
            <span className="hidden lg:inline-block lg:w-[16%]" aria-hidden="true" />
            {a.statement}
          </p>
        </div>

        <div className="grid-12 mt-[clamp(4rem,10vw,9rem)] items-start gap-y-16">
          {/* Large reception photograph */}
          <div className="relative col-span-12 md:col-span-6 lg:col-span-5">
            <figure>
              <ImageSlot
                image="aboutReception"
                bleed={9}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="about-img-a aspect-[4/5] rounded-[var(--radius-frame)]"
              />
              <figcaption className="t-label mt-4 flex justify-between text-graphite">
                <span>{a.figureA}</span>
                <span aria-hidden="true">— 01</span>
              </figcaption>
            </figure>

            {/* Detail photograph layered over the corner of the main frame */}
            <figure className="about-float relative mt-10 ml-auto w-[72%] md:w-[80%] lg:absolute lg:right-[-22%] lg:bottom-[-14%] lg:mt-0 lg:w-[64%]">
              <div className="rounded-[calc(var(--radius-frame)*0.85)] bg-bone p-2 lg:p-3">
                <ImageSlot
                  image="aboutDetail"
                  bleed={12}
                  sizes="(min-width: 1024px) 26vw, 64vw"
                  className="about-img-b aspect-[3/2] rounded-[calc(var(--radius-frame)*0.6)]"
                />
              </div>
              <figcaption className="t-label mt-2 pl-2 text-graphite lg:pl-3">{a.figureB}</figcaption>
            </figure>
          </div>

          {/* Text column */}
          <div className="col-span-12 flex flex-col md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="about-support t-body max-w-[46ch] text-pretty text-graphite">{a.support}</p>

            <h3 className="t-label mt-14 text-graphite">{a.principlesTitle}</h3>
            <ol className="about-principles mt-5">
              {a.principles.map((p, i) => (
                <li key={p.title} className="group relative">
                  <span className="about-rule absolute inset-x-0 top-0 block h-px bg-ink/15" aria-hidden="true" />
                  <div className="about-principle grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-6 sm:grid-cols-[3rem_11rem_1fr] sm:py-7">
                    <span className="t-label pt-2 text-graphite transition-colors duration-500 group-hover:text-abyss">0{i + 1}</span>
                    <h4 className="t-h3 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-1.5">{p.title}</h4>
                    <p className="col-start-2 t-small max-w-[34ch] text-graphite sm:col-start-3 sm:pt-1.5">{p.text}</p>
                  </div>
                </li>
              ))}
              <li aria-hidden="true">
                <span className="about-rule block h-px bg-ink/15" />
              </li>
            </ol>

            <div className="about-links mt-9 flex flex-wrap gap-x-8 gap-y-3">
              <TextLink href="#team" section="team">
                {a.teamLink}
              </TextLink>
              <TextLink href="#experience" section="experience">
                {a.methodLink}
              </TextLink>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <div className="mt-[clamp(5rem,12vw,11rem)] flex flex-col items-center gap-8 text-center">
          <p className="about-quote t-h2 max-w-[18ch] text-balance">
            <Rich text={a.quote} inline />
          </p>
          <Dimension label="ÉTER" className="about-quote-dim w-full max-w-md text-graphite" />
        </div>
      </div>
    </section>
  );
}
