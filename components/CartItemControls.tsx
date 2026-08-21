"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import {
  updateCartQuantity,
  removeFromCart,
} from "@/app/actions/cart";

interface CartItemControlsProps {
  cartItemId: string;
  quantity: number;
}

export default function CartItemControls({
  cartItemId,
  quantity,
}: CartItemControlsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    setLoading(true);

    await updateCartQuantity(
      cartItemId,
      newQuantity
    );

    setLoading(false);

    router.refresh();
  };

  const removeItem = async () => {
    setLoading(true);

    await removeFromCart(cartItemId);

    setLoading(false);

    router.refresh();
  };

  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center border">

        <button
          disabled={loading}
          onClick={() =>
            updateQuantity(quantity - 1)
          }
          className="flex h-9 w-9 items-center justify-center hover:bg-gray-100"
        >
          <FiMinus size={15} />
        </button>

        <span className="flex h-9 w-10 items-center justify-center text-sm">
          {quantity}
        </span>

        <button
          disabled={loading}
          onClick={() =>
            updateQuantity(quantity + 1)
          }
          className="flex h-9 w-9 items-center justify-center hover:bg-gray-100"
        >
          <FiPlus size={15} />
        </button>

      </div>

      <button
        disabled={loading}
        onClick={removeItem}
        className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-red-600"
      >
        <FiTrash2 size={16} />

        Remove
      </button>

    </div>
  );
}