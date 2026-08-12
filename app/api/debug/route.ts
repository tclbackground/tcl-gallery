import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rawData = await prisma.$runCommandRaw({
    find: "Product", // If empty, try "products"
    limit: 1,
  });
  return NextResponse.json(rawData);
}