import type { Since, AnalysisPeriod, TrendingSnapshot, RepoTrendData, InsightsData, TrendingRepository } from "@/lib/types";
import { fetchArchive } from "@/lib/data";
import { getDaysAgo, periodToDays } from "@/lib/date";

/**
 * 获取分析日期列表（从最近的日期往前推）
 * @param period 分析周期
 * @returns 日期列表（YYYY-MM-DD 格式）
 */
export function getAnalysisDates(period: AnalysisPeriod): string[] {
  const days = periodToDays(period);
  const dates: string[] = [];

  // 固定使用 daily 快照，步长为 1
  for (let i = 0; i < days; i++) {
    dates.push(getDaysAgo(i));
  }

  return dates;
}

/**
 * 批量获取 archive 数据
 * @param dates 日期列表
 * @param language 语言筛选
 * @returns 成功获取的快照列表
 */
export async function fetchArchiveRange(
  dates: string[],
  language: string
): Promise<TrendingSnapshot[]> {
  const snapshots: TrendingSnapshot[] = [];

  // 固定使用 daily 快照
  const since = "daily";

  // 并发获取所有数据
  const results = await Promise.allSettled(
    dates.map((date) => fetchArchive(date, since, language))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      snapshots.push(result.value);
    }
    // 忽略失败的请求（可能某些日期没有数据）
  }

  return snapshots;
}

/**
 * 聚合多个快照，计算趋势数据
 * @param snapshots 快照列表
 * @returns 仓库趋势数据映射（fullname -> RepoTrendData）
 */
function aggregateSnapshots(snapshots: TrendingSnapshot[]): Map<string, RepoTrendData> {
  const repoMap = new Map<string, {
    latestRepo: TrendingRepository;
    ranks: number[];
    periodStars: number[];
    appearances: number;
    wasNew: boolean; // 是否曾被标记为新项目
  }>();

  // 按日期排序（最新的在前）
  const sorted = [...snapshots].sort((a, b) => b.date.localeCompare(a.date));

  // 遍历所有快照，收集数据
  for (const snapshot of sorted) {
    for (const repo of snapshot.items) {
      const key = repo.fullname;

      if (!repoMap.has(key)) {
        repoMap.set(key, {
          latestRepo: repo,
          ranks: [],
          periodStars: [],
          appearances: 0,
          wasNew: false
        });
      }

      const data = repoMap.get(key)!;
      data.appearances++;
      data.ranks.push(repo.rank);

      // 记录是否曾被标记为新项目
      if (repo.is_new) {
        data.wasNew = true;
      }

      if (repo.currentPeriodStars !== null) {
        data.periodStars.push(repo.currentPeriodStars);
      }
    }
  }

  // 计算趋势指标
  const result = new Map<string, RepoTrendData>();

  for (const [fullname, data] of repoMap.entries()) {
    const { latestRepo, ranks, periodStars, appearances, wasNew } = data;

    // 计算平均排名
    const avgRank = ranks.reduce((sum, r) => sum + r, 0) / ranks.length;

    // 计算最佳排名（最小值）
    const bestRank = Math.min(...ranks);

    // 计算最新排名
    const latestRank = ranks[0] ?? 999;

    // 计算排名趋势
    let rankTrend: "rising" | "falling" | "stable" = "stable";
    if (ranks.length >= 2) {
      const recent = ranks.slice(0, Math.ceil(ranks.length / 2));
      const older = ranks.slice(Math.ceil(ranks.length / 2));
      const recentAvg = recent.reduce((sum, r) => sum + r, 0) / recent.length;
      const olderAvg = older.reduce((sum, r) => sum + r, 0) / older.length;

      // 排名越小越好，所以 recentAvg < olderAvg 表示上升
      if (recentAvg < olderAvg - 5) rankTrend = "rising";
      else if (recentAvg > olderAvg + 5) rankTrend = "falling";
    }

    // 计算周期内 stars 总和
    const periodStarsSum = periodStars.reduce((sum, s) => sum + s, 0);

    // 总 stars（取最新值）
    const totalStars = latestRepo.stars ?? 0;

    result.set(fullname, {
      repo: latestRepo,
      appearances,
      avgRank,
      bestRank,
      latestRank,
      rankTrend,
      totalStars,
      periodStarsSum,
      wasNew
    });
  }

  return result;
}

/**
 * 按热度排序（周期内 stars 总和）
 */
export function sortByHotness(repos: RepoTrendData[]): RepoTrendData[] {
  return [...repos].sort((a, b) => {
    // 先按 periodStarsSum 降序
    if (b.periodStarsSum !== a.periodStarsSum) {
      return b.periodStarsSum - a.periodStarsSum;
    }
    // 再按出现次数降序
    if (b.appearances !== a.appearances) {
      return b.appearances - a.appearances;
    }
    // 最后按平均排名升序
    return a.avgRank - b.avgRank;
  });
}

/**
 * 按上升趋势排序
 */
export function sortByRising(repos: RepoTrendData[]): RepoTrendData[] {
  return [...repos].sort((a, b) => {
    // 优先上升的
    const trendScore = (r: RepoTrendData) => {
      if (r.rankTrend === "rising") return 2;
      if (r.rankTrend === "stable") return 1;
      return 0;
    };

    if (trendScore(b) !== trendScore(a)) {
      return trendScore(b) - trendScore(a);
    }

    // 再按平均排名升序（排名越小越好）
    if (a.avgRank !== b.avgRank) {
      return a.avgRank - b.avgRank;
    }

    // 最后按 periodStarsSum 降序
    return b.periodStarsSum - a.periodStarsSum;
  });
}

/**
 * 按新项目排序
 */
export function sortByNew(repos: RepoTrendData[]): RepoTrendData[] {
  return [...repos].sort((a, b) => {
    // 先按 periodStarsSum 降序
    if (b.periodStarsSum !== a.periodStarsSum) {
      return b.periodStarsSum - a.periodStarsSum;
    }
    // 再按最新排名升序
    return a.latestRank - b.latestRank;
  });
}

/**
 * 获取 Insights 分析数据
 * @param period 分析周期
 * @param language 语言筛选
 * @returns InsightsData
 */
export async function fetchInsights(
  period: AnalysisPeriod,
  language: string
): Promise<InsightsData> {
  // 获取日期列表
  const dates = getAnalysisDates(period);

  // 批量获取数据
  const snapshots = await fetchArchiveRange(dates, language);

  if (snapshots.length === 0) {
    throw new Error("No archive data available for the selected period");
  }

  // 聚合数据
  const repoMap = aggregateSnapshots(snapshots);
  const allRepos = Array.from(repoMap.values());

  // 提取语言信息（从第一个快照）
  const firstSnapshot = snapshots[0];
  const languageDisplay = firstSnapshot.language;
  const languageSlug = firstSnapshot.language_slug;

  // 计算日期范围
  const allDates = snapshots.map((s) => s.date).sort();
  const startDate = allDates[0];
  const endDate = allDates[allDates.length - 1];

  // 分类仓库
  const hottest = sortByHotness(allRepos).slice(0, 30);

  const risingCandidates = allRepos.filter((r) => r.appearances >= 2);
  const rising = sortByRising(risingCandidates).slice(0, 30);

  const newCandidates = allRepos.filter((r) => r.wasNew);
  const newProjects = sortByNew(newCandidates).slice(0, 30);

  return {
    period,
    language: languageDisplay,
    language_slug: languageSlug,
    startDate,
    endDate,
    snapshotCount: snapshots.length,
    totalRepos: allRepos.length,
    hottest,
    rising,
    newProjects
  };
}
