import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

export async function GET() {
  const enginePath =
    "/app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node";

  const result = {
    enginePath,
    engineExists: fs.existsSync(enginePath),
    envValue: process.env.PRISMA_QUERY_ENGINE_LIBRARY || "NOT_SET",
    externalNodeTest: null,
  };

  try {
    const output = execFileSync(
      process.execPath,
      [
        "-e",
        "require(process.argv[1]); console.log('ENGINE_LOADED')",
        enginePath,
      ],
      {
        encoding: "utf8",
        timeout: 10000,
      }
    );

    result.externalNodeTest = {
      success: true,
      output: output.trim(),
    };
  } catch (error) {
    result.externalNodeTest = {
      success: false,
      status: error?.status ?? null,
      stdout: error?.stdout?.toString() ?? "",
      stderr: error?.stderr?.toString() ?? "",
      message: error?.message ?? String(error),
    };
  }

  return NextResponse.json(result);
}