import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistIds } = useShop();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const navClassName = ({ isActive }) => (isActive ? "nav-item nav-item-active" : "nav-item");

  return (
    <header className="topbar market-topbar" data-testid="nav-topbar">
      <div className="container market-header">
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="logo market-logo"
          onClick={() => setOpen(false)}
          data-testid="nav-logo-link"
        >
          <span className="logo-mark">D</span>
          <span className="logo-copy">
            <strong>Datamak Technologies</strong>
            <small>Shop Smart. Build Fast. Host Secure.</small>
          </span>
        </Link>

        <div className="market-actions">
          {user && !isAdmin && (
            <>
              <Link
                to="/cart"
                className="market-action"
                onClick={() => setOpen(false)}
                data-testid="nav-cart-link"
              >
                <span>
                  Cart
                  {cartCount > 0 && <em>{cartCount}</em>}
                </span>
              </Link>
              <Link
                to="/orders"
                className="market-action"
                onClick={() => setOpen(false)}
                data-testid="nav-orders-link"
              >
                <span>Orders</span>
              </Link>
            </>
          )}

          <div className="auth">
            {!user && (
              <Link to="/auth" data-testid="nav-login-register-link">
                Login / Register
              </Link>
            )}
            {user && (
              <>
                {isAdmin ? (
                  <span className="user-chip" data-testid="nav-user-chip">
                    Hi, {user.name}
                  </span>
                ) : (
                  <Link to="/profile" className="user-chip" data-testid="nav-profile-link">
                    Hi, {user.name}
                  </Link>
                )}
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  data-testid="nav-logout-button"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((state) => !state)}
          data-testid="nav-menu-button"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className="container market-nav">
        <nav className={`links ${open ? "open" : ""}`} data-testid="nav-links">
          <NavLink
            end
            to="/"
            className={navClassName}
            onClick={() => setOpen(false)}
            data-testid="nav-link-home"
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={navClassName}
            onClick={() => setOpen(false)}
            data-testid="nav-link-catalog"
          >
            Catalog
          </NavLink>
          <NavLink
            to="/hosting"
            className={navClassName}
            onClick={() => setOpen(false)}
            data-testid="nav-link-hosting"
          >
            Hosting
          </NavLink>
          <NavLink
            to="/about"
            className={navClassName}
            onClick={() => setOpen(false)}
            data-testid="nav-link-about"
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={navClassName}
            onClick={() => setOpen(false)}
            data-testid="nav-link-contact"
          >
            Contact
          </NavLink>
          {user && !isAdmin && (
            <NavLink
              to="/wishlist"
              className={navClassName}
              onClick={() => setOpen(false)}
              data-testid="nav-link-wishlist"
            >
              Wishlist ({wishlistIds.length})
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
