
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiImage,
  FiSave,
  FiX,
} from "react-icons/fi";

type Product = {
  id: string;
  referenceNo: string;
  title: string;
  images: string[];
};

type Props = {
  product: Product;
  updateAction: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
};

export default function DesignStoreEditProductForm({
  product,
  updateAction,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [referenceNo, setReferenceNo] = useState(
    product.referenceNo || ""
  );

  const [title, setTitle] = useState(product.title || "");

  const [images, setImages] = useState(
    Array.from({ length: 5 }, (_, index) =>
      product.images[index] || ""
    )
  );

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateImage(index: number, value: string) {
    setImages((previous) => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!referenceNo.trim() || !title.trim()) {
      setMessage("Please enter the reference number and title.");
      return;
    }

    const formData = new FormData();

    formData.set("id", product.id);
    formData.set("referenceNo", referenceNo.trim());
    formData.set("title", title.trim());

    images.forEach((image, index) => {
      formData.set(`image${index + 1}`, image.trim());
    });

    startTransition(async () => {
      try {
        const result = await updateAction(formData);

        setMessage(result.message);
        setSuccess(result.success);

        if (result.success) {
          router.refresh();
        }
      } catch (error) {
        console.error("Design Store update error:", error);
        setMessage("Unable to update product. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* PRODUCT INFORMATION */}

      <section className="rounded-2xl border border-[#E9DFD3] bg-white p-6 shadow-sm md:p-9">

        <div className="mb-7">
          <h2 className="font-serif text-2xl font-semibold text-[#29251F]">
            Product Information
          </h2>

          <div className="mt-3 h-[2px] w-12 bg-[#8A765E]" />
        </div>

        <div className="space-y-6">

          {/* REFERENCE NUMBER */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#604838]">
              Reference Number *
            </label>

            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              required
              placeholder="e.g. JT-001"
              className="w-full rounded-xl border border-[#E3D5C5] bg-[#FCFAF5] px-4 py-3.5 text-sm text-[#29251F] outline-none transition focus:border-[#8A765E] focus:ring-1 focus:ring-[#8A765E]"
            />
          </div>

          {/* PRODUCT TITLE */}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#604838]">
              Product Title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter product title"
              className="w-full rounded-xl border border-[#E3D5C5] bg-[#FCFAF5] px-4 py-3.5 text-sm text-[#29251F] outline-none transition focus:border-[#8A765E] focus:ring-1 focus:ring-[#8A765E]"
            />
          </div>

        </div>
      </section>

      {/* PRODUCT IMAGES */}

      <section className="rounded-2xl border border-[#E9DFD3] bg-white p-6 shadow-sm md:p-9">

        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#29251F]">
              Product Images
            </h2>

            <div className="mt-3 h-[2px] w-12 bg-[#8A765E]" />

            <p className="mt-3 text-xs text-[#918477]">
              Main image and up to four additional images.
            </p>
          </div>

          <span className="rounded-full bg-[#F5EFE6] px-4 py-2 text-xs font-semibold text-[#72573E]">
            {images.filter(Boolean).length} / 5 Images
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-[#E8DED3] bg-[#FCFAF6]"
            >

              {/* IMAGE HEADER */}

              <div className="flex items-center justify-between border-b border-[#E8DED3] px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-[#49392C]">
                    Image {index + 1}
                  </p>

                  <p className="mt-1 text-[10px] text-[#9A8C7D]">
                    {index === 0 ? "Main Product Image" : "Additional Image"}
                  </p>
                </div>

                {image && (
                  <button
                    type="button"
                    onClick={() => updateImage(index, "")}
                    disabled={isPending}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E9E0] text-[#795A43] transition hover:bg-red-100 hover:text-red-600"
                    title="Remove image"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>

              {/* IMAGE PREVIEW */}

              <div className="p-4">

                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[#E9DFD3] bg-[#F4F0E9]">

                  {image ? (
                    <img
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-[#B8A996]">
                      <FiImage size={38} className="mx-auto" />
                      <p className="mt-3 text-xs">No image available</p>
                    </div>
                  )}

                </div>

                {/* IMAGE URL */}

                <label className="mb-2 mt-4 block text-[10px] font-semibold uppercase tracking-wider text-[#766354]">
                  Image URL
                </label>

                <input
                  type="url"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  disabled={isPending}
                  placeholder="Enter image URL"
                  className="w-full rounded-lg border border-[#DDD2C6] bg-white px-3 py-3 text-xs outline-none transition focus:border-[#8A765E]"
                />

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* MESSAGE */}

      {message && (
        <div
          className={`rounded-xl border px-5 py-4 text-sm ${
            success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* ACTION BUTTONS */}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E9DFD3] bg-white p-5">

        <button
          type="button"
          disabled={isPending}
          onClick={() => router.push("/admin/design-store")}
          className="flex items-center gap-2 rounded-lg border border-[#DCCFC0] px-5 py-3 text-sm font-medium text-[#514438] transition hover:bg-[#F8F5F0]"
        >
          <FiArrowLeft size={16} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-[#29251F] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#59432F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <FiCheck size={16} />
              <FiSave size={16} />
              Save Changes
            </>
          )}
        </button>

      </div>

    </form>
  );
}
