"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { LogoLockup } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { navItems } from "@/config/site";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

/**
 * Fixed navigation that:
 *  • condenses into a floating, blurred bar after the first scroll;
 *  • hides while scrolling down and returns on scroll up;
 *  • adapts its colours to the section underneath (data-theme);
 *  • highlights the section currently in view.
 */
export function Navbar() {
  const { dict, phase } = useSite();
  const wrap = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [active, setActive] = useState<string>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  // Entrance, synchronised with the preloader split.
  useGSAP(
    () => {
      if (phase === "loading" || !wrap.current) return;
      if (prefersReducedMotion()) {
        gsap.fromTo(wrap.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
        return;
      }
      gsap.fromTo(
        wrap.current.querySelectorAll("[data-nav-item]"),
        { yPercent: -120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1.2, stagger: 0.06, ease: "expo.out", delay: 0.75 },
      );
    },
    { dependencies: [phase === "loading"] },
  );

  // Scroll spy + direction-aware visibility (one rAF-throttled listener).
  useEffect(() => {
    const bar = wrap.current;
    if (!bar) return;
    let lastY = window.scrollY;
    let hidden = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const delta = y - lastY;
      // Large programmatic jumps (restoring position, anchors) are not gestures.
      const isJump = Math.abs(delta) > window.innerHeight;
      if (!menuOpenRef.current) {
        if (!isJump && delta > 6 && y > 480 && !hidden) {
          hidden = true;
          gsap.to(bar, { yPercent: -140, duration: 0.7, ease: "power3.inOut", overwrite: "auto" });
        } else if ((delta < -6 || y < 480) && hidden) {
          hidden = false;
          gsap.to(bar, { yPercent: 0, duration: 0.7, ease: "expo.out", overwrite: "auto" });
        }
      }
      lastY = y;

      // Theme of whatever sits under the bar.
      const stack = document.elementsFromPoint(window.innerWidth / 2, 34);
      const under = stack.find((node) => !bar.contains(node) && node.closest("[data-theme]"));
      const t = (under?.closest("[data-theme]") as HTMLElement | null)?.dataset.theme;
      setTheme(t === "dark" ? "dark" : "light");

      // Active section: the one crossing 40% of the viewport height.
      const probe = window.innerHeight * 0.4;
      const sections = document.querySelectorAll<HTMLElement>("main section[id]");
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          setActive(section.id);
          break;
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the bar visible whenever the menu is open.
  useEffect(() => {
    if (menuOpen && wrap.current) gsap.to(wrap.current, { yPercent: 0, duration: 0.4, overwrite: "auto" });
  }, [menuOpen]);

  const tone: Theme = menuOpen ? "dark" : theme;
  const condensed = scrolled && !menuOpen;
  // Sections without a nav entry (experience, philosophy, atelier) highlight nothing.
  const highlighted = (navItems as readonly string[]).includes(active) ? active : "";

  return (
    <>
      <header className={cn("pointer-events-none fixed inset-x-0 top-0", menuOpen ? "z-[80]" : "z-50")}>
        <div ref={wrap} className="shell pt-3 lg:pt-4">
          <div
            className={cn(
              "pointer-events-auto relative flex h-[3.6rem] items-center justify-between rounded-full pr-2 pl-4 transition-[background-color,color,box-shadow] duration-700 ease-[var(--ease-expo)] sm:pl-5",
              tone === "dark" ? "text-bone" : "text-ink",
              condensed &&
                (tone === "dark"
                  ? "bg-ink/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] ring-1 ring-bone/10 backdrop-blur-xl"
                  : "bg-bone/78 shadow-[0_10px_40px_-24px_rgba(16,17,18,0.35)] ring-1 ring-ink/[0.07] backdrop-blur-xl"),
            )}
          >
            <a
              href="#top"
              data-nav-item
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                scrollToSection("top");
              }}
              className="relative z-[1] flex items-center py-2 text-[15px]"
              aria-label={dict.a11y.homeLink}
            >
              <LogoLockup title="ÉTER Dental Atelier" />
            </a>

            <nav aria-label={dict.a11y.mainNav} className="hidden min-w-0 flex-1 justify-center px-4 lg:flex">
              <ul className="flex items-center gap-0.5">
                {navItems.map((id) => {
                  const current = highlighted === id;
                  return (
                    <li key={id} data-nav-item>
                      <a
                        href={`#${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(id);
                        }}
                        aria-current={current ? "true" : undefined}
                        className="group relative flex items-center rounded-full px-2.5 py-2 text-[0.875rem] tracking-[-0.01em] whitespace-nowrap xl:px-3.5"
                      >
                        <span className={cn("transition-opacity duration-500", current ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
                          {dict.nav.items[id]}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current transition-all duration-500 ease-[var(--ease-expo)]",
                            current ? "scale-100 opacity-100" : "scale-0 opacity-0",
                          )}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="relative z-[1] flex items-center gap-2">
              <div data-nav-item className="hidden sm:block">
                <LanguageSwitcher tone={tone} />
              </div>
              <div data-nav-item className="hidden md:block lg:hidden xl:block">
                <Button href="#contact" section="contact" variant={tone === "dark" ? "bone" : "ink"} magnetic={false}>
                  {dict.nav.cta}
                </Button>
              </div>
              <button
                ref={menuButton}
                type="button"
                data-nav-item
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
                className={cn(
                  "flex h-[3.25rem] items-center gap-3 rounded-full pr-2 pl-4 lg:hidden",
                  tone === "dark" ? "bg-bone/10" : "bg-ink/[0.06]",
                )}
              >
                <span className="t-label hidden min-[400px]:inline">{menuOpen ? dict.nav.close : dict.nav.menu}</span>
                <span className={cn("relative flex size-10 items-center justify-center rounded-full", tone === "dark" ? "bg-bone text-ink" : "bg-ink text-bone")}>
                  <span
                    className={cn(
                      "absolute h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-expo)]",
                      menuOpen ? "rotate-45" : "-translate-y-[3px]",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-expo)]",
                      menuOpen ? "-rotate-45" : "translate-y-[3px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} originRef={menuButton} active={highlighted} />
    </>
  );
}
