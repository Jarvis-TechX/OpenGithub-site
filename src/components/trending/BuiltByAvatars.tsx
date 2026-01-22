import Image from "next/image";
import Link from "next/link";
import type { BuiltBy } from "@/lib/types";
import { cn } from "@/lib/cn";

export function BuiltByAvatars({ builtBy }: { builtBy: BuiltBy[] }) {
  if (!builtBy?.length) return null;

  const max = 5;
  const shown = builtBy.slice(0, max);
  const remaining = Math.max(0, builtBy.length - shown.length);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((u) => (
          <Link
            key={u.username}
            href={u.profileUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "relative block size-6 overflow-hidden rounded-full border border-border bg-surface",
              "ring-2 ring-bg hover:brightness-95"
            )}
            title={u.username}
          >
            <Image
              src={u.avatarUrl}
              alt={`${u.username}'s avatar`}
              fill
              sizes="24px"
              className="object-cover"
              placeholder="empty"
            />
          </Link>
        ))}
      </div>
      {remaining > 0 ? (
        <span className="ml-2 text-xs text-muted">+{remaining}</span>
      ) : null}
    </div>
  );
}
