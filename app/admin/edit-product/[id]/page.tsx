import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import EditProductForm from "../EditProductForm"; // 👈 points to app/admin/edit-product/EditProductForm.tsx

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, artists] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    (prisma as any).artist
      ? (prisma as any).artist.findMany({
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-[#22211B]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#C4A892]/30 pb-4">
        <Link
          href="/admin"
          className="p-2 rounded-full border border-[#C4A892]/40 bg-white hover:bg-[#FBF9F0] transition"
        >
          <FiArrowLeft size={18} />
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#4D3024]">
            Management
          </p>
          <h1 className="font-serif text-4xl font-bold">Edit Artwork</h1>
        </div>
      </div>

      {/* Interactive Form Component with Instant Live Preview */}
      <EditProductForm product={product!} artists={artists} />
    </div>
  );
}