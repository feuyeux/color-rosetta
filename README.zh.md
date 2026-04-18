# Color Rosetta

交互式 24 色相环，点击颜色即可听取 10 种语言的发音。支持 Gemini / Edge-TTS 双引擎。

<img src="docs/assets/color-rosetta.png" alt="Color Rosetta 截图" width="500" style="float:left;margin-right:24px;margin-bottom:16px;" />

## 特性

- 24 色尖刺罗塞塔圆盘（SVG）
- 10 种语言：中文、英语、法语、西班牙语、俄语、希腊语、印地语、阿拉伯语、日语、韩语
- 双 TTS 引擎：Google Gemini TTS & Microsoft Edge-TTS
- MD5 哈希音频缓存，自动代理回退
- 键盘无障碍访问（Tab + Enter/Space）
- 阿拉伯语 RTL 支持

## 视频演示

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

## 快速开始

```bash
npm install

# 配置 .env
PORT=10010
TTS_ENGINE=edge          # 或 gemini
GEMINI_API_KEY=your_key  # 使用 Gemini 时必填

npm start                # → http://localhost:10010
```

Edge-TTS 需要 Python 环境：

```bash
python3 -m venv .venv-edge-tts && source .venv-edge-tts/bin/activate && pip install edge-tts
```

## 命令

```bash
npm start                # 启动服务器（默认端口 10010）
npm run test:tts         # 烟雾测试全部 10 种语言
npm run pre-cache        # 预缓存全部 TTS 音频（edge 引擎）
BASE_URL=http://localhost:3100 npm run test:tts  # 自定义端口
```

## 翻译

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Русский](README.ru.md) · [Ελληνικά](README.el.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [日本語](README.ja.md) · [한국어](README.ko.md)
