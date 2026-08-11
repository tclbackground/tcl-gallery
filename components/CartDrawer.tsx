"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import {
  FiX,
  FiShoppingBag,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* SLIDE-OVER PANEL */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#FDFBF7] text-[#22211B] shadow-2xl flex flex-col justify-between border-l border-[#EAE3D2]"
            >
              {/* DRAWER HEADER */}
              <div className="p-6 border-b border-[#EAE3D2] flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2.5">
                  <FiShoppingBag className="text-lg text-[#7B8F50]" />
                  <h2 className="font-serif text-lg font-bold text-[#22211B]">
                    Your Shopping Bag
                  </h2>
                  <span className="ml-1 text-xs font-semibold bg-[#7B8F50]/15 text-[#7B8F50] px-2.5 py-0.5 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-[#88847C] hover:text-[#22211B] hover:bg-[#EAE3D2]/50 rounded-full transition cursor-pointer"
                  aria-label="Close cart"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* CART ITEMS CONTAINER */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#EAE3D2] flex items-center justify-center text-[#88847C]">
                      <FiShoppingBag className="text-2xl" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-[#22211B]">
                        Your bag is empty
                      </h3>
                      <p className="text-xs text-[#88847C]">
                        Explore our fine art collection and find your next gallery piece.
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="mt-4 px-6 py-2.5 bg-[#7B8F50] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#667742] transition shadow-sm cursor-pointer"
                    >
                      Browse Gallery
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.framing}`}
                      className="flex gap-4 p-4 rounded-2xl border border-[#EAE3D2] bg-white shadow-xs relative group"
                    >
                      {/* ITEM IMAGE */}
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3D2] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      {/* ITEM DETAILS */}
                      <div className="flex-1 flex flex-col justify-between space-y-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif text-xs font-bold text-[#22211B] line-clamp-2 leading-tight">
                              {item.title}
                            </h4>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.size, item.framing)
                              }
                              className="text-[#88847C] hover:text-red-500 transition cursor-pointer shrink-0"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                          <p className="text-[10px] text-[#7B8F50] font-semibold tracking-wider uppercase pt-0.5">
                            {item.size} in | {item.framing}
                          </p>
                        </div>

                        {/* QUANTITY CONTROLS & PRICE */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="inline-flex items-center border border-[#E0D8C8] rounded-full bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.framing,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="p-1 text-[#55534E] hover:bg-[#FAF8F5] rounded-l-full transition cursor-pointer"
                            >
                              <FiMinus className="text-[10px]" />
                            </button>
                            <span className="px-2.5 text-[11px] font-bold text-[#22211B]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.size,
                                  item.framing,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 text-[#55534E] hover:bg-[#FAF8F5] rounded-r-full transition cursor-pointer"
                            >
                              <FiPlus className="text-[10px]" />
                            </button>
                          </div>

                          <span className="font-serif text-xs font-bold text-[#22211B]">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* DRAWER FOOTER / CHECKOUT */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#EAE3D2] bg-[#FAF8F5] space-y-4">
                  {/* SUBTOTAL */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#88847C]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#22211B]">
                        Rs. {subtotal.toLocaleString()}.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#88847C]">
                      <span>Shipping & Taxes</span>
                      <span className="text-[#7B8F50] font-semibold">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D2]">
                      <span className="font-serif text-sm font-bold text-[#22211B]">
                        Total
                      </span>
                      <span className="font-serif text-lg font-bold text-[#22211B]">
                        Rs. {subtotal.toLocaleString()}.00
                      </span>
                    </div>
                  </div>

                  {/* CHECKOUT BUTTONS */}
                  <div className="space-y-2 pt-1">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full py-3.5 px-6 bg-[#22211B] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#7B8F50] transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Proceed to Checkout <FiArrowRight className="text-sm" />
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="w-full py-2.5 px-6 border border-[#E0D8C8] text-[#55534E] text-[11px] font-bold uppercase tracking-wider rounded-full hover:border-[#7B8F50] hover:text-[#7B8F50] transition text-center block cursor-pointer"
                    >
                      View Cart
                    </Link>
                  </div>

                  <p className="text-[10px] text-[#88847C] text-center flex items-center justify-center gap-1">
                    <FiShield className="text-[#7B8F50]" /> Guaranteed safe & secure checkout
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}