// ─────────────────────────────────────────────────────────────────────────────
// quizData.js
// All daily quiz question banks for Rebrain.
// Supports: Hebrew (he) | Arabic (ar)
// 3 game types rotate daily: word_recall | trivia | pattern
// ─────────────────────────────────────────────────────────────────────────────

export const GAME_TYPES = {
  WORD_RECALL:  "word_recall",
  TRIVIA:       "trivia",
  PATTERN:      "pattern",
};

export const wordRecallRounds = [
  { id: 1, words: [{ he: "תפוח", ar: "تفاحة" },{ he: "כלב", ar: "كلب" },{ he: "ספר", ar: "كتاب" },{ he: "שמש", ar: "شمس" }], distractors: [{ he: "ירח", ar: "قمر" },{ he: "כיסא", ar: "كرسي" },{ he: "עץ", ar: "شجرة" }] },
  { id: 2, words: [{ he: "ים", ar: "بحر" },{ he: "פרח", ar: "زهرة" },{ he: "בית", ar: "بيت" },{ he: "רכב", ar: "سيارة" }], distractors: [{ he: "דג", ar: "سمكة" },{ he: "ענן", ar: "غيمة" },{ he: "שולחן", ar: "طاولة" }] },
  { id: 3, words: [{ he: "לחם", ar: "خبز" },{ he: "חלב", ar: "حليب" },{ he: "ציפור", ar: "طائر" },{ he: "מטוס", ar: "طائرة" }], distractors: [{ he: "חתול", ar: "قطة" },{ he: "גשם", ar: "مطر" },{ he: "אופניים", ar: "دراجة" }] },
  { id: 4, words: [{ he: "מכתב", ar: "رسالة" },{ he: "ילד", ar: "طفل" },{ he: "אש", ar: "نار" },{ he: "מים", ar: "ماء" }], distractors: [{ he: "אבן", ar: "حجر" },{ he: "קיר", ar: "جدار" },{ he: "נעל", ar: "حذاء" }] },
  { id: 5, words: [{ he: "תרנגול", ar: "ديك" },{ he: "כובע", ar: "قبعة" },{ he: "כף", ar: "ملعقة" },{ he: "טלפון", ar: "هاتف" }], distractors: [{ he: "שק", ar: "حقيبة" },{ he: "קנה", ar: "قصب" },{ he: "אריה", ar: "أسد" }] },
  { id: 6, words: [{ he: "שעון", ar: "ساعة" },{ he: "גן", ar: "حديقة" },{ he: "לילה", ar: "ليل" },{ he: "כוכב", ar: "نجمة" }], distractors: [{ he: "ריצפה", ar: "أرضية" },{ he: "דלת", ar: "باب" },{ he: "חלון", ar: "نافذة" }] },
  { id: 7, words: [{ he: "ארנב", ar: "أرنب" },{ he: "סוס", ar: "حصان" },{ he: "דבש", ar: "عسل" },{ he: "אגוז", ar: "جوزة" }], distractors: [{ he: "נמר", ar: "نمر" },{ he: "תות", ar: "فراولة" },{ he: "ברז", ar: "حنفية" }] },
];

export const triviaQuestions = [
  { id: 1, question: { he: "מהי בירת ישראל?", ar: "ما هي عاصمة إسرائيل؟" }, options: [{ he: "תל אביב", ar: "تل أبيب" },{ he: "ירושלים", ar: "القدس" },{ he: "חיפה", ar: "حيفا" },{ he: "באר שבע", ar: "بئر السبع" }], correctIndex: 1 },
  { id: 2, question: { he: "כמה ימים יש בשבוע?", ar: "كم يوماً في الأسبوع؟" }, options: [{ he: "חמישה", ar: "خمسة" },{ he: "שישה", ar: "ستة" },{ he: "שבעה", ar: "سبعة" },{ he: "שמונה", ar: "ثمانية" }], correctIndex: 2 },
  { id: 3, question: { he: "באיזה עונה עצים מאבדים עלים?", ar: "في أي فصل تفقد الأشجار أوراقها؟" }, options: [{ he: "אביב", ar: "الربيع" },{ he: "קיץ", ar: "الصيف" },{ he: "סתיו", ar: "الخريف" },{ he: "חורף", ar: "الشتاء" }], correctIndex: 2 },
  { id: 4, question: { he: "כמה חודשים יש בשנה?", ar: "كم شهراً في السنة؟" }, options: [{ he: "עשרה", ar: "عشرة" },{ he: "אחד עשר", ar: "أحد عشر" },{ he: "שנים עשר", ar: "اثنا عشر" },{ he: "שלושה עשר", ar: "ثلاثة عشر" }], correctIndex: 2 },
  { id: 5, question: { he: "מה צבע השמיים ביום בהיר?", ar: "ما لون السماء في يوم صافٍ؟" }, options: [{ he: "ירוק", ar: "أخضر" },{ he: "כחול", ar: "أزرق" },{ he: "אדום", ar: "أحمر" },{ he: "צהוב", ar: "أصفر" }], correctIndex: 1 },
  { id: 6, question: { he: "מה חיה גדולה החיה ביבשה?", ar: "ما أكبر حيوان بري؟" }, options: [{ he: "אריה", ar: "أسد" },{ he: "פיל", ar: "فيل" },{ he: "פרה", ar: "بقرة" },{ he: "ג׳ירף", ar: "زرافة" }], correctIndex: 1 },
  { id: 7, question: { he: "כמה אצבעות יש לאדם בשתי ידיים?", ar: "كم إصبعاً للإنسان في كلتا يديه؟" }, options: [{ he: "שמונה", ar: "ثمانية" },{ he: "תשע", ar: "تسعة" },{ he: "עשר", ar: "عشرة" },{ he: "שתים עשרה", ar: "اثنا عشر" }], correctIndex: 2 },
  { id: 8, question: { he: "מה הצבע של עגבניה בשלה?", ar: "ما لون الطماطم الناضجة؟" }, options: [{ he: "ירוק", ar: "أخضر" },{ he: "צהוב", ar: "أصفر" },{ he: "כתום", ar: "برتقالي" },{ he: "אדום", ar: "أحمر" }], correctIndex: 3 },
  { id: 9, question: { he: "כמה עונות יש בשנה?", ar: "كم فصلاً في السنة؟" }, options: [{ he: "שתיים", ar: "اثنان" },{ he: "שלוש", ar: "ثلاثة" },{ he: "ארבע", ar: "أربعة" },{ he: "חמש", ar: "خمسة" }], correctIndex: 2 },
  { id: 10, question: { he: "מה עולה בשמיים בלילה?", ar: "ما الذي يطلع في السماء ليلاً؟" }, options: [{ he: "שמש", ar: "شمس" },{ he: "קשת", ar: "قوس قزح" },{ he: "ירח", ar: "قمر" },{ he: "ענן", ar: "غيمة" }], correctIndex: 2 },
  { id: 11, question: { he: "מה בעל הכנפיים שמניח ביצים?", ar: "ما الحيوان الذي له أجنحة ويضع بيضاً؟" }, options: [{ he: "כלב", ar: "كلب" },{ he: "ציפור", ar: "طائر" },{ he: "חתול", ar: "قطة" },{ he: "פרה", ar: "بقرة" }], correctIndex: 1 },
  { id: 12, question: { he: "איזה מספר בא אחרי 9?", ar: "أي رقم يأتي بعد 9؟" }, options: [{ he: "8", ar: "٨" },{ he: "11", ar: "١١" },{ he: "10", ar: "١٠" },{ he: "12", ar: "١٢" }], correctIndex: 2 },
  { id: 13, question: { he: "מאיזה חיה מקבלים חלב?", ar: "من أي حيوان نحصل على الحليب؟" }, options: [{ he: "כבשה", ar: "خروف" },{ he: "עז", ar: "ماعز" },{ he: "פרה", ar: "بقرة" },{ he: "שתיים ושלוש", ar: "الثانية والثالثة" }], correctIndex: 3 },
  { id: 14, question: { he: "כיצד קוראים לאב של האבא?", ar: "كيف نسمي أبا الأب؟" }, options: [{ he: "דוד", ar: "عم" },{ he: "סב", ar: "جد" },{ he: "אח", ar: "أخ" },{ he: "בן", ar: "ابن" }], correctIndex: 1 },
];

export const patternSequences = [
  { id: 1, sequence: [2, 4, 6, "?", 10], missingIndex: 3, answer: 8, options: [7, 8, 9, 10], rule: { he: "כל מספר גדל ב-2", ar: "كل رقم يزيد بمقدار 2" } },
  { id: 2, sequence: [1, 3, 5, 7, "?"], missingIndex: 4, answer: 9, options: [8, 9, 10, 11], rule: { he: "מספרים אי-זוגיים", ar: "أرقام فردية" } },
  { id: 3, sequence: [10, 20, "?", 40, 50], missingIndex: 2, answer: 30, options: [25, 28, 30, 35], rule: { he: "כל מספר גדל ב-10", ar: "كل رقم يزيد بمقدار 10" } },
  { id: 4, sequence: [3, 6, 9, "?", 15], missingIndex: 3, answer: 12, options: [10, 11, 12, 13], rule: { he: "כפולות של 3", ar: "مضاعفات الرقم 3" } },
  { id: 5, sequence: [5, 10, 15, 20, "?"], missingIndex: 4, answer: 25, options: [22, 24, 25, 26], rule: { he: "כפולות של 5", ar: "مضاعفات الرقم 5" } },
  { id: 6, sequence: [100, 90, 80, "?", 60], missingIndex: 3, answer: 70, options: [65, 70, 75, 80], rule: { he: "כל מספר קטן ב-10", ar: "كل رقم ينقص بمقدار 10" } },
  { id: 7, sequence: [1, 2, 4, "?", 16], missingIndex: 3, answer: 8, options: [6, 7, 8, 9], rule: { he: "כל מספר מוכפל ב-2", ar: "كل رقم يُضاعَف بمقدار 2" } },
  { id: 8, sequence: [50, 45, "?", 35, 30], missingIndex: 2, answer: 40, options: [38, 39, 40, 42], rule: { he: "כל מספר קטן ב-5", ar: "كل رقم ينقص بمقدار 5" } },
  { id: 9, sequence: [4, 8, 12, 16, "?"], missingIndex: 4, answer: 20, options: [18, 19, 20, 21], rule: { he: "כפולות של 4", ar: "مضاعفات الرقم 4" } },
  { id: 10, sequence: [7, "?", 21, 28, 35], missingIndex: 1, answer: 14, options: [12, 13, 14, 15], rule: { he: "כפולות של 7", ar: "مضاعفات الرقם 7" } },
];

export function getDailyGames(dateStr) {
  const seed = dateStr.replace(/-/g, "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pickIndex = (arr, offset) => arr[(seed + offset) % arr.length];
  return [
    { type: GAME_TYPES.WORD_RECALL, data: pickIndex(wordRecallRounds, 0) },
    { type: GAME_TYPES.TRIVIA,      data: pickIndex(triviaQuestions,  1) },
    { type: GAME_TYPES.PATTERN,     data: pickIndex(patternSequences, 2) },
  ];
}