"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

import {
  removeFromCart,
  updateCartQuantity,
} from "@/app/actions/cart";

interface CartProduct {
  id: string;
  title: string | null;
  location: string | null;
  imageUrl: string | null;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  frame: string | null;
  priceError?: string | null;
  product: CartProduct;
}

interface CartItemsProps {
  items: CartItem[];
}

function formatPrice(price: number): string {
  return `₹${Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function normalizeImage(image: string | null): string | null {
  if (!image?.trim()) return null;

  const value = image.trim();

  if (/^https?:\/\//i.test(value)) return value;

  return value.startsWith("/") ? value : `/${value}`;
}

export default function CartItems({ items }: CartItemsProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1 || isPending) return;

    const previousItems = cartItems;
    setErrorMessage(null);

    setCartItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    startTransition(async () => {
      try {
        const result = await updateCartQuantity(itemId, quantity);

        if (!result.success) {
          setCartItems(previousItems);
          setErrorMessage(result.message ?? "Unable to update quantity.");
        }
      } catch (error) {
        console.error("Cart quantity update failed:", error);
        setCartItems(previousItems);
        setErrorMessage("Unable to update quantity. Please try again.");
      }
    });
  };

  const removeItem = (itemId: string) => {
    if (isPending) return;

    const previousItems = cartItems;
    setErrorMessage(null);
    setCartItems((current) => current.filter((item) => item.id !== itemId));

    startTransition(async () => {
      try {
        const result = await removeFromCart(itemId);

        if (!result.success) {
          setCartItems(previousItems);
          setErrorMessage(result.message ?? "Unable to remove this item.");
        }
      } catch (error) {
        console.error("Remove cart item failed:", error);
        setCartItems(previousItems);
        setErrorMessage("Unable to remove item. Please try again.");
      }
    });
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const hasPriceErrors = cartItems.some(
    (item) => Boolean(item.priceError) || item.price <= 0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <FiShoppingBag className="mx-auto mb-4 text-4xl text-gray-400" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">
          Explore our collection and find your next artwork.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded bg-black px-6 py-3 text-white"
        >
          Continue Shopping <FiArrowRight />
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        {errorMessage && (
          <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        {cartItems.map((item) => {
          const image = normalizeImage(item.product.imageUrl);

          return (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row"
            >
              <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-32">
                {image ? (
                  <Image
                    src={image}
                    alt={item.product.title ?? "Artwork"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 128px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">
                  {item.product.title ?? "Untitled artwork"}
                </h2>

                {item.product.location && (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.product.location}
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-600">
                  Size: {item.size ?? "Not selected"}
                </p>

                {item.frame && (
                  <p className="text-sm text-gray-600">
                    Frame: {item.frame}
                  </p>
                )}

                {item.priceError && (
                  <p className="mt-2 text-sm text-red-700">
                    {item.priceError}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={isPending || item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="rounded border p-2 disabled:opacity-40"
                    >
                      <FiMinus />
                    </button>

                    <span className="min-w-5 text-center">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={isPending || item.quantity >= 99}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="rounded border p-2 disabled:opacity-40"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {item.price > 0 ? formatPrice(item.price * item.quantity) : "Price unavailable"}
                    </p>
                    {item.price > 0 && (
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => removeItem(item.id)}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-red-700 disabled:opacity-50"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        <div className="mt-5 flex justify-between text-sm">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="mt-3 flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        {hasPriceErrors && (
          <p className="mt-4 text-sm text-red-700">
            Please correct the item size or price before proceeding to checkout.
          </p>
        )}

        <Link
          href="/shop"
          className="mt-5 block text-center text-sm underline"
        >
          Continue Shopping
        </Link>

        {hasPriceErrors ? (
          <button
            type="button"
            disabled
            className="mt-5 w-full rounded bg-gray-300 px-5 py-3 font-medium text-gray-600"
          >
            Checkout unavailable
          </button>
        ) : (
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-black px-5 py-3 font-medium text-white"
          >
            Proceed to Checkout <FiArrowRight />
          </Link>
        )}

        {isPending && (
          <p className="mt-3 text-center text-sm text-gray-500">
            Updating cart…
          </p>
        )}
      </aside>
    </div>
  );
}