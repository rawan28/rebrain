import React, { useState, useEffect, useRef, useCallback } from "react";
import { PULSE_MATCH_LABELS, COLORS } from "@/lib/pulseMatchData";
import useTimeouts from '@/hooks/useTimeouts';

const COLOR_MAP = {};
COLORS.forEach((c) => { COLOR_MAP[c.key] = c.css; });

function Shape({ shape, color, size = 60 }) {
  const fill = COLOR_MAP[color] || "#888";
  const p = { width: size, height: size, viewBox: "0 0 100 100" };
  if (shape === "circle") return <svg {...p}><circle cx="50" cy="50" r="44" fill={fill} /></svg>;
  if (shape === "square") return <svg {...p}><rect x="8" y="8" width="84" height="84" rx="10" fill={fill} /></svg>;
  if (shape === "triangle") return <svg {...p}><polygon points="50,10 92,88 8,88" fill={fill} /></svg>;
  if (shape === "star") return <svg {...p}><polygon points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38" fill={fill} /></svg>;
  if (shape === "diamond") return <svg {...p}><polygon points="50,6 94,50 50,94 6,50" fill={fill} /></svg>;
  return <svg {...p}><polygon points="27,8 73,8 96,50 73,92 27,92 4,50" fill={fill} /></svg>;
}

function colorKey(c) {
  return typeof c === "string" ? c : c?.key;
}

export default function PulseMatchGame({ data, lang, onComplete }) {
  const t = PULSE_MATCH_LABELS[lang] || PULSE_MATCH_LABELS.he;
  const rounds = data?.rounds || [];
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const lockRef = useRef(false);
  const doneRef = useRef(false);

  // refs to hold most recent values for timeouts/advance without needing them in deps
  const scoreRef = useRef(0);
  const roundIdxRef = useRef(0);

  const { setTimeoutAndTrack } = useTimeouts();

  const round = rounds[roundIdx];

  // keep refs in sync with state when state changes externally
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { roundIdxRef.current = roundIdx; }, [roundIdx]);

  const advance = useCallback((isCorrect) => {
    if (lockRef.current || doneRef.current) return;
    lockRef.current = true;
    const nextScore = scoreRef.current + (isCorrect ? 1 : 0);
    scoreRef.current = nextScore;
    setScore(nextScore);
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeoutAndTrack(() => {
      if (roundIdxRef.current + 1 < rounds.length) {
        roundIdxRef.current = roundIdxRef.current + 1;
        setRoundIdx(roundIdxRef.current);
        setFeedback(null);
        lockRef.current = false;
      } else {
        doneRef.current = true;
        onComplete(nextScore, rounds.length);
      }
    }, 700);
  }, [onComplete, rounds.length, setTimeoutAndTrack]);

  useEffect(() => {
    if (!round) return;
    const ms = (round.driftMs || 5000) + 2000;
    setTimeoutAndTrack(() => advance(false), ms);
  }, [round, advance, setTimeoutAndTrack]);

  if (!round) return null;

  const isShapeRule = round.rule === "shape";
  const cycle = Math.max(2.5, (round.driftMs || 5000) / 1000);

  return (
    <div dir="rtl" className="flex flex-col items-center gap-4 w-full">
      <style>{`
        @keyframes pmDriftA { 0%,100% { transform: translateX(0); } 50% { transform: translateX(calc(min(100vw, 28rem) - 110px)); } }
        @keyframes pmDriftB { 0%,100% { transform: translateX(calc(min(100vw, 28rem) - 110px)); } 50% { transform: translateX(0); } }
      `}</style>

      <div className="w-full flex justify-between items-center px-1">
        <span className="text-base text-muted-foreground">{t.round} {roundIdx + 1} {t.of} {rounds.length}</span>
        <span className="text-base font-bold text-primary">{score} ✓</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={`text-base font-bold px-4 py-1.5 rounded-full ${isShapeRule ? "bg-primary/15 text-primary" : "bg-amber-500/20 text-amber-800"}`}>
          {isShapeRule ? t.matchShape : t.matchColor}
        </span>
        <div className="bg-muted rounded-2xl px-8 py-3">
          <Shape shape={round.targetShape} color={colorKey(round.targetColor)} size={56} />
        </div>
        <p className="text-base text-muted-foreground">{t.tapMatch}</p>
      </div>

      <div
        className="relative w-full max-w-md bg-card rounded-3xl border-2 border-border overflow-hidden"
        style={{ height: (round.options?.length || 0) * 88 + 16 }}
      >
        {(round.options || []).map((opt, i) => (
          <button
            key={`${roundIdx}-${i}`}
            onClick={() => advance(!!opt.isCorrect)}
            disabled={feedback !== null}
            className="absolute p-2 rounded-2xl"
            style={{
              top: i * 88 + 8,
              left: 8,
              animation: `${i % 2 === 0 ? "pmDriftA" : "pmDriftB"} ${cycle * 2}s ease-in-out infinite`,
            }}
            aria-label={`${opt.shape} ${colorKey(opt.color)}`}
          >
            <span className={`block rounded-2xl ${feedback !== null && opt.isCorrect ? "ring-4 ring-emerald-500" : ""}`}>
              <Shape shape={opt.shape} color={colorKey(opt.color)} />
            </span>
          </button>
        ))}
      </div>

      {feedback !== null && (
        <p className={`text-xl font-bold ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>
          {feedback === "correct" ? t.correct : t.wrong}
        </p>
      )}
    </div>
  );
}
