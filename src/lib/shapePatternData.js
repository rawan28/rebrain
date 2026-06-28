// Shape-in-shape pattern puzzle generator

const OUTER_SHAPES = ['circle', 'square', 'diamond', 'hexagon', 'triangle'];
const INNER_SHAPES = ['circle', 'square', 'diamond', 'triangle', 'star'];

const COLORS = [
  { outer: '#3b82f6', inner: '#ef4444', label: 'blue-red' },
  { outer: '#10b981', inner: '#f59e0b', label: 'green-yellow' },
  { outer: '#8b5cf6', inner: '#06b6d4', label: 'purple-cyan' },
  { outer: '#f43f5e', inner: '#22c55e', label: 'rose-green' },
  { outer: '#0ea5e9', inner: '#a855f7', label: 'sky-purple' },
  { outer: '#f97316', inner: '#6366f1', label: 'orange-indigo' },
];

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN(arr, n, rng) {
  return shuffle(arr, rng).slice(0, n);
}

function makeCombo(outerShape, innerShape, colorSet) {
  return { outerShape, innerShape, outerColor: colorSet.outer, innerColor: colorSet.inner };
}

/**
 * Generate a puzzle for a given difficulty level.
 * The sequence shows 5 items with a repeating pattern, and the 6th (last) is "?".
 * The user picks from 4 options.
 */
export function generatePuzzle(level) {
  const rng = seededRandom(Date.now() + level * 31);

  // Pattern length grows with difficulty: 2 at low, 3 at mid, 4 at high
  const patternLen = level <= 5 ? 2 : level <= 10 ? 3 : 4;

  // Pick distinct combos for the pattern
  const usedOuters = pickN(OUTER_SHAPES, patternLen, rng);
  const usedInners = pickN(INNER_SHAPES, patternLen, rng);
  const usedColors = pickN(COLORS, patternLen, rng);

  const pattern = [];
  for (let i = 0; i < patternLen; i++) {
    pattern.push(makeCombo(usedOuters[i], usedInners[i], usedColors[i]));
  }

  // Build sequence: repeat pattern to fill 6 slots, last one is the answer
  const sequenceLen = 6;
  const sequence = [];
  for (let i = 0; i < sequenceLen; i++) {
    sequence.push(pattern[i % patternLen]);
  }

  const answer = sequence[sequenceLen - 1];

  // Generate 3 wrong options (different combos)
  const wrongOptions = [];
  const usedKeys = new Set([`${answer.outerShape}-${answer.innerShape}-${answer.outerColor}`]);
  let attempts = 0;
  while (wrongOptions.length < 3 && attempts < 50) {
    attempts++;
    const wo = pick(OUTER_SHAPES, rng);
    const wi = pick(INNER_SHAPES, rng);
    const wc = pick(COLORS, rng);
    const key = `${wo}-${wi}-${wc.outer}`;
    if (!usedKeys.has(key)) {
      usedKeys.add(key);
      wrongOptions.push(makeCombo(wo, wi, wc));
    }
  }

  const allOptions = shuffle([answer, ...wrongOptions], rng);
  const correctIndex = allOptions.findIndex(o =>
    o.outerShape === answer.outerShape &&
    o.innerShape === answer.innerShape &&
    o.outerColor === answer.outerColor &&
    o.innerColor === answer.innerColor
  );

  return {
    sequence: sequence.slice(0, sequenceLen - 1), // show 5
    answer,
    options: allOptions,
    correctIndex,
    patternLen,
  };
}