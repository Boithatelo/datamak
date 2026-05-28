import "./commands";

function screenshotNameFor(test) {
  const title = test.titlePath ? test.titlePath().join(" -- ") : test.fullTitle();
  return title
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 120);
}

// Keep each test isolated and deterministic.
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Ignore known browser noise that is not application logic.
Cypress.on("uncaught:exception", (error) => {
  if (/ResizeObserver loop limit exceeded/i.test(error.message)) {
    return false;
  }
  return true;
});

afterEach(function () {
  if (this.currentTest?.state !== "passed") {
    return;
  }

  const specName = Cypress.spec.name.replace(/\.cy\.js$/i, "");
  const testName = screenshotNameFor(this.currentTest);

  cy.screenshot(`passed/${specName}/${testName}`, {
    capture: "fullPage",
    overwrite: true
  });
});
