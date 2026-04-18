import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { mkdir } from 'fs/promises';
import fs, { writeFileSync, unlinkSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { getVoiceStyle } from '../src/server/tts-engines.js';
import { getCacheKey } from '../src/server/utils.js';
import { colorData } from '../public/assets/js/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../output');
const CACHE_DIR = path.join(__dirname, '../.cache');

const LANGUAGES = ['zh', 'en', 'fr', 'es', 'ru', 'el', 'hi', 'ar', 'ja', 'ko'];
const LANG_NAMES = {
    zh: 'Chinese', en: 'English', fr: 'French', es: 'Spanish',
    ru: 'Russian', el: 'Greek', hi: 'Hindi', ar: 'Arabic',
    ja: 'Japanese', ko: 'Korean'
};

const COLORS_COUNT = 24;
const INITIAL_DELAY = 2000;
const FINAL_DELAY = 1000;
const CONCURRENCY_LIMIT = 3; // Number of parallel browsers

function getAudioHash(engine, lang, text) {
    const styleParams = engine === 'edge' ? getVoiceStyle(lang) : null;
    return getCacheKey(text, lang, engine, styleParams);
}

async function getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
        const ffprobe = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath]);
        let output = '';
        ffprobe.stdout.on('data', (data) => { output += data.toString(); });
        ffprobe.on('close', (code) => code === 0 ? resolve(parseFloat(output.trim()) || 0) : reject(new Error(`ffprobe failed`)));
    });
}

async function mergeAudioFiles(audioFiles, outputFile) {
    return new Promise((resolve, reject) => {
        const listFile = path.join(
            os.tmpdir(),
            `${path.basename(outputFile, '.mp3')}-${process.pid}-${Date.now()}_list.txt`
        );
        const fileList = audioFiles
            .map((filePath) => `file '${filePath.replace(/'/g, `'\\''`)}'`)
            .join('\n');
        writeFileSync(listFile, fileList);
        const ffmpeg = spawn('ffmpeg', [
            '-loglevel', 'error',
            '-f', 'concat',
            '-safe', '0',
            '-i', listFile,
            '-ar', '24000',
            '-ac', '1',
            '-c:a', 'libmp3lame',
            '-b:a', '64k',
            '-y', outputFile
        ]);
        let stderr = '';
        ffmpeg.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        ffmpeg.on('close', (code) => {
            if (fs.existsSync(listFile)) {
                unlinkSync(listFile);
            }
            if (code === 0) {
                resolve();
                return;
            }
            const reason = stderr.trim() || `exit code ${code}`;
            reject(new Error(`FFmpeg concat failed: ${reason}`));
        });
    });
}

async function generateVideoForLanguage(lang) {
    const langName = LANG_NAMES[lang];
    const videoFile = path.join(OUTPUT_DIR, `color-wheel-${lang}-${langName.toLowerCase()}-silent.mp4`);
    const audioFile = path.join(OUTPUT_DIR, `color-wheel-${lang}-${langName.toLowerCase()}-audio.mp3`);
    const finalFile = path.join(OUTPUT_DIR, `color-wheel-${lang}-${langName.toLowerCase()}.mp4`);

    console.log(`🎬 [${lang.toUpperCase()}] Starting generation...`);

    const audioFiles = [];
    const audioDurations = [];
    for (let i = 0; i < COLORS_COUNT; i++) {
        const text = colorData[i][lang];
        const hash = getAudioHash('edge', lang, text);
        const cachedAudio = path.join(CACHE_DIR, `${hash}.mp3`);
        audioFiles.push(cachedAudio);
        if (!fs.existsSync(cachedAudio)) throw new Error(`Missing audio: ${cachedAudio}`);
        audioDurations.push(await getAudioDuration(cachedAudio));
    }

    await mergeAudioFiles(audioFiles, audioFile);

    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: { width: 1080, height: 1920 }
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:10010', { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('#colorWheel');

    await page.addStyleTag({ content: `
        body { padding: 0 !important; margin: 0 !important; background-color: #f4ecd8 !important; width: 1080px !important; height: 1920px !important; overflow: hidden !important; }
        #page-container { position: relative !important; width: 100% !important; height: 100% !important; background: none !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
        #page-title, #lang-buttons, #engine-selector, #ttsStatus, .container::before, .container::after { display: none !important; }
        #wheel-container { position: absolute !important; top: 40px !important; left: 0 !important; width: 1080px !important; height: 1080px !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        #colorWheel { width: 1040px !important; height: 1040px !important; overflow: visible !important; }
        .color-text { font-size: 44px !important; stroke-width: 6px !important; font-weight: 900 !important; }
        #sidebar { position: absolute !important; top: 1180px !important; left: 40px !important; width: 1000px !important; }
        #info-panel { width: 100% !important; height: 450px !important; background: rgba(255, 255, 255, 0.7) !important; border-radius: 60px !important; border: 8px solid #b08d57 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 20px 60px rgba(0,0,0,0.1) !important; }
        #selectedColor { font-size: 110px !important; font-weight: 800 !important; text-align: center !important; color: #3d2b1f !important; }
        #selectedColor small { display: block !important; font-size: 44px !important; margin-top: 40px !important; font-weight: 500 !important; color: #666 !important; }
    `});

    await page.evaluate((l) => {
        const btn = document.querySelector(`button.lang-btn[data-lang="${l}"]`);
        if (btn) btn.click();
    }, lang);
    await page.waitForTimeout(1000);

    const recorder = new PuppeteerScreenRecorder(page, {
        fps: 30, videoFrame: { width: 1080, height: 1920 }, aspectRatio: '9:16', videoCrf: 23, videoCodec: 'libx264', videoBitrate: 6000, autopad: { color: '#f4ecd8' }
    });

    await recorder.start(videoFile);
    
    // Strict Synchronization logic
    const recordingStartTime = Date.now();
    let cumulativeAudioTime = INITIAL_DELAY;

    for (let i = 0; i < COLORS_COUNT; i++) {
        const targetClickTime = recordingStartTime + cumulativeAudioTime;
        const now = Date.now();
        if (targetClickTime > now) {
            await page.waitForTimeout(targetClickTime - now);
        }

        await page.evaluate((index) => {
            const segment = document.querySelector(`.color-segment[data-index="${index}"]`);
            if (segment) segment.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }, i);

        cumulativeAudioTime += (audioDurations[i] * 1000);
    }

    await page.waitForTimeout(FINAL_DELAY);
    await recorder.stop();
    await browser.close();

    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', videoFile, '-i', audioFile,
            '-filter_complex', `[1:a]adelay=${INITIAL_DELAY}|${INITIAL_DELAY}[a]`,
            '-c:v', 'copy', '-map', '0:v:0', '-map', '[a]', '-shortest', '-y', finalFile
        ]);
        ffmpeg.on('close', (code) => code === 0 ? resolve() : reject(new Error('FFmpeg failed')));
    });

    if (fs.existsSync(finalFile)) {
        unlinkSync(videoFile);
        unlinkSync(audioFile);
        console.log(`✅ [${lang.toUpperCase()}] Done: ${path.basename(finalFile)}`);
    }
}

async function generateAllVideos() {
    const args = process.argv[2];
    const targetLangs = args ? args.split(',') : LANGUAGES;
    await mkdir(OUTPUT_DIR, { recursive: true });

    console.log(`🚀 Starting parallel generation (Concurrency: ${CONCURRENCY_LIMIT})...`);
    
    const queue = [...targetLangs];
    const active = [];

    async function processQueue() {
        if (queue.length === 0) return;
        const lang = queue.shift();
        const promise = generateVideoForLanguage(lang).catch(err => console.error(`❌ [${lang.toUpperCase()}] Failed:`, err.message));
        active.push(promise);
        await promise;
        active.splice(active.indexOf(promise), 1);
        await processQueue();
    }

    const workers = Array(Math.min(CONCURRENCY_LIMIT, queue.length)).fill(null).map(() => processQueue());
    await Promise.all(workers);
    console.log('\n🎉 All requested videos processed.');
}

generateAllVideos().catch(console.error);
