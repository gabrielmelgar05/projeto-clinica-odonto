import { cn } from "@/lib/cn";

/** Registration marks for frames — the "technical drawing" motif. */
export function CornerMarks({ className, size = 14 }: { className?: string; size?: number }) {
  const s = `${size}px`;
  const base = "absolute border-current";
  return (
    <span className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <span className={cn(base, "top-0 left-0 border-t border-l")} style={{ width: s, height: s }} />
      <span className={cn(base, "top-0 right-0 border-t border-r")} style={{ width: s, height: s }} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} style={{ width: s, height: s }} />
      <span className={cn(base, "right-0 bottom-0 border-r border-b")} style={{ width: s, height: s }} />
    </span>
  );
}

/** Dimension line: |←—— label ——→| */
export function Dimension({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-3 t-label", className)} aria-hidden="true">
      <span className="h-3 w-px bg-current opacity-50" />
      <span className="h-px flex-1 bg-current opacity-30" data-dim-line />
      <span className="whitespace-nowrap opacity-70">{label}</span>
      <span className="h-px flex-1 bg-current opacity-30" data-dim-line />
      <span className="h-3 w-px bg-current opacity-50" />
    </span>
  );
}
