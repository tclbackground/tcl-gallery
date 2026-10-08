import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const clientDir = path.join(
    process.cwd(),
    "node_modules",
    ".prisma",
    "client"
  );

  let files = [];

  try {
    files = fs.readdirSync(clientDir);
  } catch (error) {
    return NextResponse.json({
      success: false,
      clientDir,
      error: String(error),
    });
  }

  return NextResponse.json({
    success: true,
    clientDir,
    linuxMusl: files.filter((f) => f.includes("linux-musl")),
    engines: files.filter((f) => f.includes("query_engine")),
  });
}