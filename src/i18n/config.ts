export const locales = ["en", "pt-br"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that remembers the visitor's language between visits. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeMeta: Record<
  Locale,
  { htmlLang: string; ogLocale: string; short: string; name: string }
> = {
  en: { htmlLang: "en", ogLocale: "en_US", short: "EN", name: "English" },
  "pt-br": { htmlLang: "pt-BR", ogLocale: "pt_BR", short: "PT", name: "Português (Brasil)" },
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
