"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import WishlistModal from "./WishlistModal";

type WishlistContextType = {
  openWishlist: () => void;
  closeWishlist: () => void;
};

const WishlistContext =
  createContext<WishlistContextType | null>(null);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openWishlist = () => {
    setIsOpen(true);
  };

  const closeWishlist = () => {
    setIsOpen(false);
  };

  return (
    <WishlistContext.Provider
      value={{
        openWishlist,
        closeWishlist,
      }}
    >
      {children}

      <WishlistModal
        isOpen={isOpen}
        onClose={closeWishlist}
      />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}