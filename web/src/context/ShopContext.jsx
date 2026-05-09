import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetShopState = () => {
    setWishlistIds([]);
    setWishlistProducts([]);
    setRecentlyViewed([]);
  };

  const refreshWishlist = async () => {
    if (!user) {
      resetShopState();
      return;
    }
    const { data } = await api.get("/wishlist");
    setWishlistIds(data.productIds || []);
    setWishlistProducts(data.wishlist || []);
  };

  const refreshRecentlyViewed = async () => {
    if (!user) {
      setRecentlyViewed([]);
      return;
    }
    const { data } = await api.get("/recently-viewed");
    setRecentlyViewed(data.recentlyViewed || []);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      throw new Error("Please login to use wishlist.");
    }
    const { data } = await api.post(`/wishlist/${productId}`);
    setWishlistIds(data.productIds || []);
    setWishlistProducts(data.wishlist || []);
    return data;
  };

  const removeWishlist = async (productId) => {
    const { data } = await api.delete(`/wishlist/${productId}`);
    setWishlistIds(data.productIds || []);
    setWishlistProducts(data.wishlist || []);
    return data;
  };

  const markViewed = async (productId) => {
    if (!user) {
      return;
    }
    try {
      await api.post(`/products/${productId}/view`);
      await refreshRecentlyViewed();
    } catch (error) {
      // Ignore view tracking errors because this is non-critical.
    }
  };

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      if (!user) {
        resetShopState();
        return;
      }
      setLoading(true);
      try {
        await Promise.all([refreshWishlist(), refreshRecentlyViewed()]);
      } catch (error) {
        if (mounted) {
          resetShopState();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const value = useMemo(
    () => ({
      loading,
      wishlistIds,
      wishlistProducts,
      recentlyViewed,
      refreshWishlist,
      refreshRecentlyViewed,
      toggleWishlist,
      removeWishlist,
      markViewed
    }),
    [loading, wishlistIds, wishlistProducts, recentlyViewed]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider.");
  }
  return context;
}
