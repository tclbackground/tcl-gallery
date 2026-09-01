"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  FiHeart,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";

type Product = {
  id: string;
  title: string | null;
  imageUrl: string | null;
  location: string | null;
  medium: string | null;
};

type WishlistItem = {
  id: string;
  product: Product;
};

export default function WishlistPage() {
  const {
    data: session,
    status,
  } = useSession();

  const [items, setItems] =
    useState<WishlistItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [removing, setRemoving] =
    useState<string | null>(null);

  // ==========================================================
  // LOAD WISHLIST
  // ==========================================================

  async function loadWishlist() {
    if (status !== "authenticated") {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/wishlist",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log(
        "Wishlist page:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load wishlist"
        );
      }

      setItems(data.wishlist || []);
    } catch (error) {
      console.error(
        "Wishlist loading error:",
        error
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadWishlist();
  }, [status]);

  // ==========================================================
  // LISTEN FOR WISHLIST UPDATE
  // ==========================================================

  useEffect(() => {
    function handleUpdate() {
      loadWishlist();
    }

    window.addEventListener(
      "wishlist-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        handleUpdate
      );
    };
  }, [status]);

  // ==========================================================
  // REMOVE
  // ==========================================================

  async function removeItem(
    wishlistId: string
  ) {
    if (removing) return;

    try {
      setRemoving(wishlistId);

      const response = await fetch(
        `/api/wishlist?id=${wishlistId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to remove artwork"
        );
      }

      // Remove from screen immediately

      setItems((current) =>
        current.filter(
          (item) =>
            item.id !== wishlistId
        )
      );

      // Update TopBar

      window.dispatchEvent(
        new CustomEvent(
          "wishlist-updated"
        )
      );
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      alert(
        "Unable to remove artwork."
      );
    } finally {
      setRemoving(null);
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    status === "loading" ||
    loading
  ) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F0] px-4 py-16">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <FiHeart
                size={40}
                className="mx-auto mb-4 animate-pulse text-[#4D3024]"
              />

              <p className="text-sm text-[#22211B]/60">
                Loading your wishlist...
              </p>

            </div>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================================
  // LOGIN REQUIRED
  // ==========================================================

  if (!session?.user) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F0] px-4 py-16">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-[#C4A892]/30 bg-white text-center">

            <FiHeart
              size={50}
              strokeWidth={1.2}
              className="mb-6 text-[#C4A892]"
            />

            <h1 className="font-serif text-4xl text-[#22211B]">
              My Wishlist
            </h1>

            <p className="mt-4 max-w-md text-sm text-[#22211B]/60">
              Login to save your favourite
              artworks and access your
              wishlist anytime.
            </p>

            <button
              onClick={() =>
                signIn(undefined, {
                  callbackUrl:
                    "/wishlist",
                })
              }
              className="mt-8 rounded-full bg-[#4D3024] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#22211B]"
            >
              Login to Continue
            </button>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#FBF9F0] px-4 py-16">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-[#C4A892]/30 bg-white text-center">

            <FiHeart
              size={50}
              strokeWidth={1.2}
              className="mb-6 text-[#C4A892]"
            />

            <h1 className="font-serif text-5xl text-[#22211B]">
              Your wishlist is empty
            </h1>

            <p className="mt-4 text-sm text-[#22211B]/60">
              Explore our collection and
              save the artworks you love.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4D3024] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#22211B]"
            >
              Explore Collection
              <FiArrowRight />
            </Link>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================================
  // WISHLIST
  // ==========================================================

  return (
    <main className="min-h-[70vh] bg-[#FBF9F0] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-end justify-between border-b border-[#C4A892]/30 pb-6">

          <div>

            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4D3024]">
              <FiHeart size={14} />
              Saved Artworks
            </div>

            <h1 className="font-serif text-4xl text-[#22211B] sm:text-5xl">
              My Wishlist
            </h1>

          </div>

          <div className="text-sm text-[#22211B]/60">
            {items.length}{" "}
            {items.length === 1
              ? "artwork"
              : "artworks"}{" "}
            saved
          </div>

        </div>

        {/* PRODUCTS */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {items.map((item) => {

            const product =
              item.product;

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-[#C4A892]/30 bg-white shadow-sm transition hover:shadow-lg"
              >

                {/* IMAGE */}

                <Link
                  href={`/shop/${product.id}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#E8DBCA]/30">

                    {product.imageUrl ? (
                      <Image
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.title ||
                          "Artwork"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#22211B]/40">
                        No Image
                      </div>
                    )}

                  </div>
                </Link>

                {/* DETAILS */}

                <div className="p-5">

                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4D3024]">
                    Fine Art
                  </p>

                  <h2 className="mt-2 line-clamp-2 font-serif text-xl text-[#22211B]">
                    {product.title ||
                      "Untitled Artwork"}
                  </h2>

                  {product.location && (
                    <p className="mt-2 text-sm text-[#22211B]/60">
                      {product.location}
                    </p>
                  )}

                  {product.medium && (
                    <p className="mt-1 text-xs text-[#22211B]/40">
                      {product.medium}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-2">

                    <Link
                      href={`/shop/${product.id}`}
                      className="flex-1 rounded-lg bg-[#4D3024] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#22211B]"
                    >
                      View Artwork
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      disabled={
                        removing ===
                        item.id
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C4A892]/40 text-[#4D3024] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                    >
                      <FiTrash2
                        size={16}
                      />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}