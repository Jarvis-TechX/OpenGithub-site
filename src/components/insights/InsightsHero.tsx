import type { InsightsData } from "@/lib/types";

export function InsightsHero({ data }: { data: InsightsData }) {
  const periodLabel = data.period === "7d" ? "7 days" : data.period === "14d" ? "14 days" : "30 days";

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Insights{" "}
        <span className="text-muted">
          · {data.language}
        </span>
      </h1>
      <p className="text-sm text-muted">
        Trending analysis over {periodLabel} · {data.startDate} to {data.endDate}
      </p>
    </div>
  );
}
