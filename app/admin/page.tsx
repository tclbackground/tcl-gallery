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

interface ProductData {
  id: string;
  title?: string | null;
  category?: string | null;
  imageUrl?: string | null;

  price12x18?: number | null;
  price18x24?: number | null;
  price24x33?: number | null;

  createdAt?: Date | null;
}

export default async function AdminDashboardOverview() {
  try {
    const [productCount, artistCount, products, allProducts] =
      await Promise.all([
        prisma.product.count(),

        prisma.artist.count(),

        prisma.product.findMany({
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            category: true,
            imageUrl: true,
            price12x18: true,
            price18x24: true,
            price24x33: true,
            createdAt: true,
          },
        }),

        prisma.product.findMany({
          select: {
            category: true,
            price12x18: true,
            price18x24: true,
            price24x33: true,
          },
        }),
      ]);

    // Calculate category statistics manually
    // This replaces prisma.product.groupBy()

    const categoryMap: Record<
      string,
      {
        count: number;
        revenue: number;
      }
    > = {};

    allProducts.forEach((product) => {
      const category =
        product.category?.trim() || "Uncategorized";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          count: 0,
          revenue: 0,
        };
      }

      categoryMap[category].count += 1;

      // Use the first available product price
      const productPrice =
        product.price12x18 ??
        product.price18x24 ??
        product.price24x33 ??
        0;

      categoryMap[category].revenue += productPrice;
    });

    const categoryStats = Object.entries(categoryMap).map(
      ([category, data]) => ({
        category,
        count: data.count,
        revenue: data.revenue,
      })
    );

    // Calculate total revenue
    const totalRevenue = categoryStats.reduce(
      (acc, item) => acc + item.revenue,
      0
    );

    // Calculate today's revenue placeholder
    const todayRevenue = 0;

    return (
      <div className="space-y-6 max-w-[1300px] mx-auto">
        {/* Metrics Row */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Artists */}

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
              <FiTrendingUp size={12} />
              Active
            </span>
          </div>

          {/* Total Artworks */}

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

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4D3024] bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#E8E2D5]">
              <FiTrendingUp size={12} />
              Catalog
            </span>
          </div>

          {/* Revenue Card */}

          <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#22211B]">
                Catalog Value
              </h4>

              <FiMoreVertical className="text-gray-400" />
            </div>

            <div className="relative flex flex-col items-center justify-center py-2">
              <div className="text-center">
                <span className="text-2xl font-bold font-serif text-[#22211B]">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </span>

                <span className="block text-[10px] text-gray-400 mt-1">
                  Based on available artwork prices
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E8E2D5] text-xs">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  Artworks
                </p>

                <p className="font-bold text-[#22211B] mt-0.5">
                  {productCount}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  Categories
                </p>

                <p className="font-bold text-[#4D3024] mt-0.5">
                  {categoryStats.length}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  Today
                </p>

                <p className="font-bold text-[#22211B] mt-0.5">
                  ₹{todayRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Section */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category Analytics */}

          <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#22211B]">
                  Artwork Categories
                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  Catalog distribution by category
                </p>
              </div>

              <FiMoreVertical className="text-gray-400" />
            </div>

            {categoryStats.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                No artwork categories available.
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((item) => {
                  const percentage =
                    productCount > 0
                      ? Math.round(
                          (item.count / productCount) * 100
                        )
                      : 0;

                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-[#22211B]">
                            {item.category}
                          </p>

                          <p className="text-xs text-gray-400">
                            {item.count} artwork
                            {item.count !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-[#4D3024]">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-[#FAF7F0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#4D3024]"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Artworks */}

          <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#22211B]">
                Recent Artworks
              </h3>

              <Link
                href="/admin/artworks"
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
                {(products as ProductData[]).map((p) => {
                  const displayPrice =
                    p.price12x18 ??
                    p.price18x24 ??
                    p.price24x33 ??
                    0;

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F0]/50 hover:bg-white transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-[#E8E2D5] shrink-0">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.title ?? "Artwork Image"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#22211B] truncate">
                            {p.title ?? "Untitled"}
                          </p>

                          <p className="text-[11px] text-gray-400 truncate">
                            {p.category ?? "Uncategorized"}
                          </p>

                          <p className="text-[11px] font-semibold text-[#4D3024]">
                            ₹
                            {displayPrice.toLocaleString(
                              "en-IN"
                            )}
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
                          href={`/shop`}
                          className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8E2D5] text-gray-600 transition"
                          title="View"
                        >
                          <FiEye size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiTrendingDown
            className="mx-auto text-red-500 mb-4"
            size={32}
          />

          <h2 className="text-xl font-bold text-[#22211B]">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please check the server console for details.
          </p>
        </div>
      </div>
    );
  }
}