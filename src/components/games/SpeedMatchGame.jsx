import React, { useState } from "react";

const LABELS = {
  he: { title: "🎯 מהירות התאמה", find: "מצא את כל:", submit: "סיימתי!", found: "מצאת", of: "מתוך" },
  ar: { title: "🎯 سرعة التطابق", find: "ابحث عن جميع:", submit: "انتهيت!", found: "وجدت", of: "من" },
};

export default function SpeedMatchGame({ data, lang, onComplete }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const t = LABELS[lang] || LABELS.he;

  const correctIndices = new Set(data.grid.map((v, i) => v === data.target ? i : -1).filter(i => i >= 0));

  const toggle = (i) => {
    if (submitted) return;
    const next = new Set(selected);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelected(next);
  };

  const handleSubmit = () => {
    const hits = [...selected].filter(i => correctIndices.has(i)).length;
    const misses = [...selected].filter(i => !correctIndices.has(i)).length;
    const score = Math.max(0, hits - misses);
    setSubmitted(true);
    setTimeout(() => onComplete(score, correctIndices.size), 600);
  };

  const getColor = (i) => {
    if (!submitted) return selected.has(i) ? "bg-primary text-primary-foreground border-primary scale-95" : "bg-card text-foreground border-border";
    if (correctIndices.has(i) && selected.has(i)) return "bg-emerald-500 text-white border-emerald-500";
    if (correctIndices.has(i) && !selected.has(i)) return "bg-amber-400 text-white border-amber-400";
    if (!correctIndices.has(i) && selected.has(i)) return "bg-destructive text-destructive-foreground border-destructive";
    return "bg-card text-foreground border-border opacity-40";
  };

  const cols = data.gridCols || 4;

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="flex flex-col items-center gap-5 p-4 w-full">
      <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
      {data.instructions && (
        <p className="text-base text-muted-foreground text-center">{data.instructions[lang] || data.instructions.he}</p>
      )}
      <div className="flex items-center gap-3 bg-muted rounded-2xl px-6 py-3">
        <span className="text-lg text-muted-foreground">{t.find}</span>
        <span className="text-5xl">{data.target}</span>
      </div>
      <div className="grid gap-2 w-full max-w-xs" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {data.grid.map((item, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`h-14 rounded-xl border-2 text-3xl font-bold transition-all duration-150 ${getColor(i)}`}>
            {item}
          </button>
        ))}
      </div>
      {!submitted && (
        <button onClick={handleSubmit}
          className="mt-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow active:scale-95">
          {t.submit}
        </button>
      )}
      {submitted && (
        <p className="text-lg font-semibold text-muted-foreground">
          {t.found} {[...selected].filter(i => correctIndices.has(i)).length} {t.of} {correctIndices.size}
        </p>
      )}
    </div>
  );
}