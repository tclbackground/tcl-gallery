
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId, type Document } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const allowedCollections = [
  "jewel-tree",
  "living-legacy",
  "nature-window",
  "bags",
];

type DesignStoreProduct = Document & {
  _id: ObjectId;
  slNo?: number | null;
  title: string;
  collection: string;
  description?: string | null;
  price?: number | null;
  image1: string;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  referenceNo?: string | null;
  material?: string | null;
  size?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

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

function parseOptionalNumber(
  value: unknown,
  fieldName: string
): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  return parsed;
}

// =====================================================
// GET ALL PRODUCTS
// =====================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");

    if (
      collection &&
      !allowedCollections.includes(collection)
    ) {
      return NextResponse.json(
        { error: "Invalid collection." },
        { status: 400 }
      );
    }

    const db = await getDb();

    const filter: Document = collection
      ? { collection }
      : {};

    const products = await db
      .collection<DesignStoreProduct>("DesignStoreProduct")
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    return NextResponse.json(products.map(serializeProduct));
  } catch (error: unknown) {
    console.error("GET DESIGN STORE PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// CREATE PRODUCT
// =====================================================

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
      !collection ||
      typeof image1 !== "string" ||
      !image1.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Title, collection and main image are required.",
        },
        { status: 400 }
      );
    }

    if (!allowedCollections.includes(collection)) {
      return NextResponse.json(
        { error: "Invalid collection." },
        { status: 400 }
      );
    }

    let parsedSlNo: number | null;
    let parsedPrice: number | null;

    try {
      parsedSlNo = parseOptionalNumber(slNo, "Serial number");
      parsedPrice = parseOptionalNumber(price, "Price");
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

    const now = new Date();

    const newProduct = {
      slNo: parsedSlNo,
      title: title.trim(),
      collection,
      description: description || null,
      price: parsedPrice,
      image1: image1.trim(),
      image2: image2 || null,
      image3: image3 || null,
      image4: image4 || null,
      referenceNo: referenceNo || null,
      material: material || null,
      size: size || null,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();

    const result = await db
      .collection<DesignStoreProduct>("DesignStoreProduct")
      .insertOne(newProduct as DesignStoreProduct);

    const product = await db
      .collection<DesignStoreProduct>("DesignStoreProduct")
      .findOne({ _id: result.insertedId });

    if (!product) {
      return NextResponse.json(
        { error: "Product was created but could not be retrieved." },
        { status: 500 }
      );
    }

    return NextResponse.json(serializeProduct(product), {
      status: 201,
    });
  } catch (error: unknown) {
    console.error("CREATE DESIGN STORE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create product",
      },
      { status: 500 }
    );
  }
}
