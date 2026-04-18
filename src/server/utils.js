import crypto from 'crypto';

/**
 * Generate a cache key for TTS audio based on engine, language, text and style params.
 */
export function getCacheKey(text, lang, engine, styleParams = null) {
  const baseKey = `${engine}_${lang}_${text}`;
  const fullKey = styleParams ? `${baseKey}_${styleParams.rate}_${styleParams.pitch}` : baseKey;
  return crypto.createHash('md5').update(fullKey).digest('hex');
}

/**
 * Returns audio configuration (extension and content type) for a given engine.
 */
export function getAudioConfig(engine) {
  if (engine === 'edge') {
    return { extension: 'mp3', contentType: 'audio/mpeg' };
  }
  return { extension: 'wav', contentType: 'audio/wav' };
}
