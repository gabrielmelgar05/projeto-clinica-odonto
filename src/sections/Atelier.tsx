"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/animations/gsap";
import { clipReveal, riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rich } from "@/components/ui/Rich";
import type { ImageKey } from "@/config/images";
import { cn } from "@/lib/cn";

type Tile = {
  key: "reception" | "room" | "equipment" | "architecture" | "ambience";
  image: ImageKey;
  letter: string;
  className: string;
  ratio: string;
  from: "bottom" | "top" | "left" | "right" | "center";
  speed: number;
  sizes: string;
};

/** An architectural collage: five frames of different proportions, each
 *  revealed from its own direction and drifting at its own depth. */
const tiles: Tile[] = [
  {
    key: "reception",
    image: "atelierReception",
    letter: "A",
    className: "col-span-2 lg:col-span-7 lg:row-start-1",
    ratio: "aspect-[16/10]",
    from: "left",
    speed: 0,
    sizes: "(min-width: 1024px) 56vw, 100vw",
  },
  {
    key: "architecture",
    image: "atelierArchitecture",
    letter: "B",
    className: "col-span-1 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-[12vw]",
    ratio: "aspect-[3/4]",
    from: "top",
    speed: -14,
    sizes: "(min-width: 1024px) 32vw, 50vw",
  },
  {
    key: "room",
    image: "atelierRoom",
    letter: "C",
    className: "col-span-1 mt-16 lg:col-span-4 lg:col-start-2 lg:row-start-2 lg:mt-[-4vw]",
    ratio: "aspect-[4/5]",
    from: "bottom",
    speed: -6,
    sizes: "(min-width: 1024px) 32vw, 50vw",
  },
  {
    key: "equipment",
    image: "atelierEquipment",
    letter: "D",
    className: "col-span-1 lg:col-span-3 lg:col-start-6 lg:row-start-2 lg:mt-[9vw]",
    ratio: "aspect-square",
    from: "center",
    speed: -20,
    sizes: "(min-width: 1024px) 24vw, 50vw",
  },
  {
    key: "ambience",
    image: "atelierAmbience",
    letter: "E",
    className: "col-span-1 mt-10 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:mt-[7vw]",
    ratio: "aspect-[2/3]",
    from: "right",
    speed: -10,
    sizes: "(min-width: 1024px) 24vw, 50vw",
  },
];

export function Atelier() {
  const { dict } = useSite();
  const a = dict.atelier;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current });
        splitReveal(q(".at-title")[0]);
        riseIn(q(".at-intro"), { trigger: q(".at-intro")[0] });

        q<HTMLElement>(".at-tile").forEach((tile) => {
          const frame = tile.querySelector(".at-frame");
          clipReveal(frame, { from: (tile.dataset.from as Tile["from"]) ?? "bottom", start: "top 90%" });
          riseIn(tile.querySelector("figcaption"), { trigger: tile, start: "top 80%" });
        });

        // Materials strip moves with the scroll in opposite directions.
        gsap.fromTo(q(".at-strip-a"), { xPercent: 0 }, {
          xPercent: -28,
          ease: "none",
          scrollTrigger: { trigger: q(".at-strips")[0], start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(q(".at-strip-b"), { xPercent: -28 }, {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: q(".at-strips")[0], start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Depth: each tile drifts at its own speed (desktop only).
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        q<HTMLElement>(".at-tile").forEach((tile) => {
          const speed = Number(tile.dataset.speed ?? 0);
          if (!speed) return;
          gsap.to(tile, {
            yPercent: speed,
            ease: "none",
            scrollTrigger: { trigger: q(".at-gallery")[0], start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const strip = [...a.materials, ...a.materials];

  return (
    <section ref={root} id="atelier" data-theme="light" aria-labelledby="atelier-title" className="relative overflow-hidden bg-bone section-pad">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="07" className="text-graphite">
              {a.label}
            </SectionLabel>
          </div>
          <h2 id="atelier-title" data-section-focus className="at-title t-h2 col-span-12 lg:col-span-6">
            <Rich text={a.title} />
          </h2>
          <p className="at-intro t-body col-span-12 max-w-[40ch] self-end text-pretty text-graphite md:col-span-8 lg:col-span-3">{a.intro}</p>
        </div>

        <div className="at-gallery mt-[clamp(4rem,8vw,7rem)] grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          {tiles.map((tile) => (
            <figure
              key={tile.key}
              className={cn("at-tile self-start", tile.className)}
              data-from={tile.from}
              data-speed={tile.speed}
            >
              <ImageSlot image={tile.image} sizes={tile.sizes} className={cn("at-frame rounded-[var(--radius-frame)]", tile.ratio)} />
              <figcaption className="t-label mt-3 flex items-center gap-3 text-graphite">
                <span className="flex size-5 items-center justify-center rounded-full border border-current text-[0.6rem]">{tile.letter}</span>
                {a.captions[tile.key]}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="at-strips mt-[clamp(5rem,10vw,9rem)] flex flex-col gap-2 overflow-hidden" aria-hidden="true">
        {(["at-strip-a", "at-strip-b"] as const).map((cls, row) => (
          <div key={cls} className={cn(cls, "flex w-max gap-[3vw] text-[clamp(3.5rem,9vw,9rem)] leading-[1] tracking-[-0.05em] whitespace-nowrap")}>
            {strip.map((word, i) => (
              <span key={`${word}-${i}`} className="flex items-center gap-[3vw]">
                <span className={(i + row) % 2 === 0 ? "text-ink" : "rich-em text-transparent [-webkit-text-stroke:1px_var(--color-steel)]"}>{word}</span>
                <span className="size-[0.12em] rounded-full bg-clinic" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
