# Color Rosetta

インタラクティブな24色相リング。色をクリックして10言語の発音を聴けます。Gemini / Edge-TTS デュアルエンジン対応。


## 特徴

- 24色のロゼッタディスク（SVG）
- 10言語対応：🇨🇳 中国語、🇬🇧 英語、🇫🇷 フランス語、🇪🇸 スペイン語、🇷🇺 ロシア語、🇬🇷 ギリシャ語、🇮🇳 ヒンディー語、🇸🇦 アラビア語、🇯🇵 日本語、🇰🇷 韓国語
- デュアルTTSエンジン：Google Gemini TTS & Microsoft Edge-TTS
- MD5ハッシュによるオーディオキャッシュ、自動プロキシフォールバック
- キーボードアクセシビリティ（Tab + Enter/Space）
- アラビア語のRTLサポート

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

## スター履歴

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
