import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function emptyCart() {
  return {
    userId: null,
    items: [],
    total: 0,
    summary: { subtotal: 0, tax: 0, deliveryFee: 0, grandTotal: 0 }
  };
}

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Cart operation failed.";
}

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!token) {
      setCart(emptyCart());
      return emptyCart();
    }

    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
      return data.cart;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/items", { productId, quantity });
    setCart(data.cart);
    return data.cart;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/cart/items/${productId}`, { quantity });
    setCart(data.cart);
    return data.cart;
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/items/${productId}`);
    setCart(data.cart);
    return data.cart;
  };

  const clearCart = async () => {
    const { data } = await api.delete("/cart");
    setCart(data.cart);
    return data.cart;
  };

  useEffect(() => {
    if (!token) {
      setCart(emptyCart());
      return;
    }
    refreshCart().catch(() => {
      setCart(emptyCart());
    });
  }, [token]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getErrorMessage
    }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }
  return context;
}
