"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  minDate: string; // YYYY-MM-DD
  maxDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  containerRef: React.RefObject<HTMLElement>;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function DatePicker({
  isOpen,
  onClose,
  selectedDate,
  minDate,
  maxDate,
  onSelectDate,
  containerRef,
}: DatePickerProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; right: number } | null>(
    null
  );

  const selected = parseDate(selectedDate);
  const min = parseDate(minDate);
  const max = parseDate(maxDate);
  const today = new Date();

  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setDesktopPosition(null);
      return;
    }
    function updatePosition() {
      const el = containerRef.current;
      if (!el) return;
      const isDesktop = window.matchMedia("(min-width: 640px)").matches;
      if (!isDesktop) {
        setDesktopPosition(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.bottom + 8);
      const right = Math.max(16, Math.round(window.innerWidth - rect.right));
      setDesktopPosition({ top, right });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, containerRef]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current;
      const dialog = dialogRef.current;
      if (e.target instanceof Node) {
        const inContainer = el ? el.contains(e.target) : false;
        const inDialog = dialog ? dialog.contains(e.target) : false;
        if (!inContainer && !inDialog) onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, onClose, containerRef]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfMonth = getFirstDayOfMonth(viewYear, viewMonth);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (date < min || date > max) return;
    onSelectDate(formatDate(date));
    onClose();
  };

  const handleToday = () => {
    if (today < min || today > max) return;
    onSelectDate(formatDate(today));
    onClose();
  };

  const dialog = isOpen ? (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Select date"
      className={cn(
        "z-[1000] overflow-hidden border border-border bg-surface shadow-[0_10px_30px_rgba(15,23,42,0.12)]",
        "fixed inset-x-4 top-20 rounded-md",
        "sm:inset-auto sm:w-[320px]"
      )}
      style={
        desktopPosition
          ? { top: desktopPosition.top, right: desktopPosition.right, left: "auto" }
          : undefined
      }
    >
      {/* Header with month/year navigation */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex size-8 items-center justify-center rounded-md text-text-2 hover:bg-surface-2"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <div className="text-sm font-medium text-text">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="flex size-8 items-center justify-center rounded-md text-text-2 hover:bg-surface-2"
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="p-3">
        {/* Weekday headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const date = new Date(viewYear, viewMonth, day);
            const isSelected = isSameDay(date, selected);
            const isToday = isSameDay(date, today);
            const isDisabled = date < min || date > max;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                disabled={isDisabled}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md text-sm",
                  isSelected && "bg-primary font-medium text-on-primary",
                  !isSelected && !isDisabled && "text-text hover:bg-surface-2",
                  !isSelected && isToday && "border border-primary",
                  isDisabled && "cursor-not-allowed text-muted opacity-50"
                )}
                aria-label={formatDate(date)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with Today button */}
      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={handleToday}
          disabled={today < min || today > max}
          className={cn(
            "w-full rounded-md px-3 py-2 text-sm font-medium",
            today >= min && today <= max
              ? "text-text-2 hover:bg-surface-2"
              : "cursor-not-allowed text-muted opacity-50"
          )}
        >
          Today
        </button>
      </div>
    </div>
  ) : null;

  if (!mounted || !dialog) return null;
  return createPortal(dialog, document.body);
}
