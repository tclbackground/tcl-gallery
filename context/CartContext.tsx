"use client";

import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  artist: string;
  size: string;
  medium: string;
  framing: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, size: string, framing: string) => void;
  updateQuantity: (id: string, size: string, framing: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.framing === product.framing
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prevItems, { ...product, quantity }];
    });
    openCart();
  };

  const removeFromCart = (id: string, size: string, framing: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.size === size && item.framing === framing)
      )
    );
  };

  const updateQuantity = (
    id: string,
    size: string,
    framing: string,
    quantity: number
  ) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.size === size && item.framing === framing) {
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}