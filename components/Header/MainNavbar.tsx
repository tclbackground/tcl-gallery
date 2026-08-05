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

export default function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ================= Navbar ================= */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1800px] items-center justify-between px-4 lg:h-[74px] lg:px-8">

          {/* Logo */}
          <Link href="/">
            <Image
              src={logoImg}
              alt="Hamadryad Logo"
              width={140}
              height={70}
              priority
              className="h-auto w-[80px] sm:w-[95px] lg:w-[120px]"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden flex-1 justify-center xl:flex">
            <ul className="flex items-center gap-12">
              {menuItems.map((item) => (
                <li key={item.title} className="group relative">
                  <Link
                    href={item.href}
                    className="relative font-serif text-[18px] font-medium text-[#2f2f2f] transition hover:text-[#7B8F50]"
                  >
                    {item.title}

                    <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-[#7B8F50] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Desktop Search */}
            <div className="hidden xl:flex items-center rounded-full bg-[#f6f6f6] px-5 h-[48px] w-[270px]">
              <input
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none"
              />
              <FiSearch className="text-xl text-gray-500" />
            </div>

            {/* Mobile Search */}
            <button className="xl:hidden">
              <FiSearch className="text-[28px]" />
            </button>

            {/* Cart */}
            <button className="relative">
              <FiShoppingCart className="text-[30px]" />

              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7B8F50] text-[10px] text-white">
                2
              </span>
            </button>

            {/* Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="xl:hidden"
            >
              <FiMenu className="text-[34px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= Overlay ================= */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 xl:hidden ${
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ================= Mobile Sidebar ================= */}
      <aside
        className={`fixed inset-0 z-50 flex h-screen w-screen flex-col bg-white transition-transform duration-500 ease-in-out xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-5">

          <Image
            src={logoImg}
            alt="Logo"
            width={110}
            height={60}
            className="object-contain"
          />

          <button onClick={() => setMobileOpen(false)}>
            <FiX className="text-4xl text-gray-700 hover:text-red-500 transition" />
          </button>
        </div>

        {/* Search */}
        <div className="p-5">
          <div className="flex items-center rounded-full border border-gray-300 px-5 py-3">
            <input
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-lg"
            />
            <FiSearch className="text-2xl text-gray-500" />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-gray-100 px-6 py-5 text-[20px] font-medium text-gray-800 transition-all duration-300 hover:bg-[#f8f8f8] hover:pl-8 hover:text-[#7B8F50]"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-5">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TCL GALLERY
          </p>
        </div>
      </aside>
    </>
  );
}