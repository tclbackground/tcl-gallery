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
      {/* ================= HERO BANNER ================= */}

      <section
        className="
          relative
          h-[560px]
          w-full
          overflow-hidden

          xs:h-[580px]
          sm:h-[600px]
          md:h-[620px]
          lg:h-[620px]
          xl:h-[680px]
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

            object-[60%_center]

            sm:object-[58%_center]
            md:object-center
            lg:object-center

            transition-transform
            duration-700
          "
        />

        {/* ================= MOBILE OVERLAY ================= */}

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-r
            from-[#06141d]/90
            via-[#06141d]/50
            to-[#06141d]/10

            sm:from-[#06141d]/75
            sm:via-[#06141d]/30

            lg:from-[#06141d]/50
            lg:via-[#06141d]/15
            lg:to-transparent
          "
        />

        {/* ================= MOBILE BOTTOM OVERLAY ================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-[1]

            h-32

            bg-gradient-to-t
            from-[#06141d]/60
            to-transparent

            lg:h-24
          "
        />

        {/* ================= HERO CONTENT ================= */}

        <div
          className="
            relative
            z-10
            flex
            h-full
            w-full
            items-center
          "
        >
          <div
            className="
              w-full

              px-5
              pt-4

              sm:px-8
              md:px-12
              lg:px-16
              xl:px-20
            "
          >
            <div
              className="
                max-w-[300px]

                sm:max-w-[380px]
                md:max-w-[450px]
                lg:max-w-[520px]
              "
            >
              {/* SMALL TITLE */}

              <p
                className="
                  mb-4

                  text-[10px]
                  font-bold
                  tracking-[0.08em]
                  text-[#d3972d]

                  sm:text-xs
                  md:mb-5
                  md:text-sm
                  lg:text-base
                "
              >
                CAPTURE. PRESERVE. INSPIRE.
              </p>

              {/* MAIN TITLE */}

              <h1
                className="
                  font-serif
                  leading-[0.92]
                  tracking-tight
                  text-[#f5f2eb]

                  text-[38px]

                  sm:text-[50px]
                  md:text-[62px]
                  lg:text-[80px]
                  xl:text-[92px]
                "
              >
                <span className="block">
                  Art That
                </span>

                <span
                  className="
                    block
                    italic
                    text-[#d49427]
                  "
                >
                  Moves Life
                </span>
              </h1>

              {/* DIVIDER */}

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

              {/* ================= BUTTONS ================= */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3

                  sm:mt-9
                  sm:gap-4

                  lg:mt-12
                "
              >
                {/* EXPLORE */}

                <button
                  className="
                    group
                    flex
                    min-w-[190px]
                    items-center
                    justify-center
                    gap-2

                    bg-[#df981c]

                    px-4
                    py-3

                    text-[10px]
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
                    sm:text-xs

                    md:min-w-[230px]

                    lg:px-7
                    lg:py-4
                    lg:text-sm
                  "
                >
                  EXPLORE COLLECTIONS

                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                {/* SHOP NOW */}

                <button
                  className="
                    group
                    flex
                    min-w-[150px]
                    items-center
                    justify-center
                    gap-2

                    border
                    border-[#c98c23]

                    bg-[#0b1c25]/40

                    px-4
                    py-3

                    text-[10px]
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
                    sm:text-xs

                    lg:px-7
                    lg:py-4
                    lg:text-sm
                  "
                >
                  SHOP NOW

                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}

      <section
        className="
          relative
          z-20
          w-full
          bg-[#eeece7]
          text-[#34414e]
        "
      >
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
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  flex
                  min-h-[105px]
                  items-center
                  gap-4

                  px-5
                  py-5

                  transition-all
                  duration-300

                  hover:bg-white

                  sm:min-h-[115px]
                  sm:px-6

                  lg:min-h-[125px]
                  lg:gap-5
                  lg:px-6

                  xl:px-8
                "
              >
                {/* ICON */}

                <Icon
                  strokeWidth={1.5}
                  className="
                    h-8
                    w-8
                    shrink-0
                    text-[#a87520]

                    sm:h-9
                    sm:w-9

                    lg:h-10
                    lg:w-10
                  "
                />

                {/* CONTENT */}

                <div className="min-w-0">
                  <h3
                    className="
                      mb-1
                      text-[11px]
                      font-bold
                      tracking-wide

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