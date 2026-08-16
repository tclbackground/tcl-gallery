// app/collections/page.tsx

import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface CollectionItem {
  title: string;
  slug: string;
  description: string;
  image: string;
  count: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    title: "Limited Editions",
    slug: "limited-editions",
    description: "Exclusive, numbered archival fine-art prints signed by featured masters.",
    image: "/images/products/artwork-1.jpg",
    count: "Exclusive Series",
  },
  {
    title: "Moments & Stories",
    slug: "moments-stories",
    description: "Narrative fine-art photography that captures evocative, fleeting human experiences.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "Architecture & Interiors",
    slug: "architecture-interiors",
    description: "Structural forms, spatial geometry, and minimalist architectural aesthetics.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "Abstract & Contemporary",
    slug: "abstract-contemporary",
    description: "Textured modern canvases, bold color exploration, and conceptual visual art.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "Black & White",
    slug: "black-white",
    description: "High-contrast monochrome photography and timeless archival grayscale prints.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "Curated for Interiors",
    slug: "curated-for-interiors",
    description: "Statement large-format artworks tailored for modern living spaces and residences.",
    image: "/images/products/artwork-1.jpg",
    count: "Designer Edit",
  },
  {
    title: "Nature & Landscapes",
    slug: "nature-landscapes",
    description: "Vast wilderness vistas, tranquil coastlines, and pristine organic landscapes.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "People & Portraits",
    slug: "people-portraits",
    description: "Intimate portraiture, expressive character studies, and cultural human narratives.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "Travel & Places",
    slug: "travel-places",
    description: "Atmospheric wanderlust captures, historic streets, and remote global destinations.",
    image: "/images/products/artwork-1.jpg",
    count: "Curated Series",
  },
  {
    title: "Indian Heritage & Culture",
    slug: "indian-heritage-culture",
    description: "Sacred architecture, timeless indigenous traditions, and historical cultural legacy.",
    image: "/images/products/artwork-1.jpg",
    count: "Heritage Edit",
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
            TCL Fine Art Collections
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-5xl text-[#22211B]">
            Curated Art Collections
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            Explore our themed archival print portfolios, handcrafted for art collectors, interior designers, and luxury spaces.
          </p>
        </header>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((item) => (
            <Link
              key={item.slug}
              href={`/collections/${item.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#C4A892]/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE9E2]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 rounded-full bg-[#22211B]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {item.count}
                </span>
              </div>

              {/* Information */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#22211B] transition-colors group-hover:text-[#4D3024]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4D3024] transition-colors group-hover:underline">
                    Explore Collection →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}