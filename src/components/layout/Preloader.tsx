"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { LogoSymbol, LogoWordmark } from "@/components/brand/Logo";
import { introSeen, markIntroSeen } from "@/lib/restore";
import { cn } from "@/lib/cn";

const FONT_TIMEOUT = 2500;
const HARD_TIMEOUT = 9000;

/**
 * Cinematic intro, in five acts:
 *   1. Construction guides cross the screen (a technical drawing begins).
 *   2. The symbol is drawn stroke by stroke: orbit, horizon, arc, dot, accent.
 *   3. The wordmark is drawn letter by letter; its accent lands last.
 *   4. Transformation: the accent rotates 60° onto the horizon — the
 *      "measurement locks" — and the horizon line brightens.
 *   5. The screen splits open along that horizon, revealing the hero,
 *      whose entrance is triggered at the exact moment the split starts.
 *
 * Robustness: waits for fonts (max 2.5 s), has a hard 9 s ceiling, a CSS
 * failsafe if scripts never run, a short variant for repeat visits in the
 * same session and a calm fade for prefers-reduced-motion.
 */
export function Preloader() {
  const { dict, setPhase } = useSite();
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      el.dataset.controlled = "true";

      const html = document.documentElement;
      html.classList.add("is-locked");
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(failsafe);
        html.classList.remove("is-locked");
        markIntroSeen();
        setPhase("revealing");
        setPhase("done");
        setVisible(false);
      };
      const reveal = () => setPhase("revealing");
      const failsafe = window.setTimeout(finish, HARD_TIMEOUT);

      const fontsReady: Promise<unknown> = Promise.race([
        "fonts" in document ? document.fonts.ready : Promise.resolve(),
        new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT)),
      ]);

      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true, onComplete: finish });

      if (prefersReducedMotion()) {
        tl.set(q(".pl-draw"), { strokeDashoffset: 0 })
          .set(q(".sym-dot"), { attr: { r: 3.6 } })
          .set(q(".pl-guide-h, .pl-guide-v"), { scale: 1 })
          .set(q(".pl-meta"), { autoAlpha: 1 })
          .set(q(".pl-caption-inner"), { yPercent: 0 })
          .addPause("+=0.5", () => void fontsReady.then(() => tl.play()))
          .add(reveal)
          .to(el, { autoAlpha: 0, duration: 0.5, ease: "power1.out" });
        tl.play();
        return () => {
          window.clearTimeout(failsafe);
          html.classList.remove("is-locked");
        };
      }

      // Repeat visit (e.g. after switching language): same story, faster.
      const s = introSeen() ? 0.42 : 1;

      tl.addLabel("guides", 0)
        .fromTo(q(".pl-guide-h"), { scaleX: 0 }, { scaleX: 1, duration: 1.5 * s, ease: "expo.inOut" }, "guides")
        .fromTo(q(".pl-guide-v"), { scaleY: 0 }, { scaleY: 1, duration: 1.5 * s, ease: "expo.inOut" }, `guides+=${0.12 * s}`)
        .fromTo(q(".pl-meta"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9 * s, stagger: 0.07 * s, ease: "expo.out" }, `guides+=${0.35 * s}`)

        .addLabel("symbol", 0.4 * s)
        .fromTo(
          q(".sym-ring"),
          { rotation: -230, svgOrigin: "60 60" },
          { rotation: -90, svgOrigin: "60 60", duration: 1.9 * s, ease: "expo.out" },
          "symbol",
        )
        .to(q(".sym-ring"), { strokeDashoffset: 0, duration: 1.6 * s, ease: "power2.inOut" }, "symbol")
        .to(q(".sym-horizon"), { strokeDashoffset: 0, duration: 1.1 * s, ease: "expo.inOut" }, `symbol+=${0.45 * s}`)
        .to(q(".sym-arc"), { strokeDashoffset: 0, duration: 1.1 * s, ease: "expo.inOut" }, `symbol+=${0.7 * s}`)
        .to(q(".sym-dot"), { attr: { r: 3.6 }, duration: 0.7 * s, ease: "back.out(3)" }, `symbol+=${1.05 * s}`)
        .to(q(".sym-accent"), { strokeDashoffset: 0, duration: 0.75 * s, ease: "expo.out" }, `symbol+=${1.25 * s}`)
        .fromTo(q(".pl-pulse"), { scale: 0.6, autoAlpha: 0.5 }, { scale: 2.4, autoAlpha: 0, duration: 1.4 * s, ease: "expo.out" }, `symbol+=${1.3 * s}`)

        .addLabel("word", 1.45 * s)
        .to(q(".wm-letter"), { strokeDashoffset: 0, duration: 1.15 * s, stagger: 0.1 * s, ease: "expo.inOut" }, "word")
        .to(q(".wm-accent"), { strokeDashoffset: 0, duration: 0.55 * s, ease: "expo.out" }, `word+=${0.85 * s}`)
        .fromTo(q(".pl-caption-inner"), { yPercent: 110 }, { yPercent: 0, duration: 1 * s, ease: "expo.out" }, `word+=${0.7 * s}`)

        // Hold for fonts (bounded), then transform.
        .addLabel("exit", `word+=${1.55 * s}`)
        .addPause("exit", () => void fontsReady.then(() => tl.play()))

        .to(q(".pl-meta, .pl-caption"), { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "exit")
        .to(q(".pl-word"), { y: 18, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, "exit")
        .to(q(".pl-guide-v"), { scaleY: 0, duration: 0.8, ease: "expo.in" }, "exit")
        .to(q(".sym-accent"), { rotation: 60, svgOrigin: "60 60", duration: 0.9, ease: "expo.inOut" }, "exit+=0.1")
        .to(q(".pl-guide-h"), { backgroundColor: "#a9bfcd", opacity: 1, duration: 0.6, ease: "power2.out" }, "exit+=0.45")
        .to(q(".pl-symbol"), { scale: 1.12, duration: 0.9, ease: "expo.inOut" }, "exit+=0.1")

        .addLabel("split", "exit+=1.05")
        .add(reveal, "split")
        .to(q(".pl-top"), { yPercent: -100, duration: 1.35, ease: "expo.inOut" }, "split")
        .to(q(".pl-bottom"), { yPercent: 100, duration: 1.35, ease: "expo.inOut" }, "split")
        .to(q(".pl-shade"), { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" }, "split");

      tl.play();

      return () => {
        window.clearTimeout(failsafe);
        html.classList.remove("is-locked");
      };
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] text-bone"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{dict.a11y.loading}</span>
      {/* Soft veil over the hero while the panels part. */}
      <div className="pl-shade absolute inset-0 bg-ink/40" aria-hidden="true" />
      <Panel position="top" />
      <Panel position="bottom" />
    </div>
  );
}

/** One half of the screen. Both halves render the same full-screen stage so
 *  that, when they slide apart, the logo itself splits along its horizon. */
function Panel({ position }: { position: "top" | "bottom" }) {
  const top = position === "top";
  return (
    <div
      className={cn("absolute inset-x-0 h-1/2 overflow-hidden bg-ink will-change-transform", top ? "pl-top top-0" : "pl-bottom bottom-0")}
      aria-hidden="true"
    >
      <div className={cn("absolute inset-x-0 h-[200%]", top ? "top-0" : "bottom-0")}>
        <Stage />
      </div>
    </div>
  );
}

function Stage() {
  const { dict } = useSite();
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(55% 45% at 50% 50%, rgba(38,61,76,0.55) 0%, rgba(16,17,18,0) 72%)" }}
      />

      {/* Construction guides */}
      <span className="pl-guide-h absolute inset-x-0 top-1/2 h-px origin-center bg-bone/20" style={{ transform: "scaleX(0)" }} />
      <span className="pl-guide-v absolute inset-y-0 left-1/2 w-px origin-center bg-bone/10" style={{ transform: "scaleY(0)" }} />

      {/* Corner annotations */}
      <p style={{ opacity: 0 }} className="pl-meta t-label absolute top-6 left-[var(--gutter)] text-bone/55">ÉTER — {dict.preloader.caption}</p>
      <p style={{ opacity: 0 }} className="pl-meta t-label absolute top-6 right-[var(--gutter)] hidden text-bone/55 sm:block">{dict.preloader.fig}</p>
      <p style={{ opacity: 0 }} className="pl-meta t-label absolute bottom-6 left-[var(--gutter)] flex items-center gap-2 text-bone/55">
        <span className="inline-block size-1.5 animate-pulse rounded-full bg-clinic" />
        {dict.preloader.status}
      </p>
      <p style={{ opacity: 0 }} className="pl-meta t-label absolute right-[var(--gutter)] bottom-6 hidden text-bone/55 sm:block">23°33′S · 46°39′W</p>

      {/* Symbol — its centre sits exactly on the split line */}
      <div className="pl-symbol absolute top-1/2 left-1/2 w-[clamp(6.5rem,15vmin,9.5rem)] -translate-x-1/2 -translate-y-1/2">
        <span className="pl-pulse absolute inset-0 rounded-full border border-clinic-soft/60 opacity-0" />
        <LogoSymbol draw stroke={2.4} />
      </div>

      {/* Wordmark + caption */}
      <div className="absolute top-[calc(50%+clamp(6.5rem,15vmin,9.5rem)/2+clamp(1.75rem,5vmin,3rem))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
        <div className="pl-word w-[clamp(8.5rem,20vmin,12.5rem)]">
          <LogoWordmark draw stroke={2.6} />
        </div>
        <span className="pl-caption block overflow-hidden">
          <span className="pl-caption-inner t-label block text-bone/60" style={{ transform: "translateY(110%)" }}>{dict.preloader.caption}</span>
        </span>
      </div>
    </div>
  );
}
