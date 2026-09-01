"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";

import logoImg from "@/public/images/Logo.jpg";

// ======================================================
// TCL GALLERY NAVIGATION
// ======================================================

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Shop",
    href: "/shop",
  },
  {
    title: "Collections",
    href: "/collections",
  },
  {
    title: "Artists",
    href: "/artist",
  },
  {
    title: "Design Store",
    href: "/design-store",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

// ======================================================
// MAIN NAVBAR
// ======================================================

export default function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ====================================================
  // CLOSE MOBILE MENU
  // ====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <>
      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div
          className="
            mx-auto
            flex
            h-[60px]
            max-w-[1800px]
            items-center
            justify-between
            px-4
            lg:h-[74px]
            lg:px-8
          "
        >
          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex-shrink-0"
          >
            <Image
              src={logoImg}
              alt="TCL Gallery Logo"
              width={140}
              height={70}
              priority
              className="
                h-auto
                w-[80px]
                sm:w-[95px]
                lg:w-[120px]
              "
            />
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav className="hidden h-full flex-1 justify-center xl:flex">
            <ul className="flex h-full items-center gap-8">
              {navigationItems.map((item) => (
                <li
                  key={item.title}
                  className="flex h-full items-center"
                >
                  <Link
                    href={item.href}
                    className="
                      relative
                      flex
                      items-center
                      py-2
                      font-serif
                      text-[16px]
                      font-medium
                      text-[#2f2f2f]
                      transition
                      duration-200
                      hover:text-[#68745A]
                    "
                  >
                    {item.title}

                    {/* HOVER UNDERLINE */}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        w-0
                        bg-[#68745A]
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* ==================================================
                DESKTOP SEARCH
            ================================================== */}

            <div
              className="
                hidden
                h-[44px]
                w-[250px]
                items-center
                rounded-full
                bg-[#f6f6f6]
                px-5
                xl:flex
              "
            >
              <input
                type="text"
                placeholder="Search artwork..."
                className="
                  flex-1
                  bg-transparent
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                "
              />

              <FiSearch
                className="
                  text-xl
                  text-gray-500
                  transition
                  hover:text-[#68745A]
                "
              />
            </div>

            {/* ==================================================
                MOBILE SEARCH
            ================================================== */}

            <button
              type="button"
              className="
                p-2
                text-gray-700
                transition
                hover:text-[#68745A]
                xl:hidden
              "
              aria-label="Search"
            >
              <FiSearch className="text-[23px]" />
            </button>

            {/* ==================================================
                CART
            ================================================== */}

            <Link
              href="/cart"
              className="
                relative
                flex
                items-center
                justify-center
                p-2
                text-gray-700
                transition
                hover:text-[#68745A]
              "
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-[23px]" />
            </Link>

            {/* ==================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="
                p-2
                text-gray-700
                transition
                hover:text-[#68745A]
                xl:hidden
              "
              aria-label="Open Menu"
              aria-expanded={mobileOpen}
            >
              <FiMenu className="text-[29px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          MOBILE OVERLAY
      ======================================================= */}

      <div
        onClick={closeMobileMenu}
        className={`
          fixed
          inset-0
          z-40
          bg-black/50
          transition-opacity
          duration-300
          xl:hidden
          ${
            mobileOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />

      {/* ======================================================
          MOBILE SIDEBAR
      ======================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          h-full
          w-full
          max-w-xs
          flex-col
          bg-white
          transition-transform
          duration-300
          ease-in-out
          xl:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
        aria-hidden={!mobileOpen}
      >
        {/* ==================================================
            MOBILE HEADER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#68745A]/20
            px-5
            py-4
          "
        >
          {/* LOGO */}

          <Link
            href="/"
            onClick={closeMobileMenu}
          >
            <Image
              src={logoImg}
              alt="TCL Gallery Logo"
              width={100}
              height={50}
              className="object-contain"
            />
          </Link>

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close Menu"
            className="
              text-gray-700
              transition
              hover:text-[#68745A]
            "
          >
            <FiX className="text-3xl" />
          </button>
        </div>

        {/* ==================================================
            MOBILE SEARCH
        ================================================== */}

        <div
          className="
            border-b
            border-[#68745A]/10
            p-4
          "
        >
          <div
            className="
              flex
              items-center
              rounded-full
              bg-[#F3F5EF]
              px-4
              py-2.5
            "
          >
            <input
              type="text"
              placeholder="Search..."
              className="
                flex-1
                bg-transparent
                text-sm
                text-gray-800
                outline-none
                placeholder:text-gray-400
              "
            />

            <FiSearch
              className="
                text-lg
                text-[#68745A]
              "
            />
          </div>
        </div>

        {/* ==================================================
            MOBILE NAVIGATION
        ================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-0">

            {navigationItems.map((item) => (
              <li
                key={item.title}
                className="
                  border-b
                  border-[#68745A]/10
                  last:border-none
                "
              >
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="
                    block
                    py-4
                    text-lg
                    font-medium
                    text-gray-800
                    transition
                    hover:text-[#68745A]
                  "
                >
                  {item.title}
                </Link>
              </li>
            ))}

            {/* MOBILE CART */}

            <li
              className="
                border-b
                border-[#68745A]/10
              "
            >
              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  gap-3
                  py-4
                  text-lg
                  font-medium
                  text-gray-800
                  transition
                  hover:text-[#68745A]
                "
              >
                <FiShoppingCart className="text-xl" />

                <span>
                  Cart
                </span>
              </Link>
            </li>

          </ul>
        </nav>

        {/* ==================================================
            MOBILE FOOTER
        ================================================== */}

        <div
          className="
            border-t
            border-[#68745A]/20
            bg-[#F3F5EF]
            px-6
            py-4
          "
        >
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TCL GALLERY
          </p>
        </div>

      </aside>
    </>
  );
}