// Flag quiz data — emoji flag + country names in Hebrew and Arabic
export const FLAGS = [
  { flag: '🇮🇱', he: 'ישראל', ar: 'إسرائيل' },
  { flag: '🇺🇸', he: 'ארצות הברית', ar: 'الولايات المتحدة' },
  { flag: '🇬🇧', he: 'בריטניה', ar: 'المملكة المتحدة' },
  { flag: '🇫🇷', he: 'צרפת', ar: 'فرنسا' },
  { flag: '🇩🇪', he: 'גרמניה', ar: 'ألمانيا' },
  { flag: '🇮🇹', he: 'איטליה', ar: 'إيطاليا' },
  { flag: '🇪🇸', he: 'ספרד', ar: 'إسبانيا' },
  { flag: '🇵🇹', he: 'פורטוגל', ar: 'البرتغال' },
  { flag: '🇳🇱', he: 'הולנד', ar: 'هولندا' },
  { flag: '🇧🇪', he: 'בלגיה', ar: 'بلجيكا' },
  { flag: '🇨🇭', he: 'שוויץ', ar: 'سويسرا' },
  { flag: '🇦🇹', he: 'אוסטריה', ar: 'النمسا' },
  { flag: '🇸🇪', he: 'שוודיה', ar: 'السويد' },
  { flag: '🇳🇴', he: 'נורווגיה', ar: 'النرويج' },
  { flag: '🇩🇰', he: 'דנמרק', ar: 'الدنمارك' },
  { flag: '🇫🇮', he: 'פינלנד', ar: 'فنلندا' },
  { flag: '🇵🇱', he: 'פולין', ar: 'بولندا' },
  { flag: '🇬🇷', he: 'יוון', ar: 'اليونان' },
  { flag: '🇹🇷', he: 'טורקיה', ar: 'تركيا' },
  { flag: '🇷🇺', he: 'רוסיה', ar: 'روسيا' },
  { flag: '🇨🇳', he: 'סין', ar: 'الصين' },
  { flag: '🇯🇵', he: 'יפן', ar: 'اليابان' },
  { flag: '🇰🇷', he: 'קוריאה הדרומית', ar: 'كوريا الجنوبية' },
  { flag: '🇮🇳', he: 'הודו', ar: 'الهند' },
  { flag: '🇧🇷', he: 'ברזיל', ar: 'البرازيل' },
  { flag: '🇦🇷', he: 'ארגנטינה', ar: 'الأرجنتين' },
  { flag: '🇲🇽', he: 'מקסיקו', ar: 'المكسيك' },
  { flag: '🇨🇦', he: 'קנדה', ar: 'كندا' },
  { flag: '🇦🇺', he: 'אוסטרליה', ar: 'أستراليا' },
  { flag: '🇿🇦', he: 'דרום אפריקה', ar: 'جنوب أفريقيا' },
  { flag: '🇪🇬', he: 'מצרים', ar: 'مصر' },
  { flag: '🇸🇦', he: 'ערב הסעודית', ar: 'المملكة العربية السعودية' },
  { flag: '🇯🇴', he: 'ירדן', ar: 'الأردن' },
  { flag: '🇱🇧', he: 'לבנון', ar: 'لبنان' },
  { flag: '🇮🇷', he: 'איראן', ar: 'إيران' },
  { flag: '🇮🇶', he: 'עיראק', ar: 'العراق' },
  { flag: '🇹🇭', he: 'תאילנד', ar: 'تايلاند' },
  { flag: '🇻🇳', he: 'וייטנאם', ar: 'فيتنام' },
  { flag: '🇵🇭', he: 'פיליפינים', ar: 'الفلبين' },
  { flag: '🇳🇬', he: 'ניגריה', ar: 'نيجيريا' },
];

export function getRandomQuestion(lang, usedFlags = []) {
  const available = FLAGS.filter(f => !usedFlags.includes(f.flag));
  const pool = available.length >= 3 ? available : FLAGS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const correct = shuffled[0];
  // Pick 2 wrong options
  const wrongs = shuffled.slice(1, 3);
  const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
  return {
    flag: correct.flag,
    answer: correct[lang],
    options: options.map(o => o[lang]),
  };
}