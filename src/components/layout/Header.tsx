import Link from "next/link";
import { ExternalLinkIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const githubUrl =
  process.env.GITHUB_REPO_URL ?? "https://github.com/Jarvis-TechX/OpenGithub-data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="h-1 w-full" style={{ background: "var(--color-accent-gradient)" }} />
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/daily/all" className="group inline-flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl border border-border bg-surface shadow-sm">
            <span className="text-sm font-semibold tracking-tight text-primary">OG</span>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">OpenGithub</span>
            <span className="block text-xs text-muted">Trending Archive</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/daily/all"
            className="rounded-full px-3 py-1.5 text-sm text-text-2 hover:bg-surface-2"
          >
            Latest
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub (opens in new tab)"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-text-2 hover:bg-surface-2"
          >
            Source
            <ExternalLinkIcon className="size-4 text-muted" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
