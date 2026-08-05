"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-[#E8DBCA]/40 text-[#22211B] py-2 text-xs border-b border-[#C4A892]/20">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        
        {/* Contact info: phone visible on mobile, email hidden on small screens */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span>P: +91 990014886</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">E: info@tclgallery.com</span>
        </div>

        {/* Account links: hidden on mobile, visible on desktop */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-medium">
          <Link href="/profile" className="hover:text-[#4D3024] transition">
            My Account
          </Link>
          <Link href="/wishlist" className="hover:text-[#4D3024] transition">
            Wish List (2)
          </Link>
          <Link href="/cart" className="hover:text-[#4D3024] transition">
            Shopping Cart
          </Link>
          <Link href="/checkout" className="hover:text-[#4D3024] transition">
            Checkout
          </Link>
        </div>

      </div>
    </div>
  );
}