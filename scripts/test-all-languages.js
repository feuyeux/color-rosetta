import { VALID_LANGS, colorData } from '../public/assets/js/data.js';

const languages = VALID_LANGS.map(code => ({
  code,
  text: colorData[0][code] // Usually "Red" or equivalent
}));

const baseUrl = process.env.BASE_URL || 'http://localhost:10010';

async function testLanguage(lang, text) {
  try {
    const response = await fetch(`${baseUrl}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang, engine: 'edge' })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const cacheStatus = response.headers.get('X-Cache');
    const engine = response.headers.get('X-TTS-Engine');
    const buffer = await response.arrayBuffer();

    console.log(`✓ ${lang.padEnd(4)} | ${text.padEnd(10)} | ${engine} | ${cacheStatus} | ${buffer.byteLength} bytes`);
    return true;
  } catch (error) {
    console.log(`✗ ${lang.padEnd(4)} | ${text.padEnd(10)} | ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`Using endpoint: ${baseUrl}`);
  console.log('\n=== Testing 10 Languages with Edge-TTS ===\n');
  console.log('Lang | Text       | Engine   | Cache | Size');
  console.log('-----|------------|----------|-------|------');

  for (const { code, text } of languages) {
    await testLanguage(code, text);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== Testing Cache (Second Run) ===\n');
  console.log('Lang | Text       | Engine   | Cache | Size');
  console.log('-----|------------|----------|-------|------');

  for (const { code, text } of languages) {
    await testLanguage(code, text);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✓ All tests completed!\n');
}

runTests();
