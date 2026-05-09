import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";

export default function WishlistPage() {
  const { wishlistProducts, wishlistIds, removeWishlist, toggleWishlist } = useShop();
  const { addToCart, getErrorMessage } = useCart();
  const [busyId, setBusyId] = useState("");
  const [status, setStatus] = useState("");
  const [quickView, setQuickView] = useState(null);

  const sortedWishlist = useMemo(
    () => [...wishlistProducts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [wishlistProducts]
  );

  const onAddToCart = async (productId) => {
    setBusyId(productId);
    try {
      await addToCart(productId, 1);
      setStatus("Item added to cart.");
    } catch (actionError) {
      setStatus(getErrorMessage(actionError));
    } finally {
      setBusyId("");
    }
  };

  const onRemove = async (productId) => {
    await removeWishlist(productId);
    setStatus("Removed from wishlist.");
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
        title="Wishlist"
        subtitle="Save favorite products and move them to cart anytime."
        fallback="/catalog"
      >
        {status && <p className="hint notice">{status}</p>}
      </PageHeader>

      {sortedWishlist.length === 0 ? (
        <section className="panel empty-state">
          <h2>No saved products yet</h2>
          <p className="muted">Tap the heart icon on products to add them here.</p>
        </section>
      ) : (
        <section className="product-grid">
          {sortedWishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={setQuickView}
              onWishlist={onRemove}
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
    </>
  );
}
