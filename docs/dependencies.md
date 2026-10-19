# Dependency decisions

Installed runtime: Next.js 16.4.2, React/React DOM 19.3.1. Installed development tools: TypeScript 5.9.3, ESLint with Next.js rules, React/Node type declarations, and Playwright 1.64.1. Exact resolved versions and integrity metadata are in `pnpm-lock.yaml`. Node 24 and pnpm 10 are required. ESLint 9.39.5 is retained because the current Next.js React/import/accessibility plugins do not yet declare ESLint 10 compatibility. npm marks ESLint 9 deprecated; upgrade the config/plugin stack together when it supports ESLint 10 rather than suppressing peer warnings. No database, auth provider, animation framework, styling framework, or paid service is needed now.

| Library | Future use | Foundation decision and constraints |
| --- | --- | --- |
| Tone.js (`tone`) | Oscillators, envelopes, audio experiments | Defer until audio exists. Lazy-load in a client boundary, unlock audio on user gesture, stop/dispose nodes, constrain gain and provide stop controls. Browser scheduling is not a numerical acoustics solver. |
| p5.js (`p5`) | Canvas sketches and interactive demonstrations | Defer; native Canvas/SVG may suffice. Use instance mode, client-only import and cleanup; keep equations independent, support accessible alternatives and reduced motion. |
| D3.js (`d3` or small `d3-*` modules) | Scientific scales, axes, data transformations | Defer; choose focused modules when graph requirements exist. Let React own DOM when practical; include units, labels, accessible tables and consistent scale semantics. |
| KaTeX (`katex`) | Fast static/server mathematical typesetting | Defer until equations exist. Include required CSS/fonts locally and accessible MathML output; leave `trust` disabled for untrusted input. |
| WaveSurfer.js (`wavesurfer.js`) | Recorded audio waveform exploration | Defer; not a wave-propagation simulation. Client-only import, cleanup, explicit audio permission/controls, accessible playback alternatives and licensed media. |
| ts-fsrs (`ts-fsrs`) | Spaced-repetition scheduling | Defer until learning state and persistence are designed. Test scheduling/time-zone semantics; separate user data policy from the algorithm. |
| Playwright (`@playwright/test`) | Browser smoke, interaction and regression tests | Installed now. Chromium desktop/mobile smoke tests; Firefox/WebKit and deeper accessibility tests can be added when features need them. |

Evaluate current versions, licenses, bundle cost, SSR behavior and official documentation before installation. Motion is optional for future gesture-driven UI; Apple Design does not require adding it now. No extra science package is useful to a readiness placeholder.

## Course implementation update

KaTeX 0.19.0 is now installed because lessons render explained equations server-side, with HTML plus MathML and `trust: false`. Its CSS/fonts are served locally. `@axe-core/playwright` is a development-only dependency for bounded automated accessibility checks. Numerical/state/content tests use Node's built-in runner; no extra test framework is needed.

SVG plus pure TypeScript suits the current modest plots; D3 and p5 would add weight without a demonstrated benefit. Native Web Audio supplies one controlled oscillator; Tone is deferred until scheduling/complex synthesis justifies it. No microphone spectrum analyzer, WaveSurfer recording view or FSRS algorithm is implemented. The simple review schedule is explicitly described and tested rather than presented as FSRS.
