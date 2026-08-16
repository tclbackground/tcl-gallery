"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

import logoImg from "@/public/images/Logo.jpg";

// ======================================================
// TCL GALLERY NAVIGATION
// ======================================================

const navigationItems = [
  // ====================================================
  // HOME
  // ====================================================
  {
    title: "Home",
    href: "/",
  },

  // ====================================================
  // SHOP
  // ====================================================
  {
    title: "Shop",
    href: "/shop",
    isMega: true,
    categories: [
      {
        title: "Categories",
        links: [
          {
            label: "Paintings",
            href: "/category/painting",
          },
          {
            label: "Sculptures",
            href: "/category/sculpture",
          },
          {
            label: "Photography",
            href: "/category/photography",
          },
          {
            label: "All Artworks",
            href: "/shop",
          },
        ],
      },
    ],
  },

  // ====================================================
  // COLLECTIONS
  // ====================================================
  {
    title: "Collections",
    href: "/",
    isMega: true,
    categories: [
      {
        title: "Explore Collections",
        links: [
          {
            label: "Nature & Landscapes",
            href: "/collections/nature-landscapes",
          },
          {
            label: "Travel & Places",
            href: "/collections/travel-places",
          },
          {
            label: "People & Portraits",
            href: "/collections/people-portraits",
          },
          {
            label: "Abstract & Contemporary",
            href: "/collections/abstract-contemporary",
          },
          {
            label: "Black & White",
            href: "/collections/black-white",
          },
          {
            label: "Architecture & Interiors",
            href: "/collections/architecture-interiors",
          },
          {
            label: "Moments & Stories",
            href: "/collections/moments-stories",
          },
          {
            label: "Indian Heritage & Culture",
            href: "/collections/indian-heritage-culture",
          },
          {
            label: "Curated for Interiors",
            href: "/collections/curated-for-interiors",
          },
          {
            label: "Limited Editions",
            href: "/collections/limited-editions",
          },
          {
            label: "View All Collections",
            href: "/collections",
          },
        ],
      },
    ],
  },

  // ====================================================
  // ARTISTS
  // ====================================================
  {
    title: "Artists",
    href: "/artist",
  },

  // ====================================================
  // DESIGN STORE
  // ====================================================
  {
    title: "Design Store",
    href: "/design-store",
    isMega: true,
    categories: [
      {
        title: "Design Store",
        links: [
          {
            label: "Jewel Tree",
            href: "/design-store/jeweltree",
          },
          {
            label: "Bags",
            href: "/design-store/bags",
          },
          {
            label: "Living Legacy",
            href: "/design-store/living-legacy",
          },
        ],
      },
    ],
  },

  // ====================================================
  // BLOG
  // ====================================================
  {
    title: "Blog",
    href: "/blog",
  },

  // ====================================================
  // ABOUT US
  // ====================================================
  {
    title: "About Us",
    href: "/about",
  },

  // ====================================================
  // CONTACT
  // ====================================================
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

  const [activeMobileSubmenu, setActiveMobileSubmenu] =
    useState<string | null>(null);

  // ====================================================
  // MOBILE SUBMENU TOGGLE
  // ====================================================

  const toggleMobileSubmenu = (title: string) => {
    setActiveMobileSubmenu((prev) =>
      prev === title ? null : title
    );
  };

  // ====================================================
  // CLOSE MOBILE MENU
  // ====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setActiveMobileSubmenu(null);
  };

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

          <Link href="/" onClick={closeMobileMenu}>
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

          <nav className="hidden flex-1 justify-center xl:flex h-full">
            <ul className="flex items-center gap-8 h-full">
              {navigationItems.map((item) => (
                <li
                  key={item.title}
                  className="
                    group
                    relative
                    flex
                    items-center
                    h-full
                  "
                >
                  {/* ==================================================
                      MAIN NAVIGATION LINK
                  ================================================== */}

                  <Link
                    href={item.href}
                    className="
                      relative
                      flex
                      items-center
                      gap-1
                      py-2
                      font-serif
                      text-[16px]
                      font-medium
                      text-[#2f2f2f]
                      transition
                      hover:text-[#7B8F50]
                    "
                  >
                    {item.title}

                    {/* Dropdown Arrow */}

                    {item.isMega && (
                      <FiChevronDown
                        className="
                          text-xs
                          transition-transform
                          duration-200
                          group-hover:rotate-180
                        "
                      />
                    )}

                    {/* Hover Underline */}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        w-0
                        bg-[#7B8F50]
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                    />
                  </Link>

                  {/* ==================================================
                      DESKTOP DROPDOWN
                  ================================================== */}

                  {item.isMega && (
                    <div
                      className="
                        absolute
                        left-1/2
                        top-full
                        w-[380px]
                        -translate-x-1/2
                        rounded-b-lg
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-xl
                        opacity-0
                        invisible
                        transition-all
                        duration-200
                        ease-in-out
                        group-hover:visible
                        group-hover:opacity-100
                        z-50
                      "
                    >
                      {item.categories?.map((cat) => (
                        <div
                          key={cat.title}
                          className="space-y-4"
                        >
                          {/* Dropdown Heading */}

                          <h3
                            className="
                              border-b
                              border-gray-200
                              pb-3
                              font-serif
                              text-sm
                              font-semibold
                              uppercase
                              tracking-[0.15em]
                              text-[#7B8F50]
                            "
                          >
                            {cat.title}
                          </h3>

                          {/* Dropdown Links */}

                          <ul className="space-y-3">
                            {cat.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="
                                    block
                                    text-[15px]
                                    text-gray-600
                                    transition-all
                                    duration-200
                                    hover:translate-x-1
                                    hover:text-[#7B8F50]
                                  "
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* ==================================================
              RIGHT SIDE ICONS
          ================================================== */}

          <div className="flex items-center gap-4">
            {/* ==================================================
                DESKTOP SEARCH
            ================================================== */}

            <div
              className="
                hidden
                h-[48px]
                w-[270px]
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
                  outline-none
                "
              />

              <FiSearch className="text-xl text-gray-500" />
            </div>

            {/* ==================================================
                MOBILE SEARCH
            ================================================== */}

            <button
              type="button"
              className="p-2 text-gray-700 xl:hidden"
              aria-label="Search"
            >
              <FiSearch className="text-[24px]" />
            </button>

            {/* ==================================================
                CART
            ================================================== */}

            <Link
              href="/cart"
              className="relative p-2 text-gray-700"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-[26px]" />

              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#7B8F50]
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                0
              </span>
            </Link>

            {/* ==================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 text-gray-700 xl:hidden"
              aria-label="Open Menu"
            >
              <FiMenu className="text-[30px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

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
      ====================================================== */}

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
            px-5
            py-4
          "
        >
          {/* Logo */}

          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src={logoImg}
              alt="TCL Gallery Logo"
              width={100}
              height={50}
              className="object-contain"
            />
          </Link>

          {/* Close */}

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close Menu"
          >
            <FiX
              className="
                text-3xl
                text-gray-700
                transition
                hover:text-red-500
              "
            />
          </button>
        </div>

        {/* ==================================================
            MOBILE SEARCH
        ================================================== */}

        <div className="border-b border-gray-100 p-4">
          <div
            className="
              flex
              items-center
              rounded-full
              bg-gray-100
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
              "
            />

            <FiSearch className="text-lg text-gray-500" />
          </div>
        </div>

        {/* ==================================================
            MOBILE NAVIGATION
        ================================================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li
                key={item.title}
                className="
                  border-b
                  border-gray-100
                  last:border-none
                "
              >
                {/* ==================================================
                    DROPDOWN MENU
                ================================================== */}

                {item.isMega ? (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        toggleMobileSubmenu(item.title)
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        py-3.5
                        text-left
                        text-lg
                        font-medium
                        text-gray-800
                      "
                    >
                      <span>{item.title}</span>

                      <FiChevronDown
                        className={`
                          transition-transform
                          duration-200
                          ${
                            activeMobileSubmenu ===
                            item.title
                              ? "rotate-180 text-[#7B8F50]"
                              : ""
                          }
                        `}
                      />
                    </button>

                    {/* ==================================================
                        MOBILE ACCORDION
                    ================================================== */}

                    {activeMobileSubmenu === item.title && (
                      <div className="space-y-4 pb-3 pl-4">
                        {item.categories?.map((cat) => (
                          <div
                            key={cat.title}
                            className="space-y-2"
                          >
                            {/* Category Title */}

                            <span
                              className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-gray-400
                              "
                            >
                              {cat.title}
                            </span>

                            {/* Category Links */}

                            <ul className="space-y-2 pl-2">
                              {cat.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className="
                                      block
                                      text-sm
                                      text-gray-600
                                      transition
                                      hover:text-[#7B8F50]
                                    "
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ==================================================
                      NORMAL MOBILE LINK
                  ================================================== */

                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="
                      block
                      py-3.5
                      text-lg
                      font-medium
                      text-gray-800
                      transition
                      hover:text-[#7B8F50]
                    "
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ==================================================
            MOBILE FOOTER
        ================================================== */}

        <div
          className="
            border-t
            bg-gray-50
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