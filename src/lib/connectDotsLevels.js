export const CONNECT_DOTS_LEVELS = [
  // Level 1: 4x4, 2 colors
  {
    size: 4,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 3, c: 3 } },
      { color: '#3b82f6', a: { r: 2, c: 0 }, b: { r: 3, c: 2 } },
    ],
  },
  // Level 2: 5x5, 3 colors
  {
    size: 5,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 2, c: 4 } },
      { color: '#22c55e', a: { r: 1, c: 0 }, b: { r: 4, c: 2 } },
      { color: '#3b82f6', a: { r: 2, c: 2 }, b: { r: 3, c: 3 } },
    ],
  },
  // Level 3: 5x5, 4 colors
  {
    size: 5,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 2, c: 2 } },
      { color: '#3b82f6', a: { r: 2, c: 0 }, b: { r: 4, c: 1 } },
      { color: '#22c55e', a: { r: 2, c: 3 }, b: { r: 4, c: 4 } },
      { color: '#eab308', a: { r: 0, c: 4 }, b: { r: 2, c: 4 } },
    ],
  },
  // Level 4: 6x6, 4 colors
  {
    size: 6,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 2, c: 2 } },
      { color: '#3b82f6', a: { r: 2, c: 0 }, b: { r: 4, c: 1 } },
      { color: '#eab308', a: { r: 0, c: 5 }, b: { r: 2, c: 5 } },
      { color: '#22c55e', a: { r: 5, c: 3 }, b: { r: 5, c: 5 } },
    ],
  },
  // Level 5: 6x6, 5 colors
  {
    size: 6,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 2, c: 2 } },
      { color: '#3b82f6', a: { r: 2, c: 0 }, b: { r: 4, c: 1 } },
      { color: '#eab308', a: { r: 0, c: 5 }, b: { r: 2, c: 5 } },
      { color: '#22c55e', a: { r: 2, c: 4 }, b: { r: 5, c: 3 } },
    ],
  },
  // Level 6: 7x7, 5 colors
  {
    size: 7,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 2, c: 2 } },
      { color: '#3b82f6', a: { r: 2, c: 0 }, b: { r: 4, c: 1 } },
      { color: '#eab308', a: { r: 0, c: 6 }, b: { r: 2, c: 6 } },
      { color: '#22c55e', a: { r: 2, c: 5 }, b: { r: 5, c: 4 } },
      { color: '#a855f7', a: { r: 5, c: 3 }, b: { r: 6, c: 5 } },
    ],
  },
  // Level 7: 7x7, 6 colors
  {
    size: 7,
    pairs: [
      { color: '#ef4444', a: { r: 0, c: 0 }, b: { r: 2, c: 2 } },
      { color: '#3b82f6', a: { r: 2, c: 0 }, b: { r: 4, c: 1 } },
      { color: '#eab308', a: { r: 0, c: 6 }, b: { r: 2, c: 6 } },
      { color: '#22c55e', a: { r: 2, c: 5 }, b: { r: 5, c: 5 } },
      { color: '#f97316', a: { r: 2, c: 4 }, b: { r: 5, c: 4 } },
      { color: '#a855f7', a: { r: 6, c: 2 }, b: { r: 6, c: 5 } },
    ],
  },
];