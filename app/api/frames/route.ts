
import { NextResponse } from "next/server";
import { type Document } from "mongodb";

import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type FrameOption = Document & {
  _id: unknown;
  name?: string;
};

export async function GET() {
  try {
    const db = await getDb();

    const frames = await db
      .collection<FrameOption>("FrameOption")
      .find({})
      .sort({ name: 1 })
      .toArray();

    const serializedFrames = frames.map((frame) => {
      const { _id, ...fields } = frame;

      return {
        ...fields,
        id: String(_id),
      };
    });

    return NextResponse.json(serializedFrames);
  } catch (error: unknown) {
    console.error("Error fetching frames:", error);

    return NextResponse.json(
      { error: "Failed to fetch frame options" },
      { status: 500 }
    );
  }
}
