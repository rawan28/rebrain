// Rush Hour puzzle levels
// Each vehicle: { row, col, length, horizontal }
// Vehicle index 0 is always the player car (red), must be horizontal at row 2

export const LEVELS = [
  {
    // Level 1 - Easy
    vehicles: [
      { row: 2, col: 0, length: 2, horizontal: true },  // player (red)
      { row: 0, col: 2, length: 2, horizontal: false },
      { row: 0, col: 5, length: 2, horizontal: false },
      { row: 3, col: 0, length: 2, horizontal: true },
      { row: 4, col: 1, length: 3, horizontal: true },
    ]
  },
  {
    // Level 2
    vehicles: [
      { row: 2, col: 1, length: 2, horizontal: true },  // player
      { row: 0, col: 0, length: 3, horizontal: false },
      { row: 0, col: 3, length: 2, horizontal: true },
      { row: 1, col: 5, length: 2, horizontal: false },
      { row: 3, col: 2, length: 2, horizontal: true },
      { row: 4, col: 0, length: 2, horizontal: true },
      { row: 5, col: 3, length: 3, horizontal: true },
    ]
  },
  {
    // Level 3
    vehicles: [
      { row: 2, col: 0, length: 2, horizontal: true },  // player
      { row: 0, col: 2, length: 3, horizontal: false },
      { row: 0, col: 4, length: 2, horizontal: true },
      { row: 2, col: 3, length: 2, horizontal: false },
      { row: 3, col: 1, length: 2, horizontal: true },
      { row: 4, col: 3, length: 2, horizontal: false },
      { row: 5, col: 0, length: 3, horizontal: true },
      { row: 0, col: 0, length: 2, horizontal: false },
    ]
  },
  {
    // Level 4
    vehicles: [
      { row: 2, col: 2, length: 2, horizontal: true },  // player
      { row: 0, col: 0, length: 2, horizontal: true },
      { row: 0, col: 2, length: 2, horizontal: false },
      { row: 0, col: 4, length: 2, horizontal: false },
      { row: 1, col: 1, length: 2, horizontal: true },
      { row: 2, col: 0, length: 2, horizontal: false },
      { row: 3, col: 2, length: 2, horizontal: false },
      { row: 4, col: 0, length: 2, horizontal: true },
      { row: 4, col: 3, length: 3, horizontal: true },
      { row: 5, col: 2, length: 2, horizontal: true },
    ]
  },
  {
    // Level 5 - Hard
    vehicles: [
      { row: 2, col: 1, length: 2, horizontal: true },  // player
      { row: 0, col: 0, length: 3, horizontal: false },
      { row: 0, col: 1, length: 2, horizontal: true },
      { row: 0, col: 3, length: 3, horizontal: false },
      { row: 0, col: 5, length: 2, horizontal: false },
      { row: 2, col: 3, length: 2, horizontal: false },
      { row: 3, col: 1, length: 3, horizontal: true },
      { row: 4, col: 0, length: 2, horizontal: false },
      { row: 4, col: 4, length: 2, horizontal: true },
      { row: 5, col: 1, length: 2, horizontal: true },
      { row: 5, col: 4, length: 2, horizontal: true },
    ]
  },
];