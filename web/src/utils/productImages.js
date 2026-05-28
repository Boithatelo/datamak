const DEFAULT_PRODUCT_IMAGE = "/images/products/product-placeholder.svg";

export function handleProductImageError(event) {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "1") {
    return;
  }

  image.dataset.fallbackApplied = "1";
  image.src = DEFAULT_PRODUCT_IMAGE;
}
