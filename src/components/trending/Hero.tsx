import type { Since, TrendingSnapshot } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { titleForSince } from "@/lib/format";


export function Hero({
  mode,
  languageName,
  snapshot
}: {
  mode: "latest" | "archive";
  languageName: string;
  snapshot: TrendingSnapshot;
}) {
  const newCount = (snapshot.items ?? []).filter((x) => x.is_new).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Trending{" "}
          <span className="text-muted">
            · {languageName} · {titleForSince(snapshot.since)}
          </span>
        </h1>
        <p className="text-sm text-muted">
          {mode === "latest" ? "Latest snapshot" : "Archived snapshot"} · {snapshot.date} · Top{" "}
          {snapshot.items_count}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4 rounded-md">
          <div className="text-xs text-muted">Snapshot</div>
          <div className="mt-1 text-sm font-semibold text-text">{snapshot.date}</div>
          <div className="mt-2 text-xs text-muted">Fetched: {snapshot.fetched_at}</div>
        </Card>

        <Card className="p-4 rounded-md">
          <div className="text-xs text-muted">Highlights</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="neutral">{snapshot.items_count} repos</Badge>
            <Badge tone={newCount > 0 ? "primary" : "neutral"}>{newCount} new</Badge>
            <Badge tone="neutral">{titleForSince(snapshot.since)}</Badge>
          </div>
        </Card>

        <Card className={cn("p-4 rounded-md", "border-primary/30 bg-primary-weak/40")}>
          <div className="text-xs text-muted">Tips</div>
          <div className="mt-1 text-sm text-text-2">
            Use the language switcher and date nav. URLs are shareable.
          </div>
        </Card>
      </div>
    </div>
  );
}
