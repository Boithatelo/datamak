import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/currency";

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

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
        title="Shopping Cart"
        subtitle="Review item quantities, verify totals, and continue to secure checkout."
        fallback="/catalog"
      >
        {error && <p className="error notice">{error}</p>}
      </PageHeader>

      {cart.items.length === 0 ? (
        <section className="panel empty-state">
          <h2>Your cart is empty</h2>
          <p className="muted">Browse the product catalog and add products to continue.</p>
          <Link className="btn btn-primary" to="/catalog">
            Explore Catalog
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="panel cart-panel">
            <div className="cart-list">
              {cart.items.map((item) => (
                <article key={item.productId} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>
                      {item.category}
                      {item.subcategory ? ` / ${item.subcategory}` : ""}
                    </p>
                    <p>{item.type === "service" ? "Service item" : `Stock: ${item.stock}`}</p>
                    <p>
                      {formatMoney(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="cart-actions">
                    <input
                      type="number"
                      min="1"
                      max={item.type === "service" ? undefined : item.stock}
                      value={item.quantity}
                      onChange={(event) =>
                        onUpdateQty(item.productId, Number(event.target.value))
                      }
                      disabled={busyId === item.productId}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => onRemove(item.productId)}
                      disabled={busyId === item.productId}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="panel checkout-panel">
            <h2>Order Summary</h2>
            <p className="summary-line">
              <span>Subtotal</span>
              <strong>{formatMoney(cart.summary?.subtotal || cart.total)}</strong>
            </p>
            <p className="summary-line">
              <span>Tax (15%)</span>
              <strong>{formatMoney(cart.summary?.tax || 0)}</strong>
            </p>
            <p className="summary-line">
              <span>Delivery</span>
              <strong>{formatMoney(cart.summary?.deliveryFee || 0)}</strong>
            </p>
            <p className="summary-line total-row">
              <span>Grand Total</span>
              <strong>{formatMoney(cart.summary?.grandTotal || cart.total)}</strong>
            </p>
            <Link className="btn btn-primary" to="/checkout">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
