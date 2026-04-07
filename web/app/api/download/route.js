import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";

const JOBS_FILE = path.join(process.cwd(), "jobs.json");
const TMP_DIR = path.resolve(process.cwd(), "../.tmp");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // audio or text
  const jobId = searchParams.get("jobId");

  if (!jobId || !type) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  try {
    const jobsData = await import("fs/promises").then(fs => fs.readFile(JOBS_FILE, "utf-8"));
    const jobs = JSON.parse(jobsData);
    const job = jobs[jobId];

    if (!job || !job.filePrefix) {
      return new NextResponse("Job not ready", { status: 404 });
    }

    const filename = type === "audio" ? `${job.filePrefix}.mp3` : `${job.filePrefix}.txt`;
    const filePath = path.join(TMP_DIR, filename);

    const fileStat = await stat(filePath);
    
    const stream = createReadStream(filePath);
    
    // Note: Streaming responses in Next.js requires returning a ReadableStream
    // We can convert a Node stream to a Web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      }
    });

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Type", type === "audio" ? "audio/mpeg" : "text/plain");
    headers.set("Content-Length", fileStat.size.toString());

    return new NextResponse(readable, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error downloading file", { status: 500 });
  }
}
