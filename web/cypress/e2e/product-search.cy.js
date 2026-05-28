describe("Product search", () => {
  it("allows customers to search products from the catalog page", () => {
    cy.visit("/catalog");

    cy.getBySel("catalog-search-input").should("be.visible").type("ThinkPad");
    cy.getBySel("catalog-search-submit").click();

    cy.getBySel("product-card", { timeout: 20000 }).should("have.length.greaterThan", 0);
    cy.getBySel("product-name").should("contain.text", "ThinkPad");
    cy.location("search").should("contain", "search=ThinkPad");
  });

  it("filters products from the Sort dropdown", () => {
    cy.visit("/catalog");

    cy.getBySel("catalog-sort-trigger").click();
    cy.getBySel("catalog-filter-menu").should("be.visible");
    cy.getBySel("catalog-filter-category-laptops").click();
    cy.getBySel("catalog-filter-price-below-5000").click();
    cy.getBySel("catalog-filter-brand-lenovo").click();
    cy.getBySel("catalog-filter-availability-in-stock").click();

    cy.getBySel("product-name", { timeout: 20000 }).should(($names) => {
      const names = [...$names].map((name) => name.innerText.toLowerCase());

      expect(names.length).to.be.greaterThan(0);
      names.forEach((name) => {
        expect(name).to.include("lenovo");
      });
    });

    cy.location("search").should("contain", "categoryFilter=laptops");
    cy.location("search").should("contain", "priceRange=below-5000");
    cy.location("search").should("contain", "brand=Lenovo");
    cy.location("search").should("contain", "availability=in-stock");
  });
});
