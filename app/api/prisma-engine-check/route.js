import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const prismaClientPath = path.join(
    process.cwd(),
    "node_modules",
    ".prisma",
    "client"
  );

  let files = [];

  try {
    files = fs.readdirSync(prismaClientPath).filter((file) =>
      file.includes("query_engine") || file.includes("libquery_engine")
    );
  } catch (error) {
    return NextResponse.json({
      error: String(error),
      prismaClientPath,
    });
  }

  return NextResponse.json({
    prismaClientPath,
    files,
  });
}