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

  const enginePath =
    process.env.PRISMA_QUERY_ENGINE_LIBRARY ||
    path.join(clientDir, "libquery_engine-linux-musl.so.node");

  return NextResponse.json({
    success: true,
    cwd: process.cwd(),
    prismaEngineVariable:
      process.env.PRISMA_QUERY_ENGINE_LIBRARY || "NOT_SET",
    enginePath,
    engineExists: fs.existsSync(enginePath),
    clientDirExists: fs.existsSync(clientDir),
  });
}