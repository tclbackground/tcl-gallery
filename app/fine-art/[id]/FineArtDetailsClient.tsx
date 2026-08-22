"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  Search,
} from "lucide-react";

type FineArt = {
  id: string;

  slNo?: number | null;
  category?: string | null;
  artistName?: string | null;
  itemRefNo?: string | null;

  year?: string | number | null;

  image1?: string | null;
  image2?: string | null;
  image3?: string | null;

  title?: string | null;

  withFrame?: string | null;
  paintingType?: string | null;
};

type FineArtDetailsClientProps = {
  artwork: FineArt;
};

export default function FineArtDetailsClient({
  artwork,
}: FineArtDetailsClientProps) {
  const router = useRouter();

  const images = [
    artwork.image1,
    artwork.image2,
    artwork.image3,
  ].filter(
    (image): image is string =>
      Boolean(image && image.trim() !== "")
  );

  const imageList =
    images.length > 0
      ? images
      : ["/placeholder.jpg"];

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const currentImage =
    imageList[activeImageIndex];

  const nextImage = () => {
    setActiveImageIndex((previous) =>
      previous === imageList.length - 1
        ? 0
        : previous + 1
    );
  };

  const previousImage = () => {
    setActiveImageIndex((previous) =>
      previous === 0
        ? imageList.length - 1
        : previous - 1
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            artwork.title ||
            "Fine Art | TCL Gallery",

          text: `View ${
            artwork.title || "this artwork"
          } at TCL Gallery`,

          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Artwork link copied");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  /* =========================================
     ENQUIRE NOW → CONTACT US PAGE
  ========================================= */

  const handleEnquiry = () => {
    const title =
      artwork.title || "this artwork";

    const reference =
      artwork.itemRefNo ||
      artwork.id;

    router.push(
      `/contact?artwork=${encodeURIComponent(
        title
      )}&ref=${encodeURIComponent(reference)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#29303A]">

      {/* =========================================
          TOP NAVIGATION
      ========================================= */}

      <div className="border-b border-[#D9D5CB] bg-[#F7F6F2]">
        <div className="mx-auto flex max-w-[1900px] items-center justify-between px-5 py-5 md:px-8 lg:px-12">

          <Link
            href="/fine-art"
            className="group flex items-center gap-2 text-sm font-medium text-[#606874] transition hover:text-[#6F7B4B]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            Back to Fine Art
          </Link>

          <div className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F7B4B] md:flex">

            <span className="h-2 w-2 rounded-full bg-[#6F7B4B]" />

            TCL Gallery

          </div>

        </div>
      </div>


      {/* =========================================
          ARTWORK PAGE
      ========================================= */}

      <section className="mx-auto max-w-[1900px] px-5 py-8 md:px-8 lg:px-12 lg:py-12">

        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr] xl:gap-14">

          {/* =====================================
              LEFT SIDE - IMAGE
          ===================================== */}

          <div>

            {/* IMAGE CARD */}

            <div className="relative overflow-hidden rounded-[28px] border border-[#DEDAD0] bg-[#E8E5DD]">

              {/* FINE ART BADGE */}

              <div className="absolute left-5 top-5 z-10 rounded-full bg-[#F7F6F2] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#6F7B4B] shadow-sm">
                Fine Art
              </div>


              {/* WISHLIST */}

              <button
                type="button"
                onClick={() =>
                  setIsWishlisted(!isWishlisted)
                }
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F6F2] shadow-sm transition hover:scale-105"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={19}
                  className={
                    isWishlisted
                      ? "fill-[#6F7B4B] text-[#6F7B4B]"
                      : "text-[#3D4650]"
                  }
                />
              </button>


              {/* ARTWORK IMAGE */}

              <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[16/10]">

                <Image
                  src={currentImage}
                  alt={
                    artwork.title ||
                    "Fine Art"
                  }
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1280px) 100vw, 65vw"
                  className="object-contain p-4 sm:p-6"
                />

              </div>


              {/* IMAGE NAVIGATION */}

              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#3D4650] shadow-md transition hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>


                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#3D4650] shadow-md transition hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

            </div>


            {/* THUMBNAILS */}

            {imageList.length > 1 && (
              <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-1">

                {imageList.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setActiveImageIndex(index)
                      }
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        activeImageIndex === index
                          ? "border-[#6F7B4B]"
                          : "border-[#DEDAD0] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Artwork view ${
                          index + 1
                        }`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  )
                )}

              </div>
            )}

          </div>


          {/* =====================================
              RIGHT SIDE - ARTWORK DETAILS
          ===================================== */}

          <div className="xl:pt-2">

            {/* CATEGORY */}

            <div className="flex items-start justify-between gap-5">

              <div>

                <span className="inline-flex rounded-full bg-[#6F7B4B] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {artwork.category ||
                    "Fine Art"}
                </span>


                {/* TITLE */}

                <h1 className="mt-6 text-[40px] font-medium leading-[1.08] tracking-[-0.035em] text-[#29303A] sm:text-[52px] xl:text-[58px]">
                  {artwork.title ||
                    "Untitled Artwork"}
                </h1>


                {/* ARTIST */}

                {artwork.artistName && (
                  <p className="mt-5 text-sm font-medium uppercase tracking-[0.08em] text-[#6F7B4B]">
                    By{" "}
                    {artwork.artistName}
                  </p>
                )}

              </div>


              {/* SHARE */}

              <button
                type="button"
                onClick={handleShare}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#D9D5CB] bg-[#F7F6F2] text-[#4B535E] transition hover:border-[#6F7B4B] hover:text-[#6F7B4B]"
                aria-label="Share artwork"
              >
                <Share2 size={18} />
              </button>

            </div>


            {/* =====================================
                ARTWORK INFORMATION
            ===================================== */}

            <div className="mt-10 border-t border-[#D9D5CB]">

              {/* ITEM REFERENCE */}

              {artwork.itemRefNo && (
                <div className="flex items-center justify-between gap-6 border-b border-[#D9D5CB] py-5">

                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8088]">
                    Item Reference
                  </span>

                  <span className="text-sm font-semibold text-[#6F7B4B]">
                    {artwork.itemRefNo}
                  </span>

                </div>
              )}


              {/* YEAR */}

              {artwork.year !== null &&
                artwork.year !== undefined && (
                  <div className="flex items-center justify-between gap-6 border-b border-[#D9D5CB] py-5">

                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8088]">
                      Year
                    </span>

                    <span className="text-sm font-medium text-[#29303A]">
                      {artwork.year}
                    </span>

                  </div>
                )}


              {/* MEDIUM */}

              {artwork.paintingType && (
                <div className="flex items-center justify-between gap-6 border-b border-[#D9D5CB] py-5">

                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8088]">
                    Medium
                  </span>

                  <span className="text-right text-sm font-medium text-[#29303A]">
                    {artwork.paintingType}
                  </span>

                </div>
              )}


              {/* FRAME */}

              {artwork.withFrame && (
                <div className="flex items-center justify-between gap-6 border-b border-[#D9D5CB] py-5">

                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A8088]">
                    Frame
                  </span>

                  <span className="text-sm font-medium text-[#29303A]">
                    {artwork.withFrame}
                  </span>

                </div>
              )}

            </div>


            {/* =====================================
                CONCIERGE ENQUIRY
            ===================================== */}

            <div className="mt-8 rounded-[24px] border border-[#D9D5CB] bg-white p-6 sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#EFF1E8] text-[#6F7B4B]">
                  <Search size={20} />
                </div>

                <div className="flex-1">

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6F7B4B]">
                    TCL Gallery Concierge
                  </p>

                  <h2 className="mt-2 text-2xl font-medium text-[#29303A]">
                    Interested in this artwork?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#747A82]">
                    Contact our gallery for artwork availability,
                    pricing and acquisition details.
                  </p>


                  {/* ENQUIRE NOW BUTTON */}

                  <button
                    type="button"
                    onClick={handleEnquiry}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#002B5B] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition duration-300 hover:bg-[#1F5AA6] hover:shadow-lg sm:w-auto"
                  >
                    <MessageCircle size={17} />

                    Enquire Now

                  </button>

                </div>

              </div>

            </div>


            {/* GALLERY NOTE */}

            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.16em] text-[#8A8E92]">
              Curated by TCL Gallery
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          FLOATING ENQUIRE BUTTON
      ========================================= */}


    </main>
  );
}