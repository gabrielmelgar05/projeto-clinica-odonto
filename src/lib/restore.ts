"use client";

/**
 * Remembers which section the visitor was reading when they switched
 * language, so the new locale opens at the same place.
 */
const KEY = "eter:restore";
const MAX_AGE = 15_000;

type RestorePoint = { id: string; ratio: number; t: number };

/** Finds the section under the middle of the viewport and how far into it we are. */
export function captureRestorePoint(): RestorePoint | null {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
  const probe = window.innerHeight * 0.35;
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= probe && rect.bottom > probe) {
      const ratio = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      return { id: section.id, ratio, t: Date.now() };
    }
  }
  return null;
}

export function saveRestorePoint(point: RestorePoint | null) {
  if (!point) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(point));
  } catch {
    /* storage unavailable — switching still works, just from the top */
  }
}

export function consumeRestorePoint(): RestorePoint | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const point = JSON.parse(raw) as RestorePoint;
    if (Date.now() - point.t > MAX_AGE || typeof point.id !== "string") return null;
    return point;
  } catch {
    return null;
  }
}

/** Has the full intro already played in this browser session? */
export function introSeen(): boolean {
  try {
    return sessionStorage.getItem("eter:intro") === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem("eter:intro", "1");
  } catch {
    /* ignore */
  }
}
