"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSite } from "@/components/providers/SiteProvider";
import { format, locales, localeMeta, LOCALE_COOKIE, type Locale } from "@/i18n";
import { captureRestorePoint, saveRestorePoint } from "@/lib/restore";
import { cn } from "@/lib/cn";

/**
 * EN / PT switch. Navigates to the localized route (/en ↔ /pt-br), stores
 * the preference in a cookie (used by the proxy on future visits) and
 * remembers the current section so the new language opens in place.
 */
export function LanguageSwitcher({ tone = "auto", className, onSwitch }: { tone?: "auto" | "light" | "dark"; className?: string; onSwitch?: () => void }) {
  const { locale, dict } = useSite();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const activeIndex = locales.indexOf(locale);

  const switchTo = (next: Locale) => {
    if (next === locale || pending) return;
    saveRestorePoint(captureRestorePoint());
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    onSwitch?.();
    startTransition(() => router.push(`/${next}`, { scroll: false }));
  };

  return (
    <div
      role="group"
      aria-label={dict.a11y.languageSwitcher}
      className={cn(
        "relative inline-grid grid-cols-2 items-center rounded-full p-1 font-mono text-[0.6875rem] tracking-[0.08em]",
        tone === "dark" && "bg-bone/8 text-bone ring-1 ring-bone/15",
        tone === "light" && "bg-ink/[0.045] text-ink ring-1 ring-ink/10",
        tone === "auto" && "bg-current/[0.06] ring-1 ring-current/15",
        pending && "opacity-60",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full transition-transform duration-700 ease-[var(--ease-expo)]",
          tone === "dark" ? "bg-bone" : tone === "light" ? "bg-ink" : "bg-current",
        )}
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {locales.map((l) => {
        const active = l === locale;
        const meta = localeMeta[l];
        return (
          <button
            key={l}
            type="button"
            lang={meta.htmlLang}
            onClick={() => switchTo(l)}
            aria-pressed={active}
            title={active ? format(dict.a11y.currentLanguage, { language: meta.name }) : format(dict.a11y.switchTo, { language: meta.name })}
            className={cn(
              "relative z-[1] flex h-8 min-w-11 items-center justify-center rounded-full px-3 transition-colors duration-500",
              active
                ? tone === "dark"
                  ? "text-ink"
                  : tone === "light"
                    ? "text-bone"
                    : "text-[var(--switch-active,var(--color-bone))]"
                : "opacity-70 hover:opacity-100",
            )}
          >
            {meta.short}
            <span className="sr-only"> — {meta.name}</span>
          </button>
        );
      })}
    </div>
  );
}
