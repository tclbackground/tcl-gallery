"use client";

import Image from "next/image";
import Link from "next/link";

export default function PichwaiCollection() {
  return (
    <section className="relative h-[620px] w-full overflow-hidden">

      {/* LEFT SIDE IMAGE */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[52%]">
        <Image
          src="/images/products/3.png"
          alt="TCL Gallery collection"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Slight dark overlay */}
        <div className="absolute inset-0 bg-black/[0.04]" />
      </div>

      {/* RIGHT SIDE TEXTURE */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <Image
          src="/images/banners/texture.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        {/* Light overlay - reduced opacity so texture is visible */}
        <div className="absolute inset-0 bg-[#e7e4d9]/65" />
      </div>

      {/* MOBILE BACKGROUND */}
      <div className="absolute inset-0 bg-[#e7e4d9] lg:hidden" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1800px] items-center">

        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[48%_52%]">

          {/* EMPTY LEFT SIDE */}
          <div className="hidden lg:block" />

          {/* RIGHT CONTENT */}
          <div className="relative flex h-full items-center px-8 md:px-16 lg:px-20 xl:px-28">

            {/* IMPORTANT:
                No solid background here.
                This allows texture.png to show through.
            */}

            <div className="w-full max-w-[680px]">

              {/* LABEL */}
              <p className="mb-7 text-[11px] font-semibold tracking-[0.45em] text-[#69716b]">
                TCL GALLERY PRESENTS
              </p>

              {/* TITLE */}
              <h2
                className="
                  font-serif
                  text-[46px]
                  font-normal
                  leading-[1.05]
                  text-[#5c6560]

                  md:text-[54px]
                  lg:text-[58px]
                  xl:text-[64px]
                "
              >
                Where Stories
                <br />
                <span className="italic">Bloom</span>
              </h2>

              {/* DIVIDER */}
              <div className="mt-8 h-px w-24 bg-[#7d857e]/60" />

              {/* DESCRIPTION */}
              <p className="mt-7 max-w-[580px] text-[15px] leading-8 text-[#626b65]">
                Discover the beauty hidden in timeless corners, where
                heritage architecture and nature come together to create
                stories worth preserving.
              </p>

              {/* BUTTON */}
              <Link
                href="/collections"
                className="
                  mt-9
                  inline-flex
                  items-center
                  justify-center
                  bg-[#52655c]
                  px-10
                  py-4
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#3f5048]
                  hover:shadow-xl
                "
              >
                Explore Collection
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}