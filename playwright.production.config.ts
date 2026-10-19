import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  webServer: { command: "pnpm start", url: "http://127.0.0.1:3000", reuseExistingServer: false, timeout: 120_000 },
});
