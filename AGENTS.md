# Repository Guidelines

## Project Structure & Module Organization
This repo is a small Node.js app with a static frontend and an Express backend. Keep related logic in the existing modules and do not reintroduce duplicate top-level frontend files.

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
│       └── tts-engines.js
├── scripts/
│   ├── test-all-languages.js
│   └── pre-cache-tts.js
├── docs/
│   └── assets/color-rosetta.png
├── .cache/
├── rosetta-video/          # Video generation (separate project)
└── .venv-edge-tts/
```

Module responsibilities:

- `public/index.html`: static HTML entry.
- `public/assets/css/style.css`: frontend styles.
- `public/assets/js/app.js`: browser UI for the SVG color wheel and playback state.
- `public/assets/js/data.js`: the 24-color dataset and language metadata.
- `src/server/index.js`: static file hosting, `/api/tts`, cache reads/writes, and WAV wrapping.
- `src/server/tts-engines.js`: Gemini and Edge-TTS integrations.
- `scripts/test-all-languages.js`: end-to-end smoke test for the TTS endpoint.
- `scripts/pre-cache-tts.js`: batch pre-caching of TTS audio for all 24 colors × 10 languages.
- `docs/assets/color-rosetta.png`: project screenshot asset.
- `.cache/`: generated audio cache files. Do not hand-edit cached assets.

## Build, Test, and Development Commands
- `npm install`: install Node dependencies.
- `npm start`: start the Express server on `http://localhost:10010` by default.
- `npm run test:tts`: exercise all 10 languages against `/api/tts` and confirm cache miss/hit behavior.
- `BASE_URL=http://localhost:3100 npm run test:tts`: run the same smoke test against a non-default server port.
- `python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts`: set up the optional local Edge-TTS runtime.

There is no separate build step; this project runs directly from source.

## Coding Style & Naming Conventions
Use ES modules and keep functions small and single-purpose. Prefer `camelCase` for variables/functions and descriptive constant names such as `TTS_ENGINE` or `cacheDir`. Match the surrounding file’s formatting instead of reformatting unrelated code: backend files currently use 2-space indentation, while frontend/data files use 4 spaces. Keep comments brief and only where behavior is not obvious.

No formatter or linter is configured. Before submitting, review for consistent spacing, import order, and unchanged behavior in both TTS engines.

When moving files, keep server-side code under `src/server`, browser assets under `public/assets`, executable project scripts under `scripts`, and screenshots or static documentation assets under `docs/assets`.

## Testing Guidelines
Testing is currently integration-focused rather than framework-based. Run `npm start` in one terminal and `npm run test:tts` in another. If the server is not on port 10010, use `BASE_URL=http://localhost:<port> npm run test:tts`. Treat failures in cache headers, response status, or audio generation as blocking. When changing API behavior, manually verify one browser click path as well.

The TTS smoke test may report `HIT` on the first visible run if `.cache/` already contains generated assets. That is acceptable as long as responses are successful and cache headers remain consistent across repeated requests.

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
Keep secrets in `.env`; never commit API keys. The main runtime variables are `PORT`, `TTS_ENGINE`, `GEMINI_API_KEY`, and optionally `EDGE_TTS_PYTHON`. If you change cache behavior, static file layout, or Python runtime settings, document the required env vars and operational impact in `README.md` and preserve the default `.venv-edge-tts` path unless there is a strong reason to change it.
