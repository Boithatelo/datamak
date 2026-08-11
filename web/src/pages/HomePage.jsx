import { Link } from "react-router-dom";
import { LogoMark } from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function HomeIcon({ name }) {
  const paths = {
    cart: "M7.2 19.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm9.8 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM4.3 4.2H1.8V2h4l1 3h14.3L19 13.6a3 3 0 0 1-2.9 2.3H8.4l.5 1.5h10.3v2H7.4L4.3 4.2Zm3 3 .9 6.6h7.9c.4 0 .8-.3.9-.7l1.4-5.9H7.3Z",
    user: "M12 12.2a4.4 4.4 0 1 1 0-8.8 4.4 4.4 0 0 1 0 8.8Zm0-2.1a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Zm-8.1 9.8a8.1 8.1 0 0 1 16.2 0H18a6 6 0 0 0-12 0H3.9Z",
    chevron: "m7.4 8.6 4.6 4.6 4.6-4.6L18 10l-6 6-6-6 1.4-1.4Z",
    play: "M8 5.2v13.6L18.8 12 8 5.2Zm2 3.6 5 3.2-5 3.2V8.8Z",
    shield: "M12 2.8 20 6v5.8c0 5-3.2 8.5-8 10.4-4.8-1.9-8-5.4-8-10.4V6l8-3.2Zm0 2.3L6 7.5v4.3c0 3.7 2.2 6.4 6 8 3.8-1.6 6-4.3 6-8V7.5l-6-2.4Zm3.8 5.1-4.3 4.5-2.4-2.5 1.4-1.4 1 1.1 2.9-3.1 1.4 1.4Z",
    truck: "M3 5h11v9h1.2l2-4H21v7h-2.1a2.8 2.8 0 0 1-5.4 0H9.9a2.8 2.8 0 0 1-5.4 0H3V5Zm2 2v8h9V7H5Zm11 5.1V15h3v-3h-.6l-1.4 3H16v-2.9ZM7.2 18.2a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Zm9 0a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z",
    award: "M12 2.5a5.8 5.8 0 0 1 2.9 10.8l1.6 5.8-4.5-2.2-4.5 2.2 1.6-5.8A5.8 5.8 0 0 1 12 2.5Zm0 2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm0 2 1 2 2.2.3-1.6 1.6.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.6 2.2-.3 1-2Z",
    support: "M12 3a8 8 0 0 1 8 8v4.2a2.8 2.8 0 0 1-2.8 2.8H15v-6h3v-1a6 6 0 0 0-12 0v1h3v6H6.8A2.8 2.8 0 0 1 4 15.2V11a8 8 0 0 1 8-8Z"
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}

const HERO_TRUST_ITEMS = [
  { icon: "shield", title: "Secure Payments", text: "100% Protected" },
  { icon: "truck", title: "Fast Delivery", text: "Across Lesotho" },
  { icon: "award", title: "Quality Products", text: "Genuine & Reliable" },
  { icon: "support", title: "24/7 Support", text: "We're here for you" }
];

const TRUST_ITEMS = [
  {
    icon: "shield",
    title: "Secure Payments",
    text: "100% secure checkout and data protection",
    tone: "teal"
  },
  {
    icon: "truck",
    title: "Fast Delivery",
    text: "Quick and reliable delivery across Lesotho",
    tone: "blue"
  },
  {
    icon: "award",
    title: "Quality Products",
    text: "Genuine products from trusted brands",
    tone: "violet"
  },
  {
    icon: "support",
    title: "24/7 Support",
    text: "We're here to help anytime, anywhere",
    tone: "orange"
  }
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="home-start-shell">
      <section className="home-start-card">
        <header className="home-start-header">
          <Link to="/" className="home-start-brand" aria-label="Datamak Technologies home">
            <LogoMark />
            <span className="home-start-brand-copy">
              <strong>
                Datamak <span>Technologies</span>
              </strong>
              <small>Shop Smart. Build Fast. Host Secure.</small>
            </span>
          </Link>

          <div className="home-start-actions">
            {user && (
              <Link to="/cart" className="home-header-cart" aria-label="Open cart">
                <HomeIcon name="cart" />
                {cartCount > 0 && <em>{cartCount}</em>}
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className="home-user-pill">
                  <HomeIcon name="user" />
                  <span>Hi, {user.name}</span>
                  <HomeIcon name="chevron" />
                </Link>
                <button type="button" className="home-logout-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="home-logout-btn">
                Login
              </Link>
            )}
          </div>
        </header>

        <section className="home-start-hero">
          <img
            className="home-start-hero-image"
            src="/images/home-tech-hero.png"
            alt="Premium computers, networking and hosting technology"
          />
          <div className="home-start-hero-overlay" />

          <div className="home-start-copy">
            <span className="home-trusted-pill">
              <HomeIcon name="shield" />
              Trusted By Thousands
            </span>
            <h1>
              Power <span>Your World</span>
              <br />
              with Reliable Technology
            </h1>
            <p>
              Explore premium computers, ICT products and web hosting solutions built for
              performance, security and growth.
            </p>
            <div className="home-cta-row">
              <Link to="/catalog" className="home-primary-cta">
                Shop Now
              </Link>
              <Link to="/catalog?sort=discount_desc" className="home-secondary-cta">
                <span>
                  <HomeIcon name="play" />
                </span>
                Explore Deals
              </Link>
            </div>
          </div>

          <div className="home-hero-trust-row">
            {HERO_TRUST_ITEMS.map((item) => (
              <article key={item.title}>
                <HomeIcon name={item.icon} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-start-trust-strip" aria-label="Shopping benefits">
          {TRUST_ITEMS.map((item) => (
            <article key={item.title} className={`home-trust-card home-trust-${item.tone}`}>
              <span>
                <HomeIcon name={item.icon} />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
}
