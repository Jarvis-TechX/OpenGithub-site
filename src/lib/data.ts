import type { LanguageOption, Since, TrendingSnapshot } from "@/lib/types";
import { TrendingSnapshotSchema } from "@/lib/schemas";
import { encodePathSegment } from "@/lib/url";
import { shiftISODate } from "@/lib/date";
import { join } from "node:path";
import { existsSync } from "node:fs";

const DEFAULT_DATA_BASE_URL = "https://raw.githubusercontent.com/Jarvis-TechX/OpenGithub-data/main";

function getLocalDataDir(): string {
  const customDir = process.env.LOCAL_DATA_DIR;
  if (customDir) return customDir;
  return join(process.cwd(), "..", "OpenGithub-data");
}

function localDataAvailable(): boolean {
  try {
    const dir = getLocalDataDir();
    return existsSync(join(dir, "latest")) || existsSync(join(dir, "archive"));
  } catch {
    return false;
  }
}

function normalizeBaseUrl(raw: string): string {
  return raw.replace(/\/+$/, "");
}

export function preferLocalData(): boolean {
  if (process.env.DATA_FALLBACK_TO_LOCAL === "1") return true;
  if (process.env.DATA_BASE_URL && process.env.DATA_BASE_URL.trim().length > 0) return false;
  return localDataAvailable();
}

function buildLatestUrl(base: string, since: Since, language: string): string {
  return `${normalizeBaseUrl(base)}/latest/${since}/${encodePathSegment(language)}.json`;
}

function buildArchiveUrl(base: string, date: string, since: Since, language: string): string {
  const [y, m, d] = date.split("-");
  return `${normalizeBaseUrl(base)}/archive/${y}/${m}/${d}/${since}/${encodePathSegment(language)}.json`;
}

function buildArchiveUrlFlat(base: string, date: string, since: Since, language: string): string {
  return `${normalizeBaseUrl(base)}/archive/${encodePathSegment(date)}/${since}/${encodePathSegment(language)}.json`;
}

async function readLocalJson<T>(path: string): Promise<T> {
  const fs = await import("node:fs/promises");
  const raw = await fs.readFile(path, "utf8");
  return JSON.parse(raw) as T;
}

async function readLocalJsonOr404<T>(path: string): Promise<T> {
  try {
    return await readLocalJson<T>(path);
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      const e = new Error("Local file not found");
      (e as any).status = 404;
      throw e;
    }
    throw err;
  }
}

async function fileExists(path: string): Promise<boolean> {
  const fs = await import("node:fs/promises");
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function localArchiveSnapshotExists(
  date: string,
  since: Since,
  language: string
): Promise<boolean> {
  const [y, m, d] = date.split("-");
  const nested = join(getLocalDataDir(), "archive", y, m, d, since, `${language}.json`);
  const flat = join(getLocalDataDir(), "archive", date, since, `${language}.json`);
  return (await fileExists(nested)) || (await fileExists(flat));
}

export async function findAdjacentLocalArchiveDate(
  startDate: string,
  since: Since,
  language: string,
  delta: -1 | 1
): Promise<string | null> {
  const maxSteps = since === "daily" ? 60 : since === "weekly" ? 104 : 60;
  let date = startDate;
  for (let i = 0; i < maxSteps; i++) {
    const shifted = shiftISODate(date, since, delta);
    if (!shifted) return null;
    if (await localArchiveSnapshotExists(shifted, since, language)) return shifted;
    date = shifted;
  }
  return null;
}

async function listLocalLatestLanguages(): Promise<string[]> {
  const fs = await import("node:fs/promises");
  const dir = join(getLocalDataDir(), "latest", "daily");
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".json"))
      .map((e) => e.name.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

function displayNameForSlug(slug: string): string {
  const map: Record<string, string> = {
    all: "All languages",
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    go: "Go",
    rust: "Rust",
    java: "Java",
    kotlin: "Kotlin",
    swift: "Swift",
    ruby: "Ruby",
    php: "PHP",
    "c++": "C++",
    "c#": "C#",
    c: "C"
  };
  return map[slug] ?? slug;
}

function formatShanghaiDateFromTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid timestamp: ${timestamp}`);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!year || !month || !day) throw new Error(`Cannot format date from: ${timestamp}`);
  return `${year}-${month}-${day}`;
}

function normalizeSnapshot(raw: any): TrendingSnapshot {
  if (!raw || typeof raw !== "object") throw new Error("Invalid snapshot JSON");

  if (typeof raw.schema_version === "string" && Array.isArray(raw.items)) {
    const result = TrendingSnapshotSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(`Schema validation failed: ${result.error.message}`);
    }
    return result.data;
  }

  if (Array.isArray(raw.repositories)) {
    const fetchedAt: string = String(raw.timestamp ?? raw.fetched_at ?? "");
    const since: Since = raw.since;
    const languageSlug: string = String(raw.language ?? "all");
    const date = raw.date ? String(raw.date) : fetchedAt ? formatShanghaiDateFromTimestamp(fetchedAt) : "";

    const items = raw.repositories.map((r: any) => {
      const description = typeof r.description === "string" ? r.description.trim() : "";
      const fullname =
        String(r.full_name ?? r.fullname ?? "").trim() ||
        `${String(r.owner ?? "").trim()}/${String(r.repo_name ?? "").trim()}`.replace(/^\/|\/$/g, "");

      const periodStars =
        r.currentPeriodStars ??
        r.current_period_stars ??
        r.stars_today ??
        r.stars_this_week ??
        r.stars_this_month ??
        null;

      return {
        rank: Number(r.rank ?? 0),
        fullname,
        url: String(r.url ?? ""),
        description: description ? description : null,
        language: r.language == null ? null : String(r.language),
        stars: r.stars == null ? null : Number(r.stars),
        forks: r.forks == null ? null : Number(r.forks),
        currentPeriodStars: periodStars == null ? null : Number(periodStars),
        builtBy: Array.isArray(r.builtBy) ? r.builtBy : [],
        is_new: Boolean(r.is_new ?? r.isNew ?? false),
        fetched_at: fetchedAt
      };
    });

    return {
      schema_version: "0.0.1",
      since,
      language: languageSlug,
      language_slug: languageSlug,
      date,
      fetched_at: fetchedAt,
      items_count: Number(raw.total_count ?? items.length),
      items,
      source: "self",
      quality_grade: "A",
      dataset_type: "official_trending_archive"
    };
  }

  throw new Error("Unrecognized snapshot schema");
}

async function fetchJson<T>(url: string, timeoutMs = 10000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal
    });
    if (!res.ok) {
      const err = new Error(`Fetch failed with status ${res.status}`);
      (err as any).status = res.status;
      throw err;
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getDataBaseUrl(): string | null {
  const base = process.env.DATA_BASE_URL?.trim();
  if (base && base.length > 0) return normalizeBaseUrl(base);
  if (preferLocalData()) return null;
  return normalizeBaseUrl(DEFAULT_DATA_BASE_URL);
}

export async function fetchLatest(since: Since, language: string): Promise<TrendingSnapshot> {
  const base = getDataBaseUrl();
  if (base) return normalizeSnapshot(await fetchJson(buildLatestUrl(base, since, language)));

  if (preferLocalData()) {
    const path = join(getLocalDataDir(), "latest", since, `${language}.json`);
    return normalizeSnapshot(await readLocalJsonOr404(path));
  }

  throw new Error("DATA_BASE_URL is not set");
}

export async function fetchArchive(
  date: string,
  since: Since,
  language: string
): Promise<TrendingSnapshot> {
  const base = getDataBaseUrl();
  if (base) {
    try {
      return normalizeSnapshot(await fetchJson(buildArchiveUrl(base, date, since, language)));
    } catch (err: any) {
      if (err?.status !== 404) throw err;
      return normalizeSnapshot(await fetchJson(buildArchiveUrlFlat(base, date, since, language)));
    }
  }

  if (preferLocalData()) {
    const [y, m, d] = date.split("-");
    const nested = join(getLocalDataDir(), "archive", y, m, d, since, `${language}.json`);
    const flat = join(getLocalDataDir(), "archive", date, since, `${language}.json`);
    const path = (await fileExists(nested)) ? nested : flat;
    return normalizeSnapshot(await readLocalJsonOr404(path));
  }

  throw new Error("DATA_BASE_URL is not set");
}

export async function findNearestLocalArchiveDate(
  startDate: string,
  since: Since,
  language: string
): Promise<string | null> {
  if (!preferLocalData()) return null;

  const maxBackDays = since === "daily" ? 45 : since === "weekly" ? 120 : 370;
  let date = startDate;
  for (let i = 0; i <= maxBackDays; i++) {
    const [y, m, d] = date.split("-");
    const nested = join(getLocalDataDir(), "archive", y, m, d, since, `${language}.json`);
    const flat = join(getLocalDataDir(), "archive", date, since, `${language}.json`);
    if ((await fileExists(nested)) || (await fileExists(flat))) return date;

    const prev = shiftISODate(date, "daily", -1);
    if (!prev) return null;
    date = prev;
  }

  return null;
}

function normalizeLanguages(raw: unknown): LanguageOption[] {
  if (Array.isArray(raw)) {
    if (raw.every((x) => typeof x === "string")) {
      return (raw as string[]).map((slug) => ({ slug, name: slug }));
    }
    return (raw as any[])
      .map((x) => {
        if (x && typeof x === "object") {
          const slug = String((x as any).slug ?? (x as any).language_slug ?? (x as any).id ?? "");
          const name = String((x as any).name ?? (x as any).language ?? slug);
          if (!slug) return null;
          return { slug, name };
        }
        return null;
      })
      .filter(Boolean) as LanguageOption[];
  }
  if (raw && typeof raw === "object" && Array.isArray((raw as any).languages)) {
    return normalizeLanguages((raw as any).languages);
  }
  return [];
}

export async function fetchLanguages(): Promise<LanguageOption[]> {
  const base = getDataBaseUrl();
  const url = base ? `${base}/meta/languages.json` : null;

  let languages: LanguageOption[] = [];
  try {
    if (url) languages = normalizeLanguages(await fetchJson(url));
    else if (preferLocalData()) {
      const path = join(getLocalDataDir(), "meta", "languages.json");
      languages = normalizeLanguages(await readLocalJsonOr404(path));
    }
  } catch {
    languages = [];
  }

  if (languages.length === 0) {
    const localSlugs = preferLocalData() ? await listLocalLatestLanguages() : [];
    const fallback = [
      "all",
      "python",
      "javascript",
      "typescript",
      "go",
      "rust",
      "java",
      "c++",
      "c#",
      "c",
      "swift",
      "kotlin",
      "ruby",
      "php"
    ];
    const merged = localSlugs.length > 0 ? Array.from(new Set([...fallback, ...localSlugs])) : fallback;
    languages = merged.map((slug) => ({ slug, name: displayNameForSlug(slug) }));
  }

  const hasAll = languages.some((l) => l.slug === "all");
  const merged = hasAll ? languages : [{ slug: "all", name: "All languages" }, ...languages];
  const dedup = new Map<string, LanguageOption>();
  for (const item of merged) dedup.set(item.slug, item);
  return Array.from(dedup.values());
}
