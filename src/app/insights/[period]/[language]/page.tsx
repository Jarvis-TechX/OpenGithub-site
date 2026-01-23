import { notFound } from "next/navigation";
import { fetchLanguages } from "@/lib/data";
import { fetchInsights } from "@/lib/insights";
import type { AnalysisPeriod } from "@/lib/types";
import { ALLOWED_ANALYSIS_PERIOD } from "@/lib/types";
import { InsightsView } from "@/components/insights/InsightsView";
import { Callout } from "@/components/ui/Callout";

export const dynamic = "force-dynamic";

export default async function InsightsPage({
  params
}: {
  params: { period: string; language: string };
}) {
  if (!ALLOWED_ANALYSIS_PERIOD.has(params.period as AnalysisPeriod)) notFound();

  const period = params.period as AnalysisPeriod;
  const language = decodeURIComponent(params.language);

  const languages = await fetchLanguages();

  let data;
  try {
    data = await fetchInsights(period, language);
  } catch (err: any) {
    if (err?.status === 404 || err?.message?.includes("No archive data")) {
      return (
        <Callout title="No archive data available" tone="warning">
          <p>
            Archive data is not available for the selected period. Try a different time range or language.
          </p>
          <p className="mt-2 text-xs text-muted">Error: {String(err?.message ?? err)}</p>
        </Callout>
      );
    }
    return (
      <Callout title="Data source unavailable" tone="danger">
        <p>
          Set <code>DATA_BASE_URL</code> (or enable <code>DATA_FALLBACK_TO_LOCAL=1</code>)
          to load snapshot JSON files.
        </p>
        <p className="mt-2 text-xs text-muted">Error: {String(err?.message ?? err)}</p>
      </Callout>
    );
  }

  return <InsightsView data={data} languages={languages} />;
}
