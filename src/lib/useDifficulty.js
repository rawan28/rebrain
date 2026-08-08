import { useState, useCallback, useEffect } from 'react';
import { getFixedLevel } from '@/lib/difficultyPref';

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
  const [level, setLevel] = useState(() => getFixedLevel() ?? getStoredLevel(gameKey, initialLevel));
  const [streak, setStreak] = useState(0);
  const [loseStreak, setLoseStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Persist level whenever it changes (only in automatic mode,
  // so switching back to auto restores the adaptive level)
  useEffect(() => {
    if (getFixedLevel() === null) storeLevel(gameKey, level);
  }, [gameKey, level]);

  const recordAnswer = useCallback((isCorrect) => {
    setTotalAttempts(prev => prev + 1);
    const manual = getFixedLevel() !== null;
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (!manual) setLevel(prev => Math.min(prev + 1, maxLevel));
    } else {
      setStreak(0);
      if (!manual) setLevel(prev => Math.max(prev - 1, 1));
    }
  }, [maxLevel]);

  // Momentum variant: the level step grows with the current streak so the
  // difficulty converges to the player's skill faster. Used by the memory game.
  // 1st correct/wrong → ±1, 2nd in a row → ±2, 4th+ in a row → ±3.
  const recordAnswerMomentum = useCallback((isCorrect) => {
    setTotalAttempts(prev => prev + 1);
    const manual = getFixedLevel() !== null;
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
      setLoseStreak(0);
      setStreak(prev => {
        const next = prev + 1;
        if (!manual) {
          const step = next >= 4 ? 3 : next >= 2 ? 2 : 1;
          setLevel(p => Math.min(p + step, maxLevel));
        }
        return next;
      });
    } else {
      setStreak(0);
      setLoseStreak(prev => {
        const next = prev + 1;
        if (!manual) {
          const step = next >= 4 ? 3 : next >= 2 ? 2 : 1;
          setLevel(p => Math.max(p - step, 1));
        }
        return next;
      });
    }
  }, [maxLevel]);

  const reset = useCallback(() => {
    const fixed = getFixedLevel();
    setLevel(fixed ?? initialLevel);
    if (fixed === null) storeLevel(gameKey, initialLevel);
    setStreak(0);
    setLoseStreak(0);
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
    recordAnswerMomentum,
    reset,
  };
}