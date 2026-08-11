import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/currency";
import { getImageSource } from "../utils/imageFallbacks";

function CartIcon({ name }) {
  const paths = {
    home: "M4 11.2 12 4l8 7.2v8.4h-5.2v-5.1H9.2v5.1H4v-8.4Zm2 1v5.4h1.2v-5.1h9.6v5.1H18v-5.4l-6-5.4-6 5.4Z",
    cart: "M7.2 19.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm9.8 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM4.3 4.2H1.8V2h4l1 3h14.3L19 13.6a3 3 0 0 1-2.9 2.3H8.4l.5 1.5h10.3v2H7.4L4.3 4.2Zm3 3 .9 6.6h7.9c.4 0 .8-.3.9-.7l1.4-5.9H7.3Z",
    shield: "M12 2.8 20 6v5.8c0 5-3.2 8.5-8 10.4-4.8-1.9-8-5.4-8-10.4V6l8-3.2Zm0 2.3L6 7.5v4.3c0 3.7 2.2 6.4 6 8 3.8-1.6 6-4.3 6-8V7.5l-6-2.4Zm3.8 5.1-4.3 4.5-2.4-2.5 1.4-1.4 1 1.1 2.9-3.1 1.4 1.4Z",
    receipt: "M6 3h12v18l-2.3-1.4-2.1 1.4-2.1-1.4L9.4 21l-2.1-1.4L6 20.4V3Zm2 3v10.7l1.4-.9 2.1 1.4 2.1-1.4 2.1 1.4.3-.2V6H8Zm2 2h4v2h-4V8Zm0 3.4h6v2h-6v-2Z",
    tune: "M4 7h8.1a2.7 2.7 0 0 0 5.1 0H20v2h-2.8a2.7 2.7 0 0 0-5.1 0H4V7Zm0 8h2.8a2.7 2.7 0 0 0 5.1 0H20v2h-8.1a2.7 2.7 0 0 0-5.1 0H4v-2Z",
    tag: "M4 4h8.6L20 11.4 11.4 20 4 12.6V4Zm2 2v5.8l5.4 5.4 5.8-5.8L11.8 6H6Zm3 4.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z",
    truck: "M3 5h11v9h1.2l2-4H21v7h-2.1a2.8 2.8 0 0 1-5.4 0H9.9a2.8 2.8 0 0 1-5.4 0H3V5Zm2 2v8h9V7H5Zm11 5.1V15h3v-3h-.6l-1.4 3H16v-2.9ZM7.2 18.2a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Zm9 0a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z",
    award: "M12 2.5a5.8 5.8 0 0 1 2.9 10.8l1.6 5.8-4.5-2.2-4.5 2.2 1.6-5.8A5.8 5.8 0 0 1 12 2.5Zm0 2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z",
    support: "M12 3a8 8 0 0 1 8 8v4.2a2.8 2.8 0 0 1-2.8 2.8H15v-6h3v-1a6 6 0 0 0-12 0v1h3v6H6.8A2.8 2.8 0 0 1 4 15.2V11a8 8 0 0 1 8-8Z",
    lock: "M7 10V7.8a5 5 0 1 1 10 0V10h1.4v10H5.6V10H7Zm2 0h6V7.8a3 3 0 1 0-6 0V10Zm2 3.3v3.3h2v-3.3h-2Z",
    trash: "M8 4V2h8v2h4v2H4V4h4Zm-2 4h12l-.9 13H6.9L6 8Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z",
    arrowLeft: "M11.7 5.3 5 12l6.7 6.7 1.4-1.4L8.8 13H19v-2H8.8l4.3-4.3-1.4-1.4Z",
    arrowRight: "m12.3 5.3-1.4 1.4 4.3 4.3H5v2h10.2l-4.3 4.3 1.4 1.4L19 12l-6.7-6.7Z",
    minus: "M5 11h14v2H5v-2Z",
    plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}

export default function CartPage() {
  const { cart, refreshCart, updateQuantity, removeItem, getErrorMessage } = useCart();
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    refreshCart().catch((fetchError) => setError(getErrorMessage(fetchError)));
  }, []);

  const onUpdateQty = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }
    setBusyId(productId);
    setError("");
    try {
      await updateQuantity(productId, quantity);
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setBusyId("");
    }
  };

  const onRemove = async (productId) => {
    setBusyId(productId);
    setError("");
    try {
      await removeItem(productId);
    } catch (removeError) {
      setError(getErrorMessage(removeError));
    } finally {
      setBusyId("");
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.summary?.subtotal ?? cart.total ?? 0;
  const tax = cart.summary?.tax ?? 0;
  const deliveryFee = cart.summary?.deliveryFee ?? 0;
  const grandTotal = cart.summary?.grandTotal ?? cart.total ?? 0;

  return (
    <div className="cart-page-shell">
      <nav className="cart-breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/">
          <CartIcon name="home" />
          Home
        </Link>
        <span>/</span>
        <strong>Cart</strong>
      </nav>

      <section className="cart-hero" aria-label="Shopping cart overview">
        <div className="cart-hero-icon">
          <CartIcon name="cart" />
        </div>
        <div className="cart-hero-copy">
          <h1>Shopping Cart</h1>
          <p>Review your items, update quantities, and proceed to secure checkout.</p>
          {error && <p className="error notice">{error}</p>}
        </div>
        <div className="cart-secure-callout">
          <span>
            <CartIcon name="shield" />
          </span>
          <div>
            <strong>Secure Checkout</strong>
            <p>Your data is protected</p>
          </div>
        </div>
      </section>

      {cart.items.length === 0 ? (
        <section className="panel empty-state" data-testid="cart-empty-state">
          <h2>Your cart is empty</h2>
          <p className="muted">Browse the product catalog and add products to continue.</p>
          <Link className="btn btn-primary" to="/catalog" data-testid="cart-explore-catalog-link">
            Explore Catalog
          </Link>
        </section>
      ) : (
        <>
          <div className="cart-layout cart-premium-layout">
            <section className="panel cart-panel cart-items-panel">
              <div className="cart-table-head" aria-hidden="true">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>

              <div className="cart-list" data-testid="cart-item-list">
                {cart.items.map((item) => {
                  const isBusy = busyId === item.productId;
                  const maxReached = item.type !== "service" && item.quantity >= item.stock;
                  return (
                    <article
                      key={item.productId}
                      className="cart-item cart-table-row"
                      data-testid="cart-item"
                      data-product-id={item.productId}
                    >
                      <div className="cart-product-cell">
                        <img src={getImageSource(item.imageUrl, item.category)} alt={item.name} />
                        <div className="cart-info">
                          <h3>{item.name}</h3>
                          <p>
                            {item.category}
                            {item.subcategory ? ` / ${item.subcategory}` : ""}
                          </p>
                          <p className="cart-stock">
                            {item.type === "service" ? "Service item" : `Stock: ${item.stock}`}
                          </p>
                          <p className="cart-mobile-price">{formatMoney(item.price)}</p>
                        </div>
                      </div>

                      <strong className="cart-price-cell">{formatMoney(item.price)}</strong>

                      <div className="cart-quantity-stepper">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                          disabled={isBusy || item.quantity <= 1}
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <CartIcon name="minus" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.type === "service" ? undefined : item.stock}
                          value={item.quantity}
                          onChange={(event) =>
                            onUpdateQty(item.productId, Number(event.target.value))
                          }
                          disabled={isBusy}
                          aria-label={`Quantity for ${item.name}`}
                          data-testid="cart-quantity-input"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                          disabled={isBusy || maxReached}
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <CartIcon name="plus" />
                        </button>
                      </div>

                      <strong className="cart-total-cell">
                        {formatMoney(item.subtotal ?? item.price * item.quantity)}
                      </strong>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => onRemove(item.productId)}
                        disabled={isBusy}
                        aria-label={`Remove ${item.name}`}
                        data-testid="cart-remove-button"
                      >
                        <CartIcon name="trash" />
                      </button>
                    </article>
                  );
                })}
              </div>

              <div className="cart-panel-footer">
                <label className="cart-coupon-field">
                  <CartIcon name="tag" />
                  <span className="sr-only">Coupon code</span>
                  <input placeholder="Enter coupon code" />
                </label>
                <button type="button" className="cart-apply-btn">
                  Apply
                </button>
                <Link className="cart-continue-btn" to="/catalog">
                  <CartIcon name="arrowLeft" />
                  Continue Shopping
                </Link>
              </div>
            </section>

            <aside className="panel checkout-panel cart-summary-card">
              <div className="cart-summary-title">
                <CartIcon name="receipt" />
                <h2>Order Summary</h2>
              </div>
              <p className="summary-line" data-testid="cart-summary-subtotal">
                <span>
                  <CartIcon name="tune" />
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <strong>{formatMoney(subtotal)}</strong>
              </p>
              <p className="summary-line" data-testid="cart-summary-tax">
                <span>
                  <CartIcon name="tag" />
                  Tax (15%)
                </span>
                <strong>{formatMoney(tax)}</strong>
              </p>
              <p className="summary-line" data-testid="cart-summary-delivery">
                <span>
                  <CartIcon name="truck" />
                  Delivery
                </span>
                <strong>{formatMoney(deliveryFee)}</strong>
              </p>
              <p className="summary-line total-row" data-testid="cart-summary-total">
                <span>Grand Total</span>
                <strong>{formatMoney(grandTotal)}</strong>
              </p>
              <div className="cart-savings-note">
                <CartIcon name="shield" />
                <span>You are saving time and getting the best tech for less.</span>
              </div>
              <Link
                className="btn btn-primary cart-checkout-btn"
                to="/checkout"
                data-testid="cart-proceed-checkout"
                data-cy="proceed-to-checkout-button"
              >
                <CartIcon name="lock" />
                Proceed to Checkout
                <CartIcon name="arrowRight" />
              </Link>
              <p className="cart-payment-note">
                <CartIcon name="shield" />
                Secure and encrypted payment
              </p>
            </aside>
          </div>

          <section className="cart-trust-strip" aria-label="Shopping benefits">
            <article>
              <CartIcon name="truck" />
              <div>
                <strong>Fast Delivery</strong>
                <p>Nationwide shipping</p>
              </div>
            </article>
            <article>
              <CartIcon name="shield" />
              <div>
                <strong>Secure Payments</strong>
                <p>100% safe and secure</p>
              </div>
            </article>
            <article>
              <CartIcon name="award" />
              <div>
                <strong>Quality Guarantee</strong>
                <p>Genuine products only</p>
              </div>
            </article>
            <article>
              <CartIcon name="support" />
              <div>
                <strong>24/7 Support</strong>
                <p>We are here to help</p>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
