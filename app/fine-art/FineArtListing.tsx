"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type FineArt = {
  id: string;

  slNo: number;

  category: string;

  artistName: string;

  itemRefNo: string;

  title: string;

  image1: string;

  image2: string;

  image3: string;

  paintingType: string;

  withFrame: string;
};

type Props = {
  artworks: FineArt[];
};

const categories = [
  "All Artworks",
  "Photography",
  "Oil Paintings",
  "Sculptures",
  "Ceramics",
  "Digital Art",
];

export default function FineArtListing({
  artworks,
}: Props) {
  const [activeCategory, setActiveCategory] =
    useState("All Artworks");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortOption, setSortOption] =
    useState("Featured");

  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    if (
      activeCategory !== "All Artworks"
    ) {
      result = result.filter(
        (artwork) =>
          artwork.category
            ?.toLowerCase()
            .includes(
              activeCategory
                .toLowerCase()
                .replace(" paintings", "")
                .replace(" artworks", "")
            )
      );
    }

    if (searchTerm.trim()) {
      const search =
        searchTerm.toLowerCase();

      result = result.filter(
        (artwork) =>
          artwork.title
            .toLowerCase()
            .includes(search) ||
          artwork.artistName
            .toLowerCase()
            .includes(search) ||
          artwork.paintingType
            .toLowerCase()
            .includes(search) ||
          artwork.itemRefNo
            .toLowerCase()
            .includes(search)
      );
    }

    if (sortOption === "Title A-Z") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortOption === "Title Z-A") {
      result.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [
    artworks,
    activeCategory,
    searchTerm,
    sortOption,
  ]);

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#29303a]">

      {/* TOP FILTER BAR */}

      <section className="border-b border-[#d9d5cb] bg-[#f7f6f2]">

        <div className="mx-auto flex max-w-[1920px] flex-col gap-5 px-6 py-5 xl:flex-row xl:items-center xl:justify-between xl:px-8">

          {/* CATEGORY BUTTONS */}

          <div className="flex gap-2 overflow-x-auto pb-1">

            {categories.map(
              (category) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`whitespace-nowrap rounded-full px-7 py-3 text-sm font-medium transition ${
                    activeCategory ===
                    category
                      ? "bg-[#6f7b4b] text-white shadow-sm"
                      : "bg-[#e9e7e1] text-[#4c535c] hover:bg-[#dedbd2]"
                  }`}
                >
                  {category}
                </button>
              )
            )}

          </div>


          {/* SEARCH AND SORT */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={19}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6f7b4b]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search artwork, artist, or medium..."
                className="h-12 w-full rounded-full border border-[#d9d5cb] bg-white pl-12 pr-5 text-sm outline-none transition placeholder:text-[#8a8d90] focus:border-[#6f7b4b] sm:w-[320px]"
              />

            </div>


            {/* SORT */}

            <div className="flex items-center gap-3">

              <span className="text-xs font-semibold uppercase tracking-wide text-[#6b7076]">

                Sort:

              </span>

              <div className="relative">

                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(
                      event.target.value
                    )
                  }
                  className="h-12 min-w-[180px] appearance-none rounded-xl border border-[#d9d5cb] bg-white px-5 pr-10 text-sm font-medium outline-none focus:border-[#6f7b4b]"
                >
                  <option>
                    Featured
                  </option>

                  <option>
                    Title A-Z
                  </option>

                  <option>
                    Title Z-A
                  </option>

                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ARTWORK GRID */}

      <section className="mx-auto max-w-[1920px] px-6 py-16 xl:px-8">

        {filteredArtworks.length === 0 ? (

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <p className="text-2xl text-[#29303a]">

                No artworks found

              </p>

              <p className="mt-3 text-sm text-[#7c8085]">

                Try another category or search term.

              </p>

            </div>

          </div>

        ) : (

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

            {filteredArtworks.map(
              (artwork) => {

                const image =
                  artwork.image1;

                return (
                  <Link
                    href={`/fine-art/${artwork.slNo}`}
                    key={artwork.id}
                    className="group overflow-hidden rounded-[30px] border border-[#d9d5cb] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* IMAGE AREA */}

                    <div className="relative aspect-[1.28/1] overflow-hidden bg-[#e7e4dc]">

                      {/* IMAGE */}

                      {image ? (

                        <Image
                          src={image}
                          alt={
                            artwork.title
                          }
                          fill
                          unoptimized
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center text-sm text-[#888b8c]">

                          Artwork Image

                        </div>

                      )}


                      {/* FINE ART BADGE */}

                      <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#6f7b4b]">

                        Fine Art

                      </div>

                    </div>


                    {/* CARD CONTENT */}

                    <div className="p-7">

                      {/* TOP INFO */}

                      <div className="flex items-center justify-between gap-4 text-sm">

                        <span className="text-[#6f747b]">

                          {artwork.paintingType ||
                            "Original Artwork"}

                        </span>

                        <span className="font-medium uppercase tracking-wide text-[#6f7b4b]">

                          {artwork.itemRefNo}

                        </span>

                      </div>


                      {/* TITLE */}

                    {/* TITLE */}

<h1 className="mt-5 text-[18px] font-medium leading-tight tracking-[-0.02em] text-[#29303a] transition group-hover:text-[#6f7b4b] sm:text-[24px]">
  {artwork.title}
</h1>


                      {/* ARTIST */}

                      <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#6f7b4b]">

                        By{" "}

                        {artwork.artistName}

                      </p>


                      {/* MEDIUM */}

                      {artwork.paintingType && (

                        <p className="mt-3 text-sm text-[#747a80]">

                          {artwork.paintingType}

                        </p>

                      )}

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        )}

      </section>


    

    </main>
  );
}