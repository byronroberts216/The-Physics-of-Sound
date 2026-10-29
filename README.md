# The Physics of Sound

A self-paced acoustics academy for an experienced musician starting with no formal physics background. **An implemented, usable course increment—not the complete academy yet.** Sixteen original starter lessons cover units through decibels. The remaining 32 lessons have explicit prerequisite briefs and are marked planned.

## Learn and explore

- `/`: personal dashboard and the six-stage path.
- `/course`: available lessons and honest planned-content briefs.
- `/labs`: waves/longitudinal parcels, coherent interference, decibel calculations, a three-harmonic recipe and opt-in pure tone.
- `/workshop`: ideal rectangular modes, single-mode source/listener coupling, one-wall reflection geometry, qualified depth/wavelength comparison and measurement guidance.
- `/glossary`, `/library`, `/references`: searchable terms, local notes/bookmarks/review/export/import, and a traceable source registry.

Progress remains in this browser’s local storage, without an account or automatic cross-device sync. Export backups before clearing site data. No paid services or public deployment were introduced.

## Develop and validate

Use Node **24.19.0** and pnpm **10.34.7** (pins in `.node-version` and `package.json`). Build upon the existing checkout. Do not create a worktree unless requested.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check:skills
pnpm lint
pnpm typecheck
pnpm test:science
pnpm build
pnpm test
pnpm dev
```

Tests start their own server; stop a manually started process on port 3000 first. `pnpm test:e2e:production` builds and runs the same browser checks against `pnpm start`. Linux browser libraries may require `pnpm exec playwright install-deps chromium` with system package permissions. In Cloud, use installed Chromium with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`; this differs from Playwright’s pinned downloaded browser. No keys are required for development or tests.

Cloud: `bash scripts/cloud-install.sh` reuses the frozen lockfile and workspace-local tools/cache. Initialize `PATH=/workspace/.tools/node_modules/.bin:$PATH` in subsequent shells. Saved Cloud start instructions remain useful for tool activation; the old setup placeholder wording is superseded by this academy UI. Live server processes do not survive environment snapshots.

## Architecture and standards

Next.js App Router and Server Components render curriculum/lesson/reference routes statically. Small Client Components own controls, Web Audio and local learning state. `src/content` holds structured original content and reference metadata; `src/lib/physics` contains pure SI-unit models. Numerical/content/state tests use Node’s built-in runner; Playwright covers browser behavior and bounded axe checks. KaTeX renders server-side math with MathML and trusted commands disabled.

Read [AGENTS.md](AGENTS.md), the installed [Apple Design skill](.agents/skills/apple-design/SKILL.md), and [acoustics-course-author](.agents/skills/acoustics-course-author/SKILL.md). Begin continuation with [docs/progress.md](docs/progress.md). Model assumptions are in [docs/science-models.md](docs/science-models.md); research method and limitations are in [docs/research-method.md](docs/research-method.md).

## Vercel compatibility

Standard Next.js project, Node 24.x, pnpm frozen install and `pnpm build`; keep default Next.js output settings. No custom server or Vercel package is needed. Deployment has not been performed; public deployment requires approval. Hosting terms/quotas must be checked before use.

Vercel agent tooling has been installed separately from deployment. See [docs/vercel-agent-setup.md](docs/vercel-agent-setup.md) for verified CLI/skills state and the outstanding authentication/MCP checks.
