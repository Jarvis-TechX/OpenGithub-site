import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-[0_1px_0_rgba(15,23,42,0.02)]",
        "transition-all hover:-translate-y-[1px] hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]",
        className
      )}
    >
      {children}
    </div>
  );
}
