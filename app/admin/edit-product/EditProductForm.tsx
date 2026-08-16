"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  FiCheck,
  FiImage,
  FiUpload,
  FiX,
} from "react-icons/fi";

import { updateProduct } from "@/app/actions/admin";

// ==========================================================
// TYPES
// ==========================================================

type Artist = {
  id: string;
  name: string;
};

type ImageSlot = {
  url: string;
  file: File | null;
  preview: string;
};

type EditProductFormProps = {
  product: any;
  artists?: Artist[];
};

// ==========================================================
// IMAGE COMPRESSION
// ==========================================================

async function compressImageFile(
  file: File
): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();

      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        const maxDim = 1920;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round(
              (height * maxDim) / width
            );

            width = maxDim;
          } else {
            width = Math.round(
              (width * maxDim) / height
            );

            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const newFileName =
              file.name.replace(
                /\.[^/.]+$/,
                ".webp"
              );

            resolve(
              new File(
                [blob],
                newFileName,
                {
                  type: "image/webp",
                }
              )
            );
          },
          "image/webp",
          0.85
        );
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}

// ==========================================================
// CREATE INITIAL 5 IMAGE SLOTS
// ==========================================================

function createInitialImageSlots(
  product: any
): ImageSlot[] {
  const additionalImages = Array.isArray(
    product?.images
  )
    ? product.images
    : [];

  const allImages = [
    product?.imageUrl || "",
    ...additionalImages,
  ];

  return Array.from(
    { length: 5 },
    (_, index) => {
      const url =
        typeof allImages[index] === "string"
          ? allImages[index]
          : "";

      return {
        url,
        file: null,
        preview: url,
      };
    }
  );
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function EditProductForm({
  product,
  artists = [],
}: EditProductFormProps) {
  const router = useRouter();

  const fileInputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<{
      text: string;
      type: "success" | "error";
    } | null>(null);

  const [images, setImages] =
    useState<ImageSlot[]>(
      createInitialImageSlots(product)
    );

  // ========================================================
  // CLEANUP OBJECT URLS
  // ========================================================

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (
          image.preview &&
          image.preview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(
            image.preview
          );
        }
      });
    };
  }, []);

  // ========================================================
  // IMAGE SELECT
  // ========================================================

  const handleImageSelect = async (
    index: number,
    file: File | null
  ) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({
        text:
          "Please select a valid image file.",
        type: "error",
      });

      return;
    }

    try {
      const compressed =
        await compressImageFile(file);

      const preview =
        URL.createObjectURL(compressed);

      setImages((previous) => {
        const next = [...previous];

        const oldPreview =
          next[index]?.preview || "";

        if (
          oldPreview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(
            oldPreview
          );
        }

        next[index] = {
          url: "",
          file: compressed,
          preview,
        };

        return next;
      });

      setMessage(null);
    } catch (error) {
      console.error(
        "Image processing error:",
        error
      );

      setMessage({
        text:
          "Unable to process the selected image.",
        type: "error",
      });
    }
  };

  // ========================================================
  // REMOVE IMAGE
  // ========================================================

  const removeImage = (
    index: number
  ) => {
    setImages((previous) => {
      const next = [...previous];

      const oldPreview =
        next[index]?.preview || "";

      if (
        oldPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          oldPreview
        );
      }

      next[index] = {
        url: "",
        file: null,
        preview: "",
      };

      return next;
    });

    const input =
      fileInputRefs.current[index];

    if (input) {
      input.value = "";
    }
  };

  // ========================================================
  // OPEN FILE SELECTOR
  // ========================================================

  const openFileSelector = (
    index: number
  ) => {
    fileInputRefs.current[index]?.click();
  };

  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ----------------------------------------------------
      // CREATE FORM DATA
      // ----------------------------------------------------

      const formData = new FormData(
        event.currentTarget
      );

      // ----------------------------------------------------
      // IMPORTANT:
      // PRODUCT ID
      // ----------------------------------------------------

      formData.set(
        "id",
        String(product.id)
      );

      // ----------------------------------------------------
      // MAIN IMAGE
      // ----------------------------------------------------

      if (images[0]?.file) {
        formData.set(
          "image",
          images[0].file
        );
      }

      formData.set(
        "imageUrlInput",
        images[0]?.url || ""
      );

      // ----------------------------------------------------
      // ADDITIONAL IMAGES
      // ----------------------------------------------------

      for (
        let index = 1;
        index < 5;
        index++
      ) {
        const imageNumber =
          index + 1;

        const image =
          images[index];

        // Existing image URL
        formData.set(
          `imageUrlInput${imageNumber}`,
          image?.url || ""
        );

        // New uploaded file
        if (image?.file) {
          formData.set(
            `image${imageNumber}`,
            image.file
          );
        }
      }

      // ----------------------------------------------------
      // EXISTING IMAGES
      //
      // IMPORTANT:
      // Send all 4 additional image slots.
      // Empty slots remain empty.
      // ----------------------------------------------------

      const additionalImages =
        images
          .slice(1, 5)
          .map(
            (image) =>
              image?.url || ""
          );

      formData.set(
        "existingImages",
        JSON.stringify(
          additionalImages
        )
      );

      console.log(
        "STEP 1: Updating artwork..."
      );

      console.log(
        "Artwork ID:",
        formData.get("id")
      );

      console.log(
        "Title:",
        formData.get("title")
      );

      console.log(
        "Price:",
        formData.get("price")
      );

      console.log(
        "Category:",
        formData.get("category")
      );

      console.log(
        "Artist:",
        formData.get("artistId")
      );

      // ----------------------------------------------------
      // SERVER ACTION
      // ----------------------------------------------------

      const response =
        await updateProduct(
          formData
        );

      console.log(
        "STEP 2: Server response:",
        response
      );

      // ----------------------------------------------------
      // SERVER ERROR
      // ----------------------------------------------------

      if (!response?.success) {
        setMessage({
          text:
            response?.message ||
            "Failed to update artwork.",
          type: "error",
        });

        setLoading(false);

        return;
      }

      // ----------------------------------------------------
      // SUCCESS
      // ----------------------------------------------------

      setMessage({
        text:
          "Artwork updated successfully.",
        type: "success",
      });

      console.log(
        "STEP 3: Artwork updated successfully."
      );

      // Give React a moment to display success
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      // ----------------------------------------------------
      // NAVIGATION
      // ----------------------------------------------------

      console.log(
        "STEP 4: Redirecting to artworks..."
      );

      setLoading(false);

      router.push(
        "/admin/artworks"
      );
    } catch (error: any) {
      console.error(
        "================================"
      );

      console.error(
        "UPDATE ARTWORK ERROR"
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Digest:",
        error?.digest
      );

      console.error(
        "Stack:",
        error?.stack
      );

      console.error(
        "================================"
      );

      setMessage({
        text:
          error?.message ||
          "Something went wrong while updating the artwork.",
        type: "error",
      });

      setLoading(false);
    }
  };

  // ========================================================
  // RENDER IMAGE SLOT
  // ========================================================

  const renderImageSlot = (
    index: number
  ) => {
    const image =
      images[index];

    const slotNumber =
      index + 1;

    const hasImage =
      Boolean(image?.preview);

    return (
      <div
        key={slotNumber}
        className="rounded-xl border border-[#E4D8CB] bg-[#FCFAF6] overflow-hidden"
      >
        {/* HEADER */}

        <div className="flex items-center justify-between px-3 py-2 border-b border-[#E8DED4]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4D3024]">
              Image {slotNumber}
            </p>

            <p className="text-[8px] text-gray-400">
              {index === 0
                ? "Main image"
                : "Additional image"}
            </p>
          </div>

          {hasImage && (
            <button
              type="button"
              onClick={() =>
                removeImage(index)
              }
              disabled={loading}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-[#22211B] text-white hover:bg-red-600 transition disabled:opacity-50"
              title="Remove image"
            >
              <FiX size={12} />
            </button>
          )}
        </div>

        {/* PREVIEW */}

        <div className="p-3">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-[#F3EEE6] border border-[#E6D8CA]">
            {hasImage ? (
              <img
                src={image.preview}
                alt={`Artwork image ${slotNumber}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#C4A892]">
                <FiImage
                  size={42}
                  strokeWidth={1.3}
                />

                <span className="text-[9px] mt-2">
                  No image
                </span>
              </div>
            )}
          </div>

          {/* FILE INPUT */}

          <input
            ref={(element) => {
              fileInputRefs.current[
                index
              ] = element;
            }}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file =
                event.target.files?.[0] ||
                null;

              handleImageSelect(
                index,
                file
              );
            }}
          />

          {/* UPLOAD BUTTON */}

          <button
            type="button"
            onClick={() =>
              openFileSelector(index)
            }
            disabled={loading}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-[#C4A892] bg-white px-3 py-2 text-[10px] font-semibold text-[#4D3024] hover:bg-[#F5EFE8] transition disabled:opacity-50"
          >
            <FiUpload size={12} />

            {hasImage
              ? "Replace Image"
              : "Upload Image"}
          </button>

          {/* NEW IMAGE STATUS */}

          {image?.file && (
            <div className="flex items-center gap-1 mt-2 text-[8px] text-green-700">
              <FiCheck size={10} />

              New image selected
            </div>
          )}
        </div>
      </div>
    );
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ==================================================
          MESSAGE
      ================================================== */}

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ==================================================
          IMPORTANT HIDDEN PRODUCT DATA
      ================================================== */}

      <input
        type="hidden"
        name="id"
        value={product.id}
      />

      <input
        type="hidden"
        name="existingImageUrl"
        value={product.imageUrl || ""}
      />

      <input
        type="hidden"
        name="existingImages"
        value={JSON.stringify(
          product.images || []
        )}
      />

      {/* ==================================================
          BASIC INFORMATION
      ================================================== */}

      <div className="rounded-xl border border-[#E4D8CB] bg-white p-4 space-y-4">
        {/* TITLE */}

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4D3024] mb-1.5">
            Title
          </label>

          <input
            type="text"
            name="title"
            defaultValue={
              product.title || ""
            }
            required
            className="w-full rounded-lg border border-[#CFC4B8] bg-white px-3 py-2.5 text-sm text-[#22211B] outline-none focus:border-[#4D3024] focus:ring-1 focus:ring-[#4D3024]"
            placeholder="Artwork title"
          />
        </div>

        {/* PRICE + CATEGORY */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PRICE */}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4D3024] mb-1.5">
              Price
            </label>

            <input
              type="number"
              name="price"
              defaultValue={
                product.price ?? ""
              }
              min="0"
              step="0.01"
              required
              className="w-full rounded-lg border border-[#CFC4B8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4D3024] focus:ring-1 focus:ring-[#4D3024]"
              placeholder="Enter price"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4D3024] mb-1.5">
              Category
            </label>

            <select
              name="category"
              defaultValue={
                product.category || ""
              }
              required
              className="w-full rounded-lg border border-[#CFC4B8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4D3024] focus:ring-1 focus:ring-[#4D3024]"
            >
              <option value="">
                Select Category
              </option>

              <option value="Photography">
                Photography
              </option>

              <option value="Fine Art">
                Fine Art
              </option>

              <option value="Nature">
                Nature
              </option>

              <option value="Landscape">
                Landscape
              </option>

              <option value="Abstract">
                Abstract
              </option>

              <option value="Architecture">
                Architecture
              </option>
            </select>
          </div>
        </div>

        {/* ARTIST */}

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4D3024] mb-1.5">
            Artist
          </label>

          <select
            name="artistId"
            defaultValue={
              product.artistId || ""
            }
            className="w-full rounded-lg border border-[#CFC4B8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4D3024] focus:ring-1 focus:ring-[#4D3024]"
          >
            <option value="">
              Select Artist
            </option>

            {artists.map((artist) => (
              <option
                key={artist.id}
                value={artist.id}
              >
                {artist.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==================================================
          ARTWORK IMAGES
      ================================================== */}

      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#22211B]">
              Artwork Images
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Upload up to 5 artwork images.
            </p>
          </div>

          <span className="text-[10px] rounded-full bg-[#F1E9DF] text-[#4D3024] px-3 py-1 font-semibold">
            {
              images.filter(
                (image) =>
                  Boolean(
                    image.preview
                  )
              ).length
            }{" "}
            / 5
          </span>
        </div>

        {/* IMAGE GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(
            (_, index) =>
              renderImageSlot(index)
          )}
        </div>
      </div>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <div className="rounded-xl border border-[#E4D8CB] bg-white p-4">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4D3024] mb-1.5">
          Description
        </label>

        <textarea
          name="description"
          defaultValue={
            product.description || ""
          }
          rows={5}
          className="w-full resize-y rounded-lg border border-[#CFC4B8] bg-white px-3 py-3 text-sm text-[#22211B] outline-none focus:border-[#4D3024] focus:ring-1 focus:ring-[#4D3024]"
          placeholder="Enter artwork description..."
        />
      </div>

      {/* ==================================================
          UPDATE BUTTON
      ================================================== */}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#22211B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D3024] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />

            Updating Artwork...
          </>
        ) : (
          <>
            <FiCheck size={16} />

            Update Artwork & Images
          </>
        )}
      </button>
    </form>
  );
}