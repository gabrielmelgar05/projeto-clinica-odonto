/**
 * Global, non-translatable configuration.
 * Everything here is demonstrative — replace it before going live.
 */
export const siteConfig = {
  name: "ÉTER — Dental Atelier",
  shortName: "ÉTER",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://eter-atelier.example").replace(/\/$/, ""),

  contact: {
    phone: "+55 11 0000-0000",
    phoneHref: "tel:+551100000000",
    email: "hello@eter-atelier.example",
    emailHref: "mailto:hello@eter-atelier.example",
  },

  /** Social profiles. Add, remove or edit freely — the footer renders this list. */
  social: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
    { id: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/" },
  ],

  /** Studio credit shown in the footer. Leave `href` empty to render plain text. */
  credit: { label: "Aklio Studio", href: "" },

  /**
   * Booking integration. While empty, the form runs in demonstration mode
   * and nothing leaves the browser. See src/lib/booking.ts.
   */
  bookingEndpoint: process.env.NEXT_PUBLIC_BOOKING_ENDPOINT || "",
} as const;

/** Section ids, in page order. Used by the navbar, scroll-spy and language switch. */
export const sectionIds = [
  "top",
  "about",
  "treatments",
  "technology",
  "experience",
  "team",
  "philosophy",
  "atelier",
  "faq",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

/** Links shown in the navbar (in order). Labels live in the dictionaries. */
export const navItems = ["about", "treatments", "technology", "team", "faq", "contact"] as const;

export type NavItem = (typeof navItems)[number];
