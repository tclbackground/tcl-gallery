import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

const collections = [
  {
    value: "jewel-tree",
    label: "Jewel Tree",
  },
  {
    value: "living-legacy",
    label: "Living Legacy",
  },
  {
    value: "nature-window",
    label: "Nature Window Collection",
  },
  {
    value: "bags",
    label: "Bags",
  },
];

function getCollectionLabel(collection: string) {
  return (
    collections.find(
      (item) => item.value === collection
    )?.label || collection
  );
}

export default async function DesignStoreAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string;
  }>;
}) {
  const params = await searchParams;

  const selectedCollection =
    params.collection || "";

  // =====================================================
  // FETCH ALL PRODUCTS
  // =====================================================

  const allProducts =
    await prisma.designStoreProduct.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const products = selectedCollection
    ? allProducts.filter(
        (product) =>
          product.collection ===
          selectedCollection
      )
    : allProducts;

  // =====================================================
  // COLLECTION COUNTS
  // =====================================================

  const collectionCounts =
    collections.reduce(
      (acc, collection) => {
        acc[collection.value] =
          allProducts.filter(
            (product) =>
              product.collection ===
              collection.value
          ).length;

        return acc;
      },
      {} as Record<string, number>
    );

  // =====================================================
  // TOTAL PRODUCTS
  // =====================================================

  const totalProducts =
    allProducts.length;

  // =====================================================
  // TOTAL VALUE
  // =====================================================

  const totalValue =
    allProducts.reduce(
      (total, product) =>
        total + (product.price || 0),
      0
    );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">

      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10 py-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#6B4635]">
              Admin Control Panel
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl font-semibold tracking-tight text-[#27231F] mt-3">
              Design Store
            </h1>

            <p className="text-base text-[#7C7771] mt-4">
              Manage Jewel Tree, Living Legacy,
              Nature Window Collection and Bags
              products.
            </p>

          </div>

          {/* ADD BUTTON */}

          <Link
            href="/admin/design-store/new"
            className="
              inline-flex
              items-center
              justify-center
              gap-3
              rounded-full
              bg-[#684633]
              px-7
              py-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              hover:bg-[#533728]
              hover:shadow-md
              transition-all
              duration-200
              whitespace-nowrap
            "
          >
            <FiPlus size={20} />
            Add Design Store Product
          </Link>

        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          {/* TOTAL */}

          <div
            className="
              rounded-[22px]
              border
              border-[#E5DCCE]
              bg-white
              px-7
              py-7
              min-h-[230px]
              flex
              flex-col
              justify-between
            "
          >

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-[#FBF7F0]
                border
                border-[#EEE5D9]
                flex
                items-center
                justify-center
                text-[#684633]
              "
            >
              <FiPackage size={21} />
            </div>

            <div>

              <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#7C7771]">
                Total Products
              </p>

              <p className="font-serif text-4xl font-semibold text-[#28221E] mt-3">
                {totalProducts}
              </p>

              <p className="text-sm text-[#99928A] mt-2">
                Products in Design Store
              </p>

            </div>

          </div>

          {/* JEWEL TREE */}

          <div
            className="
              rounded-[22px]
              border
              border-[#E5DCCE]
              bg-white
              px-7
              py-7
              min-h-[230px]
              flex
              flex-col
              justify-between
            "
          >

            <div>

              <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#8B7C70]">
                Jewel Tree
              </p>

              <p className="font-serif text-4xl font-semibold text-[#28221E] mt-9">
                {collectionCounts["jewel-tree"]}
              </p>

              <p className="text-sm text-[#99928A] mt-3">
                Products shown
              </p>

            </div>

          </div>

          {/* LIVING LEGACY */}

          <div
            className="
              rounded-[22px]
              border
              border-[#E5DCCE]
              bg-white
              px-7
              py-7
              min-h-[230px]
              flex
              flex-col
              justify-between
            "
          >

            <div>

              <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#8B7C70]">
                Living Legacy
              </p>

              <p className="font-serif text-4xl font-semibold text-[#28221E] mt-9">
                {collectionCounts["living-legacy"]}
              </p>

              <p className="text-sm text-[#99928A] mt-3">
                Products shown
              </p>

            </div>

          </div>

          {/* NATURE WINDOW */}

          <div
            className="
              rounded-[22px]
              border
              border-[#E5DCCE]
              bg-white
              px-7
              py-7
              min-h-[230px]
              flex
              flex-col
              justify-between
            "
          >

            <div>

              <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#8B7C70]">
                Nature Window Collection
              </p>

              <p className="font-serif text-4xl font-semibold text-[#28221E] mt-9">
                {collectionCounts["nature-window"]}
              </p>

              <p className="text-sm text-[#99928A] mt-3">
                Products shown
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            TOTAL VALUE
        ================================================= */}

        <div
          className="
            rounded-[22px]
            border
            border-[#E5DCCE]
            bg-white
            px-7
            py-5
            mb-8
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          "
        >

          <div>

            <p className="text-[11px] uppercase tracking-[2px] font-semibold text-[#8B7C70]">
              Design Store Catalog Value
            </p>

            <p className="font-serif text-2xl font-semibold text-[#28221E] mt-1">
              ₹{totalValue.toLocaleString("en-IN")}
            </p>

          </div>

          <p className="text-xs text-[#99928A]">
            Based on available product prices
          </p>

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div
          className="
            rounded-[22px]
            border
            border-[#E5DCCE]
            bg-white
            p-5
            mb-8
          "
        >

          <div className="flex flex-wrap items-center gap-3">

            {/* ALL */}

            <Link
              href="/admin/design-store"
              className={`
                rounded-full
                px-6
                py-3
                text-sm
                font-semibold
                border
                transition-all
                ${
                  !selectedCollection
                    ? "bg-[#684633] text-white border-[#684633]"
                    : "bg-[#FBF8F2] text-[#684633] border-[#E7DED2] hover:bg-[#F4ECE2]"
                }
              `}
            >
              All Products
            </Link>

            {/* COLLECTIONS */}

            {collections.map(
              (collection) => (

                <Link
                  key={collection.value}
                  href={`/admin/design-store?collection=${collection.value}`}
                  className={`
                    rounded-full
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    border
                    transition-all
                    ${
                      selectedCollection ===
                      collection.value
                        ? "bg-[#684633] text-white border-[#684633]"
                        : "bg-[#FBF8F2] text-[#684633] border-[#E7DED2] hover:bg-[#F4ECE2]"
                    }
                  `}
                >
                  {collection.label}
                </Link>

              )
            )}

          </div>

        </div>

        {/* =================================================
            PRODUCTS CONTAINER
        ================================================= */}

        <div
          className="
            rounded-[24px]
            border
            border-[#E5DCCE]
            bg-white
            overflow-hidden
          "
        >

          {/* SECTION HEADER */}

          <div className="px-7 sm:px-9 py-8 border-b border-[#EDE6DC]">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              <div>

                <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#29231F]">
                  {selectedCollection
                    ? getCollectionLabel(
                        selectedCollection
                      )
                    : "All Design Store Products"}
                </h2>

                <p className="text-sm text-[#99928A] mt-3">
                  {products.length} product
                  {products.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              <Link
                href="/admin/design-store/new"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-[#684633]
                  hover:text-[#4F3325]
                  transition
                "
              >
                <FiPlus size={16} />
                Add Product
              </Link>

            </div>

          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {products.length === 0 ? (

            <div className="py-24 text-center px-6">

              <div className="mx-auto h-16 w-16 rounded-2xl bg-[#FBF7F0] border border-[#E8DED1] flex items-center justify-center text-[#684633]">

                <FiPackage size={25} />

              </div>

              <h3 className="font-serif text-2xl font-semibold text-[#29231F] mt-5">
                No products yet
              </h3>

              <p className="text-sm text-[#99928A] mt-2">
                Add your first Design Store
                product to this collection.
              </p>

              <Link
                href="/admin/design-store/new"
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-6
                  rounded-full
                  bg-[#684633]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-[#533728]
                  transition
                "
              >
                <FiPlus size={16} />
                Add Product
              </Link>

            </div>

          ) : (

            /* =================================================
               PRODUCT GRID
            ================================================= */

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-7 sm:p-9">

              {products.map(
                (product) => (

                  <div
                    key={product.id}
                    className="
                      group
                      rounded-[20px]
                      border
                      border-[#E7DED2]
                      bg-[#FCFAF6]
                      overflow-hidden
                      hover:bg-white
                      hover:shadow-[0_12px_35px_rgba(70,45,30,0.08)]
                      transition-all
                      duration-300
                    "
                  >

                    {/* IMAGE */}

                    <div className="relative h-[280px] bg-[#F3EEE6] overflow-hidden">

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
                          className="
                            object-cover
                            group-hover:scale-105
                            transition-transform
                            duration-500
                          "
                        />

                      ) : (

                        <div className="h-full flex items-center justify-center">

                          <FiPackage
                            size={32}
                            className="text-[#B9AA9C]"
                          />

                        </div>

                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      <div className="flex items-center justify-between gap-3">

                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-[#EFE4D7]
                            px-3
                            py-1.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[1.2px]
                            text-[#684633]
                          "
                        >
                          {getCollectionLabel(
                            product.collection
                          )}
                        </span>

                        {product.slNo && (
                          <span className="text-[10px] font-semibold text-[#A49A91]">
                            #{product.slNo}
                          </span>
                        )}

                      </div>

                      <h3 className="font-serif text-xl font-semibold text-[#29231F] mt-4 line-clamp-2">

                        {product.title}

                      </h3>

                      {product.referenceNo && (

                        <p className="text-xs text-[#9A9189] mt-2">
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

                          <p className="text-lg font-semibold text-[#684633] mt-4">

                            ₹
                            {product.price.toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        )}

                      {/* ACTIONS */}

                      <div className="grid grid-cols-3 gap-2 mt-5">

                        <Link
                          href={`/admin/design-store/edit/${product.id}`}
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-xl
                            border
                            border-[#DED3C6]
                            bg-white
                            py-2.5
                            text-xs
                            font-semibold
                            text-[#684633]
                            hover:bg-[#F7F0E7]
                            transition
                          "
                        >
                          <FiEdit2
                            size={13}
                          />
                          Edit
                        </Link>

                        <Link
                          href={`/design-store/${product.id}`}
                          className="
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#DED3C6]
                            bg-white
                            text-[#766C64]
                            hover:text-[#684633]
                            hover:bg-[#F7F0E7]
                            transition
                          "
                          title="View"
                        >
                          <FiEye
                            size={14}
                          />
                        </Link>

                        <form
                          action={`/api/admin/design-store/${product.id}`}
                          method="POST"
                        >

                          <input
                            type="hidden"
                            name="_method"
                            value="DELETE"
                          />

                          <button
                            type="submit"
                            className="
                              w-full
                              h-full
                              min-h-[40px]
                              flex
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-[#E9D7D2]
                              bg-white
                              text-[#9B6258]
                              hover:bg-[#FBF0EE]
                              hover:text-[#8B4439]
                              transition
                            "
                            title="Delete"
                          >
                            <FiTrash2
                              size={14}
                            />
                          </button>

                        </form>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =================================================
            BOTTOM QUICK ACTION
        ================================================= */}

        <div className="mt-8 flex justify-end">

          <Link
            href="/admin/design-store"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#684633]
              hover:text-[#4F3325]
              transition
            "
          >
            View All Products
            <FiArrowRight size={15} />
          </Link>

        </div>

      </div>

    </div>
  );
}