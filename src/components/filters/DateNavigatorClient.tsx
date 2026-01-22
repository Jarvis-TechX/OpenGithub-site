"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Since } from "@/lib/types";
import { cn } from "@/lib/cn";
import { pathArchive, pathLatest } from "@/lib/url";
import { CalendarIcon } from "@/components/ui/icons";
import { DatePicker } from "./DatePicker";

interface DateNavigatorClientProps {
  mode: "latest" | "archive";
  since: Since;
  language: string;
  date: string;
  latestDate?: string;
  prevDate: string | null;
  nextDate: string | null;
}

function hrefLatest(since: Since, language: string) {
  return pathLatest(since, language);
}

function hrefArchive(date: string, since: Since, language: string) {
  return pathArchive(date, since, language);
}

export function DateNavigatorClient({
  mode,
  since,
  language,
  date,
  latestDate,
  prevDate,
  nextDate,
}: DateNavigatorClientProps) {
  const router = useRouter();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  const prevHref = prevDate ? hrefArchive(prevDate, since, language) : null;
  const nextHref = nextDate ? hrefArchive(nextDate, since, language) : null;
  const latestHref = hrefLatest(since, language);
  const dateHref = mode === "latest" ? hrefArchive(date, since, language) : null;

  const minDate = "2017-01-01";
  const maxDate = latestDate || new Date().toISOString().split("T")[0];

  const handleSelectDate = (selectedDate: string) => {
    const href = hrefArchive(selectedDate, since, language);
    router.push(href);
  };

  return (
    <div className="inline-flex items-center gap-2">
      {/* Prev Button */}
      {prevHref ? (
        <Link
          href={prevHref}
          className={cn(
            "rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium",
            "text-text-2 hover:bg-surface-2"
          )}
        >
          ← Prev
        </Link>
      ) : (
        <span
          aria-disabled
          className={cn(
            "rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium",
            "cursor-not-allowed text-muted opacity-60"
          )}
        >
          ← Prev
        </span>
      )}

      {/* Date Display / Date Picker Trigger */}
      {dateHref ? (
        <Link
          href={dateHref}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-2 hover:bg-surface-2"
          title="Open archived snapshot"
        >
          {date}
        </Link>
      ) : (
        <button
          ref={dateButtonRef}
          type="button"
          onClick={() => setIsDatePickerOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-2 hover:bg-surface-2"
          title="Select date"
        >
          <CalendarIcon className="size-4" />
          <span>{date}</span>
        </button>
      )}

      {/* Next Button */}
      {nextHref ? (
        <Link
          href={nextHref}
          className={cn(
            "rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium",
            "text-text-2 hover:bg-surface-2"
          )}
        >
          Next →
        </Link>
      ) : (
        <span
          aria-disabled
          className={cn(
            "rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium",
            "cursor-not-allowed text-muted opacity-60"
          )}
        >
          Next →
        </span>
      )}

      {/* Latest Button */}
      {mode === "archive" ? (
        <Link
          href={latestHref}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-on-primary hover:opacity-95"
        >
          Latest
        </Link>
      ) : null}

      {/* Date Picker */}
      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={date}
        minDate={minDate}
        maxDate={maxDate}
        onSelectDate={handleSelectDate}
        containerRef={dateButtonRef}
      />
    </div>
  );
}
