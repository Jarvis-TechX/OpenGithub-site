import Link from "next/link";
import type { Since } from "@/lib/types";
import { cn } from "@/lib/cn";
import { buildHref } from "@/lib/url";


export function SinceSelector({
  mode,
  since,
  language,
  date
}: {
  mode: "latest" | "archive";
  since: Since;
  language: string;
  date?: string;
}) {
  const items: Array<{ key: Since; label: string }> = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" }
  ];

  return (
    <div className="inline-flex rounded-md border border-border bg-surface p-1" role="group" aria-label="Time period selector">
      {items.map((it) => {
        const active = it.key === since;
        return (
          <Link
            key={it.key}
            href={buildHref({ mode, since: it.key, language, date })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
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
