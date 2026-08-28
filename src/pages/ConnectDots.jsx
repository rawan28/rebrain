import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '@/lib/LanguageContext';
import useDifficulty from '@/lib/useDifficulty';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import useTimeouts from '@/hooks/useTimeouts';
import GameStartScreen from '@/components/games/GameStartScreen';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import ConnectDotsBoard from '@/components/games/ConnectDotsBoard';
import { generatePuzzle, validatePath } from '@/lib/connectDotsData';
import { Undo2, Lightbulb, RotateCcw, Spline } from 'lucide-react';

const L = {
  he: {
    title: 'חבר את הנקודות',
    desc: 'גררו קו רציף מ-1 עד המספר האחרון ומלאו את כל התאים.',
    sub: 'התחילו בנקודה 1 ועברו לפי הסדר',
    start: 'התחל לשחק',
    undo: 'חזור',
    hint: 'רמז',
    reset: 'אפס',
    howToPlay: 'גררו מהנקודה מספר 1 דרך שאר המספרים בסדר עולה. מלאו את כל התאים בלוח.',
    great: 'כל הכבוד!',
    levelUp: '🎉 עלית רמה!',
  },
  ar: {
    title: 'صل النقاط',
    desc: 'ارسم خطاً متصلاً من 1 إلى الرقم الأخير واملأ كل الخلايا.',
    sub: 'ابدأ من النقطة 1 واتبع الترتيب',
    start: 'ابدأ اللعب',
    undo: 'رجوع',
    hint: 'تلميح',
    reset: 'إعادة',
    howToPlay: 'اسحب من النقطة رقم 1 عبر بقية الأرقام بالترتيب التصاعدي. املأ كل الخلايا في اللوحة.',
    great: 'أحسنت!',
    levelUp: '🎉 مستوى أعلى!',
  },
};

const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function ConnectDots() {
  const { lang } = useLang();
  const t = L[lang] || L.he;
  const difficulty = useDifficulty(1, 10, 'connect-dots', { dda: true });
  const [puzzle, setPuzzle] = useState(null);
  const [path, setPath] = useState([]);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [hintCell, setHintCell] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const { setTimeoutAndTrack, clearAll } = useTimeouts();

  const startRound = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty.level));
    setPath([]);
    setHintCell(null);
    setSeconds(0);
    setStarted(true);
  }, [difficulty.level]);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [started]);

  // completion check
  useEffect(() => {
    if (!puzzle || path.length === 0) return;
    if (path.length === puzzle.rows * puzzle.cols) {
      if (validatePath(path, puzzle.dots, puzzle.rows, puzzle.cols)) {
        awardCoin(true);
        const direction = difficulty.recordAnswer(true);
        saveSession('connect-dots', {
          level: difficulty.level,
          streak: difficulty.streak,
          totalCorrect: difficulty.totalCorrect + 1,
          totalAttempts: difficulty.totalAttempts + 1,
        });
        const dirNote = direction === 'up' ? ` ${t.levelUp}` : '';
        setFeedback({
          show: true,
          isCorrect: true,
          message: `${t.great} ${lang === 'ar' ? 'أكملت في' : 'סיימת ב-'} ${fmtTime(seconds)}.${dirNote}`,
        });
        setTimeoutAndTrack(() => {
          setFeedback({ show: false, isCorrect: false, message: '' });
          startRound();
        }, 2200);
      }
    }
  }, [path, puzzle]);

  const handleCellEnter = (cell) => {
    setPath(prev => {
      if (prev.length === 0) {
        const d1 = puzzle.dots[0];
        return (cell.r === d1.r && cell.c === d1.c) ? [cell] : prev;
      }
      const last = prev[prev.length - 1];
      if (last.r === cell.r && last.c === cell.c) return prev;
      // backtrack one step
      if (prev.length >= 2) {
        const pp = prev[prev.length - 2];
        if (pp.r === cell.r && pp.c === cell.c) return prev.slice(0, -1);
      }
      if (prev.some(p => p.r === cell.r && p.c === cell.c)) return prev;
      if (Math.abs(last.r - cell.r) + Math.abs(last.c - cell.c) !== 1) return prev;
      return [...prev, cell];
    });
  };

  const handleUndo = () => setPath(prev => prev.slice(0, -1));
  const handleBoardReset = () => { setPath([]); setHintCell(null); };

  const handleHint = () => {
    if (!puzzle) return;
    let reached = 0;
    while (reached < puzzle.dots.length && path.some(p => p.r === puzzle.dots[reached].r && p.c === puzzle.dots[reached].c)) reached++;
    if (reached < puzzle.dots.length) {
      setHintCell(puzzle.dots[reached]);
      setTimeoutAndTrack(() => setHintCell(null), 1800);
    }
  };

  const handleFullReset = () => {
    clearAll();
    if (timerRef.current) clearInterval(timerRef.current);
    setPath([]);
    setFeedback({ show: false, isCorrect: false, message: '' });
    setHintCell(null);
    difficulty.reset();
    setStarted(false);
  };

  if (!started || !puzzle) {
    return (
      <GameStartScreen
        title={t.title}
        description={t.desc}
        icon={Spline}
        gradient="from-orange-400 to-red-500"
        onStart={() => { difficulty.reset(); startRound(); }}
        startLabel={t.start}
        resumeLevel={difficulty.level}
        onResume={startRound}
      />
    );
  }

  const filled = path.length;
  const total = puzzle.rows * puzzle.cols;

  return (
    <div className="space-y-4">
      <GameHeader
        title={t.title}
        description={t.sub}
        hint={t.howToPlay}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleFullReset}
        levelBadge={
          difficulty.lastDirection === 'up' ? '📈' :
          difficulty.lastDirection === 'down' ? '📉' : null
        }
      />

      {/* timer + progress */}
      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-full px-4 py-1.5 text-base font-semibold text-foreground">
          ⏱ {fmtTime(seconds)}
        </span>
        <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-4 py-1.5 text-base font-semibold">
          {puzzle.numCount} {lang === 'ar' ? 'نقاط' : 'נקודות'}
        </span>
        <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-full px-4 py-1.5 text-base font-semibold text-foreground">
          {filled}/{total}
        </span>
      </div>

      <div className="max-w-md mx-auto">
        <ConnectDotsBoard
          puzzle={puzzle}
          path={path}
          hintCell={hintCell}
          onCellEnter={handleCellEnter}
        />
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleUndo}
          disabled={path.length === 0}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-foreground border border-border text-base font-semibold disabled:opacity-40 active:scale-95 transition-transform min-h-[48px]"
        >
          <Undo2 className="w-5 h-5" />
          {t.undo}
        </button>
        <button
          onClick={handleHint}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-base font-semibold active:scale-95 transition-transform min-h-[48px]"
        >
          <Lightbulb className="w-5 h-5" />
          {t.hint}
        </button>
        <button
          onClick={handleBoardReset}
          disabled={path.length === 0}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-foreground border border-border text-base font-semibold disabled:opacity-40 active:scale-95 transition-transform min-h-[48px]"
        >
          <RotateCcw className="w-5 h-5" />
          {t.reset}
        </button>
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}