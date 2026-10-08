import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const enginePath =
    "/app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node";

  const result = {
    enginePath,
    engineExists: fs.existsSync(enginePath),
    envValue: process.env.PRISMA_QUERY_ENGINE_LIBRARY || "NOT_SET",
    directLoad: null,
  };

  try {
    process.dlopen(module, enginePath);

    result.directLoad = {
      success: true,
      message: "Linux musl Prisma engine loaded successfully",
    };
  } catch (error) {
    result.directLoad = {
      success: false,
      error: String(error),
      message: error?.message || "Unknown error",
    };
  }

  return NextResponse.json(result);
}