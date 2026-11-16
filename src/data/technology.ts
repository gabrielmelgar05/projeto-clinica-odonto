import type { ImageKey } from "@/config/images";

/** Maps the technology chapters (dictionary `technology.items[].key`) to images. */
export const technologyImages: Record<string, ImageKey> = {
  imaging: "techImaging",
  planning: "techPlanning",
  instruments: "techInstruments",
  equipment: "techEquipment",
  procedures: "techProcedures",
};

export const experienceImages: ImageKey[] = ["expConsultation", "expPlanning", "expTreatment", "expCare"];
