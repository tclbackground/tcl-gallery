"use client";

import Image from "next/image";

const cards = [
  {
    id: 1,
    src: "/images/banner-1.png",
    title: "Table Tree Plant",
    items: 50,
  },
  {
    id: 2,
    src: "/images/banner-2.png",
    title: "Indoor Plants",
    items: 75,
  },
  {
    id: 3,
    src: "/images/banner-3.png",
    title: "House Plants",
    items: 50,
  },
];

export default function CategoryCards() {
  return (
    <section className="relative z-30 mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 md:-mt-32 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group bg-white p-2.5 sm:p-3 shadow-2xl border border-gray-100 rounded-none transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border border-gray-200">
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Text Below Image */}
            <div className="py-8 px-4 text-center">
              <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-[#2B1D12] group-hover:text-[#7B8F50] transition-colors">
                {card.title}
              </h3>

              <p className="mt-4 text-lg text-gray-600">
                ({card.items} Items)
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}