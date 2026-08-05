const L = {
  he: {
    title: "האתגר של היום",
    subtitle: "5 אתגרים קצרים • כ-10 דקות",
    start: "▶  התחילו את האתגר היומי",
    streakOn: (n) => `רצף של ${n} ימים! המשיכו כך!`,
    streakOff: "התחילו את הרצף שלכם היום!",
    activities: ["זיכרון", "היגיון", "מספרים"],
  },
  ar: {
    title: "تحدي اليوم",
    subtitle: "٥ تحديات قصيرة • حوالي ١٠ دقائق",
    start: "▶  ابدأ تحدي اليوم",
    streakOn: (n) => `سلسلة ${n} أيام! واصلوا!`,
    streakOff: "ابدأ سلسلتك اليوم!",
    activities: ["الذاكرة", "المنطق", "الأرقام"],
  },
};

export default function DailyHeroCard({ lang = "he", streak = 0, onStart }) {
  const t = L[lang] || L.he;
  return (
    <div
      className="rounded-2xl p-6 bg-gradient-to-br from-primary to-teal-600 text-white shadow-xl"
      role="region"
      aria-label={t.title}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" aria-hidden="true">🔥</span>
        <span className="font-semibold text-lg">
          {streak > 0 ? t.streakOn(streak) : t.streakOff}
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-1">🧠 {t.title}</h1>
      <p className="text-lg opacity-90 mb-6">{t.subtitle}</p>

      <div className="flex gap-2 flex-wrap mb-6">
        {t.activities.map((a) => (
          <span key={a} className="bg-white/20 rounded-full px-4 py-1.5 text-base font-medium">
            {a}
          </span>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-white text-primary font-bold text-xl rounded-xl py-4 px-6 shadow-lg hover:bg-white/90 active:scale-95 transition-all duration-150 min-h-[64px]"
      >
        {t.start}
      </button>
    </div>
  );
}