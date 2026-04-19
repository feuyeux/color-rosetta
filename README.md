# Color Rosetta

Interactive 24-color wheel with multilingual TTS. Click any segment to hear its name pronounced in 10 languages via Gemini or Edge-TTS.

## Features

- 24 color segments arranged in a spiked SVG wheel
- 10 languages: 🇨🇳 Chinese, 🇬🇧 English, 🇫🇷 French, 🇪🇸 Spanish, 🇷🇺 Russian, 🇬🇷 Greek, 🇮🇳 Hindi, 🇸🇦 Arabic, 🇯🇵 Japanese, 🇰🇷 Korean
- Dual TTS engines: Google Gemini TTS & Microsoft Edge-TTS
- MD5-hashed audio cache with automatic proxy fallback
- Keyboard accessible (Tab + Enter/Space)
- RTL support for Arabic

## Quick Start

```bash
npm install

# Configure .env
PORT=10010
TTS_ENGINE=edge          # or gemini
GEMINI_API_KEY=your_key  # required for Gemini

npm start                # → http://localhost:10010
```

Edge-TTS requires Python:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## Commands

```bash
npm start                # Start server (default port 10010)
npm run test:tts         # Smoke test all 10 languages
npm run pre-cache        # Pre-cache all TTS audio (edge engine)
BASE_URL=http://localhost:3100 npm run test:tts  # Custom port
```

## Docs

- [Cultural essay: Color Rosetta](docs/color-rosetta.md)
- [Architecture flow](docs/ARCH_FLOW.md)
- [Video generation guide](rosetta-video/README.md)

## Translations

[中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
