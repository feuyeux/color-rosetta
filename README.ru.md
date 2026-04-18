# Color Rosetta

Интерактивное цветовое колесо из 24 оттенков. Нажмите на цвета, чтобы услышать произношение на 10 языках. Поддерживает Gemini / Edge-TTS.


## Возможности

- 24 цветовых сегмента в виде розетты (SVG)
- 10 языков: 🇨🇳 китайский, 🇬🇧 английский, 🇫🇷 французский, 🇪🇸 испанский, 🇷🇺 русский, 🇬🇷 греческий, 🇮🇳 хинди, 🇸🇦 арабский, 🇯🇵 японский, 🇰🇷 корейский
- Двойной движок TTS: Google Gemini TTS & Microsoft Edge-TTS
- Кеш аудио с хешированием MD5 и автоматическим прокси-откатом
- Доступность с клавиатуры (Tab + Enter/Пробел)
- Поддержка RTL для арабского

## Быстрый старт

```bash
npm install

# Настроить .env
PORT=10010
TTS_ENGINE=edge          # или gemini
GEMINI_API_KEY=your_key  # требуется для Gemini

npm start                # → http://localhost:10010
```

Edge-TTS требует Python:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## Команды

```bash
npm start                # Запустить сервер (порт 10010 по умолчанию)
npm run test:tts         # Дымовой тест для 10 языков
npm run pre-cache        # Предзакешировать все аудио TTS (движок edge)
BASE_URL=http://localhost:3100 npm run test:tts  # Пользовательский порт
```

## Переводы

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## История звёзд

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
