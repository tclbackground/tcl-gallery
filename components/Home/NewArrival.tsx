import Link from "next/link";

import {
  FiArrowRight,
  FiEye,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiMaximize2,
} from "react-icons/fi";

import { getDb } from "@/lib/mongodb";

import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewArrivalsSection() {
  let products: any[] = [];

  try {
    // ============================================================
    // MONGODB
    // ============================================================

    const db = await getDb();

    const productDocuments = await db
      .collection("Product")
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    // ============================================================
    // NORMALIZE MONGODB DATA
    // ============================================================

    products = productDocuments.map(
      (product: any) => ({
        id: product._id
          ? product._id.toString()
          : null,

        // --------------------------------------------------------
        // BASIC PRODUCT INFORMATION
        // --------------------------------------------------------

        slNo:
          product["SL NO"] ??
          product.slNo ??
          null,

        TITLE:
          product["TITLE"] ??
          product.title ??
          null,

        title:
          product["TITLE"] ??
          product.title ??
          null,

        // --------------------------------------------------------
        // IMAGES
        // --------------------------------------------------------

        "IMAGE URL":
          product["IMAGE URL"] ??
          product.imageUrl ??
          null,

        imageUrl:
          product["IMAGE URL"] ??
          product.imageUrl ??
          null,

        "IMAGE 2":
          product["IMAGE 2"] ??
          product.image2 ??
          null,

        image2:
          product["IMAGE 2"] ??
          product.image2 ??
          null,

        "IMAGE 3":
          product["IMAGE 3"] ??
          product.image3 ??
          null,

        image3:
          product["IMAGE 3"] ??
          product.image3 ??
          null,

        "IMAGE 4":
          product["IMAGE 4"] ??
          product.image4 ??
          null,

        image4:
          product["IMAGE 4"] ??
          product.image4 ??
          null,

        "IMAGE 5":
          product["IMAGE 5"] ??
          product.image5 ??
          null,

        image5:
          product["IMAGE 5"] ??
          product.image5 ??
          null,

        // --------------------------------------------------------
        // REFERENCE
        // --------------------------------------------------------

        "REFERENCE NO":
          product["REFERENCE NO"] ??
          product.referenceNo ??
          null,

        referenceNo:
          product["REFERENCE NO"] ??
          product.referenceNo ??
          null,

        // --------------------------------------------------------
        // LOCATION
        // --------------------------------------------------------

        LOCATION:
          product["LOCATION"] ??
          product.location ??
          null,

        location:
          product["LOCATION"] ??
          product.location ??
          null,

        // --------------------------------------------------------
        // YEAR
        // --------------------------------------------------------

        YEAR:
          product["YEAR"] ??
          product.year ??
          null,

        year:
          product["YEAR"] ??
          product.year ??
          null,

        // --------------------------------------------------------
        // MEDIUM
        // --------------------------------------------------------

        MEDIUM:
          product["MEDIUM"] ??
          product.medium ??
          null,

        medium:
          product["MEDIUM"] ??
          product.medium ??
          null,

        // --------------------------------------------------------
        // SIZE
        // --------------------------------------------------------

        SIZE:
          product["SIZE"] ??
          product.size ??
          null,

        size:
          product["SIZE"] ??
          product.size ??
          null,

        // --------------------------------------------------------
        // CATEGORY
        // --------------------------------------------------------

        category:
          product.category ??
          null,

        // --------------------------------------------------------
        // PRICES
        // --------------------------------------------------------

        "12X18 PRICE":
          product["12X18 PRICE"] ??
          product.price12x18 ??
          null,

        price12x18:
          product["12X18 PRICE"] ??
          product.price12x18 ??
          null,

        "18X24 PRICE":
          product["18X24 PRICE"] ??
          product.price18x24 ??
          null,

        price18x24:
          product["18X24 PRICE"] ??
          product.price18x24 ??
          null,

        "24X33 PRICE":
          product["24X33 PRICE"] ??
          product.price24x33 ??
          null,

        price24x33:
          product["24X33 PRICE"] ??
          product.price24x33 ??
          null,

        // --------------------------------------------------------
        // DESCRIPTION
        // --------------------------------------------------------

        description:
          product.description ??
          null,

        // --------------------------------------------------------
        // ARTIST
        // --------------------------------------------------------

        ARTIST:
          product.ARTIST ??
          product.artist ??
          product.artistName ??
          null,

        artist:
          product.artist ??
          product.artistName ??
          null,

        artistName:
          product.artistName ??
          product.artist ??
          null,

        // --------------------------------------------------------
        // DATES
        // --------------------------------------------------------

        createdAt:
          product.createdAt ??
          null,

        updatedAt:
          product.updatedAt ??
          null,
      })
    );
  } catch (error) {
    console.error(
      "Failed fetching products:",
      error
    );

    products = [];
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="bg-[#FBF9F0] py-6 text-[#22211B]">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col justify-between border-b border-[#C4A892]/30 pb-3 sm:flex-row sm:items-end">

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-[#4D3024]">
              <FiClock className="text-xs" />
              Fresh Off the Studio Floor
            </span>

            <h2 className="mt-0.5 font-serif text-2xl font-bold text-[#22211B] sm:text-3xl">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop?sort=newest"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4D3024] transition hover:text-[#22211B] hover:underline sm:mt-0"
          >
            Explore All New Releases
            <FiArrowRight />
          </Link>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {products.length === 0 ? (
          <div className="py-6 text-center text-xs font-medium text-[#22211B]/60">
            No new releases found in the gallery collection.
          </div>
        ) : (
          /* =====================================================
             PRODUCT GRID
          ====================================================== */

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {products.map(
              (item: any, idx: number) => {

                // =================================================
                // PRODUCT ID
                // =================================================

                const id =
                  item.id ||
                  item._id;

                // =================================================
                // TITLE
                // =================================================

                const title =
                  item.TITLE ||
                  item.title ||
                  "Untitled Artwork";

                // =================================================
                // ARTIST
                // =================================================

                const artist =
                  item.ARTIST ||
                  item.artist ||
                  item.artistName ||
                  null;

                // =================================================
                // IMAGE
                // =================================================

                let rawImage =
                  item["IMAGE URL"] ||
                  item.imageUrl ||
                  item.Photo ||
                  item.photo ||
                  item.image ||
                  null;

                if (
                  rawImage &&
                  typeof rawImage === "string" &&
                  !rawImage.startsWith("http") &&
                  !rawImage.startsWith("/")
                ) {
                  rawImage = `/${rawImage}`;
                }

                const imageUrl =
                  rawImage;

                // =================================================
                // REFERENCE
                // =================================================

                const referenceNo =
                  item["REFERENCE NO"] ||
                  item.referenceNo ||
                  item.refNo ||
                  null;

                // =================================================
                // LOCATION
                // =================================================

                const location =
                  item.LOCATION ||
                  item.location ||
                  null;

                // =================================================
                // MEDIUM
                // =================================================

                const medium =
                  item.MEDIUM ||
                  item.medium ||
                  "Fine Art";

                // =================================================
                // YEAR
                // =================================================

                const year =
                  item.YEAR ||
                  item.year ||
                  null;

                // =================================================
                // SIZE
                // =================================================

                const size =
                  item.SIZE ||
                  item.size ||
                  null;

                // =================================================
                // PRICE
                //
                // Product collection currently has size-based
                // prices. Use the first available price.
                // =================================================

                const rawPrice =
                  item.PRICE ??
                  item.price ??
                  item.price12x18 ??
                  item["12X18 PRICE"] ??
                  item.price18x24 ??
                  item["18X24 PRICE"] ??
                  item.price24x33 ??
                  item["24X33 PRICE"] ??
                  null;

                const price =
                  typeof rawPrice === "string"
                    ? parseFloat(
                        rawPrice.replace(
                          /[^0-9.]/g,
                          ""
                        )
                      )
                    : Number(rawPrice);

                return (
                  <div
                    key={id || idx}
                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#C4A892]/30 bg-[#FBF9F0] shadow-xs transition-all duration-300 hover:shadow-md"
                  >

                    {/* =================================================
                        IMAGE + PRODUCT INFORMATION
                    ================================================== */}

                    <div>

                      {/* IMAGE */}

                      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-b border-[#C4A892]/20 bg-[#E8DBCA]/40">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-[#4D3024]/60">

                            <span className="mb-0.5 line-clamp-1 font-serif text-sm font-semibold">
                              {title}
                            </span>

                            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4D3024]/40">
                              No Image Preview
                            </span>

                          </div>
                        )}

                        {/* =================================================
                            LEFT BADGES
                        ================================================== */}

                        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">

                          <span className="rounded-full bg-[#4D3024] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#FBF9F0]">
                            JUST IN
                          </span>

                          {referenceNo && (
                            <span className="rounded-full bg-[#22211B]/80 px-2 py-0.5 text-[8px] font-semibold text-[#FBF9F0] backdrop-blur-xs">
                              {referenceNo}
                            </span>
                          )}

                        </div>

                        {/* =================================================
                            ACTION OVERLAY
                        ================================================== */}

                        <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1.5 opacity-100 sm:opacity-0 sm:transition sm:duration-300 sm:group-hover:opacity-100">

                          {/* WISHLIST */}

                          {id && (
                            <WishlistButton
                              productId={String(id)}
                            />
                          )}

                          {/* QUICK VIEW */}

                          <button
                            type="button"
                            className="rounded-full bg-[#FBF9F0] p-2 text-[#22211B] shadow-xs transition hover:bg-[#4D3024] hover:text-[#FBF9F0]"
                            aria-label="Quick View"
                          >
                            <FiEye className="text-xs" />
                          </button>

                        </div>

                      </div>

                      {/* =================================================
                          PRODUCT META
                      ================================================== */}

                      <div className="space-y-2 p-4">

                        {/* MEDIUM + YEAR */}

                        <div className="flex items-center justify-between text-[11px] font-medium text-[#C4A892]">

                          <span className="max-w-[70%] truncate">
                            {medium}
                          </span>

                          {year && (
                            <span className="inline-flex shrink-0 items-center gap-1 text-[#22211B]/60">
                              <FiCalendar className="text-[9px]" />
                              {year}
                            </span>
                          )}

                        </div>

                        {/* TITLE */}

                        <h3 className="line-clamp-1 font-serif text-lg font-medium leading-snug text-[#22211B] transition group-hover:text-[#4D3024]">
                          <Link
                            href={`/shop/${id}`}
                          >
                            {title}
                          </Link>
                        </h3>

                        {/* ARTIST */}

                        {artist && (
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4D3024]">
                            BY {artist}
                          </p>
                        )}

                        {/* LOCATION + SIZE */}

                        {(location || size) && (
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-t border-[#C4A892]/20 pt-1 text-[11px] text-[#22211B]/70">

                            {location && (
                              <span className="inline-flex items-center gap-1">
                                <FiMapPin className="text-[10px] text-[#4D3024]" />
                                {location}
                              </span>
                            )}

                            {size && (
                              <span className="inline-flex items-center gap-1">
                                <FiMaximize2 className="text-[10px] text-[#4D3024]" />
                                {size}
                              </span>
                            )}

                          </div>
                        )}

                      </div>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div className="mt-2 flex items-center justify-between p-4 pt-0">

                      {/* PRICE */}

                      <div>

                        <span className="block text-[9px] font-medium uppercase tracking-widest text-[#22211B]/50">
                          PRICE
                        </span>

                        <span className="font-serif text-base font-bold text-[#22211B]">

                          {Number.isFinite(price) &&
                          price > 0
                            ? `₹${price.toLocaleString(
                                "en-IN"
                              )}`
                            : "Price on Request"}

                        </span>

                      </div>

                      {/* ADD TO CART */}

                      {id && (
                        <AddToCartButton
                          productId={String(id)}
                        />
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </section>
  );
}