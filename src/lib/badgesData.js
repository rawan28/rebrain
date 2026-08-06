// Badge definitions + computation from UserProgress records

export const BADGES = [
  { id: 'streak_3',  type: 'streak', goal: 3,   icon: '🔥', he: { name: 'שלושה ימים ברצף',  desc: 'התאמנו 3 ימים רצופים' },   ar: { name: 'ثلاثة أيام متتالية',  desc: 'تدرّبوا 3 أيام متتالية' } },
  { id: 'streak_7',  type: 'streak', goal: 7,   icon: '⭐', he: { name: 'שבוע מושלם',        desc: 'התאמנו 7 ימים רצופים' },   ar: { name: 'أسبوع مثالي',         desc: 'تدرّبوا 7 أيام متتالية' } },
  { id: 'streak_14', type: 'streak', goal: 14,  icon: '🌟', he: { name: 'שבועיים של התמדה',  desc: 'התאמנו 14 ימים רצופים' },  ar: { name: 'أسبوعان من المثابرة', desc: 'تدرّبوا 14 يومًا متتاليًا' } },
  { id: 'streak_30', type: 'streak', goal: 30,  icon: '👑', he: { name: 'חודש של אלופים',    desc: 'התאמנו 30 ימים רצופים' },  ar: { name: 'شهر الأبطال',          desc: 'تدرّبوا 30 يومًا متتاليًا' } },
  { id: 'games_10',  type: 'games',  goal: 10,  icon: '🎯', he: { name: 'צעדים ראשונים',     desc: 'השלימו 10 משחקים' },       ar: { name: 'خطوات أولى',           desc: 'أكملوا 10 ألعاب' } },
  { id: 'games_50',  type: 'games',  goal: 50,  icon: '🏅', he: { name: 'מתאמנים מתמידים',   desc: 'השלימו 50 משחקים' },       ar: { name: 'متدرّبون مثابرون',     desc: 'أكملوا 50 لعبة' } },
  { id: 'games_100', type: 'games',  goal: 100, icon: '🏆', he: { name: 'מאה משחקים!',       desc: 'השלימו 100 משחקים' },      ar: { name: 'مئة لعبة!',            desc: 'أكملوا 100 لعبة' } },
  { id: 'games_250', type: 'games',  goal: 250, icon: '💎', he: { name: 'אגדת המוח',         desc: 'השלימו 250 משחקים' },      ar: { name: 'أسطورة العقل',         desc: 'أكملوا 250 لعبة' } },
  { id: 'perfect_1', type: 'perfect', goal: 1,  icon: '💯', he: { name: 'משחק מושלם',        desc: 'סיימו משחק בדיוק של 100%' }, ar: { name: 'لعبة مثالية',        desc: 'أنهوا لعبة بدقة 100%' } },
  { id: 'level_10',  type: 'level',  goal: 10,  icon: '🚀', he: { name: 'רמה 10',            desc: 'הגיעו לרמה 10 במשחק כלשהו' }, ar: { name: 'المستوى 10',        desc: 'وصلوا إلى المستوى 10 في أي لعبة' } },
];

// Best consecutive-day run from a list of records (uses distinct dates)
function bestDayStreak(records) {
  const days = [...new Set(records.map(r => String(r.date).slice(0, 10)))].sort();
  let best = 0, run = 0, prev = null;
  for (const d of days) {
    run = prev && (new Date(d) - new Date(prev)) === 86400000 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

// Returns [{ ...badge, earned, progress, goal }]
export function computeBadges(records) {
  const totalGames = records.length;
  const streak = bestDayStreak(records);
  const perfectCount = records.filter(r => r.accuracy === 100 && (r.totalAttempts ?? 0) >= 3).length;
  const maxLevel = Math.max(0, ...records.map(r => r.level ?? 0));

  const progressFor = { streak, games: totalGames, perfect: perfectCount, level: maxLevel };

  return BADGES.map(b => {
    const progress = Math.min(progressFor[b.type] ?? 0, b.goal);
    return { ...b, progress, earned: progress >= b.goal };
  });
}