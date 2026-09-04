import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// =====================================================
// GET ALL PRODUCTS
// =====================================================

export async function GET(request: Request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const collection =
      searchParams.get("collection");

    const products =
      await prisma.designStoreProduct.findMany({
        where: collection
          ? {
              collection,
            }
          : undefined,

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error(
      "GET DESIGN STORE PRODUCTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// CREATE PRODUCT
// =====================================================

export async function POST(request: Request) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    const role = (
      (session?.user as any)?.role || ""
    ).toUpperCase();

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const {
      slNo,
      title,
      collection,
      description,
      price,
      image1,
      image2,
      image3,
      image4,
      referenceNo,
      material,
      size,
    } = body;

    if (!title || !collection || !image1) {
      return NextResponse.json(
        {
          error:
            "Title, collection and main image are required.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedCollections = [
      "jewel-tree",
      "living-legacy",
      "nature-window",
      "bags",
    ];

    if (
      !allowedCollections.includes(
        collection
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid collection.",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await prisma.designStoreProduct.create({
        data: {
          slNo:
            slNo !== undefined &&
            slNo !== null &&
            slNo !== ""
              ? Number(slNo)
              : null,

          title: String(title),

          collection: String(
            collection
          ),

          description:
            description || null,

          price:
            price !== undefined &&
            price !== null &&
            price !== ""
              ? Number(price)
              : null,

          image1: String(image1),

          image2:
            image2 || null,

          image3:
            image3 || null,

          image4:
            image4 || null,

          referenceNo:
            referenceNo || null,

          material:
            material || null,

          size:
            size || null,
        },
      });

    return NextResponse.json(
      product,
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "CREATE DESIGN STORE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}