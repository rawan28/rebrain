// ─── lib/adaptiveDifficulty.js ────────────────────────────────────────────

/**
 * Computes the next difficulty level for the memory game.
 *
 * Uses the Yerkes-Dodson zone model:
 *   accuracy > 80%  → promote  (harder)
 *   accuracy 60–80% → hold     (same level)
 *   accuracy < 60%  → demote   (easier)
 *
 * @param {number} currentLevel      - Current level (1–15)
 * @param {object} roundResult       - { isCorrect: bool, totalCorrect: int, totalAttempts: int, consecutiveWins: int }
 * @param {object} config            - { minLevel: 1, maxLevel: 15, targetAccuracy: 0.75 }
 * @returns {{ nextLevel: number, direction: 'up'|'hold'|'down', reason: string }}
 */
export function getNextMemoryDifficulty(currentLevel, roundResult, config = {}) {
  const {
    minLevel       = 1,
    maxLevel       = 15,
    targetAccuracy = 0.75,
  } = config;

  const { isCorrect, totalCorrect, totalAttempts, consecutiveWins } = roundResult;

  // Need at least 2 attempts to make an accuracy judgment
  const accuracy = totalAttempts > 1
    ? totalCorrect / totalAttempts
    : (isCorrect ? 1 : 0);

  let direction = 'hold';
  let reason    = '';

  if (isCorrect && consecutiveWins >= 2 && accuracy > targetAccuracy + 0.05) {
    direction = 'up';
    reason    = `accuracy ${Math.round(accuracy * 100)}% > ${Math.round((targetAccuracy + 0.05) * 100)}% for ${consecutiveWins} rounds`;
  } else if (!isCorrect && accuracy < targetAccuracy - 0.15) {
    direction = 'down';
    reason    = `accuracy ${Math.round(accuracy * 100)}% < ${Math.round((targetAccuracy - 0.15) * 100)}%`;
  } else {
    reason = `accuracy ${Math.round(accuracy * 100)}% in hold zone`;
  }

  const delta     = direction === 'up' ? 1 : direction === 'down' ? -1 : 0;
  const nextLevel = Math.min(Math.max(currentLevel + delta, minLevel), maxLevel);

  return { nextLevel, direction, reason };
}

/**
 * Returns flip preview duration (ms) for a given level.
 * Harder levels give less time to see the cards before they flip back.
 */
export function getFlipPreviewMs(level) {
  // L1=1200ms → L10=800ms → L15=600ms (linear interpolation, clamped)
  return Math.round(Math.max(600, 1200 - (level - 1) * 40));
}

/**
 * Returns the move par (max moves to count as "correct" round).
 * Harder levels have a tighter move budget.
 */
export function getMovePar(pairCount, level) {
  const bonus = Math.max(2, 5 - Math.floor(level / 3)); // L1=+5, L3=+4, L6=+3, L9+=+2
  return pairCount + bonus;
}