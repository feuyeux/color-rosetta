#!/bin/bash

# 整理项目结构：将视频生成相关文件移到 rosetta-video 目录

cd /Users/han/coding/color-rosetta

echo "🗂️  整理项目结构..."
echo ""

# 1. 删除空的 rosetta 目录
if [ -d "rosetta" ]; then
    echo "🗑️  删除空目录: rosetta/"
    rm -rf rosetta
fi

# 2. 创建 rosetta-video 目录
echo "📁 创建目录: rosetta-video/"
mkdir -p rosetta-video

# 3. 移动视频生成脚本
echo "📦 移动视频生成脚本..."
mv scripts/generate-videos-with-audio.js rosetta-video/ 2>/dev/null
mv scripts/generate-video-puppeteer-recorder.js rosetta-video/ 2>/dev/null
mv scripts/generate-video.js rosetta-video/ 2>/dev/null

# 4. 移动shell脚本
echo "📦 移动启动脚本..."
mv generate-videos.sh rosetta-video/ 2>/dev/null
mv test-video.sh rosetta-video/ 2>/dev/null

# 5. 移动文档
echo "📦 移动文档..."
mv VIDEO_GENERATION.md rosetta-video/ 2>/dev/null

# 6. 移动输出目录
echo "📦 移动输出目录..."
mv output rosetta-video/ 2>/dev/null

# 7. 创建 rosetta-video 的 package.json
echo "📦 创建 rosetta-video/package.json..."
cat > rosetta-video/package.json << 'EOF'
{
  "name": "rosetta-video",
  "version": "1.0.0",
  "description": "Video generator for Hello Color Rosetta Disk",
  "type": "module",
  "scripts": {
    "generate": "node generate-videos-with-audio.js",
    "test": "node generate-videos-with-audio.js"
  },
  "dependencies": {
    "puppeteer": "^19.0.0",
    "puppeteer-screen-recorder": "^3.0.6"
  }
}
EOF

# 8. 更新 rosetta-video 脚本中的路径
echo "🔧 更新脚本路径..."
if [ -f "rosetta-video/generate-videos-with-audio.js" ]; then
    sed -i '' 's|__dirname, '\''../output'\''|__dirname, '\''output'\''|g' rosetta-video/generate-videos-with-audio.js
    sed -i '' 's|__dirname, '\''../.cache'\''|__dirname, '\''../.cache'\''|g' rosetta-video/generate-videos-with-audio.js
fi

# 9. 更新 shell 脚本路径
if [ -f "rosetta-video/generate-videos.sh" ]; then
    sed -i '' 's|cd "$(dirname "$0")/.."|cd "$(dirname "$0")"|g' rosetta-video/generate-videos.sh
    sed -i '' 's|scripts/generate-videos-with-audio.js|generate-videos-with-audio.js|g' rosetta-video/generate-videos.sh
    chmod +x rosetta-video/generate-videos.sh
fi

if [ -f "rosetta-video/test-video.sh" ]; then
    chmod +x rosetta-video/test-video.sh
fi

echo ""
echo "✅ 整理完成！"
echo ""
echo "📂 项目结构："
echo "  /Users/han/coding/color-rosetta/"
echo "    ├── public/          # 前端代码"
echo "    ├── src/             # 后端代码"
echo "    ├── scripts/         # 测试脚本"
echo "    ├── .cache/          # TTS缓存"
echo "    ├── rosetta-video/   # 视频生成工具"
echo "    │   ├── generate-videos-with-audio.js"
echo "    │   ├── generate-videos.sh"
echo "    │   ├── output/      # 生成的视频"
echo "    │   └── README.md"
echo "    └── package.json"
echo ""
echo "🎬 生成视频："
echo "  cd rosetta-video"
echo "  ./generate-videos.sh"
echo ""
