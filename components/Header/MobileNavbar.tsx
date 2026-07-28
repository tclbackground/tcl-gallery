"use client";

import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

const menus = [
  "New Arrivals",
  "Deal Zone",
  "Sofas & Recliners",
  "Living",
  "Bedroom",
  "Dining & Kitchen",
  "Mattresses",
  "Study",
  "Storage Furniture",
  "Lighting & Decor",
  "Furnishing",
];

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="lg:hidden border-y bg-white">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>

          <span className="font-semibold text-gray-800">
            Browse Categories
          </span>

          <div className="w-7" />
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-lg font-bold">Categories</h2>

          <button onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* Menu */}
        <div className="overflow-y-auto h-[calc(100%-72px)]">

          {menus.map((item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between border-b px-5 py-4 text-left hover:bg-gray-50"
            >
              <span>{item}</span>

              <ChevronRight size={18} />
            </button>
          ))}

        </div>
      </div>
    </>
  );
}