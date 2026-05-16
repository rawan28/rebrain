// Shape-Word matching game data
// Each item has: emoji (the "shape"/icon) and labels in he/ar

export const SHAPE_PAIRS = [
  { emoji: '🔑', he: 'מפתח', ar: 'مفتاح' },
  { emoji: '🦕', he: 'דינוסאור', ar: 'ديناصور' },
  { emoji: '🌺', he: 'פרח', ar: 'زهرة' },
  { emoji: '🚀', he: 'טיל', ar: 'صاروخ' },
  { emoji: '🎸', he: 'גיטרה', ar: 'غيتار' },
  { emoji: '🦁', he: 'אריה', ar: 'أسد' },
  { emoji: '🌵', he: 'קקטוס', ar: 'صبار' },
  { emoji: '⚓', he: 'עוגן', ar: 'مرساة' },
  { emoji: '🦋', he: 'פרפר', ar: 'فراشة' },
  { emoji: '🍄', he: 'פטרייה', ar: 'فطر' },
  { emoji: '🎺', he: 'חצוצרה', ar: 'بوق' },
  { emoji: '🦔', he: 'קיפוד', ar: 'قنفذ' },
  { emoji: '🌋', he: 'הר געש', ar: 'بركان' },
  { emoji: '🦚', he: 'טווס', ar: 'طاووس' },
  { emoji: '🪁', he: 'קשת', ar: 'قوس' },
  { emoji: '🐙', he: 'תמנון', ar: 'أخطبوط' },
  { emoji: '🎠', he: 'קרוסלה', ar: 'دوّامة' },
  { emoji: '🦜', he: 'תוכי', ar: 'ببغاء' },
  { emoji: '🧲', he: 'מגנט', ar: 'مغناطيس' },
  { emoji: '🪸', he: 'אלמוג', ar: 'مرجان' },
];

export function buildShapeWordDeck(lang, pairsCount) {
  const pool = [...SHAPE_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairsCount);

  const cards = [];
  pool.forEach((item, idx) => {
    // emoji card
    cards.push({ id: `e${idx}`, pairId: idx, type: 'emoji', content: item.emoji });
    // word card
    cards.push({ id: `w${idx}`, pairId: idx, type: 'word', content: item[lang] });
  });

  // shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}