"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { uploadProduct } from "@/app/actions/uploadProduct";

export default function AdminAddProduct() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (selectedFile) {
      formData.set("image", selectedFile);
    }

    const res = await uploadProduct(formData);

    setLoading(false);
    if (res.success) {
      setStatus({ type: "success", msg: res.message });
      form.reset();
      removeImage();
    } else {
      setStatus({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F0] py-10 px-4 sm:px-6 lg:px-8 text-[#22211B]">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-8 border-b border-[#C4A892]/30 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#4D3024]">
            Admin Control Panel
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#22211B] mt-1">
            Upload New Product
          </h1>
        </div>

        {/* Status Alert */}
        {status && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
              status.type === "success"
                ? "bg-[#C4A892]/20 text-[#4D3024] border border-[#C4A892]"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {status.type === "success" ? <FiCheckCircle className="text-xl" /> : <FiAlertCircle className="text-xl" />}
            <span>{status.msg}</span>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#C4A892]/30 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Fields */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D3024] mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Sunset Bond Fine Art Print"
                  className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm text-[#22211B] outline-none focus:border-[#4D3024] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D3024] mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    placeholder="250.00"
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm text-[#22211B] outline-none focus:border-[#4D3024] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D3024] mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm text-[#22211B] outline-none focus:border-[#4D3024] transition"
                  >
                    <option value="">Select Category</option>
                    <option value="photography">Photography</option>
                    <option value="fine-art">Fine Art Prints</option>
                    <option value="paintings">Original Paintings</option>
                    <option value="sculptures">Sculptures</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D3024] mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe the artwork, medium, dimensions, and framing options..."
                  className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm text-[#22211B] outline-none focus:border-[#4D3024] transition"
                />
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="lg:col-span-5 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4D3024] mb-2">
                Artwork Image *
              </label>

              {!imagePreview ? (
                <label className="flex-1 min-h-[260px] flex flex-col items-center justify-center border-2 border-dashed border-[#C4A892] bg-[#E8DBCA]/20 rounded-2xl p-6 text-center cursor-pointer hover:bg-[#E8DBCA]/30 transition">
                  <FiUploadCloud className="text-4xl text-[#4D3024] mb-3" />
                  <span className="text-sm font-semibold text-[#22211B]">Click to upload artwork image</span>
                  <span className="text-xs text-[#4D3024] mt-1">PNG, JPG, JPEG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative flex-1 min-h-[260px] w-full overflow-hidden rounded-2xl border border-[#C4A892] bg-[#FBF9F0]">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover object-center"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#22211B] text-white hover:bg-[#4D3024] transition"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="pt-4 border-t border-[#C4A892]/30 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#22211B] px-8 py-3.5 text-sm font-semibold text-[#FBF9F0] shadow-lg transition-all duration-300 hover:bg-[#4D3024] hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Uploading Product..." : "Publish Product"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}