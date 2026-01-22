"use client";

import Link from "next/link";
import type { TrendingRepository, Since } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { ForkIcon, ExternalLinkIcon, StarIcon } from "@/components/ui/icons";
import { BuiltByAvatars } from "@/components/trending/BuiltByAvatars";
import { NewBadge } from "@/components/trending/NewBadge";
import { cn } from "@/lib/cn";
import { formatCompactNumber, periodLabel } from "@/lib/format";

function splitFullname(fullname: string): { owner: string; repo: string } {
  const [owner, repo] = fullname.split("/", 2);
  return { owner: owner ?? fullname, repo: repo ?? "" };
}

export function RepoCard({ repo, since }: { repo: TrendingRepository; since: Since }) {
  const periodStars = repo.currentPeriodStars;
  const periodText = periodStars == null ? "—" : `+${formatCompactNumber(periodStars)}`;
  const nameParts = splitFullname(repo.fullname ?? "");

  return (
    <Card className="p-4 sm:p-5 rounded-md hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted">#{repo.rank}</span>
            <Link
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              title={repo.fullname}
            >
              <span className="text-text-2">{nameParts.owner}</span>
              <span className="text-text-2">/</span>
              <span className="text-text">{nameParts.repo || repo.fullname}</span>
              <ExternalLinkIcon className="size-4 shrink-0 text-muted" />
            </Link>
            {repo.is_new ? <NewBadge /> : null}
            {repo.quality_grade && repo.quality_grade !== "A" ? (
              <Badge tone="warning">Grade {repo.quality_grade}</Badge>
            ) : null}
          </div>

          {repo.description ? (
            <p className="mt-2 text-sm text-text-2 line-clamp-2">
              {repo.description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">No description</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-2">
            {repo.language ? <Chip>{repo.language}</Chip> : null}

            <div className="inline-flex items-center gap-1">
              <StarIcon className="size-4 text-muted" />
              <span className="font-medium">{formatCompactNumber(repo.stars)}</span>
            </div>

            <div className="inline-flex items-center gap-1">
              <ForkIcon className="size-4 text-muted" />
              <span className="font-medium">{formatCompactNumber(repo.forks)}</span>
            </div>

            {(repo.builtBy?.length ?? 0) > 0 ? (
              <div className="inline-flex items-center gap-1.5">
                <span className="text-muted">Built by</span>
                <BuiltByAvatars builtBy={repo.builtBy ?? []} />
              </div>
            ) : null}

            <div
              className={cn(
                "inline-flex items-center gap-1",
                periodStars == null ? "text-text-2" : "font-semibold text-text"
              )}
            >
              <StarIcon className="size-4" />
              <span>{periodText}</span>
              <span className="font-normal text-muted">{periodLabel(since)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
