
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiEye,
} from "react-icons/fi";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ============================================================
// FALLBACK IMAGE
// ============================================================

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23C4A892' stroke-width='1.5'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";

// ============================================================
// HELPERS
// ============================================================

function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return FALLBACK_IMAGE;
  }

  const trimmed = url.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return `/images/products/${trimmed}`;
}

function getPrice(product: any): number {
  const candidates = [
    product.price,
    product["12X18 PRICE"],
    product["18X24 PRICE"],
    product["24X33 PRICE"],
    product.price12x18,
    product.price18x24,
    product.price24x33,
  ];

  for (const candidate of candidates) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      candidate !== ""
    ) {
      const value =
        typeof candidate === "string"
          ? Number(candidate.replace(/[₹$,]/g, "").trim())
          : Number(candidate);

      if (Number.isFinite(value) && value > 0) {
        return value;
      }
    }
  }

  return 0;
}

// ============================================================
// DELETE ARTWORK
// ============================================================

async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid artwork ID.");
  }

  const db = await getDb();

  const result = await db.collection("Product").deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    throw new Error("Artwork not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/artworks");
  revalidatePath("/shop");
}

// ============================================================
// ADMIN ARTWORKS PAGE
// ============================================================

export default async function AdminArtworksPage() {
  const db = await getDb();

  const rawProducts = await db
    .collection("Product")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const products = rawProducts.map((product: any) => {
    const images = [
      product.image2 ?? product["IMAGE 2"],
      product.image3 ?? product["IMAGE 3"],
      product.image4 ?? product["IMAGE 4"],
      product.image5 ?? product["IMAGE 5"],
    ].filter(Boolean);

    const rawImage =
      product.imageUrl ??
      product["IMAGE URL"] ??
      product["Image URL"] ??
      product.image ??
      product["Image"] ??
      images[0] ??
      null;

    return {
      id: product._id.toString(),

      title:
        product.title ??
        product.TITLE ??
        product["Title"] ??
        "Untitled",

      category:
        product.category ??
        product.CATEGORY ??
        product["Category"] ??
        "General",

      price: getPrice(product),

      imageUrl: normalizeImageUrl(rawImage),
    };
  });

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 p-6 text-[#22211B]">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E8E2D5] pb-4 md:flex-row md:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
            Catalog Management
          </p>

          <h1 className="font-serif text-3xl font-bold">
            All Artworks ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/add-product"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22211B] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4D3024]"
        >
          <FiPlus size={16} />
          Add New Artwork
        </Link>
      </div>

      {/* ARTWORKS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#E8E2D5] bg-white shadow-xs">

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="border-b border-[#E8E2D5] bg-[#FAF7F0] text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="p-4">Artwork</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E2D5]">

              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-gray-500"
                  >
                    No artworks found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[#FAF7F0]/40"
                  >

                    {/* THUMBNAIL AND TITLE */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E8E2D5] bg-gray-100">

                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover"
                          />

                        </div>

                        <span className="font-bold text-[#22211B]">
                          {product.title}
                        </span>

                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="p-4 text-xs font-semibold uppercase text-gray-600">
                      {product.category}
                    </td>

                    {/* PRICE */}
                    <td className="p-4 font-semibold text-[#4D3024]">
                      {product.price > 0
                        ? `₹${product.price.toLocaleString("en-IN")}`
                        : "Price on Request"}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">

                        <Link
                          href={`/shop/${product.id}`}
                          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                          title="View Product"
                        >
                          <FiEye size={16} />
                        </Link>

                        <Link
                          href={`/admin/edit-product/${product.id}`}
                          className="rounded-lg p-2 text-amber-700 transition hover:bg-amber-50"
                          title="Edit Artwork"
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        <form action={deleteProduct} className="inline">
                          <input
                            type="hidden"
                            name="id"
                            value={product.id}
                          />

                          <button
                            type="submit"
                            className="cursor-pointer rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                            title="Delete Artwork"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </form>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
