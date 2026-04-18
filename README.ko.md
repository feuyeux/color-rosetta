# Color Rosetta

대화형 24색상 컬러 휠. 색상을 클릭하여 10개 언어로 발음을 들으세요. Gemini / Edge-TTS 이중 엔진 지원.


## 기능

- 24색 로제타 디스크 (SVG)
- 10개 언어: 🇨🇳 중국어, 🇬🇧 영어, 🇫🇷 프랑스어, 🇪🇸 스페인어, 🇷🇺 러시아어, 🇬🇷 그리스어, 🇮🇳 힌디어, 🇸🇦 아랍어, 🇯🇵 일본어, 🇰🇷 한국어
- 이중 TTS 엔진: Google Gemini TTS & Microsoft Edge-TTS
- MD5 해시 오디오 캐시, 자동 프록시 폴백
- 키보드 접근성 (Tab + Enter/Space)
- 아랍어 RTL 지원

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

## 스타 히스토리

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
