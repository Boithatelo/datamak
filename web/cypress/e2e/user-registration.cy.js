describe("User registration", () => {
  it("allows a new customer to register", () => {
    const timestamp = Date.now();
    const user = {
      name: "Boithatelo Motelle",
      email: `cypress.user.${timestamp}@example.com`,
      password: "Cypress@123"
    };

    cy.intercept("POST", "**/api/auth/register").as("registerRequest");

    cy.visit("/auth");
    cy.getBySel("auth-tab-register").click();
    cy.getBySel("register-name-input").type(user.name);
    cy.getBySel("auth-email-input").type(user.email);
    cy.getBySel("auth-password-input").type(user.password, { log: false });
    cy.getBySel("register-confirm-password-input").type(user.password, { log: false });
    cy.getBySel("auth-submit-button").click();

    cy.location("pathname").should("eq", "/");
    cy.getBySel("home-user-chip").should("contain.text", user.name);

    cy.get("@registerRequest.all").then((requests) => {
      const statusCodes = requests
        .map((request) => request.response?.statusCode)
        .filter((statusCode) => Number.isInteger(statusCode));

      expect(statusCodes, "register responses").to.include(201);
    });

    cy.window().then((win) => {
      expect(win.localStorage.getItem("shop_token")).to.be.a("string").and.not.be.empty;
      expect(win.localStorage.getItem("shop_user")).to.contain(user.email);
    });
  });
});
