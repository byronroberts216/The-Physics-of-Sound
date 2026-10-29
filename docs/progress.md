# The Physics of Sound — persistent progress

Updated 2026-10-19. This is a substantial working increment of a long-term mission, **not a completed 48-lesson academy**. Continue from here; do not repeat environment setup.

## Goal and nonnegotiables
An adult musician/audio engineer begins with zero formal physics or advanced math. Teach each prerequisite and new symbol, use original explanations, traceable scientific evidence, active practice and qualified numerical models. Prioritize eventual room acoustics/treatment understanding. No paid service, mandatory login or public deployment. Preserve the prepared architecture, setup and Apple Design skill.

## Milestones and honest scope

| Milestone | Implemented | Outstanding |
| --- | --- | --- |
| 1 Research/curriculum | 48-lesson, six-stage prerequisite map; per-item objectives, learning sequence and exercise brief; reviewed-source registry; IES instructional design; activated acoustics-course-author skill | Deep primary/full-text research and claim maps for unwritten later lessons; hearing, materials, diffusion, isolation and advanced topics need further evidence |
| 2 Working academy | Apple-Design-guided responsive dashboard, navigation, reusable reader, local progress, notes/bookmarks, glossary, sources, full starter lessons and working wave lab | Student usability/reading-time validation, independent educational review, richer per-lesson diagrams |
| 3 Foundations | 16 author-reviewed lessons, first two stages: measurement, ratios, algebra, graphs, motion, force/pressure, energy, vibration, mechanical waves, pressure waves, wavelength, phase, intensity, logarithms, decibels and synthesis checkpoint | External expert review and actual beginner-comprehension evaluation; Stage 3 acoustic behavior remains planned |
| 4 Rooms/treatment | Workshop implements ideal modes (axial/tangential/oblique), horizontal pressure slice, source/listener coupling, image-source reflection lengths/delay, depth comparison and measurement workflow | All eight full room lessons; measured material evidence, damping/decay and treatment models; no claimed real-room prediction |
| 5 Advanced/learning tools | Notes, bookmarks, completion, glossary, import validation/confirmation and JSON export; transparent spaced review with feedback | Advanced lessons, separate advanced math content, calibrated measurement project, capstone, richer module assessments, actual spectrum analysis and impulse-response lab |
| 6 QA/refinement | Pure numerical/content/state tests, Playwright desktop/mobile behavior and bounded axe audits; screenshot review; static production build | Full independent science/accessibility audit, user testing, cross-engine testing and real-device audio/SPL evaluation |

## Inventory and evidence

`src/content/curriculum.json` is the 48-item inventory and prerequisite graph. Its first 16 items are author-reviewed and have complete structured teaching content in `lessons.json`; the remaining 32 have no substitute lesson text and render clearly labeled planned briefs. Each available lesson has objectives, introduction, terms, three explanatory sections, a diagram, explained KaTeX equation, worked example, misconception correction, two feedback-bearing checks, three independent exercises, summary and reviewed source links. Estimated 12–18 minute study sessions include active tasks; these are not measured reading times. Around 16,000 whitespace-separated words including structured content/metadata were authored across these lessons; duration and pedagogy still need a learner trial.

Reviewed sources: OpenStax University Physics Volume 1 §§1.2,3.1,5.1,7.2,14.1,15.1,15.5,16.1,16.5,16.6,17.1–17.4; Daniel Russell/Penn State wave and reflection explanations; IES 2007 practice guide; REW modal simulation and RT60 help. ASA Explore Sound is directory-only evidence. OpenAlex verified Delany/Bazley 1970 metadata only; its full text was NOT read and no absorber coefficient derives from it. Exact access URLs, sections, assumptions, status and available hashes are in `src/content/references.json`. Failed guessed URLs are recorded in research-method.md, not passed off as sources.

## Labs and limitations

Four lab panels: traveling pressure/longitudinal parcels (paused and steppable); phase-aware coherent addition; pressure/intensity/independent-level decibels; three-harmonic recipe plus separate opt-in fundamental sine tone. Workshop tabs: rigid rectangular eigenmodes, a single-wall image-source geometry, and panel/gap quarter-wavelength comparison. No measured frequency-response prediction, absorber coefficient, calibrated SPL output, microphone access, full FFT analyzer, impulse response/convolution or timed harmonic synthesis is claimed. Audio has a low digital default, explicit stop, gain control, ramps and unmount/page-hidden cleanup; hardware loudness is uncalibrated. Scientific equations and assumptions: docs/science-models.md.

## Validation log — verified increment

`pnpm test:science`: 16 passed, 0 failed (analytic wave/phase/dB/modal/geometry cases, invalid domains, prerequisite/content completeness and import/review state). `pnpm lint`, `pnpm typecheck` and static `pnpm build` passed during implementation. The first browser runs uncovered and fixed hydration roundoff in SVG attributes, early-interaction readiness, cycle step quantization, definition-list markup, page background and light-theme secondary contrast. Final production run: **12 browser tests passed, 0 failed**, desktop and mobile Chromium, including 7-route dark-theme axe scans, light dashboard contrast, responsive overflow, quiz feedback, persistence, actual JSON export, rejected invalid imports and confirmed valid imports, dimension recovery, modal values, keyboard tabs, audio start/stop and lab calculations. Earlier dev functional cases and the final targeted dev accessibility rerun also passed (2 accessibility tests after the contrast correction). These checks do not establish full WCAG certification or expert science review.

Actual screenshot review: dark and light dashboard, mobile dashboard, lesson and room workshop inspected in Chromium. It revealed an invisible decorative gradient (coordinate units), corrected to user-space coordinates, and a mobile line-break spacing issue. No public preview was deployed. One preliminary local production snapshot reported DOMContentLoaded 109 ms and 31 resources, but this is a single warm machine observation, not a performance score or user-experience guarantee. A favicon 404 was identified and a local icon added.

## Next actions, in order

1. Continue from the committed, verified increment. Re-run affected tests after substantive changes; preserve setup files, skills and pins. The current production suite is green; do not repeat initial setup.
2. Research/author Stage 3 beginning with `interference`, then reflection/transmission/diffraction/resonance/standing waves/harmonics/response. Add claim-specific evidence and diagrams; do not infer pressure reflection polarity from string displacement reflection.
3. Expand room research with primary/full-text sources and measured material data (mounting, frequency, incidence, limitations). Qualify porous depth/gap reasoning; never fabricate coefficients or turn a quarter-wave scale into a cutoff. Author the room-priority lessons before adding convincing-looking performance graphs.
4. Implement impulse response and spectrum labs using independent numerical tests and explicit finite-window/model assumptions; finish hearing/transducer and optional mathematics lessons in prerequisite order.
5. Add substantive module assessments and teaching trials; test text zoom, screen reader, Safari/Firefox, reduced transparency, interrupted audio and storage-denied behavior. Review performance budgets with production cold-load traces rather than extrapolating the local warm sample.

## Resume commands

Read AGENTS.md and both local SKILL.md files. In `/workspace/The-Physics-of-Sound`, initialize `PATH=/workspace/.tools/node_modules/.bin:$PATH` and set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` for this Cloud image. Run `pnpm test:science`, `pnpm check:skills`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`. The browser runner starts its own port-3000 server; stop only manually started task servers before running it. `pnpm test:e2e:production` uses the production server and the same tests. No external keys are needed. Context7 is not available as a native tool; research HTTP is currently unrestricted and OpenAlex metadata access worked.


## Vercel tooling follow-up — 2026-10-28

User requested the official agent onboarding playbook. CLI 65.5.0 and nine standalone Vercel skills are installed user-wide. The preferred plugin failed because it is absent from this Codex marketplace; the documented fallback was used. Shared MCP endpoint is configured in the user-wide Codex config but authentication and actual documentation/list_teams tool calls remain unverified. CLI device sign-in completed; `vercel whoami` verified leftyb66-7170. The initial MCP flow timed out waiting for its loopback callback; native Vercel MCP tools are not attached to this running chat. A fresh in-app-browser attempt confirmed localhost / 127.0.0.1 connection refusal. That flow was stopped. Completing MCP requires a supported local Codex client or managed connector whose OAuth callback is reachable; issuing another Cloud callback does not resolve it. No project linking, website deployment, paid service or course-code changes were made. See vercel-agent-setup.md for exact checks and continuation.
