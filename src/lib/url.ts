import type { Since, AnalysisPeriod } from "@/lib/types";

export function encodePathSegment(raw: string): string {
  return encodeURIComponent(raw);
}

export function pathLatest(since: Since, language: string): string {
  return `/${since}/${encodePathSegment(language)}`;
}

export function pathArchive(date: string, since: Since, language: string): string {
  return `/archive/${encodePathSegment(date)}/${since}/${encodePathSegment(language)}`;
}

export function buildHref(opts:
  | { mode: "latest"; since: Since; language: string }
  | { mode: "archive"; since: Since; language: string; date: string }
  | { mode: "insights"; period: AnalysisPeriod; language: string }
): string {
  if (opts.mode === "archive") return pathArchive(opts.date, opts.since, opts.language);
  if (opts.mode === "insights") return pathInsights(opts.period, opts.language);
  return pathLatest(opts.since, opts.language);
}

export function pathInsights(period: AnalysisPeriod, language: string): string {
  return `/insights/${period}/${encodePathSegment(language)}`;
}

