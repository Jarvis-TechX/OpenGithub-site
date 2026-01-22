import { cn } from "@/lib/cn";
import { getLanguageColor } from "@/lib/languageColors";
import type { ReactNode } from "react";

export function Chip({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const language = typeof children === "string" ? children : null;
  const color = getLanguageColor(language);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className="size-3 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-xs text-text-2">{children}</span>
    </span>
  );
}
