import React, { useState, useEffect, useRef } from "react";

const LABELS = {
  he: { title: "🔍 סריקת קשב", find: "מצא את:", fast: "מהיר! ⚡", good: "כל הכבוד! ✅", slow: "ניסיון טוב 🙂", seconds: " שניות" },
  ar: { title: "🔍 مسح الانتباه", find: "ابحث عن:", fast: "سريع! ⚡", good: "أحسنت! ✅", slow: "محاولة جيدة 🙂", seconds: " ثوانٍ" },
};

export default function AttentionScanGame({ data, lang, onComplete }) {
  const [found, setFound] = useState(null);
  const [elapsed, setElapsed] = useState("0.0");
  const startTime = useRef(Date.now());
  const t = LABELS[lang] || LABELS.he;

  useEffect(() => {
    if (found !== null) return;
    const id = setInterval(() => setElapsed(((Date.now() - startTime.current) / 1000).toFixed(1)), 100);
    return () => clearInterval(id);
  }, [found]);

  const handleTap = (item, i) => {
    if (found !== null) return;
    const sec = (Date.now() - startTime.current) / 1000;
    const time = sec.toFixed(1);
    if (item === data.target) {
      const score = sec < 3 ? 5 : sec < 6 ? 4 : sec < 10 ? 3 : sec < 15 ? 2 : 1;
      setFound({ correct: true, index: i, time });
      setTimeout(() => onComplete(score, 5), 800);
    } else {
      setFound({ correct: false, index: i, time });
      setTimeout(() => onComplete(0, 5), 800);
    }
  };

  const getColor = (item, i) => {
    if (found === null) return "bg-card border border-border text-foreground";
    if (item === data.target) return "bg-emerald-500 text-white border-emerald-500";
    if (found.index === i && !found.correct) return "bg-destructive text-destructive-foreground border-destructive";
    return "bg-card border border-border text-muted-foreground opacity-60";
  };

  const cols = data.gridCols || 5;

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="flex flex-col items-center gap-5 p-4 w-full">
      <h2 className="text-2xl font-bold">{t.title}</h2>
      {data.instructions && (
        <p className="text-base text-muted-foreground text-center">{data.instructions[lang] || data.instructions.he}</p>
      )}
      <div className="flex items-center gap-3 bg-muted rounded-2xl px-6 py-3">
        <span className="text-lg text-muted-foreground">{t.find}</span>
        <span className="text-5xl font-bold text-foreground">{data.target}</span>
      </div>
      {found === null && <p className="text-sm text-muted-foreground">{elapsed}s</p>}
      <div className="grid gap-2 w-full max-w-xs" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {data.grid.map((item, i) => (
          <button key={i} onClick={() => handleTap(item, i)}
            className={`h-12 rounded-xl text-xl font-bold border transition-all duration-100 ${getColor(item, i)}`}>
            {item}
          </button>
        ))}
      </div>
      {found && (
        <p className={`text-xl font-bold ${found.correct ? "text-emerald-500" : "text-destructive"}`}>
          {found.correct ? (parseFloat(found.time) < 5 ? t.fast : t.good) : t.slow} — {found.time}{t.seconds}
        </p>
      )}
    </div>
  );
}