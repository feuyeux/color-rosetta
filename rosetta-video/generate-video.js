import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'color-wheel-demo.mp4');

const LANGUAGES = ['zh', 'en', 'fr', 'es', 'ru', 'el', 'hi', 'ar', 'ja', 'ko'];
const COLORS_COUNT = 24;
const DELAY_BETWEEN_COLORS = 1500; // ms between color clicks
const DELAY_BETWEEN_LANGUAGES = 2000; // ms between language switches

async function generateVideo() {
    console.log('🎬 Starting video generation...');

    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    const browser = await puppeteer.launch({
        headless: false, // Show browser for recording
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: ['--window-size=1920,1080']
    });

    const page = await browser.newPage();

    // Navigate to the app
    const BASE_URL = process.env.BASE_URL || 'http://localhost:10010';
    console.log(`📡 Connecting to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Wait for the wheel to render
    await page.waitForSelector('#colorWheel');
    await page.waitForTimeout(1000);

    console.log('🎥 Starting recording...');

    // Start screen recording using FFmpeg
    const ffmpeg = spawn('ffmpeg', [
        '-f', 'avfoundation',
        '-i', '1:0', // Capture screen 1, no audio (we'll add TTS audio separately)
        '-r', '30',
        '-s', '1920x1080',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-y',
        OUTPUT_FILE
    ]);

    ffmpeg.stderr.on('data', (data) => {
        // Suppress FFmpeg verbose output
    });

    // Wait for FFmpeg to start
    await page.waitForTimeout(2000);

    // Main recording loop
    for (const lang of LANGUAGES) {
        console.log(`\n🌍 Language: ${lang.toUpperCase()}`);

        // Click language button
        await page.click(`button.lang-btn[data-lang="${lang}"]`);
        await page.waitForTimeout(800);

        // Click through all 24 colors clockwise
        for (let colorIndex = 0; colorIndex < COLORS_COUNT; colorIndex++) {
            console.log(`  🎨 Color ${colorIndex + 1}/${COLORS_COUNT}`);

            // Click the color segment
            await page.evaluate((index) => {
                const segment = document.querySelector(`.color-segment[data-index="${index}"]`);
                if (segment) segment.click();
            }, colorIndex);

            // Wait for TTS to play and finish
            await page.waitForTimeout(DELAY_BETWEEN_COLORS);
        }

        // Pause between languages
        await page.waitForTimeout(DELAY_BETWEEN_LANGUAGES);
    }

    console.log('\n✅ Recording complete, stopping FFmpeg...');

    // Stop FFmpeg
    ffmpeg.stdin.write('q');

    await new Promise((resolve) => {
        ffmpeg.on('close', resolve);
    });

    await browser.close();

    console.log(`\n🎉 Video saved to: ${OUTPUT_FILE}`);
}

// Run
generateVideo().catch(console.error);
