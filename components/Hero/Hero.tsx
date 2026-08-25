"use client";

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
      {/* ================= HERO SECTION ================= */}

      <section className="relative w-full overflow-hidden bg-[#071923]">
        <div
          className="
            relative
            min-h-[580px]

            sm:min-h-[620px]
            md:min-h-[680px]

            lg:min-h-[620px]

            xl:min-h-[680px]

            2xl:min-h-[760px]
          "
        >
          {/* ================= BACKGROUND IMAGE ================= */}

          <img
            src="/images/banners/banner-1.png"
            alt="TCL Gallery"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover

              object-[58%_center]

              sm:object-[60%_center]
              md:object-[62%_center]

              lg:object-center
              xl:object-center
              2xl:object-center
            "
          />

          {/* ================= DARK OVERLAY ================= */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r

              from-[#06141d]/95
              via-[#06141d]/70
              to-[#06141d]/25

              sm:from-[#06141d]/88
              sm:via-[#06141d]/55

              md:from-[#06141d]/78
              md:via-[#06141d]/40

              lg:from-[#06141d]/62
              lg:via-[#06141d]/22
              lg:to-transparent

              xl:from-[#06141d]/55
              xl:via-[#06141d]/15
              xl:to-transparent
            "
          />

          {/* ================= BOTTOM GRADIENT ================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0

              h-40

              bg-gradient-to-t
              from-[#06141d]/80
              via-[#06141d]/30
              to-transparent

              lg:h-28
              xl:h-24
            "
          />

          {/* ================= HERO CONTENT ================= */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[580px]
              w-full
              items-center

              sm:min-h-[620px]
              md:min-h-[680px]

              lg:min-h-[620px]

              xl:min-h-[680px]

              2xl:min-h-[760px]
            "
          >
            <div
              className="
                w-full

                px-5
                py-12

                sm:px-8
                sm:py-14

                md:px-12
                md:py-16

                lg:px-16
                lg:py-0

                xl:px-20
                2xl:px-28
              "
            >
              {/* ================= HERO TEXT ================= */}

              <div
                className="
                  max-w-[285px]

                  sm:max-w-[370px]
                  md:max-w-[450px]

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
                    text-[9px]
                    font-bold
                    tracking-[0.1em]
                    text-[#d3972d]

                    sm:text-[11px]

                    md:mb-5
                    md:text-sm

                    lg:text-base
                  "
                >
                  CAPTURE. PRESERVE. INSPIRE.
                </p>

                {/* ================= MAIN HEADING ================= */}

                <h1
                  className="
                    font-serif
                    text-[38px]
                    leading-[0.92]
                    tracking-tight
                    text-[#f5f2eb]

                    sm:text-[50px]
                    md:text-[62px]

                    lg:text-[76px]
                    xl:text-[92px]
                    2xl:text-[108px]
                  "
                >
                  <span className="block">Art That</span>

                  <span className="block italic text-[#d49427]">
                    Moves Life
                  </span>
                </h1>

                {/* ================= DIVIDER ================= */}

                <div
                  className="
                    mt-5
                    h-px
                    w-12
                    bg-[#dedbd3]

                    sm:mt-6
                    sm:w-16

                    lg:mt-8
                    lg:w-20
                  "
                />

                {/* ================= HERO BUTTONS ================= */}

                <div
                  className="
                    mt-7
                    flex
                    flex-row
                    flex-wrap
                    items-center
                    gap-2.5

                    sm:mt-9
                    sm:gap-4

                    lg:mt-12
                  "
                >
                  {/* EXPLORE COLLECTIONS */}

                  <button
                    className="
                      group
                      flex
                      w-auto
                      items-center
                      justify-center
                      gap-2

                      bg-[#df981c]

                      px-4
                      py-2.5

                      text-[9px]
                      font-bold
                      tracking-wide
                      text-white

                      shadow-lg
                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:bg-[#eca62a]
                      hover:shadow-xl

                      sm:min-w-[210px]
                      sm:px-5
                      sm:py-3.5
                      sm:text-[10px]

                      md:min-w-[230px]

                      lg:px-7
                      lg:py-4
                      lg:text-sm
                    "
                  >
                    EXPLORE COLLECTIONS

                    <ArrowRight
                      size={15}
                      className="
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:translate-x-1

                        sm:h-[17px]
                        sm:w-[17px]
                      "
                    />
                  </button>

                  {/* SHOP NOW */}

                  <button
                    className="
                      group
                      flex
                      w-auto
                      items-center
                      justify-center
                      gap-2

                      border
                      border-[#c98c23]

                      bg-[#0b1c25]/40

                      px-4
                      py-2.5

                      text-[9px]
                      font-bold
                      tracking-wide
                      text-[#df9d2e]

                      backdrop-blur-sm

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:bg-[#d58f1d]
                      hover:text-white

                      sm:min-w-[160px]
                      sm:px-5
                      sm:py-3.5
                      sm:text-[10px]

                      lg:px-7
                      lg:py-4
                      lg:text-sm
                    "
                  >
                    SHOP NOW

                    <ArrowRight
                      size={15}
                      className="
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:translate-x-1

                        sm:h-[17px]
                        sm:w-[17px]
                      "
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}

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