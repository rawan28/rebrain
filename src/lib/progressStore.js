// Progress store — saves/loads game session data
// Primary storage: backend DB (UserProgress entity)
// Local cache: localStorage for instant reads

import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'mindfit_progress';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { memory: [], logic: [], numbers: [] };
  } catch {
    return { memory: [], logic: [], numbers: [] };
  }
}

function saveToLocalCache(game, session) {
  try {
    const data = loadProgress();
    if (!data[game]) data[game] = [];
    data[game].push(session);
    if (data[game].length > 50) data[game] = data[game].slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function saveSession(game, { level, streak, totalCorrect, totalAttempts, responseTimeMs }) {
  const session = {
    date: new Date().toISOString(),
    level,
    streak,
    totalCorrect,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    responseTimeMs: responseTimeMs ?? null,
  };

  // Always write to local cache immediately
  saveToLocalCache(game, session);

  // Sync to backend (fire and forget — don't block game flow)
  try {
    await base44.entities.UserProgress.create({ game, ...session });
  } catch {
    // Silently fail — local cache still has the data
  }
}

// Load progress from backend and rebuild local cache
export async function syncProgressFromBackend() {
  try {
    const records = await base44.entities.UserProgress.list('-date', 500);
    const data = {};
    for (const rec of records) {
      if (!data[rec.game]) data[rec.game] = [];
      data[rec.game].push({
        date: rec.date,
        level: rec.level,
        streak: rec.streak,
        totalCorrect: rec.totalCorrect,
        totalAttempts: rec.totalAttempts,
        accuracy: rec.accuracy,
        responseTimeMs: rec.responseTimeMs,
      });
    }
    // Sort each game's sessions by date ascending
    for (const game of Object.keys(data)) {
      data[game].sort((a, b) => new Date(a.date) - new Date(b.date));
      if (data[game].length > 50) data[game] = data[game].slice(-50);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return loadProgress();
  }
}