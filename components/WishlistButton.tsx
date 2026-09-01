"use client";

import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "../lib/wishlist";

interface WishlistButtonProps {
  productId: string;
  initialWishlisted?: boolean;
}

export default function WishlistButton({
  productId,
  initialWishlisted = false,
}: WishlistButtonProps) {
  const router = useRouter();

  const [wishlisted, setWishlisted] =
    useState(initialWishlisted);

  const [loading, setLoading] =
    useState(false);

  async function handleWishlist(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !productId) {
      return;
    }

    setLoading(true);

    try {
      const result =
        await toggleWishlist(productId);

      console.log(
        "Wishlist result:",
        result
      );

      // ==========================================
      // LOGIN REQUIRED
      // ==========================================

      if (result.loginRequired) {
        router.push(
          `/account/login?callbackUrl=${encodeURIComponent(
            window.location.pathname
          )}`
        );

        return;
      }

      // ==========================================
      // SERVER ERROR
      // ==========================================

      if (!result.success) {
        alert(
          result.message ||
            "Unable to update wishlist."
        );

        return;
      }

      // ==========================================
      // UPDATE HEART
      // ==========================================

      if (result.action === "added") {
        setWishlisted(true);
      }

      if (result.action === "removed") {
        setWishlisted(false);
      }

      // ==========================================
      // IMPORTANT:
      // TELL TOPBAR THAT WISHLIST CHANGED
      // ==========================================

      window.dispatchEvent(
        new CustomEvent("wishlist-updated")
      );

      // Refresh server components
      router.refresh();

    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      alert(
        "Unable to update wishlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      aria-label={
        wishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      title={
        wishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        shadow-sm
        transition-all
        duration-200

        ${
          wishlisted
            ? "bg-[#4D3024] text-[#FBF9F0]"
            : "bg-[#FBF9F0] text-[#22211B] hover:bg-[#4D3024] hover:text-[#FBF9F0]"
        }

        ${
          loading
            ? "cursor-wait opacity-50"
            : ""
        }
      `}
    >
      <FiHeart
        className={`
          text-sm
          transition-all
          duration-200

          ${
            wishlisted
              ? "scale-110 fill-current"
              : ""
          }
        `}
      />
    </button>
  );
}