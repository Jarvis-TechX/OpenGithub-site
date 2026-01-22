"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LanguageOption, Since } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { buildHref } from "@/lib/url";


export function LanguageSelector({
  mode,
  since,
  language,
  date,
  languages
}: {
  mode: "latest" | "archive";
  since: Since;
  language: string;
  date?: string;
  languages: LanguageOption[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; right: number } | null>(null);

  const current = languages.find((l) => l.slug === language)?.name ?? language;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((l) => l.name.toLowerCase().includes(q) || l.slug.includes(q));
  }, [languages, query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
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
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current;
      const dialog = dialogRef.current;
      if (e.target instanceof Node) {
        const inContainer = el ? el.contains(e.target) : false;
        const inDialog = dialog ? dialog.contains(e.target) : false;
        if (!inContainer && !inDialog) setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const dialog = open ? (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Select language"
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
      <div className="border-b border-border p-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages…"
            aria-label="Search languages"
            className="h-10 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary/50 focus:shadow-[0_0_0_4px_var(--color-primary-weak)]"
          />
        </div>
      </div>

      <div className="max-h-[320px] overflow-auto p-2">
        {filtered.length === 0 ? <div className="p-3 text-sm text-muted">No matches.</div> : null}
        {filtered.map((l) => {
          const active = l.slug === language;
          return (
            <Link
              key={l.slug}
              href={buildHref({ mode, since, language: l.slug, date })}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                active ? "bg-primary-weak text-primary" : "text-text-2 hover:bg-surface-2"
              )}
            >
              <span className="truncate">{l.name}</span>
              <span className="ml-2 text-xs text-muted">{l.slug}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full rounded-md px-3 py-2 text-sm font-medium text-text-2 hover:bg-surface-2"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-2",
          "hover:bg-surface-2"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="max-w-[220px] truncate">{current}</span>
        <ChevronDownIcon className="size-4 text-muted" />
      </button>

      {dialog ? (mounted ? createPortal(dialog, document.body) : dialog) : null}
    </div>
  );
}
