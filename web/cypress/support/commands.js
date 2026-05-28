const DEFAULT_CUSTOMER = {
  email: "customer@datamak.local",
  password: "Customer@123"
};

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
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
