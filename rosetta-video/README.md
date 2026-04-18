# Rosetta Video Generator

自动生成色轮演示视频的工具集。

## 功能

为10种语言各生成一个独立的演示视频：
- 中文 (zh)、英语 (en)、法语 (fr)、西班牙语 (es)、俄语 (ru)
- 希腊语 (el)、印地语 (hi)、阿拉伯语 (ar)、日语 (ja)、韩语 (ko)

每个视频：
- 时长约1分钟
- 按顺时针顺序点击24个颜色
- 包含同步的TTS音频
- 分辨率 1920x1080 (Full HD)

## 使用方法

### 快速开始

```bash
cd /Users/han/coding/color-rosetta/rosetta-video
./generate-videos.sh
```

### 手动运行

```bash
# 1. 确保主服务器运行
cd /Users/han/coding/color-rosetta
npm start &

# 2. 生成视频
cd rosetta-video
node generate-videos-with-audio.js

# 3. 查看输出
ls -lh output/
```

## 输出文件

每种语言生成3个文件：
- `color-wheel-{lang}-{name}-silent.mp4` - 无声视频
- `color-wheel-{lang}-{name}-audio.mp3` - 合并的音频轨道
- `color-wheel-{lang}-{name}.mp4` - **最终视频（带音频）**

## 技术实现

1. **音频合并**：从 `../.cache/` 读取24个TTS音频文件，用FFmpeg concat合并
2. **视频录制**：Puppeteer自动控制浏览器，录制色轮点击过程
3. **音视频合成**：FFmpeg将视频和音频流合并

## 依赖

- Node.js + npm
- Puppeteer (已安装)
- puppeteer-screen-recorder (已安装)
- FFmpeg (系统需安装)

## 时间估算

- 单个视频：约1分钟
- 全部10个视频：10-15分钟

## 文件说明

- `generate-videos-with-audio.js` - 主生成脚本
- `generate-videos.sh` - 一键启动脚本
- `test-video.sh` - 快速测试脚本（仅生成中文）
- `VIDEO_GENERATION.md` - 详细文档
- `output/` - 视频输出目录
