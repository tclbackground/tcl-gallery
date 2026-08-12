"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FiChevronDown, FiUser, FiLogOut, FiHome, FiShield } from "react-icons/fi";

interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function AdminUserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || user?.email?.split("@")[0] || "Admin";
  const userRole = (user as any)?.role || "ADMIN";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#FAF7F0] transition focus:outline-none"
      >
        <div className="h-9 w-9 rounded-full bg-[#4D3024] text-white flex items-center justify-center font-bold text-xs shadow-xs">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-[#22211B] leading-tight">
            {userName}
          </p>
          <p className="text-[10px] text-gray-500 font-medium">
            {userRole === "ADMIN" ? "Administrator" : "User"}
          </p>
        </div>
        <FiChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E8E2D5] rounded-xl shadow-lg py-2 z-50 text-xs">
          <div className="px-4 py-2 border-b border-[#E8E2D5]/60">
            <p className="font-bold text-[#22211B] truncate">{userName}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#FAF7F0] transition"
            >
              <FiHome size={14} /> Back to Storefront
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#FAF7F0] transition"
            >
              <FiShield size={14} /> Admin Dashboard
            </Link>
            <Link
              href="/account/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-[#FAF7F0] transition"
            >
              <FiUser size={14} /> Account Settings
            </Link>
          </div>

          <div className="border-t border-[#E8E2D5]/60 pt-1">
            <button
              onClick={() => signOut({ callbackUrl: "/account/login" })}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}