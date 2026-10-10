// app/(shop)/cart/page.tsx

import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import CartItems from "./CartItems";

interface ProductDocument extends Document {
  title?: string;
  name?: string;
  location?: string;
  imageUrl?: string;
  image?: string;

  "12X18 PRICE"?: number | string;
  "18X24 PRICE"?: number | string;
  "24X33 PRICE"?: number | string;

  price12x18?: number | string;
  price18x24?: number | string;
  price24x33?: number | string;
}

interface CartRecord extends Document {
  userId: string | ObjectId;
  productId: string | ObjectId;
  quantity?: number;
  price?: number | string;
  size?: string | null;
  frame?: string | null;
}

function normalizeSize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[×*]/g, "x")
    .replace(/\s+/g, "")
    .replace(/inches|inch|in\b/g, "");
}

function toValidPrice(value: unknown): number {
  if (typeof value === "string") {
    value = value.replace(/[₹,\s]/g, "");
  }

  const price = Number(value);

  return Number.isFinite(price) && price > 0 ? price : 0;
}

function getProductPrice(
  product: ProductDocument,
  size: string | null
): number {
  if (!size) {
    return 0;
  }

  const prices: Record<string, unknown> = {
    "12x18": product["12X18 PRICE"] ?? product.price12x18,
    "18x24": product["18X24 PRICE"] ?? product.price18x24,
    "24x33": product["24X33 PRICE"] ?? product.price24x33,
  };

  return toValidPrice(prices[normalizeSize(size)]);
}

function getIdString(value: unknown): string {
  if (value instanceof ObjectId) {
    return value.toString();
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function getIdCandidates(
  value: string
): (string | ObjectId)[] {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value) && value.length === 24) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
}

function getImageUrl(product?: ProductDocument): string | null {
  if (!product) {
    return null;
  }

  const possibleImages = [
    product.imageUrl,
    product.image,
    product["image1"],
    product["Image"],
    product["Image URL"],
  ];

  for (const image of possibleImages) {
    if (typeof image === "string" && image.trim()) {
      return image.trim();
    }
  }

  return null;
}

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;

  if (!user?.id) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">
          Your Shopping Cart
        </h1>

        <p className="mt-4 text-gray-600">
          Please sign in to view your cart.
        </p>

        <Link
          href="/api/auth/signin?callbackUrl=/cart"
          className="mt-6 inline-block rounded bg-black px-6 py-3 text-white"
        >
          Sign in
        </Link>
      </main>
    );
  }

  try {
    const db = await getDb();

    // Find the user's cart items.
    const cartRecords = await db
      .collection<CartRecord>("CartItem")
      .find({
        userId: {
          $in: getIdCandidates(user.id),
        },
      })
      .toArray();

    if (cartRecords.length === 0) {
      return (
        <main className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold">
            Your Shopping Cart
          </h1>

          <p className="mt-4 text-gray-600">
            Your cart is empty.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </main>
      );
    }

    // Collect product IDs and prepare both possible MongoDB ID types.
    const productIds = [
      ...new Set(
        cartRecords
          .map((item) => getIdString(item.productId))
          .filter(Boolean)
      ),
    ];

    const objectIds = productIds
      .filter(
        (id) => ObjectId.isValid(id) && id.length === 24
      )
      .map((id) => new ObjectId(id));

    const productQueryIds: (string | ObjectId)[] = [
      ...productIds,
      ...objectIds,
    ];

    // Use a broad Document collection type so the MongoDB driver's
    // filter types do not reject the mixed string/ObjectId $in array.
    const products = await db
      .collection<Document>("Product")
      .find({
        _id: {
          $in: productQueryIds as never[],
        },
      })
      .toArray();

    const productMap = new Map<string, ProductDocument>();

    for (const rawProduct of products) {
      const product = rawProduct as ProductDocument;
      productMap.set(product._id.toString(), product);
    }

    // Convert MongoDB cart records into the props CartItems expects.
    const items = cartRecords.map((cartItem) => {
      const productId = getIdString(cartItem.productId);
      const product = productMap.get(productId);

      const size =
        typeof cartItem.size === "string" &&
        cartItem.size.trim()
          ? cartItem.size
          : null;

      const price = product
        ? getProductPrice(product, size)
        : 0;

      const priceError = !product
        ? "Product not found. Please remove this item and add it again."
        : !size
          ? "No size is saved for this item. Remove it and add it again after selecting a size."
          : price <= 0
            ? "Price not found for this size. Check the product price fields."
            : null;

      console.log("[CART PRICE DEBUG]", {
        cartItemId: cartItem._id.toString(),
        productId,
        title: product?.title ?? product?.name ?? null,
        selectedSize: size,
        storedCartPrice: cartItem.price,
        calculatedPrice: price,
        priceFields: product
          ? Object.fromEntries(
              Object.entries(product).filter(([key]) =>
                key.toLowerCase().includes("price")
              )
            )
          : {},
      });

      return {
        id: cartItem._id.toString(),
        quantity: Math.max(
          1,
          Number(cartItem.quantity) || 1
        ),
        price,
        size,
        frame:
          typeof cartItem.frame === "string"
            ? cartItem.frame
            : null,
        priceError,
        product: {
          id: productId,
          title:
            product?.title ??
            product?.name ??
            "Untitled artwork",
          location:
            typeof product?.location === "string"
              ? product.location
              : null,
          imageUrl: getImageUrl(product),
        },
      };
    });

    return (
      <main className="min-h-screen bg-[#FAF8F5] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-semibold">
            Your Shopping Cart
          </h1>

          <CartItems items={items} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("[CART PAGE ERROR]", error);

    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">
          Unable to load your cart
        </h1>

        <p className="mt-4 text-gray-600">
          Please refresh the page. If the problem continues,
          check the server terminal for the cart error.
        </p>

        <Link
          href="/shop"
          className="mt-6 inline-block rounded bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }
}