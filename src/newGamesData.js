export const COGNITIVE_GAME_TYPES = {
  WORD_ASSOCIATION: "word_association",
  MENTAL_MATH: "mental_math",
  SEQUENCE_ORDER: "sequence_order",
};

export const wordAssociationBank = {
  1: [
    { id:"wa-1a", anchor:{he:"כלב",ar:"كلب"}, options:[{he:"נביחה",ar:"نباح"},{he:"ספינה",ar:"سفينة"},{he:"ענן",ar:"سحابة"},{he:"מחשב",ar:"كمبيوتر"}], correctIndex:0, explanation:{he:"כלב נובח",ar:"الكلب ينبح"} },
    { id:"wa-1b", anchor:{he:"שמש",ar:"شمس"}, options:[{he:"קרח",ar:"جليد"},{he:"חום",ar:"حرارة"},{he:"ים",ar:"بحر"},{he:"ספר",ar:"كتاب"}], correctIndex:1, explanation:{he:"השמש מביאה חום",ar:"الشمس تجلب الحرارة"} },
    { id:"wa-1c", anchor:{he:"לחם",ar:"خبز"}, options:[{he:"רכבת",ar:"قطار"},{he:"צמר",ar:"صوف"},{he:"קמח",ar:"دقيق"},{he:"עץ",ar:"خشب"}], correctIndex:2, explanation:{he:"לחם עשוי מקמח",ar:"الخبز مصنوع من الدقيق"} },
    { id:"wa-1d", anchor:{he:"גשם",ar:"مطر"}, options:[{he:"שדה",ar:"حقل"},{he:"טלפון",ar:"هاتف"},{he:"כביש",ar:"طريق"},{he:"מטרייה",ar:"مظلة"}], correctIndex:3, explanation:{he:"מטרייה מגנה מגשם",ar:"المظلة تحمي من المطر"} },
  ],
  2: [
    { id:"wa-2a", anchor:{he:"רופא",ar:"طبيب"}, options:[{he:"מכונית",ar:"سيارة"},{he:"בית חולים",ar:"مستشفى"},{he:"עץ",ar:"شجرة"},{he:"נהר",ar:"نهر"}], correctIndex:1, explanation:{he:"רופא עובד בבית חולים",ar:"الطبيب يعمل في المستشفى"} },
    { id:"wa-2b", anchor:{he:"מוזיקה",ar:"موسيقى"}, options:[{he:"אוטובוס",ar:"حافلة"},{he:"אוכל",ar:"طعام"},{he:"מנגינה",ar:"لحن"},{he:"ריהוט",ar:"أثاث"}], correctIndex:2, explanation:{he:"מוזיקה בנויה ממנגינות",ar:"الموسيقى تتكون من ألحان"} },
    { id:"wa-2c", anchor:{he:"ספרייה",ar:"مكتبة"}, options:[{he:"ספרים",ar:"كتب"},{he:"כדורגל",ar:"كرة قدم"},{he:"בישול",ar:"طبخ"},{he:"שחייה",ar:"سباحة"}], correctIndex:0, explanation:{he:"ספרייה מלאה בספרים",ar:"المكتبة مليئة بالكتب"} },
    { id:"wa-2d", anchor:{he:"חורף",ar:"شتاء"}, options:[{he:"שחמט",ar:"شطرنج"},{he:"שלג",ar:"ثلج"},{he:"ציור",ar:"رسم"},{he:"בשר",ar:"لحم"}], correctIndex:1, explanation:{he:"בחורף יורד שלג",ar:"في الشتاء يسقط الثلج"} },
  ],
  3: [
    { id:"wa-3a", anchor:{he:"שעון",ar:"ساعة"}, options:[{he:"פרח",ar:"زهرة"},{he:"אש",ar:"نار"},{he:"זמן",ar:"وقت"},{he:"ספינה",ar:"سفينة"}], correctIndex:2, explanation:{he:"שעון מודד זמן",ar:"الساعة تقيس الوقت"} },
    { id:"wa-3b", anchor:{he:"מצפן",ar:"بوصلة"}, options:[{he:"צפון",ar:"شمال"},{he:"מלח",ar:"ملح"},{he:"ריח",ar:"رائحة"},{he:"שיר",ar:"أغنية"}], correctIndex:0, explanation:{he:"מצפן מצביע צפון",ar:"البوصلة تشير إلى الشمال"} },
    { id:"wa-3c", anchor:{he:"ניתוח",ar:"جراحة"}, options:[{he:"כלי נגינה",ar:"آلة موسيقية"},{he:"מנתח",ar:"جراح"},{he:"שוק",ar:"سوق"},{he:"שמיים",ar:"سماء"}], correctIndex:1, explanation:{he:"ניתוח מבוצע ע״י מנתח",ar:"الجراحة يجريها الجراح"} },
    { id:"wa-3d", anchor:{he:"מגדלור",ar:"منارة"}, options:[{he:"אריה",ar:"أسد"},{he:"מכתב",ar:"رسالة"},{he:"אור",ar:"ضوء"},{he:"פרפר",ar:"فراشة"}], correctIndex:2, explanation:{he:"מגדלור פולט אור לספינות",ar:"المنارة تبث الضوء للسفن"} },
  ],
  4: [
    { id:"wa-4a", anchor:{he:"אנטיביוטיקה",ar:"مضاد حيوي"}, options:[{he:"חיידקים",ar:"بكتيريا"},{he:"מוזיקה",ar:"موسيقى"},{he:"ריקוד",ar:"رقص"},{he:"גבינה",ar:"جبن"}], correctIndex:0, explanation:{he:"אנטיביוטיקה הורגת חיידקים",ar:"المضاد الحيوي يقتل البكتيريا"} },
    { id:"wa-4b", anchor:{he:"כוח משיכה",ar:"الجاذبية"}, options:[{he:"אמנות",ar:"فن"},{he:"ניוטון",ar:"نيوتن"},{he:"מטבח",ar:"مطبخ"},{he:"שירה",ar:"شعر"}], correctIndex:1, explanation:{he:"ניוטון גילה את כוח המשיכה",ar:"نيوتن اكتشف الجاذبية"} },
    { id:"wa-4c", anchor:{he:"פרלמנט",ar:"برلمان"}, options:[{he:"ספורט",ar:"رياضة"},{he:"מוזיקה",ar:"موسيقى"},{he:"חקיקה",ar:"تشريع"},{he:"בישול",ar:"طبخ"}], correctIndex:2, explanation:{he:"פרלמנט מחוקק חוקים",ar:"البرلمان يسن القوانين"} },
    { id:"wa-4d", anchor:{he:"פוטוסינתזה",ar:"التمثيل الضوئي"}, options:[{he:"חשמל",ar:"كهرباء"},{he:"כלורופיל",ar:"الكلوروفيل"},{he:"מתכת",ar:"معدن"},{he:"מלח",ar:"ملح"}], correctIndex:1, explanation:{he:"פוטוסינתזה מתרחשת בכלורופיל",ar:"التمثيل الضوئي يحدث في الكلوروفيل"} },
  ],
  5: [
    { id:"wa-5a", anchor:{he:"אנטרופיה",ar:"الإنتروبيا"}, options:[{he:"סדר",ar:"نظام"},{he:"אקראיות",ar:"عشوائية"},{he:"מוזיקה",ar:"موسيقى"},{he:"בנייה",ar:"بناء"}], correctIndex:1, explanation:{he:"אנטרופיה מתארת אקראיות ואי-סדר",ar:"الإنتروبيا تصف الفوضى والعشوائية"} },
    { id:"wa-5b", anchor:{he:"סינפסה",ar:"المشبك العصبي"}, options:[{he:"שריר",ar:"عضلة"},{he:"ריאה",ar:"رئة"},{he:"נוירון",ar:"خلية عصبية"},{he:"עצם",ar:"عظمة"}], correctIndex:2, explanation:{he:"סינפסה מחברת בין נוירונים",ar:"المشبك يربط بين الخلايا العصبية"} },
    { id:"wa-5c", anchor:{he:"קוגניציה",ar:"الإدراك"}, options:[{he:"שרירים",ar:"عضلات"},{he:"עיכול",ar:"هضم"},{he:"חשיבה",ar:"تفكير"},{he:"נשימה",ar:"تنفس"}], correctIndex:2, explanation:{he:"קוגניציה = תהליכי חשיבה ותפיסה",ar:"الإدراك = عمليات التفكير والفهم"} },
    { id:"wa-5d", anchor:{he:"פרדוקס",ar:"المفارقة"}, options:[{he:"סתירה עצמית",ar:"تناقض ذاتي"},{he:"פתרון פשוט",ar:"حل بسيط"},{he:"מתמטיקה",ar:"رياضيات"},{he:"חוק",ar:"قانون"}], correctIndex:0, explanation:{he:"פרדוקס הוא אמירה שסותרת את עצמה",ar:"المفارقة عبارة تتناقض مع نفسها"} },
  ],
};

export const mentalMathBank = {
  1: [
    { id:"mm-1a", expression:"3 + 4", answer:7, options:[5,6,7,8], explanation:{he:"3 + 4 = 7",ar:"3 + 4 = 7"} },
    { id:"mm-1b", expression:"10 - 3", answer:7, options:[6,7,8,9], explanation:{he:"10 - 3 = 7",ar:"10 - 3 = 7"} },
    { id:"mm-1c", expression:"5 × 2", answer:10, options:[8,9,10,11], explanation:{he:"5 × 2 = 10",ar:"5 × 2 = 10"} },
    { id:"mm-1d", expression:"8 + 5", answer:13, options:[11,12,13,14], explanation:{he:"8 + 5 = 13",ar:"8 + 5 = 13"} },
  ],
  2: [
    { id:"mm-2a", expression:"15 + 27", answer:42, options:[38,40,42,44], explanation:{he:"15 + 27 = 42",ar:"15 + 27 = 42"} },
    { id:"mm-2b", expression:"50 - 18", answer:32, options:[28,30,32,34], explanation:{he:"50 - 18 = 32",ar:"50 - 18 = 32"} },
    { id:"mm-2c", expression:"6 × 7", answer:42, options:[36,40,42,48], explanation:{he:"6 × 7 = 42",ar:"6 × 7 = 42"} },
    { id:"mm-2d", expression:"36 ÷ 4", answer:9, options:[7,8,9,10], explanation:{he:"36 ÷ 4 = 9",ar:"36 ÷ 4 = 9"} },
  ],
  3: [
    { id:"mm-3a", expression:"123 + 79", answer:202, options:[196,200,202,208], explanation:{he:"123 + 79 = 202",ar:"123 + 79 = 202"} },
    { id:"mm-3b", expression:"200 - 67", answer:133, options:[123,130,133,143], explanation:{he:"200 - 67 = 133",ar:"200 - 67 = 133"} },
    { id:"mm-3c", expression:"8 × 12", answer:96, options:[88,92,96,104], explanation:{he:"8 × 12 = 96",ar:"8 × 12 = 96"} },
    { id:"mm-3d", expression:"144 ÷ 12", answer:12, options:[10,11,12,13], explanation:{he:"144 ÷ 12 = 12",ar:"144 ÷ 12 = 12"} },
  ],
  4: [
    { id:"mm-4a", expression:"17 × 8", answer:136, options:[128,132,136,140], explanation:{he:"17 × 8 = 136",ar:"17 × 8 = 136"} },
    { id:"mm-4b", expression:"250 - 137", answer:113, options:[107,110,113,117], explanation:{he:"250 - 137 = 113",ar:"250 - 137 = 113"} },
    { id:"mm-4c", expression:"15²", answer:225, options:[200,215,225,235], explanation:{he:"15² = 225",ar:"15² = 225"} },
    { id:"mm-4d", expression:"√196", answer:14, options:[12,13,14,15], explanation:{he:"√196 = 14",ar:"√196 = 14"} },
  ],
  5: [
    { id:"mm-5a", expression:"23 × 17", answer:391, options:[371,381,391,401], explanation:{he:"23 × 17 = 391",ar:"23 × 17 = 391"} },
    { id:"mm-5b", expression:"1000 - 347", answer:653, options:[643,650,653,663], explanation:{he:"1000 - 347 = 653",ar:"1000 - 347 = 653"} },
    { id:"mm-5c", expression:"√(144 + 81)", answer:15, options:[13,14,15,16], explanation:{he:"√225 = 15",ar:"√225 = 15"} },
    { id:"mm-5d", expression:"7³", answer:343, options:[321,333,343,353], explanation:{he:"7³ = 343",ar:"7³ = 343"} },
  ],
};

export const sequenceOrderBank = {
  1: [
    { id:"so-1a", category:{he:"שלבי יום",ar:"مراحل اليوم"}, items:[{he:"ארוחת בוקר",ar:"إفطار"},{he:"שינה",ar:"نوم"},{he:"ארוחת ערב",ar:"عشاء"},{he:"ארוחת צהריים",ar:"غداء"}], correctOrder:[0,3,2,1] },
    { id:"so-1b", category:{he:"גידול צמח",ar:"نمو النبات"}, items:[{he:"פרי",ar:"ثمرة"},{he:"זרע",ar:"بذرة"},{he:"פרח",ar:"زهرة"},{he:"שתיל",ar:"شتلة"}], correctOrder:[1,3,2,0] },
    { id:"so-1c", category:{he:"בישול תה",ar:"تحضير الشاي"}, items:[{he:"שתייה",ar:"الشرب"},{he:"הרתחת מים",ar:"غلي الماء"},{he:"הוספת תיק תה",ar:"إضافة كيس الشاي"},{he:"מזיגה לכוס",ar:"صب في الكوب"}], correctOrder:[1,3,2,0] },
  ],
  2: [
    { id:"so-2a", category:{he:"כתיבת מכתב",ar:"كتابة رسالة"}, items:[{he:"שליחה",ar:"الإرسال"},{he:"כתיבת תוכן",ar:"كتابة المحتوى"},{he:"חתימה",ar:"التوقيع"},{he:"פנייה לנמען",ar:"مخاطبة المستلم"}], correctOrder:[3,1,2,0] },
    { id:"so-2b", category:{he:"חיי פרפר",ar:"دورة حياة الفراشة"}, items:[{he:"פרפר",ar:"فراشة"},{he:"ביצה",ar:"بيضة"},{he:"זחל",ar:"يرقة"},{he:"גולם",ar:"شرنقة"}], correctOrder:[1,2,3,0] },
    { id:"so-2c", category:{he:"בניית בית",ar:"بناء منزل"}, items:[{he:"גג",ar:"سقف"},{he:"יסודות",ar:"أساس"},{he:"קירות",ar:"جدران"},{he:"חלונות",ar:"نوافذ"}], correctOrder:[1,2,0,3] },
  ],
  3: [
    { id:"so-3a", category:{he:"היסטוריה — סדר כרונולוגי",ar:"التاريخ — ترتيب زمني"}, items:[{he:"מהפכה צרפתית",ar:"الثورة الفرنسية"},{he:"מלחמת העולם הראשונה",ar:"الحرب العالمية الأولى"},{he:"הרנסנס",ar:"عصر النهضة"},{he:"נחיתה על הירח",ar:"الهبوط على القمر"}], correctOrder:[2,0,1,3] },
    { id:"so-3b", category:{he:"עיכול מזון",ar:"هضم الطعام"}, items:[{he:"ספיגה במעי",ar:"الامتصاص في الأمعاء"},{he:"לעיסה",ar:"المضغ"},{he:"בטן",ar:"المعدة"},{he:"פה",ar:"الفم"}], correctOrder:[3,1,2,0] },
    { id:"so-3c", category:{he:"כתיבת מחקר",ar:"كتابة بحث"}, items:[{he:"מסקנות",ar:"استنتاجات"},{he:"שאלת מחקר",ar:"سؤال البحث"},{he:"ניתוח תוצאות",ar:"تحليل النتائج"},{he:"איסוף נתונים",ar:"جمع البيانات"}], correctOrder:[1,3,2,0] },
  ],
  4: [
    { id:"so-4a", category:{he:"פיתוח תרופה",ar:"تطوير دواء"}, items:[{he:"אישור FDA",ar:"موافقة هيئة الغذاء والدواء"},{he:"ניסויים קליניים",ar:"تجارب سريرية"},{he:"מחקר מעבדה",ar:"بحث مختبري"},{he:"שיווק",ar:"تسويق"}], correctOrder:[2,1,0,3] },
    { id:"so-4b", category:{he:"מחזור מים בטבע",ar:"دورة المياه في الطبيعة"}, items:[{he:"גשם",ar:"مطر"},{he:"אידוי",ar:"تبخر"},{he:"עננים",ar:"سحب"},{he:"נגר עילי",ar:"جريان سطحي"}], correctOrder:[1,2,0,3] },
    { id:"so-4c", category:{he:"למידה חדשה",ar:"تعلم شيء جديد"}, items:[{he:"שינון",ar:"حفظ"},{he:"הבנה",ar:"فهم"},{he:"חשיפה לנושא",ar:"التعرض للموضوع"},{he:"יישום",ar:"تطبيق"}], correctOrder:[2,1,0,3] },
  ],
  5: [
    { id:"so-5a", category:{he:"אבולוציה של מחשבים",ar:"تطور الحواسيب"}, items:[{he:"ניידים חכמים",ar:"هواتف ذكية"},{he:"ENIAC — מחשב ראשון",ar:"ENIAC أول كمبيوتر"},{he:"מחשב אישי (PC)",ar:"الكمبيوتر الشخصي"},{he:"מיקרו-מעבד",ar:"المعالج الدقيق"}], correctOrder:[1,3,2,0] },
    { id:"so-5b", category:{he:"תהליך התמיינות תאים",ar:"عملية تمايز الخلايا"}, items:[{he:"תא מתמחה",ar:"خلية متخصصة"},{he:"תא גזע",ar:"خلية جذعية"},{he:"חלוקת תאים",ar:"انقسام خلوي"},{he:"אות גנטי",ar:"إشارة جينية"}], correctOrder:[1,2,3,0] },
    { id:"so-5c", category:{he:"פיתוח AI",ar:"تطوير الذكاء الاصطناعي"}, items:[{he:"פריסה",ar:"نشر"},{he:"אימון מודל",ar:"تدريب النموذج"},{he:"איסוף נתונים",ar:"جمع البيانات"},{he:"הערכה",ar:"تقييم"}], correctOrder:[2,1,3,0] },
  ],
};

function dateSeed(dateStr) {
  return dateStr.replace(/-/g,"").split("").reduce((a,c,i)=>a+c.charCodeAt(0)*(i+7),0);
}
function seededRand(seed) {
  let s = Math.abs(seed)||1;
  return ()=>{ s=(s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; };
}

export function getNewGamesDailySet(dateStr, level) {
  const rand = seededRand(dateSeed(dateStr));
  const pick = (bank) => { const pool = bank[level]||bank[1]; return pool[Math.floor(rand()*pool.length)]; };
  return {
    word_association: pick(wordAssociationBank),
    mental_math:      pick(mentalMathBank),
    sequence_order:   pick(sequenceOrderBank),
  };
}