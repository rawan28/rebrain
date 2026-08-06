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
    if (options.some(o => o.shape === shape && o.color.key === color.key)) continue;
    options.push({ shape, color, isCorrect: false });
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

// Fresh random session for the standalone page
export function getPulseMatchSession(level) {
  const cfg = pulseMatchConfig[level] || pulseMatchConfig[1];
  const rand = seededRand(Math.floor(Math.random() * 1e9) + 1);
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