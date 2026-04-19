# Rosetta Video Generator

`rosetta-video/` contains the canonical tooling for generating demo videos from the main `Color Rosetta` app.

## What it produces

- One final MP4 per language for all 10 supported languages
- Each video clicks through the full 24-color wheel clockwise
- Audio is merged from the cached Edge-TTS files
- Final output is written to the repository-level `output/` directory

## Canonical entrypoints

- `./rosetta-video/generate-videos.sh`
- `node rosetta-video/generate-videos-with-audio.js`

The shell wrapper starts the app server if needed, then runs the generator.

## Usage

From the repository root:

```bash
./rosetta-video/generate-videos.sh
```

Or run the generator directly after starting the server:

```bash
npm start
node rosetta-video/generate-videos-with-audio.js
ls -lh output/
```

To render only specific languages:

```bash
node rosetta-video/generate-videos-with-audio.js zh,en
```

## Output files

The generator writes:

- `output/color-wheel-{lang}-{name}.mp4` for each requested language
- Temporary `-silent.mp4` and `-audio.mp3` files during generation, then removes them on success

## Dependencies

- Node.js + npm
- FFmpeg and FFprobe on `PATH`
- The main app available at `http://localhost:10010`
- Pre-cached Edge-TTS audio in `.cache/`

## Notes

- The generator uses `public/assets/js/data.js` as the canonical 24-color dataset.
- If any cached audio is missing, generation stops with a clear error naming the missing file.
- Legacy experimental scripts were removed to keep this directory aligned with the current workflow.
