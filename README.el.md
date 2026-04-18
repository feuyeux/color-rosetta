# Color Rosetta

Διαδραστικός τροχός 24 αποχρώσεων. Κάντε κλικ στα χρώματα για να ακούσετε προφορές σε 10 γλώσσες. Υποστηρίζει Gemini / Edge-TTS.

<img src="docs/assets/color-rosetta.png" alt="Στιγμιότυπο Color Rosetta" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## Χαρακτηριστικά

- 24 χρωματικά τμήματα σε ροζέτα (SVG)
- 10 γλώσσες: κινεζικά, αγγλικά, γαλλικά, ισπανικά, ρωσικά, ελληνικά, χίντι, αραβικά, ιαπωνικά, κορεατικά
- Διπλός μηχανισμός TTS: Google Gemini TTS & Microsoft Edge-TTS
- Cache ήχου με MD5 hash και αυτόματη εναλλαγή proxy
- Προσβασιμότητα μέσω πληκτρολογίου (Tab + Enter/Space)
- Υποστήριξη RTL για αραβικά

## Επιδείξεις βίντεο

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

## Γρήγορη εκκίνηση

```bash
npm install

# Διαμόρφωση .env
PORT=10010
TTS_ENGINE=edge          # ή gemini
GEMINI_API_KEY=your_key  # απαιτείται για Gemini

npm start                # → http://localhost:10010
```

Το Edge-TTS απαιτεί Python:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## Εντολές

```bash
npm start                # Εκκίνηση διακομιστή (θύρα 10010 προεπιλογή)
npm run test:tts         # Δοκιμή καπνού για 10 γλώσσες
npm run pre-cache        # Προαποθήκευση όλου του ήχου TTS (μηχανή edge)
BASE_URL=http://localhost:3100 npm run test:tts  # Προσαρμοσμένη θύρα
```

## Μεταφράσεις

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)
