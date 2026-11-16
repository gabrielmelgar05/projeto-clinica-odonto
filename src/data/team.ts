import type { ImageKey } from "@/config/images";

/**
 * Fictional team. Names are not translated; roles, focus areas and bios
 * live in the dictionaries under `team.members.<id>`.
 */
export const team = [
  { id: "helena", name: "Dr. Helena Vasconcelos", first: "Helena", last: "Vasconcelos", image: "dentist01" },
  { id: "rafael", name: "Dr. Rafael Okamoto", first: "Rafael", last: "Okamoto", image: "dentist02" },
  { id: "marina", name: "Dr. Marina Albuquerque", first: "Marina", last: "Albuquerque", image: "dentist03" },
  { id: "thiago", name: "Dr. Thiago Lemos", first: "Thiago", last: "Lemos", image: "dentist04" },
] as const satisfies ReadonlyArray<{ id: string; name: string; first: string; last: string; image: ImageKey }>;

export type TeamMemberId = (typeof team)[number]["id"];
