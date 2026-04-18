#!/bin/bash

# Color Wheel Video Generator
# Generates 10 separate videos (one per language) with audio

cd "$(dirname "$0")/.."

echo "🎬 Color Wheel Video Generator"
echo "================================"
echo ""
echo "This will generate 10 videos (one per language):"
echo "  zh (Chinese), en (English), fr (French), es (Spanish), ru (Russian)"
echo "  el (Greek), hi (Hindi), ar (Arabic), ja (Japanese), ko (Korean)"
echo ""
echo "Each video will be ~1 minute long with synchronized audio."
echo ""

# Check if server is running
if ! curl -s http://localhost:10010 > /dev/null; then
    echo "⚠️  Server not running. Starting server..."
    npm start &
    SERVER_PID=$!
    sleep 3
    echo "✅ Server started (PID: $SERVER_PID)"
else
    echo "✅ Server already running"
    SERVER_PID=""
fi

echo ""
echo "🎥 Starting video generation..."
echo ""

node scripts/generate-videos-with-audio.js

EXIT_CODE=$?

if [ -n "$SERVER_PID" ]; then
    echo ""
    echo "🛑 Stopping server..."
    kill $SERVER_PID
fi

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "🎉 Success! Videos saved to: output/"
    echo ""
    ls -lh output/*.mp4 | grep -v silent
    echo ""
    echo "📂 Opening output folder..."
    open output/
else
    echo ""
    echo "❌ Video generation failed with exit code $EXIT_CODE"
fi

exit $EXIT_CODE
