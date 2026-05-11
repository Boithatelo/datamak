import { SEL } from "../../support/selectors";

const readResultCount = () =>
  cy
    .getByTestId(SEL.catalog.count)
    .invoke("text")
    .then((text) => Number(text.trim()));

describe("Catalog Search and Smart Filtering", () => {
  beforeEach(() => {
    cy.mockEcommerceApi();
    cy.visit("/catalog");
    cy.wait("@apiProductsList");
  });

  describe("Search", () => {
    it("filters products by search term", () => {
      cy.getByTestId(SEL.catalog.searchInput).type("Dell");
      cy.wait(300);
      cy.getByTestId(SEL.catalog.productGrid).find("[data-testid='product-card']").should("have.length.greaterThan", 0);
      cy.getByTestId(SEL.catalog.productGrid).find("h3").each(($title) => {
        expect($title.text().toLowerCase()).to.include("dell");
      });
    });

    it("shows a clear empty state for no search results", () => {
      cy.getByTestId(SEL.catalog.searchInput).type("product-that-does-not-exist-xyz");
      cy.wait(300);
      cy.getByTestId(SEL.catalog.emptyState).should("be.visible");
      cy.getByTestId("catalog-clear-filters-button").should("be.visible");
    });

    it("updates results in real time with debounced search", () => {
      readResultCount().then((initialCount) => {
        cy.getByTestId(SEL.catalog.searchInput).type("Ryzen");
        cy.wait(300);
        readResultCount().should("be.lessThan", initialCount);
      });
    });

    it("provides autocomplete suggestions", () => {
      cy.getByTestId(SEL.catalog.searchInput).type("host");
      cy.getByTestId(SEL.catalog.searchSuggestions)
        .find("option")
        .should("have.length.greaterThan", 0)
        .then(($options) => {
          const values = [...$options].map((option) => option.value.toLowerCase());
          expect(values.some((value) => value.includes("hosting"))).to.eq(true);
        });
    });

    it("keeps search usable on small screens", () => {
      cy.setViewportPreset("iphone");
      cy.getByTestId(SEL.catalog.searchInput).clear().type("Intel Core i7");
      cy.wait(300);
      cy.getByTestId(SEL.catalog.productGrid).find("[data-testid='product-card']").should("have.length.greaterThan", 0);
      cy.getByTestId(SEL.catalog.clearSearch).click();
      cy.getByTestId(SEL.catalog.searchInput).should("have.value", "");
    });
  });

  describe("Filters", () => {
    it("applies category, brand, processor, and RAM filters together", () => {
      cy.getByTestId("filter-toggle-categories").click();
      cy.getByTestId("filter-category-computers").click();

      cy.getByTestId("filter-toggle-brands").click();
      cy.getByTestId("filter-brand-dell").click();

      cy.getByTestId("filter-toggle-processor").click();
      cy.getByTestId("filter-processor-intel-core-i5").click();

      cy.getByTestId("filter-toggle-ram").click();
      cy.getByTestId("filter-ram-16gb").click();

      cy.getByTestId(SEL.catalog.productGrid).find("[data-testid='product-card']").should("have.length.greaterThan", 0);
      cy.getByTestId(SEL.catalog.productGrid).find("h3").each(($title) => {
        expect($title.text()).to.match(/Dell|Latitude|ThinkPad|Precision/i);
      });
    });

    it("applies ICT filters and narrows to matching subcategory/brand", () => {
      cy.getByTestId("filter-toggle-categories").click();
      cy.getByTestId("filter-category-ict-products").click();

      cy.getByTestId("filter-toggle-categories").click();
      cy.getByTestId("filter-ict-category-networking-equipment").click();

      cy.getByTestId("filter-toggle-brands").click();
      cy.getByTestId("filter-brand-tp-link").click();

      cy.getByTestId(SEL.catalog.productGrid).find("h3").should("contain.text", "TP-Link");
      readResultCount().should("eq", 1);
    });

    it("applies web hosting filters for type, OS, and billing", () => {
      cy.getByTestId("filter-toggle-categories").click();
      cy.getByTestId("filter-category-web-hosting-services").click();

      cy.getByTestId("filter-toggle-hosting-type").click();
      cy.getByTestId("filter-hosting-type-vps-hosting").click();

      cy.getByTestId("filter-toggle-hosting-os").click();
      cy.getByTestId("filter-hosting-os-linux").click();

      cy.getByTestId("filter-toggle-hosting-billing").click();
      cy.getByTestId("filter-hosting-billing-monthly").click();

      cy.getByTestId(SEL.catalog.productGrid).find("h3").should("contain.text", "VPS");
    });

    it("filters by price range and updates results dynamically", () => {
      readResultCount().then((initialCount) => {
        cy.getByTestId("filter-toggle-price").click();
        cy.getByTestId("filter-price-max-slider")
          .invoke("val", 10000)
          .trigger("input")
          .trigger("change");
        cy.wait(250);
        readResultCount().should("be.lessThan", initialCount);
      });
    });

    it("shows product availability state (out-of-stock handling)", () => {
      cy.getByTestId(SEL.catalog.searchInput).type("XPS Creator");
      cy.wait(300);
      cy.getByTestId(SEL.catalog.productGrid)
        .find("[data-testid='product-add-to-cart']")
        .first()
        .should("be.disabled")
        .and("contain.text", "Out of Stock");
    });

    it("resets all filters using clear all", () => {
      cy.getByTestId("filter-toggle-brands").click();
      cy.getByTestId("filter-brand-dell").click();
      cy.getByTestId("filter-toggle-ram").click();
      cy.getByTestId("filter-ram-16gb").click();
      cy.getByTestId("filter-clear-all").click();

      cy.getByTestId("filter-active-count").should("contain", "0 active");
      cy.getByTestId(SEL.catalog.searchInput).should("have.value", "");
    });

    it("keeps filter interactions working on mobile viewport", () => {
      cy.setViewportPreset("samsung");
      cy.getByTestId("filter-toggle-categories").click();
      cy.getByTestId("filter-category-ict-products").click();
      cy.getByTestId(SEL.catalog.productGrid).find("[data-testid='product-card']").should("have.length.greaterThan", 0);
    });
  });

  describe("Sorting", () => {
    it("keeps products sorted by newest first by default", () => {
      cy.getByTestId(SEL.catalog.productGrid)
        .find("[data-testid='product-card']")
        .first()
        .find("h3")
        .should("contain.text", "Dell Latitude 5440 Intel Core i5");
    });
  });
});

describe("Catalog Loading Behavior", () => {
  it("shows loading state while products are being fetched", () => {
    cy.mockEcommerceApi({ simulateCatalogDelayMs: 700 });
    cy.visit("/catalog");
    cy.getByTestId("catalog-loading-state").should("be.visible");
    cy.wait("@apiProductsListWithDelay");
    cy.getByTestId(SEL.catalog.productGrid).should("be.visible");
  });
});
