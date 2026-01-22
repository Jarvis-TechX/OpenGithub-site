export type Since = "daily" | "weekly" | "monthly";

export const ALLOWED_SINCE = new Set<Since>(["daily", "weekly", "monthly"]);

export type BuiltBy = {
  username: string;
  avatarUrl: string;
  profileUrl: string;
};

export type TrendingRepository = {
  rank: number;
  fullname: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number | null;
  forks: number | null;
  currentPeriodStars: number | null;
  builtBy: BuiltBy[];
  is_new: boolean;
  fetched_at: string;
  dataset_type?: string;
  source?: string;
  quality_grade?: "A" | "B";
};

export type TrendingSnapshot = {
  schema_version: string;
  since: Since;
  language: string;
  language_slug: string;
  date: string; // YYYY-MM-DD
  fetched_at: string; // ISO8601
  items_count: number;
  items: TrendingRepository[];
  dataset_type?: string;
  source?: string;
  quality_grade?: "A" | "B";
};

export type LanguageOption = {
  slug: string;
  name: string;
};
