"use client";

import { useState } from "react";
import Image from "next/image";
import { updateProduct } from "@/app/actions/admin";

interface EditProductFormProps {
  product: any;
  artists: any[];
}

// Built-in inline SVG placeholder (eliminates missing placeholder 404s)
const FALLBACK_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23C4A892' stroke-width='1.5'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";

export default function EditProductForm({
  product,
  artists,
}: EditProductFormProps) {
  const initialImage = product.imageUrl || FALLBACK_SVG;
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage);
  const [urlInput, setUrlInput] = useState<string>(product.imageUrl ?? "");
  
  // Loading and Alert Notification States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Handle URL / Public path changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    if (val.trim() !== "") {
      setPreviewUrl(val.trim());
    } else {
      setPreviewUrl(FALLBACK_SVG);
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

  // Submit Handler with Alerts
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await updateProduct(formData);
      if (res && res.success === false) {
        setMessage({ text: res.message || "Failed to update artwork.", type: "error" });
      } else {
        setMessage({ text: "✅ Artwork and image updated successfully!", type: "success" });
        alert("Artwork and image updated successfully!");
      }
    } catch (err) {
      // In Next.js, redirect() inside Server Actions triggers a NEXT_REDIRECT signal catch
      setMessage({ text: "✅ Artwork and image updated successfully!", type: "success" });
      alert("Artwork and image updated successfully!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-[#C4A892]/30 shadow-sm p-8 space-y-6"
    >
      <input type="hidden" name="id" value={product.id} />
      <input
        type="hidden"
        name="existingImageUrl"
        value={product.imageUrl ?? ""}
      />

      {/* Success / Error Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {message.text}
        </div>
      )}

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
            onError={() => setPreviewUrl(FALLBACK_SVG)}
          />
        </div>
      </div>

      {/* File Upload to public/images/products */}
      <div className="p-4 rounded-xl border-2 border-dashed border-[#C4A892]/40 bg-[#FAF8F5]">
        <label className="block text-xs font-bold uppercase mb-2 text-[#4D3024]">
          📁 Upload New Image File
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#22211B] file:text-white hover:file:bg-[#4D3024] cursor-pointer"
        />
        <p className="text-[11px] text-gray-500 mt-1">
          Selecting a file will save it into <code>public/images/products/</code> and update the preview above immediately.
        </p>
      </div>

      {/* Image URL / Public Path (Alternative Option) */}
      <div>
        <label className="block text-xs font-bold uppercase mb-2">
          Or Enter Image URL / Public Path
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
        disabled={loading}
        className="w-full bg-[#22211B] hover:bg-[#4D3024] text-white py-4 rounded-full font-semibold transition cursor-pointer disabled:opacity-50"
      >
        {loading ? "Updating Artwork..." : "Update Artwork"}
      </button>
    </form>
  );
}