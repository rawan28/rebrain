/**
 * Generates pattern-based logic puzzles with adaptive difficulty.
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shape sequences
function generateShapePattern(level) {
  const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⬛', '🔶'];
  const patternLength = Math.min(2 + Math.floor(level / 3), 5);
  const pattern = [];
  
  for (let i = 0; i < patternLength; i++) {
    pattern.push(shapes[i % shapes.length]);
  }

  const repeats = 2 + Math.floor(level / 4);
  const sequence = [];
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < pattern.length; i++) {
      sequence.push(pattern[i]);
    }
  }
  // Remove last element as the answer
  const answer = sequence.pop();
  
  const wrongOptions = shuffle(shapes.filter(s => s !== answer)).slice(0, 3);
  const options = shuffle([answer, ...wrongOptions]);

  return {
    type: 'pattern',
    question: 'What comes next in this pattern?',
    sequence,
    answer,
    options,
  };
}

// Number sequences
function generateNumberPattern(level) {
  const step = Math.floor(Math.random() * (level + 2)) + 1;
  const start = Math.floor(Math.random() * 10) + 1;
  const length = 4 + Math.min(Math.floor(level / 3), 3);
  
  let useMultiply = level >= 5 && Math.random() > 0.5;
  const sequence = [start];
  
  for (let i = 1; i < length; i++) {
    if (useMultiply) {
      sequence.push(sequence[i - 1] * 2);
    } else {
      sequence.push(sequence[i - 1] + step);
    }
  }

  const answer = sequence.pop();
  const wrongOptions = [answer + step, answer - step, answer + 1].filter(v => v !== answer && v > 0);
  while (wrongOptions.length < 3) {
    wrongOptions.push(answer + wrongOptions.length + 2);
  }
  const options = shuffle([answer, ...wrongOptions.slice(0, 3)]);

  return {
    type: 'number_pattern',
    question: 'What number comes next?',
    sequence: sequence.map(String),
    answer: String(answer),
    options: options.map(String),
  };
}

// Odd one out
function generateOddOneOut(level) {
  const groups = [
    { items: ['🍎', '🍊', '🍋', '🍇'], odd: '🚗', category: 'fruits' },
    { items: ['🐶', '🐱', '🐰', '🐻'], odd: '🌻', category: 'animals' },
    { items: ['🏠', '🏢', '🏫', '🏥'], odd: '🎵', category: 'buildings' },
    { items: ['✈️', '🚗', '🚂', '🚢'], odd: '🌸', category: 'transport' },
    { items: ['👕', '👗', '🧥', '👖'], odd: '🍕', category: 'clothing' },
  ];

  const group = groups[Math.floor(Math.random() * groups.length)];
  const count = Math.min(2 + Math.floor(level / 2), group.items.length);
  const items = shuffle(group.items).slice(0, count);
  items.push(group.odd);
  
  return {
    type: 'odd_one_out',
    question: 'Which one does NOT belong?',
    sequence: shuffle(items),
    answer: group.odd,
    options: shuffle(items),
  };
}

// Matrix / shape reasoning (2×2 grid)
function generateMatrixReasoning() {
  const matrices = [
    {
      grid: ['🔴', '🔵', '🔵', '?'],
      answer: '🔴',
      wrong: ['🟡', '🟢', '🟣'],
      hint: 'matrix',
    },
    {
      grid: ['⬛', '⬜', '⬜', '?'],
      answer: '⬛',
      wrong: ['🔷', '🔶', '⭐'],
      hint: 'matrix',
    },
    {
      grid: ['🔺', '🔻', '🔻', '?'],
      answer: '🔺',
      wrong: ['🔷', '🔸', '⬛'],
      hint: 'matrix',
    },
    {
      grid: ['🌑', '🌕', '🌕', '?'],
      answer: '🌑',
      wrong: ['🌙', '⭐', '☀️'],
      hint: 'matrix',
    },
    {
      grid: ['1️⃣', '2️⃣', '2️⃣', '?'],
      answer: '1️⃣',
      wrong: ['3️⃣', '4️⃣', '0️⃣'],
      hint: 'matrix',
    },
    {
      grid: ['🟩', '🟦', '🟦', '?'],
      answer: '🟩',
      wrong: ['🟨', '🟥', '🟪'],
      hint: 'matrix',
    },
    {
      grid: ['🐱', '🐶', '🐶', '?'],
      answer: '🐱',
      wrong: ['🐰', '🐻', '🐼'],
      hint: 'matrix',
    },
    {
      grid: ['🍎', '🍊', '🍊', '?'],
      answer: '🍎',
      wrong: ['🍇', '🍋', '🍓'],
      hint: 'matrix',
    },
  ];

  const item = matrices[Math.floor(Math.random() * matrices.length)];
  const options = shuffle([item.answer, ...item.wrong.slice(0, 3)]);
  return {
    type: 'matrix',
    question: 'matrix',
    sequence: item.grid,
    answer: item.answer,
    options,
  };
}

// IQ: Spatial/visual rotation — which shape completes the pattern
function generateSpatialIQ() {
  const sets = [
    { seq: ['🔺', '🔺🔺', '🔺🔺🔺'], answer: '🔺🔺🔺🔺', wrong: ['🔺🔺🔺🔺🔺', '🔻🔻🔻🔻', '🔺🔻🔺🔻'] },
    { seq: ['⬜', '⬜⬜', '⬜⬜⬜'], answer: '⬜⬜⬜⬜', wrong: ['⬛⬛⬛⬛', '⬜⬜⬜⬜⬜', '🟦🟦🟦🟦'] },
    { seq: ['🌑', '🌒', '🌓'], answer: '🌔', wrong: ['🌕', '🌙', '🌗'] },
    { seq: ['🌱', '🌿', '🌳'], answer: '🌲', wrong: ['🍀', '🌴', '🌾'] },
    { seq: ['🐣', '🐥', '🐔'], answer: '🦅', wrong: ['🐦', '🦜', '🦢'] },
    { seq: ['1️⃣', '1️⃣2️⃣', '1️⃣2️⃣3️⃣'], answer: '1️⃣2️⃣3️⃣4️⃣', wrong: ['4️⃣3️⃣2️⃣1️⃣', '1️⃣2️⃣3️⃣5️⃣', '2️⃣3️⃣4️⃣5️⃣'] },
    { seq: ['🔴', '🔴🟡', '🔴🟡🟢'], answer: '🔴🟡🟢🔵', wrong: ['🟡🟢🔵🟣', '🔴🟡🟢🟠', '🔵🟢🟡🔴'] },
  ];
  const item = sets[Math.floor(Math.random() * sets.length)];
  const options = shuffle([item.answer, ...item.wrong.slice(0, 3)]);
  return {
    type: 'spatial_iq',
    question: 'spatialIQ',
    sequence: item.seq,
    answer: item.answer,
    options,
  };
}

// IQ: Which figure is different (visual odd-one-out with shapes)
function generateVisualIQ() {
  const sets = [
    { items: ['🔵', '🔵', '🔵', '🔴'], answer: '🔴' },
    { items: ['🟦', '🟦', '🟥', '🟦'], answer: '🟥' },
    { items: ['⭐', '⭐', '⭐', '🌟'], answer: '🌟' },
    { items: ['🐶', '🐶', '🐱', '🐶'], answer: '🐱' },
    { items: ['🍎', '🍎', '🍊', '🍎'], answer: '🍊' },
    { items: ['🔺', '🔺', '🔺', '🔻'], answer: '🔻' },
    { items: ['🏠', '🏠', '🏢', '🏠'], answer: '🏢' },
    { items: ['🎵', '🎵', '🎶', '🎵'], answer: '🎶' },
    { items: ['🌍', '🌎', '🌍', '🌍'], answer: '🌎' },
    { items: ['🚗', '🚗', '🚌', '🚗'], answer: '🚌' },
  ];
  const item = sets[Math.floor(Math.random() * sets.length)];
  const shuffled = shuffle([...item.items]);
  // wrong options: other items from the set that aren't the answer
  const wrong = shuffle(['🟩', '🟫', '🔷', '🔸', '💠', '🔹'].filter(x => x !== item.answer)).slice(0, 3);
  const options = shuffle([item.answer, ...wrong]);
  return {
    type: 'visual_iq',
    question: 'visualIQ',
    sequence: shuffled,
    answer: item.answer,
    options,
  };
}

// IQ: Number series with mixed operations
function generateNumberSeriesIQ(level) {
  const series = [
    { seq: [2, 4, 8, 16], answer: 32, rule: '×2' },
    { seq: [1, 4, 9, 16], answer: 25, rule: 'n²' },
    { seq: [1, 1, 2, 3, 5], answer: 8, rule: 'fib' },
    { seq: [3, 6, 12, 24], answer: 48, rule: '×2' },
    { seq: [100, 81, 64, 49], answer: 36, rule: 'n²↓' },
    { seq: [5, 10, 20, 40], answer: 80, rule: '×2' },
    { seq: [1, 2, 4, 7, 11], answer: 16, rule: '+1+2+3…' },
    { seq: [2, 3, 5, 8, 13], answer: 21, rule: 'fib-like' },
    { seq: [10, 9, 7, 4], answer: 0, rule: '-1-2-3…' },
    { seq: [3, 9, 27, 81], answer: 243, rule: '×3' },
  ];

  const available = level <= 3 ? series.slice(0, 5) : series;
  const item = available[Math.floor(Math.random() * available.length)];
  const ans = item.answer;
  const wrong = [ans + 1, ans - 1, ans * 2].filter(v => v !== ans && v >= 0);
  while (wrong.length < 3) wrong.push(ans + wrong.length + 3);
  const options = shuffle([String(ans), ...wrong.slice(0, 3).map(String)]);
  return {
    type: 'number_series_iq',
    question: 'numberSeriesIQ',
    sequence: item.seq.map(String),
    answer: String(ans),
    options,
  };
}

// Number analogy: A:B :: C:?
function generateNumberAnalogy(level) {
  const pairs = [
    { a: 2, b: 4, c: 5, answer: 10, op: '×2' },
    { a: 10, b: 5, c: 8, answer: 4, op: '÷2' },
    { a: 3, b: 9, c: 4, answer: 16, op: '²' },
    { a: 6, b: 3, c: 10, answer: 5, op: '÷2' },
    { a: 1, b: 3, c: 2, answer: 6, op: '×3' },
    { a: 5, b: 25, c: 3, answer: 9, op: '²' },
    { a: 4, b: 8, c: 7, answer: 14, op: '×2' },
    { a: 100, b: 10, c: 81, answer: 9, op: '√' },
    { a: 2, b: 6, c: 3, answer: 9, op: '×3' },
    { a: 15, b: 3, c: 20, answer: 4, op: '÷5' },
  ];

  const item = pairs[Math.min(Math.floor(Math.random() * Math.min(pairs.length, 4 + level)), pairs.length - 1)];
  const wrong = [item.answer + 1, item.answer - 1, item.answer + 3].filter(v => v !== item.answer && v > 0);
  const options = shuffle([String(item.answer), ...wrong.slice(0, 3).map(String)]);
  return {
    type: 'number_analogy',
    question: 'numberAnalogy',
    sequence: [String(item.a), String(item.b), String(item.c)],
    answer: String(item.answer),
    options,
  };
}

export function generatePuzzle(level) {
  // All generators pool, weighted by level
  const basic = [generateShapePattern, generateNumberPattern, generateOddOneOut];
  const psychometric = [generateMatrixReasoning, generateNumberAnalogy];
  const iq = [generateSpatialIQ, generateVisualIQ, () => generateNumberSeriesIQ(level)];

  // At low levels use basic only; at higher levels mix in psychometric and IQ
  let pool;
  if (level <= 2) {
    pool = basic;
  } else if (level <= 5) {
    pool = [...basic, ...psychometric, ...iq];
  } else {
    pool = [...basic, ...psychometric, ...iq, ...iq]; // weight IQ higher at advanced levels
  }

  const gen = pool[Math.floor(Math.random() * pool.length)];
  return gen(level);
}