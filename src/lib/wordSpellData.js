// Word pairs for the WordSpell game — narrator speaks 2 words, player spells them from scrambled letters
// Each level increases word length/difficulty

export const wordSpellPairs = {
  1: [
    { words: [{ he: "כלב", ar: "كلب" }, { he: "דלת", ar: "باب" }] },
    { words: [{ he: "שמש", ar: "شمس" }, { he: "ירח", ar: "قمر" }] },
    { words: [{ he: "עץ", ar: "شجر" }, { he: "פרח", ar: "ورد" }] },
  ],
  2: [
    { words: [{ he: "מפתח", ar: "مفتاح" }, { he: "דלת", ar: "باب" }] },
    { words: [{ he: "ספר", ar: "كتاب" }, { he: "עיפרון", ar: "قلم" }] },
    { words: [{ he: "כוס", ar: "كوب" }, { he: "צלחת", ar: "طبق" }] },
  ],
  3: [
    { words: [{ he: "מים", ar: "ماء" }, { he: "לחם", ar: "خبز" }] },
    { words: [{ he: "כיסא", ar: "كرسي" }, { he: "שולחן", ar: "طاولة" }] },
    { words: [{ he: "מכונית", ar: "سيارة" }, { he: "אופניים", ar: "دراجة" }] },
  ],
  4: [
    { words: [{ he: "מגדלור", ar: "منارة" }, { he: "ספינה", ar: "سفينة" }] },
    { words: [{ he: "הרים", ar: "جبال" }, { he: "נהרות", ar: "أنهار" }] },
    { words: [{ he: "חתול", ar: "قطة" }, { he: "עכבר", ar: "فأر" }] },
  ],
  5: [
    { words: [{ he: "מטוס", ar: "طائرة" }, { he: "נמל", ar: "مطار" }] },
    { words: [{ he: "גיטרה", ar: "جيتار" }, { he: "מנגינה", ar: "لحن" }] },
    { words: [{ he: "מגנט", ar: "مغناطيس" }, { he: "ברזל", ar: "حديد" }] },
  ],
  6: [
    { words: [{ he: "פרפר", ar: "فراشة" }, { he: "פרחים", ar: "أزهار" }] },
    { words: [{ he: "מעבדה", ar: "مختبر" }, { he: "ניסוי", ar: "تجربة" }] },
    { words: [{ he: "אוניברסיטה", ar: "جامعة" }, { he: "ספרייה", ar: "مكتبة" }] },
  ],
  7: [
    { words: [{ he: "טלסקופ", ar: "تلسكوب" }, { he: "גלקסיה", ar: "مجرة" }] },
    { words: [{ he: "מצפן", ar: "بوصلة" }, { he: "מפה", ar: "خريطة" }] },
    { words: [{ he: "פסנתר", ar: "بيانو" }, { he: "תזמורת", ar: "أوركسترا" }] },
  ],
  8: [
    { words: [{ he: "הרפתקה", ar: "مغامرة" }, { he: "מסע", ar: "رحلة" }] },
    { words: [{ he: "חופשה", ar: "عطلة" }, { he: "יעד", ar: "وجهة" }] },
    { words: [{ he: "אנציקלופדיה", ar: "موسوعة" }, { he: "ידע", ar: "معرفة" }] },
  ],
  9: [
    { words: [{ he: "מציאות", ar: "واقع" }, { he: "דמיון", ar: "خيال" }] },
    { words: [{ he: "תגלית", ar: "اكتشاف" }, { he: "המצאה", ar: "اختراع" }] },
    { words: [{ he: "פילוסופיה", ar: "فلسفة" }, { he: "חכמה", ar: "حكمة" }] },
  ],
  10: [
    { words: [{ he: "אלגוריתם", ar: "خوارزمية" }, { he: "תכנות", ar: "برمجة" }] },
    { words: [{ he: "קוונטים", ar: "كم" }, { he: "פיזיקה", ar: "فيزياء" }] },
    { words: [{ he: "ארכיטקטורה", ar: "عمارة" }, { he: "בנייה", ar: "بناء" }] },
  ],
};

export function getWordSpellPair(dateStr, level) {
  const pool = wordSpellPairs[level] || wordSpellPairs[1];
  const seed = dateStr.replace(/-/g, "").split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 7), 0);
  return pool[seed % pool.length];
}