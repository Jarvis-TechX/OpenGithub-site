import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { InsightsData } from "@/lib/types";

export function SummaryStats({ data }: { data: InsightsData }) {
  const periodLabel = data.period === "7d" ? "7 days" : data.period === "14d" ? "14 days" : "30 days";

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card className="p-4 rounded-md">
        <div className="text-xs text-muted">Analysis Period</div>
        <div className="mt-1 text-sm font-semibold text-text">{periodLabel}</div>
        <div className="mt-2 text-xs text-muted">
          {data.startDate} to {data.endDate}
        </div>
      </Card>

      <Card className="p-4 rounded-md">
        <div className="text-xs text-muted">Data Summary</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge tone="neutral">{data.snapshotCount} snapshots</Badge>
          <Badge tone="primary">{data.totalRepos} repos</Badge>
        </div>
      </Card>

      <Card className="p-4 rounded-md border-primary/30 bg-primary-weak/40">
        <div className="text-xs text-muted">About</div>
        <div className="mt-1 text-sm text-text-2">
          Trends are calculated from daily archive snapshots.
        </div>
      </Card>
    </div>
  );
}
