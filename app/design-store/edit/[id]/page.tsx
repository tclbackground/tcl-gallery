"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  FiArrowLeft,
  FiSave,
  FiTrash2,
} from "react-icons/fi";

import { useParams } from "next/navigation";

type Product = {
  id: string;
  slNo: number | null;
  title: string;
  collection: string;
  description: string | null;
  price: number | null;
  image1: string;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  referenceNo: string | null;
  material: string | null;
  size: string | null;
};

const collections = [
  {
    value: "jewel-tree",
    label: "Jewel Tree",
  },
  {
    value: "living-legacy",
    label: "Living Legacy",
  },
  {
    value: "nature-window",
    label: "Nature Window Collection",
  },
  {
    value: "bags",
    label: "Bags",
  },
];

export default function EditDesignStoreProduct() {
  const params = useParams();

  const id =
    params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    const loadProduct =
      async () => {
        try {
          const response =
            await fetch(
              `/api/design-store/${id}`,
              {
                cache: "no-store",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Product not found"
            );
          }

          setProduct(data);
        } catch (error: any) {
          setError(
            error?.message ||
              "Failed to load product."
          );
        } finally {
          setLoading(false);
        }
      };

    loadProduct();
  }, [id]);

  // =====================================================
  // CHANGE
  // =====================================================

  const updateField = (
    field: keyof Product,
    value: any
  ) => {
    setProduct(
      (current) =>
        current
          ? {
              ...current,
              [field]: value,
            }
          : current
    );
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    if (!product) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response =
        await fetch(
          `/api/design-store/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              product
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update product."
        );
      }

      setProduct(data);

      setMessage(
        "Product updated successfully."
      );
    } catch (error: any) {
      setError(
        error?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this product?"
      );

    if (!confirmed) return;

    try {
      const response =
        await fetch(
          `/api/design-store/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete product."
        );
      }

      window.location.href =
        "/admin/design-store";
    } catch (error: any) {
      setError(
        error?.message ||
          "Failed to delete product."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (!product) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <p className="text-red-700">
          {error ||
            "Product not found."}
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#FBF9F0] text-[#22211B]">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 border-b border-[#C4A892]/30 pb-6 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <Link
            href="/admin/design-store"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#4D3024]"
          >
            <FiArrowLeft />
            Back to Design Store
          </Link>

          <h1 className="font-serif text-3xl font-semibold">
            Edit Product
          </h1>

        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <FiTrash2 />
            Delete
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#22211B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4D3024] disabled:opacity-50"
          >
            <FiSave />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>

      {/* STATUS */}

      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* LEFT */}

        <div className="lg:col-span-7">

          <div className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 shadow-sm">

            <h2 className="mb-6 font-serif text-2xl font-semibold">
              Product Information
            </h2>

            <div className="space-y-5">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                  Product Title *
                </label>

                <input
                  value={
                    product.title
                  }
                  onChange={(e) =>
                    updateField(
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                />

              </div>

              {/* COLLECTION + PRICE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Collection *
                  </label>

                  <select
                    value={
                      product.collection
                    }
                    onChange={(e) =>
                      updateField(
                        "collection",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                  >
                    {collections.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {
                            item.label
                          }
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    value={
                      product.price ??
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "price",
                        e.target.value
                          ? Number(
                              e.target
                                .value
                            )
                          : null
                      )
                    }
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                  />

                </div>

              </div>

              {/* REF + SL NO */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Reference No
                  </label>

                  <input
                    value={
                      product.referenceNo ||
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "referenceNo",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Sl No
                  </label>

                  <input
                    type="number"
                    value={
                      product.slNo ??
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "slNo",
                        e.target.value
                          ? Number(
                              e.target
                                .value
                            )
                          : null
                      )
                    }
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                  />

                </div>

              </div>

              {/* MATERIAL + SIZE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Material
                  </label>

                  <input
                    value={
                      product.material ||
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "material",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                    Size
                  </label>

                  <input
                    value={
                      product.size ||
                      ""
                    }
                    onChange={(e) =>
                      updateField(
                        "size",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#4D3024]">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={
                    product.description ||
                    ""
                  }
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-[#C4A892]/40 bg-[#FBF9F0] px-4 py-3 text-sm outline-none focus:border-[#4D3024]"
                />

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="lg:col-span-5">

          <div className="rounded-2xl border border-[#C4A892]/30 bg-white p-6 shadow-sm">

            <h2 className="mb-6 font-serif text-2xl font-semibold">
              Product Image
            </h2>

            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5F1E8]">

              <Image
                src={
                  product.image1
                }
                alt={
                  product.title
                }
                fill
                unoptimized
                className="object-cover"
              />

            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              The existing main product
              image is displayed here.
              Image replacement can be
              added separately if required.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}