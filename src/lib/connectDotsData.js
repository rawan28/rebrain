// Procedural generator for the "Connect the Dots" game.
// Produces a grid with numbered dots placed along a randomized Hamiltonian path
// (backbite algorithm, with a snake fallback), so every puzzle is solvable but
// unpredictable: draw one continuous line that fills every cell and passes through
// the dots in ascending order.

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

// Randomized Hamiltonian path via the backbite (Pósa rotation) algorithm.
// Produces unpredictable paths so dots land in non-snake positions that force planning.
function randomHamiltonianPath(rows, cols) {
  const total = rows * cols;
  const maxIter = total * total * 10;
  const k = (r, c) => r * cols + c;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  let path = [{ r: Math.floor(Math.random() * rows), c: Math.floor(Math.random() * cols) }];
  const index = new Map();
  index.set(k(path[0].r, path[0].c), 0);

  const rebuildIndex = () => {
    index.clear();
    for (let i = 0; i < path.length; i++) index.set(k(path[i].r, path[i].c), i);
  };

  for (let iter = 0; iter < maxIter && path.length < total; iter++) {
    const useHead = Math.random() < 0.5;
    const end = useHead ? path[0] : path[path.length - 1];

    const nbrs = [];
    for (const [dr, dc] of dirs) {
      const nr = end.r + dr, nc = end.c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) nbrs.push({ r: nr, c: nc });
    }
    const u = nbrs[Math.floor(Math.random() * nbrs.length)];
    const uKey = k(u.r, u.c);

    if (!index.has(uKey)) {
      // extend the path at the chosen endpoint
      if (useHead) { path.unshift(u); rebuildIndex(); }
      else { index.set(uKey, path.length); path.push(u); }
    } else {
      const i = index.get(uKey);
      if (useHead) {
        // reverse prefix [0..i-1]; new edge v0~vi is valid (u is a neighbor of v0)
        let lo = 0, hi = i - 1;
        while (lo < hi) { [path[lo], path[hi]] = [path[hi], path[lo]]; lo++; hi--; }
      } else {
        // reverse suffix [i+1..end]; new edge vi~vk is valid (u is a neighbor of vk)
        let lo = i + 1, hi = path.length - 1;
        while (lo < hi) { [path[lo], path[hi]] = [path[hi], path[lo]]; lo++; hi--; }
      }
      rebuildIndex();
    }
  }

  return path.length === total ? path : null;
}

export function generatePuzzle(level) {
  const numCount = Math.min(2 + level, 12);
  const [rows, cols] = gridForCount(numCount);
  const solutionPath = randomHamiltonianPath(rows, cols) || snakePath(rows, cols, Math.floor(Math.random() * 4));
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