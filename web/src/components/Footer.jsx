import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <section>
          <h3>Datamak Technologies</h3>
          <p>
            Premium e-commerce for computers, ICT accessories, networking devices, software,
            and cloud hosting services.
          </p>
        </section>
        <section>
          <h4>Shop</h4>
          <Link to="/catalog">Product Catalog</Link>
          <Link to="/hosting">Hosting Plans</Link>
          <Link to="/wishlist">Wishlist</Link>
        </section>
        <section>
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </section>
        <section>
          <h4>Account</h4>
          <Link to="/auth">Login / Register</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/orders">Order Tracking</Link>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Datamak Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}
