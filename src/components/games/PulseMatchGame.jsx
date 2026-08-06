import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { PULSE_MATCH_LABELS, COLORS, SHAPES } from "@/lib/pulseMatchData";

const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.key, c]));

function Shape({ shape, color, size = 64 }) {
  const fill = COLOR_MAP[color]?.css || "#888";
  const common = { width: size, height: size };
  switch (shape) {
    case "circle":
      return <svg {...common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill={fill} /></svg>;
    case "square":
      return <svg {...common} viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="8" fill={fill} /></svg>;
    case "triangle":
      return <svg {...common} viewBox="0 0 100 100"><polygon points="50,10 92,88 8,88" fill={fill} /></svg>;
    case "star":
      return <svg {...common} viewBox="0 0 100 100"><polygon points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38" fill={fill} /></svg>;
    case "diamond":
      return <svg {...common} viewBox="0 0 100 100"><polygon points="50,8 92,50 50,92 8,50" fill={fill} /></svg>;
    case "hexagon":
      return <svg {...common} viewBox="0 0 100 100"><polygon points="25,8 75,8 96,50 75,92 25,92 4,50" fill={fill} /></svg>;
    default:
      return null;
  }
}

export default function PulseMatchGame({ data, lang, onComplete }) {
  const t = PULSE_MATCH_LABELS[lang] || PULSE_MATCH_LABELS.he;
  const [roundIdx, setRoundIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const scoreRef = useRef(0);
  const timeoutRef = useRef(null);

  const round = data.rounds[roundIdx];
  const dir = lang === "ar" ? "rtl" : "rtl";

  const handleAnswer = useCallback((isCorrect) => {
    if (answered) return;
    setAnswered(true);
    setFeedback(isCorrect);
    if (isCorrect) scoreRef.current += 1;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => {
      if (roundIdx + 1 < data.rounds.length) {
        setRoundIdx((i) => i + 1);
        setFeedback(null);
        setAnswered(false);
      } else {
        onComplete(scoreRef.current, data.rounds.length);
      }
    }, 900);
  }, [answered, roundIdx, data.rounds.length, onComplete]);

  // auto-timeout: if user doesn't answer in time, count as miss
  useEffect(() => {
    if (!round) return;
    timeoutRef.current = setTimeout(() => {
      if (!answered) handleAnswer(false);
    }, round.driftMs + 1500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [roundIdx, round, answered, handleAnswer]);

  if (!round) return null;

  const isShapeRule = round.rule === "shape";

  return (
    <div dir={dir} className="flex flex-col items-center gap-5 p-4 w-full">
      <div className="w-full flex justify-between items-center">
        <span className="text-base text-muted-foreground">{t.round} {roundIdx + 1} {t.of} {data.rounds.length}</span>
        <span className="text-base font-semibold text-primary">{scoreRef.current} ✓</span>
      </div>

      {/* Rule indicator + target */}
      <div className="flex flex-col items-center gap-2">
        <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${isShapeRule ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
          {isShapeRule ? t.matchShape : t.matchColor}
        </span>
        <div className="flex items-center gap-3 bg-muted rounded-2xl px-6 py-3">
          <Shape shape={round.targetShape} color={round.targetColor.key} size={56} />
        </div>
        <p className="text-base text-muted-foreground">{t.tapMatch}</p>
      </div>

      {/* Moving shapes area */}
      <div className="relative w-full h-56 bg-card rounded-3xl border-2 border-border overflow-hidden">
        {round.options.map((opt, i) => {
          const startX = (i / round.options.length) * 100;
          const driftDir = i % 2 === 0 ? 1 : -1;
          return (
            <motion.button
              key={`${roundIdx}-${i}`}
              onClick={() => handleAnswer(opt.isCorrect)}
              disabled={answered}
              initial={{ x: `${driftDir > 0 ? -20 : 120}%`, y: `${20 + (i % 3) * 20}%` }}
              animate={{ x: `${driftDir > 0 ? 120 : -20}%`, y: `${20 + (i % 3) * 20}%` }}
              transition={{ duration: round.driftMs / 1000, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-0"
              style={{ left: `${startX}%` }}
              aria-label={`option ${i + 1}`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-200 ${feedback !== null && opt.isCorrect ? "ring-4 ring-emerald-500" : ""}`}>
                <Shape shape={opt.shape} color={opt.color.key} size={60} />
              </div>
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