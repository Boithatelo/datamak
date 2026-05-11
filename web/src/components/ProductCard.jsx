import { Link } from "react-router-dom";
import { formatMoney } from "../utils/currency";
import { handleProductImageError } from "../utils/productImages";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 6.5h14l-1.6 7.1a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.6L5.8 3.8H3.5" />
      <circle cx="9.5" cy="19" r="1.2" />
      <circle cx="17.2" cy="19" r="1.2" />
    </svg>
  );
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  busy
}) {
  const discountedPrice = Number(
    (product.price * (1 - Number(product.discountPercent || 0) / 100)).toFixed(2)
  );
  const isService = product.type === "service";
  const isOutOfStock = !isService && product.stock <= 0;

  return (
    <article className="product-card" data-testid="product-card" data-product-id={product.id}>
      <div className="product-image-frame">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(event) => handleProductImageError(event, product.name)}
        />
      </div>
      <div className="product-content">
        <h3>{product.name}</h3>
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
        >
          {!busy && !isOutOfStock && <CartIcon />}
          {busy ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
