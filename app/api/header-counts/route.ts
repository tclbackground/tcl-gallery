
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function getUserIdCandidates(userId: string): (string | ObjectId)[] {
  const candidates: (string | ObjectId)[] = [userId];

  if (ObjectId.isValid(userId) && userId.length === 24) {
    candidates.push(new ObjectId(userId));
  }

  return candidates;
}

export async function GET() {
  try {
    console.log("🔵 Header counts: starting");

    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string } | undefined;
    const userId = user?.id;

    console.log("🔵 Header counts: session:", {
      authenticated: Boolean(userId),
      hasUserId: Boolean(userId),
    });

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        wishlistCount: 0,
        cartCount: 0,
      });
    }

    const db = await getDb();
    const userIdCandidates = getUserIdCandidates(userId);

    console.log("🟢 Header counts: database connected");

    // Preserve support for both string and ObjectId user IDs.
    const wishlistCount = await db
      .collection("Wishlist")
      .countDocuments({
        userId: { $in: userIdCandidates },
      });

    console.log("🟢 Wishlist count:", wishlistCount);

    // Fetch cart records for the current user.
    const cartItems = await db
      .collection("CartItem")
      .find({
        userId: { $in: userIdCandidates },
      })
      .project({ quantity: 1 })
      .toArray();

    // The header displays total item quantity, not just document count.
    const cartCount = cartItems.reduce((total, item) => {
      const quantity = Number(item.quantity);
      return total + (
        Number.isFinite(quantity) && quantity > 0
          ? quantity
          : 0
      );
    }, 0);

    console.log("🟢 Cart count:", cartCount);
    console.log("🔵 Cart documents matched:", cartItems.length);

    return NextResponse.json(
      {
        authenticated: true,
        wishlistCount,
        cartCount,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("❌ HEADER COUNTS ERROR:", error);

    return NextResponse.json(
      {
        authenticated: false,
        wishlistCount: 0,
        cartCount: 0,
        error: "Unable to load header counts.",
      },
      { status: 500 }
    );
  }
}
