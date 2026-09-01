import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ============================================================
// GET WISHLIST
// ============================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          authenticated: false,
          wishlist: [],
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        {
          authenticated: false,
          wishlist: [],
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      "GET /api/wishlist:",
      userId,
      wishlist.length
    );

    return NextResponse.json({
      authenticated: true,
      wishlist,
      count: wishlist.length,
    });
  } catch (error) {
    console.error(
      "GET /api/wishlist error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load wishlist",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// ADD / REMOVE WISHLIST
// ============================================================

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Please login",
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId = body?.productId;

    if (!productId) {
      return NextResponse.json(
        {
          error: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // Check whether already exists

    const existingItem =
      await prisma.wishlist.findFirst({
        where: {
          userId,
          productId,
        },
      });

    // ========================================================
    // REMOVE
    // ========================================================

    if (existingItem) {
      await prisma.wishlist.delete({
        where: {
          id: existingItem.id,
        },
      });

      const count =
        await prisma.wishlist.count({
          where: {
            userId,
          },
        });

      return NextResponse.json({
        success: true,
        action: "removed",
        wishlisted: false,
        wishlistCount: count,
      });
    }

    // ========================================================
    // ADD
    // ========================================================

    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    const count =
      await prisma.wishlist.count({
        where: {
          userId,
        },
      });

    return NextResponse.json({
      success: true,
      action: "added",
      wishlisted: true,
      wishlistCount: count,
    });
  } catch (error) {
    console.error(
      "POST /api/wishlist error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update wishlist",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE WISHLIST ITEM
// ============================================================

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Please login",
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID not found",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const wishlistItemId =
      searchParams.get("id");

    if (!wishlistItemId) {
      return NextResponse.json(
        {
          error: "Wishlist item ID is required",
        },
        { status: 400 }
      );
    }

    // Make sure item belongs to this user

    const wishlistItem =
      await prisma.wishlist.findFirst({
        where: {
          id: wishlistItemId,
          userId,
        },
      });

    if (!wishlistItem) {
      return NextResponse.json(
        {
          error: "Wishlist item not found",
        },
        { status: 404 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        id: wishlistItemId,
      },
    });

    const count =
      await prisma.wishlist.count({
        where: {
          userId,
        },
      });

    return NextResponse.json({
      success: true,
      wishlistCount: count,
    });
  } catch (error) {
    console.error(
      "DELETE /api/wishlist error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to remove wishlist item",
      },
      { status: 500 }
    );
  }
}