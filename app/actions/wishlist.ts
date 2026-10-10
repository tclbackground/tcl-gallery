
"use server";

import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type WishlistDocument = Document & {
  _id: ObjectId;
  userId: string | ObjectId;
  productId: string;
  createdAt?: Date;
};

function idCandidates(id: string): (string | ObjectId)[] {
  const candidates: (string | ObjectId)[] = [id];

  if (ObjectId.isValid(id)) {
    candidates.push(new ObjectId(id));
  }

  return candidates;
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  return userId || null;
}

function userIdCandidates(userId: string): (string | ObjectId)[] {
  return idCandidates(userId);
}

export async function addToWishlist(productId: string) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        success: false,
        loginRequired: true,
        message: "Please login before adding artwork to your wishlist.",
      };
    }

    if (typeof productId !== "string" || !productId.trim()) {
      return {
        success: false,
        message: "Invalid artwork product.",
      };
    }

    const normalizedProductId = productId.trim();
    const db = await getDb();
    const wishlist = db.collection<WishlistDocument>("Wishlist");

    const existingItem = await wishlist.findOne({
      userId: { $in: userIdCandidates(userId) },
      productId: normalizedProductId,
    });

    if (existingItem) {
      return {
        success: true,
        alreadyExists: true,
        message: "Artwork is already in your wishlist.",
      };
    }

    await wishlist.insertOne({
      userId,
      productId: normalizedProductId,
      createdAt: new Date(),
    } as WishlistDocument);

    revalidatePath("/wishlist");
    revalidatePath("/api/header-counts");

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
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        success: false,
        message: "Please login.",
      };
    }

    if (!ObjectId.isValid(wishlistItemId)) {
      return {
        success: false,
        message: "Invalid wishlist item.",
      };
    }

    const db = await getDb();
    const wishlist = db.collection<WishlistDocument>("Wishlist");

    // Only remove an item owned by the authenticated user.
    const result = await wishlist.deleteOne({
      _id: new ObjectId(wishlistItemId),
      userId: { $in: userIdCandidates(userId) },
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "Wishlist item not found.",
      };
    }

    revalidatePath("/wishlist");
    revalidatePath("/api/header-counts");

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
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        success: false,
        loginRequired: true,
        message: "Please login before adding artwork to your wishlist.",
      };
    }

    if (typeof productId !== "string" || !productId.trim()) {
      return {
        success: false,
        message: "Invalid artwork product.",
      };
    }

    const normalizedProductId = productId.trim();
    const db = await getDb();
    const wishlist = db.collection<WishlistDocument>("Wishlist");

    const existingItem = await wishlist.findOne({
      userId: { $in: userIdCandidates(userId) },
      productId: normalizedProductId,
    });

    if (existingItem) {
      await wishlist.deleteOne({
        _id: existingItem._id,
        userId: { $in: userIdCandidates(userId) },
      });

      revalidatePath("/wishlist");
      revalidatePath("/api/header-counts");

      return {
        success: true,
        action: "removed",
        message: "Artwork removed from wishlist.",
      };
    }

    await wishlist.insertOne({
      userId,
      productId: normalizedProductId,
      createdAt: new Date(),
    } as WishlistDocument);

    revalidatePath("/wishlist");
    revalidatePath("/api/header-counts");

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
