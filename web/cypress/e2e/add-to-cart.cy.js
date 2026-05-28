describe("Add to cart", () => {
  beforeEach(() => {
    cy.clearCart();
  });

  it("adds a product to cart from catalog", () => {
    cy.intercept("POST", "**/api/cart/items").as("addItemRequest");

    cy.visitAsCustomer("/catalog");
    cy.getBySel("product-card", { timeout: 20000 }).should("have.length.greaterThan", 0);

    cy.getBySel("product-card")
      .first()
      .within(() => {
        cy.getBySel("add-to-cart-button").click();
      });

    cy.wait("@addItemRequest").then(({ response }) => {
      expect(response?.statusCode).to.eq(201);
    });

    cy.getBySel("message-dialog-text").should("contain.text", "Product added to cart.");
    cy.getBySel("message-dialog-ok").click();

    cy.getBySel("nav-cart-link").click();
    cy.location("pathname").should("eq", "/cart");
    cy.getBySel("cart-item").its("length").should("be.gte", 1);
  });
});
