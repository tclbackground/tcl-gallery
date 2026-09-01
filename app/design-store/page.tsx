"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";

type Product = {
  id: string;
  title: string;
  image: string;
  collection: string;
};

const designStoreCategories = [
  {
    title: "Jewel Tree",
    slug: "jewel-tree",
    description:
      "Discover thoughtfully designed pieces inspired by nature, creativity and timeless beauty.",
    href: "/design-store/jewel-tree",
    image: "/images/products/6.png",
  },
  {
    title: "Living Legacy",
    slug: "living-legacy",
    description:
      "Explore meaningful creations designed to become part of your home, life and story.",
    href: "/design-store/living-legacy",
    image:
      "/images/livinglegacy/living-legacy.jpeg",
  },
  {
    title: "Nature Window",
    slug: "nature-window",
    description:
      "Discover creations inspired by the beauty and character of nature.",
    href: "/design-store/nature-window",
    image:
      "/images/nature-window/forest-canopy.jpeg",
  },
];

const products: Product[] = [
  {
    id: "1",
    title: "Golden Tree",
    image: "/images/products/6.png",
    collection: "jewel-tree",
  },
  {
    id: "2",
    title: "Tree of Life",
    image: "/images/jeweltree/jewel-tree-1.jpeg",
    collection: "jewel-tree",
  },
  {
    id: "3",
    title: "Nature Inspired",
    image: "/images/jeweltree/jewel-tree-2.jpeg",
    collection: "jewel-tree",
  },
  {
    id: "4",
    title: "Legacy Vase",
    image: "/images/jeweltree/jewel-tree-3.jpeg",
    collection: "living-legacy",
  },
  {
    id: "5",
    title: "Living Object",
    image: "/images/livinglegacy/living-legacy.jpeg",
    collection: "living-legacy",
  },
  {
    id: "6",
    title: "Timeless Living",
    image: "/images/livinglegacy/living-legacy.jpeg",
    collection: "living-legacy",
  },
  {
    id: "7",
    title: "Forest Window",
    image: "/images/nature-window/forest-canopy.jpeg",
    collection: "nature-window",
  },
  {
    id: "8",
    title: "Mountain View",
    image: "/images/nature-window/forest-canopy-2.jpeg",
    collection: "nature-window",
  },
  {
    id: "9",
    title: "Green Escape",
    image: "/images/nature-window/forest-canopy-2.jpeg",
    collection: "nature-window",
  },
];

export default function DesignStorePage() {
  return (
    <main className="min-h-screen bg-white text-[#2f2f2f]">

      {/* HERO */}

      <section className="bg-[#f7f6f2]">
        <div className="mx-auto grid min-h-[520px] max-w-[1800px] lg:grid-cols-2">

          {/* HERO CONTENT */}

          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
            <div>
              <p className="mb-5 font-serif text-sm uppercase tracking-[0.3em] text-[#7B8F50]">
                TCL Gallery
              </p>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl">
                Design Store
              </h1>

              <div className="mt-7 h-[2px] w-16 bg-[#7B8F50]" />

              <p className="mt-7 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                Art inspired by life, crafted with heart and soul.
                Every piece is made to bring creativity and meaning
                into everyday spaces.
              </p>

              <Link
                href="#collections"
                className="mt-9 inline-flex items-center gap-3 border border-[#2f2f2f] px-7 py-3.5 text-sm uppercase tracking-[0.12em] transition hover:bg-[#2f2f2f] hover:text-white"
              >
                Explore Collections
                <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* HERO IMAGE */}

          <div className="relative min-h-[420px] lg:min-h-[520px]">
            <img
              src="/images/products/6.png"
              alt="Design Store"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

        </div>
      </section>


      {/* COLLECTION CARDS */}

      <section
        id="collections"
        className="bg-[#faf9f6] px-6 py-20 sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-[1500px]">

          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7B8F50]">
                Explore
              </p>

              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Design Store Collections
              </h2>
            </div>

            <FiShoppingBag className="text-xl text-[#7B8F50]" />
          </div>


          <div className="grid gap-7 md:grid-cols-3">

            {designStoreCategories.map((category) => (

              <Link
                key={category.slug}
                href={`#${category.slug}`}
                className="group overflow-hidden bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative h-[360px] overflow-hidden">

                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 p-7">
                    <h3 className="font-serif text-3xl text-white">
                      {category.title}
                    </h3>
                  </div>

                </div>


                <div className="p-7">

                  <p className="text-sm leading-7 text-gray-600">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-[#7B8F50]">
                    View Products
                    <FiArrowRight />
                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>
      </section>


      {/* ALL PRODUCTS BY COLLECTION */}

      <section className="px-6 py-24 sm:px-10 lg:px-16">

        <div className="mx-auto max-w-[1500px]">

          <div className="mb-16 text-center">

            <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7B8F50]">
              The Collection
            </p>

            <h2 className="mt-4 font-serif text-4xl">
              Explore All Products
            </h2>

          </div>


          {/* LOOP THROUGH COLLECTIONS */}

          {designStoreCategories.map((category) => {

            const collectionProducts = products.filter(
              (product) =>
                product.collection === category.slug
            );

            return (

              <section
                key={category.slug}
                id={category.slug}
                className="mb-24 scroll-mt-24"
              >

                {/* COLLECTION HEADING */}

                <div className="mb-10 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end">

                  <div>

                    <p className="text-sm uppercase tracking-[0.2em] text-[#7B8F50]">
                      Collection
                    </p>

                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                      {category.title}
                    </h2>

                  </div>

                  <Link
                    href={category.href}
                    className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#7B8F50]"
                  >
                    View All
                    <FiArrowRight />
                  </Link>

                </div>


                {/* PRODUCTS */}

                <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                  {collectionProducts.map((product) => (

                    <div
                      key={product.id}
                      className="group block"
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">

                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        {/* ENQUIRE NOW OVERLAY */}

                        <Link
                          href="/contact"
                          className="absolute inset-x-4 bottom-4 translate-y-12 bg-white py-3 text-center text-sm uppercase tracking-[0.12em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#7B8F50] hover:text-white"
                        >
                          Enquire Now
                        </Link>

                      </div>


                      {/* PRODUCT INFO */}

                      <div className="pt-5">

                        <h3 className="font-serif text-xl">
                          {product.title}
                        </h3>

                        {/* ENQUIRE NOW */}

                        <Link
                          href="/contact"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.1em] text-[#7B8F50] transition hover:text-[#2f2f2f]"
                        >
                          Enquire Now
                          <FiArrowRight />
                        </Link>

                      </div>

                    </div>

                  ))}

                </div>

              </section>

            );
          })}

        </div>

      </section>

    </main>
  );
}