# Color Rosetta

## Project Overview

Color Rosetta is an interactive 24-color wheel with multilingual TTS. Users click color segments to hear names in 10 languages (`zh`, `en`, `fr`, `es`, `ru`, `el`, `hi`, `ar`, `ja`, `ko`) via Gemini or Edge-TTS.

## Operating Notes

- Keep changes local to the existing modules. `public/assets/js/data.js` remains the canonical shared dataset.
- Preserve the current split: browser assets in `public/assets`, server logic in `src/server`, scripts in `scripts`.
- Match existing formatting instead of reformatting unrelated files.
- Do not hand-edit `.cache/` contents.

## Architecture

1. **Frontend**
   - `public/index.html`: static document shell
   - `public/assets/js/app.js`: interaction flow, playback state, stale-request handling
   - `public/assets/css/style.css`: layout and visual styling
2. **Backend**
   - `src/server/index.js`: `/api/tts`, static hosting, cache IO, headers, WAV wrapping, rate limiting
   - `src/server/tts-engines.js`: Gemini SDK path and Edge Python path
   - `src/server/utils.js`: cache-key and audio config helpers
3. **Shared data and scripts**
   - `public/assets/js/data.js`: shared colors and languages
   - `scripts/test-all-languages.js`: smoke tests
   - `scripts/pre-cache-tts.js`: cache warm-up

## Critical Invariants

- Frontend audio behavior must remain race-safe. Older requests must not update playback after a newer click.
- Successful audio responses should include `X-Cache` and `X-TTS-Engine`.
- JSON error responses must not be mislabeled as `audio/*`.
- Edge cache files are `.mp3`; Gemini cache files are `.wav`.

## Commands

```bash
npm install
npm start
PORT=10011 npm start
BASE_URL=http://localhost:10011 npm run test:tts
TTS_TEST_ENGINES=gemini BASE_URL=http://localhost:10011 npm run test:tts
npm run pre-cache
```

## Engine Caveats

- Gemini can fail due to missing `GEMINI_API_KEY`, quota, or regional restrictions. Code and tests should make those failures explicit.
- Edge-TTS depends on `.venv-edge-tts/bin/python` unless `EDGE_TTS_PYTHON` is overridden.
- Edge proxy fallback may use `EDGE_TTS_PROXY`, defaulting to `http://127.0.0.1:7897`.

## Review Checklist

- If `10010` is busy, do not reuse whatever is already listening there by accident. Start this repo on another port.
- For UI changes, verify both a normal click and rapid repeated clicks.
- For API changes, confirm header correctness on success and content-type correctness on failure.
- Use the smoke test rather than assuming cache or TTS behavior.

## Commit Identity

Use the following AI commit identities in this repository:

| Committing Tool | Author | Co-authored-by |
| :-------------- | :----- | :------------- |
| Claude | `Claude <noreply@anthropic.com>` | `Co-authored-by: Claude <noreply@anthropic.com>` |
| Codex | `Codex <noreply@openai.com>` | `Co-authored-by: Codex <noreply@openai.com>` |
| Gemini | `Gemini <noreply@google.com>` | `Co-authored-by: Gemini <noreply@google.com>` |
| OpenCode | `OpenCode <opencode@ai.local>` | `Co-authored-by: OpenCode <opencode@ai.local>` |
