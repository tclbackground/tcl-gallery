
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

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

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  return userId || null;
}

function serializeWishlistItem(
  item: WishlistDocument,
  product: Document | null
) {
  const { _id, ...fields } = item;

  return {
    ...fields,
    id: _id.toString(),
    product,
  };
}

// ============================================================
// GET WISHLIST
// ============================================================

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { authenticated: false, wishlist: [] },
        { status: 401 }
      );
    }

    const db = await getDb();

    const wishlistItems = await db
      .collection<WishlistDocument>("Wishlist")
      .find({
        userId: { $in: idCandidates(userId) },
      })
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    // Match wishlist entries to documents in the existing Product collection.
    const productIds = [
      ...new Set(wishlistItems.map((item) => item.productId)),
    ];

    const productQueries: Document[] = [];

    if (productIds.length > 0) {
      productQueries.push({ _id: { $in: productIds } });
      productQueries.push({ id: { $in: productIds } });

      const objectIds = productIds
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      if (objectIds.length > 0) {
        productQueries.push({ _id: { $in: objectIds } });
      }
    }

    const products =
      productQueries.length > 0
        ? await db
            .collection<Document>("Product")
            .find({ $or: productQueries })
            .toArray()
        : [];

    const productMap = new Map<string, Document>();

    for (const product of products) {
      if (product._id) {
        productMap.set(String(product._id), product);
      }

      if (product.id !== undefined) {
        productMap.set(String(product.id), product);
      }
    }

    const wishlist = wishlistItems.map((item) =>
      serializeWishlistItem(
        item,
        productMap.get(item.productId) ?? null
      )
    );

    console.log("GET /api/wishlist:", userId, wishlist.length);

    return NextResponse.json({
      authenticated: true,
      wishlist,
      count: wishlist.length,
    });
  } catch (error: unknown) {
    console.error("GET /api/wishlist error:", error);

    return NextResponse.json(
      { error: "Unable to load wishlist" },
      { status: 500 }
    );
  }
}

// ============================================================
// ADD / REMOVE WISHLIST (TOGGLE)
// ============================================================

export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body?.productId === "string"
        ? body.productId.trim()
        : "";

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const wishlistCollection =
      db.collection<WishlistDocument>("Wishlist");

    const ownerFilter = {
      userId: { $in: idCandidates(userId) },
    };

    const existingItem = await wishlistCollection.findOne({
      ...ownerFilter,
      productId,
    });

    if (existingItem) {
      await wishlistCollection.deleteOne({
        _id: existingItem._id,
        ...ownerFilter,
      });

      const wishlistCount =
        await wishlistCollection.countDocuments(ownerFilter);

      return NextResponse.json({
        success: true,
        action: "removed",
        wishlisted: false,
        wishlistCount,
      });
    }

    await wishlistCollection.insertOne({
      userId,
      productId,
      createdAt: new Date(),
    } as WishlistDocument);

    const wishlistCount =
      await wishlistCollection.countDocuments(ownerFilter);

    return NextResponse.json({
      success: true,
      action: "added",
      wishlisted: true,
      wishlistCount,
    });
  } catch (error: unknown) {
    console.error("POST /api/wishlist error:", error);

    return NextResponse.json(
      { error: "Unable to update wishlist" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE WISHLIST ITEM
// ============================================================

export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const wishlistItemId = searchParams.get("id");

    if (!wishlistItemId) {
      return NextResponse.json(
        { error: "Wishlist item ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(wishlistItemId)) {
      return NextResponse.json(
        { error: "Invalid wishlist item ID" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const wishlistCollection =
      db.collection<WishlistDocument>("Wishlist");

    const ownerFilter = {
      userId: { $in: idCandidates(userId) },
    };

    const result = await wishlistCollection.deleteOne({
      _id: new ObjectId(wishlistItemId),
      ...ownerFilter,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }

    const wishlistCount =
      await wishlistCollection.countDocuments(ownerFilter);

    return NextResponse.json({
      success: true,
      wishlistCount,
    });
  } catch (error: unknown) {
    console.error("DELETE /api/wishlist error:", error);

    return NextResponse.json(
      { error: "Unable to remove wishlist item" },
      { status: 500 }
    );
  }
}
