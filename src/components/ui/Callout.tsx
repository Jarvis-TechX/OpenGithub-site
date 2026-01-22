import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Callout({
  title,
  tone = "warning",
  children
}: {
  title: string;
  tone?: "neutral" | "warning" | "danger";
  children: ReactNode;
}) {
  const styles =
    tone === "danger"
      ? "border-danger/30 bg-danger/10"
      : tone === "neutral"
        ? "border-border bg-surface"
        : "border-warning/30 bg-warning/10";

  return (
    <div className={cn("rounded-2xl border p-6", styles)}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-2 text-sm text-text-2">{children}</div>
    </div>
  );
}
