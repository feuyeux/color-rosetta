# Color Rosetta

Roue chromatique interactive de 24 teintes. Cliquez sur les couleurs pour entendre les prononciations en 10 langues. Prend en charge Gemini / Edge-TTS.


## Fonctionnalités

- 24 segments de couleur en rosette (SVG)
- 10 langues : 🇨🇳 chinois, 🇬🇧 anglais, 🇫🇷 français, 🇪🇸 espagnol, 🇷🇺 russe, 🇬🇷 grec, 🇮🇳 hindi, 🇸🇦 arabe, 🇯🇵 japonais, 🇰🇷 coréen
- Double moteur TTS : Google Gemini TTS & Microsoft Edge-TTS
- Cache audio haché MD5 avec repli automatique via proxy
- Accessibilité clavier (Tab + Entrée/Espace)
- Support RTL pour l'arabe

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

## Historique des Stars

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
