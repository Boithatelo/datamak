import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";

const CartContext = createContext(null);

function emptyCart() {
  return {
    userId: null,
    items: [],
    total: 0,
    summary: {
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      grandTotal: 0
    }
  };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(emptyCart());
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
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

  const updateItemQty = async (productId, quantity) => {
    const { data } = await api.put(`/cart/items/${productId}`, { quantity });
    setCart(data.cart);
    return data.cart;
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/items/${productId}`);
    setCart(data.cart);
    return data.cart;
  };

  const clearCart = async () => {
    const { data } = await api.delete("/cart");
    setCart(data.cart);
    return data.cart;
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      setCart,
      refreshCart,
      addToCart,
      updateItemQty,
      removeFromCart,
      clearCart
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
