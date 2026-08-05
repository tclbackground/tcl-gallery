"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface MenuCardProps {
  image: string;
  title: string;
  description: string;
  button: string;
  href: string;
}

export default function MenuCard({
  image,
  title,
  description,
  button,
  href,
}: MenuCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg">

      {/* Image */}
      <div className="relative h-[320px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6">

        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#7B8F50]">
          Featured Collection
        </p>

        <h2 className="font-serif text-3xl font-semibold text-[#222]">
          {title}
        </h2>

        <p className="mt-3 text-[15px] leading-7 text-gray-600">
          {description}
        </p>

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7B8F50] px-6 py-3 text-white transition hover:bg-black"
        >
          {button}
          <FiArrowRight />
        </Link>

      </div>
    </div>
  );
}