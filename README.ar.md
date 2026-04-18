# Color Rosetta

عجلة ألوان تفاعلية من 24 درجة. انقر على الألوان لسماع النطق بـ 10 لغات. تدعم محركات Gemini / Edge-TTS.


## الميزات

- 24 شريحة لونية على شكل وردة (SVG)
- 10 لغات: 🇨🇳 الصينية، 🇬🇧 الإنجليزية، 🇫🇷 الفرنسية، 🇪🇸 الإسبانية، 🇷🇺 الروسية، 🇬🇷 اليونانية، 🇮🇳 الهندية، 🇸🇦 العربية، 🇯🇵 اليابانية، 🇰🇷 الكورية
- محرك TTS مزدوج: Google Gemini TTS & Microsoft Edge-TTS
- ذاكرة تخزين صوتية بتجزئة MD5 مع بديل وكيل تلقائي
- إمكانية الوصول بلوحة المفاتيح (Tab + Enter/مسافة)
- دعم RTL للعربية

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

## سجل النجوم

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
