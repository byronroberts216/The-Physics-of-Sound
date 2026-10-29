# Vercel agent onboarding

Setup performed on 2026-10-28 (America/Chicago), following https://vercel.com/get-started.md. This is agent/tool setup, not website deployment or project linking.

## Verified installation

- Vercel CLI **65.5.0**, installed user-wide using `npm install --global vercel@latest`.
- Executable: `/home/agent/.local/bin/vercel`; `vercel --version` succeeds.
- Official plugin installation was attempted for Codex user scope. It failed because `vercel` was absent from the `openai-curated` and `openai-api-curated` marketplaces. Official plugin documentation was checked before using the playbook's fallback. No plugin is enabled, and `/vercel-plugin:status` is not claimed available.
- Fallback: `npx skills add vercel-labs/agent-skills --global --agent codex --yes`. All nine installed skills were listed by `npx skills list --global --agent codex`: deploy-to-vercel, vercel-cli-with-tokens, vercel-composition-patterns, vercel-optimize, vercel-react-best-practices, vercel-react-native-skills, vercel-react-view-transitions, web-design-guidelines, writing-guidelines.
- Skill location: `/home/agent/.agents/skills/<name>/SKILL.md`. Repository-local Apple Design and acoustics-course-author remain unchanged. These global skills are installed guidance; hot-loading them into the current conversation was not verified.

## Authentication and MCP

The user completed the official `vercel login` device authorization flow. The CLI reported successful sign-in, and a subsequent `vercel whoami` verified **leftyb66-7170**. CLI authentication is complete. Do not store short-lived device codes or authorization URLs in this document and never request a token in chat.

`codex mcp list` was inspected before adding the shared server. `codex mcp add vercel --url https://mcp.vercel.com` successfully added the global `vercel` entry in `/home/agent/.codex/config.toml`, preserving unrelated settings. The initial OAuth attempt timed out waiting for its callback. The redirect targets localhost inside the Cloud machine, which may require a supported callback route; a timeout alone does not prove the user signed in incorrectly. `codex mcp list` shows enabled and **Not logged in**. An unauthenticated MCP initialize request reached the official endpoint and returned **HTTP 401 / no authorization provided**, confirming that authentication is required rather than that the endpoint is unreachable.

User-wide Codex CLI configuration does not by itself add callable tools to this running managed Codex Cloud conversation. Cloud may require enabling the remote MCP connection through its agent/environment tool settings. No `search_vercel_documentation` or authenticated `list_teams` call has succeeded in this session. Complete OAuth through the supported client, refresh tools, then verify both read-only calls. Do not claim MCP connected until that verification succeeds. Keep human confirmation for all MCP mutations; this setup performed none.

For a local Codex CLI session, use `codex mcp login vercel` if the configured server needs authentication. Cloud OAuth flows that redirect to a loopback callback may need the platform's managed connection UI rather than a browser on another machine. Never paste credential-bearing callback URLs or tokens into chat.

## Resume checks

```sh
vercel --version
vercel whoami
npx skills list --global --agent codex
codex mcp list
```

After authentication, confirm `search_vercel_documentation` and read-only `list_teams` are callable in the intended agent. Reload/start a new agent session only if refreshing tools does not load them. A reload was not performed here. User-global installation is verified for this machine; restoration of these home-directory tools in a fresh Cloud task has not been tested.

No Vercel project was created or linked, no `.vercel/project.json` was generated, no deployment occurred, and no paid service was provisioned. Existing application code, dependencies, lockfile, local course skills and learning state were not modified. Project linking belongs to a later project-specific request; public deployment requires separate authorization under the academy's existing instructions.

## Sources inspected

- https://vercel.com/get-started.md — agent onboarding playbook.
- https://vercel.com/docs/agent-resources/vercel-plugin.md — plugin capabilities, support and fallback diagnosis.
- https://github.com/vercel/vercel-plugin — manifest and commands reviewed; installation failed in this client's marketplace.
- https://github.com/vercel-labs/agent-skills — installed official standalone fallback pack.
