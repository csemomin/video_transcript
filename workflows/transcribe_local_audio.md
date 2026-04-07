# Workflow: Transcribe Local Audio File

## Objective
Convert a local audio file on the filesystem to a plain text transcript.

## Required Inputs
- `audio_path`: The file path to the local audio file.

## Expected Outputs
- `transcript.txt`: A plain text file containing the transcribed text from the audio.

## Step-by-Step Instructions

1. **Transcribe Audio**
   - Use `tools/transcribe_audio.py` to generate the text transcript from the local audio file.
   - **Command:** `python tools/transcribe_audio.py "<audio_path>" -o transcript.txt -m base`
   - **Note:** The `-m` flag specifies the Whisper model size (`tiny`, `base`, `small`, `medium`, `large`). Default is `base` for a balance between speed and accuracy. If the user requires higher accuracy, use `small` or `medium`.

## Troubleshooting & Edge Cases
- **Missing Dependencies:** Ensure `openai-whisper` is installed and `ffmpeg` is available via system packages.
- **Out of Memory Error (OOM):** If `transcribe_audio.py` runs out of memory, try using a smaller model like `-m tiny` or close other memory-intensive applications.
