"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">
          Try again. If it keeps happening, the data source may be temporarily
          unavailable.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-95"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
