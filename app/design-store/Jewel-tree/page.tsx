import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FiArrowLeft } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function JewelTreePage() {
  const products = await prisma.product.findMany({
    where: {
      category: "jewel-tree",
    },
    include: {
      artist: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#2f2f2f]">
      {/* HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16">
          <Link
            href="/design-store"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <FiArrowLeft />
            Back to Design Store
          </Link>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.3em] text-[#7B8F50]">
              TCL Gallery Design Store
            </p>

            <h1 className="mt-4 font-serif text-5xl sm:text-6xl">
              Jewel Tree
            </h1>

            <p className="mt-6 max-w-2xl leading-8 text-gray-600">
              Discover the Jewel Tree collection.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mb-12 flex items-center justify-between border-b border-gray-200 pb-6">
          <h2 className="font-serif text-3xl">
            All Products
          </h2>

          <p className="text-sm text-gray-500">
            {products.length} Products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="font-serif text-3xl">
              No Jewel Tree products found
            </h2>

            <p className="mt-3 text-gray-500">
              Add products with category "jewel-tree".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.title || "Product"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="font-serif text-xl">
                    {product.title || "Untitled"}
                  </h3>

                  {product.price12x18 && (
                    <p className="mt-2 text-sm font-medium">
                      From ₹
                      {product.price12x18.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}