// app/images/products/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> | { filename: string } }
) {
  try {
    const resolvedParams = await context.params;
    const filename = resolvedParams?.filename;

    if (!filename) {
      return new NextResponse("File parameter missing", { status: 400 });
    }

    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "products",
      decodedFilename
    );

    if (!existsSync(filePath)) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();

    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";
    else if (ext === ".gif") contentType = "image/gif";

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error streaming image file:", error);
    return new NextResponse("Error reading file", { status: 500 });
  }
}