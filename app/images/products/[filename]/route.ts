// app/images/products/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  // Decode URL characters (handles %20, commas, parentheses)
  const decodedFilename = decodeURIComponent(filename);
  const filePath = path.join(process.cwd(), "public", "images", "products", decodedFilename);

  if (!existsSync(filePath)) {
    return new NextResponse("Image Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : ext === ".svg"
        ? "image/svg+xml"
        : "image/jpeg";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}