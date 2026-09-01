"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        loginRequired: true,
        message: "Please login before adding artwork to your cart.",
      };
    }

    const userId = (session.user as any).id;

    if (!userId) {
      return {
        success: false,
        loginRequired: true,
        message: "Please login again.",
      };
    }

    // Get the artwork
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return {
        success: false,
        message: "Artwork not found.",
      };
    }

    // Choose an available price
    const price =
      product.price12x18 ??
      product.price18x24 ??
      product.price24x33 ??
      0;

    // Check whether artwork is already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      // Increase quantity
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });

      revalidatePath("/cart");

      return {
        success: true,
        action: "updated",
        message: "Artwork quantity updated in cart.",
      };
    }

    // Add new cart item
    await prisma.cartItem.create({
      data: {
        userId,
        productId,
        price,
        quantity: 1,
      },
    });

    revalidatePath("/cart");

    return {
      success: true,
      action: "added",
      message: "Artwork added to your cart.",
    };
  } catch (error) {
    console.error("Add to cart error:", error);

    return {
      success: false,
      message: "Unable to add artwork to cart.",
    };
  }
}