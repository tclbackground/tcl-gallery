
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();

    const rawData = await db
      .collection("Product")
      .findOne({});

    if (!rawData) {
      return NextResponse.json(
        {
          message: "No documents found in Product collection.",
          data: null,
        },
        { status: 200 }
      );
    }

    // Convert MongoDB ObjectId to a JSON-friendly string.
    const data = {
      ...rawData,
      _id: rawData._id.toString(),
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching Product document:", error);

    return NextResponse.json(
      { error: "Failed to fetch Product document." },
      { status: 500 }
    );
  }
}
