# Color Rosetta

Rueda cromática interactiva de 24 tonos. Haz clic en los colores para escuchar pronunciaciones en 10 idiomas. Compatible con Gemini / Edge-TTS.


## Características

- 24 segmentos de color en roseta (SVG)
- 10 idiomas: 🇨🇳 chino, 🇬🇧 inglés, 🇫🇷 francés, 🇪🇸 español, 🇷🇺 ruso, 🇬🇷 griego, 🇮🇳 hindi, 🇸🇦 árabe, 🇯🇵 japonés, 🇰🇷 coreano
- Doble motor TTS: Google Gemini TTS & Microsoft Edge-TTS
- Caché de audio con hash MD5 y respaldo automático por proxy
- Accesibilidad por teclado (Tab + Enter/Espacio)
- Soporte RTL para árabe

## Inicio rápido

```bash
npm install

# Configurar .env
PORT=10010
TTS_ENGINE=edge          # o gemini
GEMINI_API_KEY=your_key  # requerido para Gemini

npm start                # → http://localhost:10010
```

Edge-TTS requiere Python:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## Comandos

```bash
npm start                # Iniciar servidor (puerto 10010 por defecto)
npm run test:tts         # Prueba de humo para los 10 idiomas
npm run pre-cache        # Pre-cachear todo el audio TTS (motor edge)
BASE_URL=http://localhost:3100 npm run test:tts  # Puerto personalizado
```

## Traducciones

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Historial de Estrellas

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
