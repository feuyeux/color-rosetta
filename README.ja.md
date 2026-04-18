# Color Rosetta

インタラクティブな24色相リング。色をクリックして10言語の発音を聴けます。Gemini / Edge-TTS デュアルエンジン対応。

<img src="docs/assets/color-rosetta.png" alt="Color Rosetta スクリーンショット" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## 特徴

- 24色のロゼッタディスク（SVG）
- 10言語対応：中国語、英語、フランス語、スペイン語、ロシア語、ギリシャ語、ヒンディー語、アラビア語、日本語、韓国語
- デュアルTTSエンジン：Google Gemini TTS & Microsoft Edge-TTS
- MD5ハッシュによるオーディオキャッシュ、自動プロキシフォールバック
- キーボードアクセシビリティ（Tab + Enter/Space）
- アラビア語のRTLサポート

## ビデオデモ

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

## クイックスタート

```bash
npm install

# .env を構成
PORT=10010
TTS_ENGINE=edge          # または gemini
GEMINI_API_KEY=your_key  # Gemini に必須

npm start                # → http://localhost:10010
```

Edge-TTS には Python が必要です：

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## コマンド

```bash
npm start                # サーバー起動（デフォルトポート 10010）
npm run test:tts         # 10言語のスモークテスト
npm run pre-cache        # 全TTSオーディオをプリキャッシュ（edgeエンジン）
BASE_URL=http://localhost:3100 npm run test:tts  # カスタムポート
```

## 翻訳

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [한국어](README.ko.md)
