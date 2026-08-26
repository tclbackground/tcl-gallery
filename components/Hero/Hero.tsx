"use client";

import Link from "next/link";

import {
  ArrowRight,
  Frame,
  Gift,
  Globe2,
  Heart,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Frame,
    title: "FINE ART & PRINTS",
    text: (
      <>
        Paintings, Photographs
        <br />
        & Limited Editions
      </>
    ),
  },
  {
    icon: Sparkles,
    title: "ART & DECOR",
    text: (
      <>
        Handcrafted Pieces
        <br />
        for Every Space
      </>
    ),
  },
  {
    icon: Gift,
    title: "COLLECTIONS",
    text: (
      <>
        Curated with Passion,
        <br />
        Made to Inspire
      </>
    ),
  },
  {
    icon: Globe2,
    title: "GLOBAL INSPIRATION",
    text: (
      <>
        Art From Around the World,
        <br />
        Chosen with Care
      </>
    ),
  },
  {
    icon: Heart,
    title: "MADE TO INSPIRE",
    text: (
      <>
        For Your Home,
        <br />
        Office & Every Space
      </>
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#0e2029]">

      {/* ===================================================== */}
      {/* MOBILE + TABLET HERO */}
      {/* CENTERED PHOTOFRAME FIRST → TEXT → BUTTONS */}
      {/* ===================================================== */}

      <section className="relative w-full overflow-hidden bg-[#071923] lg:hidden">

        {/* PHOTOFRAME AREA */}
        <div className="relative h-[340px] w-full overflow-hidden bg-[#071923] sm:h-[440px] md:h-[540px]">
          <img
            src="/images/banners/banner-1.png"
            alt="TCL Gallery Fine Art"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-[70%_34%]
              scale-[1.30]
              sm:scale-[1.22]
              md:scale-[1.15]
            "
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#071923]/80" />
        </div>

        {/* TEXT BELOW PHOTOFRAME */}
        <div className="relative z-10 w-full bg-[#071923] px-5 pb-12 pt-9 sm:px-8 sm:pb-14 sm:pt-11 md:px-12 md:pb-16 md:pt-12">

          <div className="mx-auto w-full max-w-[760px]">

            {/* TAGLINE */}
            <p className="mb-4 text-[10px] font-bold tracking-[0.16em] text-[#d3972d] sm:text-[11px] md:text-sm">
              CAPTURE. PRESERVE. INSPIRE.
            </p>

            {/* HEADING */}
            <h1 className="font-serif text-[42px] leading-[0.92] tracking-tight text-[#f5f2eb] sm:text-[56px] md:text-[68px]">
              <span className="block">Art That</span>

              <span className="block italic text-[#d49427]">
                Moves Life
              </span>
            </h1>

            {/* DIVIDER */}
            <div className="mt-5 h-px w-14 bg-[#dedbd3] sm:mt-6 sm:w-16 md:w-20" />

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">

              {/* EXPLORE COLLECTIONS */}
              <Link
                href="/fine-art"
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  bg-[#df981c]
                  px-5
                  py-4
                  text-[11px]
                  font-bold
                  tracking-wide
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#eca62a]
                  hover:shadow-xl
                  sm:min-w-[230px]
                  sm:w-auto
                  sm:px-6
                  sm:text-xs
                  md:min-w-[250px]
                "
              >
                EXPLORE COLLECTIONS

                <ArrowRight
                  size={18}
                  className="
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              {/* SHOP NOW */}
              <Link
                href="/shop"
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  border
                  border-[#c98c23]
                  bg-[#0b1c25]/40
                  px-5
                  py-4
                  text-[11px]
                  font-bold
                  tracking-wide
                  text-[#df9d2e]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#d58f1d]
                  hover:text-white
                  sm:min-w-[180px]
                  sm:w-auto
                  sm:px-6
                  sm:text-xs
                "
              >
                SHOP NOW

                <ArrowRight
                  size={18}
                  className="
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

            </div>
          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* DESKTOP HERO */}
      {/* ===================================================== */}

      <section
        className="
          relative
          hidden
          w-full
          overflow-hidden
          bg-[#071923]
          lg:block
        "
      >
        <div
          className="
            relative
            lg:min-h-[620px]
            xl:min-h-[680px]
            2xl:min-h-[760px]
          "
        >

          {/* BACKGROUND IMAGE */}
          <img
            src="/images/banners/banner-1.png"
            alt="TCL Gallery"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />

          {/* DARK OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#06141d]/62
              via-[#06141d]/22
              to-transparent
              xl:from-[#06141d]/55
              xl:via-[#06141d]/15
            "
          />

          {/* BOTTOM GRADIENT */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-28
              bg-gradient-to-t
              from-[#06141d]/80
              via-[#06141d]/30
              to-transparent
              xl:h-24
            "
          />

          {/* HERO CONTENT */}
          <div
            className="
              relative
              z-10
              flex
              w-full
              items-center
              lg:min-h-[620px]
              xl:min-h-[680px]
              2xl:min-h-[760px]
            "
          >
            <div
              className="
                w-full
                lg:px-16
                xl:px-20
                2xl:px-28
              "
            >

              {/* HERO TEXT */}
              <div
                className="
                  lg:max-w-[500px]
                  xl:max-w-[540px]
                  2xl:max-w-[620px]
                  lg:-translate-y-16
                  xl:-translate-y-20
                  2xl:-translate-y-24
                "
              >

                {/* TAGLINE */}
                <p
                  className="
                    mb-4
                    text-base
                    font-bold
                    tracking-[0.1em]
                    text-[#d3972d]
                  "
                >
                  CAPTURE. PRESERVE. INSPIRE.
                </p>

                {/* MAIN HEADING */}
                <h1
                  className="
                    font-serif
                    text-[76px]
                    leading-[0.92]
                    tracking-tight
                    text-[#f5f2eb]
                    xl:text-[92px]
                    2xl:text-[108px]
                  "
                >
                  <span className="block">
                    Art That
                  </span>

                  <span className="block italic text-[#d49427]">
                    Moves Life
                  </span>
                </h1>

                {/* DIVIDER */}
                <div
                  className="
                    mt-8
                    h-px
                    w-20
                    bg-[#dedbd3]
                  "
                />

                {/* BUTTONS */}
                <div
                  className="
                    mt-12
                    flex
                    flex-wrap
                    items-center
                    gap-4
                  "
                >

                  {/* EXPLORE COLLECTIONS */}
                  <Link
                    href="/collections"
                    className="
                      group
                      flex
                      min-w-[230px]
                      items-center
                      justify-center
                      gap-2
                      bg-[#df981c]
                      px-7
                      py-4
                      text-sm
                      font-bold
                      tracking-wide
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#eca62a]
                      hover:shadow-xl
                    "
                  >
                    EXPLORE COLLECTIONS

                    <ArrowRight
                      size={18}
                      className="
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </Link>

                  {/* SHOP NOW */}
                  <Link
                    href="/shop"
                    className="
                      group
                      flex
                      min-w-[170px]
                      items-center
                      justify-center
                      gap-2
                      border
                      border-[#c98c23]
                      bg-[#0b1c25]/40
                      px-7
                      py-4
                      text-sm
                      font-bold
                      tracking-wide
                      text-[#df9d2e]
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#d58f1d]
                      hover:text-white
                    "
                  >
                    SHOP NOW

                    <ArrowRight
                      size={18}
                      className="
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* FEATURES SECTION */}
      {/* ===================================================== */}

      <section className="relative z-20 w-full bg-[#eeece7] text-[#34414e]">

        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1800px]
            grid-cols-1
            divide-y
            divide-[#d6d2cb]
            sm:grid-cols-2
            sm:divide-x
            sm:divide-y-0
            lg:grid-cols-5
          "
        >

          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLast = index === features.length - 1;

            return (
              <div
                key={feature.title}
                className={`
                  group
                  flex
                  min-h-[125px]
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  px-5
                  py-6
                  text-center
                  transition-all
                  duration-300
                  hover:bg-white

                  ${
                    isLast
                      ? "sm:col-span-2 lg:col-span-1"
                      : ""
                  }

                  sm:min-h-[145px]
                  sm:px-6

                  lg:min-h-[135px]
                  lg:flex-row
                  lg:items-center
                  lg:justify-center
                  lg:gap-4
                  lg:px-5

                  xl:gap-5
                  xl:px-8
                `}
              >

                {/* FEATURE ICON */}
                <div className="flex shrink-0 items-center justify-center">
                  <Icon
                    strokeWidth={1.5}
                    className="
                      h-8
                      w-8
                      text-[#a87520]
                      sm:h-9
                      sm:w-9
                      lg:h-10
                      lg:w-10
                    "
                  />
                </div>

                {/* FEATURE TEXT */}
                <div className="max-w-[210px] text-center">

                  <h3
                    className="
                      mb-1
                      text-[11px]
                      font-bold
                      tracking-wide
                      text-[#34414e]
                      sm:text-xs
                      lg:mb-2
                      lg:text-sm
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      text-[11px]
                      leading-5
                      text-[#3d4854]
                      sm:text-xs
                      lg:text-sm
                      lg:leading-6
                    "
                  >
                    {feature.text}
                  </p>

                </div>
              </div>
            );
          })}

        </div>
      </section>

    </main>
  );
}