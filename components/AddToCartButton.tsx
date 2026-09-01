"use client";

import { useState } from "react";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { addToCart } from "../lib/cart";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({
  productId,
}: AddToCartButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (loading || !productId) {
      return;
    }

    setLoading(true);

    try {
      const result = await addToCart(productId);

      console.log("Cart result:", result);

      // Login required
      if (result.loginRequired) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(
            window.location.pathname
          )}`
        );

        return;
      }

      // Error
      if (!result.success) {
        alert(
          result.message ||
            "Unable to add artwork to cart."
        );

        return;
      }

      // Successfully added
      setAdded(true);

      // Refresh server data
      router.refresh();

      // Return button to normal after 2 seconds
      setTimeout(() => {
        setAdded(false);
      }, 2000);

    } catch (error) {
      console.error("Cart button error:", error);

      alert(
        "Unable to add artwork to cart. Please try again."
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
          {loading ? "Adding..." : "Add"}
        </>
      )}
    </button>
  );
}