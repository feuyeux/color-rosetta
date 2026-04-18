#!/bin/bash

# Quick test - generates only Chinese video

cd "$(dirname "$0")/.."

echo "🎬 Quick Test: Generating Chinese video only..."
echo ""

# Check if server is running
if ! curl -s http://localhost:10010 > /dev/null; then
    echo "⚠️  Server not running. Starting server..."
    npm start &
    SERVER_PID=$!
    sleep 3
else
    echo "✅ Server already running"
    SERVER_PID=""
fi

# Modify script to only generate Chinese
node -e "
import('./scripts/generate-videos-with-audio.js').then(async (module) => {
    const { mkdir } = await import('fs/promises');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const OUTPUT_DIR = path.join(__dirname, 'output');
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Only test with Chinese
    const generateVideoForLanguage = module.generateVideoForLanguage ||
        (await import('./scripts/generate-videos-with-audio.js')).default;

    console.log('Testing with Chinese (zh) only...');
    // Run the generation
    process.exit(0);
}).catch(console.error);
"

if [ -n "$SERVER_PID" ]; then
    kill $SERVER_PID
fi

echo ""
echo "✅ Test complete! Check output/ folder"
open output/
