# Color Rosetta

## Project Overview

Color Rosetta is an interactive 24-color wheel with multilingual TTS. Users click color segments to hear names in 10 languages (`zh`, `en`, `fr`, `es`, `ru`, `el`, `hi`, `ar`, `ja`, `ko`) via Gemini or Edge-TTS.

## Working Rules

- Keep `public/assets/js/data.js` as the only source of truth for colors, labels, and valid languages.
- Do not duplicate frontend entry files or move server code out of `src/server`.
- Preserve existing formatting conventions: backend uses 2 spaces, frontend/data uses 4.
- Treat `.cache/` and `output/` as generated artifacts. Do not hand-edit them.

## Architecture

1. **Frontend**
   - `public/index.html`: static shell
   - `public/assets/js/app.js`: SVG wheel, language and engine switching, audio playback, stale-request protection
   - `public/assets/css/style.css`: visual system
2. **Backend**
   - `src/server/index.js`: static hosting, `/api/tts`, cache reads/writes, headers, WAV wrapping, rate limiting, graceful shutdown
   - `src/server/tts-engines.js`: Gemini and Edge-TTS execution paths
   - `src/server/utils.js`: cache-key and engine audio metadata helpers
3. **Shared data**
   - `public/assets/js/data.js`: 24-color dataset and language metadata used by UI, server validation, and scripts
4. **Scripts**
   - `scripts/test-all-languages.js`: smoke tests for `edge` and optional `gemini`
   - `scripts/pre-cache-tts.js`: Edge cache warmup

## Response Contract

- Successful `edge` responses return `audio/mpeg`.
- Successful `gemini` responses return `audio/wav`.
- Successful audio responses include `X-Cache` and `X-TTS-Engine`.
- Error responses must remain JSON. Do not pre-set audio headers before success is known.

## Frontend Constraints

- Rapid repeated clicks must not allow an earlier TTS response to play after a later selection.
- If you change playback behavior, preserve both audio stop behavior and request cancellation or ignore-stale behavior.
- Keep accessibility labels and keyboard interaction on wheel segments intact.

## TTS Engine Notes

- **Gemini**: depends on `GEMINI_API_KEY` and may fail because of quota or regional restrictions. Failures should surface clearly and should not be disguised as audio responses.
- **Edge-TTS**: depends on a Python runtime, defaults to `.venv-edge-tts/bin/python`, and may retry or fall back through `EDGE_TTS_PROXY`.

## Commands

```bash
npm install
npm start
PORT=10011 npm start
BASE_URL=http://localhost:10011 npm run test:tts
TTS_TEST_ENGINES=edge,gemini BASE_URL=http://localhost:10011 npm run test:tts
npm run pre-cache
```

## Validation Checklist

- If port `10010` is already in use, start the app on another port and point tests at it.
- For API changes, verify one normal browser click and one rapid-click path.
- Treat smoke test failures as real failures; the script is expected to exit non-zero now.
- A first-run `HIT` is acceptable if `.cache/` is already warm.

## Commit Identity

Use the following AI commit identities in this repository:

| Committing Tool | Author | Co-authored-by |
| :-------------- | :----- | :------------- |
| Claude | `Claude <noreply@anthropic.com>` | `Co-authored-by: Claude <noreply@anthropic.com>` |
| Codex | `Codex <noreply@openai.com>` | `Co-authored-by: Codex <noreply@openai.com>` |
| Gemini | `Gemini <noreply@google.com>` | `Co-authored-by: Gemini <noreply@google.com>` |
| OpenCode | `OpenCode <opencode@ai.local>` | `Co-authored-by: OpenCode <opencode@ai.local>` |
