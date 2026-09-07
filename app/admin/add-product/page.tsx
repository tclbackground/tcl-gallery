"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import {
  FiUploadCloud,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { uploadProduct } from "@/app/actions/uploadProduct";

export default function AdminAddProduct() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // =========================================================
  // IMAGE 1
  // =========================================================

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus({
        type: "error",
        msg: "Artwork image must be smaller than 10MB.",
      });
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStatus(null);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  // =========================================================
  // IMAGE 2
  // =========================================================

  const handleImage2Change = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus({
        type: "error",
        msg: "Image 2 must be smaller than 10MB.",
      });
      return;
    }

    setSelectedFile2(file);
    setImage2Preview(URL.createObjectURL(file));
    setStatus(null);
  };

  const removeImage2 = () => {
    setSelectedFile2(null);
    setImage2Preview(null);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus({
        type: "error",
        msg: "Please upload the artwork image.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Main image
      formData.set("image", selectedFile);

      // Second image
      if (selectedFile2) {
        formData.set("image2", selectedFile2);
      }

      const result = await uploadProduct(formData);

      if (result.success) {
        setStatus({
          type: "success",
          msg: result.message,
        });

        form.reset();

        removeImage();
        removeImage2();
      } else {
        setStatus({
          type: "error",
          msg: result.message,
        });
      }
    } catch (error) {
      console.error("Product upload error:", error);

      setStatus({
        type: "error",
        msg: "Something went wrong while publishing the product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F0] px-4 py-8 text-[#22211B] sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 border-b border-[#C4A892]/30 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#4D3024]">
            Admin Control Panel
          </p>

          <h1 className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
            Upload New Product
          </h1>
        </div>

        {/* =====================================================
            STATUS
        ===================================================== */}

        {status && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
              status.type === "success"
                ? "border-[#C4A892] bg-[#C4A892]/20 text-[#4D3024]"
                : "border-red-200 bg-red-100 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <FiCheckCircle className="shrink-0 text-xl" />
            ) : (
              <FiAlertCircle className="shrink-0 text-xl" />
            )}

            <span>{status.msg}</span>
          </div>
        )}

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#C4A892]/30 bg-white p-5 shadow-xl sm:p-7 lg:p-8"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="space-y-5 lg:col-span-7">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                  Product Title *
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Timeless Presence"
                  className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                />
              </div>

              {/* CATEGORY + REFERENCE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Category *
                  </label>

                  <select
                    name="category"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>

                    <option value="photography">
                      Photography
                    </option>

                    <option value="fine-art">
                      Fine Art Prints
                    </option>

                    <option value="paintings">
                      Original Paintings
                    </option>

                    <option value="sculptures">
                      Sculptures
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Reference No *
                  </label>

                  <input
                    type="text"
                    name="referenceNo"
                    required
                    placeholder="e.g. PH-CU-ID-053-M"
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                  />
                </div>

              </div>

              {/* LOCATION + YEAR */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Bali, Indonesia"
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Year *
                  </label>

                  <input
                    type="number"
                    name="year"
                    required
                    min="1000"
                    max="9999"
                    placeholder="2025"
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                  />
                </div>

              </div>

              {/* MEDIUM */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                  Medium *
                </label>

                <input
                  type="text"
                  name="medium"
                  required
                  placeholder="e.g. Digital photographs on archival paper"
                  className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                />
              </div>

              {/* SIZE */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                  Size *
                </label>

                <input
                  type="text"
                  name="size"
                  required
                  placeholder="e.g. 18.5x14 inches"
                  className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none transition focus:border-[#4D3024]"
                />
              </div>

            </div>

            {/* =================================================
                RIGHT SIDE - IMAGE 1
            ================================================= */}

            <div className="lg:col-span-5">

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                Artwork Image *
              </label>

              {!imagePreview ? (
                <label className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C4A892] bg-[#E8DBCA]/20 p-6 text-center transition hover:bg-[#E8DBCA]/30">

                  <FiUploadCloud className="mb-3 text-4xl text-[#4D3024]" />

                  <span className="text-sm font-semibold">
                    Click to upload artwork image
                  </span>

                  <span className="mt-1 text-xs text-[#4D3024]">
                    PNG, JPG, JPEG, WEBP up to 10MB
                  </span>

                  <input
                    type="file"
                    name="image"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    required
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>
              ) : (
                <div className="relative h-[300px] w-full overflow-hidden rounded-2xl border border-[#C4A892] bg-[#FBF9F0]">

                  <Image
                    src={imagePreview}
                    alt="Artwork preview"
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#22211B] text-white transition hover:bg-[#4D3024]"
                  >
                    <FiX className="text-lg" />
                  </button>

                </div>
              )}

            </div>
          </div>

          {/* =====================================================
              IMAGE 2
          ===================================================== */}

          <div className="mt-8 border-t border-[#C4A892]/30 pt-6">

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
              Image 2
            </label>

            {!image2Preview ? (
              <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C4A892] bg-[#E8DBCA]/20 p-6 text-center transition hover:bg-[#E8DBCA]/30">

                <FiUploadCloud className="mb-3 text-4xl text-[#4D3024]" />

                <span className="text-sm font-semibold">
                  Click to upload second image
                </span>

                <span className="mt-1 text-xs text-[#4D3024]">
                  Optional · PNG, JPG, JPEG, WEBP up to 10MB
                </span>

                <input
                  type="file"
                  name="image2"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImage2Change}
                  className="hidden"
                />

              </label>
            ) : (
              <div className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-[#C4A892] bg-[#FBF9F0]">

                <Image
                  src={image2Preview}
                  alt="Second artwork preview"
                  fill
                  unoptimized
                  className="object-cover object-center"
                />

                <button
                  type="button"
                  onClick={removeImage2}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#22211B] text-white transition hover:bg-[#4D3024]"
                >
                  <FiX className="text-lg" />
                </button>

              </div>
            )}

          </div>

          {/* =====================================================
              SERIAL NUMBER INFO
          ===================================================== */}

          <div className="mt-6 rounded-xl border border-[#C4A892]/30 bg-[#FBF9F0] px-4 py-3">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
              SL NO
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Serial number will be automatically assigned when you
              publish this product.
            </p>

          </div>

          {/* =====================================================
              SUBMIT
          ===================================================== */}

          <div className="mt-6 flex justify-end border-t border-[#C4A892]/30 pt-6">

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#22211B] px-8 py-3.5 text-sm font-semibold text-[#FBF9F0] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#4D3024] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Publishing Product..." : "Publish Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}