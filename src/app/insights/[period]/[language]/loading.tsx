export default function InsightsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-96 animate-pulse rounded bg-surface-2" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="h-10 w-32 animate-pulse rounded bg-surface-2" />
        <div className="h-10 w-32 animate-pulse rounded bg-surface-2" />
        <div className="h-10 w-32 animate-pulse rounded bg-surface-2" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-md border border-border bg-surface p-4" />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-32 animate-pulse rounded bg-surface-2" />
          ))}
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-md border border-border bg-surface p-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
