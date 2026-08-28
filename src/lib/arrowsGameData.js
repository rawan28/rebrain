// Procedural generator for the "Arrows" game.
// Arrows sit on a grid, each pointing in a direction. An arrow can be released
// (it flies off the board) only if its straight path to the edge is clear of
// other arrows. Puzzles are generated so they are always solvable: arrows are
// placed in reverse release order, each one's path avoiding already-placed
// (later-released) arrows. Releasing any releasable arrow only ever unblocks
// others, so the player can never get stuck.

const DIRS = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
};
const DIR_KEYS = Object.keys(DIRS);

function pathCells(r, c, dir, rows, cols) {
  const { dr, dc } = DIRS[dir];
  const cells = [];
  let nr = r + dr;
  let nc = c + dc;
  while (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
    cells.push({ r: nr, c: nc });
    nr += dr;
    nc += dc;
  }
  return cells;
}

export function gridForCount(n) {
  const map = {
    3: [4, 4], 4: [4, 4], 5: [5, 5], 6: [5, 5],
    7: [5, 6], 8: [6, 6], 9: [6, 6], 10: [6, 7],
    11: [7, 7], 12: [7, 7],
  };
  return map[n] || [7, 7];
}

export function generatePuzzle(level) {
  const numCount = Math.min(2 + level, 12);
  const [rows, cols] = gridForCount(numCount);
  const occupied = new Set();
  const arrows = [];
  let id = 0;

  const tryPlace = (num) => {
    for (let attempt = 0; attempt < 300; attempt++) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const key = r * cols + c;
      if (occupied.has(key)) continue;
      const dir = DIR_KEYS[Math.floor(Math.random() * 4)];
      const path = pathCells(r, c, dir, rows, cols);
      if (path.some(p => occupied.has(p.r * cols + p.c))) continue;
      arrows.push({ id: id++, r, c, dir, num });
      occupied.add(key);
      return true;
    }
    // exhaustive fallback
    for (let rr = 0; rr < rows; rr++) {
      for (let cc = 0; cc < cols; cc++) {
        const key = rr * cols + cc;
        if (occupied.has(key)) continue;
        for (const dir of DIR_KEYS) {
          const path = pathCells(rr, cc, dir, rows, cols);
          if (path.some(p => occupied.has(p.r * cols + p.c))) continue;
          arrows.push({ id: id++, r: rr, c: cc, dir, num });
          occupied.add(key);
          return true;
        }
      }
    }
    return false;
  };

  for (let num = numCount; num >= 1; num--) {
    tryPlace(num);
  }

  return { rows, cols, arrows, numCount };
}

export function isReleasable(a, arrows, rows, cols) {
  const path = pathCells(a.r, a.c, a.dir, rows, cols);
  const present = new Set(arrows.map(x => x.r * cols + x.c));
  return !path.some(p => present.has(p.r * cols + p.c));
}