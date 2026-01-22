import type { Since } from "@/lib/types";
import { shiftISODate } from "@/lib/date";
import { findAdjacentLocalArchiveDate, preferLocalData } from "@/lib/data";
import { DateNavigatorClient } from "./DateNavigatorClient";

export async function DateNavigator({
  mode,
  since,
  language,
  date,
  latestDate
}: {
  mode: "latest" | "archive";
  since: Since;
  language: string;
  date: string;
  latestDate?: string;
}) {
  // Calculate prev date
  const prev = preferLocalData()
    ? await findAdjacentLocalArchiveDate(date, since, language, -1)
    : shiftISODate(date, since, -1);

  // Calculate next date
  const next =
    mode === "archive"
      ? preferLocalData()
        ? await findAdjacentLocalArchiveDate(date, since, language, 1)
        : shiftISODate(date, since, 1)
      : null;

  // Check if next is valid (not beyond latestDate)
  const canNext = mode === "archive" && next ? (!latestDate ? true : next <= latestDate) : false;
  const validNext = canNext ? next : null;

  return (
    <DateNavigatorClient
      mode={mode}
      since={since}
      language={language}
      date={date}
      latestDate={latestDate}
      prevDate={prev}
      nextDate={validNext}
    />
  );
}
