"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import { addToCart } from "@/app/actions/cart";

interface AddToCartButtonProps {
  productId: string;
  size?: string;
  frame?: string;
  price: number;
}

export default function AddToCartButton({
  productId,
  size,
  frame,
  price,
}: AddToCartButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);

    const result = await addToCart({
      productId,
      size,
      frame,
      price,
    });

    setLoading(false);

    if (result.loginRequired) {
      router.push("/account/login?callbackUrl=/cart");
      return;
    }

    if (!result.success) {
      alert(result.message);
      return;
    }

    router.push("/cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 bg-[#22211B] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#4D3024] disabled:opacity-50"
    >
      <FiShoppingBag size={18} />

      {loading ? "ADDING..." : "ADD TO CART"}
    </button>
  );
}