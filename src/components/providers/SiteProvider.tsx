"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ScrollTrigger } from "@/animations/gsap";
import type { Dictionary, Locale } from "@/i18n";
import type { ImageKey } from "@/config/images";
import type { TreatmentId } from "@/data/treatments";
import { scrollToSection } from "@/lib/scroll";
import { consumeRestorePoint } from "@/lib/restore";

/**
 * Intro lifecycle shared by the preloader, navbar and hero:
 *   loading   → preloader on screen, scroll locked
 *   revealing → preloader opening, hero entrance plays in sync
 *   done      → preloader unmounted, ScrollTriggers refreshed
 */
export type IntroPhase = "loading" | "revealing" | "done";

type SiteContextValue = {
  locale: Locale;
  dict: Dictionary;
  images: ReadonlySet<ImageKey>;
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  requestedTreatment: TreatmentId | "not-sure" | null;
  requestTreatment: (id: TreatmentId | "not-sure") => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  locale,
  dict,
  images,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  images: ImageKey[];
  children: ReactNode;
}) {
  const [phase, setPhaseState] = useState<IntroPhase>("loading");
  const [requestedTreatment, setRequestedTreatment] = useState<SiteContextValue["requestedTreatment"]>(null);
  const available = useMemo(() => new Set(images), [images]);

  // Phases only move forward.
  const setPhase = useCallback((next: IntroPhase) => {
    const order: IntroPhase[] = ["loading", "revealing", "done"];
    setPhaseState((current) => (order.indexOf(next) > order.indexOf(current) ? next : current));
  }, []);

  const requestTreatment = useCallback((id: TreatmentId | "not-sure") => {
    setRequestedTreatment(id);
    scrollToSection("contact");
  }, []);

  // Once the intro is over: settle every ScrollTrigger, then restore the
  // reading position (after a language switch) or honour a URL hash.
  useEffect(() => {
    if (phase !== "done") return;
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    const restore = consumeRestorePoint();
    if (restore) {
      const el = document.getElementById(restore.id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + restore.ratio * el.offsetHeight;
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
        ScrollTrigger.update();
      }
      return;
    }

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && document.getElementById(hash)) {
      scrollToSection(hash, { focus: false });
    }
  }, [phase]);

  // Late font swaps change line lengths: re-measure triggers once fonts land.
  useEffect(() => {
    if (!("fonts" in document)) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({ locale, dict, images: available, phase, setPhase, requestedTreatment, requestTreatment }),
    [locale, dict, available, phase, setPhase, requestedTreatment, requestTreatment],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export const useDict = () => useSite().dict;
