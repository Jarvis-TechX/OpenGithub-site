export function formatCompactNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatInteger(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

export function periodLabel(since: "daily" | "weekly" | "monthly"): string {
  if (since === "daily") return "today";
  if (since === "weekly") return "this week";
  return "this month";
}

export function titleForSince(since: "daily" | "weekly" | "monthly"): string {
  if (since === "daily") return "Daily";
  if (since === "weekly") return "Weekly";
  return "Monthly";
}

