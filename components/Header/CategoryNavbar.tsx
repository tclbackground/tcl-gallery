"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
} from "react-icons/fi";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Features", href: "/features" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Blog", href: "/blog" },
  { title: "About Us", href: "/about" },
];

export default function MainNavbar() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto flex h-[60px] lg:h-[74px] max-w-[1800px] items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={140}
              height={70}
              priority
              className="w-[80px] sm:w-[95px] lg:w-[120px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex flex-1 justify-center">
          <ul className="flex items-center gap-12 2xl:gap-14">
            {menuItems.map((item) => (
              <li key={item.title} className="group relative">
                <Link
                  href={item.href}
                  className="
                    relative
                    text-[18px]
                    2xl:text-[19px]
                    font-serif
                    font-medium
                    text-[#2f2f2f]
                    transition-colors
                    duration-300
                    hover:text-[#7B8F50]
                  "
                >
                  {item.title}

                  <span
                    className="
                      absolute
                      left-0
                      -bottom-2
                      h-[2px]
                      w-0
                      bg-[#7B8F50]
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

        {/* Right Side */}
        <div className="flex items-center gap-4 lg:gap-5">

          {/* Desktop Search */}
          <div className="hidden xl:flex items-center bg-[#f7f7f7] rounded-full w-[270px] h-[48px] px-5">

            <input
              type="text"
              placeholder="Search ..."
              className="
                flex-1
                bg-transparent
                outline-none
                text-[15px]
                placeholder:text-gray-400
              "
            />

            <FiSearch
              size={20}
              className="cursor-pointer text-[#333]"
            />

          </div>

          {/* Mobile Search */}
          <button className="xl:hidden">
            <FiSearch className="text-[28px] text-[#333]" />
          </button>

          {/* Cart */}
          <button className="relative">

            <FiShoppingCart className="text-[30px] lg:text-[28px] text-[#333]" />

            <span
              className="
                absolute
                -top-2
                -right-2
                h-[22px]
                w-[22px]
                rounded-full
                bg-[#7B8F50]
                text-white
                text-[10px]
                font-semibold
                flex
                items-center
                justify-center
              "
            >
              2
            </span>

          </button>

          {/* Menu */}
          <button>
            <FiMenu className="text-[34px] lg:text-[32px] text-[#333]" />
          </button>

        </div>

      </div>
    </header>
  );
}