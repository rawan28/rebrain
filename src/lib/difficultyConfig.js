// Rebrain difficulty parameters — calibrated to Israeli adults 65+
// Sources: SHARE-Israel, RAVLT Hebrew norms, NeuroTrax (Rambam/Sheba/TAU),
//          CogniFit Israeli RCT (Peretz et al. 2011), MoCA Hebrew (Lifshitz 2012)

export const DIFFICULTY_CONFIG = {
  targetAccuracy:  0.65,  // Israeli 65+ 1-back spatial baseline: 62–70% (NeuroTrax)
  promoteThresh:   0.80,  // promote if significantly above norm
  demoteThresh:    0.45,  // demote if clearly struggling
  requiredWins:    2,     // consecutive wins before promoting

  levels: {
    // Level: { pairs, flipMs, moveRatio, logicMs, distractors }
    1:  { pairs: 4, flipMs: 1500, moveRatio: 5.0, logicMs: 1600, distractors: 1 }, // T1
    2:  { pairs: 4, flipMs: 1500, moveRatio: 5.0, logicMs: 1500, distractors: 1 },
    3:  { pairs: 4, flipMs: 1500, moveRatio: 5.0, logicMs: 1400, distractors: 2 },
    4:  { pairs: 5, flipMs: 1100, moveRatio: 3.5, logicMs: 1200, distractors: 2 }, // T2 ← Primary target
    5:  { pairs: 5, flipMs: 1100, moveRatio: 3.5, logicMs: 1100, distractors: 2 },
    6:  { pairs: 5, flipMs: 1100, moveRatio: 3.5, logicMs: 1000, distractors: 3 },
    7:  { pairs: 6, flipMs: 1100, moveRatio: 3.5, logicMs: 1000, distractors: 3 },
    8:  { pairs: 6, flipMs:  850, moveRatio: 2.5, logicMs:  850, distractors: 3 }, // T3
    9:  { pairs: 7, flipMs:  850, moveRatio: 2.5, logicMs:  800, distractors: 4 },
    10: { pairs: 7, flipMs:  850, moveRatio: 2.5, logicMs:  750, distractors: 4 },
    11: { pairs: 7, flipMs:  850, moveRatio: 2.5, logicMs:  700, distractors: 4 },
    12: { pairs: 8, flipMs:  650, moveRatio: 2.0, logicMs:  650, distractors: 5 }, // T4
    13: { pairs: 8, flipMs:  650, moveRatio: 2.0, logicMs:  600, distractors: 5 },
    14: { pairs: 8, flipMs:  650, moveRatio: 2.0, logicMs:  580, distractors: 5 },
    15: { pairs: 8, flipMs:  650, moveRatio: 2.0, logicMs:  550, distractors: 5 },
  },
};