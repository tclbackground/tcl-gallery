import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  const userId = (session?.user as any)?.id;

  const wishlistItems = userId
    ? await prisma.wishlist.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* TOP BAR */}
      <div className="flex items-center justify-between bg-stone-900 px-6 py-4">
        <h1 className="font-serif text-2xl text-white">
          My Wishlist
        </h1>

        {!session?.user ? (
          <Link
            href="/login"
            className="text-sm uppercase tracking-wider text-white hover:text-amber-400"
          >
            Login
          </Link>
        ) : (
          <span className="text-sm text-stone-300">
            {session.user.email}
          </span>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* NOT LOGGED IN */}
        {!session?.user && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-serif text-lg text-stone-900">
              Save artworks to your wishlist
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Please login to save and access your favourite artworks.
            </p>

            <Link
              href="/login?callbackUrl=/wishlist"
              className="mt-4 inline-block rounded-lg bg-amber-700 px-5 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-amber-800"
            >
              Login to Continue
            </Link>
          </div>
        )}

        {/* LOGGED-IN USER */}
        {session?.user && wishlistItems.length === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white py-20 text-center">
            <h2 className="text-2xl font-serif text-stone-900">
              Your wishlist is empty
            </h2>

            <p className="mt-3 text-sm text-stone-500">
              Explore our collection and save the artworks you love.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-lg bg-amber-700 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-amber-800"
            >
              Explore Collection
            </Link>
          </div>
        )}

        {/* NOT LOGGED-IN EMPTY STATE */}
        {!session?.user && (
          <div className="rounded-2xl border border-stone-200 bg-white py-20 text-center">
            <h2 className="text-2xl font-serif text-stone-900">
              Your wishlist is waiting
            </h2>

            <p className="mt-3 text-sm text-stone-500">
              Login to start saving your favourite artworks.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-lg border border-stone-300 px-6 py-3 text-sm font-medium uppercase tracking-wider text-stone-800 transition hover:border-amber-700 hover:text-amber-700"
            >
              Explore Collection
            </Link>
          </div>
        )}

        {/* WISHLIST PRODUCTS */}
        {session?.user && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item) => (
              <Link
                key={item.id}
                href={`/shop/${item.product.id}`}
                className="group overflow-hidden rounded-xl border border-stone-200 bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.title || "Artwork"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-stone-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-serif text-lg text-stone-900">
                    {item.product.title || "Untitled"}
                  </h2>

                  {item.product.location && (
                    <p className="mt-1 text-sm text-stone-500">
                      {item.product.location}
                    </p>
                  )}

                  <p className="mt-3 text-xs uppercase tracking-wider text-amber-700">
                    View Artwork
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}