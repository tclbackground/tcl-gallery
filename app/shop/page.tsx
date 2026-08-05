"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiChevronDown,
  FiGrid,
  FiCheck,
} from "react-icons/fi";

// Sample Shop Products Data
const productsData = [
  {
    id: "1",
    title: "Ethereal Harmony No. 4",
    artist: "Helena Vance",
    category: "Oil Paintings",
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
    price: 3200,
    dimensions: '40" x 40"',
    image: "/images/products/artwork-4.jpg",
    isOriginal: true,
  },
  {
    id: "5",
    title: "Terra Cotta Vessel Study",
    artist: "Maison de Meraki Collective",
    category: "Ceramics",
    price: 620,
    dimensions: '10" x 8"',
    image: "/images/products/artwork-5.jpg",
    isOriginal: true,
  },
  {
    id: "6",
    title: "Digital Horizon Study II",
    artist: "Kaelen Voss",
    category: "Digital Art",
    price: 1250,
    dimensions: '30" x 45"',
    image: "/images/products/artwork-6.jpg",
    isOriginal: false,
  },
];

const categories = [
  "All Artworks",
  "Oil Paintings",
  "Sculptures",
  "Photography",
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
        item.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOriginal = !onlyOriginals || item.isOriginal;
      return matchesCategory && matchesSearch && matchesOriginal;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#22211B]">
      {/* ================= HERO HEADER ================= */}
      <section className="bg-[#E8DBCA]/40 py-16 lg:py-20 border-b border-[#C4A892]/30">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 text-center max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4D3024]">
            TCL Fine Art Collection
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#22211B] mt-2">
            The Gallery Shop
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#22211B]/80 leading-relaxed">
            Acquire original fine art, gallery-grade prints, and ceramic sculptures curated from resident masters and Maison de Meraki workshop creators.
          </p>
        </div>
      </section>

      {/* ================= FILTER & SEARCH TOOLBAR ================= */}
      <section className="relative z-10 bg-[#FBF9F0] border-b border-[#C4A892]/30 py-5">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-[#4D3024] text-[#FBF9F0]"
                    : "bg-[#E8DBCA]/60 text-[#22211B] hover:bg-[#E8DBCA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Search, Original Checkbox & Sort */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Search Input */}
            <div className="flex items-center rounded-full bg-[#E8DBCA]/40 border border-[#C4A892]/40 px-4 py-2 w-full sm:w-64">
              <input
                type="text"
                placeholder="Search artwork or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#22211B] placeholder-[#22211B]/50 outline-none"
              />
              <FiSearch className="text-[#4D3024] text-base" />
            </div>

            {/* Originals Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#22211B] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOriginals}
                onChange={(e) => setOnlyOriginals(e.target.checked)}
                className="accent-[#4D3024] rounded h-4 w-4"
              />
              Originals Only
            </label>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#22211B]/60 uppercase">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-[#C4A892]/50 bg-[#E8DBCA]/30 px-3 py-2 text-xs font-medium text-[#22211B] outline-none focus:border-[#4D3024]"
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
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8">
          
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-serif text-2xl text-[#22211B]">No artworks found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All Artworks");
                  setSearchQuery("");
                  setOnlyOriginals(false);
                }}
                className="text-sm font-semibold text-[#4D3024] underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((art) => (
                <div
                  key={art.id}
                  className="group rounded-2xl border border-[#C4A892]/40 bg-[#FBF9F0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Artwork Visual Container */}
                    <div className="relative h-80 bg-[#E8DBCA]/40 overflow-hidden">
                      {art.isOriginal && (
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-[#4D3024] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FBF9F0]">
                          Original
                        </span>
                      )}

                      {/* Floating Quick Action Buttons */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button className="rounded-full bg-[#FBF9F0] p-2 text-[#22211B] shadow-md hover:bg-[#4D3024] hover:text-[#FBF9F0] transition">
                          <FiHeart className="text-sm" />
                        </button>
                        <button className="rounded-full bg-[#FBF9F0] p-2 text-[#22211B] shadow-md hover:bg-[#4D3024] hover:text-[#FBF9F0] transition">
                          <FiEye className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Artwork Details */}
                    <div className="p-6 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#C4A892]">
                        <span>{art.category}</span>
                        <span>{art.dimensions}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#22211B] group-hover:text-[#4D3024] transition">
                        {art.title}
                      </h3>

                      <p className="text-xs font-medium text-[#22211B]/70 uppercase tracking-wider">
                        {art.artist}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0 border-t border-[#C4A892]/20 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#22211B]/60 uppercase tracking-widest block">
                        Price
                      </span>
                      <span className="font-serif text-xl font-bold text-[#4D3024]">
                        ${art.price.toLocaleString()}
                      </span>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-5 py-2.5 text-xs font-semibold text-[#FBF9F0] transition hover:bg-[#22211B] shadow-sm">
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= CURATION BANNER ================= */}
      <section className="bg-[#22211B] text-[#FBF9F0] py-16">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C4A892]">
            Bespoke Advisory
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Need Help Selecting Artwork for Your Space?
          </h2>
          <p className="text-[#E8DBCA]/80 text-sm sm:text-base leading-relaxed">
            Our curators provide complimentary virtual placement rendering and personalized private collection advisory for residential and corporate interiors.
          </p>
          <div className="pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#C4A892] px-8 py-3.5 text-sm font-semibold text-[#22211B] hover:bg-[#E8DBCA] transition"
            >
              Consult an Art Advisor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}