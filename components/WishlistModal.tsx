import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-stone-50">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-stone-900 px-6 py-6">
          <h1 className="font-serif text-3xl text-white">
            My Wishlist
          </h1>

          <Link
            href="/account/login?callbackUrl=/wishlist"
            className="text-sm uppercase tracking-wider text-white hover:text-amber-400"
          >
            Login
          </Link>
        </div>

        {/* CONTENT */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-24 text-center">

            <div className="mb-6 text-5xl">
              ♡
            </div>

            <h2 className="font-serif text-3xl text-stone-900">
              Your wishlist is waiting
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-500">
              Login to save your favourite artworks
              and access your wishlist anytime.
            </p>

            <Link
              href="/account/login?callbackUrl=/wishlist"
              className="mt-8 inline-block rounded-lg bg-[#4D3024] px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-[#22211B]"
            >
              Login to Continue
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // GET USER ID
  // ============================================================

  const userId = (session.user as any)?.id;

  // Debug
  console.log(
    "Wishlist page userId:",
    userId
  );

  if (!userId) {
    return (
      <div className="min-h-screen bg-stone-50">

        <div className="bg-stone-900 px-6 py-6">
          <h1 className="font-serif text-3xl text-white">
            My Wishlist
          </h1>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 text-center">

          <h2 className="font-serif text-2xl text-stone-900">
            Session problem
          </h2>

          <p className="mt-3 text-sm text-stone-500">
            Your user ID was not found in the session.
            Please logout and login again.
          </p>

          <Link
            href="/account/login"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm text-white"
          >
            Login Again
          </Link>

        </div>
      </div>
    );
  }

  // ============================================================
  // GET WISHLIST
  // ============================================================

  let wishlistItems: any[] = [];

  try {
    wishlistItems =
      await prisma.wishlist.findMany({
        where: {
          userId: userId,
        },

        include: {
          product: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      "Wishlist items:",
      wishlistItems.length
    );

  } catch (error) {
    console.error(
      "Wishlist page database error:",
      error
    );
  }

  // ============================================================
  // EMPTY WISHLIST
  // ============================================================

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-stone-900 px-6 py-6">

          <h1 className="font-serif text-3xl text-white">
            My Wishlist
          </h1>

          <span className="text-sm text-stone-300">
            {session.user?.email}
          </span>

        </div>

        {/* EMPTY */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-28 text-center">

            <div className="mb-5 text-5xl text-stone-300">
              ♡
            </div>

            <h2 className="font-serif text-4xl text-stone-900">
              Your wishlist is empty
            </h2>

            <p className="mt-4 text-sm text-stone-500">
              Explore our collection and save the artworks
              you love.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-lg bg-[#4D3024] px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-[#22211B]"
            >
              Explore Collection
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // WISHLIST WITH PRODUCTS
  // ============================================================

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between bg-stone-900 px-6 py-6">

        <div>
          <h1 className="font-serif text-3xl text-white">
            My Wishlist
          </h1>

          <p className="mt-1 text-xs text-stone-400">
            {wishlistItems.length} saved artwork
            {wishlistItems.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        <span className="hidden text-sm text-stone-300 sm:block">
          {session.user?.email}
        </span>

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* TOP */}
        <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-5">

          <div>
            <h2 className="font-serif text-2xl text-stone-900">
              Saved Artworks
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Your favourite artworks
            </p>
          </div>

          <Link
            href="/shop"
            className="rounded-lg border border-stone-300 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-stone-800 transition hover:border-[#4D3024] hover:text-[#4D3024]"
          >
            Continue Shopping
          </Link>

        </div>

        {/* ====================================================
            GRID
        ==================================================== */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {wishlistItems.map((item) => {

            const product = item.product;

            if (!product) {
              return null;
            }

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg"
              >

                {/* IMAGE */}

                <Link
                  href={`/shop/${product.id}`}
                  className="block"
                >

                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">

                    {product.imageUrl ? (

                      <Image
                        src={product.imageUrl}
                        alt={
                          product.title ||
                          "Artwork"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm text-stone-400">
                        No Image
                      </div>

                    )}

                  </div>

                </Link>

                {/* DETAILS */}

                <div className="p-5">

                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#4D3024]">
                    Fine Art
                  </p>

                  <h2 className="mt-2 line-clamp-2 font-serif text-xl text-stone-900">
                    {product.title ||
                      "Untitled Artwork"}
                  </h2>

                  {product.location && (
                    <p className="mt-2 text-sm text-stone-500">
                      {product.location}
                    </p>
                  )}

                  {product.medium && (
                    <p className="mt-1 text-xs text-stone-400">
                      {product.medium}
                    </p>
                  )}

                  {/* VIEW */}

                  <Link
                    href={`/shop/${product.id}`}
                    className="mt-5 block w-full rounded-lg bg-[#4D3024] px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white transition hover:bg-[#22211B]"
                  >
                    View Artwork
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}