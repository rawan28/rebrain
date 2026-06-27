import React, { useState, useEffect, useCallback, useRef } from "react";

const BTN = "w-full py-4 px-6 rounded-2xl text-xl font-bold cursor-pointer transition-all duration-150 active:scale-95";
const L = {
  he: { memorize: "זכרו את הפריטים!", disappearing: "נעלם עוד...", pickItems: "סמנו את מה שראיתם", submit: "שלחו תשובה", next: "הבא", correct: "כל הכבוד! ✓", wrong: "לא מדויק" },
  ar: { memorize: "احفظ العناصر!", disappearing: "ستختفي بعد...", pickItems: "اختر ما رأيته", submit: "إرسال", next: "التالي", correct: "أحسنت! ✓", wrong: "غير صحيح" },
};

export default function RapidRecallGame({ data, lang, onComplete }) {
  const t = L[lang] || L.he;
  const [phase, setPhase] = useState("show"); // show | recall | done
  const [selectedItems, setSelectedItems] = useState([]);
  const [shuffledPool, setShuffledPool] = useState([]);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  const getText = useCallback((item) => item[lang] || item.he, [lang]);

  useEffect(() => {
    // Start show phase with countdown
    startRef.current = Date.now();
    const showMs = data.showMs || 2500;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / showMs) * 100);
      setProgress(pct);
    }, 50);
    timerRef.current = setTimeout(() => {
      clearInterval(interval);
      setProgress(0);
      // Shuffle items + distractors
      const pool = [
        ...data.items.map(it => ({ text: getText(it), isTarget: true })),
        ...data.distractors.map(it => ({ text: getText(it), isTarget: false })),
      ].sort(() => Math.random() - 0.5);
      setShuffledPool(pool);
      setPhase("recall");
    }, showMs);
    return () => { clearTimeout(timerRef.current); clearInterval(interval); };
  }, [data, getText]);

  const toggleItem = (text) => {
    if (result) return;
    setSelectedItems(prev => prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]);
  };

  const handleSubmit = () => {
    const targets = data.items.map(it => getText(it));
    let correct = 0;
    selectedItems.forEach(s => { if (targets.includes(s)) correct++; });
    const falsePositives = selectedItems.filter(s => !targets.includes(s)).length;
    const net = Math.max(0, correct - falsePositives);
    setResult({ score: net, max: targets.length });
    setPhase("done");
    onComplete(net, targets.length);
  };

  if (phase === "show") {
    return (
      <div dir="rtl" className="w-full rounded-2xl p-6 bg-card text-card-foreground text-center">
        <p className="text-muted-foreground text-lg mb-2">{t.disappearing}</p>
        <h3 className="text-2xl font-bold mb-6">{t.memorize}</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {data.items.map((item, i) => (
            <span key={i} className="bg-primary text-primary-foreground text-2xl font-bold px-6 py-4 rounded-2xl shadow min-h-[52px]">
              {getText(item)}
            </span>
          ))}
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-3 rounded-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full rounded-2xl p-6 bg-card text-card-foreground text-center">
      <h3 className="text-xl font-semibold mb-6">{t.pickItems}</h3>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {shuffledPool.map((item, i) => {
          const picked = selectedItems.includes(item.text);
          const showRes = result !== null;
          let cls = "border-2 border-input bg-muted text-foreground";
          if (picked && !showRes) cls = "border-2 border-primary bg-primary text-primary-foreground";
          if (showRes && picked && item.isTarget) cls = "border-2 bg-emerald-600 text-white";
          if (showRes && picked && !item.isTarget) cls = "border-2 bg-destructive text-destructive-foreground";
          if (showRes && !picked && item.isTarget) cls = "border-2 border-dashed border-emerald-600 text-foreground opacity-70";
          return (
            <button key={i} disabled={result !== null} onClick={() => toggleItem(item.text)}
              className={`${cls} text-xl font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer active:scale-95 min-h-[52px]`}>
              {item.text}
            </button>
          );
        })}
      </div>
      {!result && (
        <button onClick={handleSubmit} disabled={selectedItems.length === 0}
          className={`${BTN} bg-primary text-primary-foreground disabled:opacity-40`}>{t.submit}</button>
      )}
    </div>
  );
}