export const PULSE_MATCH = "pulse_match";

export const SHAPES = ["circle", "square", "triangle", "star", "diamond", "hexagon"];

export const COLORS = [
  { key: "red",    css: "#dc2626" },
  { key: "blue",   css: "#2563eb" },
  { key: "green",  css: "#16a34a" },
  { key: "yellow", css: "#ca8a04" },
  { key: "purple", css: "#9333ea" },
  { key: "teal",   css: "#0d9488" },
];

export const pulseMatchConfig = {
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
};

function seededRand(seed) {
  let s = Math.abs(seed) || 1;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function dateSeed(dateStr) {
  return dateStr.replace(/-/g, "").split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 7), 0);
}

function pick(rand, arr) { return arr[Math.floor(rand() * arr.length)]; }

function makeRound(rand, level) {
  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  const rule = rand() < 0.5 ? "shape" : "color";

  const targetShape = pick(rand, SHAPES);
  const targetColor = pick(rand, COLORS);

  // Build options: one correct (matches by rule), rest are distractors
  const options = [];
  const usedKeys = new Set();

  // correct option
  const correctShape = rule === "shape" ? targetShape : pick(rand, SHAPES.filter(s => s !== targetShape));
  const correctColor = rule === "color" ? targetColor : pick(rand, COLORS.filter(c => c.key !== targetColor.key));
  options.push({ shape: correctShape, color: correctColor, isCorrect: true });
  usedKeys.add(correctShape + correctColor.key);

  // distractors
  while (options.length < cfg.options) {
    let shape, color, key;
    let attempts = 0;
    do {
      shape = pick(rand, SHAPES);
      color = pick(rand, COLORS);
      key = shape + color.key;
      attempts++;
    } while (usedKeys.has(key) && attempts < 20);
    usedKeys.add(key);
    // ensure distractor doesn't accidentally match the rule
    const matchesRule = rule === "shape" ? shape === targetShape : color.key === targetColor.key;
    options.push({ shape, color, isCorrect: false });
    if (matchesRule) options[options.length - 1].isCorrect = true;
  }

  // shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { targetShape, targetColor, rule, options, driftMs: cfg.driftMs };
}

export function getPulseMatchDaily(dateStr, level) {
  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  const rand = seededRand(dateSeed(dateStr) + 7);
  const rounds = Array.from({ length: cfg.rounds }, () => makeRound(rand, level));
  return { rounds, ...cfg };
}

export const PULSE_MATCH_LABELS = {
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