import React, { useState } from "react";

const BTN = "w-full py-4 px-6 rounded-2xl text-xl font-bold cursor-pointer transition-all duration-150 active:scale-95";

const L = {
  he: { missing: "מה חסר?", hint: "💡 רמז", next: "הבא", correct: "כל הכבוד! ✓", wrong: "לא מדויק" },
  ar: { missing: "ما المفقود؟", hint: "💡 تلميح", next: "التالي", correct: "أحسنت! ✓", wrong: "غير صحيح" },
};

export default function PatternAdvGame({ data, lang, onComplete }) {
  const t = L[lang] || L.he;
  const getText = (obj) => (typeof obj === "object" && obj !== null) ? (obj[lang] || obj.he || "") : obj;
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (idx) => {
    if (feedback) return;
    setSelectedIdx(idx);
    const isCorrect = data.options[idx] === data.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => onComplete(isCorrect ? 1 : 0, 1), 1200);
  };

  return (
    <div dir="rtl" className="w-full rounded-2xl p-6 bg-card text-card-foreground text-center">
      {/* Sequence display */}
      <div className="flex justify-center items-center gap-2 flex-wrap mb-6">
        {data.sequence.map((item, i) => (
          <div key={i} className={`min-w-[52px] min-h-[52px] px-3 flex items-center justify-center rounded-xl text-xl font-bold shadow
            ${item === "?" ? "bg-primary text-primary-foreground ring-4 ring-primary/40" : "bg-muted text-foreground"}`}>
            {item}
          </div>
        ))}
      </div>

      <p className="text-xl text-muted-foreground mb-4">{t.missing}</p>

      {/* Hint toggle */}
      <button onClick={() => setShowHint(!showHint)}
        className="text-lg text-primary underline underline-offset-4 mb-4 cursor-pointer">
        {t.hint}
      </button>
      {showHint && (
        <p className="text-lg text-muted-foreground mb-4 bg-muted rounded-xl p-3">{getText(data.rule)}</p>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        {data.options.map((opt, idx) => {
          let cls = "bg-secondary text-secondary-foreground hover:bg-accent";
          if (feedback) {
            if (opt === data.answer) cls = "bg-emerald-600 text-white";
            else if (idx === selectedIdx) cls = "bg-destructive text-destructive-foreground";
            else cls = "bg-muted text-muted-foreground opacity-60";
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={feedback !== null}
              className={`${BTN} ${cls} text-2xl min-h-[52px]`}>{opt}</button>
          );
        })}
      </div>
      {feedback && (
        <p className={`mt-6 text-xl font-bold ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>
          {feedback === "correct" ? t.correct : t.wrong}
        </p>
      )}
    </div>
  );
}