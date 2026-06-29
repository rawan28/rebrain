import React, { useState, useEffect } from "react";

const LABELS = {
  he: { title: "🧠 זיכרון חזותי", memorize: "זכור את הפריטים!", recall: "בחר מה שראית", submit: "בדוק" },
  ar: { title: "🧠 الذاكرة البصرية", memorize: "تذكّر العناصر!", recall: "اختر ما رأيته", submit: "تحقق" },
};

export default function VisualMemoryGame({ data, lang, onComplete }) {
  const [phase, setPhase] = useState("show");
  const [timeLeft, setTimeLeft] = useState(data.showMs / 1000);
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const t = LABELS[lang] || LABELS.he;

  useEffect(() => {
    if (phase !== "show") return;
    if (timeLeft <= 0) { setPhase("recall"); return; }
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const toggle = (item) => {
    if (submitted) return;
    const next = new Set(selected);
    next.has(item) ? next.delete(item) : next.add(item);
    setSelected(next);
  };

  const handleSubmit = () => {
    const shownSet = new Set(data.shown);
    const correct = [...selected].filter(v => shownSet.has(v)).length;
    const wrong = [...selected].filter(v => !shownSet.has(v)).length;
    setSubmitted(true);
    setTimeout(() => onComplete(Math.max(0, correct - wrong), data.shown.length), 600);
  };

  const shownSet = new Set(data.shown);
  const getColor = (item) => {
    if (!submitted) return selected.has(item) ? "bg-primary text-primary-foreground scale-95" : "bg-card border border-border";
    if (shownSet.has(item) && selected.has(item)) return "bg-emerald-500 text-white";
    if (shownSet.has(item) && !selected.has(item)) return "ring-2 ring-amber-400 bg-card";
    if (!shownSet.has(item) && selected.has(item)) return "bg-destructive text-destructive-foreground";
    return "bg-card border border-border opacity-40";
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="flex flex-col items-center gap-6 p-4 w-full">
      <h2 className="text-2xl font-bold">{t.title}</h2>
      {data.instructions && (
        <p className="text-base text-muted-foreground text-center">{data.instructions[lang] || data.instructions.he}</p>
      )}

      {phase === "show" && (
        <>
          <p className="text-lg text-muted-foreground">{t.memorize}</p>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / (data.showMs / 1000)) * 100}%` }} />
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.shown.map((item, i) => (
              <div key={i} className={`${data.shown.length > 8 ? 'w-14 h-14 text-3xl' : 'w-20 h-20 text-5xl'} rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg`}>
                {item}
              </div>
            ))}
          </div>
        </>
      )}

      {phase === "recall" && (
        <>
          <p className="text-lg text-muted-foreground text-center">{t.recall}</p>
          <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${data.allItems.length > 16 ? 6 : data.allItems.length > 12 ? 5 : 4}, 1fr)`, maxWidth: data.allItems.length > 16 ? '28rem' : '20rem' }}>
            {data.allItems.map((item, i) => (
              <button key={i} onClick={() => toggle(item)}
                className={`${data.allItems.length > 16 ? 'h-12 text-3xl' : 'h-16 text-4xl'} rounded-2xl transition-all duration-150 ${getColor(item)}`}>
                {item}
              </button>
            ))}
          </div>
          {!submitted && (
            <button onClick={handleSubmit}
              className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow active:scale-95">
              {t.submit}
            </button>
          )}
        </>
      )}
    </div>
  );
}