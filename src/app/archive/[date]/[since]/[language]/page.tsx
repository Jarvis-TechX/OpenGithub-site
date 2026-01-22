import { notFound, redirect } from "next/navigation";
import { fetchArchive, fetchLanguages, fetchLatest, findNearestLocalArchiveDate } from "@/lib/data";
import { isISODate } from "@/lib/date";
import type { Since } from "@/lib/types";
import { ALLOWED_SINCE } from "@/lib/types";
import { TrendingView } from "@/components/trending/TrendingView";
import { Callout } from "@/components/ui/Callout";
import { pathArchive } from "@/lib/url";

export default async function ArchiveTrendingPage({
  params
}: {
  params: { date: string; since: string; language: string };
}) {
  const date = decodeURIComponent(params.date);
  if (!isISODate(date)) notFound();
  if (!ALLOWED_SINCE.has(params.since as Since)) notFound();

  const since = params.since as Since;
  const language = decodeURIComponent(params.language);

  let snapshot;
  let latest;
  try {
    const [languagesResult, snapshotResult, latestResult] = await Promise.allSettled([
      fetchLanguages(),
      fetchArchive(date, since, language),
      fetchLatest(since, language)
    ]);

    if (languagesResult.status === "rejected") throw languagesResult.reason;
    const languages = languagesResult.value;

    if (snapshotResult.status === "rejected") {
      const err: any = snapshotResult.reason;
      if (err?.status === 404) {
        const nearest = await findNearestLocalArchiveDate(date, since, language);
        if (nearest && nearest !== date) redirect(pathArchive(nearest, since, language));
        notFound();
      }
      throw err;
    }
    snapshot = snapshotResult.value;

    latest = latestResult.status === "fulfilled" ? latestResult.value : null;

    return (
      <TrendingView
        mode="archive"
        snapshot={snapshot}
        latestDate={latest?.date}
        languages={languages}
      />
    );
  } catch (err: any) {
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
}
