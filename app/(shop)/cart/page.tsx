"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiShield,
  FiTruck,
  FiLock,
  FiShoppingBag,
} from "react-icons/fi";

// Sample Initial Cart Items
const initialCartItems = [
  {
    id: "1",
    title: "Serenade in Sienna",
    artist: "HELENA VANCE",
    category: "Oil Painting",
    dimensions: '40" x 50"',
    price: 3100,
    quantity: 1,
    isOriginal: true,
    image: "/images/new-arrivals/arrival-1.jpg",
    slug: "serenade-in-sienna",
  },
  {
    id: "2",
    title: "Sculpted Horizon No. 8",
    artist: "MARCUS VANCE",
    category: "Ceramic Sculpture",
    dimensions: '14" x 10" x 8"',
    price: 1850,
    quantity: 1,
    isOriginal: true,
    image: "/images/new-arrivals/arrival-2.jpg",
    slug: "sculpted-horizon-no-8",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Quantity Management
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  // Remove Item
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Promo Code Apply
  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "MERAKI10") {
      setDiscount(0.1); // 10% discount
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try 'MERAKI10'");
    }
  };

  // Pricing Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const estimatedShipping = cartItems.length > 0 ? 150 : 0; // White-glove insured shipping rate
  const grandTotal = subtotal - discountAmount + estimatedShipping;

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#22211B] py-12 lg:py-20">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#C4A892]/30 pb-6 mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4D3024]">
            TCL Gallery
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22211B] mt-1">
            Your Selection
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart View */
          <div className="py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E8DBCA]/40 text-[#4D3024]">
              <FiShoppingBag className="text-3xl" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#22211B]">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-[#22211B]/70 leading-relaxed">
              Explore our current gallery collection and Maison de Meraki originals to find your next statement piece.
            </p>
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FBF9F0] hover:bg-[#22211B] transition shadow-md"
              >
                Browse Gallery Shop <FiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Items Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-[#C4A892]/30 text-xs font-semibold uppercase tracking-wider text-[#22211B]/60">
                <div className="col-span-6">Artwork</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#C4A892]/30 bg-[#FBF9F0] p-4 sm:p-6 shadow-sm flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                >
                  {/* Item Image & Meta (6 Cols) */}
                  <div className="sm:col-span-6 flex items-center gap-4 w-full">
                    <div className="relative aspect-square w-24 sm:w-28 rounded-xl bg-[#E8DBCA]/40 overflow-hidden flex-shrink-0 border border-[#C4A892]/20">
                      {item.isOriginal && (
                        <span className="absolute top-2 left-2 z-10 rounded-full bg-[#4D3024] px-2 py-0.5 text-[8px] font-bold tracking-wider text-[#FBF9F0] uppercase">
                          Original
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#C4A892] uppercase tracking-wider">
                        {item.category} • {item.dimensions}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#22211B] leading-tight">
                        <Link href={`/shop/${item.slug}`} className="hover:text-[#4D3024] transition">
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-[11px] font-semibold text-[#22211B]/60 uppercase tracking-widest">
                        {item.artist}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900 pt-2 transition"
                      >
                        <FiTrash2 className="text-xs" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Selector (3 Cols) */}
                  <div className="sm:col-span-3 flex items-center justify-center w-full">
                    <div className="flex items-center rounded-full border border-[#C4A892]/40 bg-[#E8DBCA]/30 px-3 py-1.5 gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-[#22211B] hover:text-[#4D3024] transition"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="text-xs font-bold text-[#22211B] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-[#22211B] hover:text-[#4D3024] transition"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Item Price (3 Cols) */}
                  <div className="sm:col-span-3 text-right w-full flex sm:block items-center justify-between pt-2 sm:pt-0 border-t sm:border-none border-[#C4A892]/20">
                    <span className="sm:hidden text-xs text-[#22211B]/60 uppercase font-medium">
                      Total:
                    </span>
                    <span className="font-serif text-lg font-bold text-[#4D3024]">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              {/* Guarantees Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 rounded-xl bg-[#E8DBCA]/30 p-4 border border-[#C4A892]/20">
                  <FiTruck className="text-xl text-[#4D3024] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#22211B] uppercase tracking-wider">
                      White-Glove Delivery
                    </h4>
                    <p className="text-xs text-[#22211B]/70 mt-0.5">
                      Fully insured international crate packaging & handling.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#E8DBCA]/30 p-4 border border-[#C4A892]/20">
                  <FiShield className="text-xl text-[#4D3024] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#22211B] uppercase tracking-wider">
                      Certificate of Authenticity
                    </h4>
                    <p className="text-xs text-[#22211B]/70 mt-0.5">
                      Includes artist signature documentation & gallery record.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Sidebar (4 Cols) */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="rounded-2xl border border-[#C4A892]/40 bg-[#FBF9F0] p-6 shadow-sm space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#22211B] border-b border-[#C4A892]/30 pb-3">
                  Summary
                </h2>

                {/* Subtotals breakdown */}
                <div className="space-y-3 text-xs font-medium text-[#22211B]">
                  <div className="flex justify-between">
                    <span className="text-[#22211B]/70">Subtotal</span>
                    <span className="font-serif font-bold text-sm">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Promo Discount (10%)</span>
                      <span className="font-serif font-bold text-sm">
                        -${discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[#22211B]/70">
                      Insured Art Courier
                    </span>
                    <span className="font-serif font-bold text-sm">
                      ${estimatedShipping.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={applyPromo} className="space-y-2 border-t border-b border-[#C4A892]/30 py-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#22211B]/60 block">
                    Promo Code
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-full border border-[#C4A892]/50 bg-[#E8DBCA]/30 px-4 py-2 text-xs text-[#22211B] placeholder-[#22211B]/40 outline-none focus:border-[#4D3024]"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#E8DBCA] px-4 py-2 text-xs font-bold text-[#22211B] hover:bg-[#4D3024] hover:text-[#FBF9F0] transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] font-semibold text-emerald-800">
                      Code MERAKI10 applied successfully!
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] font-semibold text-red-700">
                      {promoError}
                    </p>
                  )}
                </form>

                {/* Total */}
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#22211B]/60 block">
                      Total Due
                    </span>
                    <span className="text-[10px] text-[#22211B]/50">
                      Taxes calculated at checkout
                    </span>
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#4D3024]">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4D3024] py-3.5 text-xs font-bold uppercase tracking-wider text-[#FBF9F0] shadow-md hover:bg-[#22211B] transition"
                  >
                    Proceed to Checkout <FiArrowRight />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#22211B]/60">
                    <FiLock className="text-xs text-[#4D3024]" /> 256-Bit Encrypted Secure Checkout
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}