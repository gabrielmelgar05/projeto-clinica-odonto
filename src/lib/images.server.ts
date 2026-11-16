import fs from "node:fs";
import path from "node:path";
import { siteImages, imageFile, type ImageKey } from "@/config/images";

/**
 * Returns the image keys whose files exist in /public/images.
 * Runs on the server only (at build time for static pages, per request in dev),
 * so missing photos render placeholders instead of broken requests.
 */
export function getAvailableImages(): ImageKey[] {
  const dir = path.join(process.cwd(), "public", "images");
  let files: Set<string>;
  try {
    files = new Set(fs.readdirSync(dir));
  } catch {
    return [];
  }
  return (Object.keys(siteImages) as ImageKey[]).filter((key) => files.has(imageFile(key)));
}
