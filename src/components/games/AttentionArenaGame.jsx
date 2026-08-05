import React, { useState, useEffect, useRef } from "react";
import { STROOP_COLORS, ATTENTION_LABELS } from "@/attentionArenaData";
import StroopRound from "./attention/StroopRound";
import CountTargetsRound from "./attention/CountTargetsRound";
import GoNoGoRound from "./attention/GoNoGoRound";

const COLOR_MAP = Object.fromEntries(STROOP_COLORS.map(c => [c.key, c]));

export default function AttentionArenaGame({ data, lang, onComplete }) {
  const t = ATTENTION_LABELS[lang] || ATTENTION_LABELS.he;
  const [round, setRound] = useState(0); // 0=intro, 1=stroop, 2=count, 3=go/no-go, 4=done
  const scoresRef = useRef({ stroop: 0, count: 0, gono: 0 });

  useEffect(() => {
    if (round !== 4) return;
    const s = scoresRef.current;
    const total = s.stroop + s.count + s.gono;
    const max = data.stroop.length + 1 + data.goNoGo.sequence.length;
    onComplete(total, max);
  }, [round]);

  if (round === 0) {
    return (
      <div dir="rtl" className="flex flex-col items-center gap-5 p-6 w-full">
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-lg text-muted-foreground text-center">{t.subtitle}</p>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {[[t.round1, t.round1Desc], [t.round2, t.round2Desc], [t.round3, t.round3Desc]].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-muted p-4 text-start">
              <p className="font-semibold text-foreground text-lg">{title}</p>
              <p className="text-base text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setRound(1)}
          className="w-full max-w-sm py-4 px-8 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow active:scale-95"
        >
          {t.start}
        </button>
      </div>
    );
  }

  if (round === 1) {
    return (
      <StroopRound
        trials={data.stroop}
        colorMap={COLOR_MAP}
        lang={lang}
        t={t}
        onDone={(score) => { scoresRef.current.stroop = score; setRound(2); }}
      />
    );
  }

  if (round === 2) {
    return (
      <CountTargetsRound
        config={data.countTargets}
        t={t}
        onDone={(score) => { scoresRef.current.count = score; setRound(3); }}
      />
    );
  }

  if (round === 3) {
    return (
      <GoNoGoRound
        config={data.goNoGo}
        t={t}
        onDone={(score) => { scoresRef.current.gono = score; setRound(4); }}
      />
    );
  }

  return (
    <div dir="rtl" className="flex flex-col items-center gap-4 p-6 w-full">
      <h2 className="text-2xl font-bold text-foreground">{t.roundComplete}</h2>
    </div>
  );
}