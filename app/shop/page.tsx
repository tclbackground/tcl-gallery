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

// ======================================================
// PRODUCT INTERFACE
// ======================================================

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

  // Raw mapped keys fallback from Compass / CSV
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

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  "All Artworks",
  "Photography",
  "Oil Paintings",
  "Sculptures",
  "Ceramics",
  "Digital Art",
];

// ======================================================
// SORT OPTIONS
// ======================================================

const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest Arrivals",
];

// ======================================================
// SHOP PAGE
// ======================================================

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("All Artworks");

  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState("Featured");

  // ====================================================
  // FETCH PRODUCTS FROM API
  // ====================================================

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

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

  // ====================================================
  // FILTER & SORT PRODUCTS
  // ====================================================

  const filteredProducts = products
    .filter((item) => {
      const title = item.title || item.TITLE || "";
      const artist = item.artistName || item.ARTIST || "";
      const category = item.category || item.CATEGORY || "";
      const medium = item.medium || item.MEDIUM || "";

      // -----------------------------------------------
      // CATEGORY FILTER
      // -----------------------------------------------

      const matchesCategory =
        selectedCategory === "All Artworks" ||
        category === "" ||
        category
          .toLowerCase()
          .includes(selectedCategory.toLowerCase()) ||
        medium
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      // -----------------------------------------------
      // SEARCH FILTER
      // -----------------------------------------------

      const matchesSearch =
        title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        artist
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        medium
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.price || a.PRICE || 0;
      const priceB = b.price || b.PRICE || 0;

      if (sortBy === "Price: Low to High") {
        return priceA - priceB;
      }

      if (sortBy === "Price: High to Low") {
        return priceB - priceA;
      }

      return 0;
    });

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#22211B]">

      {/* ==================================================
          HERO HEADER
      ================================================== */}

      <section className="border-b border-[#EAE3D2] bg-[#FAF8F5] py-16 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-3 px-4 text-center">

          <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
            TCL Fine Art & Fine-Art Photography
          </span>

          <h1 className="font-serif text-4xl font-normal text-[#22211B] sm:text-5xl lg:text-6xl">
            The Gallery Shop
          </h1>

          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-[#55534E] sm:text-lg">
            Acquire fine-art photography, museum-grade archival framed
            prints, original oil paintings, and curated sculptures.
          </p>

        </div>
      </section>

      {/* ==================================================
          FILTER & SEARCH TOOLBAR
      ================================================== */}

      <section className="border-b border-[#EAE3D2] bg-white py-4 shadow-sm">

        <div
          className="
            mx-auto
            flex
            max-w-[1700px]
            flex-col
            items-center
            justify-between
            gap-4
            px-4
            sm:px-6
            lg:flex-row
            lg:px-8
          "
        >

          {/* ==================================================
              CATEGORY FILTER
          ================================================== */}

          <div
            className="
              scrollbar-none
              flex
              w-full
              items-center
              gap-2
              overflow-x-auto
              pb-2
              lg:w-auto
              lg:pb-0
            "
          >

            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`
                  cursor-pointer
                  whitespace-nowrap
                  rounded-full
                  px-5
                  py-2
                  text-xs
                  font-semibold
                  transition
                  ${
                    selectedCategory === cat
                      ? "bg-[#7B8F50] text-white shadow-sm"
                      : "bg-[#EFECE6] text-[#555] hover:bg-[#E2DDD3]"
                  }
                `}
              >
                {cat}
              </button>
            ))}

          </div>

          {/* ==================================================
              SEARCH & SORT
          ================================================== */}

          <div
            className="
              flex
              w-full
              flex-wrap
              items-center
              justify-between
              gap-4
              lg:w-auto
              lg:justify-end
            "
          >

            {/* Search */}

            <div
              className="
                flex
                w-full
                items-center
                rounded-full
                border
                border-[#E0D8C8]
                bg-[#FAF8F5]
                px-4
                py-2
                focus-within:border-[#7B8F50]
                sm:w-64
              "
            >

              <input
                type="text"
                placeholder="Search artwork, artist, or medium..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="
                  w-full
                  bg-transparent
                  text-xs
                  text-[#22211B]
                  outline-none
                  placeholder-[#88847C]
                "
              />

              <FiSearch className="shrink-0 text-base text-[#7B8F50]" />

            </div>

            {/* Sort */}

            <div className="flex items-center gap-2">

              <span className="text-xs font-semibold uppercase text-[#88847C]">
                Sort:
              </span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="
                  rounded-lg
                  border
                  border-[#E0D8C8]
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-[#22211B]
                  outline-none
                  focus:border-[#7B8F50]
                "
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

      {/* ==================================================
          PRODUCT GRID
      ================================================== */}

      <section className="py-16">

        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="py-20 text-center">

              <p className="font-serif text-xl text-[#88847C]">
                Loading artworks...
              </p>

            </div>

          ) : filteredProducts.length === 0 ? (

            /* ==================================================
                NO PRODUCTS
            ================================================== */

            <div className="space-y-4 py-20 text-center">

              <p className="font-serif text-2xl text-[#22211B]">
                No artworks found matching your criteria.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Artworks");
                  setSearchQuery("");
                }}
                className="
                  cursor-pointer
                  text-sm
                  font-semibold
                  text-[#7B8F50]
                  underline
                "
              >
                Clear All Filters
              </button>

            </div>

          ) : (

            /* ==================================================
                PRODUCTS
            ================================================== */

            <div
              className="
                grid
                grid-cols-1
                gap-8
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              {filteredProducts.map((art) => {

                // --------------------------------------------
                // PRODUCT DATA
                // --------------------------------------------

                const title =
                  art.title ||
                  art.TITLE ||
                  "Untitled Artwork";

                const artist =
                  art.artistName ||
                  art.ARTIST ||
                  "Joan Karle";

                const category =
                  art.category ||
                  art.CATEGORY ||
                  "Fine Art";

                const size =
                  art.size ||
                  art.SIZE ||
                  "Standard Size";

                const refNo =
                  art.referenceNo ||
                  art["REFERENCE NO"] ||
                  "";

                const price =
                  art.price ||
                  art.PRICE ||
                  0;

                // --------------------------------------------
                // IMAGE RESOLUTION
                // --------------------------------------------

                const rawImage =
                  art.imageUrl ||
                  art.Photo ||
                  art.PHOTO ||
                  art.photo ||
                  "";

                // --------------------------------------------
                // IMAGE FALLBACK
                // --------------------------------------------

                const imageSrc =
                  rawImage &&
                  rawImage.trim() !== ""
                    ? rawImage.trim()
                    : "/placeholder.png";

                return (

                  <Link
                    key={String(art.id)}
                    href={`/shop/${art.id}`}
                    className="
                      group
                      flex
                      cursor-pointer
                      flex-col
                      justify-between
                      overflow-hidden
                      rounded-3xl
                      border
                      border-[#EAE3D2]
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:shadow-xl
                    "
                  >

                    {/* ==================================================
                        CARD CONTENT
                    ================================================== */}

                    <div>

                      {/* ==================================================
                          ARTWORK IMAGE
                      ================================================== */}

                      <div
                        className="
                          relative
                          aspect-[29/20]
                          w-full
                          overflow-hidden
                          bg-[#ECE9E2]
                        "
                      >

                        <Image
                          src={imageSrc}
                          alt={title}
                          fill
                          unoptimized
                          sizes="
                            (max-width: 640px) 100vw,
                            (max-width: 1024px) 50vw,
                            33vw
                          "
                          className="
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />

                        {/* ==============================================
                            CATEGORY BADGE
                        ============================================== */}

                        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">

                          <span
                            className="
                              rounded-full
                              bg-white/90
                              px-3
                              py-1
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-[#7B8F50]
                              backdrop-blur-md
                            "
                          >
                            {category}
                          </span>

                        </div>

                        {/* ==============================================
                            QUICK ACTIONS
                        ============================================== */}

                        <div
                          className="
                            absolute
                            right-4
                            top-4
                            z-10
                            flex
                            flex-col
                            gap-2
                            opacity-0
                            transition
                            duration-300
                            group-hover:opacity-100
                          "
                        >

                          {/* Heart */}

                          <button
                            type="button"
                            aria-label="Add to wishlist"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="
                              cursor-pointer
                              rounded-full
                              bg-white/90
                              p-2
                              text-[#22211B]
                              shadow-md
                              transition
                              hover:bg-[#7B8F50]
                              hover:text-white
                            "
                          >
                            <FiHeart className="text-sm" />
                          </button>

                          {/* View */}

                          <button
                            type="button"
                            aria-label="Quick view"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="
                              cursor-pointer
                              rounded-full
                              bg-white/90
                              p-2
                              text-[#22211B]
                              shadow-md
                              transition
                              hover:bg-[#7B8F50]
                              hover:text-white
                            "
                          >
                            <FiEye className="text-sm" />
                          </button>

                        </div>

                      </div>

                      {/* ==================================================
                          ARTWORK DETAILS
                      ================================================== */}

                      <div className="space-y-3 p-6">

                        {/* Size + Reference */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            text-xs
                            font-semibold
                            text-[#88847C]
                          "
                        >

                          <span>
                            {size}
                          </span>

                          <span className="font-medium text-[#7B8F50]">
                            {refNo}
                          </span>

                        </div>

                        {/* Title */}

                        <h3
                          className="
                            font-serif
                            text-2xl
                            font-bold
                            leading-tight
                            text-[#22211B]
                            transition-colors
                            group-hover:text-[#7B8F50]
                          "
                        >
                          {title}
                        </h3>

                        {/* Artist */}

                        <p
                          className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-[#7B8F50]
                          "
                        >
                          By {artist}
                        </p>

                      </div>

                    </div>

                    {/* ==================================================
                        CARD FOOTER
                    ================================================== */}

                    <div
                      className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        border-t
                        border-gray-100
                        p-6
                        pt-5
                      "
                    >

                      {/* Price */}

                      <div>

                        <span
                          className="
                            block
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-[#88847C]
                          "
                        >
                          Investment
                        </span>

                        <span
                          className="
                            font-serif
                            text-xl
                            font-bold
                            text-[#22211B]
                          "
                        >
                          {price > 0
                            ? `₹${price.toLocaleString("en-IN")}`
                            : "Price on Request"}
                        </span>

                      </div>

                      {/* View Artwork */}

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-[#F8F6F0]
                          px-5
                          py-2.5
                          text-xs
                          font-semibold
                          text-[#22211B]
                          shadow-sm
                          transition-all
                          group-hover:bg-[#7B8F50]
                          group-hover:text-white
                        "
                      >
                        <FiShoppingCart />

                        View Artwork
                      </span>

                    </div>

                  </Link>

                );
              })}

            </div>

          )}

        </div>

      </section>

      {/* ==================================================
          CURATION BANNER
      ================================================== */}

      <section
        className="
          border-t
          border-[#EAE3D2]
          bg-[#22211B]
          py-16
          text-white
        "
      >

        <div
          className="
            mx-auto
            max-w-3xl
            space-y-4
            px-4
            text-center
          "
        >

          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-widest
              text-[#7B8F50]
            "
          >
            Bespoke Art Advisory
          </span>

          <h2
            className="
              font-serif
              text-3xl
              font-normal
              sm:text-4xl
            "
          >
            Need Guidance Framing or Selecting Photography?
          </h2>

          <p
            className="
              text-sm
              font-light
              leading-relaxed
              text-[#B0AAA0]
              sm:text-base
            "
          >
            Our advisors provide complimentary 3D room placement
            rendering, custom archival framing consultations, and
            art acquisition services.
          </p>

          <div className="pt-2">

            <Link
              href="/contact"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#7B8F50]
                px-8
                py-3.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                shadow-md
                transition
                hover:bg-[#687a41]
              "
            >
              Consult an Advisor

              <FiArrowRight />

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}