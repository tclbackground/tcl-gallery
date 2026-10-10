
"use server";

import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type WishlistDocument = Document & {
  _id: ObjectId;
  userId: string | ObjectId;
  productId: string | ObjectId;
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

  if (!session?.user) {
    return null;
  }

  const userId = (session.user as { id?: string }).id;

  return typeof userId === "string" && userId.length > 0
    ? userId
    : null;
}

async function getWishlistCollection() {
  const db = await getDb();
  return db.collection<WishlistDocument>("Wishlist");
}

function serializeId(id: unknown): string {
  return String(id);
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

    if (!productId?.trim()) {
      return {
        success: false,
        message: "Invalid artwork ID.",
      };
    }

    const wishlist = await getWishlistCollection();
    const userIds = idCandidates(userId);
    const productIds = idCandidates(productId);

    const existingItem = await wishlist.findOne({
      userId: { $in: userIds },
      productId: { $in: productIds },
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
      productId,
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

    if (!wishlistItemId?.trim()) {
      return {
        success: false,
        message: "Invalid wishlist item ID.",
      };
    }

    const wishlist = await getWishlistCollection();

    const itemIdQuery: Document[] = [
      { _id: wishlistItemId },
    ];

    if (ObjectId.isValid(wishlistItemId)) {
      itemIdQuery.push({
        _id: new ObjectId(wishlistItemId),
      });
    }

    const result = await wishlist.deleteOne({
      $and: [
        { $or: itemIdQuery },
        { userId: { $in: idCandidates(userId) } },
      ],
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

    if (!productId?.trim()) {
      return {
        success: false,
        message: "Invalid artwork ID.",
      };
    }

    const wishlist = await getWishlistCollection();

    const existingItem = await wishlist.findOne({
      userId: { $in: idCandidates(userId) },
      productId: { $in: idCandidates(productId) },
    });

    if (existingItem) {
      await wishlist.deleteOne({
        _id: existingItem._id,
        userId: { $in: idCandidates(userId) },
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
      productId,
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
