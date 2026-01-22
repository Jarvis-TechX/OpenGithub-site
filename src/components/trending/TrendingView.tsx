import type { LanguageOption, Since, TrendingSnapshot } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { SinceSelector } from "@/components/filters/SinceSelector";
import { LanguageSelector } from "@/components/filters/LanguageSelector";
import { DateNavigator } from "@/components/filters/DateNavigator";
import { RepoList } from "@/components/trending/RepoList";
import { Hero } from "@/components/trending/Hero";


export function TrendingView({
  mode,
  snapshot,
  latestDate,
  languages
}: {
  mode: "latest" | "archive";
  snapshot: TrendingSnapshot;
  latestDate?: string;
  languages: LanguageOption[];
}) {
  const since = snapshot.since;
  const language = snapshot.language_slug || snapshot.language;
  const date = snapshot.date;
  const languageName = languages.find((l) => l.slug === language)?.name ?? snapshot.language;

  return (
    <div className="space-y-6">
      <Hero mode={mode} languageName={languageName} snapshot={snapshot} />

      <Card className="p-4 sm:p-5 rounded-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SinceSelector mode={mode} since={since} language={language} date={date} />
            <LanguageSelector
              mode={mode}
              since={since}
              language={language}
              date={date}
              languages={languages}
            />
            <DateNavigator
              mode={mode}
              since={since}
              language={language}
              date={date}
              latestDate={latestDate}
            />
          </div>

          <div className="text-xs text-muted">
            <div>Fetched: {snapshot.fetched_at}</div>
            <div>Source: {snapshot.source ?? "self"} · Grade: {snapshot.quality_grade ?? "A"}</div>
          </div>
        </div>
      </Card>

      <RepoList items={snapshot.items ?? []} since={since} />
    </div>
  );
}
