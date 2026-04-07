FROM node:20-bullseye

# Install python and ffmpeg (required by whisper and yt-dlp)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create virtual environment and install python dependencies
# Doing this in a virtual environment to mirror the local execution path (venv/bin/python)
RUN python3 -m venv venv
RUN ./venv/bin/pip install --upgrade pip
RUN ./venv/bin/pip install yt-dlp openai-whisper

# Copy Python tools scripts
COPY tools/ ./tools/

# Copy and build Next.js application
COPY web/ ./web/
WORKDIR /app/web

# Install Node dependencies and build
RUN npm install
RUN npm run build

# Establish that Next.js will be running on port 3000
EXPOSE 3000

# Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED 1

# Start the Next.js server
CMD ["npm", "start"]
