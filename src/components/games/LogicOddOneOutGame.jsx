import React, { useState } from "react";

const BTN = "w-full py-4 px-6 rounded-2xl text-xl font-bold cursor-pointer transition-all duration-150 active:scale-95";

const L = {
  he: { next: "הבא", correct: "כל הכבוד! ✓", wrong: "לא מדויק" },
  ar: { next: "التالي", correct: "أحسنت! ✓", wrong: "غير صحيح" },
};

export default function LogicOddOneOutGame({ data, lang, onComplete }) {
  const t = L[lang] || L.he;
  const getText = (obj) => obj?.[lang] || obj?.he || "";
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const handleSelect = (idx) => {
    if (feedback) return;
    setSelectedIdx(idx);
    const isCorrect = idx === data.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");
    // Delay to show feedback briefly, then signal parent
    setTimeout(() => onComplete(isCorrect ? 1 : 0, 1), 1200);
  };

  return (
    <div dir="rtl" className="w-full rounded-2xl p-6 bg-card text-card-foreground text-center">
      <h3 className="text-2xl font-bold mb-8 leading-snug">{getText(data.question)}</h3>
      <div className="flex flex-col gap-4">
        {data.options.map((opt, idx) => {
          let cls = "bg-secondary text-secondary-foreground hover:bg-accent";
          if (feedback) {
            if (idx === data.correctIndex) cls = "bg-emerald-600 text-white";
            else if (idx === selectedIdx) cls = "bg-destructive text-destructive-foreground";
            else cls = "bg-muted text-muted-foreground opacity-60";
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={feedback !== null}
              className={`${BTN} ${cls} text-xl min-h-[52px]`}>{getText(opt)}</button>
          );
        })}
      </div>
      {feedback && (
        <div className="mt-6">
          <p className={`text-xl font-bold mb-2 ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>
            {feedback === "correct" ? t.correct : t.wrong}
          </p>
          <p className="text-lg text-muted-foreground">{getText(data.explanation)}</p>
        </div>
      )}
    </div>
  );
}