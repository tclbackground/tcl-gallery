"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

// Sample Shop Products Data
const productsData = [
  {
    id: "1",
    title: "Ethereal Harmony No. 4",
    artist: "Helena Vance",
    category: "Photography",
    frameType: "Museum Archival Frame",
    price: 2400,
    dimensions: '36" x 48"',
    image: "/images/products/artwork-1.jpg",
    isOriginal: true,
  },
  {
    id: "2",
    title: "Monolith in Bronze",
    artist: "Marcus Vance",
    category: "Sculptures",
    frameType: "Custom Pedestal Mount",
    price: 4100,
    dimensions: '18" x 12" x 12"',
    image: "/images/products/artwork-2.jpg",
    isOriginal: true,
  },
  {
    id: "3",
    title: "Solitude in Dawn",
    artist: "Aria Chen",
    category: "Photography",
    frameType: "Custom Handcrafted Wood",
    price: 850,
    dimensions: '24" x 36"',
    image: "/images/products/artwork-3.jpg",
    isOriginal: false,
  },
  {
    id: "4",
    title: "Architectural Echoes",
    artist: "Elena Rostova",
    category: "Oil Paintings",
    frameType: "Gold Leaf Gallery Frame",
    price: 3200,
    dimensions: '40" x 40"',
    image: "/images/products/artwork-4.jpg",
    isOriginal: true,
  },
  {
    id: "5",
    title: "Serenade of Shadows",
    artist: "Prasanna Chinmayi",
    category: "Photography",
    frameType: "Floating Gallery Frame",
    price: 1450,
    dimensions: '30" x 45"',
    image: "/images/products/artwork-5.jpg",
    isOriginal: true,
  },
  {
    id: "6",
    title: "Digital Horizon Study II",
    artist: "Kaelen Voss",
    category: "Digital Art",
    frameType: "Black Gallery Box Frame",
    price: 1250,
    dimensions: '30" x 45"',
    image: "/images/products/artwork-6.jpg",
    isOriginal: false,
  },
];

const categories = [
  "All Artworks",
  "Photography",
  "Oil Paintings",
  "Sculptures",
  "Ceramics",
  "Digital Art",
];

const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest Arrivals",
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Artworks");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [onlyOriginals, setOnlyOriginals] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = productsData
    .filter((item) => {
      const matchesCategory =
        selectedCategory === "All Artworks" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.frameType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOriginal = !onlyOriginals || item.isOriginal;
      return matchesCategory && matchesSearch && matchesOriginal;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#22211B]">
      {/* ================= HERO HEADER ================= */}
      <section className="bg-[#FAF8F5] py-16 lg:py-20 border-b border-[#EAE3D2]">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
            TCL Fine Art & Fine-Art Photography
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#22211B]">
            The Gallery Shop
          </h1>
          <p className="text-base sm:text-lg text-[#55534E] font-light leading-relaxed max-w-2xl mx-auto">
            Acquire fine-art photography, museum-grade archival framed prints, original oil paintings, and curated sculptures.
          </p>
        </div>
      </section>

      {/* ================= FILTER & SEARCH TOOLBAR ================= */}
      <section className="bg-white border-b border-[#EAE3D2] py-4 shadow-sm">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#7B8F50] text-white shadow-sm"
                    : "bg-[#EFECE6] text-[#555] hover:bg-[#E2DDD3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Search, Original Checkbox & Sort */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Search Input */}
            <div className="flex items-center rounded-full bg-[#FAF8F5] border border-[#E0D8C8] px-4 py-2 w-full sm:w-64 focus-within:border-[#7B8F50]">
              <input
                type="text"
                placeholder="Search artwork, artist, or frame..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#22211B] placeholder-[#88847C] outline-none"
              />
              <FiSearch className="text-[#7B8F50] text-base shrink-0" />
            </div>

            {/* Originals Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#22211B] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOriginals}
                onChange={(e) => setOnlyOriginals(e.target.checked)}
                className="accent-[#7B8F50] rounded h-4 w-4 cursor-pointer"
              />
              Originals Only
            </label>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#88847C] uppercase">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-[#E0D8C8] bg-white px-3 py-2 text-xs font-medium text-[#22211B] outline-none focus:border-[#7B8F50]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section className="py-16">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-serif text-2xl text-[#22211B]">
                No artworks found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Artworks");
                  setSearchQuery("");
                  setOnlyOriginals(false);
                }}
                className="text-sm font-semibold text-[#7B8F50] underline cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((art) => (
                <Link
                  key={art.id}
                  href={`/shop/${art.id}`}
                  className="group rounded-3xl border border-[#EAE3D2] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Artwork Visual Container */}
                    <div className="relative h-80 bg-[#ECE9E2] overflow-hidden">
                      {art.image && (
                        <Image
                          src={art.image}
                          alt={art.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Original / Photography Badge */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                        {art.isOriginal && (
                          <span className="rounded-full bg-[#22211B]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            Original Work
                          </span>
                        )}
                        <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7B8F50]">
                          {art.category}
                        </span>
                      </div>

                      {/* Floating Quick Actions */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="rounded-full bg-white/90 p-2 text-[#22211B] shadow-md hover:bg-[#7B8F50] hover:text-white transition cursor-pointer"
                        >
                          <FiHeart className="text-sm" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="rounded-full bg-white/90 p-2 text-[#22211B] shadow-md hover:bg-[#7B8F50] hover:text-white transition cursor-pointer"
                        >
                          <FiEye className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Artwork Details */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#88847C]">
                        <span>{art.dimensions}</span>
                        <span className="text-[#7B8F50] font-medium">{art.frameType}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#22211B] group-hover:text-[#7B8F50] transition-colors leading-tight">
                        {art.title}
                      </h3>

                      <p className="text-xs font-bold text-[#7B8F50] uppercase tracking-wider">
                        By {art.artist}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#88847C] uppercase tracking-widest block font-bold">
                        Investment
                      </span>
                      <span className="font-serif text-xl font-bold text-[#22211B]">
                        ${art.price.toLocaleString()}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F6F0] px-5 py-2.5 text-xs font-semibold text-[#22211B] group-hover:bg-[#7B8F50] group-hover:text-white transition-all shadow-sm">
                      <FiShoppingCart /> View Artwork
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= CURATION BANNER ================= */}
      <section className="bg-[#22211B] text-white py-16 border-t border-[#EAE3D2]">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
            Bespoke Art Advisory
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal">
            Need Guidance Framing or Selecting Photography?
          </h2>
          <p className="text-[#B0AAA0] text-sm sm:text-base font-light leading-relaxed">
            Our advisors provide complimentary 3D room placement rendering, custom archival framing consultations, and art acquisition services.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#7B8F50] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#687a41] transition shadow-md"
            >
              Consult an Advisor <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}