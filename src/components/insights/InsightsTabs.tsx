"use client";

import { useState } from "react";
import type { RepoTrendData } from "@/lib/types";
import { InsightRepoCard } from "@/components/insights/InsightRepoCard";
import { cn } from "@/lib/cn";

type TabKey = "hottest" | "rising" | "new";

export function InsightsTabs({
  hottest,
  rising,
  newProjects
}: {
  hottest: RepoTrendData[];
  rising: RepoTrendData[];
  newProjects: RepoTrendData[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("hottest");

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: "hottest", label: "🔥 Hottest", count: hottest.length },
    { key: "rising", label: "📈 Rising", count: rising.length },
    { key: "new", label: "✨ New Projects", count: newProjects.length }
  ];

  const currentData = activeTab === "hottest" ? hottest : activeTab === "rising" ? rising : newProjects;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-text-2 hover:text-text hover:border-border"
              )}
            >
              {tab.label}
              <span className="ml-2 text-xs text-muted">({tab.count})</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {currentData.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted">
            No data available for this category
          </div>
        ) : (
          currentData.map((data) => (
            <InsightRepoCard key={data.repo.fullname} data={data} />
          ))
        )}
      </div>
    </div>
  );
}
