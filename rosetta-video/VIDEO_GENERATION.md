# 视频生成指南

## 问题修复

已修复两个关键问题：
1. ✅ 现在为每种语言生成独立视频（共10个视频）
2. ✅ 视频包含同步音频（从缓存的TTS文件合并）

## 使用方法

### 方式1：使用启动脚本（推荐）

```bash
cd /Users/han/coding/color-rosetta
./generate-videos.sh
```

### 方式2：手动运行

```bash
cd /Users/han/coding/color-rosetta

# 1. 启动服务器
npm start &

# 2. 等待3秒
sleep 3

# 3. 生成视频
npm run video

# 4. 完成后停止服务器
pkill -f "node src/server/index.js"
```

## 输出

每种语言生成3个文件：
- `color-wheel-{lang}-{name}-silent.mp4` - 无声视频
- `color-wheel-{lang}-{name}-audio.mp3` - 合并的音频
- `color-wheel-{lang}-{name}.mp4` - **最终视频（带音频）**

例如：
- `color-wheel-zh-chinese.mp4`
- `color-wheel-en-english.mp4`
- `color-wheel-fr-french.mp4`
- ... 共10个视频

## 技术实现

1. **音频合并**：从 `.cache/` 读取24个颜色的TTS音频文件，用FFmpeg合并
2. **视频录制**：Puppeteer自动点击色轮，录制无声视频
3. **音视频合成**：FFmpeg将视频和音频合并为最终文件

## 时长

每个视频约 **1分钟**：
- 初始延迟: 2秒
- 24个颜色 × 2.2秒 = 52.8秒
- 结束延迟: 1秒
- **总计: ~56秒**

## 注意事项

- 确保服务器在 `http://localhost:10010` 运行
- 确保 `.cache/` 目录有所有TTS音频文件
- 生成全部10个视频需要约 **10-15分钟**
