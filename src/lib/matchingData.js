// matchingData.js — bilingual (he | ar) levels for the Matching Game
// Each level has a `left` column, a `right` column, and a `pairs` map (leftId -> rightId).

export const matchingLevels = [
  {
    id: 1,
    title: { he: 'מספרים למילים', ar: 'أرقام إلى كلمات' },
    left: [
      { id: 'l1', label: { he: '1', ar: '1' } },
      { id: 'l2', label: { he: '2', ar: '2' } },
      { id: 'l3', label: { he: '3', ar: '3' } },
      { id: 'l4', label: { he: '4', ar: '4' } },
      { id: 'l5', label: { he: '5', ar: '5' } },
    ],
    right: [
      { id: 'r1', label: { he: 'אחד', ar: 'واحد' } },
      { id: 'r2', label: { he: 'שניים', ar: 'اثنان' } },
      { id: 'r3', label: { he: 'שלושה', ar: 'ثلاثة' } },
      { id: 'r4', label: { he: 'ארבעה', ar: 'أربعة' } },
      { id: 'r5', label: { he: 'חמישה', ar: 'خمسة' } },
    ],
    pairs: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4', l5: 'r5' },
  },
  {
    id: 2,
    title: { he: 'חישובים', ar: 'عمليات حسابية' },
    left: [
      { id: 'l1', label: { he: '7 + 5', ar: '7 + 5' } },
      { id: 'l2', label: { he: '9 × 3', ar: '9 × 3' } },
      { id: 'l3', label: { he: '48 ÷ 6', ar: '48 ÷ 6' } },
      { id: 'l4', label: { he: '15 - 8', ar: '15 - 8' } },
      { id: 'l5', label: { he: '6 × 7', ar: '6 × 7' } },
    ],
    right: [
      { id: 'r1', label: { he: '42', ar: '42' } },
      { id: 'r2', label: { he: '12', ar: '12' } },
      { id: 'r3', label: { he: '27', ar: '27' } },
      { id: 'r4', label: { he: '7', ar: '7' } },
      { id: 'r5', label: { he: '8', ar: '8' } },
    ],
    pairs: { l1: 'r2', l2: 'r3', l3: 'r5', l4: 'r4', l5: 'r1' },
  },
  {
    id: 3,
    title: { he: 'הפכים', ar: 'متعكسات' },
    left: [
      { id: 'l1', label: { he: 'יום', ar: 'نهار' } },
      { id: 'l2', label: { he: 'חם', ar: 'حار' } },
      { id: 'l3', label: { he: 'גדול', ar: 'كبير' } },
      { id: 'l4', label: { he: 'מהר', ar: 'سريع' } },
      { id: 'l5', label: { he: 'שמח', ar: 'سعيد' } },
    ],
    right: [
      { id: 'r1', label: { he: 'עצוב', ar: 'حزين' } },
      { id: 'r2', label: { he: 'לילה', ar: 'ليل' } },
      { id: 'r3', label: { he: 'קטן', ar: 'صغير' } },
      { id: 'r4', label: { he: 'קר', ar: 'بارد' } },
      { id: 'r5', label: { he: 'לאט', ar: 'بطيء' } },
    ],
    pairs: { l1: 'r2', l2: 'r4', l3: 'r3', l4: 'r5', l5: 'r1' },
  },
  {
    id: 4,
    title: { he: 'מדינות ובירות', ar: 'دول وعواصم' },
    left: [
      { id: 'l1', label: { he: 'צרפת', ar: 'فرنسا' } },
      { id: 'l2', label: { he: 'יפן', ar: 'اليابان' } },
      { id: 'l3', label: { he: 'מצרים', ar: 'مصر' } },
      { id: 'l4', label: { he: 'ברזיל', ar: 'البرازيل' } },
      { id: 'l5', label: { he: 'איטליה', ar: 'إيطاليا' } },
    ],
    right: [
      { id: 'r1', label: { he: 'קהיר', ar: 'القاهرة' } },
      { id: 'r2', label: { he: 'פריז', ar: 'باريس' } },
      { id: 'r3', label: { he: 'רומא', ar: 'روما' } },
      { id: 'r4', label: { he: 'טוקיו', ar: 'طوكيو' } },
      { id: 'r5', label: { he: 'ברזיליה', ar: 'برازيليا' } },
    ],
    pairs: { l1: 'r2', l2: 'r4', l3: 'r1', l4: 'r5', l5: 'r3' },
  },
  {
    id: 5,
    title: { he: 'צבעים', ar: 'ألوان' },
    left: [
      { id: 'l1', label: { he: 'אדום', ar: 'أحمر' } },
      { id: 'l2', label: { he: 'כחול', ar: 'أزرق' } },
      { id: 'l3', label: { he: 'ירוק', ar: 'أخضر' } },
      { id: 'l4', label: { he: 'צהוב', ar: 'أصفر' } },
      { id: 'l5', label: { he: 'סגול', ar: 'بنفسجي' } },
    ],
    right: [
      { id: 'r1', swatch: '#22c55e' },
      { id: 'r2', swatch: '#ef4444' },
      { id: 'r3', swatch: '#a855f7' },
      { id: 'r4', swatch: '#3b82f6' },
      { id: 'r5', swatch: '#eab308' },
    ],
    pairs: { l1: 'r2', l2: 'r4', l3: 'r1', l4: 'r5', l5: 'r3' },
  },
  {
    id: 6,
    title: { he: 'תרגום עברית-ערבית', ar: 'ترجمة عبري-عربي' },
    left: [
      { id: 'l1', label: { he: 'בית', ar: 'בית' } },
      { id: 'l2', label: { he: 'מים', ar: 'מים' } },
      { id: 'l3', label: { he: 'ספר', ar: 'ספר' } },
      { id: 'l4', label: { he: 'שמש', ar: 'שמש' } },
      { id: 'l5', label: { he: 'עץ', ar: 'עץ' } },
    ],
    right: [
      { id: 'r1', label: { he: 'كتاب', ar: 'كتاب' } },
      { id: 'r2', label: { he: 'بيت', ar: 'بيت' } },
      { id: 'r3', label: { he: 'ماء', ar: 'ماء' } },
      { id: 'r4', label: { he: 'شجرة', ar: 'شجرة' } },
      { id: 'r5', label: { he: 'شمس', ar: 'شمس' } },
    ],
    pairs: { l1: 'r2', l2: 'r3', l3: 'r1', l4: 'r5', l5: 'r4' },
  },
];