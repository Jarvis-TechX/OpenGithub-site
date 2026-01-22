import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
  className?: string;
}) {
  const toneStyles: Record<typeof tone, string> = {
    primary: "border-primary/30 bg-primary-weak text-primary",
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
    neutral: "border-border bg-surface-2 text-text-2"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
