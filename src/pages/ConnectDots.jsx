import { useState, useRef, useEffect } from 'react';
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
  const [levelIndex, setLevelIndex] = useState(() => {
    try { const v = parseInt(localStorage.getItem('rebrain_level_connect_dots'), 10); return isNaN(v) ? 0 : Math.min(v, CONNECT_DOTS_LEVELS.length - 1); } catch { return 0; }
  });
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [paths, setPaths] = useState({});
  const [dragColor, setDragColor] = useState(null);
  const [dragPath, setDragPath] = useState([]);

  // Keep refs in sync for use inside event handlers
  const levelRef = useRef(CONNECT_DOTS_LEVELS[0]);
  const pathsRef = useRef({});
  const dragColorRef = useRef(null);
  const dragPathRef = useRef([]);
  const boardRef = useRef(null);
  const wonRef = useRef(false);

  const level = CONNECT_DOTS_LEVELS[levelIndex];

  // Sync refs
  levelRef.current = level;
  pathsRef.current = paths;
  dragColorRef.current = dragColor;
  dragPathRef.current = dragPath;

  const startLevel = (idx) => {
    const i = Math.min(Math.max(idx, 0), CONNECT_DOTS_LEVELS.length - 1);
    try { localStorage.setItem('rebrain_level_connect_dots', String(i)); } catch {}
    setLevelIndex(i);
    setPaths({});
    setDragColor(null);
    setDragPath([]);
    setWon(false);
    wonRef.current = false;
    setShowCelebration(false);
    setStarted(true);
  };

  // Get cell row/col from a point on screen
  const getCellFromPoint = (clientX, clientY) => {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const lv = levelRef.current;
    const cellW = rect.width / lv.size;
    const cellH = rect.height / lv.size;
    const c = Math.floor((clientX - rect.left) / cellW);
    const r = Math.floor((clientY - rect.top) / cellH);
    if (r < 0 || r >= lv.size || c < 0 || c >= lv.size) return null;
    return { r, c };
  };

  const findDot = (r, c, lv) => {
    for (const pair of lv.pairs) {
      if ((pair.a.r === r && pair.a.c === c) || (pair.b.r === r && pair.b.c === c)) return pair;
    }
    return null;
  };

  const isCellOccupiedByOther = (r, c, myColor) => {
    for (const [color, path] of Object.entries(pathsRef.current)) {
      if (color !== myColor && path.some(p => p.r === r && p.c === c)) return true;
    }
    return false;
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    const { r, c } = cell;
    const lv = levelRef.current;
    const dot = findDot(r, c, lv);
    if (!dot) return;

    dragColorRef.current = dot.color;
    dragPathRef.current = [{ r, c }];
    setDragColor(dot.color);
    setDragPath([{ r, c }]);
    setPaths(prev => {
      const next = { ...prev };
      delete next[dot.color];
      return next;
    });
    wonRef.current = false;
    setWon(false);
  };

  // Interpolate a straight-line walk of cells from last to (r,c) to handle fast drags
  const interpolateCells = (last, r, c) => {
    const cells = [];
    let cr = last.r, cc = last.c;
    while (cr !== r || cc !== c) {
      if (cr !== r) cr += cr < r ? 1 : -1;
      else cc += cc < c ? 1 : -1;
      cells.push({ r: cr, c: cc });
    }
    return cells;
  };

  const tryAddCell = (r, c, currentPath) => {
    const lv = levelRef.current;
    if (r < 0 || r >= lv.size || c < 0 || c >= lv.size) return currentPath;

    const last = currentPath[currentPath.length - 1];
    if (last.r === r && last.c === c) return currentPath;

    // Backtrack
    if (currentPath.length >= 2) {
      const prev = currentPath[currentPath.length - 2];
      if (prev.r === r && prev.c === c) return currentPath.slice(0, -1);
    }

    // Loop detection - trim to loop point
    const loopIdx = currentPath.findIndex(p => p.r === r && p.c === c);
    if (loopIdx !== -1) return currentPath.slice(0, loopIdx + 1);

    const dot = findDot(r, c, lv);

    // Can't enter another color's dot
    if (dot && dot.color !== dragColorRef.current) return currentPath;

    // Can't enter a cell used by another completed path
    if (isCellOccupiedByOther(r, c, dragColorRef.current)) return currentPath;

    return [...currentPath, { r, c }];
  };

  const onPointerMove = (e) => {
    if (!dragColorRef.current) return;
    e.preventDefault();
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    const { r, c } = cell;
    let currentPath = dragPathRef.current;
    if (currentPath.length === 0) return;
    const last = currentPath[currentPath.length - 1];
    if (last.r === r && last.c === c) return;

    // Interpolate cells for fast drags (only horizontal/vertical steps)
    const cells = interpolateCells(last, r, c);
    for (const cell of cells) {
      currentPath = tryAddCell(cell.r, cell.c, currentPath);
    }

    // Check if we've reached the end dot — auto-complete
    const lv = levelRef.current;
    const dot = findDot(r, c, lv);
    if (dot && dot.color === dragColorRef.current) {
      const pair = lv.pairs.find(p => p.color === dragColorRef.current);
      const start = currentPath[0];
      const isStartA = start.r === pair.a.r && start.c === pair.a.c;
      const endDot = isStartA ? pair.b : pair.a;
      const endOfPath = currentPath[currentPath.length - 1];
      if (endOfPath.r === endDot.r && endOfPath.c === endDot.c) {
        const color = dragColorRef.current;
        dragColorRef.current = null;
        dragPathRef.current = [];
        setDragColor(null);
        setDragPath([]);
        setPaths(prev => {
          const next = { ...prev, [color]: currentPath };
          checkWin(next);
          return next;
        });
        return;
      }
    }

    dragPathRef.current = currentPath;
    setDragPath(currentPath);
  };

  const isPairConnected = (pair, allPaths) => {
    const path = (allPaths || paths)[pair.color];
    if (!path || path.length < 2) return false;
    const s = path[0];
    const e = path[path.length - 1];
    return ((s.r === pair.a.r && s.c === pair.a.c) && (e.r === pair.b.r && e.c === pair.b.c)) ||
           ((s.r === pair.b.r && s.c === pair.b.c) && (e.r === pair.a.r && e.c === pair.a.c));
  };

  const checkWin = (newPaths) => {
    if (wonRef.current) return;
    const allConnected = levelRef.current.pairs.every(pair => isPairConnected(pair, newPaths));
    if (allConnected) {
      wonRef.current = true;
      setWon(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2200);
      awardCoin(true);
      saveSession('connect_dots', { level: levelIndex + 1, streak: 1, totalCorrect: 1, totalAttempts: 1 });
    }
  };

  const onPointerUp = () => {
    if (!dragColorRef.current) return;
    const color = dragColorRef.current;
    const path = [...dragPathRef.current];
    dragColorRef.current = null;
    dragPathRef.current = [];
    setDragColor(null);
    setDragPath([]);
    if (path.length >= 2) {
      setPaths(prev => {
        const next = { ...prev, [color]: path };
        checkWin(next);
        return next;
      });
    }
  };

  const connectedCount = level.pairs.filter(p => isPairConnected(p)).length;
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

      {/* Game Board */}
      <div
        className="relative select-none touch-none mx-auto bg-muted/20 rounded-xl"
        style={{ maxWidth: `${level.size * 60}px`, width: '100%', aspectRatio: '1 / 1' }}
        ref={boardRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <svg
          viewBox={`0 0 ${level.size} ${level.size}`}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none' }}
        >
          {/* Grid lines */}
          {Array.from({ length: level.size + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i} y1={0} x2={i} y2={level.size} stroke="currentColor" strokeWidth={0.02} className="text-border" opacity={0.5} />
          ))}
          {Array.from({ length: level.size + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i} x2={level.size} y2={i} stroke="currentColor" strokeWidth={0.02} className="text-border" opacity={0.5} />
          ))}

          {/* Completed paths */}
          {Object.entries(paths).map(([color, path]) => {
            if (path.length < 2) return null;
            const pts = path.map(p => `${p.c + 0.5},${p.r + 0.5}`).join(' ');
            return (
              <polyline key={color} points={pts} fill="none" stroke={color}
                strokeWidth={0.35} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
            );
          })}

          {/* Active drag path */}
          {dragColor && dragPath.length >= 1 && (
            <polyline
              points={dragPath.map(p => `${p.c + 0.5},${p.r + 0.5}`).join(' ')}
              fill="none" stroke={dragColor}
              strokeWidth={0.35} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}
            />
          )}

          {/* Dots */}
          {level.pairs.map((pair) => [
            <circle key={`a-${pair.color}`} cx={pair.a.c + 0.5} cy={pair.a.r + 0.5} r={0.3}
              fill={pair.color} stroke="white" strokeWidth={0.07} />,
            <circle key={`b-${pair.color}`} cx={pair.b.c + 0.5} cy={pair.b.r + 0.5} r={0.3}
              fill={pair.color} stroke="white" strokeWidth={0.07} />,
          ])}
        </svg>
      </div>

      <p className="text-center text-sm text-muted-foreground px-4">{t.connectDotsHint}</p>

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