"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "@/animations/gsap";
import { clipReveal, riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rich } from "@/components/ui/Rich";
import { CornerMarks } from "@/components/ui/CornerMarks";
import { team } from "@/data/team";
import { format } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * Portrait carousel. A change of dentist wipes the new portrait across the
 * old one (direction follows navigation), lifts the name out of its masks
 * and refreshes the details. Works with buttons, thumbnails, arrow keys,
 * mouse drag and touch swipe; announces each change to screen readers.
 */
export function Team() {
  const { dict } = useSite();
  const t = dict.team;
  const total = team.length;
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const prevIndex = useRef(0);
  const direction = useRef<1 | -1>(1);
  const drag = useRef<{ x: number; id: number } | null>(null);

  const goTo = useCallback(
    (next: number, dir?: 1 | -1) => {
      const wrapped = (next + total) % total;
      if (wrapped === index) return;
      direction.current = dir ?? (wrapped > index ? 1 : -1);
      setIndex(wrapped);
    },
    [index, total],
  );

  // Scroll reveals.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current });
        splitReveal(q(".tm-title")[0]);
        riseIn(q(".tm-intro, .tm-controls"), { trigger: q(".tm-intro")[0] });
        clipReveal(q(".tm-stage")[0], { from: "bottom", start: "top 80%" });
        riseIn(q(".tm-thumb"), { trigger: q(".tm-thumbs")[0], stagger: 0.08 });
        gsap.from(q(".tm-info-reveal"), {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".tm-info")[0], start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });

  // Slide transition.
  useEffect(() => {
    const from = prevIndex.current;
    const to = index;
    prevIndex.current = index;
    if (from === to || !root.current) return;

    contextSafe(() => {
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      const d = reduced ? 0 : 1;
      const dir = direction.current;
      const frames = q<HTMLElement>(".tm-frame");
      const blocks = q<HTMLElement>(".tm-block");

      frames.forEach((f, i) => gsap.set(f, { zIndex: i === to ? 3 : i === from ? 2 : 1 }));
      gsap.fromTo(
        frames[to],
        { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15 * d, ease: "expo.inOut", overwrite: true },
      );
      gsap.fromTo(
        frames[to].querySelector("[data-slot-media]"),
        { scale: 1.3, xPercent: 12 * dir },
        { scale: 1, xPercent: 0, duration: 1.6 * d, ease: "expo.out", overwrite: true },
      );
      gsap.to(frames[from].querySelector("[data-slot-media]"), { xPercent: -14 * dir, duration: 1.15 * d, ease: "expo.inOut", overwrite: true });

      // Text: old lines leave upward, new ones rise from their masks.
      const out = blocks[from];
      const inn = blocks[to];
      gsap.to(out.querySelectorAll("[data-line]"), {
        yPercent: -110,
        duration: 0.55 * d,
        stagger: 0.04,
        ease: "power3.in",
        overwrite: true,
        onComplete: () => gsap.set(out, { autoAlpha: 0 }),
      });
      gsap.to(out.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: -10, duration: 0.4 * d, overwrite: true });
      gsap.set(inn, { autoAlpha: 1 });
      gsap.fromTo(
        inn.querySelectorAll("[data-line]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2 * d, stagger: 0.07, ease: "expo.out", delay: 0.35 * d, overwrite: true },
      );
      gsap.fromTo(
        inn.querySelectorAll("[data-fade]"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.9 * d, stagger: 0.06, ease: "expo.out", delay: 0.5 * d, overwrite: true },
      );

      // Progress segments.
      q<HTMLElement>(".tm-seg").forEach((seg, i) =>
        gsap.to(seg, { scaleX: i === to ? 1 : 0, duration: 0.9 * d, ease: "expo.inOut", overwrite: true }),
      );
      gsap.to(q(".tm-count-strip"), { yPercent: (-100 * to) / total, duration: 0.8 * d, ease: "expo.inOut", overwrite: true });
    })();
  }, [index, contextSafe, total]);

  // Pointer drag / swipe on the portrait.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerMove = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.x;
    const media = e.currentTarget.querySelectorAll(".tm-frame")[index]?.querySelector("[data-slot-media]");
    if (media) gsap.to(media, { x: dx * 0.25, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  });
  const endDrag = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    e.currentTarget.querySelectorAll("[data-slot-media]").forEach((m) => gsap.to(m, { x: 0, duration: 0.8, ease: "expo.out" }));
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1, -1);
    }
  };

  const member = team[index];

  return (
    <section ref={root} id="team" data-theme="light" aria-labelledby="team-title" className="relative bg-bone section-pad">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="05" className="text-graphite">
              {t.label}
            </SectionLabel>
          </div>
          <h2 id="team-title" data-section-focus className="tm-title t-h2 col-span-12 lg:col-span-5">
            <Rich text={t.title} />
          </h2>
          <div className="col-span-12 flex flex-col justify-end gap-8 md:col-span-8 lg:col-span-4">
            <p className="tm-intro t-body max-w-[40ch] text-pretty text-graphite">{t.intro}</p>
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={dict.a11y.carousel}
          onKeyDown={onKeyDown}
          className="grid-12 mt-[clamp(3.5rem,7vw,6rem)] gap-y-10"
        >
          {/* Portrait */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <div
              className="tm-stage relative aspect-[3/4] cursor-grab touch-pan-y overflow-hidden rounded-[var(--radius-frame)] select-none active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
            >
              {team.map((m, i) => (
                <div
                  key={m.id}
                  className="tm-frame absolute inset-0"
                  style={{ zIndex: i === 0 ? 3 : 1 }}
                  role="group"
                  aria-roledescription={dict.a11y.slide}
                  aria-label={`${i + 1} / ${total}`}
                  aria-hidden={i !== index}
                >
                  <ImageSlot image={m.image} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" className="absolute inset-0" />
                </div>
              ))}
              <CornerMarks className="z-[4] inset-4 text-ink/25" />
              <div className="absolute top-5 right-5 z-[4] rounded-full bg-ink/75 px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.08em] text-bone backdrop-blur-md" aria-hidden="true">
                <div className="h-[1.2em] overflow-hidden">
                <div className="tm-count-strip flex flex-col">
                  {team.map((m, i) => (
                    <span key={m.id} className="block h-[1.2em] leading-[1.2em]">
                      0{i + 1} / 0{total}
                    </span>
                  ))}
                </div>
                </div>
              </div>
            </div>
            <p className="t-label mt-4 text-graphite">{t.hint}</p>
          </div>

          {/* Details */}
          <div className="tm-info col-span-12 flex flex-col md:col-span-6 lg:col-span-6 lg:col-start-7">
            <div className="grid">
              {team.map((m, i) => {
                const info = t.members[m.id];
                return (
                  <div
                    key={m.id}
                    className="tm-block col-start-1 row-start-1 flex flex-col"
                    style={i === 0 ? undefined : { visibility: "hidden", opacity: 0 }}
                    aria-hidden={i !== index}
                  >
                    <h3 className="text-[clamp(2.8rem,6.2vw,6.5rem)] leading-[0.92] tracking-[-0.05em]">
                      <span className="block overflow-hidden pb-[0.06em]">
                        <span data-line className="tm-info-reveal block">
                          <span className="rich-em mr-[0.18em] text-[0.62em] text-graphite">Dr.</span>
                          {m.first}
                        </span>
                      </span>
                      <span className="block overflow-hidden pb-[0.08em]">
                        <span data-line className="tm-info-reveal block">
                          {m.last}
                        </span>
                      </span>
                    </h3>
                    <p data-fade className="t-label mt-6 text-abyss">
                      {info.role}
                    </p>
                    <p data-fade className="t-body mt-5 max-w-[44ch] text-pretty text-graphite">
                      {info.bio}
                    </p>
                    <div data-fade className="mt-7">
                      <p className="t-label text-graphite">{t.focus}</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {info.focus.map((f) => (
                          <li key={f} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[0.85rem]">
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="tm-controls mt-10 flex items-center justify-between gap-6 lg:mt-auto lg:pt-12">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {team.map((m, i) => (
                  <span key={m.id} className="relative h-px flex-1 overflow-hidden bg-ink/15">
                    <span className="tm-seg absolute inset-0 origin-left bg-ink" style={{ transform: i === 0 ? "scaleX(1)" : "scaleX(0)" }} />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goTo(index - 1, -1)}
                  aria-label={dict.a11y.previous}
                  className="group flex size-12 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bone"
                >
                  <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-0.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1, 1)}
                  aria-label={dict.a11y.next}
                  className="group flex size-12 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bone"
                >
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" strokeWidth={1.6} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <ul className="tm-thumbs mt-8 grid grid-cols-4 gap-2 sm:gap-3">
              {team.map((m, i) => (
                <li key={m.id} className="tm-thumb">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={format(dict.a11y.showMember, { name: m.name })}
                    aria-current={i === index ? "true" : undefined}
                    className="group flex w-full flex-col gap-2 text-left"
                  >
                    <span
                      className={cn(
                        "relative block aspect-[3/4] overflow-hidden rounded-xl ring-1 transition-all duration-700 ease-[var(--ease-expo)]",
                        i === index ? "ring-ink" : "opacity-55 ring-transparent group-hover:opacity-100",
                      )}
                    >
                      <ImageSlot image={m.image} sizes="10vw" showLabel={false} alt="" className="absolute inset-0 [&_img]:grayscale group-hover:[&_img]:grayscale-0" />
                    </span>
                    <span className="hidden truncate text-[0.8rem] text-graphite sm:block">{m.last}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[0.78rem] leading-relaxed text-graphite/90">{t.disclaimer}</p>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {format(dict.a11y.slideStatus, { name: member.name, index: index + 1, total })}
        </p>
      </div>
    </section>
  );
}
