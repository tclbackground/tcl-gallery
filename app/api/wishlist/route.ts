import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          wishlist: [],
        },
        {
          status: 200,
        }
      );
    }

    const userId = (session.user as any).id;

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

    return NextResponse.json({
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return NextResponse.json(
      {
        message: "Unable to load wishlist",
      },
      {
        status: 500,
      }
    );
  }
}