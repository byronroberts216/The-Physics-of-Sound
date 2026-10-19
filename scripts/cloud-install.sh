#!/usr/bin/env bash
set -euo pipefail
cd /workspace/The-Physics-of-Sound
export npm_config_cache=/workspace/.cache/npm
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
export NEXT_TELEMETRY_DISABLED=1
case "$(node --version)" in v24.*) ;; *) echo "Node 24.x required" >&2; exit 1 ;; esac
npm install --prefix /workspace/.tools --no-package-lock --no-audit --no-fund pnpm@10.34.7
export PATH="/workspace/.tools/node_modules/.bin:$PATH"
pnpm install --frozen-lockfile --store-dir /workspace/.cache/pnpm/store
if command -v chromium >/dev/null 2>&1; then
  chromium --version
else
  pnpm exec playwright install chromium
fi
pnpm check:skills
