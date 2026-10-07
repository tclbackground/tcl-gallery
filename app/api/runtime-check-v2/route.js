import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  let glibcVersion = null;

  try {
    if (process.report?.getReport) {
      const report = process.report.getReport();
      glibcVersion =
        report?.header?.glibcVersionRuntime || null;
    }
  } catch (error) {
    glibcVersion = `ERROR: ${error.message}`;
  }

  return NextResponse.json({
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,

    glibcVersion,

    loaders: {
      rhelLoader: fs.existsSync("/lib64/ld-linux-x86-64.so.2"),
      standardLoader: fs.existsSync("/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2"),
      muslLoader: fs.existsSync("/lib/ld-musl-x86_64.so.1"),
    },

    files: {
      rhelEngine: fs.existsSync(
        "/app/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"
      ),
    },

    prismaEngineVariable:
      process.env.PRISMA_QUERY_ENGINE_LIBRARY || null,
  });
}