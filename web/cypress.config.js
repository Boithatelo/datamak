import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:5173",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    env: {
      apiUrl: "http://127.0.0.1:4000/api"
    }
  },
  retries: {
    runMode: 1,
    openMode: 0
  },
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 60000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/artifacts/screenshots",
  video: true,
  videosFolder: "cypress/artifacts/videos",
  viewportHeight: 800,
  viewportWidth: 1366
});
