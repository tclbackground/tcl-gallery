import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    await db.command({ ping: 1 });

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      database: "tclgallery",
      collections: collections.map((item) => item.name),
    });
  } catch (error: any) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
        name: error?.name || "UnknownError",
      },
      { status: 500 }
    );
  }
}