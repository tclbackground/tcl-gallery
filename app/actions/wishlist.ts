"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToWishlist(productId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        loginRequired: true,
        message: "Please login before adding artwork to your wishlist.",
      };
    }

    const userId = (session.user as any).id;

    if (!userId) {
      return {
        success: false,
        loginRequired: true,
        message: "User session not found. Please login again.",
      };
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      return {
        success: true,
        alreadyExists: true,
        message: "Artwork is already in your wishlist.",
      };
    }

    // Add to wishlist
    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    revalidatePath("/wishlist");

    return {
      success: true,
      message: "Artwork added to your wishlist.",
    };
  } catch (error) {
    console.error("Add to wishlist error:", error);

    return {
      success: false,
      message: "Unable to add artwork to wishlist.",
    };
  }
}

export async function removeFromWishlist(wishlistItemId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        message: "Please login.",
      };
    }

    const userId = (session.user as any).id;

    if (!userId) {
      return {
        success: false,
        message: "Please login again.",
      };
    }

    // Make sure the wishlist item belongs to the logged-in user
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id: wishlistItemId,
        userId,
      },
    });

    if (!wishlistItem) {
      return {
        success: false,
        message: "Wishlist item not found.",
      };
    }

    await prisma.wishlist.delete({
      where: {
        id: wishlistItemId,
      },
    });

    revalidatePath("/wishlist");

    return {
      success: true,
      message: "Artwork removed from wishlist.",
    };
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return {
      success: false,
      message: "Unable to remove artwork from wishlist.",
    };
  }
}

export async function toggleWishlist(productId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        loginRequired: true,
        message: "Please login before adding artwork to your wishlist.",
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

    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    // If already exists → remove
    if (existingItem) {
      await prisma.wishlist.delete({
        where: {
          id: existingItem.id,
        },
      });

      revalidatePath("/wishlist");

      return {
        success: true,
        action: "removed",
        message: "Artwork removed from wishlist.",
      };
    }

    // Otherwise → add
    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    revalidatePath("/wishlist");

    return {
      success: true,
      action: "added",
      message: "Artwork added to your wishlist.",
    };
  } catch (error) {
    console.error("Toggle wishlist error:", error);

    return {
      success: false,
      message: "Unable to update wishlist.",
    };
  }
}