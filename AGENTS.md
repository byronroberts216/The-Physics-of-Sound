# The Physics of Sound

## Purpose and scope
Build a comprehensive, interactive acoustics education website, from absolute beginner to advanced understanding. Explain intuition before formalism, make prerequisites explicit, and connect equations to observable phenomena. This foundation contains no curriculum; authoring and UI implementation require a subsequent task.

## Architecture and conventions
Use Node 24, pnpm 10 (exact packageManager pin), Next.js App Router, React, and strict TypeScript. Use the existing isolated checkout; do not create a Git worktree unless explicitly requested. Routes and layouts live in `src/app`; add reusable UI in `src/components`, pure numerical models in `src/lib/physics`, and browser-only audio/visualization adapters in `src/lib` when needed. Do not create empty abstractions in advance.
Server Components are the default. Put browser APIs behind small Client Components and lazy imports; never construct AudioContext, canvas, or waveform players during SSR. Keep research credentials on the server or in agent tools, never in NEXT_PUBLIC variables or committed files. Use pnpm and preserve the lockfile. Avoid paid services and unnecessary dependencies. Follow installed versions' official docs; use Context7 when enabled and available, otherwise consult upstream docs and disclose uncertainty.

## Mandatory design skill
Before relevant UI design, implementation, interaction, animation, or design review, read and apply `.agents/skills/apple-design/SKILL.md` (Emil Kowalski). Invoke it by name with a specific task, for example: `Use $apple-design to review this control for keyboard operation and reduced motion.` The skill is a primary design influence, with accessibility, educational clarity, and scientific accuracy taking precedence over decoration. Treat its spring examples as interface behavior, not acoustics models. Its optional libraries are not mandatory dependencies.
Use system typography, deliberate hierarchy, readable spacing, minimal controls, polished consistent navigation, natural interruptible motion, and responsive layouts. Use translucency/depth only when they clarify hierarchy and maintain contrast. Respect reduced motion, reduced transparency, and increased contrast. Do not distort scientific time, amplitude, wave propagation, or numerical results to imitate UI springs.

## Scientific integrity
Verify scientific claims against reputable university textbooks/materials and primary sources. Record URL/DOI, access date, relevant section, assumptions, units, and limitations. Independently verify metadata from discovery tools; a search result is not evidence. Label simplified models, domains of validity, and time/space scaling. Distinguish particle motion, energy transport, pressure, displacement, and visual encoding. Validate equations dimensionally and simulations against analytic cases, limiting behavior, conservation laws where applicable, and numerical convergence. Never invent citations. No curriculum research is authorized by this setup task.

## Accessibility and performance
Target WCAG 2.2 AA: semantic structure, labels, visible focus, keyboard alternatives to gestures, adequate contrast, responsive reflow and text zoom. Graphs need textual summaries and accessible data; equations need accessible math output. Audio is opt-in, starts after a user gesture, has visible stop/volume controls and safe initial levels, and never autoplays. Reduced motion must preserve learning through static/stepped alternatives. Avoid flashing and vestibular effects. Stop audio/animation and release resources on unmount; pause expensive work offscreen. Keep math deterministic and separate from rendering; use workers only when profiling justifies them.

## Validation and documentation
Run `pnpm lint`, `pnpm typecheck`, `pnpm check:skills`, `pnpm build`, and `pnpm test`. Browser tests cover the initial placeholder on desktop/mobile; they are not full accessibility or scientific validation. Use `pnpm test:e2e:production` for a production-server check. Add meaningful numerical tests and keyboard/audio/reduced-motion interaction tests when those features exist. Document commands, assumptions, source provenance, dependency choices, and unresolved checks. Never describe a skipped check as passing. Do not commit generated builds, secrets, browser binaries, or package stores.

## Local skills
Apple Design is committed under `.agents/skills/apple-design` with its MIT license and upstream provenance in `docs/skills.md`; `skills-lock.json` records the install. Keep all skill resources in Git so future checkouts retain them. `.agents/skills/acoustics-course-author` is reserved only; do not activate it or author lessons until requested.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
