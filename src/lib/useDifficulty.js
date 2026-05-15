import { useState, useCallback } from 'react';

/**
 * Adaptive difficulty hook.
 * Difficulty ranges from 1 (easiest) to maxLevel.
 * Correct answer → difficulty goes up by 1.
 * Wrong answer → difficulty goes down by 1.
 */
export default function useDifficulty(initialLevel = 1, maxLevel = 10) {
  const [level, setLevel] = useState(initialLevel);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

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
    setStreak(0);
    setTotalCorrect(0);
    setTotalAttempts(0);
  }, [initialLevel]);

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