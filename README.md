# The Physics of Sound

Development foundation for a future interactive acoustics education website. Only a minimal readiness placeholder is implemented; no lessons, simulations, research pipeline, accounts, or backend services exist yet.

## Requirements and commands

Use Node **24.19.0** (see `.node-version`) and **pnpm 10.34.7**. Install pnpm using Corepack if available (`corepack enable && corepack prepare pnpm@10.34.7 --activate`) or `npm install -g pnpm@10.34.7`. The cloud setup uses a workspace-local tool installation rather than global writes.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check:skills
pnpm lint
pnpm typecheck
pnpm build
pnpm test
pnpm dev
```

`pnpm test` starts and stops its own development server and runs Chromium desktop/mobile checks. Stop any manually started server on port 3000 first. To use a preinstalled Chromium instead of downloading a browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable (Cloud: `/usr/bin/chromium`). This uses the system browser version rather than Playwright’s pinned download. On Linux, install browser OS libraries with `pnpm exec playwright install-deps chromium` if missing (system package installation may require permission). `pnpm test:e2e:production` builds and tests `pnpm start`. `pnpm start` requires a completed build. No API keys are needed for these commands. Dependencies are locked in `pnpm-lock.yaml`.

## Structure

- `src/app`: App Router shell and minimal environment placeholder.
- `tests/e2e`: browser smoke checks; production configuration shares the tests.
- `.agents/skills`: committed Codex-local skills and reserved future authoring location.
- `scripts`: skill discovery check and reusable cloud setup.
- `docs`: architecture, dependencies, research integration requirements, and skill provenance.

Read [AGENTS.md](AGENTS.md) before development and [docs/skills.md](docs/skills.md) before design work. See [docs/dependencies.md](docs/dependencies.md) and [docs/research-infrastructure.md](docs/research-infrastructure.md) for deferred tools.

## Vercel

Import this GitHub repository as a Next.js project. Select Node 24.x; use `pnpm install --frozen-lockfile` and `pnpm build`, keeping the default Next.js output setting. pnpm is pinned by `packageManager`. No custom server, Vercel-specific package, paid subscription, or deploy-time credentials are required by the foundation. Vercel Hobby may be suitable subject to its current usage terms. Deployment has not been performed or verified.

## Cloud environment

Run `bash scripts/cloud-install.sh` to reproduce setup. Use the existing checkout; do not create a worktree. The cloud script retains dependencies and browser downloads under `/workspace`; live processes must restart in each session. See environment settings for saved install/start instructions. Optional research services are not prerequisites for development.
