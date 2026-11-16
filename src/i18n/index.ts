import en, { type Dictionary } from "./en";
import ptBR from "./pt-BR";
import type { Locale } from "./config";

export type { Dictionary };
export * from "./config";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "pt-br": ptBR,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Replaces `{token}` placeholders: format("Hi {name}", { name: "Ana" }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
