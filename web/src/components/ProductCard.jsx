import { Link } from "react-router-dom";
import { formatMoney } from "../utils/currency";
import { applyImageFallback, getImageSource } from "../utils/imageFallbacks";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 6.5h14l-1.6 7.1a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.6L5.8 3.8H3.5" />
      <circle cx="9.5" cy="19" r="1.2" />
      <circle cx="17.2" cy="19" r="1.2" />
    </svg>
  );
}

function QuickViewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 20V9h3v11H5Zm5 0V4h3v16h-3Zm5 0v-7h3v7h-3Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 20.4 10.8 19C6.6 15.2 4 12.8 4 9.7A4.3 4.3 0 0 1 8.4 5.3c1.4 0 2.8.7 3.6 1.8a4.5 4.5 0 0 1 3.6-1.8A4.3 4.3 0 0 1 20 9.7c0 3.1-2.6 5.5-6.8 9.3L12 20.4Z" />
    </svg>
  );
}

function getSpecLine(product) {
  const specs = [
    product.derivedProcessor,
    product.derivedRam ? `${product.derivedRam} RAM` : "",
    product.subcategory
  ].filter(Boolean);

  if (specs.length) {
    return specs.slice(0, 3).join(" - ");
  }

  return product.category || "Premium technology";
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onWishlist,
  busy,
  wishlisted
}) {
  const discountedPrice = Number(
    (product.price * (1 - Number(product.discountPercent || 0) / 100)).toFixed(2)
  );
  const isService = product.type === "service";
  const isOutOfStock = !isService && product.stock <= 0;

  return (
    <article
      className="product-card"
      data-testid="product-card"
      data-cy="product-card"
      data-product-id={product.id}
    >
      <button
        type="button"
        className={`wishlist-btn ${wishlisted ? "active" : ""}`}
        onClick={() => onWishlist(product.id)}
        aria-label="Toggle wishlist"
        data-testid="product-wishlist-button"
      >
        <HeartIcon />
      </button>
      <div className="product-image-frame">
        {product.discountPercent > 0 && (
          <span className="product-discount-badge">-{product.discountPercent}%</span>
        )}
        <img
          src={getImageSource(product.imageUrl, product.category)}
          alt={product.name}
          onError={(event) => applyImageFallback(event, product.category)}
        />
      </div>
      <div className="product-content">
        <h3 data-cy="product-name">{product.name}</h3>
        <p className="product-spec-line">{getSpecLine(product)}</p>
        <strong className="product-price">{formatMoney(discountedPrice)}</strong>
        <div className="product-savings">
          {product.discountPercent > 0 && (
            <>
              <span className="old-price">{formatMoney(product.price)}</span>
              <span className="discount-pill">{product.discountPercent}% OFF</span>
            </>
          )}
        </div>
        <div className="card-actions">
          <button type="button" onClick={() => onQuickView(product)} data-testid="product-quick-view">
            <QuickViewIcon />
            Quick View
          </button>
          <Link to={`/products/${product.id}`} data-testid="product-details-link">
            Details
          </Link>
        </div>
        <button
          type="button"
          className="product-cart-btn"
          disabled={busy || isOutOfStock}
          onClick={() => onAddToCart(product.id)}
          data-testid="product-add-to-cart"
          data-cy="add-to-cart-button"
        >
          {!busy && !isOutOfStock && <CartIcon />}
          {busy ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
