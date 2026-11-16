"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "@/animations/gsap";
import { riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Accordion following the WAI-ARIA disclosure pattern: real buttons with
 * aria-expanded / aria-controls, labelled regions, inert closed panels,
 * Home/End/Arrow key navigation between questions and GSAP height easing.
 */
export function Faq() {
  const { dict } = useSite();
  const f = dict.faq;
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const first = useRef(true);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current });
        splitReveal(q(".faq-title")[0]);
        riseIn(q(".faq-aside-rise"), { trigger: q(".faq-aside")[0], stagger: 0.1 });
        gsap.from(q(".faq-item"), {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".faq-list")[0], start: "top 85%", once: true },
        });
        gsap.from(q(".faq-rule"), {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 1.3,
          stagger: 0.07,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".faq-list")[0], start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const instant = first.current || prefersReducedMotion();
    first.current = false;

    contextSafe(() => {
      el.querySelectorAll<HTMLElement>(".faq-panel").forEach((panel, i) => {
        const isOpen = i === open;
        gsap.to(panel, {
          height: isOpen ? "auto" : 0,
          duration: instant ? 0 : isOpen ? 0.85 : 0.55,
          ease: isOpen ? "expo.out" : "power3.inOut",
          overwrite: true,
        });
        gsap.to(panel.firstElementChild, {
          y: isOpen ? 0 : -12,
          autoAlpha: isOpen ? 1 : 0,
          duration: instant ? 0 : isOpen ? 0.8 : 0.3,
          delay: isOpen && !instant ? 0.12 : 0,
          ease: "expo.out",
          overwrite: true,
        });
      });
    })();
  }, [open, contextSafe]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const buttons = root.current?.querySelectorAll<HTMLButtonElement>(".faq-trigger");
    if (!buttons) return;
    const n = buttons.length;
    const map: Record<string, number> = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (e.key in map) {
      e.preventDefault();
      buttons[map[e.key]].focus();
    }
  };

  return (
    <section ref={root} id="faq" data-theme="light" aria-labelledby="faq-title" className="relative bg-bone section-pad">
      <div className="shell grid-12 gap-y-14">
        <div className="faq-aside col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
            <SectionLabel index="08" className="text-graphite">
              {f.label}
            </SectionLabel>
            <h2 id="faq-title" data-section-focus className="faq-title t-h2 mt-8">
              <Rich text={f.title} />
            </h2>
            <p className="faq-aside-rise t-body mt-6 max-w-[38ch] text-pretty text-graphite">{f.intro}</p>

            <div className="faq-aside-rise mt-10 rounded-[var(--radius-frame)] bg-mist p-6 sm:p-7">
              <p className="text-[1.2rem] tracking-[-0.02em]">{f.contactTitle}</p>
              <p className="t-small mt-2 text-graphite">{f.contactText}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button href="#contact" section="contact" variant="ink" magnetic={false}>
                  {f.contactCta}
                </Button>
                <a href={siteConfig.contact.emailHref} className="link-line text-[0.9rem] text-graphite">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <ul className="faq-list">
            {f.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="faq-item relative">
                  <span className="faq-rule absolute inset-x-0 top-0 block h-px bg-ink/15" aria-hidden="true" />
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      className="faq-trigger group grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-x-3 py-6 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:py-7"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                    >
                      <span className={cn("t-label pt-2 transition-colors duration-500", isOpen ? "text-abyss" : "text-graphite")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.25] tracking-[-0.02em] transition-colors duration-500",
                          isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink",
                        )}
                      >
                        {item.q}
                      </span>
                      <span
                        className={cn(
                          "relative mt-0.5 flex size-10 items-center justify-center rounded-full border transition-colors duration-500",
                          isOpen ? "border-ink bg-ink text-bone" : "border-ink/20 group-hover:border-ink/60",
                        )}
                        aria-hidden="true"
                      >
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span
                          className={cn(
                            "absolute h-3.5 w-px bg-current transition-transform duration-700 ease-[var(--ease-expo)]",
                            isOpen && "scale-y-0 rotate-90",
                          )}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className="faq-panel h-0 overflow-hidden"
                    inert={!isOpen}
                  >
                    <div className="pb-8 pl-[3.25rem] sm:pl-[4.25rem]">
                      <p className="t-body max-w-[58ch] text-pretty text-graphite">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
            <li aria-hidden="true">
              <span className="faq-rule block h-px bg-ink/15" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
