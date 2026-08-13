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

// Cleaned Navigation Array containing only active, implemented routes
const navigationItems = [
  { title: "Home", href: "/" },
  {
    title: "Shop",
    href: "/shop",
    isMega: true,
    categories: [
      {
        title: "Categories",
        links: [
          { label: "Paintings", href: "/category/painting" },
          { label: "Sculptures", href: "/category/sculpture" },
          { label: "Photography", href: "/category/photography" },
          { label: "All Artworks", href: "/shop" },
        ],
      },
    ],
  },
  { title: "Collections", href: "/category/painting" },
  { title: "Artists", href: "/artist" },
  { title: "Services", href: "/about" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);

  const toggleMobileSubmenu = (title: string) => {
    setActiveMobileSubmenu((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* ================= Navbar ================= */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1800px] items-center justify-between px-4 lg:h-[74px] lg:px-8">
          
          {/* Logo */}
          <Link href="/">
            <Image
              src={logoImg}
              alt="TCL Gallery Logo"
              width={140}
              height={70}
              priority
              className="h-auto w-[80px] sm:w-[95px] lg:w-[120px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 justify-center xl:flex h-full">
            <ul className="flex items-center gap-10 h-full">
              {navigationItems.map((item) => (
                <li key={item.title} className="group relative flex items-center h-full">
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-1 font-serif text-[17px] font-medium text-[#2f2f2f] transition hover:text-[#7B8F50] py-2"
                  >
                    {item.title}
                    {item.isMega && (
                      <FiChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className="absolute left-0 bottom-3 h-[2px] w-0 bg-[#7B8F50] transition-all duration-300 group-hover:w-full" />
                  </Link>

                  {/* Desktop Dropdown */}
                  {item.isMega && (
                    <div className="absolute left-0 top-full w-64 bg-white border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 rounded-b-lg p-5">
                      {item.categories?.map((cat) => (
                        <div key={cat.title} className="space-y-3">
                          <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                            {cat.title}
                          </h3>
                          <ul className="space-y-2">
                            {cat.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="text-[15px] text-gray-600 transition hover:text-[#7B8F50] block hover:pl-1"
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

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="hidden xl:flex items-center rounded-full bg-[#f6f6f6] px-5 h-[48px] w-[270px]">
              <input
                placeholder="Search artwork..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <FiSearch className="text-xl text-gray-500" />
            </div>

            {/* Mobile Search Button */}
            <button className="xl:hidden p-2 text-gray-700">
              <FiSearch className="text-[24px]" />
            </button>

            {/* Cart Button */}
            <Link href="/cart" className="relative p-2 text-gray-700">
              <FiShoppingCart className="text-[26px]" />
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#7B8F50] text-[10px] font-bold text-white">
                0
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="xl:hidden p-2 text-gray-700"
            >
              <FiMenu className="text-[30px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= Overlay ================= */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 xl:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* ================= Mobile Sidebar ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-xs flex-col bg-white transition-transform duration-300 ease-in-out xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Image
            src={logoImg}
            alt="Logo"
            width={100}
            height={50}
            className="object-contain"
          />
          <button onClick={() => setMobileOpen(false)}>
            <FiX className="text-3xl text-gray-700 hover:text-red-500 transition" />
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center rounded-full bg-gray-100 px-4 py-2.5">
            <input
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-800"
            />
            <FiSearch className="text-lg text-gray-500" />
          </div>
        </div>

        {/* Mobile Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.title} className="border-b border-gray-100 last:border-none">
                {item.isMega ? (
                  <div>
                    <button
                      onClick={() => toggleMobileSubmenu(item.title)}
                      className="flex w-full items-center justify-between py-3.5 text-left text-lg font-medium text-gray-800"
                    >
                      <span>{item.title}</span>
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          activeMobileSubmenu === item.title ? "rotate-180 text-[#7B8F50]" : ""
                        }`}
                      />
                    </button>

                    {/* Accordion Submenu */}
                    {activeMobileSubmenu === item.title && (
                      <div className="pl-4 pb-3 space-y-4">
                        {item.categories?.map((cat) => (
                          <div key={cat.title} className="space-y-2">
                            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                              {cat.title}
                            </span>
                            <ul className="space-y-2 pl-2">
                              {cat.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-sm text-gray-600 hover:text-[#7B8F50]"
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
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3.5 text-lg font-medium text-gray-800 hover:text-[#7B8F50]"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Sidebar Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TCL GALLERY
          </p>
        </div>
      </aside>
    </>
  );
}