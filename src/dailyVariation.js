const LAUNCH = new Date("2026-06-27");

const MEMORY_GAMES    = ["word_recall", "rapid_recall", "visualMemory"];
const LOGIC_GAMES     = ["trivia", "logic_odd_one_out", "pattern", "word_association", "mental_math"];
const ATTENTION_GAMES = ["spot_difference", "attentionScan", "pattern_advanced", "sequence_order", "attention_arena"];
const SPEED_GAMES     = ["zipzap", "speedMatch"];

export const SKILL_LABELS = {
  word_recall:       { he: "📝 זיכרון מילולי",        ar: "📝 الذاكرة اللفظية" },
  trivia:            { he: "🧠 ידע כללי",              ar: "🧠 المعرفة العامة" },
  pattern:           { he: "🔢 זיהוי דפוסים",          ar: "🔢 التعرف على الأنماط" },
  rapid_recall:      { he: "⚡ זיכרון מהיר",            ar: "⚡ الذاكرة السريعة" },
  logic_odd_one_out: { he: "🧩 חשיבה לוגית",           ar: "🧩 التفكير المنطقي" },
  spot_difference:   { he: "🔍 קשב לפרטים",            ar: "🔍 الانتباه للتفاصيل" },
  pattern_advanced:  { he: "🎭 דפוסים מתקדמים",        ar: "🎭 الأنماط المتقدمة" },
  zipzap:            { he: "⚡ עיבוד מהיר",             ar: "⚡ المعالجة السريعة" },
  speedMatch:        { he: "🎯 מהירות ודיוק",           ar: "🎯 السرعة والدقة" },
  visualMemory:      { he: "🖼️ זיכרון חזותי",          ar: "🖼️ الذاكرة البصرية" },
  attentionScan:     { he: "🔭 ריכוז וסריקה",           ar: "🔭 التركيز والمسح" },
  word_association:  { he: "🔗 אסוציאציה מילולית",      ar: "🔗 الترابط اللفظي" },
  mental_math:       { he: "🔢 חשבון מנטלי",            ar: "🔢 الحساب الذهني" },
  sequence_order:    { he: "📋 סדר רצף",               ar: "📋 ترتيب التسلسل" },
  attention_arena:   { he: "🏟️ קשב מוכוון",            ar: "🏟️ الانتباه الموجه" },
};

function seededRand(seed) {
  let s = Math.abs(seed) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateSeed(dateStr) {
  return dateStr.replace(/-/g, "").split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 7), 0);
}

export function getDayNumber(dateStr) {
  return Math.max(0, Math.floor((new Date(dateStr) - LAUNCH) / 86400000));
}

export function getDifficultyLevel(dateStr) {
  const pos = getDayNumber(dateStr) % 15;
  if (pos < 3)  return 1;
  if (pos < 6)  return 2;
  if (pos < 9)  return 3;
  if (pos < 12) return 4;
  return 5;
}

export function getWeekTheme(dateStr) {
  const themes = [
    { he: "🌿 טבע וחיות",       ar: "🌿 الطبيعة والحيوانات" },
    { he: "🏛️ תרבות והיסטוריה", ar: "🏛️ الثقافة والتاريخ" },
    { he: "🔬 מדע וגוף",         ar: "🔬 العلوم والجسم" },
    { he: "🍽️ אוכל ובריאות",    ar: "🍽️ الطعام والصحة" },
    { he: "🌍 עולם ועמים",       ar: "🌍 العالم والشعوب" },
  ];
  return themes[Math.floor(getDayNumber(dateStr) / 7) % themes.length];
}

export function getDailyGameTypes(dateStr) {
  const rand = seededRand(dateSeed(dateStr));
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  const four = [
    pick(MEMORY_GAMES),
    pick(LOGIC_GAMES),
    pick(ATTENTION_GAMES),
    pick(SPEED_GAMES),
  ];

  // 5th game: pick from any category, avoiding duplicates
  const remainingPool = [...MEMORY_GAMES, ...LOGIC_GAMES, ...ATTENTION_GAMES, ...SPEED_GAMES]
    .filter(g => !four.includes(g));
  const five = [...four, pick(remainingPool)];

  // Shuffle order so even the sequence feels fresh each day
  for (let i = five.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [five[i], five[j]] = [five[j], five[i]];
  }

  return { games: five, spotlight: five[0] };
}

export function getBonusGame(dateStr) {
  const bonusPool = ["rapid_recall","logic_odd_one_out","spot_difference","pattern_advanced","zipzap","attentionScan"];
  return bonusPool[getDayNumber(dateStr) % bonusPool.length];
}