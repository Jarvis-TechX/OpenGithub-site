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

// Insights 分析相关类型
export type AnalysisPeriod = "7d" | "14d" | "30d";

export const ALLOWED_ANALYSIS_PERIOD = new Set<AnalysisPeriod>(["7d", "14d", "30d"]);

export type RepoTrendData = {
  repo: TrendingRepository; // 最新快照中的仓库数据
  appearances: number; // 出现次数
  avgRank: number; // 平均排名
  bestRank: number; // 最佳排名
  latestRank: number; // 最新排名
  rankTrend: "rising" | "falling" | "stable"; // 排名趋势
  totalStars: number; // 累计 stars (取最新值)
  periodStarsSum: number; // 周期内 stars 总和 (累加所有 currentPeriodStars)
  wasNew: boolean; // 在分析周期内是否曾被标记为新项目
}

export type InsightsData = {
  period: AnalysisPeriod;
  language: string;
  language_slug: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  snapshotCount: number; // 实际获取到的快照数量
  totalRepos: number; // 去重后的仓库总数
  hottest: RepoTrendData[]; // 最热门 (按 periodStarsSum 排序)
  rising: RepoTrendData[]; // 上升最快 (按 rankTrend + avgRank 排序)
  newProjects: RepoTrendData[]; // 新项目 (is_new = true)
};
