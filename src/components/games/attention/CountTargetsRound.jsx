import React, { useState, useEffect } from "react";

export default function CountTargetsRound({ config, t, onDone }) {
  const [showTarget, setShowTarget] = useState(true);
  const [idx, setIdx] = useState(0);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    if (showTarget) {
      const id = setTimeout(() => setShowTarget(false), 2500);
      return () => clearTimeout(id);
    }
    if (idx < config.sequence.length) {
      const id = setTimeout(() => setIdx((i) => i + 1), config.flashMs);
      return () => clearTimeout(id);
    }
  }, [showTarget, idx, config]);

  const handleSubmit = (n) => {
    if (userCount !== null) return;
    setUserCount(n);
    const score = n === config.correctCount ? 1 : 0;
    setTimeout(() => onDone(score), 2200);
  };

  if (showTarget) {
    return (
      <div dir="rtl" className="flex flex-col items-center gap-6 p-4 w-full">
        <span className="text-base text-muted-foreground">{t.round2}</span>
        <p className="text-lg text-foreground font-medium">{t.countPrompt}</p>
        <div className="text-7xl py-10 px-12 rounded-3xl bg-muted shadow-inner">{config.target}</div>
      </div>
    );
  }

  if (idx < config.sequence.length) {
    return (
      <div dir="rtl" className="flex flex-col items-center gap-4 p-4 w-full">
        <span className="text-base text-muted-foreground">{t.round2} — {idx + 1} / {config.sequence.length}</span>
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(idx / config.sequence.length) * 100}%` }}
          />
        </div>
        <div className="text-7xl py-10 px-12 rounded-3xl bg-card shadow-lg min-h-[140px] flex items-center justify-center">
          {config.sequence[idx]}
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col items-center gap-5 p-4 w-full">
      <span className="text-base text-muted-foreground">{t.round2}</span>
      <p className="text-xl font-semibold text-foreground">{t.countAnswer}</p>
      <p className="text-4xl">{config.target}</p>
      {userCount === null ? (
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {Array.from({ length: config.sequenceLen + 1 }, (_, i) => i).map((n) => (
            <button
              key={n}
              onClick={() => handleSubmit(n)}
              className="min-h-[56px] rounded-2xl bg-card border-2 border-border text-foreground text-xl font-bold active:scale-95"
            >
              {n}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-muted-foreground">{t.yourAnswer}: {userCount}</p>
          <p className="text-lg text-muted-foreground">{t.correctAnswer}: {config.correctCount}</p>
          <p className={`text-2xl font-bold ${userCount === config.correctCount ? "text-emerald-600" : "text-destructive"}`}>
            {userCount === config.correctCount ? t.correct : t.wrong}
          </p>
        </div>
      )}
    </div>
  );
}