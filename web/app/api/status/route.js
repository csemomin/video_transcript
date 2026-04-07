import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const JOBS_FILE = path.join(process.cwd(), "jobs.json");

export async function GET() {
  try {
    const data = await fs.readFile(JOBS_FILE, "utf-8");
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return NextResponse.json({});
  }
}
