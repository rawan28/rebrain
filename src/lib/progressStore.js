// Progress store — saves/loads game session data to localStorage

const STORAGE_KEY = 'mindfit_progress';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { memory: [], logic: [], numbers: [] };
  } catch {
    return { memory: [], logic: [], numbers: [] };
  }
}

export function saveSession(game, { level, streak, totalCorrect, totalAttempts, responseTimeMs }) {
  const data = loadProgress();
  if (!data[game]) data[game] = [];
  data[game].push({
    date: new Date().toISOString(),
    level,
    streak,
    totalCorrect,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    responseTimeMs: responseTimeMs ?? null,
  });
  // Keep last 50 sessions per game
  if (data[game].length > 50) data[game] = data[game].slice(-50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}