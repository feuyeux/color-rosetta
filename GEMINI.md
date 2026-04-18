# Color Rosetta

## Project Overview

Interactive 24-color wheel with multilingual TTS (Color Rosetta). Users click color segments to hear names in 10 languages (zh, en, fr, es, ru, el, hi, ar, ja, ko) via Gemini or Edge-TTS.

## Architecture

1. **Frontend** (`public/index.html`, `public/assets/js/app.js`, `public/assets/css/style.css`)
   - SVG color wheel with 24 spiked segments, language switcher, TTS engine selector
   - Audio playback state in the browser UI
   - ARIA accessibility attributes on interactive elements

2. **Backend** (`src/server/index.js`)
   - Express server, `/api/tts` endpoint, `.cache/` audio cache
   - Edge-TTS proxy fallback and in-memory rate limiting
   - Graceful shutdown on SIGTERM/SIGINT

3. **TTS Engines** (`src/server/tts-engines.js`)
   - **Gemini**: `@google/generative-ai` SDK integration
   - **Edge-TTS**: Python subprocess execution with retries and temp file cleanup

## Project Structure

- `public/index.html`: static HTML entry
- `public/assets/css/style.css`: frontend styles
- `public/assets/js/app.js`: browser-side interaction and playback logic
- `public/assets/js/data.js`: 24-color dataset and language metadata
- `src/server/index.js`: static hosting, `/api/tts`, cache reads/writes, response headers
- `src/server/tts-engines.js`: Gemini and Edge-TTS integrations
- `src/server/utils.js`: cache key and audio config helpers
- `scripts/test-all-languages.js`: TTS smoke test script
- `scripts/pre-cache-tts.js`: batch cache warm-up script

## Development Commands

```bash
npm install
npm start
npm run test:tts
npm run pre-cache
```

## Implementation Notes

- Use ES modules throughout the project.
- Keep backend formatting aligned with the existing 2-space indentation.
- Keep frontend/data formatting aligned with the existing 4-space indentation.
- Do not hand-edit generated assets in `.cache/`.
- Keep browser assets under `public/assets` and server code under `src/server`.

## Commit Identity

Use the following AI commit identities in this repository:

| Committing Tool | Author | Co-authored-by |
| :-------------- | :----- | :------------- |
| Claude | `Claude <noreply@anthropic.com>` | `Co-authored-by: Claude <noreply@anthropic.com>` |
| Codex | `Codex <noreply@openai.com>` | `Co-authored-by: Codex <noreply@openai.com>` |
| Gemini | `Gemini <noreply@google.com>` | `Co-authored-by: Gemini <noreply@google.com>` |
| OpenCode | `OpenCode <opencode@ai.local>` | `Co-authored-by: OpenCode <opencode@ai.local>` |
