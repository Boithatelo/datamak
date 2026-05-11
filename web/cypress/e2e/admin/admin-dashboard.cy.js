import { SEL } from "../../support/selectors";

describe("Admin Dashboard Workflows", () => {
  beforeEach(() => {
    cy.mockEcommerceApi();
    cy.loginAs("admin");
    cy.wait("@apiLogin");
    cy.url().should("include", "/admin");
  });

  it("loads admin dashboard sections after admin login", () => {
    cy.getByTestId("admin-dashboard-grid").should("be.visible");
    cy.getByTestId(SEL.admin.tileProducts).should("be.visible");
    cy.getByTestId(SEL.admin.tileOrders).should("be.visible");
    cy.getByTestId(SEL.admin.tileSummary).should("be.visible");
  });

  it("adds a new product", () => {
    cy.getByTestId(SEL.admin.tileProducts).click();
    cy.getByTestId(SEL.admin.addProductForm).should("be.visible");

    cy.getByTestId("admin-product-name-input").type("Cypress Test Workstation");
    cy.getByTestId("admin-product-description-input").type("Automated E2E product creation flow.");
    cy.getByTestId("admin-product-category-select").select("Computers");
    cy.getByTestId("admin-product-subcategory-select").select("Desktops");
    cy.getByTestId("admin-product-price-input").type("14500");
    cy.getByTestId("admin-product-stock-input").clear().type("7");
    cy.getByTestId(SEL.admin.addProductButton).click();

    cy.wait("@apiCreateProduct");
    cy.wait("@apiProductsList");
    cy.contains("td", "Cypress Test Workstation").should("be.visible");
  });

  it("edits an existing product category", () => {
    cy.getByTestId(SEL.admin.tileProducts).click();
    cy.getByTestId("admin-product-row-category-select").first().select("ICT Products");
    cy.wait("@apiUpdateProduct");
    cy.wait("@apiProductsList");
  });

  it("deletes a product", () => {
    cy.getByTestId(SEL.admin.tileProducts).click();
    cy.getByTestId(SEL.admin.productRow).its("length").then((rowsBefore) => {
      cy.getByTestId(SEL.admin.productDeleteButton).first().click();
      cy.wait("@apiDeleteProduct");
      cy.wait("@apiProductsList");
      cy.getByTestId(SEL.admin.productRow).should("have.length", rowsBefore - 1);
    });
  });

  it("manages order statuses from the admin orders table", () => {
    cy.getByTestId(SEL.admin.tileOrders).click();
    cy.getByTestId("admin-order-row").should("have.length.greaterThan", 0);
    cy.getByTestId(SEL.admin.orderStatusSelect).first().select("Shipped");
    cy.wait("@apiOrderStatusUpdate");
  });

  it("loads dashboard statistics in summary section", () => {
    cy.getByTestId(SEL.admin.tileSummary).click();
    cy.wait("@apiAdminSummary");
    cy.getByTestId("admin-summary-users").should("contain", "Users");
    cy.getByTestId("admin-summary-products").should("contain", "Products");
    cy.getByTestId("admin-summary-orders").should("contain", "Orders");
    cy.getByTestId("admin-summary-revenue").should("contain", "Revenue");
  });
});

describe("Admin Access Protection", () => {
  it("redirects non-admin users away from /admin", () => {
    cy.mockEcommerceApi();
    cy.loginAs("customer");
    cy.wait("@apiLogin");
    cy.visit("/admin");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });
});
