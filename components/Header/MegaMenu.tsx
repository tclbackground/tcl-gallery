"use client";

import MenuCard from "./MenuCard";
import { megaMenu } from "@/data/megaMenu";

export default function MegaMenu() {
  return (
    <div className="absolute left-0 top-full w-full bg-white border-t shadow-xl z-50">
      <div className="max-w-[1500px] mx-auto flex justify-between px-8 py-6">

        {/* Left Section */}

        <div className="grid grid-cols-4 flex-1">

          {megaMenu.sofa.columns.map((column, index) => (
            <div
              key={column.title}
              className={`px-6 ${
                index !== megaMenu.sofa.columns.length - 1
                  ? "border-r border-gray-200"
                  : ""
              }`}
            >
              <h3 className="text-[15px] font-semibold text-[#222] mb-4">
                {column.title}
              </h3>

              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="text-[13px] leading-6 text-[#555] hover:text-[#F26A2E] cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Right Section */}

        <div className="flex gap-5 ml-10 shrink-0">

          {megaMenu.sofa.banners.map((banner) => (
            <MenuCard
              key={banner.title}
              image={banner.image}
              title={banner.title}
              price={banner.price}
            />
          ))}

        </div>

      </div>
    </div>
  );
}