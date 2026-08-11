// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  FiUsers,
  FiShoppingBag,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiEdit2,
  FiEye,
} from "react-icons/fi";

export const revalidate = 0;

interface ProductWithArtist {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default async function AdminDashboardOverview() {
  const [productCount, artistCount, products, categoryStats] = await Promise.all([
    prisma.product.count(),
    (prisma as any).artist ? (prisma as any).artist.count() : Promise.resolve(0),
    prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
      _sum: { price: true },
    }),
  ]);

  const totalRevenue = categoryStats.reduce(
    (acc: number, item: any) => acc + (item._sum.price || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#4D3024]">
              <FiUsers size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Artists
              </p>
              <h3 className="text-3xl font-bold font-serif text-[#22211B] mt-1">
                {artistCount}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
            <FiTrendingUp size={12} /> +11.01%
          </span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#4D3024]">
              <FiShoppingBag size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Artworks
              </p>
              <h3 className="text-3xl font-bold font-serif text-[#22211B] mt-1">
                {productCount}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/50">
            <FiTrendingDown size={12} /> -9.05%
          </span>
        </div>

        {/* Target Gauge Card */}
        <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-base font-bold text-[#22211B]">
              Monthly Target
            </h4>
            <FiMoreVertical className="text-gray-400" />
          </div>

          <div className="relative flex flex-col items-center justify-center py-2">
            <div className="relative h-28 w-44 flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 h-44 w-44 rounded-full border-[12px] border-[#FAF7F0] border-t-[#4D3024] border-r-[#4D3024] rotate-[135deg]" />
              <div className="text-center z-10 mt-6">
                <span className="text-2xl font-bold font-serif text-[#22211B]">
                  75.55%
                </span>
                <span className="block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                  +10%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E8E2D5] text-xs">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">
                Target
              </p>
              <p className="font-bold text-[#22211B] mt-0.5">$20K</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">
                Revenue
              </p>
              <p className="font-bold text-[#4D3024] mt-0.5">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">
                Today
              </p>
              <p className="font-bold text-[#22211B] mt-0.5">$1.2K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics & Recent Artworks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Bar Chart Block */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#22211B]">
                Monthly Sales Performance
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Catalog activity and sales analytics
              </p>
            </div>
            <FiMoreVertical className="text-gray-400" />
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-[#E8E2D5]">
            {[40, 95, 50, 75, 45, 80, 30, 90, 60, 100, 70, 40].map(
              (height, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full bg-[#4D3024] hover:bg-[#22211B] rounded-t-md transition-all duration-300"
                  />
                  <span className="text-[10px] font-semibold text-gray-400">
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][idx]
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Artworks Grid Block */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#22211B]">
              Recent Artworks
            </h3>
            <Link
              href="/admin/add-product"
              className="text-xs font-semibold text-[#4D3024] hover:underline"
            >
              View All
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">
              No artworks uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {(products as unknown as ProductWithArtist[]).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F0]/50 hover:bg-white transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-[#E8E2D5] shrink-0">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#22211B] truncate">
                        {p.title}
                      </p>
                      <p className="text-[11px] font-semibold text-[#4D3024]">
                        ${p.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/edit-product/${p.id}`}
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8E2D5] text-gray-600 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={13} />
                    </Link>
                    <Link
                      href="/shop"
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8E2D5] text-gray-600 transition"
                      title="View"
                    >
                      <FiEye size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}