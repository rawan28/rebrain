import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const MESSAGES = {
  he: [
    'כל יום שבו אתה מאמן את המוח שלך הוא צעד לקראת חשיבה חדה יותר. בוא נתחיל!',
    'המוח שלך כמו שריר — ככל שתתרגל יותר, כך תרגיש חזק יותר. הגיע הזמן לאימון היומי!',
    'רגע קטן של אימון מוחי יומי עושה פלאים. מוכן לאתגר של היום?',
    'אל תשכח — קצת תרגול כל יום שומר על מוחך פעיל וצעיר. בוא נשחק!',
    'כל חידה שאתה פותר מחזקת את החשיבה שלך. נסה משחק קצר עכשיו!',
    'התמדה היא הסוד. גם היום — רק כמה דקות של תרגול יעשו את ההבדל. כנס ותתחיל!',
    'יום חדש, הזדמנות חדשה לאמן את המוח. מה תבחר היום — זיכרון, היגיון או מספרים?',
  ],
  ar: [
    'كل يوم تتدرب فيه على عقلك هو خطوة نحو تفكير أكثر حدة. هيا نبدأ!',
    'عقلك كالعضلة — كلما مارست أكثر، شعرت بقوة أكبر. حان وقت التمرين اليومي!',
    'لحظة قصيرة من التمرين الذهني اليومي تصنع المعجزات. مستعد لتحدّي اليوم؟',
    'لا تنسَ — القليل من التمرين كل يوم يبقي عقلك نشطاً وشاباً. هيا نلعب!',
    'كل لغز تحله يقوّي تفكيرك. جرّب لعبة قصيرة الآن!',
    'الاستمرارية هي السر. حتى اليوم — بضع دقائق من التمرين تصنع الفرق. ادخل وابدأ!',
    'يوم جديد، فرصة جديدة لتدريب عقلك. ماذا ستختار اليوم — الذاكرة، المنطق أم الأرقام؟',
  ],
};

const SUBJECTS = {
  he: 'תזכורת ReBrain יומית 🧠',
  ar: 'تذكير ReBrain اليومي 🧠',
};

const FOOTERS = {
  he: 'כנס ל-ReBrain והתחל את התרגול היומי שלך.',
  ar: 'ادخل إلى ReBrain وابدأ تمرينك اليومي.',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const subs = await base44.asServiceRole.entities.ReminderSubscription.filter({ enabled: true });

    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour: 'numeric',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = {};
    fmt.formatToParts(now).forEach((p) => { parts[p.type] = p.value; });
    let currentHour = parseInt(parts.hour, 10);
    if (currentHour === 24) currentHour = 0;
    const todayKey = `${parts.year}-${parts.month}-${parts.day}`;
    const dayIndex = now.getDay();

    let sent = 0;
    let attempted = 0;
    for (const sub of subs) {
      if (sub.hour !== currentHour) continue;
      if (sub.last_sent_date === todayKey) continue;
      attempted++;
      const lang = sub.lang || 'he';
      const msgs = MESSAGES[lang] || MESSAGES.he;
      const message = msgs[dayIndex % msgs.length];
      const body = `${message}\n\n${FOOTERS[lang] || FOOTERS.he}\n\n— ReBrain`;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sub.email,
        subject: SUBJECTS[lang] || SUBJECTS.he,
        body,
      });
      await base44.asServiceRole.entities.ReminderSubscription.update(sub.id, { last_sent_date: todayKey });
      sent++;
    }
    return Response.json({ success: true, sent, attempted, hour: currentHour, date: todayKey });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});