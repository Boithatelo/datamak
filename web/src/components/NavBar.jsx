import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";

function Icon({ name }) {
  const icons = {
    search: (
      <path d="M10.8 18.1a7.3 7.3 0 1 1 5.2-2.2l4.1 4.1-1.5 1.5-4.1-4.1a7.2 7.2 0 0 1-3.7.7Zm0-2.1a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4Z" />
    ),
    cart: (
      <path d="M7.2 19.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm9.9 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM4.3 4.1H1.8V2h4l1 3h14.4l-2.1 8.6a3 3 0 0 1-2.9 2.3H8.4l.5 1.5h10.4v2.1H7.4L4.3 4.1Zm3.1 3 .9 6.7h7.9c.4 0 .8-.3.9-.7l1.4-6H7.4Z" />
    ),
    orders: (
      <path d="M6.2 3.5h11.6a2.3 2.3 0 0 1 2.3 2.3v12.4a2.3 2.3 0 0 1-2.3 2.3H6.2a2.3 2.3 0 0 1-2.3-2.3V5.8a2.3 2.3 0 0 1 2.3-2.3Zm0 2.1a.2.2 0 0 0-.2.2v12.4c0 .1.1.2.2.2h11.6c.1 0 .2-.1.2-.2V5.8a.2.2 0 0 0-.2-.2H16v2.7l-2.1-1.1-1.9 1.1V5.6H6.2Zm2.1 6h7.4v2H8.3v-2Zm0 3.6h5.1v2H8.3v-2Z" />
    ),
    user: (
      <path d="M12 12.2a4.4 4.4 0 1 1 0-8.8 4.4 4.4 0 0 1 0 8.8Zm0-2.1a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Zm-8.1 9.8a8.1 8.1 0 0 1 16.2 0H18a6 6 0 0 0-12 0H3.9Z" />
    )
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistIds } = useShop();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const navClassName = ({ isActive }) => (isActive ? "nav-item nav-item-active" : "nav-item");

  const onSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog");
    setOpen(false);
  };

  return (
    <header className="topbar market-topbar" data-testid="nav-topbar">
      <div className="container market-header">
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="logo market-logo"
          onClick={() => setOpen(false)}
          data-testid="nav-logo-link"
        >
          <span className="logo-mark">DT</span>
          <span className="logo-copy">
            <strong>Datamak</strong>
            <small>Technologies</small>
          </span>
        </Link>

        {!isAdmin && (
          <form className="market-search" onSubmit={onSearch} role="search">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products, brands, categories..."
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search">
              <Icon name="search" />
            </button>
          </form>
        )}

        <div className="market-actions">
          {user && !isAdmin && (
            <>
              <Link
                to="/cart"
                className="market-action"
                onClick={() => setOpen(false)}
                data-testid="nav-cart-link"
              >
                <Icon name="cart" />
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
                <Icon name="orders" />
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
                    <Icon name="user" />
                    Hi, {user.name}
                  </Link>
                )}
                <button
                  type="button"
                  className="btn nav-logout"
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
