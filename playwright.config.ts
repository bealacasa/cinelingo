import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "iphone", use: { ...devices["iPhone 15"] } },
    { name: "android", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // Build de producción (CSP sin unsafe-*). Sin Supabase, usa el modo demo explícito.
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/privacidad`,
    reuseExistingServer: !process.env.CI,
    env: { CINELINGO_DEMO: process.env.SUPABASE_URL ? "" : "1" },
    timeout: 120_000,
  },
});
