# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenGithub-site 是一个基于 Next.js 14 的 GitHub Trending 数据展示网站,支持查看每日/每周/每月的趋势仓库快照,并提供历史归档功能。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS
- **运行时**: Node.js
- **数据验证**: Zod

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (http://localhost:3000)

# 构建和部署
npm run build        # 生产构建
npm start            # 启动生产服务器

# 代码质量
npm run lint         # 运行 ESLint 检查

# 清理
npm run clean        # 清理 .next 和 .turbo 目录
```

## 数据源配置

项目通过环境变量配置数据源:

- `DATA_BASE_URL`: 远程数据源的基础 URL (默认: https://raw.githubusercontent.com/Jarvis-TechX/OpenGithub-data/main)
- `DATA_FALLBACK_TO_LOCAL`: 设为 `1` 强制使用本地数据
- `LOCAL_DATA_DIR`: 自定义本地数据目录 (默认: `../OpenGithub-data`)

数据优先级: 如果设置了 `DATA_BASE_URL` 则使用远程数据,否则自动检测并使用本地数据。

## 项目架构

### 路由结构

```
/                                    # 首页,自动重定向到可用的 trending 页面
/[since]/[language]                  # 最新 trending 页面
/archive/[date]/[since]/[language]   # 归档 trending 页面
/api/revalidate                      # 数据重新验证 API
```

### 核心模块

**数据层** (`src/lib/data.ts`)
- `fetchLatest()`: 获取最新 trending 数据
- `fetchArchive()`: 获取历史归档数据
- `fetchLanguages()`: 获取可用语言列表
- `normalizeSnapshot()`: 统一不同数据源格式到标准 schema
- 支持本地文件和远程 HTTP 两种数据源
- 支持嵌套目录结构 (`archive/YYYY/MM/DD/...`) 和扁平结构 (`archive/YYYY-MM-DD/...`)

**类型系统** (`src/lib/types.ts`)
- `TrendingSnapshot`: trending 快照数据结构
- `TrendingRepository`: 单个仓库信息
- `Since`: 时间范围类型 (daily/weekly/monthly)

**URL 工具** (`src/lib/url.ts`)
- `pathLatest()`: 生成最新 trending 页面路径
- `pathArchive()`: 生成归档页面路径
- `encodePathSegment()`: URL 路径段编码

**日期工具** (`src/lib/date.ts`)
- `shiftISODate()`: 根据 since 类型移动日期

### 组件结构

**布局组件** (`src/components/layout/`)
- `Header`: 顶部导航栏
- `Footer`: 底部信息
- `ThemeToggle`: 深色/浅色主题切换

**Trending 组件** (`src/components/trending/`)
- `TrendingView`: 主视图容器 (支持 latest/archive 模式)
- `RepoList`: 仓库列表
- `RepoCard`: 单个仓库卡片
- `BuiltByAvatars`: 贡献者头像列表
- `NewBadge`: 新仓库标识
- `Hero`: 顶部标题区域

**过滤器组件** (`src/components/filters/`)
- `SinceSelector`: 时间范围选择器 (daily/weekly/monthly)
- `LanguageSelector`: 编程语言选择器
- `DateNavigator`: 日期导航器 (仅 archive 模式)
- `DatePicker`: 日期选择器

**UI 组件** (`src/components/ui/`)
- `Card`: 卡片容器
- `Chip`: 标签芯片
- `Badge`: 徽章
- `Callout`: 提示框 (支持 info/warning/danger 等色调)

### 主题系统

- 使用 CSS 变量实现深色/浅色主题
- 主题状态存储在 `localStorage` 中 (`theme` 键)
- 支持系统偏好自动检测
- 无闪烁加载: 通过 inline script 在页面加载前初始化主题

### 数据模式

**标准 Snapshot Schema (v0.0.1)**
```typescript
{
  schema_version: "0.0.1",
  since: "daily" | "weekly" | "monthly",
  language: string,          // 显示名称
  language_slug: string,     // URL slug
  date: "YYYY-MM-DD",        // 上海时区日期
  fetched_at: string,        // ISO8601 时间戳
  items_count: number,
  items: TrendingRepository[],
  source?: string,
  quality_grade?: "A" | "B",
  dataset_type?: string
}
```

项目会自动兼容旧版数据格式 (带 `repositories` 字段的格式),并标准化为新 schema。

### 重要约定

1. **路径别名**: 使用 `@/*` 指向 `./src/*`
2. **TypeScript 严格模式**: `allowJs: false`, `strict: true`
3. **时区**: 日期统一使用上海时区 (Asia/Shanghai)
4. **Next.js App Router**: 所有页面使用 App Router 约定
5. **图片来源**: GitHub avatars 已配置为允许的远程图片域
6. **服务端渲染**: 首页和 trending 页面使用 `force-dynamic` 确保每次请求都是最新的
