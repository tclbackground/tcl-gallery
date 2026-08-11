"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiAward, FiBookOpen } from "react-icons/fi";

export default function MaisonDeMeraki() {
  const programmes = [
    "Drawing & Fine Sketching",
    "Acrylic & Watercolour Painting",
    "Classical Oil Painting",
    "Portraiture & Landscape Art",
    "Mixed Media & Canvas Work",
  ];

  const highlights = [
    "Professional Mentorship",
    "Creative Studio Atmosphere",
    "Small-Batch Personalization",
    "Kids & Adult Curriculums",
    "Masterclass Workshops",
  ];

  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] py-20 lg:py-28 text-[#22211B]">
      {/* Subtle Ambient Background Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[#7B8F50]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-[#C4A892]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: EDITORIAL CONTENT */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7B8F50]/30 bg-[#7B8F50]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#7B8F50]">
              <FiAward className="text-sm" />
              <span>Maison de Meraki</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] text-[#22211B]">
              Where Passion Meets <br />
              <span className="italic font-light text-[#7B8F50]">Artistic Mastery</span>
            </h2>

            {/* Introductory Text */}
            <p className="font-sans text-base sm:text-lg leading-relaxed text-[#55534E] font-light max-w-2xl">
              Maison de Meraki is the creative learning sanctuary of TCL Gallery. We cultivate an inspiring studio environment where imagination flourishes through structured hands-on technique, creative freedom, and mentorship from practicing artists.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Card 1: Programmes */}
              <div className="rounded-2xl border border-[#EAE3D2] bg-white p-6 shadow-sm hover:border-[#7B8F50]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#7B8F50]">
                    <FiBookOpen size={18} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#22211B]">
                    Our Curriculums
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#55534E]">
                  {programmes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FiCheckCircle className="text-[#7B8F50] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Why Learn */}
              <div className="rounded-2xl border border-[#EAE3D2] bg-white p-6 shadow-sm hover:border-[#7B8F50]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F6F0] text-[#7B8F50]">
                    <FiAward size={18} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#22211B]">
                    Studio Experience
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#55534E]">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FiCheckCircle className="text-[#7B8F50] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/maison-de-meraki"
                className="group inline-flex items-center gap-3 rounded-full bg-[#7B8F50] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#687a41] hover:shadow-lg"
              >
                <span>Explore Studio Programmes</span>
                <FiArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: GALLERY IMAGE FRAME WITH FLOATING BADGE */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              
              {/* Outer Decorative Border Frame */}
              <div className="absolute -inset-3 rounded-3xl border border-[#C4A892]/30 pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#EAE3D2] bg-white shadow-2xl">
                <Image
                  src="/images/7.png"
                  alt="Maison de Meraki Creative Studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>

              {/* Floating Stat/Badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-[#EAE3D2] bg-white/95 p-4 shadow-xl backdrop-blur-md hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B8F50] text-white font-serif font-bold">
                    30+
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#22211B]">Years of Fine Art Heritage</p>
                    <p className="text-[10px] text-[#7B8F50] font-medium uppercase tracking-wider">TCL Mentorship</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}