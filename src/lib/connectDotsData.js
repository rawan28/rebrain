// Procedural generator for the "Connect the Dots" game.
// Produces a grid with numbered dots placed along a valid Hamiltonian (snake) path,
// so every puzzle is solvable: draw one continuous line that fills every cell and
// passes through the dots in ascending order.

export function gridForCount(n) {
  const map = {
    3: [3, 3], 4: [4, 4], 5: [4, 5], 6: [5, 6],
    7: [6, 6], 8: [6, 7], 9: [7, 7], 10: [7, 8],
    11: [8, 8], 12: [8, 9],
  };
  return map[n] || [8, 9];
}

function snakePath(rows, cols, variant) {
  const path = [];
  if (variant % 2 === 0) {
    const leftToRight = variant === 0;
    for (let r = 0; r < rows; r++) {
      const goRight = (r % 2 === 0) === leftToRight;
      if (goRight) for (let c = 0; c < cols; c++) path.push({ r, c });
      else for (let c = cols - 1; c >= 0; c--) path.push({ r, c });
    }
  } else {
    const topToBottom = variant === 1;
    for (let c = 0; c < cols; c++) {
      const goDown = (c % 2 === 0) === topToBottom;
      if (goDown) for (let r = 0; r < rows; r++) path.push({ r, c });
      else for (let r = rows - 1; r >= 0; r--) path.push({ r, c });
    }
  }
  return path;
}

export function generatePuzzle(level) {
  const numCount = Math.min(2 + level, 12);
  const [rows, cols] = gridForCount(numCount);
  const variant = Math.floor(Math.random() * 4);
  const solutionPath = snakePath(rows, cols, variant);
  const dots = [];
  for (let i = 0; i < numCount; i++) {
    const idx = Math.round((i * (solutionPath.length - 1)) / (numCount - 1));
    const cell = solutionPath[idx];
    dots.push({ r: cell.r, c: cell.c, num: i + 1 });
  }
  return { rows, cols, dots, solutionPath, numCount };
}

export function validatePath(path, dots, rows, cols) {
  if (path.length !== rows * cols) return false;
  const seen = new Set();
  for (const p of path) {
    const k = p.r * cols + p.c;
    if (seen.has(k)) return false;
    seen.add(k);
  }
  for (let i = 1; i < path.length; i++) {
    if (Math.abs(path[i].r - path[i - 1].r) + Math.abs(path[i].c - path[i - 1].c) !== 1) return false;
  }
  const positions = dots.map(d => path.findIndex(p => p.r === d.r && p.c === d.c));
  if (positions.some(p => p < 0)) return false;
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] <= positions[i - 1]) return false;
  }
  return true;
}