import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/currency";
import { getImageSource } from "../utils/imageFallbacks";

const STEPS = ["Payment", "Review"];
const STEP_COPY = ["Payment method", "Final check"];

const PAYMENT_OPTIONS = [
  { value: "Card", title: "Card", text: "Visa, Mastercard, EFT", icon: "card" },
  { value: "Bank Transfer", title: "EFT / Bank Transfer", text: "Direct bank payment", icon: "bank" },
  { value: "Mobile Money", title: "Digital Wallet", text: "Instant & secure", icon: "wallet" },
  { value: "Pay Later", title: "Pay Later", text: "Buy now, pay later", icon: "clock" }
];

function CheckoutIcon({ name }) {
  const paths = {
    arrowLeft: "M11.7 5.3 5 12l6.7 6.7 1.4-1.4L8.8 13H19v-2H8.8l4.3-4.3-1.4-1.4Z",
    arrowRight: "m12.3 5.3-1.4 1.4 4.3 4.3H5v2h10.2l-4.3 4.3 1.4 1.4L19 12l-6.7-6.7Z",
    chevron: "m9.3 5.3-1.4 1.4 5.3 5.3-5.3 5.3 1.4 1.4 6.7-6.7-6.7-6.7Z",
    lock: "M7 10V7.8a5 5 0 1 1 10 0V10h1.4v10H5.6V10H7Zm2 0h6V7.8a3 3 0 1 0-6 0V10Zm2 3.3v3.3h2v-3.3h-2Z",
    shield: "M12 2.8 20 6v5.8c0 5-3.2 8.5-8 10.4-4.8-1.9-8-5.4-8-10.4V6l8-3.2Zm0 2.3L6 7.5v4.3c0 3.7 2.2 6.4 6 8 3.8-1.6 6-4.3 6-8V7.5l-6-2.4Zm3.8 5.1-4.3 4.5-2.4-2.5 1.4-1.4 1 1.1 2.9-3.1 1.4 1.4Z",
    receipt: "M6 3h12v18l-2.3-1.4-2.1 1.4-2.1-1.4L9.4 21l-2.1-1.4L6 20.4V3Zm2 3v10.7l1.4-.9 2.1 1.4 2.1-1.4 2.1 1.4.3-.2V6H8Zm2 2h4v2h-4V8Zm0 3.4h6v2h-6v-2Z",
    card: "M3.5 6.5h17v11h-17v-11Zm2 2v1.8h13V8.5h-13Zm0 4.1v2.9h13v-2.9h-13Zm9.5 1h2.6v1.2H15v-1.2Z",
    bank: "M12 4 21 9v2H3V9l9-5Zm-5.5 8h2v6h-2v-6Zm4.5 0h2v6h-2v-6Zm4.5 0h2v6h-2v-6ZM4 19h16v2H4v-2Z",
    wallet: "M5 6h12.5A2.5 2.5 0 0 1 20 8.5v.8h-5.5a3.2 3.2 0 0 0 0 6.4H20v.8a2.5 2.5 0 0 1-2.5 2.5H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm9.5 5.2H21v2.6h-6.5a1.3 1.3 0 0 1 0-2.6Z",
    clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l4.4 2.6 1-1.7-3.4-2V7Z",
    tag: "M4 4h8.6L20 11.4 11.4 20 4 12.6V4Zm2 2v5.8l5.4 5.4 5.8-5.8L11.8 6H6Zm3 4.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z",
    truck: "M3 5h11v9h1.2l2-4H21v7h-2.1a2.8 2.8 0 0 1-5.4 0H9.9a2.8 2.8 0 0 1-5.4 0H3V5Zm2 2v8h9V7H5Zm11 5.1V15h3v-3h-.6l-1.4 3H16v-2.9ZM7.2 18.2a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Zm9 0a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z",
    award: "M12 2.5a5.8 5.8 0 0 1 2.9 10.8l1.6 5.8-4.5-2.2-4.5 2.2 1.6-5.8A5.8 5.8 0 0 1 12 2.5Zm0 2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z",
    support: "M12 3a8 8 0 0 1 8 8v4.2a2.8 2.8 0 0 1-2.8 2.8H15v-6h3v-1a6 6 0 0 0-12 0v1h3v6H6.8A2.8 2.8 0 0 1 4 15.2V11a8 8 0 0 1 8-8Z"
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}

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
      <section
        className="checkout-neon checkout-redesign checkout-empty"
        data-testid="checkout-empty-state"
        data-cy="checkout-empty-state"
      >
        <h1>No items for checkout</h1>
        <p>Add products to your cart before starting checkout.</p>
        <Link className="checkout-primary" to="/catalog">
          Browse Products
        </Link>
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
    <section className="checkout-neon checkout-redesign" data-testid="checkout-page" data-cy="checkout-page">
      <div className="checkout-shell">
        <div className="checkout-navline">
          <button
            type="button"
            className="checkout-back"
            onClick={() => navigate("/cart")}
            aria-label="Back to cart"
            title="Back to cart"
            data-testid="checkout-back-to-cart"
          >
            <CheckoutIcon name="arrowLeft" />
          </button>
          <nav className="checkout-breadcrumbs" aria-label="Breadcrumbs">
            <Link to="/">Home</Link>
            <CheckoutIcon name="chevron" />
            <Link to="/cart">Cart</Link>
            <CheckoutIcon name="chevron" />
            <strong>Checkout</strong>
          </nav>
        </div>

        <section className="checkout-glass checkout-order-card">
          <header className="checkout-header">
            <div>
              <span className="checkout-badge">
                <CheckoutIcon name="lock" />
                Secure Checkout
              </span>
              <h1>Complete Your Order</h1>
              <p>Almost there! Please complete your purchase in just a few steps.</p>
            </div>
            <div className="checkout-security-mark">
              <span>
                <CheckoutIcon name="shield" />
              </span>
              <p>
                Your data is 100%
                <br />
                <strong>secure & encrypted</strong>
              </p>
            </div>
          </header>

          <div className="checkout-stepper" aria-label="Checkout progress" data-testid="checkout-stepper">
            {STEPS.map((label, index) => (
              <button
                type="button"
                key={label}
                className={index <= step ? "checkout-step active" : "checkout-step"}
                onClick={() => setStep(index)}
                data-testid={`checkout-step-${index + 1}`}
              >
                <span>{index + 1}</span>
                <strong>{label}</strong>
                <small>{STEP_COPY[index]}</small>
                {index === 0 && <CheckoutIcon name="chevron" />}
              </button>
            ))}
          </div>

          {error && (
            <p className="checkout-error" data-testid="checkout-error-message">
              {error}
            </p>
          )}

          <div className="checkout-grid">
            <section className="checkout-stage">
              {step === 0 && (
                <div className="checkout-form checkout-payment-layout" data-testid="checkout-payment-stage">
                  <div className="checkout-stage-title">
                    <div>
                      <h2>1. Payment Method</h2>
                      <p>Choose a payment option</p>
                    </div>
                    <label className="checkout-native-select">
                      <span>Payment option</span>
                      <select
                        value={form.paymentMethod}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            paymentMethod: event.target.value
                          }))
                        }
                        data-testid="checkout-payment-method-select"
                        data-cy="checkout-payment-method"
                      >
                        {PAYMENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="checkout-payment-content">
                    <div className="checkout-method-list">
                      {PAYMENT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={
                            form.paymentMethod === option.value
                              ? "checkout-method-card selected"
                              : "checkout-method-card"
                          }
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              paymentMethod: option.value
                            }))
                          }
                        >
                          <CheckoutIcon name={option.icon} />
                          <span>
                            <strong>{option.title}</strong>
                            <small>{option.text}</small>
                          </span>
                          <CheckoutIcon name="chevron" />
                        </button>
                      ))}
                    </div>

                    <div className="checkout-card-form">
                      <div className="checkout-card-form-head">
                        <span>Accepted Cards</span>
                        <strong>VISA</strong>
                        <strong className="checkout-card-dot">MC</strong>
                        <strong className="checkout-eft">EFT</strong>
                      </div>
                      <label>
                        <span>Card Number</span>
                        <div className="checkout-input-icon">
                          <input placeholder="1234 5678 9012 3456" inputMode="numeric" />
                          <CheckoutIcon name="card" />
                        </div>
                      </label>
                      <div className="checkout-card-grid">
                        <label>
                          <span>Cardholder Name</span>
                          <input placeholder="Enter name on card" />
                        </label>
                        <label>
                          <span>Expiry Date</span>
                          <input placeholder="MM / YY" />
                        </label>
                        <label>
                          <span>CVV</span>
                          <input placeholder="123" inputMode="numeric" />
                        </label>
                      </div>
                      <label className="checkout-save-card">
                        <input type="checkbox" defaultChecked />
                        <span>Save card for faster checkout</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="checkout-review" data-testid="checkout-review-stage">
                  <div className="checkout-stage-title">
                    <h2>2. Review Order</h2>
                    <p>Confirm your products and totals before placing the order.</p>
                  </div>
                  <ul className="checkout-items" data-testid="checkout-review-items">
                    {cart.items.map((item) => (
                      <li key={item.productId} data-testid="checkout-review-item">
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
                  <button
                    type="button"
                    className="checkout-secondary"
                    onClick={previousStep}
                    data-testid="checkout-back-step"
                  >
                    Back
                  </button>
                )}
                {step < STEPS.length - 1 && (
                  <button
                    type="button"
                    className="checkout-primary"
                    onClick={nextStep}
                    data-testid="checkout-continue-button"
                    data-cy="checkout-continue-button"
                  >
                    Continue to Review
                    <CheckoutIcon name="arrowRight" />
                  </button>
                )}
                {step === STEPS.length - 1 && (
                  <button
                    type="button"
                    className="checkout-primary"
                    onClick={placeOrder}
                    disabled={busy}
                    data-testid="checkout-place-order-button"
                    data-cy="checkout-place-order-button"
                  >
                    {busy ? "Processing..." : "Place Order"}
                    <CheckoutIcon name="arrowRight" />
                  </button>
                )}
                <small className="checkout-charge-note">You won't be charged yet</small>
              </div>
            </section>

            <aside className="checkout-summary">
              <h2>
                <CheckoutIcon name="receipt" />
                Order Summary
              </h2>

              <div className="checkout-summary-items">
                {cart.items.map((item) => (
                  <article key={item.productId}>
                    <img src={getImageSource(item.imageUrl, item.category)} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <b>{formatMoney(item.subtotal)}</b>
                  </article>
                ))}
              </div>

              <div className="review-totals">
                <p className="summary-line" data-testid="checkout-summary-subtotal">
                  <span>Subtotal</span>
                  <strong>{formatMoney(previewTotals.subtotal)}</strong>
                </p>
                <p className="summary-line" data-testid="checkout-summary-tax">
                  <span>Tax (15%)</span>
                  <strong>{formatMoney(previewTotals.tax)}</strong>
                </p>
                <p className="summary-line" data-testid="checkout-summary-delivery">
                  <span>Delivery</span>
                  <strong>{formatMoney(previewTotals.deliveryFee)}</strong>
                </p>
                <p className="summary-line total-row" data-testid="checkout-summary-total">
                  <span>Grand Total</span>
                  <strong>{formatMoney(previewTotals.grandTotal)}</strong>
                </p>
              </div>

              <div className="checkout-savings-note">
                <CheckoutIcon name="tag" />
                <span>You are saving time and getting the best tech for less!</span>
              </div>

              <div className="checkout-guarantees">
                <article>
                  <CheckoutIcon name="lock" />
                  <span>
                    <strong>Secure Checkout</strong>
                    SSL Encrypted
                  </span>
                </article>
                <article>
                  <CheckoutIcon name="shield" />
                  <span>
                    <strong>Money Back</strong>
                    7-Day Guarantee
                  </span>
                </article>
              </div>
            </aside>
          </div>
        </section>

        <section className="checkout-trust-strip" aria-label="Checkout benefits">
          <article>
            <CheckoutIcon name="truck" />
            <span>
              <strong>Fast Delivery</strong>
              Nationwide shipping
            </span>
          </article>
          <article>
            <CheckoutIcon name="shield" />
            <span>
              <strong>Secure Payments</strong>
              Encrypted & protected
            </span>
          </article>
          <article>
            <CheckoutIcon name="award" />
            <span>
              <strong>Genuine Products</strong>
              100% authentic
            </span>
          </article>
          <article>
            <CheckoutIcon name="support" />
            <span>
              <strong>24/7 Support</strong>
              We're here to help
            </span>
          </article>
        </section>
      </div>
    </section>
  );
}
