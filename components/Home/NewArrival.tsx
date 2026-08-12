export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { FiArrowRight, FiHeart, FiEye, FiShoppingCart, FiClock, FiMapPin, FiCalendar, FiMaximize2 } from "react-icons/fi";
import { prisma } from "@/lib/prisma";

export default async function NewArrivalsSection() {
  let products: any[] = [];
  
  try {
    products = await prisma.product.findMany({ 
      take: 3,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed fetching products:", error);
  }

  return (
    <section className="bg-[#FBF9F0] py-6 text-[#22211B]">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-[#C4A892]/30 pb-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-[#4D3024]">
              <FiClock className="text-xs" /> Fresh Off the Studio Floor
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#22211B] mt-0.5">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 font-semibold text-[#4D3024] hover:text-[#22211B] transition hover:underline text-xs"
          >
            Explore All New Releases <FiArrowRight />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="text-center py-6 text-[#22211B]/60 text-xs font-medium">
            No new releases found in the gallery collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((item: any, idx: number) => {
              // Direct mappings safely covering mapped Prisma schema keys & raw MongoDB document fields
              const id = item.id || item._id;
              const title = item.TITLE || item.title || "Untitled Artwork";
              const artist = item.ARTIST || item.artist || item.artistName;
              
              // Handle image paths correctly
              let rawImage = item.Photo || item.photo || item.imageUrl || item.image;
              if (rawImage && !rawImage.startsWith("http") && !rawImage.startsWith("/")) {
                rawImage = `/${rawImage}`;
              }
              const imageUrl = rawImage;

              const referenceNo = item["REFERENCE NO"] || item.referenceNo || item.refNo;
              const location = item.LOCATION || item.location;
              const medium = item.MEDIUM || item.medium || "Fine Art";
              const year = item.YEAR || item.year;
              const size = item.SIZE || item.size;

              const rawPrice = item.PRICE || item.price;
              const price = typeof rawPrice === "string" 
                ? parseFloat(rawPrice.replace(/[^0-9.]/g, "")) 
                : rawPrice;

              return (
                <div
                  key={id || idx}
                  className="group rounded-xl border border-[#C4A892]/30 bg-[#FBF9F0] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Compact Image Container (4:3 Aspect Ratio) */}
                    <div className="relative aspect-[4/3] w-full bg-[#E8DBCA]/40 overflow-hidden flex items-center justify-center border-b border-[#C4A892]/20">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#4D3024]/60 p-3 text-center">
                          <span className="font-serif text-sm font-semibold mb-0.5 line-clamp-1">{title}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#4D3024]/40">
                            No Image Preview
                          </span>
                        </div>
                      )}

                      {/* Compact Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                        <span className="rounded-full bg-[#4D3024] px-2 py-0.5 text-[8px] font-bold tracking-wider text-[#FBF9F0] uppercase">
                          JUST IN
                        </span>
                        {referenceNo && (
                          <span className="rounded-full bg-[#22211B]/80 backdrop-blur-xs px-2 py-0.5 text-[8px] font-semibold text-[#FBF9F0]">
                            {referenceNo}
                          </span>
                        )}
                      </div>

                      {/* Action Overlay */}
                      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button
                          className="rounded-full bg-[#FBF9F0] p-2 text-[#22211B] shadow-xs hover:bg-[#4D3024] hover:text-[#FBF9F0] transition"
                          aria-label="Add to Favorites"
                        >
                          <FiHeart className="text-xs" />
                        </button>
                        <button
                          className="rounded-full bg-[#FBF9F0] p-2 text-[#22211B] shadow-xs hover:bg-[#4D3024] hover:text-[#FBF9F0] transition"
                          aria-label="Quick View"
                        >
                          <FiEye className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Compact Meta */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#C4A892]">
                        <span className="truncate max-w-[70%]">{medium}</span>
                        {year && (
                          <span className="inline-flex items-center gap-1 text-[#22211B]/60 shrink-0">
                            <FiCalendar className="text-[9px]" /> {year}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-medium text-[#22211B] group-hover:text-[#4D3024] transition leading-snug line-clamp-1">
                        <Link href={`/shop/${id}`}>
                          {title}
                        </Link>
                      </h3>

                      {artist && (
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4D3024]">
                          BY {artist}
                        </p>
                      )}

                      {(location || size) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#22211B]/70 pt-1 border-t border-[#C4A892]/20">
                          {location && (
                            <span className="inline-flex items-center gap-1">
                              <FiMapPin className="text-[10px] text-[#4D3024]" /> {location}
                            </span>
                          )}
                          {size && (
                            <span className="inline-flex items-center gap-1">
                              <FiMaximize2 className="text-[10px] text-[#4D3024]" /> {size}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Footer Action */}
                  <div className="p-4 pt-0 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[9px] text-[#22211B]/50 uppercase tracking-widest block font-medium">
                        PRICE
                      </span>
                      <span className="font-serif text-base font-bold text-[#22211B]">
                        {price != null && !isNaN(price) && price > 0
                          ? `$${Number(price).toLocaleString()}`
                          : "Price on Request"}
                      </span>
                    </div>

                    <button className="inline-flex items-center gap-1.5 rounded-full bg-[#4D3024] px-4 py-1.5 text-[11px] font-semibold text-[#FBF9F0] transition hover:bg-[#22211B] shadow-xs">
                      <FiShoppingCart className="text-xs" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}