"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type WishlistProduct = {
  id: string;
  title: string | null;
  imageUrl: string | null;
  location: string | null;
};

type WishlistItem = {
  id: string;
  product: WishlistProduct;
};

type WishlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WishlistModal({
  isOpen,
  onClose,
}: WishlistModalProps) {
  const { data: session, status } = useSession();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !session?.user) return;

    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/wishlist");

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();

        setWishlistItems(data.wishlist || []);
      } catch (error) {
        console.error("Wishlist error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isOpen, session]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl">

        {/* TOP HEADER */}
        <div className="flex items-center justify-end border-b border-stone-700 bg-stone-800 px-6 py-3">
          {session?.user ? (
            <span className="mr-4 text-sm text-white">
              My Wishlist
            </span>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
              className="mr-4 text-sm text-white hover:text-stone-300"
            >
              Login
            </button>
          )}

          <button
            onClick={onClose}
            className="text-2xl font-light text-white hover:text-stone-300"
            aria-label="Close wishlist"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto p-6 sm:p-8">

          {status === "loading" ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-stone-500">Loading...</p>
            </div>
          ) : !session?.user ? (

            /* NOT LOGGED IN */
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 text-3xl">
                ♡
              </div>

              <h2 className="font-serif text-3xl text-stone-900">
                My Wishlist
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-stone-500">
                Login to save your favourite artworks and access your
                wishlist anytime.
              </p>

              <button
                onClick={() =>
                  signIn(undefined, {
                    callbackUrl: window.location.href,
                  })
                }
                className="mt-8 bg-black px-10 py-3 text-sm uppercase tracking-wider text-white transition hover:bg-stone-800"
              >
                Login to View Wishlist
              </button>

              <Link
                href="/signup"
                onClick={onClose}
                className="mt-5 text-sm text-stone-600 underline underline-offset-4 hover:text-black"
              >
                Create an account
              </Link>
            </div>

          ) : loading ? (

            /* LOADING */
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-stone-500">
                Loading your wishlist...
              </p>
            </div>

          ) : wishlistItems.length === 0 ? (

            /* EMPTY WISHLIST */
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-5 text-5xl">♡</div>

              <h2 className="font-serif text-3xl text-stone-900">
                Your wishlist is empty
              </h2>

              <p className="mt-3 text-sm text-stone-500">
                Explore our collection and save the artworks you love.
              </p>

              <Link
                href="/shop"
                onClick={onClose}
                className="mt-8 bg-black px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-stone-800"
              >
                Explore Collection
              </Link>
            </div>

          ) : (

            /* WISHLIST ITEMS */
            <>
              <h1 className="mb-2 font-serif text-3xl text-stone-900">
                My Wishlist
              </h1>

              <div className="mb-8 border-b border-stone-200 pb-5">
                <input
                  type="text"
                  placeholder="Search item"
                  className="w-full border border-stone-300 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="space-y-0">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 border-b border-stone-200 py-5"
                  >
                    {/* IMAGE */}
                    <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden bg-stone-100">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title || "Artwork"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-stone-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="flex flex-1 flex-col justify-center">
                      <h2 className="font-serif text-xl text-stone-900">
                        {item.product.title || "Untitled Artwork"}
                      </h2>

                      {item.product.location && (
                        <p className="mt-2 text-sm text-stone-500">
                          {item.product.location}
                        </p>
                      )}

                      <Link
                        href={`/shop/${item.product.id}`}
                        onClick={onClose}
                        className="mt-5 inline-block w-fit bg-black px-7 py-3 text-xs uppercase tracking-wider text-white hover:bg-stone-800"
                      >
                        View Artwork
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}