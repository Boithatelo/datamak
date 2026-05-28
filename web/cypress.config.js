import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/artifacts/screenshots",
  videosFolder: "cypress/artifacts/videos",
  downloadsFolder: "cypress/artifacts/downloads",
  reporter: "spec",
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 60000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  viewportHeight: 800,
  viewportWidth: 1366,
  retries: {
    runMode: 1,
    openMode: 0
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://127.0.0.1:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    chromeWebSecurity: false,
    env: {
      apiUrl: process.env.CYPRESS_API_URL || "http://127.0.0.1:4000/api"
    }
  }
});
