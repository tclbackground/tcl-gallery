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
    <main className="relative min-h-screen w-screen max-w-[100vw] overflow-x-hidden bg-[#0e2029]">

      {/* ===================================================== */}
      {/* MOBILE + TABLET HERO */}
      {/* ===================================================== */}

      <section className="relative h-[680px] w-screen max-w-[100vw] overflow-hidden bg-[#071923] lg:hidden">

        {/* BACKGROUND IMAGE */}
        <img
          src="/images/banners/banner-1.png"
          alt="TCL Gallery Fine Art"
          className="
            absolute
            inset-0
            h-full
            w-full
            max-w-none
            object-cover
            object-[68%_center]
            sm:object-[65%_center]
            md:object-[68%_center]
          "
        />

        {/* DARK LEFT OVERLAY */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-[#071923]
            via-[#071923]/90
            to-transparent
          "
        />

        {/* BOTTOM OVERLAY */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-56
            w-full
            bg-gradient-to-t
            from-[#071923]
            via-[#071923]/40
            to-transparent
          "
        />

        {/* MOBILE CONTENT */}
        <div
          className="
            relative
            z-10
            flex
            h-full
            w-full
            min-w-0
            items-center
            px-5
            sm:px-8
            md:px-12
          "
        >
          <div
            className="
              w-full
              min-w-0
              max-w-[310px]
              -translate-y-2
              sm:max-w-[390px]
              md:max-w-[460px]
            "
          >

            {/* TAGLINE */}
            <p
              className="
                mb-4
                text-[10px]
                font-bold
                tracking-[0.16em]
                text-[#d3972d]
                sm:text-xs
                md:text-sm
              "
            >
              CAPTURE. PRESERVE. INSPIRE.
            </p>

            {/* HEADING */}
            <h1
              className="
                font-serif
                text-[42px]
                leading-[0.92]
                tracking-tight
                text-[#f5f2eb]
                sm:text-[58px]
                md:text-[72px]
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
                mt-5
                h-px
                w-14
                bg-[#dedbd3]
                sm:mt-7
                sm:w-16
                md:w-20
              "
            />

            {/* BUTTONS */}
            <div
              className="
                mt-8
                flex
                w-full
                flex-col
                items-stretch
                gap-3
                sm:flex-row
                sm:items-start
                sm:gap-4
              "
            >

              {/* EXPLORE COLLECTIONS */}
              <Link
                href="/shop"
                className="
                  group
                  flex
                  w-full
                  min-w-0
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
                  hover:text-white
                  hover:shadow-xl
                  sm:w-auto
                  sm:min-w-[220px]
                  sm:px-6
                  sm:text-xs
                "
              >
                <span className="whitespace-nowrap text-white">
                  EXPLORE COLLECTIONS
                </span>

                <ArrowRight
                  size={18}
                  className="
                    shrink-0
                    text-white
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
                  min-w-0
                  items-center
                  justify-center
                  gap-2
                  border
                  border-[#c98c23]
                  bg-[#071923]/50
                  px-5
                  py-4
                  text-[11px]
                  font-bold
                  tracking-wide
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#d58f1d]
                  hover:text-white
                  sm:w-auto
                  sm:min-w-[170px]
                  sm:px-6
                  sm:text-xs
                "
              >
                <span className="whitespace-nowrap text-white">
                  SHOP NOW
                </span>

                <ArrowRight
                  size={18}
                  className="
                    shrink-0
                    text-white
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

      <section className="relative hidden w-full max-w-none overflow-hidden bg-[#071923] lg:block">

        <div
          className="
            relative
            w-full
            min-w-0
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
              max-w-none
              object-cover
              object-center
            "
          />

          {/* DARK OVERLAY */}
          <div
            className="
              pointer-events-none
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
              w-full
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
              min-w-0
              items-center
              lg:min-h-[620px]
              xl:min-h-[680px]
              2xl:min-h-[760px]
            "
          >

            <div
              className="
                w-full
                min-w-0
                lg:px-16
                xl:px-20
                2xl:px-28
              "
            >

              <div
                className="
                  w-full
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

                {/* HEADING */}
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
                      hover:text-white
                      hover:shadow-xl
                    "
                  >
                    <span className="text-white">
                      EXPLORE COLLECTIONS
                    </span>

                    <ArrowRight
                      size={18}
                      className="
                        shrink-0
                        text-white
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
                      text-white
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#d58f1d]
                      hover:text-white
                    "
                  >
                    <span className="text-white">
                      SHOP NOW
                    </span>

                    <ArrowRight
                      size={18}
                      className="
                        shrink-0
                        text-white
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

      <section className="relative z-20 w-screen max-w-[100vw] overflow-hidden bg-[#eeece7] text-[#34414e]">

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
                  min-w-0
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