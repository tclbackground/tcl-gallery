
"use server";

import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type ActionResult = {
  success: boolean;
  message: string;
};

type ProductDocument = {
  _id: ObjectId;
  title?: string;
  name?: string;
  [key: string]: unknown;
};

function idCandidates(id: string): (string | ObjectId)[] {
  const ids: (string | ObjectId)[] = [id];

  if (ObjectId.isValid(id) && id.length === 24) {
    ids.push(new ObjectId(id));
  }

  return ids;
}

function normalizeSize(size: string): string {
  return size
    .trim()
    .toLowerCase()
    .replace(/[×*]/g, "x")
    .replace(/\s+/g, "")
    .replace(/inches|inch|in\b/g, "");
}

function parsePrice(value: unknown): number {
  if (typeof value === "string") {
    value = value.replace(/[₹,\s]/g, "");
  }

  const price = Number(value);

  return Number.isFinite(price) && price > 0 ? price : 0;
}

/**
 * Map each supported size to its corresponding MongoDB price field.
 * Do not substitute another size's price.
 */
function getProductPrice(
  product: ProductDocument,
  size: string
): number {
  const normalizedSize = normalizeSize(size);

  const priceFields: Record<string, unknown> = {
    "12x18": product["12X18 PRICE"] ?? product["price12x18"],
    "18x24": product["18X24 PRICE"] ?? product["price18x24"],
    "24x33": product["24X33 PRICE"] ?? product["price24x33"],
  };

  return parsePrice(priceFields[normalizedSize]);
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;

  return user?.id ?? null;
}

/**
 * Add a product to MongoDB.
 *
 * Call with:
 * await addToCart(productId, selectedSize, selectedFrame)
 */
export async function addToCart(
  productId: string,
  size: string,
  frame: string | null = null
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        success: false,
        message: "Please sign in before adding products to your cart.",
      };
    }

    if (!ObjectId.isValid(productId) || productId.length !== 24) {
      return {
        success: false,
        message: "Invalid product ID.",
      };
    }

    if (!size?.trim()) {
      return {
        success: false,
        message: "Please select a size.",
      };
    }

    const db = await getDb();
    const productObjectId = new ObjectId(productId);

    const product = await db
      .collection<ProductDocument>("Product")
      .findOne({ _id: productObjectId });

    if (!product) {
      return {
        success: false,
        message: "Product not found in the Product collection.",
      };
    }

    console.log("[ADD TO CART] Product:", {
      productId,
      title: product.title ?? product.name,
      selectedSize: size,
      availablePriceFields: Object.keys(product).filter((key) =>
        key.toLowerCase().includes("price")
      ),
    });

    const price = getProductPrice(product, size);

    if (price <= 0) {
      return {
        success: false,
        message:
          "No valid price was found for this size. Check the product's actual price fields in MongoDB.",
      };
    }

    const userIdValue: string | ObjectId =
      ObjectId.isValid(userId) && userId.length === 24
        ? new ObjectId(userId)
        : userId;

    const cartCollection = db.collection("CartItem");

    const existingItem = await cartCollection.findOne({
      userId: { $in: idCandidates(userId) },
      productId: { $in: idCandidates(productId) },
      size,
      frame: frame ?? null,
    });

    if (existingItem) {
      await cartCollection.updateOne(
        { _id: existingItem._id },
        {
          $inc: { quantity: 1 },
          $set: {
            price,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      const insertResult = await cartCollection.insertOne({
        userId: userIdValue,
        productId: productObjectId,
        size,
        frame: frame ?? null,
        price,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!insertResult.acknowledged) {
        return {
          success: false,
          message: "MongoDB did not confirm saving this cart item.",
        };
      }

      console.log("[ADD TO CART] Saved:", {
        cartItemId: insertResult.insertedId.toString(),
        productId,
        size,
        price,
      });
    }

    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/");

    return {
      success: true,
      message: "Product added to cart successfully.",
    };
  } catch (error) {
    console.error("[ADD TO CART ERROR]", error);

    return {
      success: false,
      message: "Unable to add this product to your cart.",
    };
  }
}

export async function updateCartQuantity(
  cartItemId: string,
  quantity: number
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return { success: false, message: "Please sign in." };
    }

    if (!ObjectId.isValid(cartItemId) || cartItemId.length !== 24) {
      return { success: false, message: "Invalid cart item ID." };
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return {
        success: false,
        message: "Quantity must be between 1 and 99.",
      };
    }

    const db = await getDb();

    const result = await db.collection("CartItem").updateOne(
      {
        _id: new ObjectId(cartItemId),
        userId: { $in: idCandidates(userId) },
      },
      {
        $set: {
          quantity,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "Cart item was not found for your account.",
      };
    }

    revalidatePath("/cart");

    return { success: true, message: "Quantity updated." };
  } catch (error) {
    console.error("[UPDATE CART ERROR]", error);

    return {
      success: false,
      message: "Unable to update the cart quantity.",
    };
  }
}

export async function removeFromCart(
  cartItemId: string
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return { success: false, message: "Please sign in." };
    }

    if (!ObjectId.isValid(cartItemId) || cartItemId.length !== 24) {
      return { success: false, message: "Invalid cart item ID." };
    }

    const db = await getDb();

    const result = await db.collection("CartItem").deleteOne({
      _id: new ObjectId(cartItemId),
      userId: { $in: idCandidates(userId) },
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "Cart item was not found for your account.",
      };
    }

    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/");

    return { success: true, message: "Product removed from cart." };
  } catch (error) {
    console.error("[REMOVE CART ERROR]", error);

    return {
      success: false,
      message: "Unable to remove the cart item.",
    };
  }
}
