import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { PULSE_MATCH_LABELS, COLORS } from "@/lib/pulseMatchData";

const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.key, c]));
const SHAPE_PX = 64;
const ROW_H = 86;

function Shape({ shape, color, size = SHAPE_PX }) {
  const fill = COLOR_MAP[color]?.css || "#888";
  const p = { width: size, height: size, viewBox: "0 0 100 100" };
  if (shape === "circle") return <svg {...p}><circle cx="50" cy="50" r="44" fill={fill} /></svg>;
  if (shape === "square") return <svg {...p}><rect x="8" y="8" width="84" height="84" rx="10" fill={fill} /></svg>;
  if (shape === "triangle") return <svg {...p}><polygon points="50,10 92,88 8,88" fill={fill} /></svg>;
  if (shape === "star") return <svg {...p}><polygon points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38" fill={fill} /></svg>;
  if (shape === "diamond") return <svg {...p}><polygon points="50,6 94,50 50,94 6,50" fill={fill} /></svg>;
  if (shape === "hexagon") return <svg {...p}><polygon points="27,8 73,8 96,50 73,92 27,92 4,50" fill={fill} /></svg>;
  return null;
}

export default function PulseMatchGame({ data, lang, onComplete }) {
  const t = PULSE_MATCH_LABELS[lang] || PULSE_MATCH_LABELS.he;
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const arenaRef = useRef(null);
  const [travel, setTravel] = useState(0);
  const doneRef = useRef(false);

  const round = data.rounds[roundIdx];
  const optionCount = round ? round.options.length : 0;

  useLayoutEffect(() => {
    const measure = () => {
      const w = arenaRef.current?.clientWidth || 0;
      setTravel(Math.max(0, w - SHAPE_PX - 16));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const advance = useCallback((isCorrect) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFeedback(isCorrect);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (roundIdx + 1 < data.rounds.length) {
        setRoundIdx(i => i + 1);
        setFeedback(null);
        doneRef.current = false;
      } else {
        onComplete(score + (isCorrect ? 1 : 0), data.rounds.length);
      }
    }, 900);
  }, [roundIdx, data.rounds.length, onComplete, score]);

  // miss timer — one per round
  useEffect(() => {
    if (!round) return;
    const id = setTimeout(() => advance(false), round.driftMs + 2500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  if (!round) return null;
  const isShapeRule = round.rule === "shape";

  return (
    <div dir="rtl" className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex justify-between items-center px-1">
        <span className="text-base text-muted-foreground">{t.round} {roundIdx + 1} {t.of} {data.rounds.length}</span>
        <span className="text-base font-bold text-primary">{score} ✓</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className={`text-base font-bold px-4 py-1.5 rounded-full ${isShapeRule ? "bg-primary/15 text-primary" : "bg-amber-500/20 text-amber-700"}`}>
          {isShapeRule ? t.matchShape : t.matchColor}
        </span>
        <div className="bg-muted rounded-2xl px-8 py-3">
          <Shape shape={round.targetShape} color={round.targetColor.key} size={56} />
        </div>
        <p className="text-base text-muted-foreground">{t.tapMatch}</p>
      </div>

      <div
        ref={arenaRef}
        className="relative w-full bg-card rounded-3xl border-2 border-border overflow-hidden"
        style={{ height: optionCount * ROW_H + 16 }}
      >
        {round.options.map((opt, i) => {
          const rightToLeft = i % 2 === 0;
          const from = rightToLeft ? 0 : travel;
          const to = rightToLeft ? travel : 0;
          return (
            <motion.button
              key={`${roundIdx}-${i}`}
              onClick={() => advance(opt.isCorrect)}
              disabled={feedback !== null}
              initial={{ x: from }}
              animate={{ x: [from, to, from] }}
              transition={{ duration: Math.max(2, round.driftMs / 1000) * 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute p-1 rounded-2xl"
              style={{ top: i * ROW_H + 8, left: 8, width: SHAPE_PX + 8, height: SHAPE_PX + 8 }}
              aria-label={`${opt.shape} ${opt.color.key}`}
            >
              <span className={`block rounded-2xl ${feedback !== null && opt.isCorrect ? "ring-4 ring-emerald-500" : ""}`}>
                <Shape shape={opt.shape} color={opt.color.key} />
              </span>
            </motion.button>
          );
        })}
      </div>

      {feedback !== null && (
        <p className={`text-xl font-bold ${feedback ? "text-emerald-600" : "text-destructive"}`}>
          {feedback ? t.correct : t.wrong}
        </p>
      )}
    </div>
  );
}