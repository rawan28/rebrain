const KEY = 'rebrain_difficulty_pref';

// Manual difficulty options: 'auto' follows adaptive scaling; others fix the level.
export const DIFFICULTY_PREFS = [
  { key: 'auto',   level: null, he: 'אוטומטי',  ar: 'تلقائي' },
  { key: 'easy',   level: 2,    he: 'קל',       ar: 'سهل' },
  { key: 'medium', level: 5,    he: 'בינוני',   ar: 'متوسط' },
  { key: 'hard',   level: 8,    he: 'מאתגר',    ar: 'صعب' },
];

export function getDifficultyPref() {
  try {
    const val = localStorage.getItem(KEY);
    return DIFFICULTY_PREFS.some(p => p.key === val) ? val : 'auto';
  } catch {
    return 'auto';
  }
}

export function setDifficultyPref(key) {
  try {
    localStorage.setItem(KEY, key);
  } catch {
    // ignore
  }
}

// Returns the fixed level (1-10) if a manual difficulty is set, otherwise null.
export function getFixedLevel() {
  const pref = DIFFICULTY_PREFS.find(p => p.key === getDifficultyPref());
  return pref?.level ?? null;
}