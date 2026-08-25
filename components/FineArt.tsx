"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, Maximize2 } from "lucide-react";

type Artwork = {
  id: string;
  slNo?: number | null;
  category?: string | null;
  itemRefNo?: string | null;
  year?: number | null;
  image?: string | null;
  title?: string | null;
  widthCms?: string | null;
  withFrame?: string | null;
  productCategory?: string | null;
};

export default function FineArtSection() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFineArt = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/artworks/fineart", {
          cache: "no-store",
        });

        const data = await response.json();

        console.log("Fine Art API Response:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              `Failed to fetch fine art. Status: ${response.status}`
          );
        }

        if (data.success) {
          setArtworks(data.artworks || []);
        } else {
          throw new Error(data.message || "Unable to load fine art");
        }
      } catch (error) {
        console.error("Fine art fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load artworks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFineArt();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="bg-[#f4f1ea] px-4 py-16 sm:px-6 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1800px]">
          <div className="mb-10 animate-pulse">
            <div className="mb-4 h-4 w-48 rounded bg-[#ded8ce]" />
            <div className="h-12 w-64 rounded bg-[#ded8ce]" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[20px] border border-[#ded8ce] bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-[#ddd8cf]" />

                <div className="space-y-4 p-6">
                  <div className="h-8 w-3/4 animate-pulse rounded bg-[#ddd8cf]" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#ddd8cf]" />

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <div className="h-11 flex-1 animate-pulse rounded-full bg-[#ddd8cf]" />
                    <div className="h-11 flex-1 animate-pulse rounded-full bg-[#ddd8cf]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <section className="bg-[#f4f1ea] px-4 py-16 text-center sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>
      </section>
    );
  }

  /* ================= NO ARTWORK ================= */

  if (artworks.length === 0) {
    return (
      <section className="bg-[#f4f1ea] px-4 py-16 text-center sm:px-6 lg:px-10">
        <p className="text-lg text-[#5e574e]">
          No fine art available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f4f1ea] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20 xl:px-12">
      <div className="mx-auto max-w-[1800px]">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-5 border-b border-[#d9d2c8] pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-[#a87520] sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#c58a2b]" />
              FRESH FROM THE STUDIO FLOOR
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-[#2f2f2f] sm:text-5xl lg:text-6xl">
              Fine Art
            </h2>
          </div>

          <a
            href="/collections/fine-art"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#3e3a35] transition-colors hover:text-[#a87520]"
          >
            Explore All Fine Art

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* ================= ARTWORK GRID ================= */}

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {artworks.slice(0, 3).map((artwork) => (
            <article
              key={artwork.id}
              className="group flex min-h-full flex-col overflow-hidden rounded-[16px] border border-[#ddd6cb] bg-[#faf9f6] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* ================= IMAGE ================= */}

              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e7e2da]">
                {artwork.image ? (
                  <Image
                    src={artwork.image}
                    alt={artwork.title || "Fine artwork"}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[#81796f]">
                    Artwork image unavailable
                  </div>
                )}

                {/* YEAR */}

                {artwork.year && (
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#f8f6f1]/95 px-3 py-1.5 text-xs font-semibold text-[#514a42] shadow-sm backdrop-blur-sm">
                    <CalendarDays size={13} />
                    {artwork.year}
                  </div>
                )}
              </div>

              {/* ================= DETAILS ================= */}

              <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">

                <h3 className="text-2xl font-semibold leading-[1.15] text-[#292722] sm:text-[28px]">
                  {artwork.title || "Untitled Artwork"}
                </h3>

                {artwork.widthCms && (
                  <div className="mt-5 border-t border-[#ddd6cb] pt-4">
                    <div className="flex items-center gap-2 text-sm text-[#696158]">
                      <Maximize2
                        size={15}
                        strokeWidth={1.7}
                      />

                      <span>{artwork.widthCms}</span>
                    </div>
                  </div>
                )}

                <div className="flex-1" />
              </div>

              {/* ================= ACTIONS ================= */}

              <div className="border-t border-[#ddd6cb] px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* REQUEST PRICE */}

                  <a
                    href={`/contact?artwork=${encodeURIComponent(
                      artwork.itemRefNo ||
                        artwork.title ||
                        artwork.id
                    )}`}
                    className="
                      flex
                      min-h-[58px]
                      flex-1
                      items-center
                      justify-center
                      rounded-full
                      bg-[#6b432b]
                      px-5
                      py-4
                      text-center
                      text-[11px]
                      font-bold
                      tracking-[0.16em]
                      !text-white
                      transition-all
                      duration-300
                      hover:bg-black
                      hover:!text-white
                      hover:shadow-lg
                    "
                  >
                    REQUEST PRICE
                  </a>

                  {/* VIEW ARTWORK */}

                  <a
                    href={`/fine-art/${artwork.slNo}`}
                    className="
                      group/button
                      flex
                      min-h-[58px]
                      flex-1
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      bg-[#6b432b]
                      px-5
                      py-4
                      text-center
                      text-[11px]
                      font-bold
                      tracking-[0.16em]
                      !text-white
                      transition-all
                      duration-300
                      hover:bg-black
                      hover:!text-white
                      hover:shadow-lg
                    "
                  >
                    <span className="!text-white group-hover/button:!text-white">
                      VIEW ARTWORK
                    </span>

                    <ArrowRight
                      size={17}
                      className="
                        !text-white
                        transition-all
                        duration-300
                        group-hover/button:translate-x-1
                        group-hover/button:!text-white
                      "
                    />
                  </a>

                </div>
              </div>

            </article>
          ))}
        </div>
      </div>
    </section>
  );
}