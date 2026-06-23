import { useState, useCallback, useEffect } from 'react';

/**
 * Adaptive difficulty hook.
 * Difficulty ranges from 1 (easiest) to maxLevel.
 * Correct answer → difficulty goes up by 1.
 * Wrong answer → difficulty goes down by 1.
 *
 * Pass a `gameKey` to persist the level across sessions via localStorage.
 */
function getStoredLevel(gameKey, fallback) {
  if (!gameKey) return fallback;
  try {
    const val = localStorage.getItem(`rebrain_level_${gameKey}`);
    const parsed = val ? parseInt(val, 10) : NaN;
    return isNaN(parsed) ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function storeLevel(gameKey, level) {
  if (!gameKey) return;
  try {
    localStorage.setItem(`rebrain_level_${gameKey}`, String(level));
  } catch {
    // ignore
  }
}

export default function useDifficulty(initialLevel = 1, maxLevel = 10, gameKey = null) {
  const [level, setLevel] = useState(() => getStoredLevel(gameKey, initialLevel));
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Persist level whenever it changes
  useEffect(() => {
    storeLevel(gameKey, level);
  }, [gameKey, level]);

  const recordAnswer = useCallback((isCorrect) => {
    setTotalAttempts(prev => prev + 1);
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
      setLevel(prev => Math.min(prev + 1, maxLevel));
    } else {
      setStreak(0);
      setLevel(prev => Math.max(prev - 1, 1));
    }
  }, [maxLevel]);

  const reset = useCallback(() => {
    setLevel(initialLevel);
    storeLevel(gameKey, initialLevel);
    setStreak(0);
    setTotalCorrect(0);
    setTotalAttempts(0);
  }, [initialLevel, gameKey]);

  return {
    level,
    streak,
    totalCorrect,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    recordAnswer,
    reset,
  };
}