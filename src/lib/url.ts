import type { Since } from "@/lib/types";

export function encodePathSegment(raw: string): string {
  return encodeURIComponent(raw);
}

export function pathLatest(since: Since, language: string): string {
  return `/${since}/${encodePathSegment(language)}`;
}

export function pathArchive(date: string, since: Since, language: string): string {
  return `/archive/${encodePathSegment(date)}/${since}/${encodePathSegment(language)}`;
}

export function buildHref(opts: { mode: "latest" | "archive"; since: Since; language: string; date?: string }): string {
  if (opts.mode === "archive") return pathArchive(opts.date ?? "", opts.since, opts.language);
  return pathLatest(opts.since, opts.language);
}

