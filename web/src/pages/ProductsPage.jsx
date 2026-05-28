import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import MessageDialog from "../components/MessageDialog";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import { SHOP_CATEGORIES } from "../data/shopCategories";
import { applyImageFallback, getImageSource } from "../utils/imageFallbacks";

const DEFAULT_FILTERS = {
  search: "",
  category: "",
  subcategory: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest"
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" }
];

export default function ProductsPage() {
  const { user } = useAuth();
  const { addToCart, getErrorMessage } = useCart();
  const { wishlistIds, toggleWishlist } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || DEFAULT_FILTERS.sort
  }));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [status, setStatus] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [error, setError] = useState("");
  const [quickView, setQuickView] = useState(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const selectedSort =
    SORT_OPTIONS.find((option) => option.value === filters.sort) || SORT_OPTIONS[0];

  const syncSearchParams = (nextFilters) => {
    const next = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value && value !== DEFAULT_FILTERS[key]) {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  };

  const fetchProducts = async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const sortMap = {
        newest: "newest",
        price_asc: "price_asc",
        price_desc: "price_desc",
        popularity: "popularity_desc",
        rating: "rating_desc",
        name: "name_asc"
      };

      const { data } = await api.get("/products", {
        params: {
          search: nextFilters.search || undefined,
          category: nextFilters.category || undefined,
          subcategory: nextFilters.subcategory || undefined,
          type: nextFilters.type || undefined,
          minPrice: nextFilters.minPrice || undefined,
          maxPrice: nextFilters.maxPrice || undefined,
          sort: sortMap[nextFilters.sort] || "newest"
        }
      });
      setProducts(data.products || []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSortSelect = (sort) => {
    const nextFilters = {
      ...filters,
      sort
    };
    setFilters(nextFilters);
    setSortMenuOpen(false);
    syncSearchParams(nextFilters);
    fetchProducts(nextFilters);
  };

  const onCategorySelect = (category) => {
    const nextFilters = {
      ...DEFAULT_FILTERS,
      category
    };
    setFilters(nextFilters);
    syncSearchParams(nextFilters);
    fetchProducts(nextFilters);
  };

  const onClearFilters = () => {
    const nextFilters = { ...DEFAULT_FILTERS };
    setFilters(nextFilters);
    syncSearchParams(nextFilters);
    fetchProducts(nextFilters);
  };

  const onAddToCart = async (productId) => {
    if (!user) {
      setStatus("Please login or register to add products to cart.");
      return;
    }
    setStatus("");
    setBusyId(productId);
    try {
      await addToCart(productId, 1);
      setDialogMessage("Product added to cart.");
    } catch (addError) {
      setStatus(getErrorMessage(addError));
    } finally {
      setBusyId("");
    }
  };

  const onToggleWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      setStatus("Wishlist updated.");
    } catch (actionError) {
      setStatus(getErrorMessage(actionError));
    }
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Catalog" }]}
        eyebrow="Datamak Marketplace"
        title="Product Catalog"
        subtitle="Find computers, ICT gear, networking devices, software licenses, and cloud hosting packages from one curated catalog."
        fallback="/"
        actions={
          <div
            className="catalog-sort"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setSortMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="catalog-sort-trigger"
              aria-haspopup="menu"
              aria-expanded={sortMenuOpen}
              onClick={() => setSortMenuOpen((open) => !open)}
            >
              <span className="catalog-sort-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </span>
              <span>
                Sort
                <small>{selectedSort.label}</small>
              </span>
            </button>
            {sortMenuOpen && (
              <div className="catalog-sort-menu" role="menu">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitem"
                    className={`catalog-sort-option ${
                      filters.sort === option.value ? "is-active" : ""
                    }`}
                    onClick={() => onSortSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      <section className="panel shop-category-panel" aria-labelledby="catalog-shop-category-title">
        <div className="shop-category-heading">
          <h2 id="catalog-shop-category-title">Shop by Category</h2>
          <button
            type="button"
            className="shop-category-view"
            onClick={onClearFilters}
          >
            View all <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
        <div className="shop-category-grid">
          {SHOP_CATEGORIES.map((item) => (
            <button
              key={item.title}
              type="button"
              className={`shop-category-card ${
                filters.category === item.category ? "is-active" : ""
              }`}
              aria-pressed={filters.category === item.category}
              onClick={() => onCategorySelect(item.category)}
            >
              <img
                src={getImageSource(item.imageUrl, item.category)}
                alt={item.imageAlt}
                onError={(event) => applyImageFallback(event, item.category)}
              />
              <span className="shop-category-copy">
                <strong>{item.title}</strong>
              </span>
              <span className="shop-category-action">View all <span aria-hidden="true">-&gt;</span></span>
            </button>
          ))}
        </div>
      </section>

      {(status || error) && (
        <section className="panel">
          {status && <p className="hint notice">{status}</p>}
          {error && <p className="error notice">{error}</p>}
        </section>
      )}

      {loading ? (
        <section className="panel">Loading products...</section>
      ) : products.length === 0 ? (
        <section className="panel empty-state">
          <h2>No products found</h2>
          <p className="muted">Adjust the category, subcategory, search, or price filters.</p>
          <button type="button" className="btn btn-primary" onClick={onClearFilters}>
            Clear Filters
          </button>
        </section>
      ) : (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={setQuickView}
              onWishlist={onToggleWishlist}
              busy={busyId === product.id}
              wishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </section>
      )}

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onAddToCart={onAddToCart}
        busy={busyId === quickView?.id}
      />
      <MessageDialog message={dialogMessage} onClose={() => setDialogMessage("")} />
    </>
  );
}
