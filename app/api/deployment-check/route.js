import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    deployment: "OPENSSL3_WINDOWS_V1",
    prismaTarget: "linux-musl-openssl-3.0.x",
    node: process.version,
    prismaEngine:
      process.env.PRISMA_QUERY_ENGINE_LIBRARY || "NOT_SET",
  });
}