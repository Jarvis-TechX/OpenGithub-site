import { Badge } from "@/components/ui/Badge";

export function RankTrendBadge({ trend }: { trend: "rising" | "falling" | "stable" }) {
  if (trend === "rising") {
    return <Badge tone="success">↗ Rising</Badge>;
  }

  if (trend === "falling") {
    return <Badge tone="danger">↘ Falling</Badge>;
  }

  return <Badge tone="neutral">→ Stable</Badge>;
}
