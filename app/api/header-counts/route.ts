import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        wishlistCount: 0,
        cartCount: 0,
      });
    }

    const userId = (session.user as any).id;

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        wishlistCount: 0,
        cartCount: 0,
      });
    }

    const wishlistCount = await prisma.wishlist.count({
      where: {
        userId: userId,
      },
    });

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
      select: {
        quantity: true,
      },
    });

    const cartCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return NextResponse.json({
      authenticated: true,
      wishlistCount: wishlistCount,
      cartCount: cartCount,
    });
  } catch (error) {
    console.error("Header counts error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        wishlistCount: 0,
        cartCount: 0,
      },
      {
        status: 500,
      }
    );
  }
}