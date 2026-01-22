export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 text-xs text-muted sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>OpenGithub Trending Archive — MVP</p>
          <p className="text-muted">
            Data source: GitHub Trending (archived snapshots). Timezone: Asia/Shanghai.
          </p>
        </div>
      </div>
    </footer>
  );
}
