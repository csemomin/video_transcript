import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

const JOBS_FILE = path.join(process.cwd(), "jobs.json");
const TOOLS_DIR = path.resolve(process.cwd(), "../tools");
const VENV_PYTHON = path.resolve(process.cwd(), "../venv/bin/python");
const TMP_DIR = path.resolve(process.cwd(), "../.tmp");

async function updateJob(id, updates) {
  try {
    let jobs = {};
    try {
      const data = await fs.readFile(JOBS_FILE, "utf-8");
      jobs = JSON.parse(data);
    } catch (e) {
      // file might not exist or empty
    }
    
    if (!jobs[id]) jobs[id] = {};
    jobs[id] = { ...jobs[id], ...updates, updatedAt: Date.now() };
    await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error updating job:", err);
  }
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing: ${command}\n${stderr}`);
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Ensure .tmp dir exists
async function ensureTmpDir() {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch(e) {}
}

async function processJob(jobId, url) {
  try {
    await ensureTmpDir();
    await updateJob(jobId, { status: "downloading" });
    
    // 1. Get title
    let title = jobId;
    try {
      const titleOut = await runCommand(`${VENV_PYTHON} -m yt_dlp --print title "${url}"`);
      if (titleOut) {
        // Sanitize title for filesystem
        title = titleOut.split('\n')[0].replace(/[^a-zA-Z0-9 _-]/g, '').trim();
      }
    } catch(e) {
      console.error("Could not fetch title, using jobId");
    }
    
    await updateJob(jobId, { title });
    
    const audioPath = path.join(TMP_DIR, `${title}.mp3`);
    const transcriptPath = path.join(TMP_DIR, `${title}.txt`);

    // 2. Download audio
    // using the provided tools
    await runCommand(`${VENV_PYTHON} ${path.join(TOOLS_DIR, "download_audio.py")} "${url}" -o "${audioPath}"`);
    
    // 3. Transcribe audio
    await updateJob(jobId, { status: "transcribing" });
    await runCommand(`${VENV_PYTHON} ${path.join(TOOLS_DIR, "transcribe_audio.py")} "${audioPath}" -o "${transcriptPath}"`);
    
    // 4. Complete
    await updateJob(jobId, { status: "completed", filePrefix: title });
    
  } catch (err) {
    await updateJob(jobId, { status: "error", error: err.message });
  }
}

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const jobId = Math.random().toString(36).substring(2, 15);
    
    // Initialize job
    await updateJob(jobId, {
      url,
      status: "pending",
      createdAt: Date.now()
    });

    // Fire and forget (run in background)
    processJob(jobId, url);

    return NextResponse.json({ jobId });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
