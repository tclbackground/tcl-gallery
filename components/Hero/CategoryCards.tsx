"use client";

import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    id: 1,
    src: "/images/1.png",
    title: "Photography",
    items: 50,
    link: "/shop?category=photography",
  },
  {
    id: 2,
    src: "/images/2.png",
    title: "Fine Art Prints",
    items: 75,
    link: "/shop?category=fine-art-prints",
  },
  {
    id: 3,
    src: "/images/6.png",
    title: "Jeweltree",
    items: 50,
    link: "/shop?category=jeweltree",
  },
];

export default function CategoryCards() {
  return (
    <section className="relative z-30 mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 md:-mt-32 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="group block bg-[#FFFFFF] p-2.5 sm:p-3 shadow-2xl border border-[#E2E8F0] rounded-none transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7FAFC] border border-[#E2E8F0]">
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
              <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-[#002B5B] group-hover:text-[#1F5AA6] transition-colors">
                {card.title}
              </h3>

              <p className="mt-4 text-lg text-[#4A5568]">
                ({card.items} Items)
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}