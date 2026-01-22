"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem("theme");
    if (v === "light" || v === "dark") return v;
    return null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  if (!window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getPreferredTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

function setThemeOnDom(theme: Theme) {
  const html = document.documentElement;
  if (theme === "dark") html.dataset.theme = "dark";
  else delete html.dataset.theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    setThemeOnDom(initial);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next);
        setThemeOnDom(next);
        try {
          window.localStorage.setItem("theme", next);
        } catch {
          // ignore
        }
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-2",
        "hover:bg-surface-2 focus:outline-none focus:shadow-[0_0_0_4px_var(--color-primary-weak)]"
      )}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === "dark" ? (
        <SunIcon className="size-4 text-muted" />
      ) : (
        <MoonIcon className="size-4 text-muted" />
      )}
    </button>
  );
}
