
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { removeFromWishlist } from "@/app/actions/wishlist";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductCard = {
  wishlistId: string;
  id: string;
  title: string;
  image: string | null;
  referenceNo: string | null;
  category: string | null;
  price: number | null;
};

function getTitle(product: Record<string, any>): string {
  const value =
    product["TITLE"] ??
    product["Title"] ??
    product.title ??
    product["PRODUCT NAME"] ??
    product.productName ??
    product.name ??
    product.Name;

  return String(value ?? "").trim() || "Untitled Artwork";
}

function getImage(
  product: Record<string, any>
): string | null {
  const fields = [
    "IMAGE URL",
    "IMAGE",
    "Image",
    "image",
    "image1",
    "IMAGE 1",
    "imageUrl",
    "imageURL",
    "photo",
    "Photo",
    "PHOTO",
  ];

  for (const field of fields) {
    const value = product[field];

    if (typeof value !== "string" || !value.trim()) {
      continue;
    }

    const image = value.trim();

    if (
      image === "null" ||
      image === "undefined"
    ) {
      continue;
    }

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return image.startsWith("/")
      ? image
      : `/${image}`;
  }

  return null;
}

function getReference(
  product: Record<string, any>
): string | null {
  const value =
    product["REFERENCE NO"] ??
    product["REFERENCE"] ??
    product.referenceNo ??
    product.reference ??
    product["Reference No"] ??
    product.itemRefNo;

  return value == null || String(value).trim() === ""
    ? null
    : String(value).trim();
}

function getCategory(
  product: Record<string, any>
): string | null {
  const value =
    product["CATEGORY"] ??
    product["Category"] ??
    product.category;

  return value == null || String(value).trim() === ""
    ? null
    : String(value).trim();
}

function getPrice(
  product: Record<string, any>
): number | null {
  const value =
    product["PRICE"] ??
    product["Price"] ??
    product.price;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[₹,\s]/g, ""));

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const sessionUserId = (
    session.user as { id?: string }
  ).id;

  if (!sessionUserId) {
    return (
      <main className="min-h-screen bg-[#FBF9F0] px-6 py-20 text-[#2B211C]">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-semibold">
            My Wishlist
          </h1>
          <p className="mt-4 text-[#77716B]">
            Your session does not contain a user ID.
            Please sign in again.
          </p>
        </div>
      </main>
    );
  }

  const db = await getDb();

  // Support existing Wishlist documents that store userId
  // as either a string or an ObjectId.
  const userIdCandidates: Array<string | ObjectId> = [
    sessionUserId,
  ];

  if (
    ObjectId.isValid(sessionUserId) &&
    sessionUserId.length === 24
  ) {
    userIdCandidates.push(new ObjectId(sessionUserId));
  }

  const wishlistItems = await db
    .collection("Wishlist")
    .find({
      userId: { $in: userIdCandidates },
    })
    .sort({ createdAt: -1 })
    .toArray();

  const products: ProductCard[] = [];

  for (const item of wishlistItems) {
    const rawProductId = String(item.productId ?? "");

    if (
      !ObjectId.isValid(rawProductId) ||
      rawProductId.length !== 24
    ) {
      console.warn(
        "[Wishlist] Invalid product ID:",
        rawProductId
      );
      continue;
    }

    const productObjectId = new ObjectId(rawProductId);

    // The IDs in your screenshots belong to the Product
    // collection, so check that collection first.
    let product = await db
      .collection("Product")
      .findOne({ _id: productObjectId });

    // Fallbacks for products stored in other existing collections.
    if (!product) {
      product = await db
        .collection("Artwork")
        .findOne({ _id: productObjectId });
    }

    if (!product) {
      product = await db
        .collection("JewelTree")
        .findOne({ _id: productObjectId });
    }

    if (!product) {
      product = await db
        .collection("DesignStoreProduct")
        .findOne({ _id: productObjectId });
    }

    if (!product) {
      product = await db
        .collection("FineArt")
        .findOne({ _id: productObjectId });
    }

    if (!product) {
      console.warn(
        "[Wishlist] Product not found:",
        rawProductId
      );
      continue;
    }

    products.push({
      wishlistId: item._id.toString(),
      id: product._id.toString(),
      title: getTitle(product),
      image: getImage(product),
      referenceNo: getReference(product),
      category: getCategory(product),
      price: getPrice(product),
    });
  }

  return (
    <main className="min-h-screen bg-[#FBF9F0] px-6 py-16 text-[#2B211C] sm:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[#8B624B]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {" / "}
          <span>My Wishlist</span>
        </nav>

        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
              Your favourites
            </p>

            <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-4 text-[#77716B]">
              Keep the artworks you love together in one place.
            </p>
          </div>

          <p className="text-sm text-[#8B624B]">
            {products.length}{" "}
            {products.length === 1 ? "Artwork" : "Artworks"}
          </p>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.wishlistId}
                className="group overflow-hidden rounded-[22px] border border-[#E6DDD2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,30,0.10)]"
              >
                <Link
                  href={`/shop/${encodeURIComponent(product.id)}`}
                  className="block"
                >
                  {/* Artwork image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE5]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-[#B5A99D]">
                        Image unavailable
                      </div>
                    )}
                  </div>

                  {/* Artwork details */}
                  <div className="p-6">
                    {product.category && (
                      <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#8B624B]">
                        {product.category}
                      </p>
                    )}

                    <h2 className="mt-2 break-words font-serif text-2xl font-semibold leading-tight text-[#29231F]">
                      {product.title}
                    </h2>

                    {product.referenceNo && (
                      <p className="mt-3 text-xs text-[#9A9189]">
                        Ref: {product.referenceNo}
                      </p>
                    )}

                    {product.price !== null && (
                      <p className="mt-4 text-lg font-semibold text-[#684633]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    )}

                    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#684633]">
                      View Artwork →
                    </p>
                  </div>
                </Link>

                {/* Remove from wishlist */}
                <div className="border-t border-[#EEE5DB] px-6 py-4">
                  <form
                    action={async () => {
                      "use server";
                      await removeFromWishlist(product.wishlistId);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-sm text-[#8B624B] underline underline-offset-4 transition hover:text-[#4F3325]"
                    >
                      Remove from Wishlist
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[22px] border border-dashed border-[#DCCFC1] bg-white/40 px-6 py-20 text-center">
            <h2 className="font-serif text-2xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="mt-3 text-[#77716B]">
              Save an artwork you love, and it will appear here.
            </p>

            <Link
              href="/design-store"
              className="mt-7 inline-flex rounded-full bg-[#684633] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4F3325]"
            >
              Explore Design Store
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
