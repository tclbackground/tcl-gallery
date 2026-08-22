"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type DesignProduct = {
  id: string;
  title: string;
  image: string;
  collection: "jewel-tree" | "living-legacy" | "nature-window";
  price?: number;
};

const products: DesignProduct[] = [
  {
    id: "1",
    title: "Jewel Tree Design 01",
    image: "/images/design-store/jewel-tree-1.jpg",
    collection: "jewel-tree",
    price: 4500,
  },
  {
    id: "2",
    title: "Jewel Tree Design 02",
    image: "/images/design-store/jewel-tree-2.jpg",
    collection: "jewel-tree",
    price: 5500,
  },
  {
    id: "3",
    title: "Living Legacy Design 01",
    image: "/images/design-store/living-legacy-1.jpg",
    collection: "living-legacy",
    price: 6000,
  },
  {
    id: "4",
    title: "Living Legacy Design 02",
    image: "/images/design-store/living-legacy-2.jpg",
    collection: "living-legacy",
    price: 6500,
  },
  {
    id: "5",
    title: "Nature Window Design 01",
    image: "/images/design-store/nature-window-1.jpg",
    collection: "nature-window",
    price: 5000,
  },
  {
    id: "6",
    title: "Nature Window Design 02",
    image: "/images/design-store/nature-window-2.jpg",
    collection: "nature-window",
    price: 5500,
  },
];

const collections = [
  {
    label: "All Products",
    value: "all",
  },
  {
    label: "Jewel Tree",
    value: "jewel-tree",
  },
  {
    label: "Living Legacy",
    value: "living-legacy",
  },
  {
    label: "Nature Window",
    value: "nature-window",
  },
];

export default function DesignStorePage() {
  const [selectedCollection, setSelectedCollection] =
    useState("all");

  const filteredProducts =
    selectedCollection === "all"
      ? products
      : products.filter(
          (product) =>
            product.collection === selectedCollection
        );

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}

      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-gray-500">
            TCL Gallery
          </p>

          <h1 className="text-4xl font-semibold md:text-6xl">
            Design Store
          </h1>

          <p className="mt-5 max-w-2xl text-gray-600">
            Explore our curated collection of distinctive designs
            created to bring art, nature and meaningful stories
            into your space.
          </p>

        </div>
      </section>

      {/* COLLECTION FILTER */}

      <section className="sticky top-0 z-30 border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-5">

          {collections.map((collection) => (
            <button
              key={collection.value}
              onClick={() =>
                setSelectedCollection(collection.value)
              }
              className={`whitespace-nowrap border px-5 py-2.5 text-sm transition ${
                selectedCollection === collection.value
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              {collection.label}
            </button>
          ))}

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* PRODUCT COUNT */}

        <div className="mb-10 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-black">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

        </div>

        {/* PRODUCT GRID */}

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredProducts.map((product) => (

            <Link
              key={product.id}
              href={`/design-store/${product.collection}`}
              className="group"
            >

              {/* IMAGE */}

              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {/* COLLECTION NAME */}

                <div className="absolute left-4 top-4 bg-white px-3 py-2 text-xs uppercase tracking-wider">
                  {product.collection.replace("-", " ")}
                </div>

              </div>

              {/* PRODUCT DETAILS */}

              <div className="pt-5">

                <h2 className="text-lg font-medium">
                  {product.title}
                </h2>

                <p className="mt-1 text-sm capitalize text-gray-500">
                  {product.collection.replace("-", " ")}
                </p>

                {product.price && (
                  <p className="mt-3 text-sm font-medium">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                )}

              </div>

            </Link>

          ))}

        </div>

        {/* EMPTY STATE */}

        {filteredProducts.length === 0 && (

          <div className="py-20 text-center">

            <h2 className="text-2xl font-medium">
              No products found
            </h2>

            <button
              onClick={() =>
                setSelectedCollection("all")
              }
              className="mt-5 border border-black px-6 py-3 text-sm"
            >
              View All Products
            </button>

          </div>

        )}

      </section>

    </main>
  );
}