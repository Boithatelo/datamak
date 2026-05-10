import { useEffect, useState } from "react";
import MessageDialog from "../components/MessageDialog";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../utils/currency";

const LOGIN_TO_CART_MESSAGE = "Please login or register to add products to cart.";

export default function HostingPlansPage() {
  const { user } = useAuth();
  const { addToCart, getErrorMessage } = useCart();
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("http://localhost:4000/api/products/hosting-plans");
        const data = await response.json();
        setPlans(data.plans || []);
      } catch (fetchError) {
        setError("Failed to load hosting plans.");
      }
    }
    fetchPlans();
  }, []);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Hosting Plans" }]}
        eyebrow="Web Hosting Services"
        title="Shared, VPS, and Business Hosting Packages"
        subtitle="Compare resources, reliability, and pricing. Add hosting plans directly to your cart and checkout alongside hardware and software products."
        fallback="/catalog"
      />
      {status && <p className="hint notice">{status}</p>}
      {error && <p className="error notice">{error}</p>}
      <section className="hosting-grid">
        {plans.map((plan) => (
          <article key={plan.id} className="panel hosting-card">
            <span className="tag">{plan.subcategory}</span>
            <h2>{plan.name}</h2>
            <p className="muted">{plan.description}</p>
            <p className="price-row large">
              {plan.discountPercent > 0 && <span className="old-price">{formatMoney(plan.price)}</span>}
              <strong>
                {formatMoney(
                  Number((plan.price * (1 - Number(plan.discountPercent || 0) / 100)).toFixed(2))
                )}
              </strong>
              <em>/ month</em>
            </p>
            <ul className="order-items">
              {(plan.specifications || []).map((spec) => (
                <li key={`${plan.id}-${spec.label}`}>
                  {spec.label}: {spec.value}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                if (!user) {
                  setStatus("");
                  setDialogMessage(LOGIN_TO_CART_MESSAGE);
                  return;
                }
                try {
                  await addToCart(plan.id, 1);
                  setDialogMessage("Product added to cart.");
                } catch (actionError) {
                  setStatus(getErrorMessage(actionError));
                }
              }}
            >
              Buy Plan
            </button>
          </article>
        ))}
      </section>
      <MessageDialog
        title={dialogMessage === LOGIN_TO_CART_MESSAGE ? "Login Required" : "Cart Updated"}
        message={dialogMessage}
        onClose={() => setDialogMessage("")}
      />
    </>
  );
}
