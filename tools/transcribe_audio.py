import argparse
import sys
import os
import whisper

def transcribe_audio(audio_path, output_path, model_name="base"):
    """
    Transcribes an audio file to text using OpenAI Whisper.
    """
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}", file=sys.stderr)
        return False

    print(f"Loading Whisper model '{model_name}'...")
    try:
        model = whisper.load_model(model_name)
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return False

    print(f"Transcribing '{audio_path}'... This may take a while depending on file size.")
    try:
        result = model.transcribe(audio_path, verbose=True, fp16=False)
        transcript_text = result["text"].strip()
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(transcript_text)
            
        print(f"Successfully transcribed audio. Saved to {output_path}")
        return True
    except Exception as e:
        print(f"Error during transcription: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transcribe audio file to text using Whisper.")
    parser.add_argument("audio_path", help="Path to the audio file (e.g., audio.mp3)")
    parser.add_argument("--output", "-o", default="transcript.txt", help="Output transcript text file path")
    parser.add_argument("--model", "-m", default="base", help="Whisper model to use (tiny, base, small, medium, large)")
    
    args = parser.parse_args()

    # Ensure output directory exists if provided
    out_dir = os.path.dirname(args.output)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir)

    success = transcribe_audio(args.audio_path, args.output, args.model)
    if not success:
        sys.exit(1)
