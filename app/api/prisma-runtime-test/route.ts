import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const clientDir = path.join(
    process.cwd(),
    "node_modules",
    ".prisma",
    "client"
  );

  const engine = path.join(
    clientDir,
    "libquery_engine-linux-musl-openssl-3.0.x.so.node"
  );

  const oldEngine = path.join(
    clientDir,
    "libquery_engine-linux-musl.so.node"
  );

  return NextResponse.json({
    test: "PRISMA_RUNTIME_V3",

    platform: process.platform,
    node: process.version,

    cwd: process.cwd(),

    prismaEnv:
      process.env.PRISMA_QUERY_ENGINE_LIBRARY ?? null,

    expectedEngine: engine,

    expectedEngineExists: fs.existsSync(engine),

    oldEngine: oldEngine,

    oldEngineExists: fs.existsSync(oldEngine),

    clientDirExists: fs.existsSync(clientDir),

    clientFiles: fs.existsSync(clientDir)
      ? fs
          .readdirSync(clientDir)
          .filter(
            (file) =>
              file.includes("query_engine") ||
              file.includes("schema")
          )
      : [],
  });
}