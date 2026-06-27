import React, { useState } from "react";

const BTN = "w-full py-4 px-6 rounded-2xl text-xl font-bold cursor-pointer transition-all duration-150 active:scale-95";

const L = {
  he: { sentenceA: "משפט א׳", sentenceB: "משפט ב׳", whatChanged: "מה השתנה?", next: "הבא", correct: "כל הכבוד! ✓", wrong: "לא מדויק", change: "השינוי:" },
  ar: { sentenceA: "الجملة أ", sentenceB: "الجملة ب", whatChanged: "ماذا تغيّر؟", next: "التالي", correct: "أحسنت! ✓", wrong: "غير صحيح", change: "التغيير:" },
};

export default function SpotDiffGame({ data, lang, onComplete }) {
  const t = L[lang] || L.he;
  const getText = (obj) => obj?.[lang] || obj?.he || "";
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSelect = (idx) => {
    if (feedback) return;
    setSelectedIdx(idx);
    const isCorrect = idx === data.correctIndex;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => onComplete(isCorrect ? 1 : 0, 1), 1200);
  };

  return (
    <div dir="rtl" className="w-full rounded-2xl p-6 bg-card text-card-foreground">
      {/* Two text boxes */}
      <div className="space-y-4 mb-6">
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-primary mb-2">{t.sentenceA}</p>
          <p className="text-xl font-bold leading-relaxed">{getText(data.textA)}</p>
        </div>
        <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-5">
          <p className="text-sm font-semibold text-accent mb-2">{t.sentenceB}</p>
          <p className="text-xl font-bold leading-relaxed">{getText(data.textB)}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-center mb-6">{t.whatChanged}</h3>

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
        <div className="mt-6 text-center">
          <p className={`text-xl font-bold mb-2 ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>
            {feedback === "correct" ? t.correct : t.wrong}
          </p>
          <p className="text-lg text-muted-foreground">{t.change} {getText(data.changeDesc)}</p>
        </div>
      )}
    </div>
  );
}