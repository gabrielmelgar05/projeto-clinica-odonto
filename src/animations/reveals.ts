"use client";

import { gsap, SplitText, EASE } from "./gsap";

/**
 * Reusable animation primitives. Each one creates tweens/ScrollTriggers
 * inside whatever gsap.context() is active (useGSAP provides one), so
 * they are reverted automatically on unmount or locale change.
 *
 * All reveals use `once: true` — once content has appeared it stays
 * visible when the user scrolls back up (no disappearing elements).
 */

type SplitRevealOptions = {
  /** Split granularity. "lines" uses masked lines, "words" masked words. */
  by?: "lines" | "words";
  trigger?: Element | string;
  start?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** When false, no ScrollTrigger is attached (caller controls playback). */
  scroll?: boolean;
  paused?: boolean;
};

/** Masked line / word reveal powered by SplitText (re-splits on resize & font load). */
export function splitReveal(target: Element | null, opts: SplitRevealOptions = {}) {
  if (!target) return null;
  const {
    by = "lines",
    trigger,
    start = "top 86%",
    delay = 0,
    stagger = by === "lines" ? 0.09 : 0.035,
    duration = 1.25,
    scroll = true,
    paused = false,
  } = opts;

  let tween: gsap.core.Tween | null = null;

  const split = SplitText.create(target, {
    type: by === "lines" ? "lines" : "words,lines",
    mask: by,
    linesClass: "split-line",
    wordsClass: "split-word",
    autoSplit: true,
    aria: "auto",
    onSplit(self) {
      const parts = by === "lines" ? self.lines : self.words;
      tween = gsap.from(parts, {
        yPercent: 115,
        rotate: by === "lines" ? 2.5 : 0,
        transformOrigin: "0% 0%",
        duration,
        stagger,
        delay,
        ease: EASE.out,
        paused,
        scrollTrigger: scroll
          ? { trigger: trigger ?? target, start, once: true }
          : undefined,
      });
      return tween;
    },
  });

  return { split, get tween() { return tween; } };
}

/** Words fade from a muted tone to full strength, scrubbed with scroll. */
export function scrubWords(
  target: Element | null,
  opts: { start?: string; end?: string; from?: number; trigger?: Element } = {},
) {
  if (!target) return null;
  const { start = "top 78%", end = "bottom 52%", from = 0.16, trigger } = opts;
  return SplitText.create(target, {
    type: "words",
    wordsClass: "split-word",
    autoSplit: true,
    aria: "auto",
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: from },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: trigger ?? target, start, end, scrub: 0.6 },
        },
      );
    },
  });
}

type ClipFrom = "bottom" | "top" | "left" | "right" | "center";

const CLIP_START: Record<ClipFrom, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(50% 50% 50% 50%)",
};

/** Clip-path frame reveal, with the media inside settling from a slight zoom. */
export function clipReveal(
  frame: Element | null,
  opts: { from?: ClipFrom; start?: string; delay?: number; duration?: number; media?: Element | null } = {},
) {
  if (!frame) return null;
  const { from = "bottom", start = "top 88%", delay = 0, duration = 1.5, media } = opts;
  const tl = gsap.timeline({
    delay,
    scrollTrigger: { trigger: frame, start, once: true },
    defaults: { ease: EASE.inOut },
  });
  tl.fromTo(
    frame,
    { clipPath: CLIP_START[from] },
    { clipPath: "inset(0% 0% 0% 0%)", duration, clearProps: "clipPath" },
  );
  const inner = media ?? frame.querySelector("[data-slot-media]");
  if (inner) {
    tl.fromTo(inner, { scale: 1.28 }, { scale: 1, duration: duration + 0.4, ease: EASE.out }, 0);
  }
  return tl;
}

/** Scroll-linked vertical drift. Pair with an ImageSlot that has `bleed`. */
export function parallax(
  target: Element | null,
  opts: { trigger?: Element | null; amount?: number; start?: string; end?: string } = {},
) {
  if (!target) return null;
  const { trigger, amount = 10, start = "top bottom", end = "bottom top" } = opts;
  return gsap.fromTo(
    target,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: "none",
      scrollTrigger: { trigger: trigger ?? target, start, end, scrub: true },
    },
  );
}

/** Simple staggered rise for groups of small elements (labels, chips, rows). */
export function riseIn(
  targets: gsap.TweenTarget,
  opts: { trigger?: Element | null; start?: string; stagger?: number; y?: number; delay?: number } = {},
) {
  const { trigger, start = "top 88%", stagger = 0.08, y = 28, delay = 0 } = opts;
  return gsap.from(targets, {
    y,
    opacity: 0,
    duration: 1.1,
    stagger,
    delay,
    ease: EASE.out,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Draws SVG strokes (elements must use pathLength="1"). */
export function drawStrokes(
  targets: gsap.TweenTarget,
  opts: { trigger?: Element | null; start?: string; end?: string; scrub?: boolean | number; stagger?: number; duration?: number } = {},
) {
  const { trigger, start = "top 85%", end = "bottom 60%", scrub = false, stagger = 0.08, duration = 1.6 } = opts;
  return gsap.fromTo(
    targets,
    { attr: { "stroke-dasharray": "1 2", "stroke-dashoffset": 1 } },
    {
      attr: { "stroke-dashoffset": 0 },
      duration,
      stagger,
      ease: scrub ? "none" : EASE.inOut,
      scrollTrigger: trigger
        ? scrub
          ? { trigger, start, end, scrub }
          : { trigger, start, once: true }
        : undefined,
    },
  );
}
