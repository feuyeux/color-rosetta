# Repository Guidelines

## Project Structure & Module Organization
This repo is a small Node.js app with a static frontend and an Express backend. Keep logic in the existing modules and do not reintroduce duplicate top-level frontend files or parallel data sources.

Current layout:

```text
.
├── public/
│   ├── index.html
│   └── assets/
│       ├── css/style.css
│       └── js/
│           ├── app.js
│           └── data.js
├── src/
│   └── server/
│       ├── index.js
│       ├── tts-engines.js
│       └── utils.js
├── scripts/
│   ├── test-all-languages.js
│   └── pre-cache-tts.js
├── docs/
│   ├── ARCH_FLOW.md
│   ├── color-rosetta.md
│   └── assets/color-rosetta.png
├── output/                 # generated demo videos
├── .cache/
├── rosetta-video/          # Video generation (separate project)
└── .venv-edge-tts/
```

Module responsibilities:

- `public/index.html`: static HTML entry.
- `public/assets/css/style.css`: frontend styles.
- `public/assets/js/app.js`: browser UI for the SVG color wheel, playback state, and client-side TTS request coordination.
- `public/assets/js/data.js`: the 24-color dataset and language metadata. Treat this as the single source of truth across frontend, backend, and scripts.
- `src/server/index.js`: static file hosting, `/api/tts`, cache reads/writes, response headers, and WAV wrapping.
- `src/server/tts-engines.js`: Gemini and Edge-TTS integrations.
- `src/server/utils.js`: cache-key generation and engine-specific audio metadata.
- `scripts/test-all-languages.js`: end-to-end smoke test for the TTS endpoint.
- `scripts/pre-cache-tts.js`: batch pre-caching of TTS audio for all 24 colors × 10 languages.
- `docs/color-rosetta.md`: long-form cultural essay tied to the project dataset.
- `docs/assets/color-rosetta.png`: project screenshot asset.
- `output/`: generated per-language demo videos.
- `.cache/`: generated audio cache files. Do not hand-edit cached assets.

## Build, Test, and Development Commands
- `npm install`: install Node dependencies.
- `npm start`: start the Express server on `http://localhost:10010` by default.
- `PORT=10011 npm start`: run on an isolated port when `10010` is already occupied.
- `npm run test:tts`: exercise all 10 languages against `/api/tts` and confirm cache/header behavior.
- `BASE_URL=http://localhost:3100 npm run test:tts`: run the smoke test against a non-default server port.
- `TTS_TEST_ENGINES=edge,gemini BASE_URL=http://localhost:3100 npm run test:tts`: explicitly test one or both engines against a target server.
- `python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts`: set up the optional local Edge-TTS runtime.

There is no separate build step; this project runs directly from source.

## Coding Style & Naming Conventions
Use ES modules and keep functions small and single-purpose. Prefer `camelCase` for variables/functions and descriptive constant names such as `TTS_ENGINE` or `cacheDir`. Match the surrounding file’s formatting instead of reformatting unrelated code: backend files use 2-space indentation, while frontend/data files use 4-space indentation. Keep comments brief and only where behavior is not obvious.

No formatter or linter is configured. Before submitting, review for consistent spacing, import order, and unchanged behavior in both TTS engines.

When moving files, keep server-side code under `src/server`, browser assets under `public/assets`, executable project scripts under `scripts`, and screenshots or static documentation assets under `docs/assets`.

Non-obvious invariants:

- Keep `public/assets/js/data.js` as the only source of truth for colors, languages, and validation lists.
- Frontend TTS changes must preserve stale-request protection. Rapid clicks should never allow an older response to start playing after a newer selection.
- `/api/tts` should only send audio headers for successful audio responses. Error paths must return JSON with correct content types.
- Cache behavior must remain engine-aware: Edge stores `.mp3`, Gemini stores `.wav`.

## Testing Guidelines
Testing is integration-focused rather than framework-based. Run `npm start` in one terminal and `npm run test:tts` in another. If the default port is occupied, use `PORT=... npm start` and the matching `BASE_URL=http://localhost:<port> npm run test:tts`.

Treat these as blocking:

- non-200 responses from `/api/tts` unless a failure path is the thing being tested
- incorrect `X-Cache` / `X-TTS-Engine` behavior on successful audio responses
- audio headers on JSON error responses
- stale playback or wrong audio after rapid UI clicks

When changing API behavior, manually verify one normal browser click path and one rapid-click path as well.

The TTS smoke test may report `HIT` on the first visible run if `.cache/` already contains generated assets. That is acceptable as long as responses are successful and cache headers remain consistent across repeated requests.

Gemini notes:

- Gemini availability can fail because of missing `GEMINI_API_KEY`, quota, or regional restrictions. The code should still fail cleanly and the smoke test should exit non-zero on real errors.
- If you intend to validate Gemini specifically, run `TTS_TEST_ENGINES=gemini BASE_URL=http://localhost:<port> npm run test:tts`.

## Commit & Pull Request Guidelines
History is minimal, but the existing commit uses a short, descriptive subject (`Initial commit: ...`). Follow that pattern: concise, imperative, and specific to the change. PRs should include a summary, any `.env` or runtime prerequisites, linked issues if applicable, and screenshots or short recordings for UI changes.

For AI-agent commits in this repository, use the following identities:

| Committing Tool | Author | Co-authored-by |
| :-------------- | :----- | :------------- |
| Claude | `Claude <noreply@anthropic.com>` | `Co-authored-by: Claude <noreply@anthropic.com>` |
| Codex | `Codex <noreply@openai.com>` | `Co-authored-by: Codex <noreply@openai.com>` |
| Gemini | `Gemini <noreply@google.com>` | `Co-authored-by: Gemini <noreply@google.com>` |
| OpenCode | `OpenCode <opencode@ai.local>` | `Co-authored-by: OpenCode <opencode@ai.local>` |

## Security & Configuration Tips
Keep secrets in `.env`; never commit API keys. The main runtime variables are `PORT`, `TTS_ENGINE`, `GEMINI_API_KEY`, and optionally `EDGE_TTS_PYTHON` and `EDGE_TTS_PROXY`. If you change cache behavior, static file layout, response headers, or Python runtime settings, document the required env vars and operational impact in `README.md` and preserve the default `.venv-edge-tts` path unless there is a strong reason to change it.
