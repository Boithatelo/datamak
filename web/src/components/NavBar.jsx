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
    <header className="topbar market-topbar">
      <div className="container market-header">
        <Link to={isAdmin ? "/admin" : "/"} className="logo market-logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">D</span>
          <span className="logo-copy">
            <strong>Datamak Technologies</strong>
            <small>Shop Smart. Build Fast. Host Secure.</small>
          </span>
        </Link>

        <div className="market-actions">
          {user && !isAdmin && (
            <>
              <Link to="/cart" className="market-action" onClick={() => setOpen(false)}>
                <span>
                  Cart
                  {cartCount > 0 && <em>{cartCount}</em>}
                </span>
              </Link>
              <Link to="/orders" className="market-action" onClick={() => setOpen(false)}>
                <span>Orders</span>
              </Link>
            </>
          )}

          <div className="auth">
            {!user && <Link to="/auth">Login / Register</Link>}
            {user && (
              <>
                {isAdmin ? (
                  <span className="user-chip">Hi, {user.name}</span>
                ) : (
                  <Link to="/profile" className="user-chip">
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
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <button type="button" className="menu-btn" onClick={() => setOpen((state) => !state)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className="container market-nav">
        <nav className={`links ${open ? "open" : ""}`}>
          <NavLink end to="/" className={navClassName} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/catalog" className={navClassName} onClick={() => setOpen(false)}>
            Catalog
          </NavLink>
          <NavLink to="/hosting" className={navClassName} onClick={() => setOpen(false)}>
            Hosting
          </NavLink>
          <NavLink to="/about" className={navClassName} onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className={navClassName} onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {user && !isAdmin && (
            <NavLink to="/wishlist" className={navClassName} onClick={() => setOpen(false)}>
              Wishlist ({wishlistIds.length})
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
