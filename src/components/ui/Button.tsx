"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, MQ, useGSAP } from "@/animations/gsap";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/cn";

type Variant = "ink" | "bone" | "line" | "line-light" | "glass";
type Icon = "arrow" | "up-right" | "down" | "none";

type BaseProps = {
  children: string;
  variant?: Variant;
  icon?: Icon;
  size?: "md" | "lg";
  className?: string;
  magnetic?: boolean;
  ariaLabel?: string;
};

type LinkProps = BaseProps & {
  href: string;
  /** In-page section id → smooth scroll instead of a jump. */
  section?: string;
  external?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const VARIANTS: Record<Variant, { root: string; dot: string }> = {
  ink: { root: "bg-ink text-bone hover:bg-abyss", dot: "bg-bone text-ink" },
  bone: { root: "bg-bone text-ink hover:bg-white", dot: "bg-ink text-bone" },
  line: { root: "border border-ink/20 text-ink hover:border-ink/60", dot: "bg-ink text-bone" },
  "line-light": { root: "border border-bone/25 text-bone hover:border-bone/70", dot: "bg-bone text-ink" },
  glass: { root: "bg-bone/10 text-bone backdrop-blur-md border border-bone/15 hover:bg-bone/20", dot: "bg-bone text-ink" },
};

const ICONS: Record<Exclude<Icon, "none">, typeof ArrowRight> = {
  arrow: ArrowRight,
  "up-right": ArrowUpRight,
  down: ArrowDown,
};

/** Pill button / link with rolling label, arrow dot and optional magnetic pull. */
export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = "ink", icon = "arrow", size = "md", className, magnetic = true, ariaLabel } = props;
  const ref = useRef<HTMLElement>(null);
  const v = VARIANTS[variant];
  const IconCmp = icon === "none" ? null : ICONS[icon];

  // Magnetic hover — fine pointers only, disabled for reduced motion.
  useGSAP(
    () => {
      if (!magnetic || !ref.current) return;
      const el = ref.current;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { dependencies: [magnetic] },
  );

  const classes = cn(
    "group relative inline-flex items-center justify-between gap-4 rounded-full font-medium whitespace-nowrap tracking-[-0.01em] transition-colors duration-500 select-none",
    size === "lg" ? "h-[3.75rem] pl-7 pr-2 text-[1.0625rem]" : "h-[3.25rem] pl-6 pr-1.5 text-[0.95rem]",
    icon === "none" && "justify-center px-6",
    v.root,
    "disabled:pointer-events-none disabled:opacity-60",
    className,
  );

  const inner: ReactNode = (
    <>
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {IconCmp && (
        <span
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.06]",
            size === "lg" ? "size-11" : "size-10",
            v.dot,
          )}
          aria-hidden="true"
        >
          <IconCmp className="size-[1.05rem] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-[180%]" strokeWidth={1.6} />
          <IconCmp className="absolute size-[1.05rem] -translate-x-[180%] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-0" strokeWidth={1.6} />
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, section, external, onClick } = props;
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          onClick?.(e);
          if (section && !e.defaultPrevented) {
            e.preventDefault();
            scrollToSection(section);
          }
        }}
      >
        {inner}
      </a>
    );
  }

  const { type = "button", disabled, onClick } = props;
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}

/** Understated text link with drawn underline and arrow. */
export function TextLink({
  children,
  href,
  section,
  className,
}: {
  children: string;
  href: string;
  section?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (section) {
          e.preventDefault();
          scrollToSection(section);
        }
      }}
      className={cn("group inline-flex items-center gap-2 text-[0.95rem] font-medium", className)}
    >
      <span className="link-line pb-0.5">{children}</span>
      <ArrowUpRight
        className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.6}
        aria-hidden="true"
      />
    </a>
  );
}
