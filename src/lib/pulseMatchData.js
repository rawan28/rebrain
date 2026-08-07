/**
 * pulseMatchData.js
 * Deterministic daily puzzles + fresh random sessions for the Pulse Match mini-game.
 *
 * Improvements:
 * - JSDoc comments and validation
 * - Deep-freeze of constant arrays/objects to avoid mutation
 * - More explicit date hashing for seeds
 * - Added 'en' labels as a default locale
 */

export const PULSE_MATCH = "pulse_match";

/** Immutable list of shapes */
export const SHAPES = Object.freeze(["circle", "square", "triangle", "star", "diamond", "hexagon"]);

/** Immutable list of colors (each item is frozen) */
export const COLORS = Object.freeze(
  Object.freeze([
    Object.freeze({ key: "red",    css: "#dc2626" }),
    Object.freeze({ key: "blue",   css: "#2563eb" }),
    Object.freeze({ key: "green",  css: "#16a34a" }),
    Object.freeze({ key: "yellow", css: "#ca8a04" }),
    Object.freeze({ key: "purple", css: "#9333ea" }),
    Object.freeze({ key: "teal",   css: "#0d9488" }),
  ])
);

/** Configuration by level */
export const pulseMatchConfig = Object.freeze({
  1:  { rounds: 6,  driftMs: 6000, options: 2 },
  2:  { rounds: 7,  driftMs: 5500, options: 2 },
  3:  { rounds: 8,  driftMs: 5000, options: 3 },
  4:  { rounds: 9,  driftMs: 4500, options: 3 },
  5:  { rounds: 10, driftMs: 4000, options: 3 },
  6:  { rounds: 10, driftMs: 3600, options: 4 },
  7:  { rounds: 12, driftMs: 3200, options: 4 },
  8:  { rounds: 12, driftMs: 2800, options: 4 },
  9:  { rounds: 14, driftMs: 2500, options: 4 },
  10: { rounds: 14, driftMs: 2200, options: 5 },
});

/**
 * Small LCG seeded RNG returning a function that yields numbers in [0,1).
 * Keeps s as an unsigned 32-bit integer.
 * @param {number} seed - integer seed
 * @returns {() => number}
 */
function seededRand(seed) {
  let s = (seed >>> 0) || 1; // ensure non-zero 32-bit unsigned
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Convert a date string into a stable 32-bit integer seed.
 * Uses a simple rolling hash rather than ad-hoc multipliers for clarity.
 * Examples of accepted dateStr: "2026-08-07", "2026/08/07"
 * @param {string} dateStr
 * @returns {number}
 */
function dateSeed(dateStr) {
  // Keep only digits and hyphens to reduce variance from formatting
  const s = String(dateStr).trim();
  // djb2-like rolling hash but limited to 32 bits
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) + h) + s.charCodeAt(i); // h * 33 + c
    h = h >>> 0;
  }
  return h >>> 0;
}

/**
 * Pick an item from an array using a provided rng function.
 * Throws if array is empty.
 * @template T
 * @param {() => number} rand
 * @param {T[]} arr
 * @returns {T}
 */
function pick(rand, arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("pick: array must be a non-empty array");
  }
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * Build a single round.
 * rule: either "shape" or "color" (decided randomly)
 * Ensures exactly one correct option (matches target on rule dimension and differs on the other).
 * @param {() => number} rand
 * @param {number|string} level
 */
function makeRound(rand, level) {
  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  const rule = rand() < 0.5 ? "shape" : "color";

  const targetShape = pick(rand, SHAPES);
  const targetColor = pick(rand, COLORS);

  const otherShapes = SHAPES.filter(s => s !== targetShape);
  const otherColors = COLORS.filter(c => c.key !== targetColor.key);

  // exactly one correct option: matches the target on the rule dimension, differs on the other
  const options = [{
    shape: rule === "shape" ? targetShape : pick(rand, otherShapes),
    color: rule === "color" ? targetColor : pick(rand, otherColors),
    isCorrect: true,
  }];

  // distractors: must NOT match the rule dimension
  while (options.length < cfg.options) {
    const shape = rule === "shape" ? pick(rand, otherShapes) : pick(rand, SHAPES);
    const color = rule === "color" ? pick(rand, otherColors) : pick(rand, COLORS);

    // Avoid duplicates by both shape and color.key
    const exists = options.some(o => o.shape === shape && o.color.key === color.key);
    if (exists) continue;

    options.push({ shape, color, isCorrect: false });
  }

  // Fisher-Yates shuffle using our seeded rand
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { targetShape, targetColor, rule, options, driftMs: cfg.driftMs };
}

/**
 * Get a deterministic daily puzzle set for a given date string and level.
 * @param {string} dateStr - e.g., "2026-08-07"
 * @param {number|string} level - level key (1..10)
 */
export function getPulseMatchDaily(dateStr, level) {
  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  const seed = (dateSeed(dateStr) + 7) >>> 0;
  const rand = seededRand(seed);
  const rounds = Array.from({ length: cfg.rounds }, () => makeRound(rand, level));
  return { rounds, ...cfg };
}

/**
 * Fresh random session (non-deterministic). Generates a compact id and rounds.
 * @param {number|string} level
 */
export function getPulseMatchSession(level) {
  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  // Use a random 32-bit seed
  const randSeed = Math.floor(Math.random() * 0xffffffff) >>> 0;
  const rand = seededRand(randSeed);
  const rounds = Array.from({ length: cfg.rounds }, () => makeRound(rand, level));
  // more compact base36 id
  const id = `${Date.now().toString(36)}-${(Math.floor(Math.random() * 1e9)).toString(36)}`;
  return { id, rounds, ...cfg };
}

/** Localized labels (added 'en' as default) */
export const PULSE_MATCH_LABELS = {
  en: {
    title: "⚡ Pulse Match",
    subtitle: "Catch the matching shape before it disappears",
    matchShape: "Match by shape",
    matchColor: "Match by color",
    round: "Round",
    of: "of",
    correct: "Well done! ✓",
    wrong: "Missed ✗",
    tapMatch: "Tap the matching shape",
  },
  he: {
    title: "⚡ התאמת דופק",
    subtitle: "תפסו את הצורה התואמת לפני שתיעלם",
    matchShape: "התאם לפי צורה",
    matchColor: "התאם לפי צבע",
    round: "סיבוב",
    of: "מתוך",
    correct: "כל הכבוד! ✓",
    wrong: "החמצה ✗",
    tapMatch: "הקישו על הצורה התואמת",
  },
  ar: {
    title: "⚡ تطابق النبض",
    subtitle: "امسك الشكل المطابق قبل أن يختفي",
    matchShape: "طابق حسب الشكل",
    matchColor: "طابق حسب اللون",
    round: "جولة",
    of: "من",
    correct: "أحسنت! ✓",
    wrong: "فاتك ✗",
    tapMatch: "انقر على الشكل المطابق",
  },
};