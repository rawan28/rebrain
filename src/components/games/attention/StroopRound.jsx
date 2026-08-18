import React, { useState, useRef, useMemo } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StroopRound({ trials, colorMap, lang, t, onDone }) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctFlag, setCorrectFlag] = useState(null);
  const scoreRef = useRef(0);

  const trial = trials[idx];
  const inkColor = colorMap[trial.inkKey];
  const wordColor = colorMap[trial.wordKey];
  // Shuffle options per trial so the correct answer isn't always first
  const options = useMemo(() => shuffle(trial.options), [trial]);

  const handleAnswer = (colorKey) => {
    if (answered) return;
    setAnswered(true);
    const ok = colorKey === trial.inkKey;
    setCorrectFlag(ok);
    if (ok) scoreRef.current += 1;
    setTimeout(() => {
      if (idx + 1 < trials.length) {
        setIdx((i) => i + 1);
        setAnswered(false);
        setCorrectFlag(null);
      } else {
        onDone(scoreRef.current);
      }
    }, 1200);
  };

  return (
    <div dir="rtl" className="flex flex-col items-center gap-6 p-4 w-full">
      <div className="w-full flex justify-between items-center">
        <span className="text-base text-muted-foreground">{t.round1}</span>
        <span className="text-base font-semibold text-primary">{idx + 1} / {trials.length}</span>
      </div>
      <p className="text-lg text-muted-foreground text-center">{t.round1Desc}</p>

      <div
        className="text-5xl font-bold py-8 px-12 rounded-3xl bg-muted"
        style={{ color: inkColor.css }}
      >
        {wordColor[lang] || wordColor.he}
      </div>

      <p className="text-lg font-medium text-foreground">{t.inkColor}</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {options.map((optKey, i) => {
          const opt = colorMap[optKey];
          let style = "bg-card border-2 border-border text-foreground";
          if (answered) {
            if (optKey === trial.inkKey) style = "bg-emerald-600 text-white border-2 border-emerald-600";
            else style = "bg-card border-2 border-border text-muted-foreground opacity-50";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(optKey)}
              disabled={answered}
              className={`min-h-[64px] rounded-2xl text-xl font-bold transition-all duration-200 active:scale-95 ${style}`}
            >
              {opt[lang] || opt.he}
            </button>
          );
        })}
      </div>

      {correctFlag !== null && (
        <p className={`text-xl font-bold ${correctFlag ? "text-emerald-600" : "text-destructive"}`}>
          {correctFlag ? t.correct : t.wrong}
        </p>
      )}
    </div>
  );
}