
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const decodedFilename = decodeURIComponent(filename);

    // Only allow a filename, not a path to another directory.
    if (
      !decodedFilename ||
      decodedFilename !== path.basename(decodedFilename) ||
      decodedFilename.includes("\0")
    ) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const imageDirectory = path.resolve(
      process.cwd(),
      "public",
      "images",
      "products"
    );

    const filePath = path.resolve(imageDirectory, decodedFilename);

    if (!filePath.startsWith(imageDirectory + path.sep)) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    if (!existsSync(filePath)) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();

    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".gif": "image/gif",
      ".avif": "image/avif",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentTypes[ext] ?? "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Product image route error:", error);

    return new NextResponse("Error reading file", { status: 500 });
  }
}
