import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { mkdir, writeFile, writeFile as fsWriteFile } from 'fs/promises';
import fs, { createReadStream, createWriteStream, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import crypto from 'crypto';
import { getVoiceStyle } from '../src/server/tts-engines.js';
import { getCacheKey } from '../src/server/utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../output');
const CACHE_DIR = path.join(__dirname, '../.cache');

const LANGUAGES = ['zh', 'en', 'fr', 'es', 'ru', 'el', 'hi', 'ar', 'ja', 'ko'];
const LANG_NAMES = {
    zh: 'Chinese',
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    ru: 'Russian',
    el: 'Greek',
    hi: 'Hindi',
    ar: 'Arabic',
    ja: 'Japanese',
    ko: 'Korean'
};

const COLORS_COUNT = 24;
const INITIAL_DELAY = 2000;
const FINAL_DELAY = 1000;

// Read color data
const colorData = [
    { angle: 0, hex: "#FF0000", zh: "红色", en: "Red", fr: "Rouge", es: "Rojo", ru: "Красный", el: "Κόκκινο", hi: "लाल", ar: "أحمر", ja: "赤", ko: "빨강" },
    { angle: 15, hex: "#FF4000", zh: "朱红", en: "Vermilion", fr: "Vermillon", es: "Bermellón", ru: "Красно-оранжевый", el: "Βερμίλιο", hi: "सिंदूरी", ar: "برتقالي محمر", ja: "朱色", ko: "주홍" },
    { angle: 30, hex: "#FF8000", zh: "橙色", en: "Orange", fr: "Orange", es: "Naranja", ru: "Оранжевый", el: "Πορτοκαλί", hi: "नारंगी", ar: "برتقالي", ja: "橙色", ko: "주황" },
    { angle: 45, hex: "#FFC000", zh: "琥珀色", en: "Amber", fr: "Ambre", es: "Ámbar", ru: "Янтарный", el: "Κεχριμπάρι", hi: "एम्बर", ar: "كهرماني", ja: "琥珀色", ko: "호박색" },
    { angle: 60, hex: "#FFFF00", zh: "黄色", en: "Yellow", fr: "Jaune", es: "Amarillo", ru: "Жёлтый", el: "Κίτρινο", hi: "पीला", ar: "أصفر", ja: "黄色", ko: "노랑" },
    { angle: 75, hex: "#C0FF00", zh: "黄绿色", en: "Chartreuse", fr: "Chartreuse", es: "Cartujo", ru: "Салатовый", el: "Κιτρινοπράσινο", hi: "धानी", ar: "أخضر مصفر", ja: "萌黄色", ko: "연두" },
    { angle: 90, hex: "#80FF00", zh: "苹果绿", en: "Green-Yellow", fr: "Vert-jaune", es: "Verde amarillento", ru: "Жёлто-зелёный", el: "Λαχανί", hi: "पीला-हरा", ar: "أخضر ليموني", ja: "若草色", ko: "황록색" },
    { angle: 105, hex: "#40FF00", zh: "嫩绿色", en: "Harlequin", fr: "Arlequin", es: "Arlequín", ru: "Ярко-зелёный", el: "Έντονο πράσινο", hi: "चमकीला हरा", ar: "أخضر فاقع", ja: "萌木色", ko: "밝은 초록" },
    { angle: 120, hex: "#00FF00", zh: "绿色", en: "Green", fr: "Vert", es: "Verde", ru: "Зелёный", el: "Πράσινο", hi: "हरा", ar: "أخضر", ja: "緑", ko: "초록" },
    { angle: 135, hex: "#00FF40", zh: "翠绿色", en: "Erin", fr: "Émeraude clair", es: "Verde iridiscente", ru: "Изумрудный", el: "Σμαραγδί", hi: "पन्ना", ar: "زمردي", ja: "エメラルド", ko: "에메랄드" },
    { angle: 150, hex: "#00FF80", zh: "春绿色", en: "Spring Green", fr: "Vert printemps", es: "Verde primavera", ru: "Весенне-зелёный", el: "Πράσινο άνοιξης", hi: "वसंत हरा", ar: "أخضر ربيعي", ja: "春緑色", ko: "춘록색" },
    { angle: 165, hex: "#00FFC0", zh: "碧绿色", en: "Aquamarine", fr: "Aigue-marine", es: "Aguamarina", ru: "Аквамарин", el: "Γαλαζοπράσινο", hi: "एक्वामरीन", ar: "زبرجدي", ja: "アクアマリン", ko: "아쿠아마린" },
    { angle: 180, hex: "#00FFFF", zh: "青色", en: "Cyan", fr: "Cyan", es: "Cian", ru: "Циан", el: "Κυανό", hi: "स्यान", ar: "سيان", ja: "シアン", ko: "시안" },
    { angle: 195, hex: "#00C0FF", zh: "蔚蓝色", en: "Cerulean", fr: "Céruléen", es: "Cerúleo", ru: "Голубой", el: "Γαλάζιο", hi: "आसमानी", ar: "سماوي", ja: "セルリアン", ko: "세루리안" },
    { angle: 210, hex: "#0080FF", zh: "湛蓝色", en: "Azure", fr: "Azur", es: "Azur", ru: "Лазурный", el: "Αζούρ", hi: "नीला", ar: "لازوردي", ja: "アジュール", ko: "아주르" },
    { angle: 225, hex: "#0040FF", zh: "钴蓝色", en: "Cobalt", fr: "Cobalt", es: "Cobalto", ru: "Кобальтовый", el: "Κοβάλτιο", hi: "कोबाल्ट", ar: "أزرق كوبالت", ja: "コバルト", ko: "코발트" },
    { angle: 240, hex: "#0000FF", zh: "蓝色", en: "Blue", fr: "Bleu", es: "Azul", ru: "Синий", el: "Μπλε", hi: "गहरा नीला", ar: "أزرق", ja: "青", ko: "파랑" },
    { angle: 255, hex: "#4000FF", zh: "靛蓝色", en: "Indigo", fr: "Indigo", es: "Añil", ru: "Индиго", el: "Λουλακί", hi: "जामुनी", ar: "نيلي", ja: "藍色", ko: "남색" },
    { angle: 270, hex: "#8000FF", zh: "紫色", en: "Purple", fr: "Violet", es: "Púrpura", ru: "Фиолетовый", el: "Μωβ", hi: "बैंगनी", ar: "أرجواني", ja: "紫", ko: "보라" },
    { angle: 285, hex: "#C000FF", zh: "蓝紫色", en: "Violet", fr: "Violet clair", es: "Violeta", ru: "Лиловый", el: "Βιολετί", hi: "हल्का बैंगनी", ar: "بنفسجي", ja: "菫色", ko: "바이올렛" },
    { angle: 300, hex: "#FF00FF", zh: "洋红色", en: "Magenta", fr: "Magenta", es: "Magenta", ru: "Маджента", el: "Φούξια", hi: "रानी", ar: "ماجنتا", ja: "マゼンタ", ko: "마젠타" },
    { angle: 315, hex: "#FF00C0", zh: "紫红色", en: "Fuchsia", fr: "Fuchsia", es: "Fucsia", ru: "Фуксия", el: "Ματζέντα", hi: "फुकिया", ar: "فوشي", ja: "フクシア", ko: "푸크시아" },
    { angle: 330, hex: "#FF0080", zh: "玫瑰红", en: "Rose", fr: "Rose", es: "Rosa", ru: "Розовый", el: "Τριανταφυλλί", hi: "गुलाबी", ar: "وردي", ja: "薔薇色", ko: "장미색" },
    { angle: 345, hex: "#FF0040", zh: "绯红色", en: "Crimson", fr: "Cramoisi", es: "Carmesí", ru: "Малиновый", el: "Άλικο", hi: "किरमिजी", ar: "قرمزي", ja: "クリムゾン", ko: "진홍색" }
];

function getAudioHash(engine, lang, text) {
    const styleParams = engine === 'edge' ? getVoiceStyle(lang) : null;
    return getCacheKey(text, lang, engine, styleParams);
}

async function getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
        const ffprobe = spawn('ffprobe', [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            filePath
        ]);
        let output = '';
        ffprobe.stdout.on('data', (data) => { output += data.toString(); });
        ffprobe.on('close', (code) => {
            if (code === 0) {
                resolve(parseFloat(output.trim()) || 0);
            } else {
                reject(new Error(`ffprobe failed for ${filePath}`));
            }
        });
    });
}

async function mergeAudioFiles(audioFiles, outputFile) {
    return new Promise((resolve, reject) => {
        const listFile = outputFile.replace('.mp3', '_list.txt');
        const fileList = audioFiles.map(f => `file '${f}'`).join('\n');

        writeFileSync(listFile, fileList);

        const ffmpeg = spawn('ffmpeg', [
            '-f', 'concat',
            '-safe', '0',
            '-i', listFile,
            '-c', 'copy',
            '-y',
            outputFile
        ]);

        ffmpeg.on('close', (code) => {
            unlinkSync(listFile);
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg concat failed with code ${code}`));
        });
    });
}

async function generateVideoForLanguage(lang) {
    const langName = LANG_NAMES[lang];
    const videoFile = path.join(OUTPUT_DIR, `color-wheel-${lang}-${langName.toLowerCase()}-silent.mp4`);
    const audioFile = path.join(OUTPUT_DIR, `color-wheel-${lang}-${langName.toLowerCase()}-audio.mp3`);
    const finalFile = path.join(OUTPUT_DIR, `color-wheel-${lang}-${langName.toLowerCase()}.mp4`);

    console.log(`\n🎬 Generating video for ${langName} (${lang})...`);

    // Collect audio files and get their actual durations
    const audioFiles = [];
    const audioDurations = [];
    for (let i = 0; i < COLORS_COUNT; i++) {
        const text = colorData[i][lang];
        const hash = getAudioHash('edge', lang, text);
        const cachedAudio = path.join(CACHE_DIR, `${hash}.mp3`);
        audioFiles.push(cachedAudio);
        audioDurations.push(await getAudioDuration(cachedAudio));
    }

    // Calculate total audio duration
    const totalAudioDuration = audioDurations.reduce((a, b) => a + b, 0);
    console.log(`🎵 Total audio duration: ${totalAudioDuration.toFixed(2)}s`);

    console.log('🎵 Merging audio files...');
    await mergeAudioFiles(audioFiles, audioFile);

    const V_WIDTH = 1080;
    const V_HEIGHT = 1920;

    const browser = await puppeteer.launch({
        headless: 'new', // Use headless to avoid OS window frame interference
        defaultViewport: { width: V_WIDTH, height: V_HEIGHT }
    });

    const page = await browser.newPage();
    const BASE_URL = process.env.BASE_URL || 'http://localhost:10010';
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#colorWheel');

    // Inject CSS: Absolute Layout for ultimate stability
    await page.addStyleTag({ content: `
        body {
            padding: 0 !important;
            margin: 0 !important;
            background-color: #f4ecd8 !important;
            width: ${V_WIDTH}px !important;
            height: ${V_HEIGHT}px !important;
            overflow: hidden !important;
        }
        #page-container {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
        }
        /* Hide all clutter */
        #page-title, #lang-buttons, #engine-selector, #ttsStatus, .container::before, .container::after {
            display: none !important;
        }
        /* Lock Wheel at TOP */
        #wheel-container {
            position: absolute !important;
            top: 40px !important;
            left: 0 !important;
            width: 1080px !important;
            height: 1080px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }
        #colorWheel {
            width: 1040px !important;
            height: 1040px !important;
            overflow: visible !important;
        }
        .color-text {
            font-size: 44px !important; /* Jumbo labels for all 10 languages */
            stroke-width: 6px !important;
            font-weight: 900 !important;
        }
        /* Lock Info Panel BELOW Wheel */
        #sidebar {
            position: absolute !important;
            top: 1180px !important;
            left: 40px !important;
            width: 1000px !important;
        }
        #info-panel {
            width: 100% !important;
            height: 450px !important;
            background: rgba(255, 255, 255, 0.7) !important;
            border-radius: 60px !important;
            border: 8px solid #b08d57 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1) !important;
        }
        #selectedColor {
            font-size: 110px !important;
            font-weight: 800 !important;
            text-align: center !important;
            color: #3d2b1f !important;
        }
        #selectedColor small {
            display: block !important;
            font-size: 44px !important;
            margin-top: 40px !important;
            font-weight: 500 !important;
            color: #666 !important;
        }
    `});

    // Use evaluate to change language since buttons are moved off-screen
    await page.evaluate((l) => {
        const btn = document.querySelector(`button.lang-btn[data-lang="${l}"]`);
        if (btn) btn.click();
    }, lang);
    await page.waitForTimeout(1000);

    console.log('🎥 Recording video...');

    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 30,
        videoFrame: { width: V_WIDTH, height: V_HEIGHT },
        aspectRatio: '9:16',
        videoCrf: 23,
        videoCodec: 'libx264',
        videoPreset: 'medium',
        videoBitrate: 6000,
        autopad: { color: '#f4ecd8' }
    });

    await recorder.start(videoFile);
    await page.waitForTimeout(INITIAL_DELAY);

    for (let colorIndex = 0; colorIndex < COLORS_COUNT; colorIndex++) {
        console.log(`  🎨 Color ${colorIndex + 1}/${COLORS_COUNT} (audio: ${audioDurations[colorIndex].toFixed(2)}s)`);
        await page.evaluate((index) => {
            const segment = document.querySelector(`.color-segment[data-index="${index}"]`);
            if (segment) {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                segment.dispatchEvent(event);
            }
        }, colorIndex);
        // Wait for actual audio duration, not fixed delay
        await page.waitForTimeout(audioDurations[colorIndex] * 1000 + 100); // 100ms buffer
    }

    await page.waitForTimeout(FINAL_DELAY);
    await recorder.stop();
    await browser.close();

    console.log(`🎬 Merging video + audio for ${langName}...`);
    console.log(`   Video: ${videoFile}`);
    console.log(`   Audio: ${audioFile}`);
    
    // Offset audio by INITIAL_DELAY to sync with color clicks
    const audioDelaySec = INITIAL_DELAY / 1000;
    
    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', videoFile,
            '-itsoffset', String(audioDelaySec),
            '-i', audioFile,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-map', '0:v:0',
            '-map', '1:a:0',
            '-shortest',
            '-y',
            finalFile
        ]);

        let ffmpegOutput = '';
        ffmpeg.stderr.on('data', (data) => {
            ffmpegOutput += data.toString();
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Success! Final video saved: ${finalFile}`);
                resolve();
            } else {
                console.error(`❌ FFmpeg merge failed with code ${code}`);
                console.error(ffmpegOutput);
                reject(new Error(`FFmpeg merge failed: ${code}`));
            }
        });
    });

    // Verify final file exists and has size > 0
    try {
        const stats = fs.statSync(finalFile);
        if (stats.size > 0) {
            console.log(`📂 Verified: ${path.basename(finalFile)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
            unlinkSync(videoFile);
            unlinkSync(audioFile);
            console.log('🗑️ Cleaned up intermediate files');
        } else {
            throw new Error('Final file is empty');
        }
    } catch (e) {
        console.error(`⚠️ Final file validation failed: ${e.message}`);
    }
}

async function generateAllVideos() {
    const targetLangs = process.argv[2] ? process.argv[2].split(',') : LANGUAGES;
    console.log(`🎬 Starting video generation for: ${targetLangs.join(', ')}...\n`);
    await mkdir(OUTPUT_DIR, { recursive: true });

    for (const lang of targetLangs) {
        await generateVideoForLanguage(lang);
    }

    console.log(`\n🎉 All ${targetLangs.length} video(s) generated!`);
    console.log(`📁 ${OUTPUT_DIR}`);
}

generateAllVideos().catch(console.error);
