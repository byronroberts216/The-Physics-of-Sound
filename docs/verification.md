# Foundation verification

Validated in the onboarding machine on 2026-10-19 with Node 24.19.0, pnpm 10.34.7 and system Chromium 154.0.8037.57.

| Check | Result |
| --- | --- |
| `bash scripts/cloud-install.sh` | Passed; frozen lockfile reused, dependencies retained, system Chromium available |
| `pnpm lint` | Passed, zero warnings |
| `pnpm typecheck` | Passed, Next route types and strict TypeScript |
| `pnpm check:skills` | Passed; local Apple Design file, metadata, source and AGENTS reference verified |
| `npx skills list --agent codex` | Apple Design listed as project-local and assigned to Codex |
| Original skill comparison | Installed SKILL.md byte-identical to reviewed upstream file; no bundled supporting resources |
| `pnpm test` | 2 passed (desktop/mobile Chromium); starts and stops development server |
| `pnpm test:e2e:production` | Build passed; 2 passed against production server |
| Playwright pinned-browser download | Blocked by proxy 403; browser tests successfully used existing system Chromium via supported executable override |
| Direct research documentation access | Proxy CONNECT 403; required domains saved in Cloud configuration draft |
| Context7 native MCP invocation | Unrun; tool must be enabled in Cloud settings |
| Fresh Cloud task restoration/native skill picker | Unrun; requires publication/new task |
| Vercel deployment | Unrun; compatible standard Next.js configuration prepared |

The browser checks use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` in Cloud. CI installs Playwright's browser instead. These checks verify the foundation, not full WCAG compliance, future simulation accuracy, or research integrations.

The first production check exposed Playwright's concatenation of webServer entries across multi-argument defineConfig calls. The final config overrides via a single object; the affected build/server/browser check was rerun and passed. Local dev origin 127.0.0.1 is explicitly allowed so browser tests can access HMR.

ESLint 9 is deprecated upstream but remains compatible with all current Next plugin peers. ESLint 10 was evaluated and rejected due to plugin peer incompatibility; revisit when the plugin stack supports it. See dependencies.md.

Only this project and workspace-local setup caches/tools were prepared; no unrelated pre-existing project or environment was modified. Temporary upstream clones under /tmp were used for read-only skill/tool documentation review. No lessons, simulations, curriculum research, deployment, or paid services were introduced.


## Academy increment — 2026-10-19

Sixteen author-reviewed lessons and 32 planned briefs now replace the original placeholder. The initial setup checks above are historical. Current validation:

- Frozen pnpm install: passed with updated lockfile.
- Skill checks: both Apple Design and acoustics-course-author discovered/readable.
- Lint and TypeScript: passed, zero lint warnings.
- `pnpm test:science`: **16 passed, 0 failed**.
- `pnpm build`: passed, 58 static/prerendered routes including icon and clearly planned lesson briefs. This route count does not imply 48 completed lessons.
- Production Playwright: **12 passed, 0 failed** in 31.6 seconds, desktop/mobile Chromium. Functional interactions and bounded axe WCAG A/AA checks passed.
- Development checks: functionality passed during iteration; final targeted desktop/mobile axe checks passed after fixing light-theme contrast.
- Manual Chromium screenshot review: dark/light desktop dashboard, mobile dashboard, lesson, and room workshop. Representative captures live in docs/screenshots.

Known bounded scope: Chromium only; automated contrast/semantics scans are not a complete accessibility audit. Reduced-motion mobile project is exercised; real screen-reader, large-text, browser diversity, actual hardware audio calibration and student trials remain open. No whole-room response/treatment-rating prediction or full source verification for planned lessons is claimed. No website deployment was performed. See progress.md for the continuation inventory.
