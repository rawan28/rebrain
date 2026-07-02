// Simple audio feedback using Web Audio API — no external files needed
const CTX_KEY = '_rebrainAudioCtx';

function getCtx() {
  if (!window[CTX_KEY]) window[CTX_KEY] = new (window.AudioContext || window.webkitAudioContext)();
  return window[CTX_KEY];
}

function isEnabled() {
  return localStorage.getItem('rebrain_sound') !== 'off';
}

function playTone(freq, duration = 0.15, type = 'sine', vol = 0.3) {
  if (!isEnabled()) return;
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playCorrect() {
  playTone(523, 0.1, 'sine', 0.25);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 100);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.3), 200);
}

export function playWrong() {
  playTone(200, 0.2, 'square', 0.15);
  setTimeout(() => playTone(160, 0.25, 'square', 0.12), 150);
}

export function playTap() {
  playTone(440, 0.05, 'sine', 0.1);
}

export function playLevelUp() {
  playTone(523, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 120);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.25), 240);
  setTimeout(() => playTone(1047, 0.2, 'sine', 0.3), 360);
}

export function isSoundEnabled() {
  return isEnabled();
}

export function setSoundEnabled(on) {
  localStorage.setItem('rebrain_sound', on ? 'on' : 'off');
}