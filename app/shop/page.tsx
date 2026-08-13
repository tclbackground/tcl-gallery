"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiArrowRight,
} from "react-icons/fi";

interface Product {
  id: string;
  title?: string | null;
  artistName?: string | null;
  category?: string | null;
  medium?: string | null;
  size?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  referenceNo?: string | null;
  // Raw mapped keys fallback from Compass/CSV
  TITLE?: string | null;
  ARTIST?: string | null;
  CATEGORY?: string | null;
  MEDIUM?: string | null;
  SIZE?: string | null;
  PRICE?: number | null;
  Photo?: string | null;
  PHOTO?: string | null;
  photo?: string | null;
  "REFERENCE NO"?: string | null;
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Artworks");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");

  // Fetch live products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter & Sort Logic with lenient fallbacks
  const filteredProducts = products
    .filter((item) => {
      const title = item.title || item.TITLE || "";
      const artist = item.artistName || item.ARTIST || "";
      const category = item.category || item.CATEGORY || "";
      const medium = item.medium || item.MEDIUM || "";

      // Allow "All Artworks" or empty categories to display, or match category substring flexible check
      const matchesCategory =
        selectedCategory === "All Artworks" ||
        category === "" ||
        category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        medium.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medium.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.price || a.PRICE || 0;
      const priceB = b.price || b.PRICE || 0;
      if (sortBy === "Price: Low to High") return priceA - priceB;
      if (sortBy === "Price: High to Low") return priceB - priceA;
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

          {/* Controls: Search & Sort */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center rounded-full bg-[#FAF8F5] border border-[#E0D8C8] px-4 py-2 w-full sm:w-64 focus-within:border-[#7B8F50]">
              <input
                type="text"
                placeholder="Search artwork, artist, or medium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#22211B] placeholder-[#88847C] outline-none"
              />
              <FiSearch className="text-[#7B8F50] text-base shrink-0" />
            </div>

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
          
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-serif text-xl text-[#88847C]">Loading artworks...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-serif text-2xl text-[#22211B]">
                No artworks found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Artworks");
                  setSearchQuery("");
                }}
                className="text-sm font-semibold text-[#7B8F50] underline cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((art) => {
                const title = art.title || art.TITLE || "Untitled Artwork";
                const artist = art.artistName || art.ARTIST || "Joan Karle";
                const category = art.category || art.CATEGORY || "Fine Art";
                const size = art.size || art.SIZE || "Standard Size";
                const refNo = art.referenceNo || art["REFERENCE NO"] || "";
                const price = art.price || art.PRICE || 0;
                
                // 1. DYNAMICALLY RESOLVE IMAGE FROM ALL MAPPED CSV / DB KEYS
                const rawImage =
                  art.imageUrl ||
                  art.Photo ||
                  art.PHOTO ||
                  art.photo ||
                  "";

                // 2. FALLBACK ONLY IF FIELD IS EMPTY IN DB
                const imageSrc =
                  rawImage && rawImage.trim() !== ""
                    ? rawImage.trim()
                    : "/placeholder.png";

                return (
                  <Link
                    key={String(art.id)}
                    href={`/shop/${art.id}`}
                    className="group rounded-3xl border border-[#EAE3D2] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Artwork Visual Container */}
                      <div className="relative h-80 bg-[#ECE9E2] overflow-hidden flex items-center justify-center">
                        <Image
                          src={imageSrc}
                          alt={title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                          <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7B8F50]">
                            {category}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="rounded-full bg-white/90 p-2 text-[#22211B] shadow-md hover:bg-[#7B8F50] hover:text-white transition cursor-pointer"
                          >
                            <FiHeart className="text-sm" />
                          </button>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="rounded-full bg-white/90 p-2 text-[#22211B] shadow-md hover:bg-[#7B8F50] hover:text-white transition cursor-pointer"
                          >
                            <FiEye className="text-sm" />
                          </button>
                        </div>
                      </div>

                      {/* Artwork Details */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#88847C]">
                          <span>{size}</span>
                          <span className="text-[#7B8F50] font-medium">{refNo}</span>
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-[#22211B] group-hover:text-[#7B8F50] transition-colors leading-tight">
                          {title}
                        </h3>

                        <p className="text-xs font-bold text-[#7B8F50] uppercase tracking-wider">
                          By {artist}
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
                          {price > 0 ? `$${price.toLocaleString()}` : "Price on Request"}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F6F0] px-5 py-2.5 text-xs font-semibold text-[#22211B] group-hover:bg-[#7B8F50] group-hover:text-white transition-all shadow-sm">
                        <FiShoppingCart /> View Artwork
                      </span>
                    </div>
                  </Link>
                );
              })}
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