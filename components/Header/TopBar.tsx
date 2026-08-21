"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

import {
  FiShield,
  FiLogOut,
  FiUser,
  FiPackage,
  FiChevronDown,
  FiMapPin,
} from "react-icons/fi";

export default function TopBar() {
  const { data: session, status } = useSession();

  const [openAccount, setOpenAccount] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenAccount(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user name
  const userName = session?.user?.name
    ? session.user.name.split(" ")[0].toUpperCase()
    : session?.user?.email
      ? session.user.email.split("@")[0].toUpperCase()
      : "USER";

  // Check if admin
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="bg-[#E8DBCA]/40 text-[#22211B] py-2 text-xs border-b border-[#C4A892]/20">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex justify-between items-center">

        {/* LEFT SIDE - CONTACT INFO */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span>P: +91 990014886</span>

          <span className="hidden sm:inline">|</span>

          <span className="hidden sm:inline">
            E: info@tclgallery.com
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 text-[11px] font-medium">

          {/* LOADING */}
          {status === "loading" && (
            <span className="text-gray-400 animate-pulse">
              Loading...
            </span>
          )}

          {/* LOGGED IN USER */}
          {status === "authenticated" && session && (
            <>
              {/* ================= MY ACCOUNT DROPDOWN ================= */}
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() => setOpenAccount((prev) => !prev)}
                  className="flex items-center gap-1 hover:text-[#4D3024] transition"
                >
                  <FiUser size={13} />

                  <span>My Account</span>

                  <FiChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      openAccount ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN MENU */}
                {openAccount && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-[#C4A892]/30 shadow-xl rounded-md z-[100] overflow-hidden">

                    {/* USER DETAILS */}
                    <div className="px-4 py-3 bg-[#F7F3EE] border-b border-[#C4A892]/20">
                      <p className="font-semibold text-[#22211B]">
                        {session.user?.name || "User"}
                      </p>

                      <p className="text-[10px] text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* MY PROFILE */}
                    <Link
                      href="/my-account"
                      onClick={() => setOpenAccount(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-[#F7F3EE] transition"
                    >
                      <FiUser size={14} />

                      <span>My Profile</span>
                    </Link>

                    {/* MY ORDERS */}
                    <Link
                      href="/my-account/orders"
                      onClick={() => setOpenAccount(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-[#F7F3EE] transition"
                    >
                      <FiPackage size={14} />

                      <span>My Orders</span>
                    </Link>

                    {/* TRACK ORDER */}
                    <Link
                      href="/my-account/tracking"
                      onClick={() => setOpenAccount(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-[#F7F3EE] transition"
                    >
                      <FiMapPin size={14} />

                      <span>Track Order</span>
                    </Link>

                    {/* ADMIN DASHBOARD - ONLY FOR ADMIN */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100" />

                        <Link
                          href="/admin"
                          onClick={() => setOpenAccount(false)}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-[#F7F3EE] transition text-[#4D3024] font-semibold"
                        >
                          <FiShield size={14} />

                          <span>Admin Dashboard</span>
                        </Link>
                      </>
                    )}

                    {/* DIVIDER */}
                    <div className="border-t border-gray-100" />

                    {/* LOGOUT */}
                    <button
                      type="button"
                      onClick={() =>
                        signOut({
                          callbackUrl: "/",
                        })
                      }
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition"
                    >
                      <FiLogOut size={14} />

                      <span>Logout</span>
                    </button>

                  </div>
                )}
              </div>

              {/* USER NAME */}
              <span className="font-bold text-[#4D3024] flex items-center gap-1 tracking-wide">
                HI, {userName}
              </span>
            </>
          )}

          {/* NOT LOGGED IN */}
          {status === "unauthenticated" && (
            <Link
              href="/account/login"
              className="flex items-center gap-1 hover:text-[#4D3024] transition font-semibold"
            >
              <FiUser size={13} />

              <span>My Account</span>
            </Link>
          )}

          {/* DIVIDER */}
          <span className="text-gray-300">|</span>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            className="hover:text-[#4D3024] transition"
          >
            Wish List (2)
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="hover:text-[#4D3024] transition"
          >
            Shopping Cart
          </Link>

          {/* CHECKOUT */}
          <Link
            href="/checkout"
            className="hover:text-[#4D3024] transition"
          >
            Checkout
          </Link>

        </div>
      </div>
    </div>
  );
}