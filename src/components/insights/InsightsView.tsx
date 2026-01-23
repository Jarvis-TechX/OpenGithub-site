import type { InsightsData, LanguageOption } from "@/lib/types";
import { InsightsHero } from "@/components/insights/InsightsHero";
import { SummaryStats } from "@/components/insights/SummaryStats";
import { InsightsTabs } from "@/components/insights/InsightsTabs";
import { PeriodSelector } from "@/components/filters/PeriodSelector";
import { LanguageSelector } from "@/components/filters/LanguageSelector";

export function InsightsView({
  data,
  languages
}: {
  data: InsightsData;
  languages: LanguageOption[];
}) {
  return (
    <div className="space-y-6">
      <InsightsHero data={data} />

      <div className="flex flex-wrap gap-3">
        <PeriodSelector period={data.period} language={data.language_slug} />
        <LanguageSelector
          mode="insights"
          period={data.period}
          language={data.language_slug}
          languages={languages}
        />
      </div>

      <SummaryStats data={data} />

      <InsightsTabs
        hottest={data.hottest}
        rising={data.rising}
        newProjects={data.newProjects}
      />
    </div>
  );
}
