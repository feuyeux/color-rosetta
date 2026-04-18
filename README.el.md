# Color Rosetta

Διαδραστικός τροχός 24 αποχρώσεων. Κάντε κλικ στα χρώματα για να ακούσετε προφορές σε 10 γλώσσες. Υποστηρίζει Gemini / Edge-TTS.


## Χαρακτηριστικά

- 24 χρωματικά τμήματα σε ροζέτα (SVG)
- 10 γλώσσες: 🇨🇳 κινεζικά, 🇬🇧 αγγλικά, 🇫🇷 γαλλικά, 🇪🇸 ισπανικά, 🇷🇺 ρωσικά, 🇬🇷 ελληνικά, 🇮🇳 χίντι, 🇸🇦 αραβικά, 🇯🇵 ιαπωνικά, 🇰🇷 κορεατικά
- Διπλός μηχανισμός TTS: Google Gemini TTS & Microsoft Edge-TTS
- Cache ήχου με MD5 hash και αυτόματη εναλλαγή proxy
- Προσβασιμότητα μέσω πληκτρολογίου (Tab + Enter/Space)
- Υποστήριξη RTL για αραβικά

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

## Ιστορικό Αστεριών

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
