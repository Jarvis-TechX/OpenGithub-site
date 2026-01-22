import { z } from "zod";

export const BuiltBySchema = z.object({
  username: z.string(),
  avatarUrl: z.string(),
  profileUrl: z.string()
});

export const TrendingRepositorySchema = z.object({
  rank: z.number(),
  fullname: z.string(),
  url: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stars: z.number().nullable(),
  forks: z.number().nullable(),
  currentPeriodStars: z.number().nullable(),
  builtBy: z.array(BuiltBySchema),
  is_new: z.boolean(),
  fetched_at: z.string(),
  dataset_type: z.string().optional(),
  source: z.string().optional(),
  quality_grade: z.enum(["A", "B"]).optional()
});

export const TrendingSnapshotSchema = z.object({
  schema_version: z.string(),
  since: z.enum(["daily", "weekly", "monthly"]),
  language: z.string(),
  language_slug: z.string(),
  date: z.string(),
  fetched_at: z.string(),
  items_count: z.number(),
  items: z.array(TrendingRepositorySchema),
  dataset_type: z.string().optional(),
  source: z.string().optional(),
  quality_grade: z.enum(["A", "B"]).optional()
});

export const LanguageOptionSchema = z.object({
  slug: z.string(),
  name: z.string()
});
