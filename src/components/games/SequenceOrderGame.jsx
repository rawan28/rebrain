import React, { useState } from "react";

export default function SequenceOrderGame({ data, lang, onComplete }) {
  const [tapped, setTapped] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const isRTL = lang === "ar";
  const labels = {
    he: { title: "📋 סדר נכון", instruction: "הקש את הפריטים בסדר הנכון:", reset: "אפס", check: "בדוק", correct: "מעולה! ✅", wrong: "לא מדויק ❌" },
    ar: { title: "📋 الترتيب الصحيح", instruction: "انقر العناصر بالترتيب الصحيح:", reset: "إعادة", check: "تحقق", correct: "ممتاز! ✅", wrong: "غير دقيق ❌" },
  };
  const t = labels[lang] || labels.he;

  const handleTap = (idx) => {
    if (submitted || tapped.includes(idx)) return;
    setTapped(prev => [...prev, idx]);
  };

  const handleCheck = () => {
    const correct = tapped.every((v, i) => v === data.correctOrder[i]) && tapped.length === data.correctOrder.length;
    setSubmitted(true);
    setTimeout(() => onComplete(correct ? data.items.length : 0, data.items.length), 800);
  };

  const getItemStyle = (idx) => {
    const tapPos = tapped.indexOf(idx);
    if (!submitted) {
      if (tapPos >= 0) return "bg-primary text-primary-foreground opacity-80";
      return "bg-card border-2 border-border text-foreground";
    }
    if (data.correctOrder[tapPos] === idx) return "bg-emerald-500 text-white";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col items-center gap-5 p-4 w-full">
      <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
      <p className="text-base text-muted-foreground text-center">{t.instruction}</p>
      <p className="text-sm font-semibold text-primary">{data.category[lang]}</p>

      {/* Order indicator */}
      <div className="flex gap-2 min-h-[36px] flex-wrap justify-center">
        {tapped.map((idx, pos) => (
          <span key={pos} className="px-3 py-1 rounded-full bg-muted text-sm text-foreground font-semibold">
            {pos + 1}. {data.items[idx][lang]}
          </span>
        ))}
      </div>

      {/* Tappable items */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {data.items.map((item, idx) => (
          <button key={idx} onClick={() => handleTap(idx)}
            className={`w-full min-h-[52px] rounded-2xl text-lg font-semibold px-4 transition-all duration-150 ${getItemStyle(idx)}`}>
            {tapped.includes(idx) ? `${tapped.indexOf(idx) + 1}. ` : ""}{item[lang]}
          </button>
        ))}
      </div>

      {!submitted && tapped.length === data.items.length && (
        <div className="flex gap-3">
          <button onClick={() => setTapped([])} className="px-5 py-2 rounded-xl bg-muted text-foreground font-semibold">{t.reset}</button>
          <button onClick={handleCheck} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold">{t.check}</button>
        </div>
      )}
      {tapped.length < data.items.length && !submitted && (
        <button onClick={() => setTapped([])} className="text-sm text-muted-foreground underline">{t.reset}</button>
      )}
    </div>
  );
}