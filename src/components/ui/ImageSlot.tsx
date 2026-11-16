"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { siteImages, imageFile, type ImageKey } from "@/config/images";
import { useSite } from "@/components/providers/SiteProvider";
import { LogoSymbol } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

type ImageSlotProps = {
  image: ImageKey;
  className?: string;
  /** next/image `sizes` — describe the rendered width for responsive loading. */
  sizes: string;
  priority?: boolean;
  /** Extra height (in %) above and below the media, for parallax drift. */
  bleed?: number;
  /** Override the dictionary alt text. Use "" for purely decorative images. */
  alt?: string;
  /** Show the small file/ratio label on the placeholder. */
  showLabel?: boolean;
  /** Where the placeholder label sits (move it away from overlaid captions). */
  labelPosition?: "bottom-left" | "top-left" | "top-right";
  mediaClassName?: string;
  style?: CSSProperties;
  "data-id"?: string;
  children?: ReactNode;
};

/**
 * A prepared image frame. If the file listed in config/images.ts exists in
 * /public/images it renders an optimised next/image; otherwise a designed
 * placeholder surface with the file name and ratio. Layout, masks and
 * animations are identical in both cases, so dropping a photo in is all
 * that's needed.
 *
 * Animation hooks: the frame is the clip-path target; `[data-slot-media]`
 * is the inner layer used for zoom / parallax.
 */
export function ImageSlot({
  image,
  className,
  sizes,
  priority = false,
  bleed = 0,
  alt,
  showLabel = true,
  labelPosition = "bottom-left",
  mediaClassName,
  style,
  "data-id": dataId,
  children,
}: ImageSlotProps) {
  const { images, dict } = useSite();
  const def = siteImages[image];
  const exists = images.has(image);
  const altText = alt ?? dict.images[image];

  return (
    <div className={cn("slot", className)} style={style} data-tone={def.tone} data-slot={image} data-id={dataId}>
      <div
        data-slot-media
        className={cn("slot-media absolute inset-x-0 will-change-transform", mediaClassName)}
        style={{ top: `-${bleed}%`, bottom: `-${bleed}%` }}
      >
        {exists ? (
          <Image
            src={def.src}
            alt={altText}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            style={{ objectPosition: def.position ?? "50% 50%" }}
          />
        ) : (
          <div className="slot-surface absolute inset-0" role={altText ? "img" : undefined} aria-label={altText || undefined}>
            <div className="slot-grid absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LogoSymbol className="w-[clamp(1.75rem,9%,3.25rem)] opacity-30" stroke={3} />
            </div>
          </div>
        )}
      </div>

      {!exists && showLabel && (
        <span
          className={cn(
            "pointer-events-none absolute z-[1] flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.08em] uppercase",
            def.tone === "dark" ? "text-bone/55" : "text-graphite/80",
          )}
          style={{
            [labelPosition === "top-right" ? "right" : "left"]: "clamp(1.75rem, 5%, 2.5rem)",
            [labelPosition === "bottom-left" ? "bottom" : "top"]: "clamp(1.75rem, 5%, 2.5rem)",
          }}
          aria-hidden="true"
        >
          <span className="size-1 rounded-full bg-current" />
          {imageFile(image)}
          <span className="opacity-60">· {def.ratio.split(" ")[0]}</span>
        </span>
      )}

      {children}
    </div>
  );
}
