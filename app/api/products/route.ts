import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// ============================================================
// Convert MongoDB Product document to the structure that
// Prisma previously returned to the frontend
// ============================================================

function serializeProduct(product: any) {
  return {
    id: product._id?.toString(),

    // Basic artwork information
    slNo: product["SL NO"] ?? null,
    title: product["TITLE"] ?? null,

    // Images
    imageUrl: product["IMAGE URL"] ?? null,
    image2: product["IMAGE 2"] ?? null,
    image3: product["IMAGE 3"] ?? null,
    image4: product["IMAGE 4"] ?? null,
    image5: product["IMAGE 5"] ?? null,

    // Artwork information
    referenceNo: product["REFERENCE NO"] ?? null,
    location: product["LOCATION"] ?? null,
    year: product["YEAR"] ?? null,
    medium: product["MEDIUM"] ?? null,
    size: product["SIZE"] ?? null,

    // Size-based prices
    price12x18: product["12X18 PRICE"] ?? null,
    price18x24: product["18X24 PRICE"] ?? null,
    price24x33: product["24X33 PRICE"] ?? null,

    // Website information
    category: product.category ?? null,
    description: product.description ?? null,

    // Artist
    artistId: product.artistId
      ? product.artistId.toString()
      : null,

    // Dates
    createdAt: product.createdAt ?? null,
    updatedAt: product.updatedAt ?? null,
  };
}

// ============================================================
// GET
// Fetch all products
// ============================================================

export async function GET() {
  try {
    console.log("====================================");
    console.log("GET /api/products");
    console.log("====================================");

    const db = await getDb();

    console.log("MongoDB connected");
    console.log("Reading Product collection...");

    const products = await db
      .collection("Product")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Products found: ${products.length}`);

    const serializedProducts = products.map(serializeProduct);

    return NextResponse.json(serializedProducts);
  } catch (error: any) {
    console.error("====================================");
    console.error("ERROR FETCHING PRODUCTS");
    console.error("====================================");

    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    console.error("Full error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error?.message || String(error),
        name: error?.name || "UnknownError",
        code: error?.code || null,
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST
// Create new Product from Admin Dashboard
// ============================================================

export async function POST(req: Request) {
  try {
    console.log("====================================");
    console.log("POST /api/products");
    console.log("====================================");

    // --------------------------------------------------------
    // 1. Check authentication
    // --------------------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "ADMIN") {
      console.error("Unauthorized product creation attempt");

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------------
    // 2. Read request body
    // --------------------------------------------------------

    const body = await req.json();

    console.log("Product request received:", {
      title: body?.title,
      category: body?.category,
      slNo: body?.slNo,
    });

    // --------------------------------------------------------
    // 3. Extract fields
    // --------------------------------------------------------

    const {
      slNo,
      title,

      imageUrl,
      image2,
      image3,
      image4,
      image5,

      referenceNo,
      location,
      year,
      medium,
      size,

      price12x18,
      price18x24,
      price24x33,

      category,
      description,

      artistId,
    } = body;

    // --------------------------------------------------------
    // 4. Validate title
    // --------------------------------------------------------

    if (!title || String(title).trim() === "") {
      return NextResponse.json(
        {
          error: "Product title is required",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // 5. Validate numeric fields
    // --------------------------------------------------------

    const parsedSlNo =
      slNo !== undefined &&
      slNo !== null &&
      slNo !== ""
        ? Number(slNo)
        : null;

    const parsedYear =
      year !== undefined &&
      year !== null &&
      year !== ""
        ? Number(year)
        : null;

    const parsedPrice12x18 =
      price12x18 !== undefined &&
      price12x18 !== null &&
      price12x18 !== ""
        ? Number(price12x18)
        : null;

    const parsedPrice18x24 =
      price18x24 !== undefined &&
      price18x24 !== null &&
      price18x24 !== ""
        ? Number(price18x24)
        : null;

    const parsedPrice24x33 =
      price24x33 !== undefined &&
      price24x33 !== null &&
      price24x33 !== ""
        ? Number(price24x33)
        : null;

    // Check for invalid numbers
    if (
      (parsedSlNo !== null && Number.isNaN(parsedSlNo)) ||
      (parsedYear !== null && Number.isNaN(parsedYear)) ||
      (parsedPrice12x18 !== null &&
        Number.isNaN(parsedPrice12x18)) ||
      (parsedPrice18x24 !== null &&
        Number.isNaN(parsedPrice18x24)) ||
      (parsedPrice24x33 !== null &&
        Number.isNaN(parsedPrice24x33))
    ) {
      return NextResponse.json(
        {
          error: "One or more numeric fields contain invalid values",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // 6. Prepare artistId
    // --------------------------------------------------------

    let mongoArtistId: ObjectId | null = null;

    if (artistId) {
      if (!ObjectId.isValid(String(artistId))) {
        return NextResponse.json(
          {
            error: "Invalid artistId",
          },
          {
            status: 400,
          }
        );
      }

      mongoArtistId = new ObjectId(String(artistId));
    }

    // --------------------------------------------------------
    // 7. Prepare MongoDB document
    //
    // IMPORTANT:
    // These names intentionally match the existing MongoDB
    // Product collection created according to your Prisma
    // @map() definitions.
    // --------------------------------------------------------

    const product: Record<string, any> = {
      "SL NO": parsedSlNo,

      TITLE: String(title).trim(),

      "IMAGE URL": imageUrl || null,
      "IMAGE 2": image2 || null,
      "IMAGE 3": image3 || null,
      "IMAGE 4": image4 || null,
      "IMAGE 5": image5 || null,

      "REFERENCE NO": referenceNo || null,

      LOCATION: location || null,

      YEAR: parsedYear,

      MEDIUM: medium || null,

      SIZE: size || null,

      "12X18 PRICE": parsedPrice12x18,

      "18X24 PRICE": parsedPrice18x24,

      "24X33 PRICE": parsedPrice24x33,

      category: category || null,

      description: description || null,

      artistId: mongoArtistId,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    // --------------------------------------------------------
    // 8. Insert into MongoDB
    // --------------------------------------------------------

    const db = await getDb();

    console.log("Inserting product into MongoDB...");

    const result = await db
      .collection("Product")
      .insertOne(product);

    console.log(
      "Product created:",
      result.insertedId.toString()
    );

    // --------------------------------------------------------
    // 9. Return product in frontend-compatible format
    // --------------------------------------------------------

    const createdProduct = {
      _id: result.insertedId,
      ...product,
    };

    return NextResponse.json(
      serializeProduct(createdProduct),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("====================================");
    console.error("ERROR CREATING PRODUCT");
    console.error("====================================");

    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error code:", error?.code);
    console.error("Full error:", error);

    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error?.message || String(error),
        name: error?.name || "UnknownError",
        code: error?.code || null,
      },
      {
        status: 500,
      }
    );
  }
}