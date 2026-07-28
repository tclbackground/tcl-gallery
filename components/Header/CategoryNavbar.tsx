"use client";

import { useState } from "react";
import { menuData } from "@/data/megaMenu";
import MegaMenu from "./MegaMenu";

export default function CategoryNavbar() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  return (
    <div
      className="relative bg-white border-b"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 h-16">

        {menuData.map((menu, index) => (
          <button
            key={menu.title}
            onMouseEnter={() => setActiveMenu(index)}
            className="text-sm font-medium hover:text-[#C4A892]"
          >
            {menu.title}
          </button>
        ))}

      </div>

      {activeMenu !== null && (
        <MegaMenu menu={menuData[activeMenu]} />
      )}
    </div>
  );
}