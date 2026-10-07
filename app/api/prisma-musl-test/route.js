import { NextResponse } from "next/server";
import { execFileSync } from "child_process";
import fs from "fs";

export async function GET() {
  const enginePath = process.env.PRISMA_QUERY_ENGINE_LIBRARY;

  if (!enginePath) {
    return NextResponse.json({
      success: false,
      error: "PRISMA_QUERY_ENGINE_LIBRARY is not set",
    });
  }

  const engineExists = fs.existsSync(enginePath);

  try {
    const script = `
      const enginePath = process.argv[1];

      try {
        require(enginePath);

        console.log(JSON.stringify({
          success: true,
          message: "MUSL Prisma engine loaded successfully"
        }));
      } catch (error) {
        console.log(JSON.stringify({
          success: false,
          name: error.name,
          code: error.code || null,
          message: error.message,
          stack: error.stack
        }));

        process.exit(1);
      }
    `;

    const output = execFileSync(
      process.execPath,
      ["-e", script, enginePath],
      {
        encoding: "utf8",
        timeout: 10000,
      }
    );

    return NextResponse.json({
      test: "PRISMA_MUSL_TEST_V1",
      engine: enginePath.split("/").pop(),
      engineExists,
      result: JSON.parse(output.trim()),
    });

  } catch (error) {
    return NextResponse.json({
      test: "PRISMA_MUSL_TEST_V1",
      engine: enginePath.split("/").pop(),
      engineExists,
      success: false,
      exitCode: error.status || null,
      stdout: error.stdout?.toString() || "",
      stderr: error.stderr?.toString() || "",
    });
  }
}