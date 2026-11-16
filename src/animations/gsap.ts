"use client";

/**
 * Single place where GSAP and its plugins are registered.
 * Every component imports gsap from here, never from "gsap" directly,
 * so plugins are guaranteed to be registered exactly once.
 *
 * All plugins used (ScrollTrigger, SplitText, ScrollToPlugin) ship in the
 * public "gsap" npm package under the free Standard License.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  // Avoid refresh storms when the mobile URL bar shows / hides.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared media queries for gsap.matchMedia(). */
export const MQ = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
  quart: "power4.inOut",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduced).matches;
}

export { gsap, ScrollTrigger, SplitText, ScrollToPlugin, useGSAP };
