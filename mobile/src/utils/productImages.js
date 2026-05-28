import { getApiOrigin } from "../api/client";

export const DEFAULT_PRODUCT_IMAGE = "/images/products/product-placeholder.svg";

export function getProductFallbackImageUrl() {
  return `${getApiOrigin()}${DEFAULT_PRODUCT_IMAGE}`;
}

export function resolveProductImageUrl(value) {
  const image = String(value || "").trim();

  if (!image) {
    return getProductFallbackImageUrl();
  }

  if (/^(https?:|data:)/i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${getApiOrigin()}${image}`;
  }

  return `${getApiOrigin()}/${image}`;
}
