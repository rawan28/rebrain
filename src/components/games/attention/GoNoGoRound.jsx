import React, { useState, useEffect, useRef } from "react";

export default function GoNoGoRound({ config, t, onDone }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null); // hit | miss | falsealarm | inhibit
  const scoreRef = useRef(0);
  const timerRef = useRef(null);
  const answeredRef = useRef(false);

  useEffect(() => {
    if (idx >= config.sequence.length) {
      onDone(scoreRef.current);
      return;
    }
    answeredRef.current = false;
    setFeedback(null);
    const isGo = config.sequence[idx] === config.goStimulus;
    timerRef.current = setTimeout(() => {
      answeredRef.current = true;
      if (isGo) {
        setFeedback("miss");
      } else {
        scoreRef.current += 1;
        setFeedback("inhibit");
      }
      setTimeout(() => setIdx((i) => i + 1), 800);
    }, config.flashMs);
    return () => clearTimeout(timerRef.current);
  }, [idx, config]);

  const handleTap = () => {
    if (answeredRef.current || idx >= config.sequence.length) return;
    answeredRef.current = true;
    clearTimeout(timerRef.current);
    const isGo = config.sequence[idx] === config.goStimulus;
    if (isGo) {
      scoreRef.current += 1;
      setFeedback("hit");
    } else {
      setFeedback("falsealarm");
    }
    setTimeout(() => setIdx((i) => i + 1), 800);
  };

  const item = idx < config.sequence.length ? config.sequence[idx] : null;
  const isGo = item === config.goStimulus;

  const FEEDBACK = {
    hit:        { style: "text-emerald-600", text: t.correct },
    inhibit:    { style: "text-emerald-600", text: "✅" },
    miss:       { style: "text-amber-500",   text: "—" },
    falsealarm: { style: "text-destructive", text: t.wrong },
  };
  const fb = feedback ? FEEDBACK[feedback] : null;

  return (
    <div dir="rtl" className="flex flex-col items-center gap-5 p-4 w-full">
      <div className="w-full flex justify-between items-center">
        <span className="text-base text-muted-foreground">{t.round3}</span>
        <span className="text-base font-semibold text-primary">{idx} / {config.sequence.length}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-base text-muted-foreground">{t.goPrompt}</span>
        <span className="text-3xl">{config.goStimulus}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base text-muted-foreground">{t.doNotTap}</span>
        {config.noGoStimuli.map((s, i) => <span key={i} className="text-2xl">{s}</span>)}
      </div>

      <button
        onClick={handleTap}
        disabled={feedback !== null || idx >= config.sequence.length}
        className="w-48 h-48 rounded-full bg-card border-4 border-border text-7xl flex items-center justify-center shadow-lg active:scale-95 transition-all duration-100"
      >
        {item || "•"}
      </button>

      {fb
        ? <p className={`text-2xl font-bold ${fb.style}`}>{fb.text}</p>
        : <p className="text-base text-muted-foreground min-h-[24px]">{isGo ? t.tapNow : ""}</p>}
    </div>
  );
}