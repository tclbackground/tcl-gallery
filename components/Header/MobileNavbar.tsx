"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiMenu, FiShoppingCart, FiX } from "react-icons/fi";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Collections", href: "/collections" },
  { title: "Artists", href: "/artists" },
  { title: "Services", href: "/services" },
  { title: "Inspiration", href: "/inspiration" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const logoPath = "/images/Logo.jpg";

  return (
    <header className="xl:hidden w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="h-[74px] sm:h-[90px] px-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logoPath}
            alt="TCL Gallery Logo"
            width={120}
            height={70}
            priority
            className="w-[85px] sm:w-[105px] h-auto object-contain"
          />
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle Search"
          >
            <FiSearch size={28} className="text-[#2f2f2f]" />
          </button>

          {/* Cart Button */}
          <button className="relative" aria-label="Shopping Cart">
            <FiShoppingCart size={30} className="text-[#2f2f2f]" />
            <span
              className="
                absolute
                -top-2
                -right-2
                w-5
                h-5
                rounded-full
                bg-[#7B8F50]
                text-white
                text-[10px]
                flex
                items-center
                justify-center
                font-semibold
              "
            >
              2
            </span>
          </button>

          {/* Hamburger Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? (
              <FiX size={32} className="text-[#2f2f2f]" />
            ) : (
              <FiMenu size={32} className="text-[#2f2f2f]" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <div className="bg-[#f7f7f7] px-5 py-3 border-t border-gray-200">
          <div className="flex items-center bg-white rounded-full h-[42px] px-4 border border-gray-300">
            <input
              type="text"
              placeholder="Search artwork, framing, artists..."
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-gray-400 font-sans"
              autoFocus
            />
            <FiSearch size={18} className="text-[#333]" />
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-Over Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Image
              src={logoPath}
              alt="TCL Gallery Logo"
              width={90}
              height={45}
              className="w-[85px] h-auto object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-800"
              aria-label="Close Drawer"
            >
              <FiX size={26} />
            </button>
          </div>

          {/* Drawer Menu Links */}
          <nav className="p-5">
            <ul className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-[17px] font-serif font-medium text-[#2f2f2f] hover:text-[#7B8F50] transition-colors py-1"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-5 border-t border-gray-100 bg-[#fafafa]">
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-[#7B8F50] text-white py-3 rounded-full text-[14px] font-medium tracking-wider uppercase hover:bg-[#687a41] transition-colors"
          >
            Inquire With Curator
          </Link>
        </div>
      </div>
    </header>
  );
}