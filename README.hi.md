# Color Rosetta

इंटरैक्टिव 24-ह्यू रंग चक्र। 10 भाषाओं में उच्चारण सुनने के लिए रंगों पर क्लिक करें। Gemini / Edge-TTS दोहरे इंजन का समर्थन।


## विशेषताएँ

- 24 रंग खंडों वाला रोज़ेटा चक्र (SVG)
- 10 भाषाएँ: 🇨🇳 चीनी, 🇬🇧 अंग्रेज़ी, 🇫🇷 फ़्रेंच, 🇪🇸 स्पेनिश, 🇷🇺 रूसी, 🇬🇷 ग्रीक, 🇮🇳 हिन्दी, 🇸🇦 अरबी, 🇯🇵 जापानी, 🇰🇷 कोरियाई
- दोहरा TTS इंजन: Google Gemini TTS & Microsoft Edge-TTS
- MD5 हैश ऑडियो कैश, स्वचालित प्रॉक्सी फ़ॉलबैक
- कीबोर्ड सुलभता (Tab + Enter/Space)
- अरबी के लिए RTL समर्थन

## त्वरित प्रारंभ

```bash
npm install

# .env कॉन्फ़िगर करें
PORT=10010
TTS_ENGINE=edge          # या gemini
GEMINI_API_KEY=your_key  # Gemini के लिए आवश्यक

npm start                # → http://localhost:10010
```

Edge-TTS के लिए Python आवश्यक है:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## कमांड

```bash
npm start                # सर्वर शुरू करें (डिफ़ॉल्ट पोर्ट 10010)
npm run test:tts         # 10 भाषाओं का स्मोक टेस्ट
npm run pre-cache        # सभी TTS ऑडियो प्री-कैश करें (edge इंजन)
BASE_URL=http://localhost:3100 npm run test:tts  # कस्टम पोर्ट
```

## अनुवाद

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## स्टार इतिहास

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
