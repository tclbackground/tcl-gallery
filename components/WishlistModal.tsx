
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type WishlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type WishlistProduct = {
  id: string;
  title: string;
  imageUrl?: string | null;
  image?: string | null;
  location?: string | null;
  medium?: string | null;
};

export default function WishlistModal({
  isOpen,
  onClose,
}: WishlistModalProps) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/wishlist", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please log in to view your wishlist."
            : "Unable to load your wishlist."
        );
      }

      const data = await response.json();

      const products = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.wishlist)
            ? data.wishlist
            : [];

      setItems(
        products.map((item: any) => {
          const product = item.product ?? item;

          return {
            id: String(product.id ?? product._id ?? item.productId ?? ""),
            title: String(
              product.title ??
                product.TITLE ??
                product["Title of the Art"] ??
                "Untitled Artwork"
            ),
            imageUrl:
              product.imageUrl ??
              product.image ??
              product["IMAGE URL"] ??
              product["Image 1"] ??
              null,
            location: product.location ?? product.LOCATION ?? null,
            medium: product.medium ?? product.MEDIUM ?? null,
          };
        }).filter((item: WishlistProduct) => item.id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadWishlist();
    }
  }, [isOpen, loadWishlist]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-modal-title"
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <h2
              id="wishlist-modal-title"
              className="font-serif text-2xl text-stone-900"
            >
              My Wishlist
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {items.length} saved {items.length === 1 ? "artwork" : "artworks"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-stone-600 transition hover:bg-stone-100"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="py-16 text-center text-sm text-stone-500">
              Loading your wishlist...
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => void loadWishlist()}
                className="mt-4 rounded-lg bg-[#4D3024] px-5 py-3 text-sm text-white"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-5xl text-stone-300">♡</div>
              <h3 className="font-serif text-xl text-stone-900">
                Your wishlist is empty
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Save your favourite artworks to find them here.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-6 inline-block rounded-lg bg-[#4D3024] px-6 py-3 text-sm text-white transition hover:bg-[#22211B]"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => {
                const imageUrl = item.imageUrl ?? item.image;

                return (
                  <article
                    key={item.id}
                    className="flex gap-4 border-b border-stone-100 pb-5"
                  >
                    <Link
                      href={`/shop/${encodeURIComponent(item.id)}`}
                      onClick={onClose}
                      className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-stone-400">
                          No image
                        </span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1 py-1">
                      <p className="text-[10px] uppercase tracking-widest text-[#4D3024]">
                        Fine Art
                      </p>

                      <h3 className="mt-2 line-clamp-2 font-serif text-lg text-stone-900">
                        {item.title}
                      </h3>

                      {item.location && (
                        <p className="mt-1 text-sm text-stone-500">
                          {item.location}
                        </p>
                      )}

                      {item.medium && (
                        <p className="mt-1 text-xs text-stone-400">
                          {item.medium}
                        </p>
                      )}

                      <Link
                        href={`/shop/${encodeURIComponent(item.id)}`}
                        onClick={onClose}
                        className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-[#4D3024] underline underline-offset-4"
                      >
                        View Artwork
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="border-t border-stone-200 p-5">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="block rounded-lg border border-stone-300 px-5 py-3 text-center text-sm font-medium text-stone-800 transition hover:border-[#4D3024] hover:text-[#4D3024]"
          >
            View Full Wishlist
          </Link>
        </footer>
      </aside>
    </div>
  );
}
