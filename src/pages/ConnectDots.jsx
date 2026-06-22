import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spline, RotateCcw, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { CONNECT_DOTS_LEVELS } from '@/lib/connectDotsLevels';
import GameStartScreen from '@/components/games/GameStartScreen';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

export default function ConnectDots() {
  const { t } = useLang();
  const [levelIndex, setLevelIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const pathsRef = useRef({});
  const dragColorRef = useRef(null);
  const dragPathRef = useRef([]);
  const wonRef = useRef(false);

  const [paths, setPathsState] = useState({});
  const [dragColor, setDragColorState] = useState(null);
  const [dragPath, setDragPathState] = useState([]);

  const setPaths = useCallback((updater) => {
    const newVal = typeof updater === 'function' ? updater(pathsRef.current) : updater;
    pathsRef.current = newVal;
    setPathsState(newVal);
  }, []);

  const setDragColor = useCallback((val) => {
    dragColorRef.current = val;
    setDragColorState(val);
  }, []);

  const setDragPath = useCallback((val) => {
    const newVal = typeof val === 'function' ? val(dragPathRef.current) : val;
    dragPathRef.current = newVal;
    setDragPathState(newVal);
  }, []);

  const level = CONNECT_DOTS_LEVELS[levelIndex];

  const startLevel = useCallback((idx) => {
    const i = Math.min(Math.max(idx, 0), CONNECT_DOTS_LEVELS.length - 1);
    setLevelIndex(i);
    setPaths({});
    setDragColor(null);
    setDragPath([]);
    setWon(false);
    wonRef.current = false;
    setShowCelebration(false);
    setStarted(true);
  }, [setPaths, setDragColor, setDragPath]);

  const findDot = (r, c) => {
    for (const pair of level.pairs) {
      if (pair.a.r === r && pair.a.c === c) return pair;
      if (pair.b.r === r && pair.b.c === c) return pair;
    }
    return null;
  };

  const isCellOccupiedByOther = (r, c, myColor) => {
    for (const [color, path] of Object.entries(pathsRef.current)) {
      if (color !== myColor && path.some(p => p.r === r && p.c === c)) return true;
    }
    return false;
  };

  const handleCellDown = (r, c) => {
    const dot = findDot(r, c);
    if (!dot) return;
    setDragColor(dot.color);
    setPaths(prev => {
      const next = { ...prev };
      delete next[dot.color];
      return next;
    });
    setDragPath([{ r, c }]);
    setWon(false);
    wonRef.current = false;
  };

  const handleCellEnter = (r, c) => {
    if (!dragColorRef.current) return;
    const currentPath = dragPathRef.current;
    if (currentPath.length === 0) return;
    const last = currentPath[currentPath.length - 1];
    if (last.r === r && last.c === c) return;

    const dr = Math.abs(r - last.r);
    const dc = Math.abs(c - last.c);
    if (dr + dc !== 1) return;

    if (currentPath.length >= 2) {
      const prev = currentPath[currentPath.length - 2];
      if (prev.r === r && prev.c === c) {
        setDragPath(currentPath.slice(0, -1));
        return;
      }
    }

    const idx = currentPath.findIndex(p => p.r === r && p.c === c);
    if (idx !== -1) {
      setDragPath(currentPath.slice(0, idx + 1));
      return;
    }

    const dot = findDot(r, c);

    if (dot && dot.color !== dragColorRef.current) return;

    if (isCellOccupiedByOther(r, c, dragColorRef.current)) return;

    if (dot && dot.color === dragColorRef.current) {
      const pair = level.pairs.find(p => p.color === dragColorRef.current);
      const start = currentPath[0];
      const startDot = (start.r === pair.a.r && start.c === pair.a.c) ? pair.a : pair.b;
      const endDot = startDot === pair.a ? pair.b : pair.a;
      if (r === endDot.r && c === endDot.c) {
        const completed = [...currentPath, { r, c }];
        setPaths(prev => ({ ...prev, [dragColorRef.current]: completed }));
        setDragColor(null);
        setDragPath([]);
        return;
      }
      if (r === start.r && c === start.c) return;
    }

    setDragPath([...currentPath, { r, c }]);
  };

  const handlePointerMove = (e) => {
    if (!dragColorRef.current) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const cellEl = el.closest('[data-cell]');
    if (!cellEl) return;
    const r = parseInt(cellEl.dataset.r, 10);
    const c = parseInt(cellEl.dataset.c, 10);
    if (isNaN(r) || isNaN(c)) return;
    handleCellEnter(r, c);
  };

  const handlePointerUp = useCallback(() => {
    if (!dragColorRef.current) return;
    setPaths(prev => ({ ...prev, [dragColorRef.current]: [...dragPathRef.current] }));
    setDragColor(null);
    setDragPath([]);
  }, [setPaths, setDragColor, setDragPath]);

  useEffect(() => {
    const handler = () => handlePointerUp();
    window.addEventListener('pointerup', handler);
    return () => window.removeEventListener('pointerup', handler);
  }, [handlePointerUp]);

  useEffect(() => {
    if (!started || wonRef.current) return;
    const allConnected = level.pairs.every(pair => {
      const path = pathsRef.current[pair.color];
      if (!path || path.length < 2) return false;
      const s = path[0];
      const e = path[path.length - 1];
      return ((s.r === pair.a.r && s.c === pair.a.c) && (e.r === pair.b.r && e.c === pair.b.c)) ||
             ((s.r === pair.b.r && s.c === pair.b.c) && (e.r === pair.a.r && e.c === pair.a.c));
    });
    if (allConnected) {
      wonRef.current = true;
      setWon(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2200);
      awardCoin(true);
      saveSession('connect_dots', {
        level: levelIndex + 1,
        streak: 1,
        totalCorrect: 1,
        totalAttempts: 1,
      });
    }
  }, [paths, started, level, levelIndex]);

  const getCellPathInfo = (r, c) => {
    if (dragColor && dragPath.some(p => p.r === r && p.c === c)) {
      return { color: dragColor, isDrag: true, pathArr: dragPath };
    }
    for (const [color, path] of Object.entries(paths)) {
      if (path.some(p => p.r === r && p.c === c)) {
        return { color, isDrag: false, pathArr: path };
      }
    }
    return null;
  };

  const getPathNeighbors = (r, c, pathArr) => {
    if (!pathArr || pathArr.length === 0) return {};
    return {
      up: pathArr.some(p => p.r === r - 1 && p.c === c),
      down: pathArr.some(p => p.r === r + 1 && p.c === c),
      left: pathArr.some(p => p.r === r && p.c === c - 1),
      right: pathArr.some(p => p.r === r && p.c === c + 1),
    };
  };

  const isPairConnected = (pair) => {
    const path = paths[pair.color];
    if (!path || path.length < 2) return false;
    const s = path[0];
    const e = path[path.length - 1];
    return ((s.r === pair.a.r && s.c === pair.a.c) && (e.r === pair.b.r && e.c === pair.b.c)) ||
           ((s.r === pair.b.r && s.c === pair.b.c) && (e.r === pair.a.r && e.c === pair.a.c));
  };

  const connectedCount = level.pairs.filter(isPairConnected).length;
  const ArrowIcon = t.dir === 'rtl' ? ChevronLeft : ChevronRight;

  if (!started) {
    return (
      <GameStartScreen
        title={t.connectDotsTitle}
        description={t.connectDotsDescLong}
        icon={Spline}
        gradient="from-teal-400 to-cyan-500"
        onStart={() => startLevel(0)}
        startLabel={t.startPlaying}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.connectDotsTitle}</h2>
          <p className="text-sm text-muted-foreground">{t.connectDotsSubDesc}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg whitespace-nowrap">
            {connectedCount}/{level.pairs.length} {t.connectDotsConnected}
          </span>
          <Button variant="outline" size="sm" onClick={() => startLevel(levelIndex)} className="gap-1.5">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg">
          {t.level} {levelIndex + 1}
        </span>
      </div>

      {won && !showCelebration && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 rounded-xl px-5 py-3 font-semibold text-lg">
            <Trophy className="w-6 h-6 text-green-500" />
            {t.connectDotsLevelComplete}
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => startLevel(levelIndex + 1)} className="gap-2">
              {levelIndex + 1 < CONNECT_DOTS_LEVELS.length ? t.nextLevel : t.startOver}
              <ArrowIcon className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => startLevel(levelIndex)} className="gap-2">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <div
        className="grid select-none touch-none mx-auto bg-muted/20 rounded-xl p-1"
        style={{
          gridTemplateColumns: `repeat(${level.size}, 1fr)`,
          maxWidth: `${level.size * 56}px`,
          width: '100%',
        }}
        onPointerMove={handlePointerMove}
      >
        {Array.from({ length: level.size }).flatMap((_, r) =>
          Array.from({ length: level.size }).map((__, c) => {
            const info = getCellPathInfo(r, c);
            const dot = findDot(r, c);
            const isDotCell = dot !== null;
            const neighbors = info ? getPathNeighbors(r, c, info.pathArr) : {};
            const opacity = info?.isDrag ? 0.5 : 0.8;

            return (
              <div
                key={`${r}-${c}`}
                data-cell
                data-r={r}
                data-c={c}
                onPointerDown={() => handleCellDown(r, c)}
                className="aspect-square relative flex items-center justify-center cursor-pointer"
              >
                <div className="absolute inset-0.5 rounded-md bg-muted/10" />

                {info && (
                  <>
                    {neighbors.up && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
                        style={{ height: '50%', width: '28%', backgroundColor: info.color, opacity }} />
                    )}
                    {neighbors.down && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none"
                        style={{ height: '50%', width: '28%', backgroundColor: info.color, opacity }} />
                    )}
                    {neighbors.left && (
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none"
                        style={{ width: '50%', height: '28%', backgroundColor: info.color, opacity }} />
                    )}
                    {neighbors.right && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-0 pointer-events-none"
                        style={{ width: '50%', height: '28%', backgroundColor: info.color, opacity }} />
                    )}
                    {!isDotCell && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                        style={{ backgroundColor: info.color, width: '32%', height: '32%', opacity }} />
                    )}
                  </>
                )}

                {isDotCell && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none z-10"
                    style={{ backgroundColor: dot.color, width: '52%', height: '52%' }} />
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground px-4">
        {t.connectDotsHint}
      </p>

      <div className="flex flex-wrap gap-2 justify-center pt-2">
        {CONNECT_DOTS_LEVELS.map((_, i) => (
          <button
            key={i}
            onClick={() => startLevel(i)}
            className={`w-8 h-8 rounded-lg border font-medium text-sm transition-all
              ${levelIndex === i
                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-teal-300'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <FeedbackOverlay show={showCelebration} isCorrect={true} message={t.connectDotsLevelComplete} />
    </div>
  );
}