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
} from "react-icons/fi";

import { uploadFineArt } from "@/app/actions/uploadFineArt";

type ImageState = {
  file: File | null;
  preview: string | null;
};

export default function AddFineArtPage() {
  const [image1, setImage1] =
    useState<ImageState>({
      file: null,
      preview: null,
    });

  const [image2, setImage2] =
    useState<ImageState>({
      file: null,
      preview: null,
    });

  const [image3, setImage3] =
    useState<ImageState>({
      file: null,
      preview: null,
    });

  const [photo, setPhoto] =
    useState<ImageState>({
      file: null,
      preview: null,
    });

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState<{
      type: "success" | "error";
      msg: string;
    } | null>(null);

  // =====================================================
  // IMAGE HANDLER
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

    if (!file.type.startsWith("image/")) {
      setStatus({
        type: "error",
        msg: "Please select a valid image.",
      });

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatus({
        type: "error",
        msg:
          "Image size must be less than 10MB.",
      });

      return;
    }

    setter({
      file,
      preview:
        URL.createObjectURL(file),
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
  // SUBMIT
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
            "Please upload the main artwork image.",
        });

        setLoading(false);

        return;
      }

      // ================================================
      // FORM DATA
      // ================================================

      const form =
        event.currentTarget;

      const formData =
        new FormData(form);

      // ================================================
      // IMAGES
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

      if (photo.file) {
        formData.set(
          "photo",
          photo.file
        );
      }

      // ================================================
      // UPLOAD
      // ================================================

      const result =
        await uploadFineArt(
          formData
        );

      // ================================================
      // RESULT
      // ================================================

      if (result.success) {
        setStatus({
          type: "success",
          msg:
            result.message,
        });

        form.reset();

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
          photo,
          setPhoto
        );
      } else {
        setStatus({
          type: "error",
          msg:
            result.message,
        });
      }
    } catch (error: any) {
      console.error(
        "FINE ART FRONTEND ERROR:",
        error
      );

      setStatus({
        type: "error",
        msg:
          error?.message ||
          "Something went wrong.",
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
    required,
    image,
    setter,
  }: {
    label: string;
    required?: boolean;
    image: ImageState;
    setter: React.Dispatch<
      React.SetStateAction<ImageState>
    >;
  }) => {
    return (
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
          {label}

          {required && (
            <span className="ml-1">
              *
            </span>
          )}
        </label>

        {!image.preview ? (
          <label
            className="
              flex
              min-h-[220px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-[#C4A892]
              bg-[#FBF9F0]
              p-5
              text-center
              transition
              hover:bg-[#F1EBDD]
            "
          >
            <FiUploadCloud
              className="
                mb-3
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
              Click to upload
            </span>

            <span
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              JPG, JPEG, PNG or WEBP
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
          <div
            className="
              relative
              h-[220px]
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
              "
            >
              <FiX />
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
        py-10
        text-[#22211B]
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-5xl">

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
              text-4xl
              font-semibold
            "
          >
            Add Fine Art
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Add a new artwork to the Fine Art
            collection.
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
                status.type === "success"
                  ? "border-[#C4A892] bg-[#C4A892]/20 text-[#4D3024]"
                  : "border-red-200 bg-red-100 text-red-700"
              }
            `}
          >
            {status.type ===
            "success" ? (
              <FiCheckCircle className="text-xl" />
            ) : (
              <FiAlertCircle className="text-xl" />
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
            space-y-8
            rounded-2xl
            border
            border-[#C4A892]/30
            bg-white
            p-6
            shadow-xl
            sm:p-8
          "
        >

          {/* ==================================================
              ARTWORK INFORMATION
          ================================================== */}

          <section>
            <div className="mb-5">
              <h2
                className="
                  font-serif
                  text-2xl
                  font-semibold
                "
              >
                Artwork Information
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

              {/* TITLE */}

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
                  Title of the Art *
                </label>

                <input
                  type="text"
                  name="titleOfArt"
                  required
                  placeholder="e.g. Wild White"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>

              {/* ARTIST */}

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
                  Artist Name *
                </label>

                <input
                  type="text"
                  name="artistName"
                  required
                  placeholder="Artist name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>

              {/* REFERENCE */}

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
                  Item Ref No *
                </label>

                <input
                  type="text"
                  name="itemRefNo"
                  required
                  placeholder="e.g. FA-001"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>

              {/* SL NO */}

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
                  placeholder="001"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>

              {/* YEAR */}

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
                  Year
                </label>

                <input
                  type="number"
                  name="year"
                  placeholder="2025"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              CLASSIFICATION
          ================================================== */}

          <section
            className="
              border-t
              border-[#C4A892]/30
              pt-8
            "
          >
            <div className="mb-5">
              <h2
                className="
                  font-serif
                  text-2xl
                  font-semibold
                "
              >
                Classification
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

              {/* CATEGORY */}

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
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value="Fine Art"
                  readOnly
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#F1EBDD]
                    px-4
                    py-3
                    text-gray-600
                    outline-none
                  "
                />
              </div>

              {/* PAINTING TYPE */}

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
                  Painting Type
                </label>

                <select
                  name="paintingType"
                  defaultValue=""
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                >
                  <option value="">
                    Select Painting Type
                  </option>

                  <option value="Acrylic on Canvas">
                    Acrylic on Canvas
                  </option>

                  <option value="Oil on Canvas">
                    Oil on Canvas
                  </option>

                  <option value="Watercolour">
                    Watercolour
                  </option>

                  <option value="Mixed Media">
                    Mixed Media
                  </option>

                  <option value="Acrylic">
                    Acrylic
                  </option>

                  <option value="Oil">
                    Oil
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* PRODUCT CATEGORY */}

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
                  Product Category
                </label>

                <input
                  type="text"
                  name="productCategory"
                  placeholder="e.g. Landscape"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>

              {/* WIDTH */}

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
                  Width (CMS)
                </label>

                <input
                  type="text"
                  name="widthCms"
                  placeholder="e.g. 24"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                />
              </div>

              {/* FRAME */}

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
                  With Frame
                </label>

                <select
                  name="withFrame"
                  defaultValue=""
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#C4A892]/40
                    bg-[#FBF9F0]
                    px-4
                    py-3
                    outline-none
                    focus:border-[#4D3024]
                  "
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* ==================================================
              IMAGES
          ================================================== */}

          <section
            className="
              border-t
              border-[#C4A892]/30
              pt-8
            "
          >
            <div className="mb-5">
              <h2
                className="
                  font-serif
                  text-2xl
                  font-semibold
                "
              >
                Artwork Images
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
                  mt-2
                  text-sm
                  text-gray-500
                "
              >
                Main artwork image is required.
                Additional images are optional.
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
              <ImageUploadBox
                label="Main Artwork Image"
                required
                image={image1}
                setter={setImage1}
              />

              <ImageUploadBox
                label="Image 2"
                image={image2}
                setter={setImage2}
              />

              <ImageUploadBox
                label="Image 3"
                image={image3}
                setter={setImage3}
              />

              <ImageUploadBox
                label="Photo"
                image={photo}
                setter={setPhoto}
              />
            </div>
          </section>

          {/* ==================================================
              PUBLISH
          ================================================== */}

          <div
            className="
              flex
              justify-end
              border-t
              border-[#C4A892]/30
              pt-6
            "
          >
            <button
              type="submit"
              disabled={loading}
              className="
                rounded-full
                bg-[#22211B]
                px-10
                py-4
                text-sm
                font-semibold
                text-[#FBF9F0]
                shadow-lg
                transition
                hover:bg-[#4D3024]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Publishing Fine Art..."
                : "Publish Fine Art"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}