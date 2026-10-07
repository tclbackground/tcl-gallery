import { NextResponse } from "next/server";

export async function GET() {
  const enginePath = process.env.PRISMA_QUERY_ENGINE_LIBRARY;

  try {
    require(enginePath);

    return NextResponse.json({
      success: true,
      message: "RHEL Prisma engine loaded successfully",
      engine: enginePath.split("/").pop(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      engine: enginePath?.split("/").pop(),
      error: String(error),
      message: error?.message || "Unknown error",
    });
  }
}