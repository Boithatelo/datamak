import { SEL } from "../../support/selectors";

describe("Authentication Workflows", () => {
  beforeEach(() => {
    cy.mockEcommerceApi();
  });

  describe("Login", () => {
    it("logs in successfully with valid customer credentials", () => {
      cy.visit("/auth");
      cy.getByTestId(SEL.auth.loginMode).click();
      cy.getByTestId(SEL.auth.emailInput).type(Cypress.env("customerEmail"));
      cy.getByTestId(SEL.auth.passwordInput).type(Cypress.env("customerPassword"), { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiLogin");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
      cy.window().its("localStorage.shop_token").should("be.a", "string");
    });

    it("shows an error for invalid credentials", () => {
      cy.visit("/auth");
      cy.getByTestId(SEL.auth.emailInput).type("wrong@datamak.test");
      cy.getByTestId(SEL.auth.passwordInput).type("WrongPass123", { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiLogin");
      cy.getByTestId(SEL.auth.errorMessage).should("contain", "Invalid email or password");
      cy.url().should("include", "/auth");
    });

    it("validates empty required login fields", () => {
      cy.visit("/auth");
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.getByTestId(SEL.auth.emailInput).then(($input) => {
        expect($input[0].validationMessage).to.not.equal("");
      });
    });

    it("redirects to a protected route after successful login", () => {
      cy.visit("/cart");
      cy.url().should("include", "/auth");

      cy.getByTestId(SEL.auth.emailInput).type(Cypress.env("customerEmail"));
      cy.getByTestId(SEL.auth.passwordInput).type(Cypress.env("customerPassword"), { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiLogin");
      cy.wait("@apiCartGet");
      cy.url().should("include", "/cart");
      cy.getByTestId(SEL.cart.itemList).should("be.visible");
    });

    it("keeps the session on page reload", () => {
      cy.visit("/auth");
      cy.getByTestId(SEL.auth.emailInput).type(Cypress.env("customerEmail"));
      cy.getByTestId(SEL.auth.passwordInput).type(Cypress.env("customerPassword"), { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiLogin");
      cy.visit("/catalog");
      cy.reload();
      cy.wait("@apiAuthMe");
      cy.getByTestId(SEL.nav.logoutButton).should("be.visible");
      cy.window().its("localStorage.shop_user").should("contain", "Sample Customer");
    });

    it("logs out and clears local session data", () => {
      cy.visit("/auth");
      cy.getByTestId(SEL.auth.emailInput).type(Cypress.env("customerEmail"));
      cy.getByTestId(SEL.auth.passwordInput).type(Cypress.env("customerPassword"), { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiLogin");
      cy.visit("/catalog");
      cy.getByTestId(SEL.nav.logoutButton).click();
      cy.window().its("localStorage.shop_token").should("be.null");
      cy.getByTestId(SEL.nav.loginRegisterLink).should("be.visible");
    });
  });

  describe("Registration", () => {
    beforeEach(() => {
      cy.visit("/auth");
      cy.getByTestId(SEL.auth.registerMode).click();
    });

    it("registers a new account successfully", () => {
      cy.getByTestId(SEL.auth.nameInput).type("New Student");
      cy.getByTestId(SEL.auth.emailInput).type("new.student@datamak.test");
      cy.getByTestId(SEL.auth.passwordInput).type("Student123", { log: false });
      cy.getByTestId(SEL.auth.confirmPasswordInput).type("Student123", { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiRegister");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
      cy.window().its("localStorage.shop_user").should("contain", "new.student@datamak.test");
    });

    it("validates email format", () => {
      cy.getByTestId(SEL.auth.nameInput).type("User Test");
      cy.getByTestId(SEL.auth.emailInput).type("invalid-email");
      cy.getByTestId(SEL.auth.passwordInput).type("StrongPass1", { log: false });
      cy.getByTestId(SEL.auth.confirmPasswordInput).type("StrongPass1", { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.getByTestId(SEL.auth.errorMessage).should("contain", "valid email address");
    });

    it("validates password complexity", () => {
      cy.getByTestId(SEL.auth.nameInput).type("User Test");
      cy.getByTestId(SEL.auth.emailInput).type("pw.validation@datamak.test");
      cy.getByTestId(SEL.auth.passwordInput).type("weakpass", { log: false });
      cy.getByTestId(SEL.auth.confirmPasswordInput).type("weakpass", { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.getByTestId(SEL.auth.errorMessage).should("contain", "uppercase, lowercase, and a number");
    });

    it("prevents duplicate account registration", () => {
      cy.getByTestId(SEL.auth.nameInput).type("Duplicate User");
      cy.getByTestId(SEL.auth.emailInput).type(Cypress.env("customerEmail"));
      cy.getByTestId(SEL.auth.passwordInput).type("Duplicate123", { log: false });
      cy.getByTestId(SEL.auth.confirmPasswordInput).type("Duplicate123", { log: false });
      cy.getByTestId(SEL.auth.submitButton).click();

      cy.wait("@apiRegister");
      cy.getByTestId(SEL.auth.errorMessage).should("contain", "already exists");
    });

    it("validates required registration fields", () => {
      cy.getByTestId(SEL.auth.submitButton).click();
      cy.getByTestId(SEL.auth.nameInput).then(($input) => {
        expect($input[0].validationMessage).to.not.equal("");
      });
    });
  });
});
