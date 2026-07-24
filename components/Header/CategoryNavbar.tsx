"use client";

import { useState } from "react";
import MegaMenu from "./MegaMenu";

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

export default function CategoryNavbar() {
  const [showMega, setShowMega] = useState(false);

  return (
    <div
      className="relative bg-white border-b"
      onMouseLeave={() => setShowMega(false)}
    >
      <div className="max-w-[1500px] mx-auto h-14 flex items-center justify-center gap-10">

        {menus.map((menu) => (

          <button
            key={menu}
            onMouseEnter={() => {
              if (menu === "Sofas & Recliners") {
                setShowMega(true);
              }
            }}
            className="hover:text-orange-500 transition-colors"
          >
            {menu}
          </button>

        ))}

      </div>

      {showMega && <MegaMenu />}

    </div>
  );
}