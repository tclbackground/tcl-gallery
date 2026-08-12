"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiShield, FiLogOut, FiUser } from "react-icons/fi";

export default function TopBar() {
  const { data: session, status } = useSession();
  
  // Extract first name or fallback to full name/email/User
  const userName = session?.user?.name 
    ? session.user.name.split(" ")[0].toUpperCase() 
    : session?.user?.email 
      ? session.user.email.split("@")[0].toUpperCase() 
      : "USER";

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="bg-[#E8DBCA]/40 text-[#22211B] py-2 text-xs border-b border-[#C4A892]/20">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex justify-between items-center">
        
        {/* Left Side: Contact Info */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span>P: +91 990014886</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">E: info@tclgallery.com</span>
        </div>

        {/* Right Side: Dynamic Auth & Navigation Links */}
        <div className="flex items-center gap-4 text-[11px] font-medium">
          {status === "loading" ? (
            <span className="text-gray-400 animate-pulse">Loading...</span>
          ) : session ? (
            <div className="flex items-center gap-3">
              {/* Display HI, [NAME] */}
              <span className="font-bold text-[#4D3024] flex items-center gap-1 tracking-wide">
                <FiUser size={12} />
                HI, {userName}
              </span>

              {/* Admin Panel link if role is ADMIN */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 text-[#4D3024] font-bold hover:underline"
                >
                  <FiShield size={12} />
                  Admin
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-red-600 flex items-center gap-1 transition text-gray-600"
                title="Sign Out"
              >
                <FiLogOut size={12} />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/account/login" 
              className="hover:text-[#4D3024] transition font-semibold"
            >
              My Account
            </Link>
          )}

          <span className="text-gray-300">|</span>

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