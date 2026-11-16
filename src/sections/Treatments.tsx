"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "@/animations/gsap";
import { riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { CornerMarks } from "@/components/ui/CornerMarks";
import { treatmentIds, treatmentImages, type TreatmentId } from "@/data/treatments";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Desktop: an editorial index on the left drives a sticky "stage" on the
 * right. Hovering, focusing or clicking a row wipes in its photograph,
 * swaps the copy and slides the highlight to the row.
 * Touch / mobile: each row is an accordion that unfolds its own image,
 * description and call to action — no hover required.
 */
export function Treatments() {
  const { dict, requestTreatment } = useSite();
  const t = dict.treatments;
  const root = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery(MQ.desktop);
  const [active, setActive] = useState<TreatmentId>("general");
  const [openId, setOpenId] = useState<TreatmentId | null>(null);
  const previous = useRef<TreatmentId>("general");

  // Scroll reveals.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current });
        splitReveal(q(".tr-title")[0]);
        riseIn(q(".tr-intro"), { trigger: q(".tr-intro")[0] });
        gsap.from(q(".tr-row"), {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".tr-list")[0], start: "top 82%", once: true },
        });
        gsap.from(q(".tr-row-rule"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.4,
          stagger: 0.07,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".tr-list")[0], start: "top 82%", once: true },
        });
      });
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const stage = q(".tr-stage")[0];
        gsap.fromTo(
          stage,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            clearProps: "clipPath",
            scrollTrigger: { trigger: stage, start: "top 85%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });

  // Desktop stage transition whenever the active treatment changes.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const prev = previous.current;
    previous.current = active;

    const run = contextSafe(() => {
      const q = gsap.utils.selector(el);
      const frames = q<HTMLElement>(".tr-frame");
      const incoming = frames.find((f) => f.dataset.id === active);
      const outgoing = frames.find((f) => f.dataset.id === prev);

      // Move the highlight bar to the active row.
      const row = q<HTMLElement>(`.tr-row[data-id="${active}"]`)[0];
      const bar = q(".tr-indicator")[0];
      if (row && bar) {
        gsap.to(bar, { y: row.offsetTop, height: row.offsetHeight, duration: 0.8, ease: "expo.out", overwrite: true });
      }

      frames.forEach((f) => gsap.set(f, { zIndex: f === incoming ? 3 : f === outgoing ? 2 : 1 }));
      if (!incoming || prev === active) return;
      const reduced = prefersReducedMotion();

      gsap.fromTo(
        incoming,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 1.1, ease: "expo.inOut", overwrite: true },
      );
      gsap.fromTo(
        incoming.querySelector("[data-slot-media]"),
        { scale: 1.25, yPercent: 6 },
        { scale: 1, yPercent: 0, duration: reduced ? 0 : 1.6, ease: "expo.out", overwrite: true },
      );
      if (outgoing) {
        gsap.to(outgoing.querySelector("[data-slot-media]"), { scale: 1.08, yPercent: -4, duration: reduced ? 0 : 1.1, ease: "expo.inOut", overwrite: true });
      }
      gsap.fromTo(
        q(".tr-copy > *"),
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reduced ? 0 : 0.9, stagger: 0.06, ease: "expo.out", overwrite: true },
      );
      gsap.fromTo(
        q(".tr-counter-strip"),
        { yPercent: -100 * treatmentIds.indexOf(prev) / treatmentIds.length },
        { yPercent: (-100 * treatmentIds.indexOf(active)) / treatmentIds.length, duration: reduced ? 0 : 0.9, ease: "expo.inOut", overwrite: true },
      );
    });
    run();
  }, [active, contextSafe]);

  // Mobile accordion height animation.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const run = contextSafe(() => {
      const reduced = prefersReducedMotion();
      el.querySelectorAll<HTMLElement>(".tr-panel").forEach((panel) => {
        const open = panel.dataset.id === openId;
        gsap.to(panel, {
          height: open ? "auto" : 0,
          duration: reduced ? 0 : open ? 0.9 : 0.6,
          ease: open ? "expo.out" : "power3.inOut",
          overwrite: true,
        });
        if (open) {
          gsap.fromTo(
            panel.querySelectorAll("[data-panel-item]"),
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: reduced ? 0 : 0.8, stagger: 0.06, ease: "expo.out", delay: reduced ? 0 : 0.15 },
          );
        }
      });
    });
    run();
  }, [openId, contextSafe]);

  // Reset the measured highlight on resize.
  useEffect(() => {
    if (!isDesktop) return;
    const onResize = () => {
      const row = root.current?.querySelector<HTMLElement>(`.tr-row[data-id="${active}"]`);
      const bar = root.current?.querySelector(".tr-indicator");
      if (row && bar) gsap.set(bar, { y: row.offsetTop, height: row.offsetHeight });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isDesktop, active]);

  const current = t.items[active];

  return (
    <section ref={root} id="treatments" data-theme="light" aria-labelledby="treatments-title" className="relative bg-mist section-pad">
      <div className="shell">
        {/* Header */}
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02" className="text-graphite">
              {t.label}
            </SectionLabel>
          </div>
          <h2 id="treatments-title" data-section-focus className="tr-title t-h2 col-span-12 lg:col-span-6">
            <Rich text={t.title} />
          </h2>
          <p className="tr-intro t-body col-span-12 max-w-[40ch] self-end text-pretty text-graphite md:col-span-8 lg:col-span-3">{t.intro}</p>
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,7vw,6rem)] items-start gap-y-10">
          {/* Index of treatments */}
          <div className="col-span-12 lg:col-span-6">
            <p className="t-label mb-4 flex items-center justify-between text-graphite">
              <span>{isDesktop ? t.hintDesktop : t.hintTouch}</span>
              <span aria-hidden="true">06</span>
            </p>
            <ul className="tr-list relative" aria-label={dict.a11y.treatmentsList}>
              <span
                className="tr-indicator pointer-events-none absolute inset-x-0 top-0 hidden rounded-2xl bg-bone shadow-[0_20px_50px_-30px_rgba(16,17,18,0.35)] lg:block"
                aria-hidden="true"
              />
              {treatmentIds.map((id, i) => {
                const item = t.items[id];
                const isActive = active === id;
                const isOpen = openId === id;
                return (
                  <li key={id} data-id={id} className="tr-row relative">
                    <span className="tr-row-rule absolute inset-x-0 bottom-0 block h-px bg-ink/12" aria-hidden="true" />
                    <button
                      type="button"
                      onMouseEnter={() => isDesktop && setActive(id)}
                      onFocus={() => isDesktop && setActive(id)}
                      onClick={() => {
                        setActive(id);
                        if (!isDesktop) setOpenId((o) => (o === id ? null : id));
                      }}
                      aria-expanded={isDesktop ? undefined : isOpen}
                      aria-controls={isDesktop ? "treatment-stage" : `treatment-panel-${id}`}
                      aria-current={isDesktop && isActive ? "true" : undefined}
                      className="group relative z-[1] grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 px-1 py-5 text-left sm:grid-cols-[3rem_1fr_auto] lg:px-5 lg:py-[1.35rem]"
                    >
                      <span className={cn("t-label transition-colors duration-500", isActive && isDesktop ? "text-abyss" : "text-graphite")}>
                        0{i + 1}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span
                          className={cn(
                            "text-[clamp(1.6rem,2.9vw,2.9rem)] leading-[1.02] tracking-[-0.035em] transition-[color,transform] duration-700 ease-[var(--ease-expo)]",
                            isDesktop && !isActive ? "text-ink/35 group-hover:text-ink/70" : "text-ink",
                            isDesktop && isActive && "translate-x-2",
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="t-small mt-1 text-graphite lg:hidden">{item.short}</span>
                      </span>
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full border transition-all duration-700 ease-[var(--ease-expo)]",
                          isDesktop
                            ? isActive
                              ? "border-ink bg-ink text-bone"
                              : "border-ink/15 text-ink/50"
                            : isOpen
                              ? "rotate-45 border-ink bg-ink text-bone"
                              : "border-ink/20",
                        )}
                        aria-hidden="true"
                      >
                        {isDesktop ? <ArrowUpRight className="size-4" strokeWidth={1.6} /> : <Plus className="size-4" strokeWidth={1.6} />}
                      </span>
                    </button>

                    {/* Mobile / tablet panel */}
                    <div
                      id={`treatment-panel-${id}`}
                      data-id={id}
                      className="tr-panel h-0 overflow-hidden lg:hidden"
                      inert={!isOpen}
                    >
                      <div className="flex flex-col gap-5 pt-1 pb-8 sm:pl-[3.75rem]">
                        <div data-panel-item>
                          <ImageSlot image={treatmentImages[id]} sizes="(min-width: 640px) 80vw, 100vw" className="aspect-[16/11] rounded-2xl" />
                        </div>
                        <p data-panel-item className="t-body max-w-[52ch] text-graphite">
                          {item.description}
                        </p>
                        <ul data-panel-item className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <li key={tag} className="t-label rounded-full border border-ink/15 px-3 py-1.5 text-graphite">
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <div data-panel-item>
                          <Button onClick={() => requestTreatment(id)} variant="ink" magnetic={false}>
                            {t.cta}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="t-small mt-6 max-w-[52ch] text-graphite">{t.note}</p>
          </div>

          {/* Desktop stage */}
          <div className="col-span-12 hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(var(--nav-h)+1.5rem)]">
              <div
                id="treatment-stage"
                aria-live="polite"
                className="tr-stage relative overflow-hidden rounded-[var(--radius-frame)] bg-ink text-bone"
              >
                <div className="relative aspect-[5/4] xl:aspect-[4/3.6]">
                  {treatmentIds.map((id) => (
                    <ImageSlot
                      key={id}
                      image={treatmentImages[id]}
                      sizes="(min-width: 1024px) 46vw, 1px"
                      className="tr-frame absolute inset-0"
                      labelPosition="top-left"
                      style={{ zIndex: id === "general" ? 3 : 1 }}
                      data-id={id}
                    />
                  ))}
                  <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <CornerMarks className="z-[5] inset-5 text-bone/45" />
                  <div className="absolute top-6 right-7 z-[5] h-[1.1em] overflow-hidden font-mono text-[0.75rem] tracking-[0.08em]" aria-hidden="true">
                    <div className="tr-counter-strip flex flex-col">
                      {treatmentIds.map((id, i) => (
                        <span key={id} className="block h-[1.1em] leading-[1.1em]">
                          0{i + 1} / 06
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="tr-copy absolute inset-x-0 bottom-0 z-[5] flex flex-col gap-4 p-8 xl:p-10">
                    <h3 className="t-h3">{current.title}</h3>
                    <p className="max-w-[44ch] text-[0.98rem] leading-relaxed text-bone/75">{current.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <ul className="flex flex-wrap gap-2">
                        {current.tags.map((tag) => (
                          <li key={tag} className="t-label rounded-full bg-bone/10 px-3 py-1.5 text-bone/80 ring-1 ring-bone/15 backdrop-blur-md">
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <Button onClick={() => requestTreatment(active)} variant="bone">
                        {t.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
