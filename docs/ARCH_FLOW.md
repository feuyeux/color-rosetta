# Color Rosetta 核心架构与执行链路

本文档通过稳健的垂直分层视图展示 **Color Rosetta** 的系统架构与核心执行逻辑。

## 1. 稳健型架构执行图 (Robust Architecture Flow)

```mermaid
flowchart TD
    %% 全局样式定义
    classDef layerStyle fill:#fcfcfc,stroke:#333,stroke-width:1px;
    classDef fileStyle fill:#ffffff,stroke:#007bff,stroke-width:2px;
    classDef methodStyle fill:#f0f7ff,stroke:#0056b3,stroke-width:1px;
    classDef storageStyle fill:#fff9e6,stroke:#856404,stroke-width:1px;
    
    %% --- 核心请求链路 (Vertical Spine) ---
    
    subgraph Frontend [" [ 层级 1 ]  前端交互层 (Client) "]
        direction TB
        UI_Trigger([用户交互触发])
        AppJS["📄 public/assets/js/app.js"]
        HandleClick["handleColorClick()"]
        SpeakRequest["speakText() 发起请求"]
        
        UI_Trigger --> HandleClick
        HandleClick --> SpeakRequest
    end

    subgraph Transport [" [ 层级 2 ]  传输路由层 (Express) "]
        direction TB
        ServerIndex["📄 src/server/index.js"]
        RouteTTS["POST /api/tts"]
        Middleware["rateLimit & Validation"]
        
        SpeakRequest --> RouteTTS
        RouteTTS --> Middleware
    end

    subgraph Logic [" [ 层级 3 ]  业务逻辑层 (Business Logic) "]
        direction TB
        UtilsJS["📄 src/server/utils.js"]
        CheckCache{"getCache() 检查缓存"}
        
        Middleware --> CheckCache
    end

    subgraph Engines [" [ 层级 4 ]  引擎适配层 (TTS Engines) "]
        direction TB
        TTSEngines["📄 src/server/tts-engines.js"]
        EngineSwitch{引擎选择}
        EdgeImpl["edgeTTS() 实现"]
        GeminiImpl["geminiTTS() 实现"]
        
        CheckCache -- MISS --> EngineSwitch
        EngineSwitch -- "Edge-TTS" --> EdgeImpl
        EngineSwitch -- "Gemini" --> GeminiImpl
    end

    subgraph Result [" [ 层级 5 ]  响应返回层 (Response) "]
        direction TB
        SetCache["setCache() 写入持久化"]
        FinalSend(["res.send(audioBuffer)"])
        
        EdgeImpl --> SetCache
        GeminiImpl --> SetCache
        CheckCache -- HIT ----> FinalSend
        SetCache --> FinalSend
    end

    %% --- 辅助模块 (Side Components) ---
    subgraph Storage [" 存储服务 "]
        DiskCache[(".cache/ 磁盘目录")]
    end

    subgraph Pipeline [" 离线自动化流水线 "]
        direction TB
        VideoGen["📄 rosetta-video/generate-videos.sh"]
        Puppeteer["Puppeteer 模拟器"]
        FFmpeg["FFmpeg 音视频合成"]
        
        VideoGen --> Puppeteer
        Puppeteer -.->|自动化触发| UI_Trigger
        Puppeteer --> FFmpeg
    end

    %% 外部关联
    SetCache -.-> DiskCache
    CheckCache -.-> DiskCache

    %% 样式应用
    style Frontend layerStyle
    style Transport layerStyle
    style Logic layerStyle
    style Engines layerStyle
    style Result layerStyle
    style Pipeline fill:#fff0f0,stroke:#800
```

---

## 2. 核心架构组件说明

### 2.1 表现层 (Presentation Layer)
- **文件**: `public/assets/js/app.js`
- **核心逻辑**: 负责原生 DOM/SVG 色轮渲染与用户点击事件捕获。
- **状态管理**: 维护 `audioCache` 内存缓存，确保同一会话内重复点击可直接复用已下载音频。

### 2.2 传输与安全层 (Transport & Security Layer)
- **文件**: `src/server/index.js`
- **核心逻辑**: Express 路由分发。
- **安全机制**: 实施 IP 级别的 `rateLimit` 以及严格的 `VALID_LANGS` 白名单校验。

### 2.3 业务逻辑层 (Business Logic Layer)
- **文件**: `src/server/utils.js`
- **核心逻辑**: 
  - **MD5 键值生成**: 确保相同文本在不同引擎/语言下有唯一的缓存 ID。
  - **缓存透明化**: 对上层业务隐藏文件系统读写细节。

### 2.4 引擎适配层 (Engine Adapter Layer)
- **文件**: `src/server/tts-engines.js`
- **核心逻辑**:
  - 适配 Edge-TTS 与 Gemini TTS 接口。
  - **失败回退**: Edge-TTS 在特定错误场景下可切换到 7897 代理端口重试。

### 2.5 视频自动化流水线 (Off-line Pipeline)
- **核心逻辑**: 
  - 使用 Puppeteer 驱动 Headless Chromium。
  - 通过 FFmpeg 执行高性能的音视频流合并。

---

## 3. 技术栈总结

| 维度 | 技术选型 |
| :--- | :--- |
| **前端渲染** | Vanilla JS, SVG, CSS Variables |
| **后端运行时** | Node.js (ES Modules) |
| **Web 框架** | Express.js |
| **TTS 引擎** | Microsoft Edge-TTS, Google Gemini |
| **自动化录制** | Puppeteer, FFmpeg |
| **存储策略** | 文件系统级 MD5 缓存 |
