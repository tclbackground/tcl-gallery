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
  const decodedFilename = decodeURIComponent(filename);
  const filePath = path.join(process.cwd(), "public", "images", "products", decodedFilename);

  if (!existsSync(filePath)) {
    return new NextResponse("Image Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();
    
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";

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