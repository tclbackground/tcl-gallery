"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiArrowRight,
} from "react-icons/fi";

import logoImg from "@/public/images/Logo.jpg";

// ======================================================
// SHOP DROPDOWN ITEMS
// ======================================================

const shopItems = [
  {
    title: "Photography",
    href: "/shop/photography",
  },
  {
    title: "Fine Art",
    href: "/shop/fine-art",
  },
];

// ======================================================
// MAIN NAVIGATION
// ======================================================

const navigationItems = [
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
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const shopRef = useRef<HTMLLIElement>(null);

  // ====================================================
  // CLOSE MOBILE MENU
  // ====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileShopOpen(false);
  };

  // ====================================================
  // CLOSE SHOP WHEN CLICKING OUTSIDE
  // ====================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopRef.current &&
        !shopRef.current.contains(event.target as Node)
      ) {
        setShopOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ====================================================
  // ESCAPE KEY
  // ====================================================

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShopOpen(false);
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ====================================================
  // PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  // ====================================================

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <>
      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <header className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white">
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
            <ul className="flex h-full items-center gap-7 2xl:gap-8">

              {/* ==================================================
                  HOME
              ================================================== */}

              <li className="flex h-full items-center">
                <Link
                  href="/"
                  className="
                    group
                    relative
                    flex
                    items-center
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                >
                  Home

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

              {/* ==================================================
                  SHOP DROPDOWN
              ================================================== */}

              <li
                ref={shopRef}
                className="group relative flex h-full items-center"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                {/* SHOP BUTTON */}

                <button
                  type="button"
                  onClick={() => setShopOpen((prev) => !prev)}
                  className="
                    relative
                    flex
                    items-center
                    gap-1.5
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                  aria-expanded={shopOpen}
                  aria-haspopup="true"
                >
                  <span>Shop</span>

                  <FiChevronDown
                    className={`
                      text-[15px]
                      transition-transform
                      duration-300
                      ${
                        shopOpen
                          ? "rotate-180"
                          : "rotate-0"
                      }
                    `}
                  />

                  {/* SHOP UNDERLINE */}

                  <span
                    className={`
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      bg-[#68745A]
                      transition-all
                      duration-300
                      ${
                        shopOpen
                          ? "w-full"
                          : "w-0"
                      }
                    `}
                  />
                </button>

                {/* ==================================================
                    SHOP DROPDOWN
                ================================================== */}

                <div
                  className={`
                    absolute
                    left-1/2
                    top-full
                    z-[9999]
                    w-[270px]
                    -translate-x-1/2
                    pt-3
                    transition-all
                    duration-200
                    ${
                      shopOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }
                  `}
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-[2px]
                      border
                      border-gray-200
                      bg-white
                      shadow-[0_18px_50px_rgba(0,0,0,0.14)]
                    "
                  >
                    {/* DROPDOWN HEADER */}

                    <div
                      className="
                        border-b
                        border-[#68745A]/15
                        bg-[#F3F5EF]
                        px-6
                        py-5
                      "
                    >
                      <p
                        className="
                          font-serif
                          text-[17px]
                          font-semibold
                          text-[#2f2f2f]
                        "
                      >
                        Shop
                      </p>

                      <p
                        className="
                          mt-1
                          text-[11px]
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Explore our artwork
                      </p>
                    </div>

                    {/* SHOP ITEMS */}

                    <div className="py-2">
                      {shopItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setShopOpen(false)}
                          className="
                            group/item
                            flex
                            items-center
                            justify-between
                            px-6
                            py-4
                            font-serif
                            text-[15px]
                            text-[#333333]
                            transition-all
                            duration-200
                            hover:bg-[#F7F8F5]
                            hover:pl-7
                            hover:text-[#68745A]
                          "
                        >
                          <span>{item.title}</span>

                          <FiArrowRight
                            className="
                              translate-x-[-5px]
                              text-[14px]
                              opacity-0
                              transition-all
                              duration-200
                              group-hover/item:translate-x-0
                              group-hover/item:opacity-100
                            "
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              {/* ==================================================
                  ARTISTS
              ================================================== */}

              <li className="flex h-full items-center">
                <Link
                  href="/artist"
                  className="
                    group
                    relative
                    flex
                    items-center
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                >
                  Artists

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

              {/* ==================================================
                  DESIGN STORE
              ================================================== */}

              <li className="flex h-full items-center">
                <Link
                  href="/design-store"
                  className="
                    group
                    relative
                    flex
                    items-center
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                >
                  Design Store

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

              {/* ==================================================
                  BLOG
              ================================================== */}

              <li className="flex h-full items-center">
                <Link
                  href="/blog"
                  className="
                    group
                    relative
                    flex
                    items-center
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                >
                  Blog

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

              {/* ==================================================
                  ABOUT US
              ================================================== */}

              <li className="flex h-full items-center">
                <Link
                  href="/about"
                  className="
                    group
                    relative
                    flex
                    items-center
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                >
                  About Us

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

              {/* ==================================================
                  CONTACT
              ================================================== */}

              <li className="flex h-full items-center">
                <Link
                  href="/contact"
                  className="
                    group
                    relative
                    flex
                    items-center
                    py-2
                    font-serif
                    text-[16px]
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-200
                    hover:text-[#68745A]
                  "
                >
                  Contact

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
                hidden
                p-2
                text-gray-700
                transition
                hover:text-[#68745A]
                sm:block
              "
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-[22px]" />
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
          z-[200]
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
          z-[300]
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
          <ul>

            {/* ==================================================
                HOME
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <Link
                href="/"
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
                Home
              </Link>
            </li>

            {/* ==================================================
                MOBILE SHOP
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <button
                type="button"
                onClick={() =>
                  setMobileShopOpen((prev) => !prev)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-4
                  text-left
                  text-lg
                  font-medium
                  text-gray-800
                  transition
                  hover:text-[#68745A]
                "
                aria-expanded={mobileShopOpen}
              >
                <span>Shop</span>

                <FiChevronDown
                  className={`
                    text-xl
                    transition-transform
                    duration-300
                    ${
                      mobileShopOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* SHOP ITEMS */}

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ${
                    mobileShopOpen
                      ? "max-h-[200px] opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
              >
                <div
                  className="
                    mb-3
                    ml-2
                    border-l-2
                    border-[#68745A]/20
                    pl-4
                  "
                >
                  {shopItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="
                        flex
                        items-center
                        justify-between
                        py-3
                        text-[15px]
                        text-gray-600
                        transition
                        hover:text-[#68745A]
                      "
                    >
                      <span>{item.title}</span>

                      <FiArrowRight className="text-sm" />
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* ==================================================
                ARTISTS
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <Link
                href="/artist"
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
                Artists
              </Link>
            </li>

            {/* ==================================================
                DESIGN STORE
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <Link
                href="/design-store"
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
                Design Store
              </Link>
            </li>

            {/* ==================================================
                BLOG
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <Link
                href="/blog"
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
                Blog
              </Link>
            </li>

            {/* ==================================================
                ABOUT US
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <Link
                href="/about"
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
                About Us
              </Link>
            </li>

            {/* ==================================================
                CONTACT
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
              <Link
                href="/contact"
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
                Contact
              </Link>
            </li>

            {/* ==================================================
                MOBILE CART
            ================================================== */}

            <li className="border-b border-[#68745A]/10">
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

                <span>Cart</span>
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