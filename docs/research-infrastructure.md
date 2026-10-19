# Optional research infrastructure

This document prepares access only. No course literature search or curriculum research was performed. None of these integrations is needed to install, build, run, or test the application. No mandatory paid subscription is introduced.

## OpenAlex

Use https://api.openalex.org for literature metadata/discovery, not as a source of verified scientific claims. Official docs: https://docs.openalex.org and https://developers.openalex.org . The official `ourresearch/openalex-docs` repository was inspected through GitHub when direct documentation access was blocked. Its authentication guidance permits unauthenticated requests, but may lag the live API; verify the live requirement and current free quota before implementation. A free key can be obtained via https://openalex.org if required or rate limits demand it. `OPENALEX_API_KEY` is not currently set; no key is required by the foundation. Keep any future key in secure environment settings, never chat, Git, client code or request logs. The documented API key query parameter needs care to avoid logging URLs with credentials; confirm compatibility with Cloud proxy secret binding before adding an integration.

Future adapter: server/agent only, bounded requests and pagination, caching, backoff on 429, stable DOI/OpenAlex IDs, and recorded access dates. Verify DOI metadata, full text, assumptions and licensing independently; OpenAlex indexing is not peer-review validation. No adapter or search UI is implemented now.

## Context7 MCP

Official source inspected: https://github.com/upstash/context7 (`c7f80ce5af1ff1403d167579b76784482cf7f3e2`), especially `docs/clients/codex.mdx`. Hosted MCP endpoint: `https://mcp.context7.com/mcp`. Codex Cloud enables MCP through the environment's tools/settings; a repository file alone cannot register a callable tool in this conversation. Context7 is not currently exposed as a callable tool here.

Enable the hosted Context7 MCP in Codex Cloud settings. If authentication is requested, use its OAuth flow or a free key from https://context7.com/dashboard through secure settings; `CONTEXT7_API_KEY` is not currently set. Official upstream documentation recommends a free key for higher rate limits. Its current hosted-header example uses `Authorization: Bearer <key>`. Never commit that header value. No paid plan is required for foundation work.

When enabled, verify `resolve-library-id` for `next`, then `query-docs` with the resolved ID and the installed Next.js version. This verifies actual tool access; a successful HTTP handshake alone does not. Use upstream docs if the MCP is unavailable. No MCP invocation has been claimed as passing.

## Reputable educational resources

Future starting points (not researched for curriculum in this task):

- MIT OpenCourseWare: https://ocw.mit.edu (university physics courses).
- OpenStax: https://openstax.org/subjects/science (Rice University textbooks; check individual license/attribution).
- Physics LibreTexts: https://phys.libretexts.org (check author, provenance and page license).
- Penn State Graduate Program in Acoustics: https://www.acs.psu.edu (university acoustics resources).

Record source title, institution/author, URL/DOI, access date, section, units, assumptions, and reuse license before incorporating material. Cross-check advanced claims against primary literature. Discovery links are recommendations, not validation of particular claims.

## Cloud networking and readiness

Direct HTTPS checks to OpenAlex documentation, Context7 documentation and OpenStax returned proxy CONNECT 403 under the initial restricted policy. Domain additions were saved in the environment draft for `api.openalex.org`, `docs.openalex.org`, `developers.openalex.org`, `openalex.org`, `context7.com`, `mcp.context7.com`, `openstax.org`, `phys.libretexts.org`, `ocw.mit.edu`, and `www.acs.psu.edu`. Playwright download domains `cdn.playwright.dev` and `playwright.download.prss.microsoft.com` were also requested. Existing package-manager preset access is preserved. A saved draft does not apply network policy; review/save it in environment settings and publish when ready. Additional redirect/CDN destinations should be added only after observing a concrete failure.

After applying access, repeat a metadata-only OpenAlex request, verify a Context7 tool call, and check the chosen university source. Do not claim these integrations ready until those operations succeed. Enter optional keys securely only if an actual use requires them.

## Current build-session observations (2026-10-19)

Runtime status now reports unrestricted enforced HTTP policy. OpenStax sections, Penn State demonstrations, the IES guide/PDF, REW help and ASA's actual Explore Sound directory were successfully retrieved. OpenAlex returned a paper record without requiring a key for that read; this does not establish all endpoints' quotas or future key requirements. Context7 is still not exposed as a callable tool in this session. See `src/content/references.json` for exact reviewed URLs and evidence scope; the earlier 403 observations describe initial setup, not the current runtime.
