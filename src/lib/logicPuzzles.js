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

export function generatePuzzle(level) {
  const generators = [generateShapePattern, generateNumberPattern, generateOddOneOut];
  
  // Weight towards harder types at higher levels
  if (level <= 3) {
    return generators[Math.floor(Math.random() * 2)](level);
  }
  
  const gen = generators[Math.floor(Math.random() * generators.length)];
  return gen(level);
}