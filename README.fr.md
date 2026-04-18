# Color Rosetta

Roue chromatique interactive de 24 teintes. Cliquez sur les couleurs pour entendre les prononciations en 10 langues. Prend en charge Gemini / Edge-TTS.

<img src="docs/assets/color-rosetta.png" alt="Capture d'écran Color Rosetta" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## Fonctionnalités

- 24 segments de couleur en rosette (SVG)
- 10 langues : chinois, anglais, français, espagnol, russe, grec, hindi, arabe, japonais, coréen
- Double moteur TTS : Google Gemini TTS & Microsoft Edge-TTS
- Cache audio haché MD5 avec repli automatique via proxy
- Accessibilité clavier (Tab + Entrée/Espace)
- Support RTL pour l'arabe

## Démonstrations vidéo

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

## Démarrage rapide

```bash
npm install

# Configurer .env
PORT=10010
TTS_ENGINE=edge          # ou gemini
GEMINI_API_KEY=your_key  # requis pour Gemini

npm start                # → http://localhost:10010
```

Edge-TTS nécessite Python :

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## Commandes

```bash
npm start                # Démarrer le serveur (port 10010 par défaut)
npm run test:tts         # Test de fumée pour les 10 langues
npm run pre-cache        # Pré-cacher tous les fichiers TTS (moteur edge)
BASE_URL=http://localhost:3100 npm run test:tts  # Port personnalisé
```

## Traductions

[English](README.md) · [中文](README.zh.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)
