"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

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
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function openWishlist() {
    setIsOpen(true);
  }

  function closeWishlist() {
    setIsOpen(false);
  }

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