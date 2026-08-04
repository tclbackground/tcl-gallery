"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

export default function TopBar() {
  const [isEngOpen, setIsEngOpen] = useState(false);
  const [isUsdOpen, setIsUsdOpen] = useState(false);

  return (
    <div className="bg-[#C4A892] text-white text-xs py-2 px-4 lg:px-8 font-sans">
      <div className="mx-auto flex max-w-[1800px] flex-col md:flex-row items-center justify-between gap-2">
        {/* Contact Info & Selectors */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <span>P: (+00) 123 567990</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span>E: Contact@hamadryad.com</span>
          <span className="hidden sm:inline text-white/40">|</span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEngOpen(!isEngOpen)}
              className="flex items-center gap-1 hover:text-gray-200 transition-colors"
            >
              ENG <FiChevronDown className="text-xs" />
            </button>
            <button
              onClick={() => setIsUsdOpen(!isUsdOpen)}
              className="flex items-center gap-1 hover:text-gray-200 transition-colors"
            >
              USD <FiChevronDown className="text-xs" />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden lg:flex items-center gap-6 text-[12px]">
          <Link href="/account" className="hover:underline">My Account</Link>
          <Link href="/wishlist" className="hover:underline">Wish List (2)</Link>
          <Link href="/cart" className="hover:underline">Shopping Cart</Link>
          <Link href="/checkout" className="hover:underline">Checkout</Link>
        </div>
      </div>
    </div>
  );
}