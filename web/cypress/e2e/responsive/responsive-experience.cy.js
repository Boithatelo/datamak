import { SEL } from "../../support/selectors";

describe("Responsive Ecommerce Experience", () => {
  beforeEach(() => {
    cy.mockEcommerceApi();
    cy.loginAs("customer");
    cy.wait("@apiLogin");
  });

  it("supports mobile navbar interactions on iPhone", () => {
    cy.setViewportPreset("iphone");
    cy.visit("/catalog");
    cy.getByTestId(SEL.nav.menuButton).click();
    cy.getByTestId(SEL.nav.links).should("have.class", "open");
    cy.getByTestId("nav-link-hosting").click();
    cy.url().should("include", "/hosting");
  });

  it("supports mobile filters and touch product interactions on Samsung", () => {
    cy.setViewportPreset("samsung");
    cy.visit("/catalog");
    cy.wait("@apiProductsList");

    cy.getByTestId("filter-toggle-categories").click();
    cy.getByTestId("filter-category-ict-products").click();
    cy.getByTestId(SEL.catalog.productGrid).find("[data-testid='product-card']").should("have.length.greaterThan", 0);

    cy.getByTestId("product-card").first().trigger("touchstart");
    cy.getByTestId("product-add-to-cart").first().click();
    cy.wait("@apiCartAdd");
  });

  it("renders checkout cleanly on iPad/tablet viewport", () => {
    cy.setViewportPreset("ipad");
    cy.visit("/checkout");
    cy.getByTestId(SEL.checkout.page).should("be.visible");
    cy.getByTestId("checkout-stepper").should("be.visible");
    cy.getByTestId("checkout-summary-total").should("be.visible");
  });

  it("keeps desktop layout stable for catalog sidebar and grid", () => {
    cy.setViewportPreset("desktop");
    cy.visit("/catalog");
    cy.getByTestId("filter-sidebar").should("be.visible");
    cy.getByTestId(SEL.catalog.productGrid).should("be.visible");
    cy.getByTestId(SEL.catalog.productGrid).find("[data-testid='product-card']").should("have.length.greaterThan", 3);
  });
});
