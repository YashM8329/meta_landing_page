import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const html = readFileSync(path.join(process.cwd(), "src/app/asia/page.html"), "utf8");

export function GET() {
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
