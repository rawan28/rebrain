// Psychometric-style shape series generator.
// Each item: { shape, rotation (0/45/.../315), flip (bool), dots (0-3), color }.
// A rule is a list of step-transformers applied each step (rotation, flip, dot, color).
// The user sees 4 items of the sequence + "?" and picks the 5th from 4 options.

const SHAPES = ['arrow', 'triangle', 'pacman', 'L'];
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2'];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];
function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pickN = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

const makeItem = (p) => ({ shape: 'arrow', rotation: 0, flip: false, dots: 0, color: '#2563eb', ...p });

const rot = (deg) => (it) => ({ ...it, rotation: (((it.rotation + deg) % 360) + 360) % 360 });
const flipT = (it) => ({ ...it, flip: !it.flip });
const dotT = (it) => ({ ...it, dots: (it.dots + 1) % 4 });
const colorT = (palette) => (it) => ({ ...it, color: palette[(palette.indexOf(it.color) + 1) % palette.length] });

function applySteps(base, transformers, n) {
  const seq = [base];
  for (let i = 0; i < n; i++) {
    let cur = seq[seq.length - 1];
    for (const tr of transformers) cur = tr(cur);
    seq.push(cur);
  }
  return seq;
}

const itemKey = (it) => `${it.shape}|${it.rotation}|${it.flip}|${it.dots}|${it.color}`;

export function generateSeries(level) {
  const rng = seededRandom(Date.now() + level * 7919 + Math.floor(Math.random() * 9973));
  const shape = pick(SHAPES, rng);
  const baseColor = pick(COLORS, rng);
  const base = makeItem({ shape, color: baseColor });

  const transformers = [];
  const palette = [baseColor];

  if (level <= 4) {
    transformers.push(rot(rng() < 0.5 ? 90 : 270));
  } else if (level <= 8) {
    const r = rng();
    if (r < 0.45) transformers.push(rot(rng() < 0.5 ? 90 : 270));
    else if (r < 0.75) transformers.push(rot(45));
    else transformers.push(flipT);
  } else if (level <= 12) {
    transformers.push(rot(rng() < 0.5 ? 90 : 270));
    transformers.push(rng() < 0.5 ? dotT : flipT);
  } else {
    const extra = pickN(COLORS.filter((c) => c !== baseColor), 2, rng);
    palette.push(...extra);
    transformers.push(rot(45));
    transformers.push(rng() < 0.5 ? dotT : colorT(palette));
  }

  const visibleCount = 4;
  const sequence = applySteps(base, transformers, visibleCount); // 5 items
  const answer = sequence[visibleCount];
  const shown = sequence.slice(0, visibleCount);

  // Plausible distractors: one step off, flipped, or dot-shifted
  const distractors = [];
  const used = new Set([itemKey(answer)]);
  const candidates = [rot(90)(answer), rot(270)(answer), rot(45)(answer), flipT(answer), dotT(answer)];
  for (const c of candidates) {
    if (distractors.length >= 3) break;
    const k = itemKey(c);
    if (!used.has(k)) { used.add(k); distractors.push(c); }
  }
  let safety = 0;
  while (distractors.length < 3 && safety < 40) {
    safety++;
    const c = makeItem({
      shape,
      color: baseColor,
      rotation: Math.floor(rng() * 8) * 45,
      flip: rng() < 0.3,
      dots: Math.floor(rng() * 4),
    });
    const k = itemKey(c);
    if (!used.has(k)) { used.add(k); distractors.push(c); }
  }

  const options = shuffle([answer, ...distractors], rng);
  const correctIndex = options.findIndex((o) => itemKey(o) === itemKey(answer));
  return { shown, answer, options, correctIndex };
}