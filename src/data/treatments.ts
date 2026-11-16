import type { ImageKey } from "@/config/images";

export const treatmentIds = [
  "general",
  "cosmetic",
  "orthodontics",
  "implants",
  "whitening",
  "preventive",
] as const;

export type TreatmentId = (typeof treatmentIds)[number];

export const treatmentImages: Record<TreatmentId, ImageKey> = {
  general: "treatmentGeneral",
  cosmetic: "treatmentCosmetic",
  orthodontics: "treatmentOrthodontics",
  implants: "treatmentImplants",
  whitening: "treatmentWhitening",
  preventive: "treatmentPreventive",
};
