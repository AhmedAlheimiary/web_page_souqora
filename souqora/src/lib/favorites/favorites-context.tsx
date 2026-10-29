"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface FavoriteItem {
  id: string;
  type: "product" | "property" | "vehicle";
  title: string;
  titleEn?: string;
  priceAmount: number;
  priceCurrency: string;
  image?: string;
  slug: string;
  categorySlug?: string;
}

const STORAGE_KEY = "souqora_favorites_v1";

// Initial demo items to showcase functionality immediately
const initialFavorites: FavoriteItem[] = [
  {
    id: "prod-demo-1",
    type: "product",
    title: "آبل آيفون 16 برو ماكس — 256 جيجابايت",
    titleEn: "Apple iPhone 16 Pro Max 256GB",
    priceAmount: 499900, // 4,999.00 SAR
    priceCurrency: "SAR",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    slug: "apple-iphone-16-pro-max",
    categorySlug: "electronics",
  },
  {
    id: "prop-demo-1",
    type: "property",
    title: "فيلا مودرن فاخرة مع مسبح خاص — الرياض حي الملقا",
    titleEn: "Luxury Modern Villa with Pool — Riyadh Al Malqa",
    priceAmount: 480000000, // 4,800,000.00 SAR
    priceCurrency: "SAR",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    slug: "luxury-villa-malqa-riyadh",
    categorySlug: "real-estate",
  },
];

let memoryFavorites: FavoriteItem[] = initialFavorites;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getFavoritesSnapshot(): FavoriteItem[] {
  return memoryFavorites;
}

function getFavoritesServerSnapshot(): FavoriteItem[] {
  return initialFavorites;
}

function subscribeFavorites(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryFavorites = JSON.parse(raw);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFavorites));
    }
  } catch {
    // Fallback to memory
  }

  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        memoryFavorites = JSON.parse(e.newValue);
        emitChange();
      } catch {
        // Ignore JSON error
      }
    }
  });
}

function saveFavorites(items: FavoriteItem[]) {
  memoryFavorites = items;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full / disabled
    }
  }
  emitChange();
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot
  );

  const addFavorite = (item: FavoriteItem) => {
    if (!favorites.some((f) => f.id === item.id)) {
      saveFavorites([...favorites, item]);
    }
  };

  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter((f) => f.id !== id));
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (favorites.some((f) => f.id === item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        totalFavorites: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
