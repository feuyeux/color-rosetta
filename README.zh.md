# Color Rosetta

交互式 24 色相环，点击颜色即可听取 10 种语言的发音。支持 Gemini / Edge-TTS 双引擎。


## 特性

- 24 色尖刺罗塞塔圆盘（SVG）
- 10 种语言：🇨🇳 中文、🇬🇧 英语、🇫🇷 法语、🇪🇸 西班牙语、🇷🇺 俄语、🇬🇷 希腊语、🇮🇳 印地语、🇸🇦 阿拉伯语、🇯🇵 日语、🇰🇷 韩语
- 双 TTS 引擎：Google Gemini TTS & Microsoft Edge-TTS
- MD5 哈希音频缓存，自动代理回退
- 键盘无障碍访问（Tab + Enter/Space）
- 阿拉伯语 RTL 支持

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

## Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=feuyeux/color-rosetta&type=Date)](https://star-history.com/#feuyeux/color-rosetta&Date)
