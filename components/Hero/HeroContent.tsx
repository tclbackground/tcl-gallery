"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      {/* Small Heading */}
      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">
        Spring House
      </h3>

      {/* Main Heading */}
      <h1
        className="
          mt-3
          font-serif
          font-normal
          text-white
          leading-tight

          text-5xl
          sm:text-6xl
          md:text-7xl
          lg:text-8xl
        "
      >
      A Radiant Horizon
      </h1>

      {/* Subtitle */}
      <p
        className="
          mt-6
          text-sm
          sm:text-base
          md:text-lg
          text-gray-200
          tracking-wide
        "
      >
      Transforming Everyday Moments into Lasting Memories.
      </p>

      {/* Button */}
      <Link
        href="/shop"
        className="
          mt-8
          inline-flex
          items-center
          gap-3

          bg-white
          text-black

          px-8
          py-4

          text-base
          font-medium

          shadow-xl

          transition-all
          duration-300

          hover:bg-[#7B8F50]
          hover:text-white
        "
      >
        <span>Shop Now</span>
        <FiArrowRight className="text-lg" />
      </Link>
    </div>
  );
}