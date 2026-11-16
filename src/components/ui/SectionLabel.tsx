import { cn } from "@/lib/cn";

/** "● (03) Technology & precision" — the recurring section signature. */
export function SectionLabel({
  index,
  children,
  className,
  as: Tag = "p",
  id,
}: {
  index: string;
  children: string;
  className?: string;
  as?: "p" | "h2" | "span";
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("t-label flex items-center gap-3", className)} data-label>
      <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
        <span className="absolute size-2 rounded-full border border-current opacity-40" />
        <span className="size-1 rounded-full bg-current" />
      </span>
      <span className="opacity-60" aria-hidden="true">({index})</span>
      <span>{children}</span>
    </Tag>
  );
}
