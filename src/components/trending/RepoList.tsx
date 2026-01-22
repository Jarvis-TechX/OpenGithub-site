"use client";

import { useMemo, useState } from "react";
import type { Since, TrendingRepository } from "@/lib/types";
import { RepoCard } from "@/components/trending/RepoCard";
import { SearchIcon } from "@/components/ui/icons";

export function RepoList({ items, since }: { items: TrendingRepository[]; since: Since }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((repo) => {
      const a = (repo.fullname ?? "").toLowerCase();
      const b = (repo.description ?? "").toLowerCase();
      return a.includes(q) || b.includes(q);
    });
  }, [items, query]);

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Top repositories</h2>
          <p className="mt-1 text-xs text-muted">
            Showing {filtered.length} / {items.length}
          </p>
        </div>

        <div className="relative w-full sm:w-[360px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by repo or description…"
            aria-label="Filter repositories"
            className="h-10 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-text outline-none ring-0 placeholder:text-muted focus:border-primary/50 focus:shadow-[0_0_0_4px_var(--color-primary-weak)]"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-md border border-border bg-surface p-8 text-sm text-muted">
          No repositories in this snapshot.
        </div>
      ) : null}

      {items.length > 0 && filtered.length === 0 ? (
        <div className="mt-6 rounded-md border border-border bg-surface p-8 text-sm text-muted">
          No matches.{" "}
          <button
            type="button"
            onClick={() => setQuery("")}
            className="font-medium text-primary hover:underline"
          >
            Clear filter
          </button>
          .
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {filtered.map((repo) => (
            <RepoCard key={`${repo.rank}-${repo.fullname}`} repo={repo} since={since} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
