// ─── lib/adaptiveDifficulty.js ────────────────────────────────────────────

import { DIFFICULTY_CONFIG } from '@/lib/difficultyConfig';

const LEVELS = DIFFICULTY_CONFIG.levels;

function levelConfig(level) {
  return LEVELS[level] || LEVELS[1];
}

/**
 * Computes the next difficulty level for the memory game.
 *
 * Uses calibrated thresholds (see difficultyConfig.js):
 *   accuracy > promoteThresh (0.80) with requiredWins  → promote (harder)
 *   accuracy < demoteThresh  (0.45) on a wrong round    → demote  (easier)
 *   otherwise                                            → hold
 *
 * @param {number} currentLevel      - Current level (1–15)
 * @param {object} roundResult       - { isCorrect, totalCorrect, totalAttempts, consecutiveWins }
 * @param {object} config            - { minLevel: 1, maxLevel: 15 }
 * @returns {{ nextLevel: number, direction: 'up'|'hold'|'down', reason: string }}
 */
export function getNextMemoryDifficulty(currentLevel, roundResult, config = {}) {
  const { minLevel = 1, maxLevel = 15 } = config;
  const { targetAccuracy, promoteThresh, demoteThresh, requiredWins } = DIFFICULTY_CONFIG;
  const { isCorrect, totalCorrect, totalAttempts, consecutiveWins } = roundResult;

  // Need at least 2 attempts to make an accuracy judgment
  const accuracy = totalAttempts > 1
    ? totalCorrect / totalAttempts
    : (isCorrect ? 1 : 0);

  let direction = 'hold';
  let reason = '';

  if (isCorrect && consecutiveWins >= requiredWins && accuracy > promoteThresh) {
    direction = 'up';
    reason = `accuracy ${Math.round(accuracy * 100)}% > ${Math.round(promoteThresh * 100)}% for ${consecutiveWins} rounds`;
  } else if (!isCorrect && accuracy < demoteThresh) {
    direction = 'down';
    reason = `accuracy ${Math.round(accuracy * 100)}% < ${Math.round(demoteThresh * 100)}%`;
  } else {
    reason = `accuracy ${Math.round(accuracy * 100)}% in hold zone (target ${Math.round(targetAccuracy * 100)}%)`;
  }

  const delta = direction === 'up' ? 1 : direction === 'down' ? -1 : 0;
  const nextLevel = Math.min(Math.max(currentLevel + delta, minLevel), maxLevel);

  return { nextLevel, direction, reason };
}

/** Flip preview duration (ms) for a level — from calibrated config. */
export function getFlipPreviewMs(level) {
  return levelConfig(level).flipMs;
}

/** Move par (max moves for a "correct" round) = pairCount + calibrated moveRatio. */
export function getMovePar(pairCount, level) {
  return Math.round(pairCount + levelConfig(level).moveRatio);
}

/** Number of card pairs for a level — from calibrated config. */
export function getPairCount(level) {
  return levelConfig(level).pairs;
}