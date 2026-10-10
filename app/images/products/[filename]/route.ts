
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    if (!filename) {
      return new NextResponse("File parameter missing", {
        status: 400,
      });
    }

    const decodedFilename = decodeURIComponent(filename);

    // Prevent access to files outside the products image directory.
    if (
      decodedFilename !== path.basename(decodedFilename) ||
      decodedFilename.includes("\0")
    ) {
      return new NextResponse("Invalid filename", {
        status: 400,
      });
    }

    const imageDirectory = path.resolve(
      process.cwd(),
      "public",
      "images",
      "products"
    );

    const filePath = path.resolve(imageDirectory, decodedFilename);

    if (!filePath.startsWith(imageDirectory + path.sep)) {
      return new NextResponse("Invalid filename", {
        status: 400,
      });
    }

    if (!existsSync(filePath)) {
      return new NextResponse("Image Not Found", {
        status: 404,
      });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();

    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".avif": "image/avif",
    };

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type":
          contentTypeMap[ext] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error streaming image file:", error);

    return new NextResponse("Error reading file", {
      status: 500,
    });
  }
}
