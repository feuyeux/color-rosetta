import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { colorData, VALID_LANGS } from '../public/assets/js/data.js';
import { edgeTTS, getVoiceStyle } from '../src/server/tts-engines.js';
import { getCacheKey } from '../src/server/utils.js';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const projectRoot = path.resolve(scriptDir, '..');
const cacheDir = path.join(projectRoot, '.cache');

async function main() {
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    let cached = 0, missing = 0;
    const engine = 'edge';
    const ext = 'mp3';

    for (const color of colorData) {
        for (const lang of VALID_LANGS) {
            const text = color[lang];
            const styleParams = getVoiceStyle(lang);
            const key = getCacheKey(text, lang, engine, styleParams);
            const cachePath = path.join(cacheDir, `${key}.${ext}`);

            if (fs.existsSync(cachePath)) {
                cached++;
                continue;
            }

            process.stdout.write(`Caching: ${color.en} (${lang})...\n`);
            try {
                const audio = await edgeTTS(text, lang, true);
                await fs.promises.writeFile(cachePath, audio);
                missing++;
                await new Promise(r => setTimeout(r, 200));
            } catch (e) {
                console.error(`Failed: ${color.en} (${lang}) - ${e.message}`);
            }
        }
    }

    console.log(`\nDone. Cached: ${cached}, Newly cached: ${missing}`);
}

main().catch(console.error);
