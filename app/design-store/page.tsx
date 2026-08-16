"use client";

import Link from "next/link";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

const designStoreCategories = [
  {
    title: "Jeweltree",
    description:
      "Discover thoughtfully designed jewellery that brings together creativity, individuality and timeless elegance.",
    href: "/design-store/jeweltree",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Bags",
    description:
      "Explore distinctive bags created for everyday living, travel and effortless style.",
    href: "/design-store/bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Living Legacy",
    description:
      "A curated selection of meaningful objects and lifestyle pieces designed to become part of your story.",
    href: "/design-store/living-legacy",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function DesignStorePage() {
  return (
    <main className="min-h-screen bg-white text-[#2f2f2f]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#f7f6f2]">
        <div className="mx-auto grid min-h-[520px] max-w-[1800px] items-center lg:grid-cols-2">

          {/* Hero Content */}

          <div className="px-6 py-20 sm:px-10 lg:px-16 xl:px-24">

            <p className="mb-5 font-serif text-sm uppercase tracking-[0.3em] text-[#7B8F50]">
              TCL Gallery
            </p>

            <h1 className="max-w-2xl font-serif text-5xl leading-[1.05] text-[#2f2f2f] sm:text-6xl lg:text-7xl">
              Design Store
            </h1>

            <div className="mt-7 h-[2px] w-16 bg-[#7B8F50]" />

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              A carefully curated world of design, craftsmanship and
              meaningful objects. Discover pieces created to complement
              the way you live, travel and celebrate life.
            </p>

            <Link
              href="#collections"
              className="
                mt-9
                inline-flex
                items-center
                gap-3
                border
                border-[#2f2f2f]
                px-7
                py-3.5
                font-serif
                text-sm
                uppercase
                tracking-[0.12em]
                text-[#2f2f2f]
                transition
                duration-300
                hover:bg-[#2f2f2f]
                hover:text-white
              "
            >
              Explore the Store
              <FiArrowRight />
            </Link>
          </div>

          {/* Hero Image */}

          <div className="relative min-h-[420px] lg:min-h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1800&q=85"
              alt="TCL Gallery Design Store"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />
          </div>

        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">

        <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7B8F50]">
          Curated With Purpose
        </p>

        <h2 className="mt-4 font-serif text-3xl leading-tight text-[#2f2f2f] sm:text-4xl">
          Objects that celebrate everyday life
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600">
          The TCL Gallery Design Store brings together carefully selected
          pieces that reflect creativity, craftsmanship and the joy of
          living beautifully.
        </p>

      </section>

      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <section
        id="collections"
        className="bg-[#faf9f6] px-6 py-20 sm:px-10 lg:px-16"
      >

        <div className="mx-auto max-w-[1500px]">

          {/* Section Heading */}

          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7B8F50]">
                Explore
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#2f2f2f] sm:text-4xl">
                Design Store Collections
              </h2>

            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiShoppingBag />
              <span>Discover the collection</span>
            </div>

          </div>

          {/* Category Cards */}

          <div className="grid gap-7 md:grid-cols-3">

            {designStoreCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="
                  group
                  overflow-hidden
                  bg-white
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                {/* Image */}

                <div className="relative h-[360px] overflow-hidden sm:h-[420px]">

                  <img
                    src={category.image}
                    alt={category.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/60
                      via-black/10
                      to-transparent
                    "
                  />

                  {/* Image Title */}

                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <p className="font-serif text-2xl text-white sm:text-3xl">
                      {category.title}
                    </p>

                    <div className="mt-3 h-[1px] w-10 bg-white transition-all duration-300 group-hover:w-16" />

                  </div>

                </div>

                {/* Card Content */}

                <div className="p-7">

                  <p className="text-sm leading-7 text-gray-600">
                    {category.description}
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                      font-serif
                      text-sm
                      uppercase
                      tracking-[0.1em]
                      text-[#7B8F50]
                    "
                  >
                    Explore
                    <FiArrowRight
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </div>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          PHILOSOPHY SECTION
      ===================================================== */}

      <section className="px-6 py-24 sm:px-10 lg:px-16">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto mb-7 h-[1px] w-12 bg-[#7B8F50]" />

          <blockquote className="font-serif text-3xl leading-relaxed text-[#2f2f2f] sm:text-4xl">
            “Every object carries a story. Choose pieces that become
            part of yours.”
          </blockquote>

          <p className="mt-7 text-sm uppercase tracking-[0.25em] text-gray-400">
            Today • Celebrate Life
          </p>

        </div>

      </section>

      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section className="bg-[#2f2f2f] px-6 py-20 text-center sm:px-10">

        <p className="font-serif text-sm uppercase tracking-[0.3em] text-[#b6c58f]">
          TCL Gallery
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl leading-tight text-white sm:text-4xl">
          Discover something made for your world
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-300">
          Explore our curated design collections and find pieces that
          bring character, creativity and meaning into everyday life.
        </p>

        <Link
          href="/design-store"
          className="
            mt-8
            inline-flex
            items-center
            gap-3
            border
            border-white
            px-7
            py-3.5
            font-serif
            text-sm
            uppercase
            tracking-[0.12em]
            text-white
            transition
            duration-300
            hover:bg-white
            hover:text-[#2f2f2f]
          "
        >
          Explore Design Store
          <FiArrowRight />
        </Link>

      </section>

    </main>
  );
}