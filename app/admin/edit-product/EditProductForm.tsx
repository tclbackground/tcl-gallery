// app/admin/edit-product/[id]/EditProductForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/actions/admin";

interface EditProductFormProps {
  product: any;
  artists: any[];
}

const FALLBACK_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23C4A892' stroke-width='1.5'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";

function getAdditionalImages(product: any): string[] {
  if (!product?.images) return [];
  if (Array.isArray(product.images)) return product.images;
  return [];
}

export default function EditProductForm({
  product,
  artists,
}: EditProductFormProps) {
  const router = useRouter();
  const existingAdditionalImages = getAdditionalImages(product);

  const [previews, setPreviews] = useState<string[]>([
    product?.imageUrl || FALLBACK_SVG,
    existingAdditionalImages[0] || FALLBACK_SVG,
    existingAdditionalImages[1] || FALLBACK_SVG,
    existingAdditionalImages[2] || FALLBACK_SVG,
    existingAdditionalImages[3] || FALLBACK_SVG,
  ]);

  const [imageUrls, setImageUrls] = useState<string[]>([
    product?.imageUrl || "",
    existingAdditionalImages[0] || "",
    existingAdditionalImages[1] || "",
    existingAdditionalImages[2] || "",
    existingAdditionalImages[3] || "",
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const imageLabels = [
    { title: "Main Image", description: "Primary product/card image" },
    { title: "Image 2", description: "Alternate artwork view" },
    { title: "Image 3", description: "Framed/interior view" },
    { title: "Image 4", description: "Artwork detail/close-up" },
    { title: "Image 5", description: "Additional lifestyle view" },
  ];

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = value.trim() ? value.trim() : FALLBACK_SVG;
    setPreviews(updatedPreviews);
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        text: `${imageLabels[index].title} must be a valid image file.`,
        type: "error",
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const updatedPreviews = [...previews];
    updatedPreviews[index] = objectUrl;
    setPreviews(updatedPreviews);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await updateProduct(formData);

      if (response && response.success === false) {
        setMessage({
          text: response.message || "Failed to update artwork.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      setMessage({
        text: "Artwork and images updated successfully! Redirecting...",
        type: "success",
      });

      router.refresh();
    } catch (error: any) {
      console.error("Update error:", error);
      setMessage({
        text: error.message || "Something went wrong while updating the artwork.",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-6 rounded-2xl border border-[#C4A892]/30 bg-white p-8 shadow-sm"
    >
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="existingImageUrl" value={product?.imageUrl ?? ""} />
      <input
        type="hidden"
        name="existingImages"
        value={JSON.stringify(existingAdditionalImages)}
      />

      {message && (
        <div
          className={`rounded-xl border p-4 text-sm font-semibold ${
            message.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-bold uppercase">Title</label>
        <input
          name="title"
          defaultValue={product?.title ?? ""}
          required
          className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price ?? ""}
            required
            className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase">Category</label>
          <select
            name="category"
            defaultValue={product?.category ?? "fine-art"}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-[#7B8F50]"
          >
            <option value="fine-art">FINE-ART</option>
            <option value="photography">PHOTOGRAPHY</option>
            <option value="design-store">DESIGN STORE</option>
            <option value="korea-products">KOREA PRODUCTS</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase">Artist</label>
        <select
          name="artistId"
          defaultValue={product?.artistId ?? ""}
          className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-[#7B8F50]"
        >
          <option value="">Independent (No Artist)</option>
          {artists.map((artist: any) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      {/* Five Image Upload Grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#4D3024]">
              Artwork Images
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Upload local files or enter remote URLs.
            </p>
          </div>
          <span className="rounded-full bg-[#F3F0E8] px-4 py-1.5 text-[10px] font-bold uppercase text-[#7B8F50]">
            5 Images
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {imageLabels.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#C4A892]/30 bg-[#FAF8F5]"
            >
              <div className="flex items-center justify-between border-b border-[#C4A892]/20 bg-white px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase text-[#4D3024]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    {item.description}
                  </p>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22211B] text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <div className="relative h-56 w-full bg-[#ECE9E2]">
                <Image
                  src={previews[index]}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-contain p-2"
                  onError={() => {
                    const updated = [...previews];
                    updated[index] = FALLBACK_SVG;
                    setPreviews(updated);
                  }}
                />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-[#4D3024]">
                    Upload New File
                  </label>
                  <input
                    type="file"
                    name={index === 0 ? "image" : `image${index + 1}`}
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    className="w-full cursor-pointer text-xs"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-[#4D3024]">
                    Or Direct URL
                  </label>
                  <input
                    type="text"
                    name={index === 0 ? "imageUrlInput" : `imageUrlInput${index + 1}`}
                    value={imageUrls[index]}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="/images/products/artwork.jpg"
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-[#7B8F50]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#7B8F50]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-full bg-[#22211B] py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#4D3024] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving Changes..." : "Save & Update Artwork"}
      </button>
    </form>
  );
}