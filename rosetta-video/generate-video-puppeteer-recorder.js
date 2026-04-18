import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'color-wheel-demo.mp4');

const LANGUAGES = ['zh', 'en', 'fr', 'es', 'ru', 'el', 'hi', 'ar', 'ja', 'ko'];
const COLORS_COUNT = 24;
const DELAY_BETWEEN_COLORS = 1800; // ms between color clicks (allow TTS to finish)
const DELAY_BETWEEN_LANGUAGES = 2500; // ms between language switches

async function generateVideo() {
    console.log('🎬 Starting video generation with Puppeteer Screen Recorder...');

    await mkdir(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: [
            '--window-size=1920,1080',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();

    const BASE_URL = process.env.BASE_URL || 'http://localhost:10010';
    console.log(`📡 Connecting to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.waitForSelector('#colorWheel');
    await page.waitForTimeout(1500);

    console.log('🎥 Starting recording...');

    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 30,
        videoFrame: {
            width: 1920,
            height: 1080
        },
        aspectRatio: '16:9',
        videoCrf: 18,
        videoCodec: 'libx264',
        videoPreset: 'ultrafast',
        videoBitrate: 5000,
        autopad: {
            color: '#f4ecd8'
        }
    });

    await recorder.start(OUTPUT_FILE);
    await page.waitForTimeout(1000);

    // Main recording loop
    for (const lang of LANGUAGES) {
        console.log(`\n🌍 Language: ${lang.toUpperCase()}`);

        await page.click(`button.lang-btn[data-lang="${lang}"]`);
        await page.waitForTimeout(1000);

        for (let colorIndex = 0; colorIndex < COLORS_COUNT; colorIndex++) {
            console.log(`  🎨 Color ${colorIndex + 1}/${COLORS_COUNT}`);

            await page.evaluate((index) => {
                const segment = document.querySelector(`.color-segment[data-index="${index}"]`);
                if (segment) {
                    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                    segment.dispatchEvent(event);
                }
            }, colorIndex);

            await page.waitForTimeout(DELAY_BETWEEN_COLORS);
        }

        await page.waitForTimeout(DELAY_BETWEEN_LANGUAGES);
    }

    console.log('\n✅ Stopping recording...');
    await recorder.stop();
    await browser.close();

    console.log(`\n🎉 Video saved to: ${OUTPUT_FILE}`);
}

generateVideo().catch(console.error);
