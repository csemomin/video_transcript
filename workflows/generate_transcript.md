# Workflow: Generate YouTube Video Transcript

## Objective
Download audio from a YouTube video and convert it to a text transcript.

## Required Inputs
- `youtube_url`: The full URL of the YouTube video to process.

## Expected Outputs
- `transcript.txt`: A plain text file containing the transcribed text from the video.

## Step-by-Step Instructions

1. **Download Audio**
   - Use `tools/download_audio.py` to extract and download the video's audio.
   - **Command:** `python tools/download_audio.py "<youtube_url>"`
   - **Output:** Saves the audio file to `.tmp/audio.mp3` by default.

2. **Transcribe Audio**
   - Use `tools/transcribe_audio.py` to generate the text transcript from the downloaded audio.
   - **Command:** `python tools/transcribe_audio.py .tmp/audio.mp3 -o transcript.txt -m base`
   - **Note:** The `-m` flag specifies the Whisper model size (`tiny`, `base`, `small`, `medium`, `large`). Default is `base` for a balance between speed and accuracy. If the user requires higher accuracy and is willing to wait, use `small` or `medium`.

## Troubleshooting & Edge Cases

- **Rate Limiting / Download Errors:** If `youtube_to_audio.py` fails due to YouTube restrictions, try waiting or verify the video is publicly accessible. 
- **Missing Dependencies:** Ensure `yt-dlp` and `openai-whisper` are installed via `pip install -r requirements.txt`. (Additionally requires `ffmpeg` installed on the system).
- **Out of Memory Error (OOM):** If `transcribe_audio.py` runs out of RAM or VRAM, try using a smaller model like `-m tiny`.
