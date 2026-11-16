/**
 * ─────────────────────────────────────────────────────────────
 *  Central image registry
 * ─────────────────────────────────────────────────────────────
 *  Drop files with these exact names into /public/images and they
 *  appear automatically — no component changes needed. Until a file
 *  exists, its slot renders a designed placeholder (no broken images,
 *  no 404s). See IMAGE_GUIDE.md for art direction and sizes.
 *
 *  `position` is the CSS object-position used to frame the photo
 *  (use it to keep faces / instruments in view across breakpoints).
 * ─────────────────────────────────────────────────────────────
 */
export type SiteImage = {
  src: string;
  /** Aspect ratio the layout reserves (width / height), for reference. */
  ratio: string;
  position?: string;
  /** Placeholder surface tone, matching the expected photograph. */
  tone: "light" | "dark";
};

const img = (file: string, ratio: string, tone: SiteImage["tone"], position?: string): SiteImage => ({
  src: `/images/${file}`,
  ratio,
  tone,
  position,
});

export const siteImages = {
  hero: img("hero.webp", "16:10 (desktop) · 4:5 (mobile)", "dark", "50% 35%"),

  aboutReception: img("about-reception.webp", "4:5", "light"),
  aboutDetail: img("about-detail.webp", "3:2", "light"),

  treatmentGeneral: img("treatment-general.webp", "5:4", "dark"),
  treatmentCosmetic: img("treatment-cosmetic.webp", "5:4", "light"),
  treatmentOrthodontics: img("treatment-orthodontics.webp", "5:4", "dark"),
  treatmentImplants: img("treatment-implants.webp", "5:4", "dark"),
  treatmentWhitening: img("treatment-whitening.webp", "5:4", "light"),
  treatmentPreventive: img("treatment-preventive.webp", "5:4", "light"),

  techImaging: img("tech-imaging.webp", "4:5", "dark"),
  techPlanning: img("tech-planning.webp", "4:5", "dark"),
  techInstruments: img("tech-instruments.webp", "4:5", "dark"),
  techEquipment: img("tech-equipment.webp", "4:5", "dark"),
  techProcedures: img("tech-procedures.webp", "4:5", "dark"),

  expConsultation: img("experience-consultation.webp", "3:2", "light"),
  expPlanning: img("experience-planning.webp", "3:2", "light"),
  expTreatment: img("experience-treatment.webp", "3:2", "dark"),
  expCare: img("experience-care.webp", "3:2", "light"),

  dentist01: img("dentist-01.webp", "3:4", "light", "50% 20%"),
  dentist02: img("dentist-02.webp", "3:4", "light", "50% 20%"),
  dentist03: img("dentist-03.webp", "3:4", "light", "50% 20%"),
  dentist04: img("dentist-04.webp", "3:4", "light", "50% 20%"),

  philosophy: img("philosophy.webp", "1:1", "dark"),

  atelierReception: img("atelier-reception.webp", "16:10", "light"),
  atelierRoom: img("atelier-room.webp", "4:5", "light"),
  atelierEquipment: img("atelier-equipment.webp", "1:1", "dark"),
  atelierArchitecture: img("atelier-architecture.webp", "3:4", "light"),
  atelierAmbience: img("atelier-ambience.webp", "2:3", "light"),

  booking: img("booking.webp", "3:4", "dark"),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof siteImages;

/** File name (without folder) for a key — handy for labels and docs. */
export const imageFile = (key: ImageKey) => siteImages[key].src.split("/").pop() ?? "";
