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
  product: CartProduct;
}

interface CartItemsProps {
  items: CartItem[];
}

export default function CartItems({
  items,
}: CartItemsProps) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>(items);

  const [isPending, startTransition] =
    useTransition();

  // ============================================================
  // UPDATE QUANTITY
  // ============================================================

  const updateQuantity = (
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const previousItems = cartItems;

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );

    startTransition(async () => {
      const result = await updateCartQuantity(
        itemId,
        newQuantity
      );

      if (!result.success) {
        setCartItems(previousItems);
      }

      window.dispatchEvent(
        new Event("cart-updated")
      );
    });
  };

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeItem = (itemId: string) => {
    const previousItems = cartItems;

    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== itemId
      )
    );

    startTransition(async () => {
      const result =
        await removeFromCart(itemId);

      if (!result.success) {
        setCartItems(previousItems);
      }

      window.dispatchEvent(
        new Event("cart-updated")
      );
    });
  };

  // ============================================================
  // TOTAL ITEMS
  // ============================================================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // ============================================================
  // SUBTOTAL
  // ============================================================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const price = Number(
        item.price || 0
      );

      const quantity = Number(
        item.quantity || 1
      );

      return total + price * quantity;
    },
    0
  );

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (cartItems.length === 0) {
    return (
      <div className="rounded-2xl border border-[#C4A892]/30 bg-white">
        <div className="flex min-h-[450px] flex-col items-center justify-center px-6 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F3EE]">
            <FiShoppingBag
              size={32}
              strokeWidth={1.2}
              className="text-[#C4A892]"
            />
          </div>

          <h2 className="mt-6 font-serif text-3xl text-[#22211B] sm:text-4xl">
            Your cart is empty
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-[#22211B]/60">
            Explore our collection and
            discover an artwork you love.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#22211B]"
          >
            Explore Collection
            <FiArrowRight size={16} />
          </Link>

        </div>
      </div>
    );
  }

  // ============================================================
  // CART
  // ============================================================

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

      {/* ======================================================
          CART ITEMS
      ======================================================= */}

      <div className="rounded-2xl border border-[#C4A892]/30 bg-white">

        <div className="border-b border-[#C4A892]/30 px-6 py-5">
          <div className="flex items-center justify-between gap-4">

            <h2 className="font-serif text-2xl text-[#22211B]">
              Your Items
            </h2>

            <span className="text-xs uppercase tracking-widest text-[#22211B]/50">
              {totalItems}{" "}
              {totalItems === 1
                ? "Item"
                : "Items"}
            </span>

          </div>
        </div>

        <div>

          {cartItems.map((item) => {
            const product = item.product;

            const quantity = Number(
              item.quantity || 1
            );

            const price = Number(
              item.price || 0
            );

            const itemTotal =
              price * quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-5 border-b border-[#C4A892]/30 p-6 last:border-b-0 sm:flex-row"
              >

                {/* IMAGE */}

                <Link
                  href={`/shop/${product.id}`}
                  className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg bg-[#E8DBCA]/30 sm:h-40 sm:w-40"
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={
                        product.title ||
                        "Artwork"
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#22211B]/40">
                      No Image
                    </div>
                  )}
                </Link>

                {/* DETAILS */}

                <div className="flex flex-1 flex-col">

                  <Link
                    href={`/shop/${product.id}`}
                  >
                    <h3 className="font-serif text-xl text-[#22211B] transition hover:text-[#4D3024]">
                      {product.title ||
                        "Untitled Artwork"}
                    </h3>
                  </Link>

                  {product.location && (
                    <p className="mt-1 text-sm text-[#22211B]/60">
                      {product.location}
                    </p>
                  )}

                  {/* SIZE */}

                  {item.size && (
                    <p className="mt-3 text-xs text-[#22211B]/60">
                      <span className="font-semibold text-[#22211B]">
                        Size:
                      </span>{" "}
                      {item.size}
                    </p>
                  )}

                  {/* FRAME */}

                  {item.frame && (
                    <p className="mt-1 text-xs text-[#22211B]/60">
                      <span className="font-semibold text-[#22211B]">
                        Frame:
                      </span>{" "}
                      {item.frame}
                    </p>
                  )}

                  {/* PRICE / QUANTITY / TOTAL */}

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-6">

                    {/* PRICE */}

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#22211B]/40">
                        Price
                      </p>

                      <p className="mt-1 font-serif text-lg font-semibold text-[#22211B]">
                        ₹
                        {price.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    {/* QUANTITY */}

                    <div>
                      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-[#22211B]/40">
                        Quantity
                      </p>

                      <div className="flex items-center border border-[#C4A892]/40">

                        <button
                          type="button"
                          disabled={
                            isPending ||
                            quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              quantity - 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-[#22211B] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={13} />
                        </button>

                        <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#C4A892]/40 px-2 text-sm">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-[#22211B] transition hover:bg-[#F7F3EE] disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={13} />
                        </button>

                      </div>
                    </div>

                    {/* ITEM TOTAL */}

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-[#22211B]/40">
                        Total
                      </p>

                      <p className="mt-1 font-serif text-lg font-semibold text-[#4D3024]">
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-wider text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiTrash2 size={14} />
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* ======================================================
          ORDER SUMMARY
      ======================================================= */}

      <aside className="h-fit rounded-2xl border border-[#C4A892]/30 bg-white">

        <div className="border-b border-[#C4A892]/30 px-6 py-5">
          <h2 className="font-serif text-2xl text-[#22211B]">
            Order Summary
          </h2>
        </div>

        <div className="p-6">

          {/* SUBTOTAL */}

          <div className="flex justify-between gap-4 text-sm text-[#22211B]/60">
            <span>
              Subtotal
            </span>

            <span className="font-medium text-[#22211B]">
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          {/* SHIPPING */}

          <div className="mt-3 flex justify-between gap-4 text-sm text-[#22211B]/60">
            <span>
              Shipping
            </span>

            <span className="text-right">
              Calculated at checkout
            </span>
          </div>

          {/* DIVIDER */}

          <div className="my-6 border-t border-[#C4A892]/30" />

          {/* TOTAL */}

          <div className="flex items-center justify-between gap-4">

            <span className="font-serif text-xl text-[#22211B]">
              Total
            </span>

            <span className="font-serif text-2xl font-bold text-[#4D3024]">
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

          {/* =================================================
              PROCEED TO CHECKOUT
              OLIVE GREEN
          ================================================== */}

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5F6F32] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white transition duration-300 hover:bg-[#4A5827]"
          >
            Proceed to Checkout
            <FiArrowRight size={16} />
          </Link>

          {/* CONTINUE SHOPPING */}

          <Link
            href="/shop"
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-[#C4A892]/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#4D3024] transition duration-300 hover:bg-[#F7F3EE]"
          >
            Continue Shopping
          </Link>

        </div>

      </aside>

    </div>
  );
}