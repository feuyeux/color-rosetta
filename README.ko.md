# Color Rosetta

대화형 24색상 컬러 휠. 색상을 클릭하여 10개 언어로 발음을 들으세요. Gemini / Edge-TTS 이중 엔진 지원.

<img src="docs/assets/color-rosetta.png" alt="Color Rosetta 스크린샷" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## 기능

- 24색 로제타 디스크 (SVG)
- 10개 언어: 중국어, 영어, 프랑스어, 스페인어, 러시아어, 그리스어, 힌디어, 아랍어, 일본어, 한국어
- 이중 TTS 엔진: Google Gemini TTS & Microsoft Edge-TTS
- MD5 해시 오디오 캐시, 자동 프록시 폴백
- 키보드 접근성 (Tab + Enter/Space)
- 아랍어 RTL 지원

## 비디오 데모

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

## 빠른 시작

```bash
npm install

# .env 구성
PORT=10010
TTS_ENGINE=edge          # 또는 gemini
GEMINI_API_KEY=your_key  # Gemini에 필요

npm start                # → http://localhost:10010
```

Edge-TTS에는 Python이 필요합니다:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## 명령어

```bash
npm start                # 서버 시작 (기본 포트 10010)
npm run test:tts         # 10개 언어 스모크 테스트
npm run pre-cache        # 모든 TTS 오디오 프리캐시 (edge 엔진)
BASE_URL=http://localhost:3100 npm run test:tts  # 사용자 지정 포트
```

## 번역

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md)
