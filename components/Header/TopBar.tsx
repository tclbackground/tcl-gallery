"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-[#E8DBCA]/40 text-[#22211B] py-2 text-xs border-b border-[#C4A892]/20">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex justify-between items-center">
        <div>
          <span>P: (+00) 123 567990</span> | <span>E: contact@tclgallery.com</span>
        </div>
        <div className="flex gap-4">
          <Link href="/profile" className="hover:underline">My Account</Link>
          <Link href="/wishlist" className="hover:underline">Wish List (2)</Link>
          <Link href="/cart" className="hover:underline">Shopping Cart</Link>
          <Link href="/checkout" className="hover:underline">Checkout</Link>
        </div>
      </div>
    </div>
  );
}