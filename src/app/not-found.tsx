import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h1 className="text-lg font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-muted">
        The requested snapshot does not exist (yet), or the URL is invalid.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/daily/all"
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-95"
        >
          Go to latest
        </Link>
      </div>
    </div>
  );
}
