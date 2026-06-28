// agentQuizData.js — Dynamic daily generator for 4 cognitive games
// Seeded by date so same user gets same challenge that day

export const AGENT_GAME_TYPES = {
  ZIPZAP:         "zipzap",
  SPEED_MATCH:    "speedMatch",
  VISUAL_MEMORY:  "visualMemory",
  ATTENTION_SCAN: "attentionScan",
};

const config = {
  1: { zipzapLen: 3, zipzapShowMs: 4000, gridSize: 12, gridCols: 4, memItems: 3, memShowMs: 4000, scanSize: 16, scanCols: 4 },
  2: { zipzapLen: 4, zipzapShowMs: 3500, gridSize: 16, gridCols: 4, memItems: 4, memShowMs: 3000, scanSize: 20, scanCols: 5 },
  3: { zipzapLen: 5, zipzapShowMs: 3000, gridSize: 20, gridCols: 5, memItems: 5, memShowMs: 2500, scanSize: 25, scanCols: 5 },
  4: { zipzapLen: 6, zipzapShowMs: 2500, gridSize: 25, gridCols: 5, memItems: 6, memShowMs: 2000, scanSize: 30, scanCols: 6 },
  5: { zipzapLen: 7, zipzapShowMs: 2000, gridSize: 30, gridCols: 6, memItems: 7, memShowMs: 1500, scanSize: 36, scanCols: 6 },
};

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function dateSeed(dateStr) {
  return dateStr.replace(/-/g, "").split("").reduce((a, c) => a + c.charCodeAt(0) * 31, 0);
}

export function generateDailyAgentGames(dateStr, level) {
  const cfg = config[level] || config[1];
  const rand = seededRand(dateSeed(dateStr));

  // 1. ZipZap
  const zipNumbers = Array.from({ length: cfg.zipzapLen }, () => Math.floor(rand() * 9) + 1);
  const zipZap = {
    type: AGENT_GAME_TYPES.ZIPZAP,
    data: { sequence: zipNumbers, showMs: cfg.zipzapShowMs, instructions: { he: "זכור את המספרים והקש אותם בסדר הנכון", ar: "تذكر الأرقام وانقرها بالترتيب الصحيح" } },
  };

  // 2. SpeedMatch
  const shapesByLevel = {
    1: ["▲", "■", "●", "◆"],
    2: ["▲", "■", "●", "◆", "★", "♦"],
    3: ["▲", "■", "●", "◆", "★", "♦", "♥", "♠"],
    4: ["▲", "■", "●", "◆", "★", "♦", "♥", "♠", "⬡", "⬢"],
    5: ["A", "B", "C", "D", "E", "F", "▲", "■", "●", "◆"],
  };
  const shapes = shapesByLevel[level] || shapesByLevel[1];
  const target = shapes[Math.floor(rand() * shapes.length)];
  const grid = Array.from({ length: cfg.gridSize }, () => shapes[Math.floor(rand() * shapes.length)]);
  // ensure target appears at least twice
  if (grid.filter(g => g === target).length < 2) {
    grid[Math.floor(rand() * grid.length)] = target;
    grid[Math.floor(rand() * grid.length)] = target;
  }
  const speedMatch = {
    type: AGENT_GAME_TYPES.SPEED_MATCH,
    data: { target, grid, gridCols: cfg.gridCols, instructions: { he: `מצא וסמן את כל: ${target}`, ar: `ابحث وحدد جميع: ${target}` } },
  };

  // 3. VisualMemory
  const emojiPools = {
    1: ["🍎", "🔑", "🐟", "🌙", "📘", "🧩", "🌸", "🎵"],
    2: ["🍎", "🔑", "🐟", "🌙", "📘", "🧩", "🌸", "🎵", "🏠", "⭐", "🦋", "🚗"],
    3: ["🍎", "🔑", "🐟", "🌙", "📘", "🧩", "🌸", "🎵", "🏠", "⭐", "🦋", "🚗", "🌊", "🏔️", "🎭", "🧲"],
    4: ["🍎", "🔑", "🐟", "🌙", "📘", "🧩", "🌸", "🎵", "🏠", "⭐", "🦋", "🚗", "🌊", "🏔️", "🎭", "🧲", "🦁", "🎯", "🧊", "🎻"],
    5: ["🍎", "🔑", "🐟", "🌙", "📘", "🧩", "🌸", "🎵", "🏠", "⭐", "🦋", "🚗", "🌊", "🏔️", "🎭", "🧲", "🦁", "🎯", "🧊", "🎻", "🌺", "🦅", "🌋", "🔭", "🎪"],
  };
  const pool = emojiPools[level] || emojiPools[1];
  const shuffled = [...pool].sort(() => rand() - 0.5);
  const shown = shuffled.slice(0, cfg.memItems);
  const distractors = shuffled.slice(cfg.memItems, cfg.memItems + cfg.memItems);
  const allItems = [...shown, ...distractors].sort(() => rand() - 0.5);
  const visualMemory = {
    type: AGENT_GAME_TYPES.VISUAL_MEMORY,
    data: { shown, allItems, showMs: cfg.memShowMs, instructions: { he: "זכור את הפריטים — הם ייעלמו!", ar: "تذكّر العناصر — ستختفي!" } },
  };

  // 4. AttentionScan
  const scanPools = {
    1: "ABCDEFGHIJKLMNOP".split(""),
    2: "ABCDEFGHIJKLMNOPQRSTUVWX".split(""),
    3: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    4: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij".split(""),
    5: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop0123456789".split(""),
  };
  const letters = scanPools[level] || scanPools[1];
  const scanTarget = letters[Math.floor(rand() * letters.length)];
  const scanGrid = Array.from({ length: cfg.scanSize }, () => letters[Math.floor(rand() * letters.length)]);
  if (!scanGrid.includes(scanTarget)) scanGrid[Math.floor(rand() * scanGrid.length)] = scanTarget;
  const attentionScan = {
    type: AGENT_GAME_TYPES.ATTENTION_SCAN,
    data: { target: scanTarget, grid: scanGrid, gridCols: cfg.scanCols, instructions: { he: `מצא את האות: ${scanTarget}`, ar: `ابحث عن الحرف: ${scanTarget}` } },
  };

  return [zipZap, speedMatch, visualMemory, attentionScan];
}