// app/images/products/[filename]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// ==========================================================
// PRODUCT IMAGE ROUTE
// URL:
// /images/products/filename.webp
// ==========================================================

export async function GET(
  request: NextRequest,
  context: {
    params:
      | Promise<{ filename: string }>
      | { filename: string };
  }
) {
  try {
    // ======================================================
    // 1. GET FILENAME
    // ======================================================

    const resolvedParams =
      await context.params;

    const filename =
      resolvedParams?.filename;

    if (!filename) {
      console.error(
        "PRODUCT IMAGE ERROR: Filename missing"
      );

      return new NextResponse(
        "File parameter missing",
        {
          status: 400,
        }
      );
    }

    // ======================================================
    // 2. DECODE FILENAME
    // ======================================================

    const decodedFilename =
      decodeURIComponent(filename);

    // ======================================================
    // 3. SECURITY
    // Prevent path traversal
    // ======================================================

    const safeFilename =
      path.basename(decodedFilename);

    if (
      safeFilename !== decodedFilename ||
      safeFilename.includes("..")
    ) {
      console.error(
        "PRODUCT IMAGE ERROR: Invalid filename:",
        decodedFilename
      );

      return new NextResponse(
        "Invalid filename",
        {
          status: 400,
        }
      );
    }

    // ======================================================
    // 4. PRODUCT IMAGE DIRECTORY
    // ======================================================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "images",
      "products"
    );

    // ======================================================
    // 5. FINAL FILE PATH
    // ======================================================

    const filePath = path.join(
      uploadDir,
      safeFilename
    );

    // ======================================================
    // DEBUG LOGGING
    // ======================================================

    console.log(
      "========================================"
    );

    console.log(
      "PRODUCT IMAGE REQUEST"
    );

    console.log(
      "Filename:",
      safeFilename
    );

    console.log(
      "process.cwd():",
      process.cwd()
    );

    console.log(
      "Upload directory:",
      uploadDir
    );

    console.log(
      "Requested file:",
      filePath
    );

    console.log(
      "File exists:",
      existsSync(filePath)
    );

    console.log(
      "========================================"
    );

    // ======================================================
    // 6. CHECK FILE
    // ======================================================

    if (!existsSync(filePath)) {
      console.error(
        "PRODUCT IMAGE NOT FOUND:",
        filePath
      );

      return new NextResponse(
        "Image Not Found",
        {
          status: 404,
        }
      );
    }

    // ======================================================
    // 7. VERIFY FILE IS ACTUALLY A FILE
    // ======================================================

    const fileStats =
      await stat(filePath);

    if (!fileStats.isFile()) {
      console.error(
        "PRODUCT IMAGE ERROR: Path is not a file:",
        filePath
      );

      return new NextResponse(
        "Invalid image file",
        {
          status: 404,
        }
      );
    }

    // ======================================================
    // 8. READ FILE
    // ======================================================

    const fileBuffer =
      await readFile(filePath);

    // ======================================================
    // 9. DETERMINE CONTENT TYPE
    // ======================================================

    const extension =
      path
        .extname(safeFilename)
        .toLowerCase();

    let contentType =
      "application/octet-stream";

    switch (extension) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;

      case ".png":
        contentType = "image/png";
        break;

      case ".webp":
        contentType = "image/webp";
        break;

      case ".gif":
        contentType = "image/gif";
        break;

      case ".svg":
        contentType = "image/svg+xml";
        break;

      case ".avif":
        contentType = "image/avif";
        break;
    }

    // ======================================================
    // 10. RETURN IMAGE
    // ======================================================

    return new NextResponse(
      new Uint8Array(fileBuffer),
      {
        status: 200,

        headers: {
          "Content-Type": contentType,

          "Content-Length":
            fileBuffer.length.toString(),

          "Cache-Control":
            "public, max-age=31536000, immutable",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "PRODUCT IMAGE ROUTE ERROR"
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return new NextResponse(
      "Error reading image file",
      {
        status: 500,
      }
    );
  }
}