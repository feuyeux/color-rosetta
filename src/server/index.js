import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { geminiTTS, edgeTTS, getVoiceStyle } from './tts-engines.js';
import { VALID_LANGS } from '../../public/assets/js/data.js';
import { getCacheKey, getAudioConfig } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const VALID_ENGINES = ['edge', 'gemini'];
const MAX_TEXT_LENGTH = 200;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'public')));

const TTS_ENGINE = process.env.TTS_ENGINE || 'edge';

// Simple in-memory rate limiter (per IP, 60 req/min)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 60;

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return next();
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }
  next();
}

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now - record.start > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Create cache directory
const cacheDir = path.join(projectRoot, '.cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Read from cache (async)
async function getCache(key, engine) {
  const { extension } = getAudioConfig(engine);
  const cachePath = path.join(cacheDir, `${key}.${extension}`);
  try {
    return await fsPromises.readFile(cachePath);
  } catch {
    return null;
  }
}

// Save to cache (async)
async function setCache(key, buffer, engine) {
  const { extension } = getAudioConfig(engine);
  const cachePath = path.join(cacheDir, `${key}.${extension}`);
  await fsPromises.writeFile(cachePath, buffer);
}

app.post('/api/tts', rateLimit, async (req, res) => {
  try {
    const { text, lang, engine } = req.body;

    // Input validation
    if (!text || typeof text !== 'string' || text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ error: 'Invalid text parameter' });
    }
    if (!VALID_LANGS.includes(lang)) {
      return res.status(400).json({ error: 'Invalid lang parameter' });
    }
    const selectedEngine = engine || TTS_ENGINE;
    if (!VALID_ENGINES.includes(selectedEngine)) {
      return res.status(400).json({ error: 'Invalid engine parameter' });
    }

    const audioConfig = getAudioConfig(selectedEngine);
    const styleParams = selectedEngine === 'edge' ? getVoiceStyle(lang) : null;
    const cacheKey = getCacheKey(text, lang, selectedEngine, styleParams);

    const cachedAudio = await getCache(cacheKey, selectedEngine);
    if (cachedAudio) {
      console.log(`✓ Cache HIT: ${cacheKey}`);
      res.set('Content-Type', audioConfig.contentType);
      res.set('X-TTS-Engine', selectedEngine);
      res.set('X-Cache', 'HIT');
      return res.send(cachedAudio);
    }

    console.log(`✗ Cache MISS: ${cacheKey}, requesting ${selectedEngine}...`);

    let audioBuffer;

    if (selectedEngine === 'edge') {
      try {
        audioBuffer = await edgeTTS(text, lang, false);
      } catch (error) {
        if (error.message?.includes('500') || error.code === 'ECONNREFUSED' || error.message?.includes('429')) {
          console.log(`⚠ Edge-TTS failed, retrying with proxy (port 7897)...`);
          audioBuffer = await edgeTTS(text, lang, true);
        } else {
          throw error;
        }
      }
    } else {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'Gemini API key not configured' });
      }
      audioBuffer = await geminiTTS(text, lang, process.env.GEMINI_API_KEY);
    }

    let wavBuffer;
    if (selectedEngine === 'gemini') {
      const wavHeader = createWavHeader(audioBuffer.length, 24000, 1, 16);
      wavBuffer = Buffer.concat([wavHeader, audioBuffer]);
    } else {
      wavBuffer = audioBuffer;
    }

    await setCache(cacheKey, wavBuffer, selectedEngine);
    console.log(`✓ Cached: ${cacheKey}`);

    res.set('Content-Type', audioConfig.contentType);
    res.set('X-TTS-Engine', selectedEngine);
    res.set('X-Cache', 'MISS');
    res.send(wavBuffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

function createWavHeader(dataLength, sampleRate, channels, bitsPerSample) {
  const header = Buffer.alloc(44);

  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write('WAVE', 8);

  // fmt sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28); // ByteRate
  header.writeUInt16LE(channels * bitsPerSample / 8, 32); // BlockAlign
  header.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}

const PORT = process.env.PORT || 10010;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`TTS Engine: ${TTS_ENGINE}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
  // Force exit after 5s
  setTimeout(() => process.exit(1), 5000);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
