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
  FiPackage,
  FiPlus,
  FiArrowRight,
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

interface DesignStoreProductData {
  id: string;
  slNo?: number | null;
  title: string;
  collection: string;
  description?: string | null;
  price?: number | null;

  image1: string;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;

  referenceNo?: string | null;
  material?: string | null;
  size?: string | null;

  createdAt?: Date | null;
}

// =====================================================
// COLLECTION LABEL
// =====================================================

function getCollectionLabel(collection: string) {
  switch (collection) {
    case "jewel-tree":
      return "Jewel Tree";

    case "living-legacy":
      return "Living Legacy";

    case "nature-window":
      return "Nature Window Collection";

    case "bags":
      return "Bags";

    default:
      return collection;
  }
}

// =====================================================
// COLLECTION SHORT LABEL
// =====================================================

function getShortCollectionLabel(collection: string) {
  switch (collection) {
    case "jewel-tree":
      return "Jewel Tree";

    case "living-legacy":
      return "Living Legacy";

    case "nature-window":
      return "Nature Window";

    case "bags":
      return "Bags";

    default:
      return collection;
  }
}

// =====================================================
// MAIN DASHBOARD
// =====================================================

export default async function AdminDashboardOverview() {
  try {
    // ===================================================
    // LOAD EVERYTHING
    // ===================================================

    const [
      productCount,
      artistCount,
      products,
      allProducts,

      // DESIGN STORE
      designStoreCount,
      designStoreProducts,
    ] = await Promise.all([
      // -----------------------------------------------
      // EXISTING ARTWORK COUNT
      // -----------------------------------------------

      prisma.product.count(),

      // -----------------------------------------------
      // ARTIST COUNT
      // -----------------------------------------------

      prisma.artist.count(),

      // -----------------------------------------------
      // RECENT ARTWORKS
      // -----------------------------------------------

      prisma.product.findMany({
        take: 5,

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

      // -----------------------------------------------
      // ALL ARTWORKS FOR CATEGORY ANALYTICS
      // -----------------------------------------------

      prisma.product.findMany({
        select: {
          category: true,
          price12x18: true,
          price18x24: true,
          price24x33: true,
        },
      }),

      // -----------------------------------------------
      // DESIGN STORE COUNT
      // -----------------------------------------------

      prisma.designStoreProduct.count(),

      // -----------------------------------------------
      // RECENT DESIGN STORE PRODUCTS
      // -----------------------------------------------

      prisma.designStoreProduct.findMany({
        take: 8,

        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // ===================================================
    // ARTWORK CATEGORY STATISTICS
    // ===================================================

    const categoryMap: Record<
      string,
      {
        count: number;
        revenue: number;
      }
    > = {};

    allProducts.forEach((product) => {
      const category =
        product.category?.trim() ||
        "Uncategorized";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          count: 0,
          revenue: 0,
        };
      }

      categoryMap[category].count += 1;

      const productPrice =
        product.price12x18 ??
        product.price18x24 ??
        product.price24x33 ??
        0;

      categoryMap[category].revenue +=
        productPrice;
    });

    const categoryStats =
      Object.entries(categoryMap).map(
        ([category, data]) => ({
          category,
          count: data.count,
          revenue: data.revenue,
        })
      );

    // ===================================================
    // ARTWORK CATALOG VALUE
    // ===================================================

    const totalRevenue =
      categoryStats.reduce(
        (acc, item) =>
          acc + item.revenue,
        0
      );

    // ===================================================
    // DESIGN STORE COLLECTION STATISTICS
    // ===================================================

    const designStoreCollectionMap: Record<
      string,
      {
        count: number;
        value: number;
      }
    > = {};

    designStoreProducts.forEach(
      (product) => {
        const collection =
          product.collection ||
          "uncategorized";

        if (
          !designStoreCollectionMap[
            collection
          ]
        ) {
          designStoreCollectionMap[
            collection
          ] = {
            count: 0,
            value: 0,
          };
        }

        designStoreCollectionMap[
          collection
        ].count += 1;

        designStoreCollectionMap[
          collection
        ].value +=
          product.price ?? 0;
      }
    );

    const designStoreCollectionStats =
      Object.entries(
        designStoreCollectionMap
      ).map(
        ([collection, data]) => ({
          collection,
          count: data.count,
          value: data.value,
        })
      );

    // ===================================================
    // DESIGN STORE TOTAL VALUE
    // ===================================================

    const designStoreValue =
      designStoreProducts.reduce(
        (total, product) =>
          total + (product.price ?? 0),
        0
      );

    // ===================================================
    // TOTAL CATALOG VALUE
    // ===================================================

    const completeCatalogValue =
      totalRevenue +
      designStoreValue;

    // ===================================================
    // TODAY REVENUE
    // ===================================================

    const todayRevenue = 0;

    // ===================================================
    // TOTAL CATALOG ITEMS
    // ===================================================

    const totalCatalogItems =
      productCount +
      designStoreCount;

    // ===================================================
    // PAGE
    // ===================================================

    return (
      <div className="space-y-6 max-w-[1400px] mx-auto">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#4D3024]">
              Admin Control Panel
            </p>

            <h1 className="font-serif text-3xl font-semibold text-[#22211B] mt-1">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Manage artworks, artists and
              Design Store products.
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/admin/design-store"
              className="inline-flex items-center gap-2 rounded-full border border-[#C4A892] bg-white px-5 py-2.5 text-xs font-semibold text-[#4D3024] hover:bg-[#FAF7F0] transition"
            >
              <FiPackage size={14} />
              Design Store
            </Link>

            <Link
              href="/admin/design-store/new"
              className="inline-flex items-center gap-2 rounded-full bg-[#22211B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4D3024] transition"
            >
              <FiPlus size={14} />
              Add Product
            </Link>

          </div>

        </div>

        {/* =================================================
            TOP METRICS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* ARTISTS */}

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

          {/* ARTWORKS */}

          <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs flex items-center justify-between">

            <div className="space-y-3">

              <div className="h-10 w-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#4D3024]">
                <FiShoppingBag size={18} />
              </div>

              <div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fine Artworks
                </p>

                <h3 className="text-3xl font-bold font-serif text-[#22211B] mt-1">
                  {productCount}
                </h3>

              </div>

            </div>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4D3024] bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#E8E2D5]">
              Catalog
            </span>

          </div>

          {/* DESIGN STORE */}

          <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs flex items-center justify-between">

            <div className="space-y-3">

              <div className="h-10 w-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#4D3024]">
                <FiPackage size={18} />
              </div>

              <div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Design Store
                </p>

                <h3 className="text-3xl font-bold font-serif text-[#22211B] mt-1">
                  {designStoreCount}
                </h3>

              </div>

            </div>

            <Link
              href="/admin/design-store"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#4D3024] bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#E8E2D5] hover:bg-[#E8DBCA]"
            >
              Manage
            </Link>

          </div>

          {/* TOTAL CATALOG */}

          <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs">

            <div className="flex items-center justify-between">

              <h4 className="font-serif text-base font-bold text-[#22211B]">
                Total Catalog
              </h4>

              <FiMoreVertical className="text-gray-400" />

            </div>

            <div className="mt-5">

              <span className="text-2xl font-bold font-serif text-[#22211B]">
                ₹
                {completeCatalogValue.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span className="block text-[10px] text-gray-400 mt-1">
                Based on available prices
              </span>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[#E8E2D5]">

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  Items
                </p>

                <p className="font-bold text-[#22211B] mt-1">
                  {totalCatalogItems}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  Today
                </p>

                <p className="font-bold text-[#22211B] mt-1">
                  ₹
                  {todayRevenue.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            DESIGN STORE SECTION
        ================================================= */}

        <div className="rounded-2xl bg-white border border-[#E8E2D5] shadow-2xs overflow-hidden">

          {/* HEADER */}

          <div className="p-6 border-b border-[#E8E2D5] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#4D3024]">
                Design Store
              </p>

              <h2 className="font-serif text-xl font-bold text-[#22211B] mt-1">
                Collection Overview
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Manage your Design Store collections
              </p>

            </div>

            <Link
              href="/admin/design-store"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#4D3024] hover:underline"
            >
              View All Products
              <FiArrowRight size={13} />
            </Link>

          </div>

          {/* COLLECTION CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-6">

            {[
              "jewel-tree",
              "living-legacy",
              "nature-window",
              "bags",
            ].map((collection) => {

              const data =
                designStoreCollectionStats.find(
                  (item) =>
                    item.collection ===
                    collection
                );

              const count =
                data?.count ?? 0;

              const value =
                data?.value ?? 0;

              return (
                <Link
                  key={collection}
                  href={`/admin/design-store?collection=${collection}`}
                  className="group rounded-2xl border border-[#E8E2D5] bg-[#FAF7F0]/60 p-5 hover:bg-white hover:border-[#C4A892] hover:shadow-sm transition"
                >

                  <div className="flex items-start justify-between">

                    <div className="h-10 w-10 rounded-xl bg-white border border-[#E8E2D5] flex items-center justify-center text-[#4D3024]">
                      <FiPackage size={17} />
                    </div>

                    <FiArrowRight
                      size={15}
                      className="text-gray-400 group-hover:text-[#4D3024] transition"
                    />

                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#22211B] mt-5">
                    {getShortCollectionLabel(
                      collection
                    )}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        Products
                      </p>

                      <p className="text-xl font-bold text-[#4D3024]">
                        {count}
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        Value
                      </p>

                      <p className="text-sm font-bold text-[#22211B]">
                        ₹
                        {value.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>

                </Link>
              );
            })}

          </div>

        </div>

        {/* =================================================
            DESIGN STORE RECENT PRODUCTS
        ================================================= */}

        <div className="rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h3 className="font-serif text-lg font-bold text-[#22211B]">
                Recent Design Store Products
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Latest products added to the Design Store
              </p>

            </div>

            <Link
              href="/admin/design-store"
              className="text-xs font-semibold text-[#4D3024] hover:underline"
            >
              View All
            </Link>

          </div>

          {designStoreProducts.length ===
          0 ? (
            <div className="py-12 text-center">

              <FiPackage
                size={36}
                className="mx-auto text-gray-300 mb-3"
              />

              <p className="text-sm text-gray-400">
                No Design Store products uploaded yet.
              </p>

              <Link
                href="/admin/design-store/new"
                className="inline-flex items-center gap-2 mt-4 rounded-full bg-[#22211B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4D3024]"
              >
                <FiPlus size={13} />
                Add First Product
              </Link>

            </div>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {designStoreProducts.map(
                (
                  product: DesignStoreProductData
                ) => (

                  <div
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#FAF7F0]/50 hover:bg-white hover:shadow-md transition"
                  >

                    {/* IMAGE */}

                    <div className="relative h-48 bg-[#F0EBE1]">

                      {product.image1 ? (
                        <Image
                          src={
                            product.image1
                          }
                          alt={
                            product.title
                          }
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="p-4">

                      <div className="flex items-center justify-between gap-2">

                        <span className="inline-block max-w-[80%] truncate rounded-full bg-[#E8DBCA] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#4D3024]">
                          {getCollectionLabel(
                            product.collection
                          )}
                        </span>

                        {product.slNo && (
                          <span className="text-[10px] text-gray-400">
                            #{product.slNo}
                          </span>
                        )}

                      </div>

                      <h4 className="font-serif text-base font-bold text-[#22211B] mt-3 truncate">
                        {product.title}
                      </h4>

                      {product.referenceNo && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate">
                          Ref:{" "}
                          {
                            product.referenceNo
                          }
                        </p>
                      )}

                      {product.price !==
                        null &&
                        product.price !==
                          undefined && (
                          <p className="text-sm font-bold text-[#4D3024] mt-2">
                            ₹
                            {product.price.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}

                      <div className="flex gap-2 mt-4">

                        <Link
                          href={`/admin/design-store/edit/${product.id}`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E8E2D5] bg-white py-2 text-[10px] font-semibold text-[#4D3024] hover:bg-[#FAF7F0]"
                        >
                          <FiEdit2
                            size={12}
                          />
                          Edit
                        </Link>

                        <Link
                          href="/admin/design-store"
                          className="flex items-center justify-center rounded-lg border border-[#E8E2D5] bg-white px-3 py-2 text-gray-500 hover:text-[#4D3024]"
                          title="View products"
                        >
                          <FiEye
                            size={12}
                          />
                        </Link>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =================================================
            EXISTING ARTWORK ANALYTICS + RECENT
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ARTWORK CATEGORY ANALYTICS */}

          <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-serif text-lg font-bold text-[#22211B]">
                  Artwork Categories
                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  Fine artwork distribution by category
                </p>

              </div>

              <FiMoreVertical className="text-gray-400" />

            </div>

            {categoryStats.length ===
            0 ? (

              <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                No artwork categories available.
              </div>

            ) : (

              <div className="space-y-4">

                {categoryStats.map(
                  (item) => {

                    const percentage =
                      productCount >
                      0
                        ? Math.round(
                            (item.count /
                              productCount) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={
                          item.category
                        }
                      >

                        <div className="flex items-center justify-between mb-2">

                          <div>

                            <p className="text-sm font-semibold text-[#22211B]">
                              {
                                item.category
                              }
                            </p>

                            <p className="text-xs text-gray-400">
                              {
                                item.count
                              }{" "}
                              artwork
                              {item.count !==
                              1
                                ? "s"
                                : ""}
                            </p>

                          </div>

                          <span className="text-sm font-bold text-[#4D3024]">
                            {
                              percentage
                            }
                            %
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
                  }
                )}

              </div>

            )}

          </div>

          {/* RECENT ARTWORKS */}

          <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-[#E8E2D5] shadow-2xs space-y-4">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-serif text-lg font-bold text-[#22211B]">
                  Recent Artworks
                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  Latest fine artworks
                </p>

              </div>

              <Link
                href="/admin/artworks"
                className="text-xs font-semibold text-[#4D3024] hover:underline"
              >
                View All
              </Link>

            </div>

            {products.length ===
            0 ? (

              <p className="text-xs text-gray-400 py-8 text-center">
                No artworks uploaded yet.
              </p>

            ) : (

              <div className="space-y-3">

                {(products as ProductData[]).map(
                  (p) => {

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
                                src={
                                  p.imageUrl
                                }
                                alt={
                                  p.title ??
                                  "Artwork Image"
                                }
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
                              {
                                p.title ??
                                "Untitled"
                              }
                            </p>

                            <p className="text-[11px] text-gray-400 truncate">
                              {
                                p.category ??
                                "Uncategorized"
                              }
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
                            <FiEdit2
                              size={13}
                            />
                          </Link>

                          <Link
                            href="/shop"
                            className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8E2D5] text-gray-600 transition"
                            title="View"
                          >
                            <FiEye
                              size={13}
                            />
                          </Link>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Link
            href="/admin/design-store/new"
            className="rounded-2xl bg-[#22211B] p-5 text-white hover:bg-[#4D3024] transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[2px] opacity-60">
                  Design Store
                </p>

                <h3 className="font-serif text-lg font-bold mt-1">
                  Add New Product
                </h3>

              </div>

              <FiPlus
                size={20}
                className="opacity-70 group-hover:opacity-100"
              />

            </div>

          </Link>

          <Link
            href="/admin/design-store"
            className="rounded-2xl bg-white border border-[#E8E2D5] p-5 hover:border-[#C4A892] hover:shadow-sm transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[2px] text-[#4D3024]">
                  Management
                </p>

                <h3 className="font-serif text-lg font-bold mt-1 text-[#22211B]">
                  Manage Products
                </h3>

              </div>

              <FiArrowRight
                size={20}
                className="text-gray-400 group-hover:text-[#4D3024]"
              />

            </div>

          </Link>

          <Link
            href="/admin/artists/add"
            className="rounded-2xl bg-white border border-[#E8E2D5] p-5 hover:border-[#C4A892] hover:shadow-sm transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[2px] text-[#4D3024]">
                  Artists
                </p>

                <h3 className="font-serif text-lg font-bold mt-1 text-[#22211B]">
                  Add New Artist
                </h3>

              </div>

              <FiUsers
                size={20}
                className="text-gray-400 group-hover:text-[#4D3024]"
              />

            </div>

          </Link>

        </div>

      </div>
    );

  } catch (error) {

    console.error(
      "Admin dashboard error:",
      error
    );

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
            Please check the server console
            for details.
          </p>

          <p className="text-xs text-gray-400 mt-4">
            Make sure the DesignStoreProduct
            Prisma model exists and Prisma
            Client has been regenerated.
          </p>

        </div>

      </div>
    );
  }
}