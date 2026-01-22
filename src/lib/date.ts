import type { Since } from "@/lib/types";

export function isISODate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function formatISODateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODateUTC(date: string): Date | null {
  if (!isISODate(date)) return null;
  const [y, m, d] = date.split("-").map((v) => Number(v));
  const utc = Date.UTC(y, m - 1, d);
  const parsed = new Date(utc);
  if (
    parsed.getUTCFullYear() !== y ||
    parsed.getUTCMonth() !== m - 1 ||
    parsed.getUTCDate() !== d
  ) {
    return null;
  }
  return parsed;
}

export function shiftISODate(date: string, since: Since, delta: number): string | null {
  const base = parseISODateUTC(date);
  if (!base) return null;
  const shifted = new Date(base);
  if (since === "daily") shifted.setUTCDate(shifted.getUTCDate() + delta);
  if (since === "weekly") shifted.setUTCDate(shifted.getUTCDate() + delta * 7);
  if (since === "monthly") shifted.setUTCMonth(shifted.getUTCMonth() + delta);
  return formatISODateUTC(shifted);
}

