import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

// Lightweight inline SVG fallback (prevents empty string warnings & 404 errors)
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23C4A892' stroke-width='1.5'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";

// Normalizes image path so bare filenames resolve to /images/products/
function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) return FALLBACK_IMAGE;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/images/")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/images/products/${trimmed}`;
}

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (id) {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/artworks");
  }
}

export default async function AdminArtworksPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto p-6 text-[#22211B]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]">
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
          className="inline-flex items-center justify-center gap-2 bg-[#22211B] hover:bg-[#4D3024] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition"
        >
          <FiPlus size={16} /> Add New Artwork
        </Link>
      </div>

      {/* Artworks Data Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF7F0] border-b border-[#E8E2D5] text-xs uppercase font-bold text-gray-500">
              <tr>
                <th className="p-4">Artwork</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D5]">
              {products.map((product) => {
                const rawImage =
                  product.imageUrl ||
                  (Array.isArray((product as any).images) && (product as any).images[0]) ||
                  null;

                const primaryImage = normalizeImageUrl(rawImage);

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FAF7F0]/40 transition"
                  >
                    {/* Thumbnail & Title */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-[#E8E2D5] shrink-0">
                        <Image
                          src={primaryImage}
                          alt={product.title || "Artwork"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-[#22211B]">
                        {product.title || "Untitled"}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-xs font-semibold uppercase text-gray-600">
                      {product.category || "General"}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold text-[#4D3024]">
                      ${(product.price || 0).toLocaleString()}
                    </td>

                    {/* CRUD Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Read / View */}
                        <Link
                          href={`/shop/${product.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                          title="View Product"
                        >
                          <FiEye size={16} />
                        </Link>

                        {/* Update / Edit */}
                        <Link
                          href={`/admin/edit-product/${product.id}`}
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-700 transition"
                          title="Edit Artwork"
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        {/* Delete */}
                        <form action={deleteProduct} className="inline">
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                            title="Delete Artwork"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}