import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  const enginePath = process.env.PRISMA_QUERY_ENGINE_LIBRARY || "";

  return NextResponse.json({
    variableSet: !!enginePath,
    engineFileName: enginePath
      ? enginePath.split("/").pop()
      : null,
    engineExists: enginePath ? fs.existsSync(enginePath) : false,
  });
}