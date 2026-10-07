import { NextResponse } from "next/server";
import { execFileSync } from "child_process";

export async function GET() {
  const enginePath = process.env.PRISMA_QUERY_ENGINE_LIBRARY;

  if (!enginePath) {
    return NextResponse.json({
      success: false,
      error: "PRISMA_QUERY_ENGINE_LIBRARY is not set",
    });
  }

  const testScript = `
    const enginePath = process.argv[1];

    try {
      require(enginePath);

      console.log(JSON.stringify({
        success: true,
        message: "Native Prisma engine loaded successfully"
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

  try {
    const output = execFileSync(
      process.execPath,
      ["-e", testScript, enginePath],
      {
        encoding: "utf8",
        timeout: 10000,
      }
    );

    return NextResponse.json({
      test: "external-node-process",
      engine: enginePath.split("/").pop(),
      result: JSON.parse(output.trim()),
    });

  } catch (error) {
    return NextResponse.json({
      test: "external-node-process",
      engine: enginePath.split("/").pop(),
      success: false,
      exitCode: error.status || null,
      stdout: error.stdout?.toString() || "",
      stderr: error.stderr?.toString() || "",
      error: error.message,
    });
  }
}