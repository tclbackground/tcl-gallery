"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        loginRequired: true,
        message:
          "Please login before adding artwork to your cart.",
      };
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return {
        success: false,
        message: "User ID not found.",
      };
    }

    const existingItem =
      await prisma.cartItem.findFirst({
        where: {
          userId,
          productId,
          size: size || null,
          frame: frame || null,
        },
      });

    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity:
            existingItem.quantity + 1,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          size: size || null,
          frame: frame || null,
          price: Number(price),
          quantity: 1,
        },
      });
    }

    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      success: true,
      message: "Artwork added to cart.",
    };
  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );

    return {
      success: false,
      message:
        "Unable to add artwork to cart.",
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
    const newQuantity = Math.floor(
      Number(quantity)
    );

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
      await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        message: "Please login.",
      };
    }

    const userId =
      (session.user as any)?.id;

    if (!userId) {
      return {
        success: false,
        message: "User ID not found.",
      };
    }

    /*
     * IMPORTANT:
     * Find the cart item using BOTH
     * item ID and user ID.
     *
     * This prevents one user from
     * modifying another user's cart.
     */

    const cartItem =
      await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId,
        },
      });

    if (!cartItem) {
      return {
        success: false,
        message:
          "Cart item not found.",
      };
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });

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
        "Unable to update quantity.",
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
      await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        message: "Please login.",
      };
    }

    const userId =
      (session.user as any)?.id;

    if (!userId) {
      return {
        success: false,
        message: "User ID not found.",
      };
    }

    /*
     * Again, verify ownership before deleting.
     */

    const cartItem =
      await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          userId,
        },
      });

    if (!cartItem) {
      return {
        success: false,
        message:
          "Cart item not found.",
      };
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
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
        "Unable to remove artwork.",
    };
  }
}