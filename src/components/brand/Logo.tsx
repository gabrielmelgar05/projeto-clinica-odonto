import { cn } from "@/lib/cn";

/**
 * ÉTER identity — constructed entirely from strokes so every part can be
 * drawn with SVG animation.
 *
 * Symbol: an orbit (the "ether"), a horizon line, a soft arc beneath it
 * (a quiet smile, never a tooth icon) and a single 60° stroke — the acute
 * accent of the É, which also reads as a precision instrument / measuring
 * radius. The same 60° angle reappears in the wordmark's accent and in the
 * leg of the R.
 */

type MarkProps = {
  className?: string;
  /** Stroke width in SVG user units (tune per rendered size). */
  stroke?: number;
  /** Start invisible, ready for stroke-drawing animation. */
  draw?: boolean;
  title?: string;
};

export function LogoSymbol({ className, stroke = 4, draw = false, title }: MarkProps) {
  const d = draw ? "pl-draw" : undefined;
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="butt"
      className={cn("block overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle className={cn("sym-ring", d)} cx="60" cy="60" r="46" transform="rotate(-90 60 60)" pathLength={1} />
      <path className={cn("sym-horizon", d)} d="M60 60H6" pathLength={1} />
      <path className={cn("sym-horizon", d)} d="M60 60H114" pathLength={1} />
      <path className={cn("sym-arc", d)} d="M36 60A24 24 0 0 0 84 60" pathLength={1} />
      <path className={cn("sym-accent", d)} d="M60 60L88 11.5" pathLength={1} />
      <circle
        className="sym-dot"
        cx="60"
        cy="60"
        r={draw ? 0 : 3.6}
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** Wordmark letter paths — exported so the footer can scrub-draw them. */
export const WORDMARK_PATHS = {
  e1: "M22 0H0V40H22M0 20H18",
  t: "M36 0H62M49 0V40",
  e2: "M98 0H76V40H98M76 20H94",
  r: "M112 40V0H123A10 10 0 0 1 123 20H112M121 20L132.5 40",
  accent: "M7.5 -7L15 -20",
} as const;

export function LogoWordmark({ className, stroke = 4, draw = false, title }: MarkProps) {
  const d = draw ? "pl-draw" : undefined;
  return (
    <svg
      viewBox="-3 -23 140 66"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      className={cn("block overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path className={cn("wm-letter", d)} d={WORDMARK_PATHS.e1} pathLength={1} />
      <path className={cn("wm-letter", d)} d={WORDMARK_PATHS.t} pathLength={1} />
      <path className={cn("wm-letter", d)} d={WORDMARK_PATHS.e2} pathLength={1} />
      <path className={cn("wm-letter", d)} d={WORDMARK_PATHS.r} pathLength={1} />
      <path className={cn("wm-accent", d)} d={WORDMARK_PATHS.accent} pathLength={1} />
    </svg>
  );
}

/** Horizontal lockup used in the navbar and footer. */
export function LogoLockup({ className, title = "ÉTER Dental Atelier" }: { className?: string; title?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} role="img" aria-label={title}>
      <LogoSymbol className="h-[1.85em] w-auto" stroke={5.4} />
      <LogoWordmark className="h-[1.32em] w-auto" stroke={4.6} />
    </span>
  );
}
