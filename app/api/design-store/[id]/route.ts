import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const product =
      await prisma.designStoreProduct.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      product
    );
  } catch (error: any) {
    console.error(
      "GET SINGLE DESIGN STORE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE PRODUCT
// =====================================================

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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

    const { id } =
      await params;

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

    if (!title || !collection) {
      return NextResponse.json(
        {
          error:
            "Title and collection are required.",
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

    const existing =
      await prisma.designStoreProduct.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const product =
      await prisma.designStoreProduct.update({
        where: {
          id,
        },

        data: {
          slNo:
            slNo !== undefined &&
            slNo !== null &&
            slNo !== ""
              ? Number(slNo)
              : null,

          title: String(title),

          collection:
            String(collection),

          description:
            description || null,

          price:
            price !== undefined &&
            price !== null &&
            price !== ""
              ? Number(price)
              : null,

          image1:
            image1 ||
            existing.image1,

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
      product
    );
  } catch (error: any) {
    console.error(
      "UPDATE DESIGN STORE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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

    const { id } =
      await params;

    const existing =
      await prisma.designStoreProduct.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.designStoreProduct.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error: any) {
    console.error(
      "DELETE DESIGN STORE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}