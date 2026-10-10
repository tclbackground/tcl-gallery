"use client";

import { useState } from "react";
import {
  FiShoppingCart,
  FiCheck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

import { addToCart } from "../lib/cart";

interface AddToCartButtonProps {
  productId: string;
  size?: string;
  frame?: string;
  price?: number;
}

export default function AddToCartButton({
  productId,
  size,
  frame,
  price = 0,
}: AddToCartButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  async function handleAddToCart() {
    if (loading) {
      return;
    }

    if (!productId) {
      alert("Product ID is missing.");
      return;
    }

    setLoading(true);

    try {
      console.log(
        "AddToCartButton productId:",
        productId
      );

      console.log(
        "AddToCartButton price:",
        price
      );

      console.log(
        "AddToCartButton size:",
        size
      );

      console.log(
        "AddToCartButton frame:",
        frame
      );

      // =====================================================
      // CALL SERVER ACTION
      // =====================================================

      const result = await addToCart({
        productId: String(productId),
        size: size || undefined,
        frame: frame || undefined,
        price: Number(price) || 0,
      });

      console.log(
        "Cart result:",
        result
      );

      // =====================================================
      // LOGIN REQUIRED
      // =====================================================

      if (result?.loginRequired) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            window.location.pathname
          )}`
        );

        return;
      }

      // =====================================================
      // ERROR
      // =====================================================

      if (!result?.success) {
        alert(
          result?.message ||
            "Unable to add artwork to cart."
        );

        return;
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setAdded(true);

      // Tell header/cart components
      // that cart count has changed.
      window.dispatchEvent(
        new CustomEvent("cart-updated")
      );

      // Refresh server components
      router.refresh();

      // Reset button after 2 seconds
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Cart button error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add artwork to cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-1.5
        rounded-full
        px-4
        py-1.5
        text-[11px]
        font-semibold
        shadow-xs
        transition-all
        duration-200

        ${
          added
            ? "bg-green-700 text-white"
            : "bg-[#4D3024] text-[#FBF9F0] hover:bg-[#22211B]"
        }

        ${
          loading
            ? "cursor-wait opacity-60"
            : ""
        }
      `}
    >
      {added ? (
        <>
          <FiCheck className="text-xs" />
          Added
        </>
      ) : (
        <>
          <FiShoppingCart className="text-xs" />
          {loading
            ? "Adding..."
            : "Add"}
        </>
      )}
    </button>
  );
}