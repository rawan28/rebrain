// Word completion game data
// Each entry has the word and an optional hint/category

export const WORDS = {
  he: [
    // 4-letter words (easy)
    { word: 'ילד', hint: 'ילד קטן' },
    { word: 'בית', hint: 'גרים בו' },
    { word: 'ספר', hint: 'קוראים אותו' },
    { word: 'שמש', hint: 'זורחת ביום' },
    { word: 'ירח', hint: 'זורח בלילה' },
    { word: 'כלב', hint: 'חיית מחמד' },
    { word: 'חתול', hint: 'אוהב דגים' },
    { word: 'מים', hint: 'שותים אותם' },
    { word: 'לחם', hint: 'אוכלים אותו' },
    { word: 'עץ', hint: 'גדל ביער' },
    // 5-letter words (medium)
    { word: 'תפוח', hint: 'פרי אדום' },
    { word: 'שולחן', hint: 'רהיט' },
    { word: 'ילדה', hint: 'בת קטנה' },
    { word: 'אריה', hint: 'מלך החיות' },
    { word: 'מכונית', hint: 'רכב' },
    { word: 'בלון', hint: 'עף באוויר' },
    { word: 'ספינה', hint: 'שטה בים' },
    { word: 'עוגה', hint: 'קינוח מתוק' },
    { word: 'כוכב', hint: 'מנצנץ בלילה' },
    { word: 'צבע', hint: 'צובעים איתו' },
    // 6+ letter words (hard)
    { word: 'אבטיח', hint: 'פרי קיץ' },
    { word: 'תפוז', hint: 'פרי כתום' },
    { word: 'תיק', hint: 'נושאים דברים' },
    { word: 'מחשב', hint: 'כלי טכנולוגי' },
    { word: 'מטוס', hint: 'טס בשמיים' },
    { word: 'רכבת', hint: 'נוסעת על פסים' },
    { word: 'ספרייה', hint: 'מקום לספרים' },
    { word: 'חלון', hint: 'פתח בקיר' },
    { word: 'כיסא', hint: 'יושבים עליו' },
    { word: 'מנורה', hint: 'מאירה חדר' },
  ],
  ar: [
    // short (easy)
    { word: 'قلم', hint: 'للكتابة' },
    { word: 'كتاب', hint: 'للقراءة' },
    { word: 'باب', hint: 'مدخل البيت' },
    { word: 'نور', hint: 'يضيء الغرفة' },
    { word: 'بحر', hint: 'ماء كثير' },
    { word: 'شمس', hint: 'تشرق نهاراً' },
    { word: 'قمر', hint: 'يضيء الليل' },
    { word: 'نجم', hint: 'في السماء' },
    { word: 'ماء', hint: 'نشربه' },
    { word: 'خبز', hint: 'نأكله' },
    // medium
    { word: 'أطفال', hint: 'صغار' },
    { word: 'مدرسة', hint: 'مكان التعلم' },
    { word: 'سيارة', hint: 'وسيلة نقل' },
    { word: 'طائرة', hint: 'تطير في السماء' },
    { word: 'تفاح', hint: 'فاكهة حمراء' },
    { word: 'برتقال', hint: 'فاكهة برتقالية' },
    { word: 'قطة', hint: 'حيوان أليف' },
    { word: 'كلب', hint: 'حيوان أليف' },
    { word: 'بيت', hint: 'نسكن فيه' },
    { word: 'حديقة', hint: 'مكان جميل' },
    // hard
    { word: 'مكتبة', hint: 'مكان الكتب' },
    { word: 'حاسوب', hint: 'جهاز إلكتروني' },
    { word: 'تلفاز', hint: 'نشاهد فيه' },
    { word: 'مطبخ', hint: 'نطبخ فيه' },
    { word: 'نافذة', hint: 'فتحة في الجدار' },
    { word: 'كرسي', hint: 'نجلس عليه' },
    { word: 'سرير', hint: 'ننام عليه' },
    { word: 'مطعم', hint: 'نأكل فيه' },
    { word: 'مستشفى', hint: 'للعلاج' },
    { word: 'بطيخ', hint: 'فاكهة صيف' },
  ],
};

// Given a level (1–10), determine how many letters to hide
function getHiddenCount(wordLen, level) {
  // level 1-3: hide 1, level 4-6: hide 2, level 7-10: hide 3+
  if (level <= 3) return Math.min(1, wordLen - 1);
  if (level <= 6) return Math.min(2, wordLen - 1);
  return Math.min(Math.floor(wordLen / 2), wordLen - 1);
}

export function generateQuestion(lang, level) {
  const pool = WORDS[lang];
  const word = pool[Math.floor(Math.random() * pool.length)];
  const letters = [...word.word];
  const wordLen = letters.length;
  const hiddenCount = getHiddenCount(wordLen, level);

  // Pick random indices to hide
  const indices = [];
  while (indices.length < hiddenCount) {
    const idx = Math.floor(Math.random() * wordLen);
    if (!indices.includes(idx)) indices.push(idx);
  }
  indices.sort((a, b) => a - b);

  // Build masked display
  const masked = letters.map((ch, i) => (indices.includes(i) ? '_' : ch));

  // Build letter options: correct letters + distractors
  const correctLetters = indices.map(i => letters[i]);
  const allLetters = lang === 'he'
    ? 'אבגדהוזחטיכלמנסעפצקרשת'.split('')
    : 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');

  const distractors = allLetters
    .filter(l => !correctLetters.includes(l))
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(4, 6 - hiddenCount));

  const options = [...new Set([...correctLetters, ...distractors])]
    .sort(() => Math.random() - 0.5);

  return {
    word: word.word,
    hint: word.hint,
    letters,
    masked,
    hiddenIndices: indices,
    options,
  };
}