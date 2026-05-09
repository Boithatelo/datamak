import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Breadcrumbs from "../components/Breadcrumbs";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/currency";

const STEPS = ["Payment", "Review"];
const STEP_COPY = ["Payment method", "Final check"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getErrorMessage } = useCart();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    shippingAddress: "Not required",
    paymentMethod: "Card"
  });

  const previewTotals = useMemo(() => {
    const subtotal = Number(cart.summary?.subtotal || cart.total || 0);
    const tax = Number((subtotal * 0.15).toFixed(2));
    const deliveryFee = Number(cart.summary?.deliveryFee || 0);
    const grandTotal = Number(Math.max(0, subtotal + tax + deliveryFee).toFixed(2));
    return { subtotal, tax, deliveryFee, grandTotal };
  }, [cart.total, cart.summary]);

  if (!cart.items.length) {
    return (
      <section className="checkout-neon checkout-empty">
        <h1>No items for checkout</h1>
        <p>Add products to your cart before starting checkout.</p>
      </section>
    );
  }

  const nextStep = () => setStep((current) => Math.min(STEPS.length - 1, current + 1));
  const previousStep = () => setStep((current) => Math.max(0, current - 1));

  const placeOrder = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/checkout", form);
      navigate(`/checkout/success/${data.order.id}`, { state: { order: data.order } });
    } catch (checkoutError) {
      setError(getErrorMessage(checkoutError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="checkout-neon">
      <div className="checkout-shell">
        <div className="checkout-navline">
          <button
            type="button"
            className="checkout-back"
            onClick={() => navigate("/cart")}
            aria-label="Back to cart"
            title="Back to cart"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Cart", to: "/cart" },
              { label: "Checkout" }
            ]}
          />
        </div>

        <section className="checkout-glass">
          <header className="checkout-header">
            <span className="checkout-badge">Secure Checkout</span>
            <h1>Checkout</h1>
            <p>Complete your order in two quick steps.</p>
          </header>

          <div className="checkout-stepper" aria-label="Checkout progress">
            {STEPS.map((label, index) => (
              <button
                type="button"
                key={label}
                className={index <= step ? "checkout-step active" : "checkout-step"}
                onClick={() => setStep(index)}
              >
                <span>{index + 1}</span>
                <strong>{label}</strong>
                <small>{STEP_COPY[index]}</small>
              </button>
            ))}
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <div className="checkout-grid">
            <section className="checkout-stage">
              {step === 0 && (
                <div className="checkout-form">
                  <label>
                    <span>Payment Method</span>
                    <select
                      value={form.paymentMethod}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, paymentMethod: event.target.value }))
                      }
                    >
                      <option value="Card">Card</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="checkout-review">
                  <h2>Order Review</h2>
                  <ul className="checkout-items">
                    {cart.items.map((item) => (
                      <li key={item.productId}>
                        <span>
                          {item.name} <small>x {item.quantity}</small>
                        </span>
                        <strong>{formatMoney(item.subtotal)}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="checkout-actions">
                {step > 0 && (
                  <button type="button" className="checkout-secondary" onClick={previousStep}>
                    Back
                  </button>
                )}
                {step < STEPS.length - 1 && (
                  <button type="button" className="checkout-primary" onClick={nextStep}>
                    Continue
                  </button>
                )}
                {step === STEPS.length - 1 && (
                  <button
                    type="button"
                    className="checkout-primary"
                    onClick={placeOrder}
                    disabled={busy}
                  >
                    {busy ? "Processing..." : "Place Order"}
                  </button>
                )}
              </div>
            </section>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="review-totals">
                <p className="summary-line">
                  <span>Subtotal</span>
                  <strong>{formatMoney(previewTotals.subtotal)}</strong>
                </p>
                <p className="summary-line">
                  <span>Tax</span>
                  <strong>{formatMoney(previewTotals.tax)}</strong>
                </p>
                <p className="summary-line">
                  <span>Delivery</span>
                  <strong>{formatMoney(previewTotals.deliveryFee)}</strong>
                </p>
                <p className="summary-line total-row">
                  <span>Grand Total</span>
                  <strong>{formatMoney(previewTotals.grandTotal)}</strong>
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </section>
  );
}
