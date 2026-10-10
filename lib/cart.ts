"use server";

import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

/**
 * ============================================================
 * ADD TO CART
 * ============================================================
 */

export async function addToCart({
  productId,
  size,
  frame,
  price,
}: {
  productId: string;
  size?: string;
  frame?: string;
  price: number;
}) {
  try {
    console.log("=================================");
    console.log("ADD TO CART START");
    console.log("Product ID:", productId);
    console.log("Size:", size);
    console.log("Frame:", frame);
    console.log("Price:", price);
    console.log("=================================");

    // ---------------------------------------------------------
    // CHECK LOGIN
    // ---------------------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        loginRequired: true,
        message:
          "Please login before adding artwork to your cart.",
      };
    }

    // ---------------------------------------------------------
    // USER ID
    // ---------------------------------------------------------

    const userId = (session.user as any)?.id;

    if (!userId) {
      return {
        success: false,
        message: "User ID not found.",
      };
    }

    if (!ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID.",
      };
    }

    // ---------------------------------------------------------
    // PRODUCT ID
    // ---------------------------------------------------------

    if (!productId) {
      return {
        success: false,
        message: "Product ID is missing.",
      };
    }

    if (!ObjectId.isValid(productId)) {
      console.error(
        "Invalid Product ObjectId:",
        productId
      );

      return {
        success: false,
        message:
          "Invalid product ID.",
      };
    }

    // ---------------------------------------------------------
    // MONGODB
    // ---------------------------------------------------------

    const db = await getDb();

    const mongoUserId =
      new ObjectId(userId);

    const mongoProductId =
      new ObjectId(productId);

    const normalizedSize =
      size || null;

    const normalizedFrame =
      frame || null;

    console.log(
      "MongoDB Product ID:",
      mongoProductId.toString()
    );

    // ---------------------------------------------------------
    // VERIFY PRODUCT EXISTS
    // ---------------------------------------------------------

    const product =
      await db
        .collection("Product")
        .findOne({
          _id: mongoProductId,
        });

    if (!product) {
      console.error(
        "Product not found:",
        productId
      );

      return {
        success: false,
        message:
          "Product was not found in the database.",
      };
    }

    console.log(
      "Product found:",
      product["TITLE"] ||
        product.title ||
        product._id
    );

    // ---------------------------------------------------------
    // CHECK EXISTING CART ITEM
    // ---------------------------------------------------------

    const existingItem =
      await db
        .collection("CartItem")
        .findOne({
          userId: mongoUserId,
          productId: mongoProductId,
          size: normalizedSize,
          frame: normalizedFrame,
        });

    // ---------------------------------------------------------
    // UPDATE EXISTING ITEM
    // ---------------------------------------------------------

    if (existingItem) {
      console.log(
        "Existing cart item found. Increasing quantity."
      );

      await db
        .collection("CartItem")
        .updateOne(
          {
            _id: existingItem._id,
            userId: mongoUserId,
          },
          {
            $inc: {
              quantity: 1,
            },
            $set: {
              updatedAt: new Date(),
            },
          }
        );
    }

    // ---------------------------------------------------------
    // CREATE NEW ITEM
    // ---------------------------------------------------------

    else {
      console.log(
        "Creating new cart item."
      );

      await db
        .collection("CartItem")
        .insertOne({
          userId: mongoUserId,
          productId: mongoProductId,
          size: normalizedSize,
          frame: normalizedFrame,
          price: Number(price) || 0,
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }

    // ---------------------------------------------------------
    // REVALIDATE
    // ---------------------------------------------------------

    revalidatePath("/cart");
    revalidatePath("/checkout");

    console.log(
      "ADD TO CART SUCCESS"
    );

    return {
      success: true,
      message:
        "Artwork added to cart.",
    };
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "ADD TO CART ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to add artwork to cart.",
    };
  }
}

/**
 * ============================================================
 * UPDATE CART QUANTITY
 * ============================================================
 */

export async function updateCartQuantity(
  cartItemId: string,
  quantity: number
) {
  try {
    const newQuantity =
      Math.floor(Number(quantity));

    if (!Number.isFinite(newQuantity)) {
      return {
        success: false,
        message: "Invalid quantity.",
      };
    }

    if (newQuantity < 1) {
      return {
        success: false,
        message:
          "Quantity must be at least 1.",
      };
    }

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return {
        success: false,
        message: "Please login.",
      };
    }

    const userId =
      (session.user as any)?.id;

    if (
      !userId ||
      !ObjectId.isValid(userId)
    ) {
      return {
        success: false,
        message:
          "Invalid user ID.",
      };
    }

    if (
      !cartItemId ||
      !ObjectId.isValid(cartItemId)
    ) {
      return {
        success: false,
        message:
          "Invalid cart item ID.",
      };
    }

    const db = await getDb();

    const mongoUserId =
      new ObjectId(userId);

    const mongoCartItemId =
      new ObjectId(cartItemId);

    // ---------------------------------------------------------
    // VERIFY OWNERSHIP
    // ---------------------------------------------------------

    const cartItem =
      await db
        .collection("CartItem")
        .findOne({
          _id: mongoCartItemId,
          userId: mongoUserId,
        });

    if (!cartItem) {
      return {
        success: false,
        message:
          "Cart item not found.",
      };
    }

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------

    await db
      .collection("CartItem")
      .updateOne(
        {
          _id: mongoCartItemId,
          userId: mongoUserId,
        },
        {
          $set: {
            quantity: newQuantity,
            updatedAt: new Date(),
          },
        }
      );

    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      success: true,
      quantity: newQuantity,
    };
  } catch (error) {
    console.error(
      "Update quantity error:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update quantity.",
    };
  }
}

/**
 * ============================================================
 * REMOVE FROM CART
 * ============================================================
 */

export async function removeFromCart(
  cartItemId: string
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return {
        success: false,
        message: "Please login.",
      };
    }

    const userId =
      (session.user as any)?.id;

    if (
      !userId ||
      !ObjectId.isValid(userId)
    ) {
      return {
        success: false,
        message:
          "Invalid user ID.",
      };
    }

    if (
      !cartItemId ||
      !ObjectId.isValid(cartItemId)
    ) {
      return {
        success: false,
        message:
          "Invalid cart item ID.",
      };
    }

    const db = await getDb();

    const mongoUserId =
      new ObjectId(userId);

    const mongoCartItemId =
      new ObjectId(cartItemId);

    // ---------------------------------------------------------
    // VERIFY OWNERSHIP
    // ---------------------------------------------------------

    const cartItem =
      await db
        .collection("CartItem")
        .findOne({
          _id: mongoCartItemId,
          userId: mongoUserId,
        });

    if (!cartItem) {
      return {
        success: false,
        message:
          "Cart item not found.",
      };
    }

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------

    await db
      .collection("CartItem")
      .deleteOne({
        _id: mongoCartItemId,
        userId: mongoUserId,
      });

    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Remove cart error:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to remove artwork.",
    };
  }
}