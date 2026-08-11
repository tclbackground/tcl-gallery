import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

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

          <h1 className="font-serif text-4xl font-bold">
            Edit Artwork
          </h1>
        </div>
      </div>

      <form
  action={async (formData) => {
    "use server";
    await updateProduct(formData);
  }}
  className="bg-white rounded-2xl border border-[#C4A892]/30 shadow-sm p-8 space-y-6"
>
        <input
          type="hidden"
          name="id"
          value={product.id}
        />

        <input
          type="hidden"
          name="existingImageUrl"
          value={product.imageUrl}
        />

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Title
          </label>

          <input
            name="title"
            defaultValue={product.title}
            required
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* Price + Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">
              Price ($)
            </label>

            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price}
              required
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">
              Category
            </label>

            <select
              name="category"
              defaultValue={product.category}
              className="w-full p-3 border rounded-xl bg-white"
            >
              <option value="fine-art">FINE-ART</option>
              <option value="photography">PHOTOGRAPHY</option>
              <option value="design-store">DESIGN STORE</option>
              <option value="korea-products">KOREA PRODUCTS</option>
            </select>
          </div>
        </div>

        {/* Artist */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Artist
          </label>

          <select
  name="artistId"
  defaultValue={(product as any).artistId || ""}
  className="w-full p-3 border rounded-xl bg-white"
>
  <option value="">Independent (No Artist)</option>
  {artists.map((artist: any) => (
    <option key={artist.id} value={artist.id}>
      {artist.name}
    </option>
  ))}
</select>
        </div>

        {/* Current Image */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Current Artwork
          </label>

          <div className="relative w-full h-[500px] rounded-xl overflow-hidden border bg-[#F8F8F8]">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* Replace Image */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Replace Image (Optional)
          </label>

          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Description
          </label>

          <textarea
            name="description"
            rows={4}
            defaultValue={product.description || ""}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#22211B] hover:bg-[#4D3024] text-white py-4 rounded-full font-semibold transition"
        >
          Update Artwork
        </button>
      </form>
    </div>
  );
}