// miniSudokuData.js — 6×6 Sudoku puzzle generation & validation
// Blocks are 2 rows × 3 columns (3 block-rows × 2 block-cols = 6 blocks total)
// Numbers: 1–6. No repeats in any row, column, or block.

const SIZE = 6;
const BLOCK_ROWS = 2;
const BLOCK_COLS = 3;
const BLOCK_ROW_COUNT = 3;
const BLOCK_COL_COUNT = 2;

const BASE_SOLUTION = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 1, 5, 6, 4],
  [5, 6, 4, 2, 3, 1],
  [3, 1, 2, 6, 4, 5],
  [6, 4, 5, 3, 1, 2],
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function transformSolution(base) {
  let grid = base.map(row => [...row]);

  // 1. Permute digits
  const digitPerm = shuffleArray([1, 2, 3, 4, 5, 6]);
  const digitMap = [0, ...digitPerm];
  grid = grid.map(row => row.map(v => digitMap[v]));

  // 2. Swap rows within each band
  for (let b = 0; b < BLOCK_ROW_COUNT; b++) {
    if (Math.random() < 0.5) {
      const r0 = b * BLOCK_ROWS;
      [grid[r0], grid[r0 + 1]] = [grid[r0 + 1], grid[r0]];
    }
  }

  // 3. Reorder bands
  const bandOrder = shuffleArray([0, 1, 2]);
  const afterBands = [];
  for (const b of bandOrder) {
    afterBands.push(grid[b * BLOCK_ROWS]);
    afterBands.push(grid[b * BLOCK_ROWS + 1]);
  }
  grid = afterBands;

  // 4. Swap columns within each stack
  for (let s = 0; s < BLOCK_COL_COUNT; s++) {
    const colPerm = shuffleArray([0, 1, 2]);
    grid = grid.map(row => {
      const newRow = [...row];
      const base_c = s * BLOCK_COLS;
      const orig = [row[base_c], row[base_c + 1], row[base_c + 2]];
      newRow[base_c] = orig[colPerm[0]];
      newRow[base_c + 1] = orig[colPerm[1]];
      newRow[base_c + 2] = orig[colPerm[2]];
      return newRow;
    });
  }

  // 5. Swap stacks
  if (Math.random() < 0.5) {
    grid = grid.map(row => [...row.slice(BLOCK_COLS), ...row.slice(0, BLOCK_COLS)]);
  }

  return grid;
}

function removeCells(solution, removeCount) {
  const puzzle = solution.map(row => [...row]);
  const positions = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      positions.push([r, c]);
    }
  }
  const shuffled = shuffleArray(positions);
  for (let i = 0; i < removeCount && i < shuffled.length; i++) {
    const [r, c] = shuffled[i];
    puzzle[r][c] = 0;
  }
  return puzzle;
}

export const DIFFICULTY = {
  easy:   { removeCount: 14, label: { he: 'קל', ar: 'سهل' }, level: 1 },
  medium: { removeCount: 20, label: { he: 'בינוני', ar: 'متوسط' }, level: 2 },
  hard:   { removeCount: 26, label: { he: 'קשה', ar: 'صعب' }, level: 3 },
};

export function generatePuzzle(difficulty) {
  const solution = transformSolution(BASE_SOLUTION);
  const config = DIFFICULTY[difficulty] || DIFFICULTY.medium;
  const puzzle = removeCells(solution, config.removeCount);
  return { puzzle, solution, level: config.level };
}

export function getConflicts(grid) {
  const conflicts = new Set();

  // Rows
  for (let r = 0; r < SIZE; r++) {
    const seen = {};
    for (let c = 0; c < SIZE; c++) {
      const val = grid[r][c];
      if (val === 0) continue;
      if (seen[val] !== undefined) {
        conflicts.add(`${r},${seen[val]}`);
        conflicts.add(`${r},${c}`);
      }
      seen[val] = c;
    }
  }

  // Columns
  for (let c = 0; c < SIZE; c++) {
    const seen = {};
    for (let r = 0; r < SIZE; r++) {
      const val = grid[r][c];
      if (val === 0) continue;
      if (seen[val] !== undefined) {
        conflicts.add(`${seen[val]},${c}`);
        conflicts.add(`${r},${c}`);
      }
      seen[val] = r;
    }
  }

  // Blocks
  for (let br = 0; br < BLOCK_ROW_COUNT; br++) {
    for (let bc = 0; bc < BLOCK_COL_COUNT; bc++) {
      const seen = {};
      for (let r = br * BLOCK_ROWS; r < br * BLOCK_ROWS + BLOCK_ROWS; r++) {
        for (let c = bc * BLOCK_COLS; c < bc * BLOCK_COLS + BLOCK_COLS; c++) {
          const val = grid[r][c];
          if (val === 0) continue;
          if (seen[val]) {
            conflicts.add(seen[val]);
            conflicts.add(`${r},${c}`);
          }
          seen[val] = `${r},${c}`;
        }
      }
    }
  }

  return conflicts;
}

export function isComplete(grid) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  return getConflicts(grid).size === 0;
}