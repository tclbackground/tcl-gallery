import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    prismaEngineVariable: process.env.PRISMA_QUERY_ENGINE_LIBRARY
      ? "SET"
      : "NOT SET",
  });
}