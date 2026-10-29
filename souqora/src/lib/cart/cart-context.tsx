"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface CartItem {
  id: string; // unique cart item id (e.g. productId or variantId)
  productId: string;
  variantId?: string;
  title: string;
  titleAr?: string;
  price: number; // in minor units (e.g. 29900 = 299.00 SAR)
  currency: string;
  quantity: number;
  image?: string;
  sellerName?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "souqora_cart_v1";

let cartCache: CartItem[] = [];
let cartRawString = "";
const listeners = new Set<() => void>();

function notifyCartChange() {
  for (const listener of listeners) {
    listener();
  }
}

function cartSubscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getCartSnapshot(): CartItem[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(CART_STORAGE_KEY) || "[]";
    if (raw !== cartRawString) {
      cartRawString = raw;
      try {
        cartCache = JSON.parse(raw);
      } catch {
        cartCache = [];
      }
    }
  }
  return cartCache;
}

const emptyServerCart: CartItem[] = [];
function getCartServerSnapshot(): CartItem[] {
  return emptyServerCart;
}

function saveCart(newItems: CartItem[]) {
  cartCache = newItems;
  cartRawString = JSON.stringify(newItems);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, cartRawString);
    } catch {
      // storage quota or private mode
    }
  }
  notifyCartChange();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartSubscribe,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const addItem = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    const existing = items.find((i) => i.id === newItem.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i.id === newItem.id ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updated = [...items, { ...newItem, quantity }];
    }
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    saveCart(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    saveCart(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
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
