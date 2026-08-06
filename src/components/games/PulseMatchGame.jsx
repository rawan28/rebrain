import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PULSE_MATCH_LABELS, COLORS } from "@/lib/pulseMatchData";
import useTimeouts from '@/hooks/useTimeouts';

const COLOR_MAP = {};
COLORS.forEach((c) => { COLOR_MAP[c.key] = c.css; });

const Shape = React.memo(function Shape({ shape, color, size = 60 }) {
  const fill = COLOR_MAP[color] || "#888";
  const p = { width: size, height: size, viewBox: "0 0 100 100" };
  if (shape === "circle") return <svg {...p}><circle cx="50" cy="50" r="44" fill={fill} /></svg>;
  if (shape === "square") return <svg {...p}><rect x="8" y="8" width="84" height="84" rx="10" fill={fill} /></svg>;
  if (shape === "triangle") return <svg {...p}><polygon points="50,10 92,88 8,88" fill={fill} /></svg>;
  if (shape === "star") return <svg {...p}><polygon points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38" fill={fill} /></svg>;
  if (shape === "diamond") return <svg {...p}><polygon points="50,6 94,50 50,94 6,50" fill={fill} /></svg>;
  return <svg {...p}><polygon points="27,8 73,8 96,50 73,92 27,92 4,50" fill={fill} /></svg>;
});

function colorKey(c) {
  return typeof c === "string" ? c : c?.key;
}

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

export default function PulseMatchGame({ data, lang, onComplete }) {
  // instrumentation: counts and timings
  const renderCountRef = useRef(0);
  renderCountRef.current += 1; // increment on each render

  const statsRef = useRef(null);
  if (!statsRef.current) {
    statsRef.current = {
      mountedAt: performance?.now ? performance.now() : Date.now(),
      renderCounts: [],
      roundDurations: [],
      clickResponseTimes: [],
      clicks: 0,
      lastFps: 0,
      smoothedFps: 0,
    };
    // expose for debugging in console: window.__pulseMatchStats
    try { if (typeof window !== 'undefined') window.__pulseMatchStats = statsRef.current; } catch (e) { /* noop in SSR */ }
  }

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

  const clickTimeRef = useRef(null);
  const roundStartRef = useRef(performance?.now ? performance.now() : Date.now());

  const advance = useCallback((isCorrect) => {
    if (lockRef.current || doneRef.current) return;
    lockRef.current = true;
    const nextScore = scoreRef.current + (isCorrect ? 1 : 0);
    scoreRef.current = nextScore;
    setScore(nextScore);
    setFeedback(isCorrect ? "correct" : "wrong");

    const clickStart = clickTimeRef.current;

    setTimeoutAndTrack(() => {
      // record click->advance response time
      if (clickStart && statsRef.current) {
        try { statsRef.current.clickResponseTimes.push((performance?.now ? performance.now() : Date.now()) - clickStart); } catch (e) { /* noop */ }
      }

      if (roundIdxRef.current + 1 < rounds.length) {
        // measure round duration
        try {
          const now = performance?.now ? performance.now() : Date.now();
          if (roundStartRef.current && statsRef.current) statsRef.current.roundDurations.push(now - roundStartRef.current);
          roundStartRef.current = now;
        } catch (e) { /* noop */ }

        roundIdxRef.current = roundIdxRef.current + 1;
        setRoundIdx(roundIdxRef.current);
        setFeedback(null);
        lockRef.current = false;
      } else {
        doneRef.current = true;
        onComplete(nextScore, rounds.length);
        // final round duration
        try {
          const now = performance?.now ? performance.now() : Date.now();
          if (roundStartRef.current && statsRef.current) statsRef.current.roundDurations.push(now - roundStartRef.current);
        } catch (e) { /* noop */ }
      }
    }, 700);
  }, [onComplete, rounds.length, setTimeoutAndTrack]);

  // inject keyframes once to avoid recreating the <style> block on every render
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('pmKeyframes')) return;
    const style = document.createElement('style');
    style.id = 'pmKeyframes';
    // use translate3d and keep keyframes cheap
    style.innerHTML = `\n      @keyframes pmDriftA { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(calc(min(100vw, 28rem) - 110px),0,0); } }\n      @keyframes pmDriftB { 0%,100% { transform: translate3d(calc(min(100vw, 28rem) - 110px),0,0); } 50% { transform: translate3d(0,0,0); } }\n    `;
    document.head.appendChild(style);
    return () => {
      // leave the style in the document; it's reused and cheap to keep
    };
  }, []);

  useEffect(() => {
    // record render count periodically
    try {
      if (statsRef.current) statsRef.current.renderCounts.push(renderCountRef.current);
    } catch (e) { /* noop */ }
  }, [renderCountRef.current]);

  useEffect(() => {
    if (!round) return;
    const ms = (round.driftMs || 5000) + 2000;
    // mark round start time
    try { roundStartRef.current = performance?.now ? performance.now() : Date.now(); } catch (e) { roundStartRef.current = Date.now(); }
    setTimeoutAndTrack(() => advance(false), ms);
  }, [round, advance, setTimeoutAndTrack]);

  // shared click handler to avoid creating a new function per button
  const handleClick = useCallback((e) => {
    // guard double clicks - advance handles lockRef
    const isCorrect = e.currentTarget.getAttribute('data-correct') === 'true';
    clickTimeRef.current = performance?.now ? performance.now() : Date.now();
    try { if (statsRef.current) { statsRef.current.clicks += 1; } } catch (e) {}
    advance(!!isCorrect);
  }, [advance]);

  // Debug overlay state and FPS measurement
  const [showDebug, setShowDebug] = useState(false);
  const fpsRef = useRef({ lastTime: 0, lastFps: 0, smoothed: 0, rafId: null });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;
    const tick = (ts) => {
      if (!mounted) return;
      const prev = fpsRef.current.lastTime || ts;
      const dt = ts - prev || 16;
      const fps = 1000 / dt;
      // smooth
      fpsRef.current.smoothed = fpsRef.current.smoothed ? (fpsRef.current.smoothed * 0.9 + fps * 0.1) : fps;
      fpsRef.current.lastTime = ts;
      fpsRef.current.lastFps = Math.round(fps);
      if (statsRef.current) statsRef.current.lastFps = Math.round(fpsRef.current.smoothed);
      fpsRef.current.rafId = requestAnimationFrame(tick);
    };
    fpsRef.current.rafId = requestAnimationFrame(tick);
    return () => { mounted = false; if (fpsRef.current.rafId) cancelAnimationFrame(fpsRef.current.rafId); };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      // Ctrl/Cmd+D toggles overlay
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setShowDebug(s => !s);
      }
    };
    if (typeof window !== 'undefined') window.addEventListener('keydown', onKey);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey); };
  }, []);

  if (!round) return null;

  const isShapeRule = round.rule === "shape";
  const cycle = useMemo(() => Math.max(2.5, (round.driftMs || 5000) / 1000), [round.driftMs]);
  const options = useMemo(() => round.options || [], [round.options]);

  // compute some debug metrics
  const stats = statsRef.current || {};
  const avgClick = avg(stats.clickResponseTimes);
  const avgRound = avg(stats.roundDurations);
  const lastFps = stats.lastFps || Math.round(fpsRef.current.smoothed || 0);

  return (
    <div dir="rtl" className="flex flex-col items-center gap-4 w-full">

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
        style={{ height: (options.length || 0) * 88 + 16 }}
      >
        {options.map((opt, i) => {
          const anim = `${i % 2 === 0 ? "pmDriftA" : "pmDriftB"} ${cycle * 2}s ease-in-out infinite`;
          const top = i * 88 + 8;
          return (
            <button
              key={`${roundIdx}-${i}`}
              onClick={handleClick}
              data-correct={!!opt.isCorrect}
              disabled={feedback !== null}
              className="absolute p-2 rounded-2xl"
              style={{
                top,
                left: 8,
                animation: anim,
                willChange: 'transform',
                WebkitTransform: 'translate3d(0,0,0)'
              }}
              aria-label={`${opt.shape} ${colorKey(opt.color)}`}
            >
              <span className={`block rounded-2xl ${feedback !== null && opt.isCorrect ? "ring-4 ring-emerald-500" : ""}`}>
                <Shape shape={opt.shape} color={colorKey(opt.color)} />
              </span>
            </button>
          );
        })}
      </div>

      {feedback !== null && (
        <p className={`text-xl font-bold ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>
          {feedback === "correct" ? t.correct : t.wrong}
        </p>
      )}

      {/* Debug overlay toggle button */}
      <button
        onClick={() => setShowDebug(s => !s)}
        title="Toggle debug overlay (Ctrl/Cmd+D)"
        style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9999, padding: 8, borderRadius: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12 }}
        aria-label="Toggle debug overlay"
      >
        DBG
      </button>

      {/* Debug overlay panel */}
      {showDebug && (
        <div style={{ position: 'fixed', right: 12, bottom: 56, zIndex: 10000, padding: 10, background: 'rgba(0,0,0,0.75)', color: '#fff', borderRadius: 8, fontSize: 12, minWidth: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <strong>PulseMatch</strong>
            <button onClick={() => setShowDebug(false)} style={{ background: 'transparent', border: 'none', color: '#fff' }}>✕</button>
          </div>
          <div>FPS: {lastFps} (smoothed: {Math.round(fpsRef.current.smoothed || 0)})</div>
          <div>Renders: {stats.renderCounts?.length || 0} (last: {stats.renderCounts?.slice(-1)[0] || renderCountRef.current})</div>
          <div>Rounds played: {stats.roundDurations?.length || 0}</div>
          <div>Avg round ms: {avgRound} ms</div>
          <div>Clicks: {stats.clicks || 0}</div>
          <div>Avg click→resp: {avgClick} ms (last: {stats.clickResponseTimes?.slice(-1)[0] || 0} ms)</div>
          <div style={{ marginTop: 6 }}>Score: {score} • Round: {roundIdx + 1}/{rounds.length}</div>
          <div style={{ marginTop: 6, fontSize: 11, opacity: 0.8 }}>Toggle: Ctrl/Cmd+D</div>
        </div>
      )}

    </div>
  );
}
