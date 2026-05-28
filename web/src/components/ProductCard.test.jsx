import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductCard from "./ProductCard";

const product = {
  id: "dell-xps-13",
  name: "Dell XPS 13",
  price: 15000,
  discountPercent: 10,
  stock: 4,
  imageUrl: "https://example.com/dell.jpg",
  type: "physical"
};

afterEach(() => {
  cleanup();
});

function renderCard(overrides = {}, handlers = {}) {
  const props = {
    product: { ...product, ...overrides },
    onAddToCart: vi.fn(),
    onQuickView: vi.fn(),
    onWishlist: vi.fn(),
    busy: false,
    wishlisted: false,
    ...handlers
  };

  render(
    <MemoryRouter>
      <ProductCard {...props} />
    </MemoryRouter>
  );

  return props;
}

describe("React Testing Library web ProductCard", () => {
  it("WEB-01 renders product details and discounted price", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: "Dell XPS 13" })).toBeInTheDocument();
    expect(screen.getByText("M 13,500.00")).toBeInTheDocument();
    expect(screen.getByText("10% OFF")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/products/dell-xps-13"
    );
  });

  it("WEB-02 calls product action handlers when buttons are clicked", () => {
    const handlers = {
      onAddToCart: vi.fn(),
      onQuickView: vi.fn(),
      onWishlist: vi.fn()
    };

    renderCard({}, handlers);

    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
    fireEvent.click(screen.getByRole("button", { name: "Quick View" }));
    fireEvent.click(screen.getByRole("button", { name: "Toggle wishlist" }));

    expect(handlers.onAddToCart).toHaveBeenCalledWith("dell-xps-13");
    expect(handlers.onQuickView).toHaveBeenCalledWith(expect.objectContaining(product));
    expect(handlers.onWishlist).toHaveBeenCalledWith("dell-xps-13");
  });

  it("WEB-03 disables add to cart for out-of-stock products", () => {
    const onAddToCart = vi.fn();

    renderCard({ stock: 0 }, { onAddToCart });

    const button = screen.getByRole("button", { name: "Out of Stock" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onAddToCart).not.toHaveBeenCalled();
  });
});
