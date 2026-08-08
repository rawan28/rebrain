import { useState, useCallback, useEffect } from 'react';
import { getFixedLevel } from '@/lib/difficultyPref';
import { getNextMemoryDifficulty } from '@/lib/adaptiveDifficulty';

/**
 * Adaptive difficulty hook.
 * Difficulty ranges from 1 (easiest) to maxLevel.
 *
 * Default mode (dda = false): correct → +1, wrong → −1.
 * DDA mode (dda = true, used by the memory game): uses the Yerkes-Dodson
 * zone model from adaptiveDifficulty.js — promote above target accuracy,
 * hold in the zone, demote below it — and exposes `lastDirection` for UI.
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

export default function useDifficulty(initialLevel = 1, maxLevel = 10, gameKey = null, options = {}) {
  const { dda = false } = options;
  const [level, setLevel] = useState(() => getFixedLevel() ?? getStoredLevel(gameKey, initialLevel));
  const [streak, setStreak] = useState(0);
  const [consecWins, setConsecWins] = useState(0);
  const [lastDirection, setLastDirection] = useState('hold');
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Persist level whenever it changes (only in automatic mode,
  // so switching back to auto restores the adaptive level)
  useEffect(() => {
    if (getFixedLevel() === null) storeLevel(gameKey, level);
  }, [gameKey, level]);

  const recordAnswer = useCallback((isCorrect) => {
    setTotalAttempts(prev => prev + 1);
    // Track consecutive correct rounds for the DDA model
    const newConsecWins = isCorrect ? consecWins + 1 : 0;
    setConsecWins(newConsecWins);
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    const manual = getFixedLevel() !== null;
    if (manual) return 'hold';
    if (dda) {
      // ── DDA: compute next level from accuracy zone, not just this round ──
      const { nextLevel, direction } = getNextMemoryDifficulty(
        level,
        {
          isCorrect,
          totalCorrect: totalCorrect + (isCorrect ? 1 : 0),
          totalAttempts: totalAttempts + 1,
          consecutiveWins: newConsecWins,
        },
        { minLevel: 1, maxLevel }
      );
      setLevel(nextLevel);
      setLastDirection(direction);
      return direction;
    } else {
      setLevel(prev => (isCorrect ? Math.min(prev + 1, maxLevel) : Math.max(prev - 1, 1)));
      return isCorrect ? 'up' : 'down';
    }
  }, [level, totalCorrect, totalAttempts, consecWins, maxLevel, dda]);

  const reset = useCallback(() => {
    const fixed = getFixedLevel();
    setLevel(fixed ?? initialLevel);
    if (fixed === null) storeLevel(gameKey, initialLevel);
    setStreak(0);
    setConsecWins(0);
    setLastDirection('hold');
    setTotalCorrect(0);
    setTotalAttempts(0);
  }, [initialLevel, gameKey]);

  return {
    level,
    streak,
    totalCorrect,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    lastDirection,
    recordAnswer,
    reset,
  };
}