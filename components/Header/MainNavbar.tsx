import Image from "next/image";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";

export default function MainNavbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-[1400px] mx-auto h-20 px-6 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-10">

          {/* Logo */}
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={150}
            height={50}
            priority
          />

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[17px] font-medium">

            <button className="hover:text-[#ef6c35] transition-colors">
              Home Interiors
            </button>

            <button className="hover:text-[#ef6c35] transition-colors">
              Business Furniture
            </button>

            <button className="hover:text-[#ef6c35] transition-colors">
              Repair Services
            </button>

          </nav>

        </div>

        {/* Search */}
        <div className="hidden xl:flex flex-1 max-w-xl mx-10">

          <div className="w-full relative">

            <FiSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />

            <input
              type="text"
              placeholder="Search"
              className="w-full h-12 rounded-full bg-gray-100 pl-14 pr-5 outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>

        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-7 text-2xl">

          <button className="hover:text-[#ef6c35] transition">
            <LuStore />
          </button>

          <button className="hover:text-[#ef6c35] transition">
            <FiUser />
          </button>

          <button className="hover:text-[#ef6c35] transition">
            <FiHeart />
          </button>

          <button className="hover:text-[#ef6c35] transition">
            <FiShoppingCart />
          </button>

        </div>

      </div>
    </header>
  );
}