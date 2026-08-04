"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Tag } from "lucide-react";

const products = [
  {
    id: 1,
    image: "/images/A1.png",
    badge: "On Sale",
    badgeColor: "bg-red-500",
    title: "Golden Sunrise",
    subtitle: "Museum quality fine art print",
    price: "₹18,500",
    oldPrice: "₹24,000",
  },
  {
    id: 2,
    image: "/images/4.png",
    badge: "On Sale",
    badgeColor: "bg-red-500",
    title: "Mountain Silence",
    subtitle: "Limited Edition",
    price: "₹22,000",
    oldPrice: "₹29,000",
  },
  {
    id: 3,
    image: "/images/6.png",
    badge: "New Arrival",
    badgeColor: "bg-cyan-500",
    title: "Blue Horizon",
    subtitle: "Fine Art Photography",
    price: "₹14,500",
  },
];

export default function NewArrivals() {
  return (
    <section className="py-16 md:py-20 bg-[#FBF9F0]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">

          <h2 className="font-heading text-[#22211B] text-4xl md:text-5xl lg:text-6xl">
            New Arrivals
          </h2>

          <Link
            href="/shop"
            className="font-heading text-lg md:text-2xl text-[#22211B] hover:text-[#C4A892] transition"
          >
            Shop all new arrivals →
          </Link>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {products.map((item) => (

            <div
              key={item.id}
              className="group"
            >

              {/* Image */}

              <div className="relative overflow-hidden bg-white">

                {/* Badge */}

                <span
                  className={`absolute top-4 left-4 z-20 flex items-center gap-1 px-3 py-2 text-white text-xs ${item.badgeColor}`}
                >
                  <Tag size={12} />
                  {item.badge}
                </span>

                {/* Wishlist */}

                <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition">

                  <Heart size={18} />

                </button>

                {/* Image */}

                <div className="relative aspect-[4/5] overflow-hidden">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                </div>

              </div>

              {/* Content */}

              <div className="pt-6">

                <h3 className="font-heading text-2xl text-[#22211B] group-hover:text-[#C4A892] transition">

                  {item.title}

                </h3>

                <p className="italic text-[#7C7469] mt-2">

                  {item.subtitle}

                </p>

                <div className="flex items-center gap-3 mt-5">

                  <span className="text-[#0F8A6B] text-xl font-semibold">

                    From {item.price}

                  </span>

                  {item.oldPrice && (

                    <span className="text-gray-400 line-through">

                      {item.oldPrice}

                    </span>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}