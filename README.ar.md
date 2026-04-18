# Color Rosetta

عجلة ألوان تفاعلية من 24 درجة. انقر على الألوان لسماع النطق بـ 10 لغات. تدعم محركات Gemini / Edge-TTS.

<img src="docs/assets/color-rosetta.png" alt="لقطة شاشة Color Rosetta" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## الميزات

- 24 شريحة لونية على شكل وردة (SVG)
- 10 لغات: الصينية، الإنجليزية، الفرنسية، الإسبانية، الروسية، اليونانية، الهندية، العربية، اليابانية، الكورية
- محرك TTS مزدوج: Google Gemini TTS & Microsoft Edge-TTS
- ذاكرة تخزين صوتية بتجزئة MD5 مع بديل وكيل تلقائي
- إمكانية الوصول بلوحة المفاتيح (Tab + Enter/مسافة)
- دعم RTL للعربية

## عروض فيديو

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

## البدء السريع

```bash
npm install

# تكوين .env
PORT=10010
TTS_ENGINE=edge          # أو gemini
GEMINI_API_KEY=your_key  # مطلوب لـ Gemini

npm start                # → http://localhost:10010
```

يتطلب Edge-TTS Python:

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## الأوامر

```bash
npm start                # تشغيل الخادم (المنفذ الافتراضي 10010)
npm run test:tts         # اختبار دخاني لـ 10 لغات
npm run pre-cache        # تخزين مسبق لجميع ملفات TTS الصوتية (محرك edge)
BASE_URL=http://localhost:3100 npm run test:tts  # منفذ مخصص
```

## الترجمات

[English](README.md) · [中文](README.zh.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [日本語](README.ja.md) · [한국어](README.ko.md)
