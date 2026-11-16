"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/animations/gsap";
import { clipReveal, riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rich } from "@/components/ui/Rich";
import { CornerMarks } from "@/components/ui/CornerMarks";
import { technologyImages } from "@/data/technology";

/**
 * Dark, technical chapter. On desktop the stage pins and the scroll drives
 * a "scanner": each new photograph is revealed by a glowing scan line
 * sweeping down the frame (a nod to radiography), while the copy, the
 * chapter index and the measurement dial advance in lockstep.
 */
export function Technology() {
  const { dict } = useSite();
  const t = dict.technology;
  const items = t.items;
  const n = items.length;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        riseIn(q(".tech-head [data-label]"), { trigger: root.current });
        splitReveal(q(".tech-title")[0]);
        riseIn(q(".tech-intro"), { trigger: q(".tech-intro")[0] });
      });

      // Pinned scanner — desktop with motion only.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const stage = q(".tech-stage")[0] as HTMLElement;
        const frames = q<HTMLElement>(".tech-frame");
        const texts = q<HTMLElement>(".tech-text");
        const listItems = q<HTMLElement>(".tech-li");
        const scan = q(".tech-scan")[0];
        const frameBox = q(".tech-frame-box")[0] as HTMLElement;

        gsap.set(frames.slice(1), { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(texts.slice(1), { opacity: 0, y: 40 });
        gsap.set(listItems.slice(1), { opacity: 0.35 });
        gsap.set(scan, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${(n - 1) * window.innerHeight * 0.9}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labels",
              duration: { min: 0.3, max: 0.9 },
              delay: 0.12,
              ease: "power2.inOut",
            },
          },
        });

        tl.addLabel("chapter-0", 0).to(q(".tech-dial"), { rotation: 120, svgOrigin: "200 200", duration: n - 1 }, 0)
          .to(q(".tech-progress"), { scaleY: 1, duration: n - 1 }, 0);

        for (let i = 1; i < n; i++) {
          const at = i - 1;
          tl.set(scan, { autoAlpha: 1, y: 0 }, at)
            .to(frames[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power1.inOut" }, at)
            .to(scan, { y: () => frameBox.offsetHeight, duration: 0.8, ease: "power1.inOut" }, at)
            .set(scan, { autoAlpha: 0 }, at + 0.8)
            .fromTo(frames[i].querySelector("[data-slot-media]"), { scale: 1.2 }, { scale: 1, duration: 1 }, at)
            .to(texts[i - 1], { opacity: 0, y: -40, duration: 0.35 }, at + 0.05)
            .to(texts[i], { opacity: 1, y: 0, duration: 0.4 }, at + 0.4)
            .addLabel(`chapter-${i}`, at + 0.85)
            .to(listItems[i - 1], { opacity: 0.35, duration: 0.3 }, at + 0.2)
            .to(listItems[i], { opacity: 1, duration: 0.3 }, at + 0.3)
            .to(q(".tech-count-strip"), { yPercent: (-100 * i) / n, duration: 0.5, ease: "power2.inOut" }, at + 0.25)
            .to(q(".tech-caption-strip"), { yPercent: (-100 * i) / n, duration: 0.5, ease: "power2.inOut" }, at + 0.25);
        }
        tl.to({}, { duration: 0.25 });

        // Entrance of the stage furniture.
        gsap.from(q(".tech-ring"), {
          scale: 0.8,
          autoAlpha: 0,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: stage, start: "top 70%", once: true },
        });
        clipReveal(frameBox, { from: "center", start: "top 75%" });
      });

      // Stacked chapters — mobile, tablet and reduced-motion desktop.
      mm.add(`${MQ.motion} and ${MQ.mobile}`, () => {
        q<HTMLElement>(".tech-card").forEach((card) => {
          clipReveal(card.querySelector(".tech-card-frame"), { from: "top" });
          riseIn(card.querySelectorAll(".tech-card-copy > *"), { trigger: card, start: "top 70%" });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="technology" data-theme="dark" aria-labelledby="technology-title" className="relative bg-ink text-bone">
      {/* Intro */}
      <div className="tech-head shell section-pad pb-[clamp(3rem,6vw,5rem)]!">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="03" className="text-bone/60">
              {t.label}
            </SectionLabel>
          </div>
          <h2 id="technology-title" data-section-focus className="tech-title t-h2 col-span-12 lg:col-span-6 [&_.rich-em]:text-clinic-soft">
            <Rich text={t.title} />
          </h2>
          <div className="col-span-12 flex flex-col justify-end gap-6 md:col-span-8 lg:col-span-3">
            <p className="tech-intro t-body text-pretty text-bone/65">{t.intro}</p>
          </div>
        </div>
      </div>

      {/* Desktop pinned stage */}
      <div className="tech-stage relative hidden h-screen min-h-[640px] overflow-hidden lg:block motion-reduce:lg:hidden" aria-label={dict.a11y.techSteps} role="group">
        <div className="shell grid-12 h-full items-center pt-[calc(var(--nav-h)+1rem)] pb-10">
          {/* Copy */}
          <div className="col-span-4 flex h-full flex-col justify-between py-6">
            <div className="flex items-end gap-4">
              <div className="h-[0.86em] overflow-hidden text-[clamp(6rem,10vw,10rem)] leading-[0.86] tracking-[-0.06em]" aria-hidden="true">
                <div className="tech-count-strip flex flex-col">
                  {items.map((_, i) => (
                    <span key={i} className="block h-[0.86em]">
                      0{i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <span className="t-label mb-3 text-bone/45">/ 0{n}</span>
            </div>

            <div className="relative min-h-[15rem]">
              {items.map((item) => (
                <div key={item.key} className="tech-text absolute inset-x-0 bottom-0 flex flex-col gap-5">
                  <span className="t-label text-clinic-soft">{item.meta}</span>
                  <h3 className="t-h3 max-w-[14ch]">{item.title}</h3>
                  <p className="max-w-[38ch] text-[0.98rem] leading-relaxed text-bone/65">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scanner frame */}
          <div className="relative col-span-5 flex h-full items-center justify-center">
            <svg viewBox="0 0 400 400" className="tech-ring pointer-events-none absolute w-[118%] max-w-none text-bone/15" aria-hidden="true">
              <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" />
              <circle cx="200" cy="200" r="172" fill="none" stroke="currentColor" strokeDasharray="1 7" />
              <g className="tech-dial">
                {Array.from({ length: 72 }, (_, i) => (
                  <line
                    key={i}
                    x1="200"
                    y1="4"
                    x2="200"
                    y2={i % 6 === 0 ? 22 : 12}
                    stroke="currentColor"
                    strokeOpacity={i % 6 === 0 ? 1 : 0.6}
                    transform={`rotate(${i * 5} 200 200)`}
                  />
                ))}
                <circle cx="200" cy="4" r="4" fill="#a9bfcd" />
              </g>
            </svg>

            <div className="tech-frame-box relative aspect-[4/5] h-[min(70vh,44rem)] max-w-full overflow-hidden rounded-[var(--radius-frame)]">
              {items.map((item, i) => (
                <ImageSlot
                  key={item.key}
                  image={technologyImages[item.key]}
                  sizes="(min-width: 1024px) 34vw, 1px"
                  className="tech-frame absolute inset-0"
                  labelPosition="top-left"
                  style={{ zIndex: i + 1 }}
                />
              ))}
              <span
                className="tech-scan pointer-events-none absolute inset-x-0 top-0 z-20 block h-px bg-clinic-soft shadow-[0_0_24px_6px_rgba(169,191,205,0.55)]"
                aria-hidden="true"
              />
              <CornerMarks className="z-20 inset-4 text-bone/50" />
              <div className="absolute bottom-5 left-6 z-20 flex h-[1.2em] items-center gap-2 overflow-hidden font-mono text-[0.6875rem] tracking-[0.08em] text-bone/75 uppercase" aria-hidden="true">
                <span>{t.figure}.</span>
                <span className="h-[1.2em] overflow-hidden">
                  <span className="tech-caption-strip flex flex-col">
                    {items.map((item, i) => (
                      <span key={item.key} className="block h-[1.2em] leading-[1.2em]">
                        {i + 1} — {item.title}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Index */}
          <div className="col-span-3 flex h-full flex-col justify-between py-6 pl-6">
            <p className="t-label text-bone/45">{t.scrollHint}</p>
            <div className="flex gap-5">
              <span className="relative block w-px self-stretch bg-bone/12" aria-hidden="true">
                <span className="tech-progress absolute inset-0 origin-top scale-y-0 bg-clinic-soft" />
              </span>
              <ol className="flex flex-col gap-4">
                {items.map((item, i) => (
                  <li key={item.key} className="tech-li flex items-baseline gap-3">
                    <span className="t-label text-bone/50">0{i + 1}</span>
                    <span className="text-[1.05rem] tracking-[-0.01em]">{item.title}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="max-w-[30ch] text-[0.8rem] leading-relaxed text-bone/45">{t.note}</p>
          </div>
        </div>
      </div>

      {/* Stacked chapters (mobile / tablet / reduced motion) */}
      <div className="shell pb-[clamp(5rem,12vw,9rem)] lg:hidden motion-reduce:lg:block">
        <ol className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.key} className="tech-card flex flex-col gap-6">
              <ImageSlot
                image={technologyImages[item.key]}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                className="tech-card-frame aspect-[4/5] rounded-[var(--radius-frame)]"
              />
              <div className="tech-card-copy flex flex-col gap-3">
                <span className="t-label flex items-center gap-3 text-clinic-soft">
                  <span className="text-bone/50">0{i + 1}</span> {item.meta}
                </span>
                <h3 className="t-h3">{item.title}</h3>
                <p className="t-body text-bone/65">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-14 max-w-[52ch] text-[0.85rem] text-bone/45">{t.note}</p>
      </div>
    </section>
  );
}
