import { colorData } from './data.js';

let currentLang = 'zh';
let currentEngine = 'edge';
let currentAudio = null;
let isSpeaking = false;
let selectedColorIndex = -1;
let currentTtsRequestId = 0;
let currentTtsController = null;
// Client-side audio cache: "engine_lang_text" → Blob URL
const audioCache = new Map();
const svg = document.getElementById('colorWheel');
const selectedColorDiv = document.getElementById('selectedColor');
const ttsStatusEl = document.getElementById('ttsStatus');

const WHEEL_ARIA_LABELS = {
    zh: 'Color Rosetta 24 色轮',
    en: 'Color Rosetta 24-color wheel',
    fr: 'Color Rosetta roue de 24 couleurs',
    es: 'Color Rosetta rueda de 24 colores',
    ru: 'Color Rosetta: цветовой круг из 24 сегментов',
    el: 'Color Rosetta τροχός 24 χρωμάτων',
    hi: 'Color Rosetta 24-रंग चक्र',
    ar: 'عجلة Color Rosetta ذات 24 لونا',
    ja: 'Color Rosetta 24色ホイール',
    ko: 'Color Rosetta 24색 휠'
};

function applyLanguagePresentation(lang) {
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang;
    selectedColorDiv.setAttribute('lang', lang);
    selectedColorDiv.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}

function setTtsStatus(text, tone = 'neutral') {
    if (!ttsStatusEl) return;
    ttsStatusEl.textContent = text;
    ttsStatusEl.dataset.tone = tone;
    ttsStatusEl.style.opacity = '1';
}

function createColorWheel() {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '-500 -500 1000 1000');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', WHEEL_ARIA_LABELS[currentLang] || WHEEL_ARIA_LABELS.en);

    const totalSegments = colorData.length;
    const segmentAngle = 360 / totalSegments;
    const outerRadius = 250;
    const spikeRadius = 280;
    const innerRadius = 100;

    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('r', outerRadius + 5);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', 'var(--gold)');
    bgCircle.setAttribute('stroke-width', '0.5');
    bgCircle.setAttribute('opacity', '0.3');
    svg.appendChild(bgCircle);

    colorData.forEach((color, index) => {
        const angle = color.angle - 90;
        const startAngle = angle - segmentAngle / 2;
        const endAngle = angle + segmentAngle / 2;

        const x_in = Math.cos(angle * Math.PI / 180) * innerRadius;
        const y_in = Math.sin(angle * Math.PI / 180) * innerRadius;
        const x_l = Math.cos(startAngle * Math.PI / 180) * outerRadius;
        const y_l = Math.sin(startAngle * Math.PI / 180) * outerRadius;
        const x_tip = Math.cos(angle * Math.PI / 180) * spikeRadius;
        const y_tip = Math.sin(angle * Math.PI / 180) * spikeRadius;
        const x_r = Math.cos(endAngle * Math.PI / 180) * outerRadius;
        const y_r = Math.sin(endAngle * Math.PI / 180) * outerRadius;

        const pathData = `
            M ${x_in} ${y_in}
            L ${x_l} ${y_l}
            L ${x_tip} ${y_tip}
            L ${x_r} ${y_r}
            Z
        `;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('color-segment');
        g.dataset.index = index;
        g.setAttribute('role', 'button');
        g.setAttribute('tabindex', '0');
        g.setAttribute('aria-label', `${color[currentLang]} (${color.hex})`);

        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', pathData);
        pathEl.setAttribute('fill', color.hex);
        pathEl.setAttribute('stroke', 'rgba(0,0,0,0.1)');
        pathEl.setAttribute('stroke-width', '0.5');

        const labelRadius = spikeRadius + 24; /* Increased from 18 to 24 */
        const lx = Math.cos(angle * Math.PI / 180) * labelRadius;
        const ly = Math.sin(angle * Math.PI / 180) * labelRadius;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x_tip);
        line.setAttribute('y1', y_tip);
        line.setAttribute('x2', lx);
        line.setAttribute('y2', ly);
        line.classList.add('leader-line');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let rotation = angle;
        let anchor = 'start';
        if (angle > 90 || angle < -90) {
            rotation += 180;
            anchor = 'end';
        }
        const textRadius = labelRadius + 4;
        const tx = Math.cos(angle * Math.PI / 180) * textRadius;
        const ty = Math.sin(angle * Math.PI / 180) * textRadius;
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('text-anchor', anchor);
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('transform', `rotate(${rotation}, ${tx}, ${ty})`);
        text.setAttribute('lang', currentLang);
        text.classList.add('color-text');
        text.textContent = color[currentLang];

        g.appendChild(pathEl);
        g.appendChild(line);
        g.appendChild(text);

        g.addEventListener('click', () => handleColorClick(index));
        g.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleColorClick(index);
            }
        });

        svg.appendChild(g);
    });

    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    center.setAttribute('r', innerRadius - 10);
    center.setAttribute('fill', 'none');
    center.setAttribute('stroke', 'var(--gold)');
    center.setAttribute('stroke-width', '1');
    center.setAttribute('stroke-dasharray', '2 4');
    svg.appendChild(center);
}

function contrastBackground(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // Relative luminance (WCAG)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // RGB → HSL for hue
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    if (max !== min) {
        const d = max - min;
        const l = (max + min) / 2;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }

    // Dynamic background: Complementary hue, slightly more saturation, extreme luminance
    const bgH = (h * 360 + 180) % 360;
    const bgS = Math.min(s * 100 + 10, 35);   // More colorful than before
    const bgL = lum > 0.45 ? 10 : 96;         // Better threshold and more extreme for contrast

    return `hsla(${Math.round(bgH)}, ${Math.round(bgS)}%, ${bgL}%, 0.95)`;
}

function updateUIBackground(hex) {
    const bg = contrastBackground(hex);
    const infoDiv = document.querySelector('.info');
    if (infoDiv) {
        infoDiv.style.backgroundColor = bg;
    }
    return bg;
}

function updateColorInfo(index, skipAnimation = false) {
    if (index < 0) return;
    const color = colorData[index];
    const colorName = color[currentLang];
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'selected-color-name' + (skipAnimation ? '' : ' pop-text');
    nameSpan.setAttribute('lang', currentLang);
    nameSpan.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    nameSpan.textContent = colorName;

    const infoSmall = document.createElement('small');
    infoSmall.textContent = `${color.hex} · ${index + 1}/${colorData.length}`;

    selectedColorDiv.textContent = '';
    selectedColorDiv.appendChild(nameSpan);
    selectedColorDiv.appendChild(infoSmall);

    selectedColorDiv.style.color = color.hex;
    updateUIBackground(color.hex);
}

function handleColorClick(index) {
    selectedColorIndex = index;
    const color = colorData[index];
    const colorName = color[currentLang];

    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    document.querySelectorAll('.color-segment.pop').forEach(g => g.classList.remove('pop'));

    const segment = svg.querySelector(`.color-segment[data-index="${index}"]`);
    if (segment) {
        segment.classList.add('pop');
        setTimeout(() => segment.classList.remove('pop'), 500);
    }

    // Immediate background update for better responsiveness
    updateUIBackground(color.hex);

    selectedColorDiv.style.opacity = '0';
    setTimeout(() => {
        updateColorInfo(index);
        selectedColorDiv.style.opacity = '1';
    }, 200);

    speakText(colorName, currentLang);
}

function speakText(text, lang) {
    isSpeaking = true;
    currentTtsRequestId += 1;
    const requestId = currentTtsRequestId;
    const cacheId = `${currentEngine}_${lang}_${text}`;

    if (currentTtsController) {
        currentTtsController.abort();
        currentTtsController = null;
    }

    // Check client-side audio cache first
    if (audioCache.has(cacheId)) {
        console.log(`TTS: ${currentEngine} | Cache: LOCAL`);
        setTtsStatus(`${currentEngine} · local cache`, 'success');
        playAudioFromUrl(audioCache.get(cacheId), false);
        return;
    }

    setTtsStatus(`${currentEngine} · requesting audio`, 'neutral');
    currentTtsController = new AbortController();

    fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang, engine: currentEngine }),
        signal: currentTtsController.signal
    })
    .then(response => {
        if (requestId !== currentTtsRequestId) {
            throw new Error('Stale TTS response');
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const cacheStatus = response.headers.get('X-Cache');
        const engine = response.headers.get('X-TTS-Engine');
        console.log(`TTS: ${engine} | Cache: ${cacheStatus}`);
        setTtsStatus(`${engine} · ${cacheStatus.toLowerCase()} cache`, 'success');
        return response.blob();
    })
    .then(blob => {
        if (requestId !== currentTtsRequestId) {
            return;
        }
        const objectUrl = URL.createObjectURL(blob);
        audioCache.set(cacheId, objectUrl);
        playAudioFromUrl(objectUrl, false);
    })
    .catch(error => {
        if (error.name === 'AbortError' || error.message === 'Stale TTS response') {
            return;
        }
        console.error('TTS Error:', error);
        isSpeaking = false;
        setTtsStatus(`error · ${error.message}`, 'error');
    })
    .finally(() => {
        if (requestId === currentTtsRequestId) {
            currentTtsController = null;
        }
    });
}

function playAudioFromUrl(objectUrl, revokeOnEnd) {
    const audio = new Audio(objectUrl);
    currentAudio = audio;
    audio.play();
    audio.onended = () => {
        if (revokeOnEnd) URL.revokeObjectURL(objectUrl);
        currentAudio = null;
        isSpeaking = false;
        setTimeout(() => setTtsStatus(`ready · ${currentEngine}`, 'neutral'), 500);
    };
    audio.onerror = () => {
        if (revokeOnEnd) URL.revokeObjectURL(objectUrl);
        currentAudio = null;
        isSpeaking = false;
    };
}

const ACTIVE_STYLE = { background: '#b08d57', color: '#f4ecd8', borderColor: '#b08d57', boxShadow: '0 2px 8px rgba(176,141,87,0.35)' };
const INACTIVE_STYLE = { background: 'none', color: '#3d2b1f', borderColor: 'transparent', boxShadow: 'none' };

function applyBtnStyle(btn, style) {
    Object.assign(btn.style, style);
}

function updateLanguage(lang) {
    currentLang = lang;
    applyLanguagePresentation(lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        applyBtnStyle(btn, INACTIVE_STYLE);
    });
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
        applyBtnStyle(activeBtn, ACTIVE_STYLE);
    }

    createColorWheel();
    
    // Refresh color info with new language if something is selected
    if (selectedColorIndex >= 0) {
        updateColorInfo(selectedColorIndex, true);
    }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === currentLang ? 'true' : 'false');
    btn.addEventListener('click', () => {
        updateLanguage(btn.dataset.lang);
    });
});

document.querySelectorAll('.engine-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.engine === currentEngine ? 'true' : 'false');
    btn.addEventListener('click', () => {
        currentEngine = btn.dataset.engine;
        document.querySelectorAll('.engine-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        console.log(`Switched to ${currentEngine} TTS engine`);
        setTtsStatus(`ready · ${currentEngine}`, 'neutral');
    });
});

applyLanguagePresentation(currentLang);
const defaultLangBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
if (defaultLangBtn) applyBtnStyle(defaultLangBtn, ACTIVE_STYLE);
createColorWheel();
setTtsStatus(`ready · ${currentEngine}`, 'neutral');
