"use client";

import Image from "next/image";
import HeroContent from "./HeroContent";
import CategoryCards from "./CategoryCards";

export default function Hero() {
  return (
    <div className="relative w-full">
      {/* HERO BANNER SECTION */}
      <section className="relative w-full min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center justify-center overflow-hidden pb-28 sm:pb-36">
        
        {/* Palm Leaves Background */}
        {/* ⚠️ Make sure this filename matches the green leaf image inside public/images (e.g. 1.png, A1.png, or banner-1.png) */}
        <Image
          src="/images/Sunset.jpeg"
          alt="Palm Leaves Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-90"
        />

        {/* Dark Backdrop Overlay for contrast */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Hero Text & Button */}
        <div className="relative z-20 w-full max-w-5xl px-4 pt-6">
          <HeroContent />
        </div>
      </section>

      {/* OVERLAPPING BANNER CARDS */}
      <CategoryCards />
    </div>
  );
}