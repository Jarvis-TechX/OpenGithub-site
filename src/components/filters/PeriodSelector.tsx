import Link from "next/link";
import type { AnalysisPeriod } from "@/lib/types";
import { cn } from "@/lib/cn";
import { pathInsights } from "@/lib/url";

export function PeriodSelector({
  period,
  language
}: {
  period: AnalysisPeriod;
  language: string;
}) {
  const items: Array<{ key: AnalysisPeriod; label: string }> = [
    { key: "7d", label: "7 days" },
    { key: "14d", label: "14 days" },
    { key: "30d", label: "30 days" }
  ];

  return (
    <div className="inline-flex rounded-md border border-border bg-surface p-1" role="group" aria-label="Period selector">
      {items.map((it) => {
        const active = it.key === period;
        return (
          <Link
            key={it.key}
            href={pathInsights(it.key, language)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap",
              active ? "bg-primary-weak text-primary" : "text-text-2 hover:bg-surface-2"
            )}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
