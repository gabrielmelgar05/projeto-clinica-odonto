"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/animations/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { LogoSymbol } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { navItems, siteConfig } from "@/config/site";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/**
 * Full-screen menu that opens like a lens aperture from the menu button,
 * then lifts each link out of a mask. Focus is trapped while open, Esc
 * closes it and focus returns to the button.
 */
export function MobileMenu({
  open,
  onClose,
  originRef,
  active,
}: {
  open: boolean;
  onClose: () => void;
  originRef: RefObject<HTMLButtonElement | null>;
  active: string;
}) {
  const { dict } = useSite();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pendingSection = useRef<string | null>(null);
  const wasOpen = useRef(false);

  const { contextSafe } = useGSAP({ scope: root });

  // Build & play the open / close timelines.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;

    const animate = contextSafe((opening: boolean) => {
      tl.current?.kill();
      const btn = originRef.current?.getBoundingClientRect();
      const x = btn ? btn.left + btn.width / 2 : window.innerWidth - 40;
      const y = btn ? btn.top + btn.height / 2 : 40;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const reduced = prefersReducedMotion();
      const q = gsap.utils.selector(el);

      if (opening) {
        html.classList.add("is-locked");
        tl.current = gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(
            el,
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: reduced ? 0 : 1.05, ease: "expo.inOut" },
          )
          .fromTo(
            q("[data-menu-link]"),
            { yPercent: 110 },
            { yPercent: 0, duration: reduced ? 0 : 1.1, stagger: 0.055, ease: "expo.out" },
            reduced ? 0 : 0.35,
          )
          .fromTo(
            q("[data-menu-fade]"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: reduced ? 0 : 0.8, stagger: 0.06, ease: "expo.out" },
            reduced ? 0 : 0.6,
          )
          .fromTo(q("[data-menu-symbol]"), { rotate: -60, autoAlpha: 0 }, { rotate: 0, autoAlpha: 0.08, duration: reduced ? 0 : 1.6, ease: "expo.out" }, 0.2)
          .add(() => q<HTMLElement>("[data-menu-link]")[0]?.focus({ preventScroll: true }), reduced ? 0 : 0.45);
      } else {
        tl.current = gsap
          .timeline({
            onComplete: () => {
              gsap.set(el, { autoAlpha: 0 });
              html.classList.remove("is-locked");
              const target = pendingSection.current;
              pendingSection.current = null;
              if (target) scrollToSection(target);
              else originRef.current?.focus({ preventScroll: true });
            },
          })
          .to(q("[data-menu-link]"), { yPercent: -110, duration: reduced ? 0 : 0.45, stagger: 0.03, ease: "power3.in" })
          .to(q("[data-menu-fade]"), { autoAlpha: 0, duration: reduced ? 0 : 0.3 }, 0)
          .to(el, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: reduced ? 0 : 0.8, ease: "expo.inOut" }, reduced ? 0 : 0.2);
      }
    });

    if (open) {
      wasOpen.current = true;
      animate(true);
    } else if (wasOpen.current) {
      wasOpen.current = false;
      animate(false);
    }
  }, [open, contextSafe, originRef]);

  // Esc to close, focus trap, close when resizing up to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !root.current) return;
      const focusables = Array.from(
        root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).concat(originRef.current ? [originRef.current] : []);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && onClose();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, onClose, originRef]);

  // Never leave the page locked if the component unmounts mid-animation.
  useEffect(() => () => document.documentElement.classList.remove("is-locked"), []);

  const go = (id: string) => {
    pendingSection.current = id;
    onClose();
  };

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={dict.a11y.mobileNav}
      inert={!open}
      className="invisible fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink text-bone lg:hidden"
      data-theme="dark"
    >
      <div data-menu-symbol className="pointer-events-none absolute -right-[30vw] -bottom-[18vh] w-[110vw] text-bone opacity-0" aria-hidden="true">
        <LogoSymbol stroke={0.6} />
      </div>

      <div className="shell relative flex min-h-full flex-1 flex-col pt-[calc(var(--nav-h)+3rem)] pb-8">
        <nav aria-label={dict.a11y.mobileNav}>
          <ol className="flex flex-col">
            {navItems.map((id, i) => (
              <li key={id} className="overflow-hidden border-b border-bone/10">
                <a
                  href={`#${id}`}
                  data-menu-link
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  aria-current={active === id ? "true" : undefined}
                  className="group flex items-baseline gap-4 py-3.5 text-[clamp(2.1rem,9vw,3.6rem)] leading-[1] tracking-[-0.04em]"
                >
                  <span className="t-label w-6 text-bone/40">0{i + 1}</span>
                  <span className={cn("transition-colors", active === id ? "text-clinic-soft" : "group-hover:text-clinic-soft")}>
                    {dict.nav.items[id]}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-auto flex flex-col gap-8 pt-12">
          <div data-menu-fade>
            <Button href="#contact" variant="bone" size="lg" magnetic={false} className="w-full sm:w-auto" onClick={(e) => { e.preventDefault(); go("contact"); }}>
              {dict.nav.cta}
            </Button>
          </div>
          <div data-menu-fade className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-1.5 text-[0.95rem] text-bone/70">
              <a className="link-line w-fit" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>
              <a className="link-line w-fit" href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>
              <span className="t-label mt-2 text-bone/40">{dict.nav.mobileFooter}</span>
            </div>
            <LanguageSwitcher tone="dark" onSwitch={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
