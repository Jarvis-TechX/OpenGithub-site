import { redirect } from "next/navigation";
import { fetchLatest } from "@/lib/data";
import type { Since } from "@/lib/types";
import { Callout } from "@/components/ui/Callout";
import { pathLatest } from "@/lib/url";

export const dynamic = "force-dynamic";

const candidates: Array<{ since: Since; language: string }> = [
  { since: "daily", language: "all" },
  { since: "weekly", language: "all" },
  { since: "monthly", language: "all" },
  { since: "daily", language: "python" }
];

export default async function HomePage() {
  for (const c of candidates) {
    let ok = false;
    try {
      await fetchLatest(c.since, c.language);
      ok = true;
    } catch (err: any) {
      if (err?.status === 404) continue;
      if (err?.code === "ENOENT") continue;
      if (String(err?.message ?? "").includes("DATA_BASE_URL is not set")) break;
    }
    if (ok) redirect(pathLatest(c.since, c.language));
  }

  return (
    <Callout title="No snapshot available" tone="warning">
      <p>
        Provide <code>DATA_BASE_URL</code> (or set <code>DATA_FALLBACK_TO_LOCAL=1</code>) and
        ensure at least one <code>latest/&lt;since&gt;/&lt;language&gt;.json</code> exists.
      </p>
    </Callout>
  );
}
