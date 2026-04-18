# Color Rosetta

इंटरैक्टिव 24-ह्यू रंग चक्र। 10 भाषाओं में उच्चारण सुनने के लिए रंगों पर क्लिक करें। Gemini / Edge-TTS दोहरे इंजन का समर्थन।

<img src="docs/assets/color-rosetta.png" alt="Color Rosetta स्क्रीनशॉट" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## विशेषताएँ

- 24 रंग खंडों वाला रोज़ेटा चक्र (SVG)
- 10 भाषाएँ: चीनी, अंग्रेज़ी, फ़्रेंच, स्पेनिश, रूसी, ग्रीक, हिन्दी, अरबी, जापानी, कोरियाई
- दोहरा TTS इंजन: Google Gemini TTS & Microsoft Edge-TTS
- MD5 हैश ऑडियो कैश, स्वचालित प्रॉक्सी फ़ॉलबैक
- कीबोर्ड सुलभता (Tab + Enter/Space)
- अरबी के लिए RTL समर्थन

## वीडियो प्रदर्शन

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
