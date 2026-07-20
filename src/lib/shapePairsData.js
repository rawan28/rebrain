// Shape-Word matching game data
// Each item has: emoji (the "shape"/icon) and labels in he/ar

export const SHAPE_PAIRS = [
  // Animals
  { emoji: '🐘', he: 'פיל', ar: 'فيل' },
  { emoji: '🦒', he: 'ג׳ירפה', ar: 'زرافة' },
  { emoji: '🐬', he: 'דולפין', ar: 'دلفين' },
  { emoji: '🦉', he: 'ינשוף', ar: 'بومة' },
  { emoji: '🐢', he: 'צב', ar: 'سلحفاة' },
  { emoji: '🦩', he: 'פלמינגו', ar: 'فلامنغو' },
  { emoji: '🐝', he: 'דבורה', ar: 'نحلة' },
  { emoji: '🦌', he: 'צבי', ar: 'غزال' },
  { emoji: '🐪', he: 'גמל', ar: 'جمل' },
  { emoji: '🦭', he: 'כלב ים', ar: 'فقمة' },
  // Nature
  { emoji: '🌈', he: 'קשת בענן', ar: 'قوس قزح' },
  { emoji: '🌊', he: 'גל', ar: 'موجة' },
  { emoji: '❄️', he: 'פתית שלג', ar: 'ندفة ثلج' },
  { emoji: '🌙', he: 'ירח', ar: 'قمر' },
  { emoji: '🌻', he: 'חמנייה', ar: 'عبّاد الشمس' },
  { emoji: '🌴', he: 'דקל', ar: 'نخلة' },
  { emoji: '🍁', he: 'עלה', ar: 'ورقة شجر' },
  { emoji: '⛰️', he: 'הר', ar: 'جبل' },
  // Objects
  { emoji: '⏰', he: 'שעון מעורר', ar: 'منبّه' },
  { emoji: '🔦', he: 'פנס', ar: 'مصباح يدوي' },
  { emoji: '☂️', he: 'מטרייה', ar: 'مظلة' },
  { emoji: '🎈', he: 'בלון', ar: 'بالون' },
  { emoji: '🔔', he: 'פעמון', ar: 'جرس' },
  { emoji: '🧭', he: 'מצפן', ar: 'بوصلة' },
  { emoji: '🪜', he: 'סולם', ar: 'سلّم' },
  { emoji: '🕯️', he: 'נר', ar: 'شمعة' },
  // Food
  { emoji: '🍉', he: 'אבטיח', ar: 'بطيخ' },
  { emoji: '🍇', he: 'ענבים', ar: 'عنب' },
  { emoji: '🥕', he: 'גזר', ar: 'جزر' },
  { emoji: '🍋', he: 'לימון', ar: 'ليمون' },
  { emoji: '🍓', he: 'תות', ar: 'فراولة' },
  { emoji: '🥐', he: 'קרואסון', ar: 'كرواسون' },
  // Transport & places
  { emoji: '🚂', he: 'רכבת', ar: 'قطار' },
  { emoji: '⛵', he: 'סירת מפרש', ar: 'قارب شراعي' },
  { emoji: '🚁', he: 'מסוק', ar: 'مروحية' },
  { emoji: '🏰', he: 'טירה', ar: 'قلعة' },
  { emoji: '🗼', he: 'מגדל', ar: 'برج' },
  { emoji: '🎡', he: 'גלגל ענק', ar: 'عجلة عملاقة' },
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