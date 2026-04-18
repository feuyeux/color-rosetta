# Color Rosetta

## Project Overview

Interactive 24-color wheel with multilingual TTS (Color Rosetta). Users click color segments to hear names in 10 languages (zh, en, fr, es, ru, el, hi, ar, ja, ko) via Gemini or Edge-TTS.

## Architecture

1. **Frontend** (`public/index.html`, `public/assets/js/app.js`, `public/assets/css/style.css`)
   - SVG color wheel with 24 spiked segments, language switcher, TTS engine selector
   - Audio concurrency control (stops previous audio on new click)
   - ARIA accessibility attributes on interactive elements

2. **Backend** (`src/server/index.js`)
   - Express server, `/api/tts` endpoint, MD5-hashed `.cache/` system
   - Auto proxy fallback on Edge-TTS 500 errors (port 7897)
   - In-memory rate limiting (60 req/min per IP)
   - Graceful shutdown on SIGTERM/SIGINT

3. **TTS Engines** (`src/server/tts-engines.js`)
   - **Gemini**: `@google/generative-ai` SDK, `gemini-3.1-flash-tts-preview`, cached client instances
   - **Edge-TTS**: Python subprocess with retry logic and temp file cleanup

4. **Shared** (`src/shared/color-data.js`)
   - Canonical color data, language codes, and valid languages shared between frontend/backend/scripts

## Data Model

`public/assets/js/data.js` — 24 color objects:
```javascript
{ angle: 0, hex: "#FF0000", zh: "红色", en: "Red", fr: "Rouge", ... }
```

## Cache

- Key: `MD5(engine_lang_text)` → `.mp3` (Edge) / `.wav` (Gemini) in `.cache/`
- Headers: `X-Cache: HIT/MISS`, `X-TTS-Engine: gemini/edge`
- Tracked via Git LFS (`.gitattributes`)

## Commands

```bash
npm start                # Express server (default port 10010)
npm run test:tts         # Smoke test all 10 languages
BASE_URL=http://localhost:3100 npm run test:tts  # Custom port
npm run pre-cache        # Pre-cache all TTS audio files (edge engine)
```

## Scripts

- `scripts/pre-cache-tts.js` — batch pre-caching TTS audio for all 24 colors × 10 languages
- `scripts/test-all-languages.js` — smoke test for `/api/tts` endpoint

## Video Generation

Located in `rosetta-video/`. Uses Puppeteer for visual capture and FFmpeg for audio integration.
- **Audio Constraint**: Puppeteer DOES NOT capture system/browser audio. Audio MUST be merged post-recording.
- **Merge Process**:
    1. Collect individual TTS audio files from `.cache/`.
    2. Concat files using FFmpeg `concat` into a single track.
    3. Merge the silent video and concat audio using FFmpeg with `-itsoffset` for synchronization.
- **Resolution**: 1080x1920 (Portrait).

## Environment Variables

`.env`: `GEMINI_API_KEY`, `TTS_ENGINE` (edge/gemini), `PORT` (10010), `EDGE_TTS_PYTHON` (.venv-edge-tts/bin/python)
