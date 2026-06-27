// Maps each game to one or more cognitive pillars
export const PILLAR_MAPPING = {
  memory:          ['memory'],
  logic:           ['logic', 'pattern'],
  numbers:         ['logic', 'attention'],
  flags:           ['memory', 'attention'],
  word:            ['memory', 'pattern'],
  trivia:          ['memory'],
  'shape-word':    ['pattern', 'attention'],
  'fruit-algebra': ['logic', 'pattern'],
  'connect-dots':  ['attention', 'pattern'],
  'daily_quiz_rapid_recall':     ['memory'],
  'daily_quiz_logic_odd_one_out': ['logic'],
  'daily_quiz_spot_difference':   ['attention'],
  'daily_quiz_pattern_advanced':  ['pattern'],
};

export const PILLARS = {
  memory:    { color: '#3b82f6', emoji: '🧠' },
  logic:     { color: '#8b5cf6', emoji: '🧩' },
  attention: { color: '#f59e0b', emoji: '🎯' },
  pattern:   { color: '#10b981', emoji: '🔍' },
};

export const PILLAR_LABELS = {
  he: { memory: 'זיכרון', logic: 'חשיבה לוגית', attention: 'קשב ודיוק', pattern: 'זיהוי דפוסים' },
  ar: { memory: 'الذاكرة', logic: 'التفكير المنطقي', attention: 'الانتباه والدقة', pattern: 'التعرف على الأنماط' },
};

// Aggregate raw game progress data into pillar-level data
export function aggregateByPillar(rawProgress) {
  const pillarKeys = Object.keys(PILLARS);
  
  // Build reverse map: pillar → [game keys]
  const pillarGames = {};
  for (const p of pillarKeys) pillarGames[p] = [];
  for (const [game, pillars] of Object.entries(PILLAR_MAPPING)) {
    for (const p of pillars) {
      if (pillarGames[p]) pillarGames[p].push(game);
    }
  }

  // Find all unique dates across all games
  const dateSet = new Set();
  for (const game of Object.keys(rawProgress)) {
    for (const s of rawProgress[game] || []) {
      if (s.date) dateSet.add(s.date.slice(0, 10));
    }
  }
  const dates = [...dateSet].sort();
  if (!dates.length) return { timeline: [], summary: {} };

  // Build timeline: for each date, average accuracy per pillar
  const timeline = dates.map(date => {
    const row = { date };
    for (const p of pillarKeys) {
      const values = [];
      for (const game of pillarGames[p]) {
        const sessions = (rawProgress[game] || []).filter(s => s.date?.slice(0, 10) === date);
        for (const s of sessions) {
          if (s.accuracy != null) values.push(s.accuracy);
        }
      }
      row[p] = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
    }
    return row;
  });

  // Build summary: overall average accuracy + total sessions per pillar
  const summary = {};
  for (const p of pillarKeys) {
    const allAccuracies = [];
    let totalSessions = 0;
    for (const game of pillarGames[p]) {
      const sessions = rawProgress[game] || [];
      totalSessions += sessions.length;
      for (const s of sessions) {
        if (s.accuracy != null) allAccuracies.push(s.accuracy);
      }
    }
    summary[p] = {
      avgAccuracy: allAccuracies.length ? Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length) : 0,
      totalSessions,
    };
  }

  return { timeline, summary };
}