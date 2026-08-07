import assert from 'assert';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve module relative to repo root when running from project root:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  getPulseMatchDaily,
  getPulseMatchSession,
  SHAPES,
  COLORS,
  pulseMatchConfig,
} from '../src/lib/pulseMatchData.js';

function colorKeys() { return COLORS.map(c => c.key); }

function run() {
  console.log('Running pulseMatchData tests...');

  // deterministic daily test
  const date = '2026-08-07';
  const level = 3;
  const a = getPulseMatchDaily(date, level);
  const b = getPulseMatchDaily(date, level);
  assert.deepStrictEqual(a, b, 'getPulseMatchDaily should be deterministic for same date+level');

  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  assert.strictEqual(a.rounds.length, cfg.rounds, 'rounds length must match config');

  for (const [ri, r] of a.rounds.entries()) {
    assert.ok(SHAPES.includes(r.targetShape), `round ${ri} targetShape must be in SHAPES`);
    assert.ok(colorKeys().includes(r.targetColor.key), `round ${ri} targetColor must be in COLORS`);

    assert.strictEqual(r.options.length, cfg.options, `round ${ri} options length must equal cfg.options`);

    const correctCount = r.options.filter(o => o.isCorrect).length;
    assert.strictEqual(correctCount, 1, `round ${ri} must have exactly one correct option`);

    // ensure all options have valid shape/color
    for (const [oi, o] of r.options.entries()) {
      assert.ok(SHAPES.includes(o.shape), `round ${ri} option ${oi} has invalid shape`);
      assert.ok(colorKeys().includes(o.color.key), `round ${ri} option ${oi} has invalid color`);
    }
  }

  // session tests (random)
  const s1 = getPulseMatchSession(level);
  const s2 = getPulseMatchSession(level);
  assert.ok(s1.id && typeof s1.id === 'string', 'session id must be a string');
  assert.notStrictEqual(s1.id, s2.id, 'two fresh sessions should have different ids');
  assert.strictEqual(s1.rounds.length, cfg.rounds, 'session rounds length must match config');

  // At least one round differs between two sessions (very high probability)
  const roundsEqual = JSON.stringify(s1.rounds) === JSON.stringify(s2.rounds);
  if (roundsEqual) {
    console.warn('Warning: two consecutive sessions produced identical rounds (very unlikely)');
  }

  console.log('All tests passed ✅');
}

try {
  run();
  process.exit(0);
} catch (err) {
  console.error('Test failure:', err && err.stack ? err.stack : err);
  process.exit(2);
}
