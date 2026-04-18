# Color Rosetta

Interactive 24-hue color wheel with multilingual TTS. Click any color segment to hear its name pronounced in 10 languages via Gemini or Edge-TTS.

<img src="docs/assets/color-rosetta.png" alt="Color Rosetta screenshot" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## Features

- 24 color segments arranged in a spiked rosetta wheel (SVG)
- 10 languages: Chinese, English, French, Spanish, Russian, Greek, Hindi, Arabic, Japanese, Korean
- Dual TTS engines: Google Gemini TTS & Microsoft Edge-TTS
- MD5-hashed audio cache with automatic proxy fallback
- Keyboard accessible (Tab + Enter/Space)
- RTL support for Arabic

## Video Demos

**🇨🇳 中文**  
<video src="rosetta-video/output/color-wheel-zh-chinese.mp4" controls width="320"></video>

**🇬🇧 English**  

<video src="rosetta-video/output/color-wheel-en-english.mp4" controls width="320"></video>

**🇫🇷 Français**  
<video src="rosetta-video/output/color-wheel-fr-french.mp4" controls width="320"></video>

**🇪🇸 Español**  
<video src="rosetta-video/output/color-wheel-es-spanish.mp4" controls width="320"></video>

**🇷🇺 Русский**  
<video src="rosetta-video/output/color-wheel-ru-russian.mp4" controls width="320"></video>

**🇬🇷 Ελληνικά**  
<video src="rosetta-video/output/color-wheel-el-greek.mp4" controls width="320"></video>

**🇮🇳 हिन्दी**  
<video src="rosetta-video/output/color-wheel-hi-hindi.mp4" controls width="320"></video>

**🇸🇦 العربية**  
<video src="rosetta-video/output/color-wheel-ar-arabic.mp4" controls width="320"></video>

**🇯🇵 日本語**  
<video src="rosetta-video/output/color-wheel-ja-japanese.mp4" controls width="320"></video>

**🇰🇷 한국어**  
<video src="rosetta-video/output/color-wheel-ko-korean.mp4" controls width="320"></video>

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

## Translations

[中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)
