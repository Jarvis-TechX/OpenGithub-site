import { notFound } from "next/navigation";
import { fetchLanguages, fetchLatest } from "@/lib/data";
import type { Since } from "@/lib/types";
import { ALLOWED_SINCE } from "@/lib/types";
import { TrendingView } from "@/components/trending/TrendingView";
import { Callout } from "@/components/ui/Callout";

export default async function LatestTrendingPage({
  params
}: {
  params: { since: string; language: string };
}) {
  if (!ALLOWED_SINCE.has(params.since as Since)) notFound();

  const since = params.since as Since;
  const language = decodeURIComponent(params.language);

  const languages = await fetchLanguages();

  let snapshot;
  try {
    snapshot = await fetchLatest(since, language);
  } catch (err: any) {
    if (err?.status === 404) notFound();
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

  return <TrendingView mode="latest" snapshot={snapshot} languages={languages} />;
}
