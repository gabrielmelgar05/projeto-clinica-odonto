"use client";

import { gsap, prefersReducedMotion } from "@/animations/gsap";

/**
 * Smoothly scrolls to a section by id (GSAP ScrollToPlugin), keeps the URL
 * hash in sync without jumping, and moves keyboard focus to the section.
 */
export function scrollToSection(id: string, opts: { focus?: boolean; immediate?: boolean } = {}) {
  const { focus = true, immediate = false } = opts;
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;

  const distance = Math.abs(el.getBoundingClientRect().top);
  const duration = immediate || prefersReducedMotion() ? 0 : Math.min(2.2, 0.9 + distance / 4000);

  gsap.to(window, {
    duration,
    ease: "expo.inOut",
    overwrite: "auto",
    scrollTo: { y: id === "top" ? 0 : el, autoKill: true },
    onComplete: () => {
      if (focus && id !== "top") {
        const target = el.querySelector<HTMLElement>("[data-section-focus]") ?? el;
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    },
  });

  const hash = id === "top" ? "" : `#${id}`;
  history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`);
}
