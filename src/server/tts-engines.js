import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Cache Gemini client instances to avoid re-creating on every request
const geminiClients = new Map();

function getGeminiClient(apiKey) {
  if (!geminiClients.has(apiKey)) {
    geminiClients.set(apiKey, new GoogleGenerativeAI(apiKey));
  }
  return geminiClients.get(apiKey);
}

export async function geminiTTS(text, lang, apiKey) {
  const genAI = getGeminiClient(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-tts-preview',
  });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text }]
    }],
    generationConfig: {
      response_modalities: ['AUDIO'],
      speech_config: {
        voice_config: {
          prebuilt_voice_config: {
            voice_name: getGeminiVoiceName(lang)
          }
        }
      }
    }
  });

  const audioData = result.response.candidates[0].content.parts
    .filter(part => part.inlineData?.mimeType?.startsWith('audio/'))
    .map(part => part.inlineData.data)[0];

  if (!audioData) {
    throw new Error('No audio data received from Gemini');
  }

  return Buffer.from(audioData, 'base64');
}

export async function edgeTTS(text, lang, useProxy = false, retries = 3) {
  const pythonPath = process.env.EDGE_TTS_PYTHON || path.join(projectRoot, '.venv-edge-tts', 'bin', 'python');
  const outputPath = path.join(os.tmpdir(), `edge-tts-${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`);

  try {
    await fs.access(pythonPath);
  } catch {
    throw new Error(`Edge TTS runtime not found at ${pythonPath}. Create .venv-edge-tts and install edge-tts first.`);
  }

  const voiceName = getEdgeVoiceName(lang);
  const args = [
    '-m', 'edge_tts',
    '--text', text,
    '--voice', voiceName,
    '--write-media', outputPath
  ];

  // Add rate and pitch for more lively voices
  const styleConfig = getVoiceStyle(lang);
  if (styleConfig.rate) {
    args.push('--rate', styleConfig.rate);
  }
  if (styleConfig.pitch) {
    args.push('--pitch', styleConfig.pitch);
  }

  if (useProxy) {
    const proxy = process.env.EDGE_TTS_PROXY || 'http://127.0.0.1:7897';
    args.push('--proxy', proxy);
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await execFileAsync(pythonPath, args);
      const data = await fs.readFile(outputPath);
      await fs.rm(outputPath, { force: true });
      return data;
    } catch (error) {
      lastError = error;
      const isRateLimit = error.message?.includes('429') ||
                         error.message?.includes('rate') ||
                         error.message?.includes('too many');

      if (isRateLimit && attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 8000);
        console.log(`⚠ Rate limited, retry ${attempt + 1}/${retries} in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else if (attempt < retries) {
        const delay = 500 + Math.random() * 300;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    if (attempt < retries) {
      await fs.rm(outputPath, { force: true });
    }
  }

  // Clean up temp file after all retries exhausted
  await fs.rm(outputPath, { force: true }).catch(() => {});
  throw lastError;
}

function getGeminiVoiceName(lang) {
  const voiceMap = {
    zh: 'Puck',
    en: 'Puck',
    fr: 'Charon',
    es: 'Charon',
    ru: 'Kore',
    el: 'Kore',
    hi: 'Puck',
    ar: 'Aoede',
    ja: 'Puck',
    ko: 'Puck'
  };
  return voiceMap[lang] || 'Puck';
}

function getEdgeVoiceName(lang) {
  const voiceMap = {
    zh: 'zh-CN-XiaoxiaoNeural',
    en: 'en-US-AriaNeural',
    fr: 'fr-FR-DeniseNeural',
    es: 'es-ES-ElviraNeural',
    ru: 'ru-RU-SvetlanaNeural',
    el: 'el-GR-AthinaNeural',
    hi: 'hi-IN-SwaraNeural',
    ar: 'ar-SA-ZariyahNeural',
    ja: 'ja-JP-NanamiNeural',
    ko: 'ko-KR-SunHiNeural'
  };
  return voiceMap[lang] || 'en-US-AriaNeural';
}

export function getVoiceStyle(lang) {
  const styleMap = {
    zh: { rate: '+10%', pitch: '+5Hz' },
    en: { rate: '+10%', pitch: '+5Hz' },
    fr: { rate: '+15%', pitch: '+8Hz' },  // French more lively
    es: { rate: '+12%', pitch: '+6Hz' },
    ru: { rate: '+10%', pitch: '+5Hz' },
    el: { rate: '+10%', pitch: '+5Hz' },
    hi: { rate: '+10%', pitch: '+5Hz' },
    ar: { rate: '+10%', pitch: '+5Hz' },
    ja: { rate: '+10%', pitch: '+5Hz' },
    ko: { rate: '+10%', pitch: '+5Hz' }
  };
  return styleMap[lang] || { rate: '+10%', pitch: '+5Hz' };
}
