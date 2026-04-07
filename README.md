# YouTube Audio Extractor & Transcriber

This project provides a sleek, highly-interactive Next.js web application that extracts audio from YouTube videos and automatically transcribes it into high-quality text using OpenAI's Whisper model. It integrates an asynchronous queuing backend using custom Python tools (`tools/download_audio.py` and `tools/transcribe_audio.py`).

## Features
- **Modern Glassmorphism UI**: High-impact visually appealing frontend.
- **Concurrent Processing**: The server executes downloads and transcriptions dynamically in the background without locking up the client request.
- **Polling Tracking**: Track real-time progress for your queued jobs (Pending, Downloading Audio, Transcribing, Completed, Error).
- **Automated Downloads**: Download the resulting `.mp3` and `.txt` files directly onto your system.

## Project Structure
- `/tools/`: Contains foundational python tools to interface with `yt-dlp` and `whisper`.
- `/web/`: Contains the Next.js App Router providing the dashboard and API routes.
- `/venv/`: Local Python Virtual Environment holding dependencies. (Ignored in Git/Docker context).

---

## Running with Docker (Recommended)

To run the application easily without manually configuring Python virtual environments and node modules:

1. **Build the container image**:
   ```bash
   docker build -t youtube-transcriber-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 -d youtube-transcriber-app
   ```

3. **Access the application**: 
   Open [http://localhost:3000](http://localhost:3000)

*(Note: Ensure Docker has sufficient memory allocated, as downloading and loading the Whisper model into RAM requires at least ~4GB of Docker memory).*

---

## Running Locally (Development Mode)

If you'd prefer to run the application on your host machine:

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: 3.8+
- **FFmpeg**: Configured in system path (required for `whisper`)

### 2. Set Up Python Environment
Create a virtual environment specifically in a folder named `venv` in the root:
```bash
python3 -m venv venv
### Activate on Linux/Mac
source venv/bin/activate 
### Activate on Windows
venv\Scripts\activate

# Install requirements
pip install yt-dlp openai-whisper
```

### 3. Set Up Node Environment
Open a separate terminal to run the Next frontend:
```bash
cd web
npm install
npm run dev
```

The application will be running on [http://localhost:3000](http://localhost:3000). The frontend will automatically detect the python environment `../venv/bin/python` to run background jobs.
