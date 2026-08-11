import { Link, useLocation, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { formatMoney } from "../utils/currency";

export default function CheckoutSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const orderMeta = [
    { label: "Order ID", value: order?.id || orderId, isCode: true },
    { label: "Order Number", value: order?.orderNumber || "Generated", isCode: true },
    { label: "Amount Paid", value: formatMoney(order?.total || 0), isCode: false },
    { label: "Transaction Ref", value: order?.payment?.transactionRef || "N/A", isCode: true }
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Checkout", to: "/checkout" },
          { label: "Success" }
        ]}
        title="Payment Successful"
        subtitle="Your order has been placed successfully. Tracking updates are now available in your orders dashboard."
        fallback="/orders"
      />
      <section className="panel success-panel" data-testid="checkout-success-panel" data-cy="checkout-success-page">
        <div className="success-summary-card" data-testid="checkout-success-summary">
          <h2 className="success-summary-title">Payment Confirmation</h2>
          <dl className="success-meta-list">
            {orderMeta.map((item) => (
              <div key={item.label} className="success-meta-row" data-testid="checkout-success-meta-row">
                <dt className="success-meta-label">{item.label}</dt>
                <dd className={`success-meta-value ${item.isCode ? "is-code" : ""}`}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hero-cta-row">
          <Link
            className="btn btn-primary"
            to={`/orders/${order?.id || orderId}`}
            data-testid="checkout-success-view-order"
            data-cy="view-order-details-button"
          >
            View Order Details
          </Link>
          <Link className="btn btn-light" to="/catalog" data-testid="checkout-success-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </section>
    </>
  );
}
