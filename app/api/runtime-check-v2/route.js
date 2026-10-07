import { NextResponse } from "next/server";
import os from "os";
import process from "process";
import { execSync } from "child_process";

export async function GET() {
  let ldd = "unavailable";
  let libc = "unknown";

  try {
    ldd = execSync("ldd --version", {
      encoding: "utf8",
      timeout: 3000,
    });
  } catch (e) {
    ldd = String(e);
  }

  try {
    libc =
      process.report?.getReport().header?.glibcVersionRuntime ||
      "not glibc";
  } catch (e) {
    libc = "unknown";
  }

  return NextResponse.json({
    diagnostic: "V2",
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
    versions: process.versions,
    libc,
    ldd,
    cwd: process.cwd(),
    osRelease: os.release(),
  });
}