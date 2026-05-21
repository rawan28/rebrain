// Raven's Progressive Matrices — SVG-based 3×3 grid puzzles
// Each puzzle defines a 3×3 grid of cells (row-major), the last cell is the answer.
// Each cell is described as an array of shape descriptors rendered as SVG.

// Shape descriptor: { shape, x, y, size, fill, stroke, rotation }
// shapes: 'circle', 'rect', 'triangle', 'cross', 'diamond', 'line-h', 'line-v', 'line-d1', 'line-d2'

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Render a cell's shapes to an SVG string (50x50 viewBox)
function cellToSVG(shapes) {
  const parts = shapes.map(s => {
    const { shape, x = 25, y = 25, size = 14, fill = 'none', stroke = '#1e293b', strokeWidth = 2, rotation = 0 } = s;
    const transform = rotation ? `rotate(${rotation} ${x} ${y})` : '';
    switch (shape) {
      case 'circle':
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="${transform}"/>`;
      case 'rect':
        return `<rect x="${x - size}" y="${y - size}" width="${size * 2}" height="${size * 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="${transform}"/>`;
      case 'triangle':
        return `<polygon points="${x},${y - size} ${x + size},${y + size} ${x - size},${y + size}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="${transform}"/>`;
      case 'diamond':
        return `<polygon points="${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="${transform}"/>`;
      case 'cross':
        return `<line x1="${x - size}" y1="${y}" x2="${x + size}" y2="${y}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                <line x1="${x}" y1="${y - size}" x2="${x}" y2="${y + size}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      case 'line-h':
        return `<line x1="${x - size}" y1="${y}" x2="${x + size}" y2="${y}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      case 'line-v':
        return `<line x1="${x}" y1="${y - size}" x2="${x}" y2="${y + size}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      case 'line-d1':
        return `<line x1="${x - size}" y1="${y - size}" x2="${x + size}" y2="${y + size}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      case 'line-d2':
        return `<line x1="${x + size}" y1="${y - size}" x2="${x - size}" y2="${y + size}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      case 'dot':
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="${stroke}" stroke="none"/>`;
      default:
        return '';
    }
  });
  return `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
}

// ── Puzzle definitions ──────────────────────────────────────────────────────
// grid: 9 cells in row-major order. Last cell = answer.
// distractors: 3 wrong cells.

const PUZZLES = [
  // 1. Shape rotates 90° clockwise across each row: triangle → right → down → left
  {
    id: 'rotation_triangle',
    rule: 'Triangle rotates 90° clockwise each step',
    grid: [
      [{ shape: 'triangle', rotation: 0 }],
      [{ shape: 'triangle', rotation: 90 }],
      [{ shape: 'triangle', rotation: 180 }],
      [{ shape: 'triangle', rotation: 90 }],
      [{ shape: 'triangle', rotation: 180 }],
      [{ shape: 'triangle', rotation: 270 }],
      [{ shape: 'triangle', rotation: 180 }],
      [{ shape: 'triangle', rotation: 270 }],
      [{ shape: 'triangle', rotation: 0 }],
    ],
    distractors: [
      [{ shape: 'triangle', rotation: 90 }],
      [{ shape: 'triangle', rotation: 180 }],
      [{ shape: 'circle' }],
    ],
  },

  // 2. Count increases across row: 1 → 2 → 3 dots
  {
    id: 'count_dots',
    rule: 'Number of dots increases by 1 across each row',
    grid: [
      [{ shape: 'dot', x: 25, y: 25, size: 5 }],
      [{ shape: 'dot', x: 18, y: 25, size: 5 }, { shape: 'dot', x: 32, y: 25, size: 5 }],
      [{ shape: 'dot', x: 15, y: 25, size: 5 }, { shape: 'dot', x: 25, y: 25, size: 5 }, { shape: 'dot', x: 35, y: 25, size: 5 }],
      [{ shape: 'dot', x: 25, y: 25, size: 5 }],
      [{ shape: 'dot', x: 18, y: 25, size: 5 }, { shape: 'dot', x: 32, y: 25, size: 5 }],
      [{ shape: 'dot', x: 15, y: 25, size: 5 }, { shape: 'dot', x: 25, y: 25, size: 5 }, { shape: 'dot', x: 35, y: 25, size: 5 }],
      [{ shape: 'dot', x: 25, y: 25, size: 5 }],
      [{ shape: 'dot', x: 18, y: 25, size: 5 }, { shape: 'dot', x: 32, y: 25, size: 5 }],
      [{ shape: 'dot', x: 15, y: 25, size: 5 }, { shape: 'dot', x: 25, y: 25, size: 5 }, { shape: 'dot', x: 35, y: 25, size: 5 }],
    ],
    distractors: [
      [{ shape: 'dot', x: 25, y: 25, size: 5 }],
      [{ shape: 'dot', x: 18, y: 25, size: 5 }, { shape: 'dot', x: 32, y: 25, size: 5 }, { shape: 'dot', x: 25, y: 15, size: 5 }, { shape: 'dot', x: 25, y: 35, size: 5 }],
      [{ shape: 'dot', x: 15, y: 15, size: 5 }, { shape: 'dot', x: 35, y: 35, size: 5 }],
    ],
  },

  // 3. Fill: empty → half (stroke) → solid, cycling per row
  {
    id: 'fill_progression',
    rule: 'Fill progresses: empty → outline → filled',
    grid: [
      [{ shape: 'circle', fill: 'none' }],
      [{ shape: 'circle', fill: '#94a3b8' }],
      [{ shape: 'circle', fill: '#1e293b' }],
      [{ shape: 'circle', fill: 'none' }],
      [{ shape: 'circle', fill: '#94a3b8' }],
      [{ shape: 'circle', fill: '#1e293b' }],
      [{ shape: 'circle', fill: 'none' }],
      [{ shape: 'circle', fill: '#94a3b8' }],
      [{ shape: 'circle', fill: '#1e293b' }],
    ],
    distractors: [
      [{ shape: 'circle', fill: 'none' }],
      [{ shape: 'circle', fill: '#94a3b8' }],
      [{ shape: 'rect', fill: '#1e293b' }],
    ],
  },

  // 4. Size grows across each row: small → medium → large
  {
    id: 'size_growth',
    rule: 'Shape grows larger across each row',
    grid: [
      [{ shape: 'rect', size: 7 }],
      [{ shape: 'rect', size: 12 }],
      [{ shape: 'rect', size: 18 }],
      [{ shape: 'diamond', size: 7 }],
      [{ shape: 'diamond', size: 12 }],
      [{ shape: 'diamond', size: 18 }],
      [{ shape: 'circle', size: 7 }],
      [{ shape: 'circle', size: 12 }],
      [{ shape: 'circle', size: 18 }],
    ],
    distractors: [
      [{ shape: 'circle', size: 7 }],
      [{ shape: 'circle', size: 12 }],
      [{ shape: 'circle', size: 22 }],
    ],
  },

  // 5. Lines: each row adds a line direction
  {
    id: 'lines_adding',
    rule: 'Each row adds one more line inside the shape',
    grid: [
      [{ shape: 'circle' }],
      [{ shape: 'circle' }, { shape: 'line-h' }],
      [{ shape: 'circle' }, { shape: 'line-h' }, { shape: 'line-v' }],
      [{ shape: 'rect' }],
      [{ shape: 'rect' }, { shape: 'line-h' }],
      [{ shape: 'rect' }, { shape: 'line-h' }, { shape: 'line-v' }],
      [{ shape: 'diamond' }],
      [{ shape: 'diamond' }, { shape: 'line-h' }],
      [{ shape: 'diamond' }, { shape: 'line-h' }, { shape: 'line-v' }],
    ],
    distractors: [
      [{ shape: 'diamond' }],
      [{ shape: 'diamond' }, { shape: 'line-d1' }],
      [{ shape: 'circle' }, { shape: 'line-h' }, { shape: 'line-v' }],
    ],
  },

  // 6. Shape changes each row: circle → square → triangle (column pattern)
  {
    id: 'shape_sequence',
    rule: 'Each column has a different shape; each row repeats the same fill',
    grid: [
      [{ shape: 'circle', fill: 'none' }],
      [{ shape: 'rect', fill: 'none' }],
      [{ shape: 'triangle', fill: 'none' }],
      [{ shape: 'circle', fill: '#94a3b8' }],
      [{ shape: 'rect', fill: '#94a3b8' }],
      [{ shape: 'triangle', fill: '#94a3b8' }],
      [{ shape: 'circle', fill: '#1e293b' }],
      [{ shape: 'rect', fill: '#1e293b' }],
      [{ shape: 'triangle', fill: '#1e293b' }],
    ],
    distractors: [
      [{ shape: 'circle', fill: '#1e293b' }],
      [{ shape: 'rect', fill: '#94a3b8' }],
      [{ shape: 'triangle', fill: 'none' }],
    ],
  },

  // 7. Diagonal cross: shape appears on diagonal, rest empty
  {
    id: 'diagonal_pattern',
    rule: 'The filled shape moves along the diagonal',
    grid: [
      [{ shape: 'dot', size: 8 }],
      [{ shape: 'cross' }],
      [{ shape: 'cross' }],
      [{ shape: 'cross' }],
      [{ shape: 'dot', size: 8 }],
      [{ shape: 'cross' }],
      [{ shape: 'cross' }],
      [{ shape: 'cross' }],
      [{ shape: 'dot', size: 8 }],
    ],
    distractors: [
      [{ shape: 'cross' }],
      [{ shape: 'diamond' }],
      [{ shape: 'dot', size: 4 }],
    ],
  },

  // 8. Rotation of diamond: 0 → 45 → 90 across row
  {
    id: 'diamond_rotation',
    rule: 'Diamond rotates 45° each step',
    grid: [
      [{ shape: 'diamond', rotation: 0 }],
      [{ shape: 'rect', rotation: 45 }],
      [{ shape: 'diamond', rotation: 0 }],
      [{ shape: 'diamond', rotation: 45 }],
      [{ shape: 'diamond', rotation: 0 }],
      [{ shape: 'rect', rotation: 45 }],
      [{ shape: 'rect', rotation: 45 }],
      [{ shape: 'diamond', rotation: 45 }],
      [{ shape: 'diamond', rotation: 0 }],
    ],
    distractors: [
      [{ shape: 'diamond', rotation: 45 }],
      [{ shape: 'rect', rotation: 0 }],
      [{ shape: 'triangle', rotation: 0 }],
    ],
  },

  // 9. Count of shapes increases down each column
  {
    id: 'count_column',
    rule: 'Shapes increase down each column: row1=1, row2=2, row3=3',
    grid: [
      [{ shape: 'circle', x: 25, y: 25, size: 7 }],
      [{ shape: 'rect', x: 25, y: 25, size: 7 }],
      [{ shape: 'triangle', x: 25, y: 25, size: 9 }],
      [{ shape: 'circle', x: 18, y: 25, size: 7 }, { shape: 'circle', x: 32, y: 25, size: 7 }],
      [{ shape: 'rect', x: 18, y: 25, size: 7 }, { shape: 'rect', x: 32, y: 25, size: 7 }],
      [{ shape: 'triangle', x: 18, y: 25, size: 9 }, { shape: 'triangle', x: 32, y: 25, size: 9 }],
      [{ shape: 'circle', x: 15, y: 25, size: 7 }, { shape: 'circle', x: 25, y: 25, size: 7 }, { shape: 'circle', x: 35, y: 25, size: 7 }],
      [{ shape: 'rect', x: 15, y: 25, size: 7 }, { shape: 'rect', x: 25, y: 25, size: 7 }, { shape: 'rect', x: 35, y: 25, size: 7 }],
      [{ shape: 'triangle', x: 15, y: 25, size: 9 }, { shape: 'triangle', x: 25, y: 25, size: 9 }, { shape: 'triangle', x: 35, y: 25, size: 9 }],
    ],
    distractors: [
      [{ shape: 'triangle', x: 18, y: 25, size: 9 }, { shape: 'triangle', x: 32, y: 25, size: 9 }],
      [{ shape: 'circle', x: 15, y: 25, size: 7 }, { shape: 'circle', x: 25, y: 25, size: 7 }, { shape: 'circle', x: 35, y: 25, size: 7 }],
      [{ shape: 'triangle', x: 25, y: 25, size: 9 }],
    ],
  },

  // 10. Outer + inner shape pattern: row1 = big outer, row2 = small inner, row3 = both
  {
    id: 'outer_inner',
    rule: 'Pattern: outer shape → inner shape → both together',
    grid: [
      [{ shape: 'circle', size: 18 }],
      [{ shape: 'dot', size: 5 }],
      [{ shape: 'circle', size: 18 }, { shape: 'dot', size: 5 }],
      [{ shape: 'rect', size: 18 }],
      [{ shape: 'cross' }],
      [{ shape: 'rect', size: 18 }, { shape: 'cross' }],
      [{ shape: 'diamond', size: 18 }],
      [{ shape: 'line-d1' }, { shape: 'line-d2' }],
      [{ shape: 'diamond', size: 18 }, { shape: 'line-d1' }, { shape: 'line-d2' }],
    ],
    distractors: [
      [{ shape: 'diamond', size: 18 }],
      [{ shape: 'line-d1' }, { shape: 'line-d2' }],
      [{ shape: 'circle', size: 18 }, { shape: 'line-d1' }, { shape: 'line-d2' }],
    ],
  },
];

/**
 * Generate a Raven's matrix puzzle.
 * Returns { type, grid (8 cells as SVG strings), options (4 SVG strings), answer (SVG string), answerIndex }
 */
export function generateRavenPuzzle(level = 1) {
  // Higher levels = harder puzzles (higher index)
  const maxIdx = Math.min(Math.floor(level * PUZZLES.length / 10) + 3, PUZZLES.length - 1);
  const minIdx = Math.max(0, maxIdx - 4);
  const pool = PUZZLES.slice(minIdx, maxIdx + 1);
  const puzzle = pool[Math.floor(Math.random() * pool.length)];

  const answerShapes = puzzle.grid[8];
  const answerSVG = cellToSVG(answerShapes);

  const distractorSVGs = puzzle.distractors.map(d => cellToSVG(d));
  const wrongOptions = shuffle(distractorSVGs).slice(0, 3);

  const answerIndex = Math.floor(Math.random() * 4);
  const options = [...wrongOptions];
  options.splice(answerIndex, 0, answerSVG);

  return {
    type: 'raven_matrix',
    rule: puzzle.rule,
    grid: puzzle.grid.slice(0, 8).map(cellToSVG),
    options,
    answer: answerSVG,
    answerIndex,
  };
}