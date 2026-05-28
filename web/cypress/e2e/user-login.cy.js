describe("User login", () => {
  it("allows an existing customer to login", () => {
    cy.intercept("POST", "**/api/auth/login").as("loginRequest");

    cy.visit("/auth");
    cy.getBySel("auth-tab-login").click();
    cy.getBySel("auth-email-input").type("customer@datamak.local");
    cy.getBySel("auth-password-input").type("Customer@123", { log: false });
    cy.getBySel("auth-submit-button").click();

    cy.wait("@loginRequest").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });

    cy.location("pathname").should("eq", "/");
    cy.getBySel("home-user-chip").should("contain.text", "Sample Customer");
  });
});
