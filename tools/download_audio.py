import yt_dlp
import argparse
import sys
import os

def download_audio(youtube_url, output_path="audio.mp3"):
    """
    Downloads audio from a YouTube video using yt-dlp.
    """
    print(f"Downloading audio from {youtube_url}...")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_path.replace('.mp3', ''),
        'quiet': False
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
        print(f"Successfully downloaded audio to {output_path}")
        return True
    except Exception as e:
        print(f"Error downloading video: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download audio from a YouTube video.")
    parser.add_argument("url", help="The YouTube URL to download")
    parser.add_argument("--output", "-o", default=".tmp/audio.mp3", help="Output file path (default: .tmp/audio.mp3)")
    
    args = parser.parse_args()
    
    # Ensure directory exists
    out_dir = os.path.dirname(args.output)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir)

    success = download_audio(args.url, args.output)
    if not success:
        sys.exit(1)
