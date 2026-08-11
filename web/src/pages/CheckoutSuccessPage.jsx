import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { formatMoney } from "../utils/currency";

function SuccessIcon({ name }) {
  const paths = {
    arrowLeft: "M11.7 5.3 5 12l6.7 6.7 1.4-1.4L8.8 13H19v-2H8.8l4.3-4.3-1.4-1.4Z",
    arrowRight: "m12.3 5.3-1.4 1.4 4.3 4.3H5v2h10.2l-4.3 4.3 1.4 1.4L19 12l-6.7-6.7Z",
    chevron: "m9.3 5.3-1.4 1.4 5.3 5.3-5.3 5.3 1.4 1.4 6.7-6.7-6.7-6.7Z",
    check: "m9.3 16.9-4.2-4.2 1.4-1.4 2.8 2.8 8.2-8.2 1.4 1.4-9.6 9.6Z",
    shield: "M12 2.8 20 6v5.8c0 5-3.2 8.5-8 10.4-4.8-1.9-8-5.4-8-10.4V6l8-3.2Zm3.8 7.4-4.3 4.5-2.4-2.5 1.4-1.4 1 1.1 2.9-3.1 1.4 1.4Z",
    clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l4.4 2.6 1-1.7-3.4-2V7Z",
    send: "M3 11.2 20.5 3.5 16 20.5l-4.7-6.3-6.9 3 2.6-5.4 7.7-4.3-6.1 5.4 3 4 2.7-8.9-9.9 4.4L3 11.2Z",
    receipt: "M6 3h12v18l-2.3-1.4-2.1 1.4-2.1-1.4L9.4 21l-2.1-1.4L6 20.4V3Zm4 5h4v2h-4V8Zm0 3.4h6v2h-6v-2Z",
    package: "M12 2.8 21 7.4v9.2l-9 4.6-9-4.6V7.4l9-4.6Zm0 2.2L6.4 7.8 12 10.7l5.6-2.9L12 5Zm-7 4.6v5.8l6 3.1v-5.9L5 9.6Zm8 8.9 6-3.1V9.6l-6 3v5.9Z",
    bag: "M7 9V7a5 5 0 0 1 10 0v2h2.2l1 11H3.8l1-11H7Zm2 0h6V7a3 3 0 0 0-6 0v2Z",
    lock: "M7 10V7.8a5 5 0 1 1 10 0V10h1.4v10H5.6V10H7Zm2 0h6V7.8a3 3 0 1 0-6 0V10Zm2 3.3v3.3h2v-3.3h-2Z",
    hash: "M9 3h2l-.7 4h4L15 3h2l-.7 4H20v2h-4.1l-.7 4H19v2h-4.1l-.7 4h-2l.7-4h-4l-.7 4h-2l.7-4H3v-2h4.1l.7-4H4V7h4.1L9 3Zm.6 6-.7 4h4l.7-4h-4Z"
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}

export default function CheckoutSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const orderMeta = [
    { label: "Order ID", value: order?.id || orderId, isCode: true, icon: "receipt" },
    { label: "Order Number", value: order?.orderNumber || "Generated", isCode: true, icon: "bag" },
    { label: "Amount Paid", value: formatMoney(order?.total || 0), isCode: false, icon: "package" },
    { label: "Transaction Ref", value: order?.payment?.transactionRef || "N/A", isCode: true, icon: "hash" }
  ];

  return (
    <section className="success-redesign" data-testid="checkout-success-panel" data-cy="checkout-success-page">
      <div className="success-shell">
        <div className="success-navline">
          <button
            type="button"
            className="success-back"
            onClick={() => navigate("/orders")}
            aria-label="Back to orders"
            title="Back to orders"
          >
            <SuccessIcon name="arrowLeft" />
          </button>
          <nav className="success-breadcrumbs" aria-label="Breadcrumbs">
            <Link to="/">Home</Link>
            <SuccessIcon name="chevron" />
            <Link to="/checkout">Checkout</Link>
            <SuccessIcon name="chevron" />
            <strong>Success</strong>
          </nav>
        </div>

        <section className="success-hero">
          <div className="success-check-orbit" aria-hidden="true">
            <span className="success-check-ring">
              <SuccessIcon name="check" />
            </span>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="success-hero-copy">
            <span className="success-kicker">Payment Successful</span>
            <h1>Thank You! Your Order is Confirmed.</h1>
            <p>Your order has been placed successfully.</p>
            <p>We've sent a confirmation email with all the details.</p>

            <div className="success-hero-cards">
              <article>
                <SuccessIcon name="shield" />
                <span>
                  <strong>Secured Payment</strong>
                  100% Secure & Encrypted
                </span>
              </article>
              <article>
                <SuccessIcon name="clock" />
                <span>
                  <strong>Processing</strong>
                  We're preparing your order
                </span>
              </article>
              <article>
                <SuccessIcon name="send" />
                <span>
                  <strong>Stay Updated</strong>
                  Track in your dashboard
                </span>
              </article>
            </div>
          </div>

          <div className="success-bag-scene" aria-hidden="true">
            <div className="success-bag">
              <span>D.</span>
            </div>
            <div className="success-box" />
            <div className="success-shield">
              <SuccessIcon name="lock" />
            </div>
          </div>
        </section>

        <section className="success-confirmation-card">
          <header className="success-confirmation-head">
            <div className="success-confirmation-title">
              <span>
                <SuccessIcon name="receipt" />
              </span>
              <div>
                <h2>Payment Confirmation</h2>
                <p>Here are your order and payment details.</p>
              </div>
            </div>
            <strong className="success-verified">
              <SuccessIcon name="check" />
              Payment Verified
            </strong>
          </header>

          <div className="success-confirmation-grid">
            <div className="success-summary-card" data-testid="checkout-success-summary">
              <dl className="success-meta-list">
                {orderMeta.map((item) => (
                  <div key={item.label} className="success-meta-row" data-testid="checkout-success-meta-row">
                    <dt className="success-meta-label">
                      <span>
                        <SuccessIcon name={item.icon} />
                      </span>
                      {item.label}
                    </dt>
                    <dd className={`success-meta-value ${item.isCode ? "is-code" : ""}`}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="success-next-card">
              <div className="success-mail-icon" aria-hidden="true">
                <SuccessIcon name="check" />
              </div>
              <h2>What's Next?</h2>
              <ul>
                <li>You will receive an email confirmation shortly.</li>
                <li>We will notify you once your order is shipped.</li>
                <li>Track your order anytime in your dashboard.</li>
                <li>Need help? Our support team is here for you.</li>
              </ul>
            </aside>
          </div>

          <div className="success-actions">
            <Link
              className="btn btn-primary success-primary-action"
              to={`/orders/${order?.id || orderId}`}
              data-testid="checkout-success-view-order"
              data-cy="view-order-details-button"
            >
              <SuccessIcon name="package" />
              View Order Details
              <SuccessIcon name="arrowRight" />
            </Link>
            <Link className="btn btn-light success-light-action" to="/catalog" data-testid="checkout-success-continue-shopping">
              <SuccessIcon name="bag" />
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
