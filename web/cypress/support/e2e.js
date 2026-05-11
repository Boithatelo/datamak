import "./commands";

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
