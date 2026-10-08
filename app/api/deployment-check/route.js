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

  const files = fs.readdirSync(clientDir);

  const relevantFiles = files.filter(
    (file) =>
      file.includes("query_engine") ||
      file.includes("schema") ||
      file.includes("index")
  );

  const indexPath = path.join(clientDir, "index.js");

  let indexContent = "";

  try {
    indexContent = fs.readFileSync(indexPath, "utf8");
  } catch (error) {
    indexContent = String(error);
  }

  return NextResponse.json({
    clientDir,
    relevantFiles,
    hasLinuxMusl: indexContent.includes("linux-musl"),
    hasOpenSSL3Musl: indexContent.includes("linux-musl-openssl-3.0.x"),
    hasDebianOpenSSL3: indexContent.includes("debian-openssl-3.0.x"),
    hasWindows: indexContent.includes("windows"),
    prismaEngine:
      process.env.PRISMA_QUERY_ENGINE_LIBRARY || "NOT_SET",
  });
}