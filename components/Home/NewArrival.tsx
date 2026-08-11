export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiHeart, FiEye, FiShoppingCart, FiClock } from "react-icons/fi";
import { prisma } from "@/lib/prisma";

export default async function NewArrivalsSection() {
  // Fetch top 3 latest products from MongoDB via Prisma
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <section className="bg-[#FBF9F0] py-10 text-[#22211B]">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#C4A892]/30 pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#4D3024]">
              <FiClock className="text-sm" /> Fresh Off the Studio Floor
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22211B]">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 font-semibold text-[#4D3024] hover:text-[#22211B] transition hover:underline text-sm"
          >
            Explore All New Releases <FiArrowRight />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 text-[#22211B]/60 font-medium">
            No new releases found in the gallery collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-[#C4A892]/30 bg-[#FBF9F0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Square Image Container */}
                  <div className="relative aspect-square w-full bg-[#E8DBCA]/40 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                      <span className="rounded-full bg-[#4D3024] px-3 py-1 text-[10px] font-bold tracking-wider text-[#FBF9F0] uppercase">
                        JUST IN
                      </span>
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                      <button
                        className="rounded-full bg-[#FBF9F0] p-2.5 text-[#22211B] shadow-md hover:bg-[#4D3024] hover:text-[#FBF9F0] transition"
                        aria-label="Add to Favorites"
                      >
                        <FiHeart className="text-sm" />
                      </button>
                      <button
                        className="rounded-full bg-[#FBF9F0] p-2.5 text-[#22211B] shadow-md hover:bg-[#4D3024] hover:text-[#FBF9F0] transition"
                        aria-label="Quick View"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Artwork Meta */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-[#C4A892]">
                      <span>{item.category}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-[#22211B] group-hover:text-[#4D3024] transition leading-tight">
                      <Link href={`/shop/${item.id}`}>
                        {item.title}
                      </Link>
                    </h3>

                    {item.description && (
                      <p className="text-xs text-[#22211B]/70 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-[#22211B]/50 uppercase tracking-widest block font-medium">
                      PRICE
                    </span>
                    <span className="font-serif text-xl font-bold text-[#22211B]">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>

                  <button className="inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-5 py-2 text-xs font-semibold text-[#FBF9F0] transition hover:bg-[#22211B] shadow-sm">
                    <FiShoppingCart className="text-xs" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}