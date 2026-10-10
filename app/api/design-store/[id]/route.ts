
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type DesignStoreProduct = Document & {
  _id: ObjectId;
  slNo?: number | null;
  title?: string;
  collection?: string;
  description?: string | null;
  price?: number | null;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  referenceNo?: string | null;
  material?: string | null;
  size?: string | null;
};

const allowedCollections = [
  "jewel-tree",
  "living-legacy",
  "nature-window",
  "bags",
];

async function isAdmin() {
  const session = await getServerSession(authOptions);

  const role = String(
    (session?.user as { role?: string } | undefined)?.role ?? ""
  ).toUpperCase();

  return Boolean(session?.user && role === "ADMIN");
}

function serializeProduct(product: DesignStoreProduct) {
  const { _id, ...fields } = product;

  return {
    ...fields,
    id: _id.toString(),
  };
}

function parseProductId(id: string) {
  // Support MongoDB ObjectId IDs and existing string IDs.
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id
    ? new ObjectId(id)
    : id;
}

async function findProduct(id: string) {
  const db = await getDb();
  const productId = parseProductId(id);

  const product = await db
    .collection<DesignStoreProduct>("DesignStoreProduct")
    .findOne({
      _id: productId,
    } as Document);

  return { db, product };
}

// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const { product } = await findProduct(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeProduct(product));
  } catch (error: unknown) {
    console.error("GET SINGLE DESIGN STORE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch product",
      },
      { status: 500 }
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
    params: Promise<{ id: string }>;
  }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

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

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof collection !== "string" ||
      !collection.trim()
    ) {
      return NextResponse.json(
        { error: "Title and collection are required." },
        { status: 400 }
      );
    }

    if (!allowedCollections.includes(collection)) {
      return NextResponse.json(
        { error: "Invalid collection." },
        { status: 400 }
      );
    }

    const { db, product: existing } = await findProduct(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const toOptionalNumber = (
      value: unknown,
      fieldName: string
    ): number | null => {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      const parsed = Number(value);

      if (!Number.isFinite(parsed)) {
        throw new Error(`${fieldName} must be a valid number.`);
      }

      return parsed;
    };

    let parsedSlNo: number | null;
    let parsedPrice: number | null;

    try {
      parsedSlNo = toOptionalNumber(slNo, "Serial number");
      parsedPrice = toOptionalNumber(price, "Price");
    } catch (error: unknown) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid numeric value.",
        },
        { status: 400 }
      );
    }

    const updateFields = {
      slNo: parsedSlNo,
      title: title.trim(),
      collection,
      description: description || null,
      price: parsedPrice,
      // Keep the existing primary image when no new one is supplied.
      image1: image1 || existing.image1 || null,
      image2: image2 || null,
      image3: image3 || null,
      image4: image4 || null,
      referenceNo: referenceNo || null,
      material: material || null,
      size: size || null,
      updatedAt: new Date(),
    };

    await db
      .collection<DesignStoreProduct>("DesignStoreProduct")
      .updateOne(
        { _id: existing._id },
        { $set: updateFields }
      );

    const updatedProduct = await db
      .collection<DesignStoreProduct>("DesignStoreProduct")
      .findOne({ _id: existing._id });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product could not be retrieved after update." },
        { status: 500 }
      );
    }

    return NextResponse.json(serializeProduct(updatedProduct));
  } catch (error: unknown) {
    console.error("UPDATE DESIGN STORE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { db, product } = await findProduct(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    await db
      .collection<DesignStoreProduct>("DesignStoreProduct")
      .deleteOne({ _id: product._id });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error: unknown) {
    console.error("DELETE DESIGN STORE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
