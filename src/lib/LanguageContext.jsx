import { createContext, useContext, useState } from 'react';

export const translations = {
  he: {
    dir: 'rtl',
    appName: 'ReBrain',
    appSubtitle: 'שמור על מוחך פעיל',
    dailyBrainTraining: 'אימון מוח יומי',
    welcomeTitle: 'ברוכים הבאים ל-ReBrain',
    welcomeDesc: 'בחר תרגיל כדי להתחיל. כל משחק מסתגל לרמתך — ככל שאתה מצליח יותר, כך האתגר גדל!',
    encouragement: 'קצת תרגול כל יום עושה פלאים',
    // Nav
    navHome: 'בית',
    navMemory: 'זיכרון',
    navLogic: 'היגיון',
    navNumbers: 'מספרים',
    navFlags: 'דגלים',
    navWord: 'מילים',
    navProgress: 'התקדמות',
    wordTitle: 'השלמת מילה',
    wordDesc: 'נחש את האותיות החסרות במילה. אתגר שפתי מעולה!',
    wordDescLong: 'תקבל מילה עם אותיות חסרות — לחץ על האותיות הנכונות כדי להשלים אותה.',
    wordSubDesc: 'השלם את המילה',
    wordCheck: 'בדוק',
    flagTitle: 'נחש את הדגל',
    flagDesc: 'זהה דגלים מרחבי העולם. מצוין לאימון הזיכרון הגיאוגרפי!',
    flagDescLong: 'תראה דגל ועליך לבחור את שם המדינה הנכון מתוך שלוש אפשרויות.',
    flagSubDesc: 'בחר את שם המדינה',
    whichCountry: 'לאיזו מדינה שייך הדגל הזה?',
    progressTitle: 'התקדמות אישית',
    progressDesc: 'עקוב אחר השיפור שלך לאורך זמן',
    totalSessions: 'סה"כ משחקים',
    bestStreak: 'רצף מקסימלי',
    maxLevel: 'רמה מקסימלית',
    avgAccuracy: 'דיוק ממוצע',
    levelProgress: 'שיפור ברמת הקושי',
    streakProgress: 'רצפי הצלחה',
    accuracyProgress: 'דיוק לאורך זמן',
    noDataYet: 'עוד אין נתונים — שחק כמה משחקים כדי לראות גרפים!',
    session: 'סשן',
    // Game titles
    memoryTitle: 'קלפי זיכרון',
    memoryDesc: 'הפוך קלפים ומצא זוגות תואמים. מצוין לאימון הזיכרון!',
    memoryDescLong: 'הפוך שני קלפים בכל פעם ומצא את כל הזוגות התואמים. פחות מהלכים — יותר טוב!',
    memorySubDesc: 'מצא את כל הזוגות',
    logicTitle: 'חידות היגיון',
    logicDesc: 'מצא את הדפוס ובחר מה בא אחר כך. חדד את החשיבה!',
    logicDescLong: 'הסתכל על הדפוס או הקבוצה ובחר את התשובה הנכונה. תחשוב טוב!',
    logicSubDesc: 'מצא את הדפוס',
    numbersTitle: 'חידון מספרים',
    numbersDesc: 'פתור בעיות מתמטיות המסתגלות לרמתך. תמשיך לספור!',
    numbersDescLong: 'פתור בעיות מתמטיות שמתקשות ככל שאתה מתקדם. קח את הזמן שלך!',
    numbersSubDesc: 'פתור את הבעיה',
    // Game UI
    startPlaying: 'התחל לשחק',
    startOver: 'התחל מחדש',
    nextPuzzle: 'חידה הבאה',
    nextQuestion: 'שאלה הבאה',
    level: 'רמה',
    streak: 'רצף',
    score: 'ניקוד',
    moves: 'מהלכים',
    pairsFound: 'זוגות שנמצאו',
    // Feedback
    correct: 'כל הכבוד!',
    incorrect: 'לא בדיוק',
    greatThinking: 'חשיבה מעולה!',
    theAnswerWas: 'התשובה הייתה',
    completedIn: 'הושלם ב־',
    movesWord: 'מהלכים',
    tryFewer: 'נסה פחות מהלכים בפעם הבאה!',
    excellent: 'מצוין!',
    // Logic questions
    whatComesNext: 'מה בא אחר כך בדפוס הזה?',
    whatNumberNext: 'איזה מספר בא אחר כך?',
    whatDoesntBelong: 'מה לא שייך?',
  },
  ar: {
    dir: 'rtl',
    appName: 'ReBrain',
    appSubtitle: 'حافظ على نشاط عقلك',
    dailyBrainTraining: 'تمرين دماغي يومي',
    welcomeTitle: 'مرحباً بك في ReBrain',
    welcomeDesc: 'اختر تمريناً للبدء. كل لعبة تتكيف مع مستواك — كلما أحسنت، زادت الصعوبة!',
    encouragement: 'قليل من التمرين كل يوم يصنع المعجزات',
    // Nav
    navHome: 'الرئيسية',
    navMemory: 'الذاكرة',
    navLogic: 'المنطق',
    navNumbers: 'الأرقام',
    navFlags: 'الأعلام',
    navWord: 'كلمات',
    navProgress: 'التقدم',
    wordTitle: 'أكمل الكلمة',
    wordDesc: 'خمّن الحروف الناقصة في الكلمة. تحدٍّ لغوي رائع!',
    wordDescLong: 'ستحصل على كلمة بحروف ناقصة — اضغط على الحروف الصحيحة لإكمالها.',
    wordSubDesc: 'أكمل الكلمة',
    wordCheck: 'تحقق',
    flagTitle: 'خمّن العلم',
    flagDesc: 'تعرف على أعلام دول العالم. رائع لتدريب الذاكرة الجغرافية!',
    flagDescLong: 'سترى علمًا عليك اختيار اسم الدولة الصحيح من بين ثلاثة خيارات.',
    flagSubDesc: 'اختر اسم الدولة',
    whichCountry: 'لأي دولة ينتمي هذا العلم؟',
    progressTitle: 'تقدمي الشخصي',
    progressDesc: 'تتبع تحسنك عبر الزمن',
    totalSessions: 'إجمالي الجلسات',
    bestStreak: 'أفضل سلسلة',
    maxLevel: 'أعلى مستوى',
    avgAccuracy: 'الدقة المتوسطة',
    levelProgress: 'تطور مستوى الصعوبة',
    streakProgress: 'سلاسل النجاح',
    accuracyProgress: 'الدقة عبر الزمن',
    noDataYet: 'لا توجد بيانات بعد — العب بعض الجولات لرؤية الرسوم البيانية!',
    session: 'جلسة',
    // Game titles
    memoryTitle: 'بطاقات الذاكرة',
    memoryDesc: 'اقلب البطاقات وابحث عن الأزواج المتطابقة. رائع لتدريب ذاكرتك!',
    memoryDescLong: 'اقلب بطاقتين في كل مرة وابحث عن جميع الأزواج المتطابقة. كلما قلّت الحركات كان أفضل!',
    memorySubDesc: 'ابحث عن جميع الأزواج',
    logicTitle: 'ألغاز منطقية',
    logicDesc: 'ابحث عن النمط واختر ما يأتي بعده. شحذ تفكيرك!',
    logicDescLong: 'انظر إلى النمط أو المجموعة واختر الإجابة الصحيحة. فكّر جيداً!',
    logicSubDesc: 'ابحث عن النمط',
    numbersTitle: 'اختبار الأرقام',
    numbersDesc: 'حل مسائل رياضية تتكيف مع مستواك. استمر في العد!',
    numbersDescLong: 'حل مسائل رياضية تزداد صعوبة مع تقدمك. خذ وقتك — الدقة أهم من السرعة!',
    numbersSubDesc: 'حل المسألة',
    // Game UI
    startPlaying: 'ابدأ اللعب',
    startOver: 'ابدأ من جديد',
    nextPuzzle: 'اللغز التالي',
    nextQuestion: 'السؤال التالي',
    level: 'المستوى',
    streak: 'سلسلة',
    score: 'النتيجة',
    moves: 'الحركات',
    pairsFound: 'أزواج تم إيجادها',
    // Feedback
    correct: 'أحسنت!',
    incorrect: 'ليس تماماً',
    greatThinking: 'تفكير رائع!',
    theAnswerWas: 'الإجابة كانت',
    completedIn: 'تم الإنهاء في',
    movesWord: 'حركات',
    tryFewer: 'حاول بحركات أقل في المرة القادمة!',
    excellent: 'ممتاز!',
    // Logic questions
    whatComesNext: 'ما الذي يأتي بعد ذلك في هذا النمط؟',
    whatNumberNext: 'ما هو الرقم التالي؟',
    whatDoesntBelong: 'أيهما لا ينتمي؟',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('he');
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}