import { VALID_LANGS, colorData } from '../public/assets/js/data.js';

const languages = VALID_LANGS.map(code => ({
  code,
  text: colorData[0][code] // Usually "Red" or equivalent
}));

const baseUrl = process.env.BASE_URL || 'http://localhost:10010';
const engines = (process.env.TTS_TEST_ENGINES || 'edge')
  .split(',')
  .map(engine => engine.trim())
  .filter(Boolean);
const validEngines = new Set(['edge', 'gemini']);

for (const engine of engines) {
  if (!validEngines.has(engine)) {
    console.error(`Unsupported engine "${engine}". Use one of: edge, gemini`);
    process.exit(1);
  }
}

async function testLanguage(lang, text, engine) {
  try {
    const response = await fetch(`${baseUrl}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang, engine })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}${errorBody ? ` ${errorBody}` : ''}`);
    }

    const cacheStatus = response.headers.get('X-Cache');
    const responseEngine = response.headers.get('X-TTS-Engine');
    const buffer = await response.arrayBuffer();

    console.log(`✓ ${lang.padEnd(4)} | ${text.padEnd(10)} | ${responseEngine} | ${cacheStatus} | ${buffer.byteLength} bytes`);
    return true;
  } catch (error) {
    console.log(`✗ ${lang.padEnd(4)} | ${text.padEnd(10)} | ${engine} | ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`Using endpoint: ${baseUrl}`);
  let failureCount = 0;

  for (const engine of engines) {
    console.log(`\n=== Testing 10 Languages with ${engine} ===\n`);
    console.log('Lang | Text       | Engine   | Cache | Size');
    console.log('-----|------------|----------|-------|------');

    for (const { code, text } of languages) {
      if (!(await testLanguage(code, text, engine))) {
        failureCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n=== Testing Cache (Second Run) ===\n');
    console.log('Lang | Text       | Engine   | Cache | Size');
    console.log('-----|------------|----------|-------|------');

    for (const { code, text } of languages) {
      if (!(await testLanguage(code, text, engine))) {
        failureCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  if (failureCount > 0) {
    console.error(`\n✗ Tests completed with ${failureCount} failure(s)\n`);
    process.exitCode = 1;
    return;
  }

  console.log('\n✓ All tests completed!\n');
}

runTests();
