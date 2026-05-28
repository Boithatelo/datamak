import { registerEcommerceApiMocks } from "./mockApi";

const DEFAULT_CUSTOMER = {
  email: "customer@datamak.local",
  password: "Customer@123"
};

const VIEWPORTS = {
  iphone: "iphone-x",
  samsung: "samsung-s10",
  ipad: "ipad-2",
  desktop: [1440, 900]
};

/**
 * Stable selector helper to avoid brittle CSS/text selectors in tests.
 */
Cypress.Commands.add("getByTestId", (testId, ...args) =>
  cy.get(`[data-testid="${testId}"]`, ...args)
);

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});

/**
 * Bootstraps a complete mocked ecommerce API surface for deterministic E2E tests.
 * Individual specs can pass options, for example `{ simulateCatalogDelayMs: 800 }`.
 */
Cypress.Commands.add("mockEcommerceApi", (options = {}) =>
  cy.fixture("auth.json").then((authFixture) =>
    cy.fixture("products.json").then((productsFixture) =>
      cy.fixture("cart.json").then((cartFixture) =>
        cy.fixture("orders.json").then((ordersFixture) =>
          cy.fixture("admin.json").then((adminFixture) => {
            registerEcommerceApiMocks({
              authFixture,
              productsFixture,
              cartFixture,
              ordersFixture,
              adminFixture,
              options
            });
          })
        )
      )
    )
  )
);

/**
 * Logs in through the real UI form while API traffic is mocked.
 * This validates the actual authentication UX flow and route redirect behavior.
 */
Cypress.Commands.add("loginAs", (role = "customer", redirectPath = "/") => {
  const emailKey = role === "admin" ? "adminEmail" : "customerEmail";
  const passwordKey = role === "admin" ? "adminPassword" : "customerPassword";

  cy.visit(`/auth${redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : ""}`);
  cy.getByTestId("auth-mode-login").click();
  cy.getByTestId("auth-email-input").clear().type(Cypress.env(emailKey));
  cy.getByTestId("auth-password-input").clear().type(Cypress.env(passwordKey), { log: false });
  cy.getByTestId("auth-submit-button").click();
});

/**
 * Uses tested viewport presets for responsive scenarios.
 */
Cypress.Commands.add("setViewportPreset", (preset = "desktop") => {
  const view = VIEWPORTS[preset] || VIEWPORTS.desktop;
  if (Array.isArray(view)) {
    cy.viewport(view[0], view[1]);
    return;
  }
  cy.viewport(view);
});

Cypress.Commands.add("apiLogin", (overrides = {}) => {
  const credentials = { ...DEFAULT_CUSTOMER, ...overrides };
  return cy
    .request("POST", `${Cypress.env("apiUrl")}/auth/login`, credentials)
    .its("body");
});

Cypress.Commands.add("visitAsCustomer", (path = "/") => {
  cy.apiLogin().then((auth) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("shop_token", auth.token);
        win.localStorage.setItem("shop_user", JSON.stringify(auth.user));
      }
    });
  });
});

Cypress.Commands.add("clearCart", () => {
  cy.apiLogin().then((auth) => {
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/cart`,
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });
  });
});
