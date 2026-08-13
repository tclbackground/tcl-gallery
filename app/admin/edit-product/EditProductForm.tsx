"use client";

import { useState } from "react";
import Image from "next/image";
import { updateProduct } from "@/app/actions/admin";

interface EditProductFormProps {
  product: any;
  artists: any[];
}

export default function EditProductForm({
  product,
  artists,
}: EditProductFormProps) {
  // State for live preview
  const initialImage = product.imageUrl || "/placeholder.png";
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage);
  const [urlInput, setUrlInput] = useState<string>(product.imageUrl ?? "");

  // Handle URL text change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    if (val.trim() !== "") {
      setPreviewUrl(val.trim());
    } else {
      setPreviewUrl(initialImage);
    }
  };

  // Handle local file selection preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <form
      action={async (formData: FormData) => {
        await updateProduct(formData);
      }}
      className="bg-white rounded-2xl border border-[#C4A892]/30 shadow-sm p-8 space-y-6"
    >
      <input type="hidden" name="id" value={product.id} />
      <input
        type="hidden"
        name="existingImageUrl"
        value={product.imageUrl ?? ""}
      />

      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase mb-2">Title</label>
        <input
          name="title"
          defaultValue={product.title ?? ""}
          required
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* Price & Category */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Price ($)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price ?? ""}
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
            defaultValue={product.category ?? "fine-art"}
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
          defaultValue={product.artistId ?? ""}
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

      {/* Live Artwork Image Preview */}
      <div>
        <label className="block text-xs font-bold uppercase mb-2">
          Artwork Image Preview
        </label>
        <div className="relative w-full h-80 rounded-xl overflow-hidden border bg-[#F8F8F8] flex items-center justify-center">
          <Image
            src={previewUrl}
            alt="Artwork preview"
            fill
            unoptimized
            priority
            className="object-contain"
            onError={() => setPreviewUrl("/placeholder.png")}
          />
        </div>
      </div>

      {/* Image URL Input */}
      <div>
        <label className="block text-xs font-bold uppercase mb-2">
          Image URL / Public Path
        </label>
        <input
          type="text"
          name="imageUrlInput"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="/images/products/artwork-1.jpg or https://..."
          className="w-full p-3 border rounded-xl text-sm outline-none focus:border-[#7B8F50]"
        />
      </div>

      {/* File Upload Input */}
      <div>
        <label className="block text-xs font-bold uppercase mb-2">
          Or Replace With Local File
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-xl text-sm"
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
          defaultValue={product.description ?? ""}
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#22211B] hover:bg-[#4D3024] text-white py-4 rounded-full font-semibold transition cursor-pointer"
      >
        Update Artwork
      </button>
    </form>
  );
}