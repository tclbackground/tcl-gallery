import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const frames = await prisma.frameOption.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(frames);
  } catch (error) {
    console.error("Error fetching frames:", error);

    return NextResponse.json(
      { error: "Failed to fetch frame options" },
      { status: 500 }
    );
  }
}