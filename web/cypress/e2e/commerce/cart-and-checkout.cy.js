import { SEL } from "../../support/selectors";

const extractNumericAmount = (text) => {
  const numeric = String(text).replace(/[^\d.]/g, "");
  return Number(numeric || 0);
};

describe("Cart and Checkout Workflows", () => {
  beforeEach(() => {
    cy.mockEcommerceApi();
    cy.loginAs("customer");
    cy.wait("@apiLogin");
  });

  describe("Cart", () => {
    it("adds a product to cart from catalog", () => {
      cy.visit("/catalog");
      cy.wait("@apiProductsList");

      cy.getByTestId("product-add-to-cart").first().click();
      cy.wait("@apiCartAdd");

      cy.visit("/cart");
      cy.wait("@apiCartGet");
      cy.getByTestId(SEL.cart.item).should("have.length.greaterThan", 2);
    });

    it("removes a product from cart", () => {
      cy.visit("/cart");
      cy.wait("@apiCartGet");
      cy.getByTestId(SEL.cart.item).its("length").then((initialLength) => {
        cy.getByTestId(SEL.cart.removeButton).first().click();
        cy.wait("@apiCartRemove");
        cy.getByTestId(SEL.cart.item).should("have.length", initialLength - 1);
      });
    });

    it("updates quantity and recalculates totals", () => {
      cy.visit("/cart");
      cy.wait("@apiCartGet");

      cy.getByTestId(SEL.cart.grandTotal)
        .invoke("text")
        .then((beforeText) => {
          const beforeTotal = extractNumericAmount(beforeText);

          cy.getByTestId(SEL.cart.qtyInput).first().clear().type("2");
          cy.wait("@apiCartUpdate");

          cy.getByTestId(SEL.cart.grandTotal)
            .invoke("text")
            .then((afterText) => {
              const afterTotal = extractNumericAmount(afterText);
              expect(afterTotal).to.be.greaterThan(beforeTotal);
            });
        });
    });

    it("persists cart content after page reload", () => {
      cy.visit("/cart");
      cy.wait("@apiCartGet");
      cy.getByTestId(SEL.cart.qtyInput).first().clear().type("3");
      cy.wait("@apiCartUpdate");
      cy.reload();
      cy.wait("@apiCartGet");
      cy.getByTestId(SEL.cart.qtyInput).first().should("have.value", "3");
    });

    it("handles multiple products in the same cart", () => {
      cy.visit("/catalog");
      cy.wait("@apiProductsList");

      cy.getByTestId("product-add-to-cart").eq(0).click();
      cy.wait("@apiCartAdd");
      cy.getByTestId("product-add-to-cart").eq(1).click();
      cy.wait("@apiCartAdd");

      cy.visit("/cart");
      cy.wait("@apiCartGet");
      cy.getByTestId(SEL.cart.item).should("have.length.greaterThan", 3);
    });
  });

  describe("Checkout", () => {
    it("loads checkout page and progresses through steps", () => {
      cy.visit("/checkout");
      cy.getByTestId(SEL.checkout.page).should("be.visible");
      cy.getByTestId("checkout-payment-method-select").should("be.visible");
      cy.getByTestId("checkout-continue-button").click();
      cy.getByTestId("checkout-review-stage").should("be.visible");
    });

    it("completes simulated payment and shows order confirmation", () => {
      cy.visit("/checkout");
      cy.getByTestId("checkout-continue-button").click();
      cy.getByTestId("checkout-place-order-button").click();

      cy.wait("@apiCheckout");
      cy.url().should("include", "/checkout/success/");
      cy.getByTestId(SEL.checkout.successPanel).should("be.visible");
      cy.getByTestId("checkout-success-view-order").click();
      cy.wait("@apiOrderDetails");
      cy.url().should("include", "/orders/");
    });

    it("shows checkout error when payment API fails", () => {
      cy.intercept("POST", "**/api/checkout", {
        statusCode: 500,
        body: { message: "Payment gateway unavailable." }
      }).as("apiCheckoutFailure");

      cy.visit("/checkout");
      cy.getByTestId("checkout-continue-button").click();
      cy.getByTestId("checkout-place-order-button").click();
      cy.wait("@apiCheckoutFailure");
      cy.getByTestId("checkout-error-message").should("contain", "Payment gateway unavailable");
    });
  });
});

describe("Checkout Empty Cart Prevention", () => {
  it("prevents checkout when cart has no items", () => {
    cy.mockEcommerceApi();
    cy.loginAs("admin");
    cy.wait("@apiLogin");
    cy.visit("/checkout");
    cy.getByTestId(SEL.checkout.emptyState).should("contain", "No items for checkout");
  });
});
