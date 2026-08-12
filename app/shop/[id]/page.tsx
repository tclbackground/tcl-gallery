export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { 
  FiHeart, 
  FiEye, 
  FiShoppingCart, 
  FiMapPin, 
  FiCalendar, 
  FiMaximize2, 
  FiGrid, 
  FiFilter 
} from "react-icons/fi";
import { prisma } from "@/lib/prisma";

export default async function ShopPage() {
  let products: any[] = [];

  try {
    // Fetch all products sorted by newest first
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch shop products:", error);
  }

  return (
    <div className="min-h-screen bg-[#FBF9F0] text-[#22211B] py-10">
      <div className="mx-auto max-w-[1500px] px-4 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-[#C4A892]/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4D3024]">
              TCL Gallery Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22211B] mt-1">
              All Artworks
            </h1>
          </div>

          {/* Results Bar */}
          <div className="flex items-center gap-4 text-xs text-[#22211B]/70">
            <span className="inline-flex items-center gap-1.5 font-medium bg-[#E8DBCA]/30 px-3 py-1.5 rounded-full border border-[#C4A892]/20">
              <FiGrid className="text-sm text-[#4D3024]" /> Showing {products.length} Artworks
            </span>
          </div>
        </div>

        {/* Empty Collection View */}
        {products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#C4A892]/40 rounded-2xl bg-[#FBF9F0]/50 my-8">
            <h3 className="font-serif text-xl font-bold text-[#22211B] mb-2">
              No Artworks Found
            </h3>
            <p className="text-xs text-[#22211B]/60 max-w-md mx-auto">
              There are currently no products listed in the gallery database or the connection is updating.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item: any, idx: number) => {
              // Direct Mappings with Fallbacks
              const title = item.title || "Untitled Artwork";
              const artist = item.artistName;
              const imageUrl = item.imageUrl;
              const referenceNo = item.referenceNo;
              const location = item.location;
              const medium = item.medium || "Fine Art";
              const year = item.year;
              const size = item.size;

              // Price Calculation
              const rawPrice = item.price;
              const price =
                typeof rawPrice === "string"
                  ? parseFloat(rawPrice.replace(/[^0-9.]/g, ""))
                  : rawPrice;

              return (
                <div
                  key={item.id || idx}
                  className="group rounded-xl border border-[#C4A892]/30 bg-[#FBF9F0] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Compact Image Container (4:3 Aspect Ratio) */}
                    <div className="relative aspect-[4/3] w-full bg-[#E8DBCA]/40 overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#4D3024]/60 p-3 text-center">
                          <span className="font-serif text-xs font-semibold mb-0.5 line-clamp-1">
                            {title}
                          </span>
                          <span className="text-[8px] font-semibold uppercase tracking-widest text-[#4D3024]/40">
                            No Image Available
                          </span>
                        </div>
                      )}

                      {/* Reference Badge */}
                      {referenceNo && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="rounded-full bg-[#22211B]/80 backdrop-blur-xs px-2 py-0.5 text-[8px] font-semibold text-[#FBF9F0]">
                            {referenceNo}
                          </span>
                        </div>
                      )}

                      {/* Hover Action Overlay */}
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

                    {/* Metadata Section */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-medium text-[#C4A892]">
                        <span className="truncate max-w-[70%]">{medium}</span>
                        {year && (
                          <span className="inline-flex items-center gap-1 text-[#22211B]/60 shrink-0">
                            <FiCalendar className="text-[9px]" /> {year}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base font-medium text-[#22211B] group-hover:text-[#4D3024] transition leading-snug line-clamp-1">
                        <Link href={`/shop/${item.id}`}>
                          {title}
                        </Link>
                      </h3>

                      {artist && (
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4D3024]">
                          BY {artist}
                        </p>
                      )}

                      {(location || size) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-[#22211B]/70 pt-1.5 border-t border-[#C4A892]/20">
                          {location && (
                            <span className="inline-flex items-center gap-1">
                              <FiMapPin className="text-[9px] text-[#4D3024]" /> {location}
                            </span>
                          )}
                          {size && (
                            <span className="inline-flex items-center gap-1">
                              <FiMaximize2 className="text-[9px] text-[#4D3024]" /> {size}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 pt-0 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[8px] text-[#22211B]/50 uppercase tracking-widest block font-medium">
                        PRICE
                      </span>
                      <span className="font-serif text-sm font-bold text-[#22211B]">
                        {price != null && !isNaN(price) && price > 0
                          ? `$${Number(price).toLocaleString()}`
                          : "Price on Request"}
                      </span>
                    </div>

                    <button className="inline-flex items-center gap-1 rounded-full bg-[#4D3024] px-3.5 py-1.5 text-[10px] font-semibold text-[#FBF9F0] transition hover:bg-[#22211B] shadow-xs">
                      <FiShoppingCart className="text-xs" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}