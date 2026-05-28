import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import ProductCard from "./ProductCard";

const product = {
  id: "lenovo-thinkpad",
  name: "Lenovo ThinkPad",
  category: "Computers",
  description: "Business laptop",
  price: 12000,
  discountPercent: 15,
  stock: 6,
  imageUrl: "https://example.com/lenovo.jpg",
  type: "physical"
};

describe("React Native Testing Library mobile ProductCard", () => {
  it("MOBILE-01 renders product details and discounted price", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText("Computers")).toBeTruthy();
    expect(screen.getByText("Lenovo ThinkPad")).toBeTruthy();
    expect(screen.getByText("Business laptop")).toBeTruthy();
    expect(screen.getByText("M 10,200.00")).toBeTruthy();
    expect(screen.getByText("15% OFF")).toBeTruthy();
    expect(screen.getByText("Stock: 6")).toBeTruthy();
  });

  it("MOBILE-02 calls handlers when buttons are pressed", () => {
    const onAddToCart = jest.fn();
    const onDetails = jest.fn();
    const onWishlist = jest.fn();

    render(
      <ProductCard
        product={product}
        onAddToCart={onAddToCart}
        onDetails={onDetails}
        onWishlist={onWishlist}
      />
    );

    fireEvent.press(screen.getByText("Add to Cart"));
    fireEvent.press(screen.getByText("Details"));
    fireEvent.press(screen.getByLabelText("Toggle wishlist"));

    expect(onAddToCart).toHaveBeenCalledWith("lenovo-thinkpad");
    expect(onDetails).toHaveBeenCalledWith(product);
    expect(onWishlist).toHaveBeenCalledWith("lenovo-thinkpad");
  });

  it("MOBILE-03 disables add to cart for out-of-stock products", () => {
    const onAddToCart = jest.fn();

    render(<ProductCard product={{ ...product, stock: 0 }} onAddToCart={onAddToCart} />);

    fireEvent.press(screen.getByText("Out of Stock"));
    expect(onAddToCart).not.toHaveBeenCalled();
  });
});
