// Flag quiz data — country code + country names in Hebrew and Arabic
export const FLAGS = [
  { code: 'il', he: 'ישראל', ar: 'إسرائيل' },
  { code: 'us', he: 'ארצות הברית', ar: 'الولايات المتحدة' },
  { code: 'gb', he: 'בריטניה', ar: 'المملكة المتحدة' },
  { code: 'fr', he: 'צרפת', ar: 'فرنسا' },
  { code: 'de', he: 'גרמניה', ar: 'ألمانيا' },
  { code: 'it', he: 'איטליה', ar: 'إيطاليا' },
  { code: 'es', he: 'ספרד', ar: 'إسبانيا' },
  { code: 'pt', he: 'פורטוגל', ar: 'البرتغال' },
  { code: 'nl', he: 'הולנד', ar: 'هولندا' },
  { code: 'be', he: 'בלגיה', ar: 'بلجيكا' },
  { code: 'ch', he: 'שוויץ', ar: 'سويسرا' },
  { code: 'at', he: 'אוסטריה', ar: 'النمسا' },
  { code: 'se', he: 'שוודיה', ar: 'السويد' },
  { code: 'no', he: 'נורווגיה', ar: 'النرويج' },
  { code: 'dk', he: 'דנמרק', ar: 'الدنمارك' },
  { code: 'fi', he: 'פינלנד', ar: 'فنلندا' },
  { code: 'pl', he: 'פולין', ar: 'بولندا' },
  { code: 'gr', he: 'יוון', ar: 'اليونان' },
  { code: 'tr', he: 'טורקיה', ar: 'تركيا' },
  { code: 'ru', he: 'רוסיה', ar: 'روسيا' },
  { code: 'cn', he: 'סין', ar: 'الصين' },
  { code: 'jp', he: 'יפן', ar: 'اليابان' },
  { code: 'kr', he: 'קוריאה הדרומית', ar: 'كوريا الجنوبية' },
  { code: 'in', he: 'הודו', ar: 'الهند' },
  { code: 'br', he: 'ברזיל', ar: 'البرازيل' },
  { code: 'ar', he: 'ארגנטינה', ar: 'الأرجنتين' },
  { code: 'mx', he: 'מקסיקו', ar: 'المكسيك' },
  { code: 'ca', he: 'קנדה', ar: 'كندا' },
  { code: 'au', he: 'אוסטרליה', ar: 'أستراليا' },
  { code: 'za', he: 'דרום אפריקה', ar: 'جنوب أفريقيا' },
  { code: 'eg', he: 'מצרים', ar: 'مصر' },
  { code: 'sa', he: 'ערב הסעודית', ar: 'المملكة العربية السعودية' },
  { code: 'jo', he: 'ירדן', ar: 'الأردن' },
  { code: 'lb', he: 'לבנון', ar: 'لبنان' },
  { code: 'ir', he: 'איראן', ar: 'إيران' },
  { code: 'iq', he: 'עיראק', ar: 'العراق' },
  { code: 'th', he: 'תאילנד', ar: 'تايلاند' },
  { code: 'vn', he: 'וייטנאם', ar: 'فيتنام' },
  { code: 'ph', he: 'פיליפינים', ar: 'الفلبين' },
  { code: 'ng', he: 'ניגריה', ar: 'نيجيريا' },
];

export function getFlagUrl(code) {
  return `https://flagcdn.com/w160/${code}.png`;
}

export function getRandomQuestion(lang, usedFlags = []) {
  const available = FLAGS.filter(f => !usedFlags.includes(f.code));
  const pool = available.length >= 3 ? available : FLAGS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const correct = shuffled[0];
  const wrongs = shuffled.slice(1, 3);
  const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
  return {
    flag: correct.code,
    answer: correct[lang],
    options: options.map(o => o[lang]),
  };
}