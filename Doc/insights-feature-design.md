# GitHub Trending 趋势分析功能设计方案

## 一、功能概述

### 1.1 目标

为 GitHub Trending 网站添加趋势分析功能，通过聚合多日的 archive 数据来提供更深层次的洞察：

- **热度分析**：发现最火项目、爆发式增长检测
- **排名变化追踪**：识别黑马项目和常青树项目
- **新项目发现**：追踪新上榜仓库的后续表现

### 1.2 设计原则

1. **复用现有模式**：遵循项目已有的代码风格、组件模式和数据层设计
2. **渐进式加载**：支持服务端渲染 + 客户端交互
3. **数据驱动**：所有分析基于已有的 archive 数据，不需要额外数据源

---

## 二、路由设计

### 2.1 URL 结构

```
/insights                              # 趋势分析首页 (默认 daily/all/7d)
/insights/[since]/[language]           # 指定时间周期和语言
```

### 2.2 URL 参数

| 参数 | 说明 | 可选值 | 默认值 |
|------|------|--------|--------|
| `since` | 数据粒度 | `daily`, `weekly`, `monthly` | `daily` |
| `language` | 编程语言 | 语言 slug | `all` |
| `period` (query) | 分析时段 | `7d`, `14d`, `30d` | `7d` |

### 2.3 路由文件结构

```
src/app/insights/
  ├── page.tsx                    # 重定向到默认路由
  └── [since]/
      └── [language]/
          ├── page.tsx            # 主页面
          └── loading.tsx         # 加载状态
```

---

## 三、页面结构设计

### 3.1 页面布局

```
┌─────────────────────────────────────────────────────────────┐
│  InsightsHero                                               │
│  - 标题: "Trending Insights"                                │
│  - 分析时段和语言描述                                         │
│  - 快速统计卡片                                              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  FilterBar                                                  │
│  - SinceSelector (复用)                                     │
│  - LanguageSelector (复用)                                  │
│  - PeriodSelector (新: 7d / 14d / 30d)                     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  InsightsTabs                                               │
│  ┌─────────┬──────────┬────────────┬────────────┐          │
│  │ Overview │ Hot      │ Rising     │ New        │          │
│  │ (概览)   │ (最热)   │ (上升)     │ (新项目)   │          │
│  └─────────┴──────────┴────────────┴────────────┘          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Tab Content                                                │
│  - Overview: 总览统计 + Top5 热门 + Top5 上升 + 新项目亮点    │
│  - Hot: 热度排行榜 (按累计星标/平均增长排序)                  │
│  - Rising: 上升项目 (显示排名变化 ↑5 ↓3)                     │
│  - New: 新上榜项目 (持续热门 vs 昙花一现)                     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 各 Tab 详细内容

#### Overview (概览)

| 模块 | 内容 |
|------|------|
| SummaryStats | 日期范围、快照数量、不同仓库数、新上榜数、最高星标增长 |
| TopPerformers | Top 5 最热项目 (按总星标数排序) |
| RisingStars | Top 5 上升最快 (按排名提升排序) |
| NewcomersHighlight | 新上榜且后续表现优异的项目 |

#### Hot (热度)

- 按累计热度、平均增长、峰值表现排序
- 显示出现次数、累计/平均星标增长

#### Rising (上升)

- 显示排名变化趋势 (↑ ↓ →)
- 按排名变化幅度排序
- 筛选持续上升的项目

#### New (新项目)

- 显示首次出现日期、在榜天数
- 筛选选项：全部 / 持续热门 / 昙花一现

---

## 四、指标定义与计算方式

### 4.1 核心指标概览

| 指标类别 | 指标名称 | 用途 |
|----------|----------|------|
| 热度指标 | 累计周期星标、平均周期星标、热度得分 | 衡量项目热门程度 |
| 排名指标 | 排名变化、最佳排名、平均排名 | 追踪排名趋势 |
| 留存指标 | 出现次数、留存率、是否持续热门 | 判断项目稳定性 |
| 时间指标 | 首次出现、最后出现、是否新项目 | 追踪项目生命周期 |

### 4.2 热度指标

#### 累计周期星标 (totalPeriodStars)

**定义**: 分析周期内，项目每次上榜时 `currentPeriodStars` 的总和。

**计算公式**:
```
totalPeriodStars = Σ snapshot.currentPeriodStars (for each appearance)
```

**数据来源**: `TrendingSnapshot.items[].currentPeriodStars` (当日/当周/当月新增星标)

**示例**: 项目在 7 天内上榜 5 次，每次的 currentPeriodStars 分别为 [120, 98, 150, 80, 110]，则 totalPeriodStars = 558

---

#### 平均周期星标 (avgPeriodStars)

**定义**: 累计周期星标除以出现次数，反映每次上榜的平均热度。

**计算公式**:
```
avgPeriodStars = totalPeriodStars / appearances
```

**示例**: totalPeriodStars = 558, appearances = 5, 则 avgPeriodStars = 111.6

---

#### 热度得分 (hotnessScore)

**定义**: 综合评估项目热度的复合指标，用于 Hot 排行榜排序。

**计算公式**:
```
hotnessScore = avgPeriodStars × retentionMultiplier × recencyBoost

其中:
- retentionMultiplier = 1 + (retentionRate × 0.5)    // 留存率加成 1.0 ~ 1.5
- recencyBoost = isRecentlyActive ? 1.2 : 1.0       // 最近活跃加成
- retentionRate = appearances / totalDays           // 留存率 0 ~ 1
- isRecentlyActive = 最后出现日期在近 3 天内
```

**排序规则**: hotnessScore 降序

---

### 4.3 排名指标

#### 排名变化 (rankChange)

**定义**: 首次出现排名与最后出现排名的差值，正数表示排名上升。

**计算公式**:
```
rankChange = firstRank - lastRank

// 注意: GitHub Trending 排名越小越好 (1 = 最热)
// 所以 firstRank=10, lastRank=3 → rankChange=7 (上升了 7 名)
```

**示例**: 项目从第 15 名上升到第 3 名，rankChange = 15 - 3 = 12

---

#### 最佳排名 (bestRank)

**定义**: 分析周期内达到的最高排名（数值最小）。

**计算公式**:
```
bestRank = Math.min(...ranks)
```

---

#### 平均排名 (avgRank)

**定义**: 分析周期内所有出现时排名的平均值。

**计算公式**:
```
avgRank = Σ ranks / appearances
```

---

#### 上升趋势判定 (isRising)

**定义**: 判断项目是否呈上升趋势。

**判定条件**:
```
isRising = rankChange > 0 && appearances >= 3 && avgRank < firstRank
```

需要同时满足:
1. 排名有提升 (rankChange > 0)
2. 出现次数足够 (≥3 次，排除偶然)
3. 平均排名优于首次排名 (确认持续上升)

---

### 4.4 留存指标

#### 出现次数 (appearances)

**定义**: 分析周期内项目出现在 Trending 榜单的天数。

**计算**: 统计项目在多少个快照中出现。

---

#### 留存率 (retentionRate)

**定义**: 出现次数占分析天数的比例。

**计算公式**:
```
retentionRate = appearances / totalDays

其中 totalDays 根据 period 参数:
- 7d  → totalDays = 7
- 14d → totalDays = 14
- 30d → totalDays = 30
```

**示例**: 7 天内出现 5 次，retentionRate = 5/7 ≈ 0.71 (71%)

---

#### 持续热门 (isSustained)

**定义**: 项目是否在分析周期内保持稳定热度。

**判定条件**:
```
isSustained = retentionRate >= 0.5
```

留存率 ≥ 50% 视为持续热门。

---

#### 昙花一现 (isFlash)

**定义**: 项目是否只短暂出现就消失。

**判定条件**:
```
isFlash = appearances <= 2 && retentionRate < 0.3
```

出现次数 ≤2 且留存率 < 30%。

---

### 4.5 时间指标

#### 首次出现日期 (firstSeen)

**定义**: 分析周期内项目首次出现在榜单的日期。

**计算**: 取 records 中最早的日期。

---

#### 最后出现日期 (lastSeen)

**定义**: 分析周期内项目最后一次出现在榜单的日期。

**计算**: 取 records 中最晚的日期。

---

#### 新项目判定 (isNew)

**定义**: 项目是否是分析周期内的新上榜项目。

**判定条件**:
```
isNew = firstSeen >= periodStartDate && repo.isNew === true (at first appearance)

// 或简化版: 首次出现时原始数据中 isNew 标记为 true
```

---

### 4.6 统计摘要指标

| 指标 | 计算方式 |
|------|----------|
| totalUniqueRepos | 分析周期内出现的不同仓库总数 |
| newRepos | isNew === true 的仓库数量 |
| risingRepos | isRising === true 的仓库数量 |
| sustainedRepos | isSustained === true 的仓库数量 |
| flashRepos | isFlash === true 的仓库数量 |
| topStarsGrowth | max(totalPeriodStars) 最高累计星标增长 |
| avgAppearances | Σ appearances / totalUniqueRepos 平均出现次数 |

---

### 4.7 排序算法

#### Hot 排序 (sortByHotness)
```typescript
repos.sort((a, b) => {
  const scoreA = a.avgPeriodStars * (1 + a.retentionRate * 0.5);
  const scoreB = b.avgPeriodStars * (1 + b.retentionRate * 0.5);
  return scoreB - scoreA;
});
```

#### Rising 排序 (sortByRising)
```typescript
repos
  .filter(r => r.isRising)
  .sort((a, b) => {
    // 主排序: 排名变化
    if (b.rankChange !== a.rankChange) return b.rankChange - a.rankChange;
    // 次排序: 出现次数 (稳定性)
    return b.appearances - a.appearances;
  });
```

#### New 排序 (sortByNew)
```typescript
repos
  .filter(r => r.isNew)
  .sort((a, b) => {
    // 主排序: 是否持续热门
    if (a.isSustained !== b.isSustained) return a.isSustained ? -1 : 1;
    // 次排序: 平均周期星标
    return b.avgPeriodStars - a.avgPeriodStars;
  });
```

---

## 五、数据模型设计

### 5.1 新增类型 (`src/lib/types.ts`)

```typescript
export type AnalysisPeriod = "7d" | "14d" | "30d";

export type RepoTrendData = {
  fullname: string;
  url: string;
  description: string | null;
  language: string | null;

  // 聚合数据
  appearances: number;           // 出现次数
  totalPeriodStars: number;      // 累计周期星标
  avgPeriodStars: number;        // 平均周期星标
  latestStars: number | null;    // 最新总星标
  latestForks: number | null;    // 最新 forks

  // 排名数据
  ranks: number[];               // 历史排名数组
  firstRank: number;             // 首次排名
  lastRank: number;              // 最后排名
  bestRank: number;              // 最佳排名
  rankChange: number;            // 排名变化 (正数=上升)

  // 时间数据
  firstSeen: string;             // 首次出现日期
  lastSeen: string;              // 最后出现日期

  // 分类标签
  isNew: boolean;                // 分析期内是否为新项目
  isRising: boolean;             // 是否上升趋势
  isSustained: boolean;          // 是否持续热门 (出现 >50% 天数)
  isFlash: boolean;              // 是否昙花一现 (只出现 1-2 次)

  builtBy: BuiltBy[];
};

export type InsightsData = {
  since: Since;
  language: string;
  languageSlug: string;
  period: AnalysisPeriod;

  dateRange: { start: string; end: string };
  snapshotCount: number;
  analyzedDates: string[];

  repos: RepoTrendData[];

  summary: {
    totalUniqueRepos: number;
    newRepos: number;
    risingRepos: number;
    sustainedRepos: number;
    flashRepos: number;
    topStarsGrowth: number;
    avgAppearances: number;
  };
};
```

### 5.2 聚合算法核心逻辑

```typescript
function aggregateSnapshots(snapshots: TrendingSnapshot[]): InsightsData {
  // 1. 建立仓库出现记录映射
  const repoRecords = new Map<string, RepoRecord[]>();

  for (const snapshot of snapshots) {
    for (const repo of snapshot.items) {
      const records = repoRecords.get(repo.fullname) || [];
      records.push({ date, rank, stars, currentPeriodStars, isNew, repo });
      repoRecords.set(repo.fullname, records);
    }
  }

  // 2. 计算每个仓库的趋势数据
  for (const [fullname, records] of repoRecords) {
    const appearances = records.length;
    const ranks = records.map(r => r.rank);
    const rankChange = ranks[0] - ranks[ranks.length - 1]; // 正=上升

    const retentionRate = appearances / totalDays;
    const isSustained = retentionRate >= 0.5;
    const isFlash = appearances <= 2;
    const isRising = rankChange > 0 && appearances >= 3;

    // ... 生成 RepoTrendData
  }

  // 3. 计算统计摘要
  return { repos, summary, ... };
}
```

---

## 六、组件设计

### 6.1 新增组件列表

```
src/components/insights/
  ├── InsightsView.tsx          # 主视图容器
  ├── InsightsHero.tsx          # 顶部 Hero
  ├── InsightsTabs.tsx          # 标签页切换
  ├── SummaryStats.tsx          # 统计摘要卡片
  ├── TopPerformers.tsx         # 热门项目列表
  ├── RisingStars.tsx           # 上升项目列表
  ├── NewcomersHighlight.tsx    # 新项目亮点
  ├── InsightRepoCard.tsx       # 趋势仓库卡片
  ├── RankTrendBadge.tsx        # 排名趋势徽章 (↑5 ↓3 →)
  └── RetentionIndicator.tsx    # 留存率指示器

src/components/filters/
  └── PeriodSelector.tsx        # 时段选择器 (7d/14d/30d)
```

### 6.2 核心组件接口

```typescript
// InsightsView
export function InsightsView({
  data,
  languages
}: {
  data: InsightsData;
  languages: LanguageOption[];
});

// RankTrendBadge
export function RankTrendBadge({
  change,
  firstRank,
  lastRank
}: {
  change: number;    // >0 绿色↑, <0 红色↓, =0 灰色→
  firstRank: number;
  lastRank: number;
});
```

### 6.3 样式规范

- 复用现有 `Card`, `Badge`, `Chip` 组件
- 上升趋势: `text-success` (绿色)
- 下降趋势: `text-danger` (红色)
- 持平: `text-muted` (灰色)
- 新项目: `text-primary` (蓝色)

---

## 七、数据层实现

### 7.1 新增函数 (`src/lib/insights.ts`)

```typescript
// 获取指定时段的归档快照
export async function fetchArchiveRange(
  since: Since,
  language: string,
  period: AnalysisPeriod
): Promise<TrendingSnapshot[]>;

// 聚合快照生成趋势数据
export function aggregateSnapshots(
  snapshots: TrendingSnapshot[],
  since: Since,
  language: string,
  period: AnalysisPeriod
): InsightsData;

// 获取分析日期列表
export function getAnalysisDates(
  endDate: string,
  since: Since,
  period: AnalysisPeriod
): string[];

// 排序函数
export function sortByHotness(repos: RepoTrendData[]): RepoTrendData[];
export function sortByRising(repos: RepoTrendData[]): RepoTrendData[];
export function sortByNew(repos: RepoTrendData[]): RepoTrendData[];
```

### 7.2 数据获取策略

```typescript
async function fetchArchiveRange(since, language, period) {
  const dates = getAnalysisDates(getCurrentDate(), since, period);

  // 并行请求，容错处理
  const results = await Promise.allSettled(
    dates.map(date => fetchArchive(date, since, language))
  );

  const snapshots = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  // 至少需要 2 个快照
  if (snapshots.length < 2) {
    throw new Error('Insufficient data for analysis');
  }

  return snapshots;
}
```

### 7.3 URL 工具扩展 (`src/lib/url.ts`)

```typescript
export function pathInsights(
  since: Since,
  language: string,
  period?: AnalysisPeriod
): string;
```

---

## 八、实现步骤

### Phase 1: 基础架构

1. 添加新类型定义 (`src/lib/types.ts`)
2. 创建 insights 数据模块 (`src/lib/insights.ts`)
3. 扩展 URL 工具函数
4. 设置路由结构

### Phase 2: 数据层

1. 实现 `fetchArchiveRange`
2. 实现 `aggregateSnapshots` 算法
3. 添加排序/筛选函数
4. 测试验证

### Phase 3: UI 组件

1. 创建 `InsightsView` 主视图
2. 创建 Hero、Tabs 组件
3. 创建 `InsightRepoCard` 和徽章组件
4. 创建 `PeriodSelector`
5. 实现各 Tab 内容组件

### Phase 4: 集成测试

1. 创建 `/insights` 页面
2. 添加 loading/error 状态
3. Header 导航添加入口
4. 端到端测试

---

## 九、关键文件

| 文件 | 作用 |
|------|------|
| `src/lib/types.ts` | 添加新类型定义 |
| `src/lib/data.ts` | 扩展数据获取函数 |
| `src/lib/insights.ts` | 新增，趋势分析核心逻辑 |
| `src/lib/url.ts` | 添加 `pathInsights` |
| `src/components/trending/TrendingView.tsx` | 参考模式 |
| `src/components/trending/RepoCard.tsx` | 扩展基础 |
| `src/components/layout/Header.tsx` | 添加导航入口 |

---

## 十、可选扩展

### 10.1 图表可视化

使用 `recharts` 或原生 SVG：
- 排名趋势折线图
- 星标增长柱状图
- 语言分布饼图

### 10.2 对比功能

- 不同时段对比 (本周 vs 上周)
- 不同语言对比

### 10.3 数据导出

- 导出分析结果为 JSON/CSV
