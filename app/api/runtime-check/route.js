import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  let openssl = "unknown";

  try {
    openssl = execSync("openssl version").toString().trim();
  } catch (error) {
    openssl = "openssl command not available";
  }

  return NextResponse.json({
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
    openssl,
  });
}