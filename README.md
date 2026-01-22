# OpenGithub Site (MVP)

Next.js (App Router) frontend for browsing GitHub Trending snapshots (latest + archive).

## Setup

1) Install deps

```bash
cd OpenGithub-site
npm install
```

2) Configure env

- `DATA_BASE_URL`: Base URL of `OpenGithub-data` raw content (default: `https://raw.githubusercontent.com/Jarvis-TechX/OpenGithub-data/main`)
-   - Note: this must be a *raw* base URL (e.g. `https://raw.githubusercontent.com/<owner>/<repo>/<branch>`), not `https://github.com/<owner>/<repo>`
- `REVALIDATE_TOKEN`: Token for `POST /api/revalidate`
- `GITHUB_REPO_URL` (optional): GitHub link shown in header

3) Run

```bash
npm run dev
```

## Troubleshooting

### `listen EPERM: operation not permitted`

This means the environment you’re running in does not allow binding a local TCP port (the Next.js dev server can’t start).

- Try running the command in a non-sandboxed terminal/session.
- If you’re using a tool that sandboxes shell commands, you may need to grant it permission to open local ports.

### Port already in use

If `3000` is taken, pick another port:

```bash
npm run dev -- -p 3002
```
