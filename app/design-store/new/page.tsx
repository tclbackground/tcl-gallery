"use client";

import {
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

import Image from "next/image";

import {
  FiUploadCloud,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";

import Link from "next/link";

import { uploadDesignStoreProduct } from "@/app/actions/uploadDesignStoreProduct";

type ImageState = {
  file: File | null;
  preview: string | null;
};

const emptyImage: ImageState = {
  file: null,
  preview: null,
};

export default function AddDesignStoreProductPage() {
  // =====================================================
  // IMAGE STATES
  // =====================================================

  const [image1, setImage1] =
    useState<ImageState>({
      ...emptyImage,
    });

  const [image2, setImage2] =
    useState<ImageState>({
      ...emptyImage,
    });

  const [image3, setImage3] =
    useState<ImageState>({
      ...emptyImage,
    });

  const [image4, setImage4] =
    useState<ImageState>({
      ...emptyImage,
    });

  // =====================================================
  // FORM STATES
  // =====================================================

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState<{
      type: "success" | "error";
      msg: string;
    } | null>(null);

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<
      React.SetStateAction<ImageState>
    >
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    // Check image type

    if (!file.type.startsWith("image/")) {
      setStatus({
        type: "error",
        msg:
          "Please select a valid image file.",
      });

      return;
    }

    // Maximum 10MB

    if (file.size > 10 * 1024 * 1024) {
      setStatus({
        type: "error",
        msg:
          "Image size must be less than 10MB.",
      });

      return;
    }

    // Preview

    const preview =
      URL.createObjectURL(file);

    setter({
      file,
      preview,
    });

    setStatus(null);
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (
    image: ImageState,
    setter: React.Dispatch<
      React.SetStateAction<ImageState>
    >
  ) => {
    if (image.preview) {
      URL.revokeObjectURL(
        image.preview
      );
    }

    setter({
      file: null,
      preview: null,
    });
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setStatus(null);

    try {
      // ================================================
      // MAIN IMAGE REQUIRED
      // ================================================

      if (!image1.file) {
        setStatus({
          type: "error",
          msg:
            "Please upload the main product image.",
        });

        setLoading(false);

        return;
      }

      // ================================================
      // GET FORM DATA
      // ================================================

      const form =
        event.currentTarget;

      const formData =
        new FormData(form);

      // ================================================
      // ADD IMAGES
      // ================================================

      formData.set(
        "image1",
        image1.file
      );

      if (image2.file) {
        formData.set(
          "image2",
          image2.file
        );
      }

      if (image3.file) {
        formData.set(
          "image3",
          image3.file
        );
      }

      if (image4.file) {
        formData.set(
          "image4",
          image4.file
        );
      }

      // ================================================
      // CALL SERVER ACTION
      // ================================================

      const result =
        await uploadDesignStoreProduct(
          formData
        );

      // ================================================
      // SUCCESS
      // ================================================

      if (result.success) {
        setStatus({
          type: "success",
          msg:
            result.message ||
            "Design Store product added successfully!",
        });

        // Reset form

        form.reset();

        // Clear images

        removeImage(
          image1,
          setImage1
        );

        removeImage(
          image2,
          setImage2
        );

        removeImage(
          image3,
          setImage3
        );

        removeImage(
          image4,
          setImage4
        );
      }

      // ================================================
      // ERROR
      // ================================================

      else {
        setStatus({
          type: "error",
          msg:
            result.message ||
            "Failed to add product.",
        });
      }
    } catch (error: any) {
      console.error(
        "DESIGN STORE FORM ERROR:",
        error
      );

      setStatus({
        type: "error",
        msg:
          error?.message ||
          "Something went wrong while uploading the product.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // IMAGE UPLOAD BOX
  // =====================================================

  const ImageUploadBox = ({
    label,
    image,
    setter,
    required = false,
  }: {
    label: string;
    image: ImageState;
    setter: React.Dispatch<
      React.SetStateAction<ImageState>
    >;
    required?: boolean;
  }) => {
    return (
      <div>
        {/* LABEL */}

        <label
          className="
            mb-2
            block
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-[#4D3024]
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>

        {/* UPLOAD */}

        {!image.preview ? (
          <label
            className="
              flex
              h-[240px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-[#C4A892]
              bg-[#FBF9F0]
              p-6
              text-center
              transition
              hover:border-[#4D3024]
              hover:bg-[#F1EBDD]
            "
          >
            <FiUploadCloud
              className="
                mb-4
                text-4xl
                text-[#4D3024]
              "
            />

            <span
              className="
                text-sm
                font-semibold
                text-[#22211B]
              "
            >
              Click to upload image
            </span>

            <span
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              JPG, JPEG, PNG or WEBP
            </span>

            <span
              className="
                mt-1
                text-[11px]
                text-gray-400
              "
            >
              Maximum 10MB
            </span>

            <input
              type="file"
              accept="
                image/jpeg,
                image/jpg,
                image/png,
                image/webp
              "
              onChange={(event) =>
                handleImageChange(
                  event,
                  setter
                )
              }
              className="hidden"
            />
          </label>
        ) : (
          /* PREVIEW */

          <div
            className="
              relative
              h-[240px]
              overflow-hidden
              rounded-2xl
              border
              border-[#C4A892]
              bg-[#FBF9F0]
            "
          >
            <Image
              src={image.preview}
              alt={label}
              fill
              unoptimized
              className="object-cover"
            />

            {/* REMOVE */}

            <button
              type="button"
              onClick={() =>
                removeImage(
                  image,
                  setter
                )
              }
              className="
                absolute
                right-3
                top-3
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[#22211B]
                text-white
                shadow-lg
                transition
                hover:bg-[#4D3024]
              "
            >
              <FiX size={18} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#FBF9F0]
        px-4
        py-8
        text-[#22211B]
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href="/admin"
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-[#4D3024]
          "
        >
          <FiArrowLeft size={16} />

          Back to Admin
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-8
            border-b
            border-[#C4A892]/30
            pb-5
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[3px]
              text-[#4D3024]
            "
          >
            Admin Control Panel
          </p>

          <h1
            className="
              mt-1
              font-serif
              text-3xl
              font-semibold
              sm:text-4xl
            "
          >
            Add Design Store Product
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-gray-500
            "
          >
            Add a product to Jewel Tree,
            Living Legacy, Nature Window
            Collection or Bags.
          </p>
        </div>

        {/* ==================================================
            STATUS
        ================================================== */}

        {status && (
          <div
            className={`
              mb-6
              flex
              items-center
              gap-3
              rounded-xl
              border
              p-4
              text-sm
              font-medium
              ${
                status.type ===
                "success"
                  ? "border-[#C4A892] bg-[#C4A892]/20 text-[#4D3024]"
                  : "border-red-200 bg-red-100 text-red-700"
              }
            `}
          >
            {status.type ===
            "success" ? (
              <FiCheckCircle
                className="shrink-0 text-xl"
              />
            ) : (
              <FiAlertCircle
                className="shrink-0 text-xl"
              />
            )}

            <span>
              {status.msg}
            </span>
          </div>
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#C4A892]/30
            bg-white
            shadow-xl
          "
        >

          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div className="p-6 sm:p-8">

            <div className="mb-6">
              <h2
                className="
                  font-serif
                  text-2xl
                  font-semibold
                "
              >
                Product Information
              </h2>

              <div
                className="
                  mt-2
                  h-px
                  w-12
                  bg-[#68745A]
                "
              />
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              "
            >

              {/* ==================================================
                  TITLE
              ================================================== */}

              <div className="md:col-span-2">

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Product Title *

                </label>

                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter product title"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    text-[#22211B]
                    outline-none
                    transition
                    focus:border-[#4D3024]
                    focus:ring-1
                    focus:ring-[#4D3024]/20
                  "
                />

              </div>

              {/* ==================================================
                  COLLECTION
              ================================================== */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Collection *

                </label>

                <select
                  name="collection"
                  required
                  defaultValue=""
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    text-[#22211B]
                    outline-none
                    transition
                    focus:border-[#4D3024]
                    focus:ring-1
                    focus:ring-[#4D3024]/20
                  "
                >

                  <option value="">
                    Select Collection
                  </option>

                  <option value="jewel-tree">
                    Jewel Tree
                  </option>

                  <option value="living-legacy">
                    Living Legacy
                  </option>

                  <option value="nature-window">
                    Nature Window Collection
                  </option>

                  <option value="bags">
                    Bags
                  </option>

                </select>

              </div>

              {/* ==================================================
                  PRICE
              ================================================== */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  placeholder="5000"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#4D3024]
                    focus:ring-1
                    focus:ring-[#4D3024]/20
                  "
                />

              </div>

              {/* ==================================================
                  REFERENCE
              ================================================== */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Reference No
                </label>

                <input
                  type="text"
                  name="referenceNo"
                  placeholder="JT-001"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#4D3024]
                  "
                />

              </div>

              {/* ==================================================
                  SL NO
              ================================================== */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Sl No
                </label>

                <input
                  type="number"
                  name="slNo"
                  min="1"
                  placeholder="1"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#4D3024]
                  "
                />

              </div>

              {/* ==================================================
                  MATERIAL
              ================================================== */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Material
                </label>

                <input
                  type="text"
                  name="material"
                  placeholder="e.g. Brass, Wood, Fabric"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#4D3024]
                  "
                />

              </div>

              {/* ==================================================
                  SIZE
              ================================================== */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Size
                </label>

                <input
                  type="text"
                  name="size"
                  placeholder="e.g. 12 × 18 inches"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#4D3024]
                  "
                />

              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div className="md:col-span-2">

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#4D3024]
                  "
                >
                  Product Description
                </label>

                <textarea
                  name="description"
                  rows={5}
                  placeholder="Describe the product, its story, material, craftsmanship and other details..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition
                    focus:border-[#4D3024]
                    focus:ring-1
                    focus:ring-[#4D3024]/20
                  "
                />

              </div>

            </div>
          </div>

          {/* ==================================================
              IMAGES
          ================================================== */}

          <div
            className="
              border-t
              border-[#C4A892]/30
              p-6
              sm:p-8
            "
          >

            <div className="mb-6">

              <h2
                className="
                  font-serif
                  text-2xl
                  font-semibold
                "
              >
                Product Images
              </h2>

              <div
                className="
                  mt-2
                  h-px
                  w-12
                  bg-[#68745A]
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  text-gray-500
                "
              >
                Upload high-quality product
                images. The main image is
                required.
              </p>

            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
              "
            >

              {/* IMAGE 1 */}

              <ImageUploadBox
                label="Main Product Image"
                image={image1}
                setter={setImage1}
                required
              />

              {/* IMAGE 2 */}

              <ImageUploadBox
                label="Image 2"
                image={image2}
                setter={setImage2}
              />

              {/* IMAGE 3 */}

              <ImageUploadBox
                label="Image 3"
                image={image3}
                setter={setImage3}
              />

              {/* IMAGE 4 */}

              <ImageUploadBox
                label="Image 4"
                image={image4}
                setter={setImage4}
              />

            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-[#C4A892]/30
              bg-[#FAF7F0]
              p-6
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:p-8
            "
          >

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Fields marked with *
              are required.
            </p>

            <div
              className="
                flex
                gap-3
              "
            >

              <Link
                href="/admin"
                className="
                  rounded-full
                  border
                  border-[#C4A892]
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#4D3024]
                  transition
                  hover:bg-[#F1EBDD]
                "
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="
                  rounded-full
                  bg-[#22211B]
                  px-8
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-[#4D3024]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Publishing..."
                  : "Publish Product"}
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}