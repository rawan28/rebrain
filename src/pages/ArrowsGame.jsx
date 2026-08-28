import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '@/lib/LanguageContext';
import useDifficulty from '@/lib/useDifficulty';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import useTimeouts from '@/hooks/useTimeouts';
import GameStartScreen from '@/components/games/GameStartScreen';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import ArrowsBoard from '@/components/games/ArrowsBoard';
import { generatePuzzle, isReleasable } from '@/lib/arrowsGameData';
import { ArrowRight } from 'lucide-react';

const L = {
  he: {
    title: 'חיצים',
    desc: 'שחררו חץ אחר חץ עד שכולם נקלו. חץ משתחרר רק אם הדרך שלו לקצה הלוח פנויה.',
    sub: 'לחצו על חץ כדי לשחררו',
    start: 'התחל לשחק',
    remaining: 'נותרו',
    great: 'כל הכבוד! ניקיתם את כל החיצים.',
    levelUp: '🎉 עלית רמה!',
  },
  ar: {
    title: 'الأسهم',
    desc: 'حرّر سهماً بعد سهم حتى تُخلّى اللوحة. يُحرَّر السهم فقط إذا كان طريقه إلى حافة اللوحة خالياً.',
    sub: 'انقر على سهم لتحريره',
    start: 'ابدأ اللعب',
    remaining: 'متبقّي',
    great: 'أحسنت! خلّصت كل الأسهم.',
    levelUp: '🎉 مستوى أعلى!',
  },
};

export default function ArrowsGame() {
  const { lang } = useLang();
  const t = L[lang] || L.he;
  const difficulty = useDifficulty(1, 10, 'arrows', { dda: true });
  const [puzzle, setPuzzle] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [blockedId, setBlockedId] = useState(null);
  const completedRef = useRef(false);
  const { setTimeoutAndTrack, clearAll } = useTimeouts();

  const startRound = useCallback(() => {
    const p = generatePuzzle(difficulty.level);
    setPuzzle(p);
    setArrows(p.arrows);
    setBlockedId(null);
    completedRef.current = false;
    setStarted(true);
  }, [difficulty.level]);

  const handleComplete = useCallback(() => {
    awardCoin(true);
    const direction = difficulty.recordAnswer(true);
    saveSession('arrows', {
      level: difficulty.level,
      streak: difficulty.streak,
      totalCorrect: difficulty.totalCorrect + 1,
      totalAttempts: difficulty.totalAttempts + 1,
    });
    const dirNote = direction === 'up' ? ` ${t.levelUp}` : '';
    setFeedback({ show: true, isCorrect: true, message: `${t.great}${dirNote}` });
    setTimeoutAndTrack(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      startRound();
    }, 2200);
  }, [difficulty, t, startRound, setTimeoutAndTrack]);

  useEffect(() => {
    if (started && puzzle && arrows.length === 0 && !completedRef.current) {
      completedRef.current = true;
      handleComplete();
    }
  }, [arrows.length, started, puzzle, handleComplete]);

  const onRelease = (a) => {
    if (!isReleasable(a, arrows, puzzle.rows, puzzle.cols)) {
      setBlockedId(a.id);
      setTimeoutAndTrack(() => setBlockedId(null), 500);
      return;
    }
    setArrows(prev => prev.filter(x => x.id !== a.id));
  };

  const handleFullReset = () => {
    clearAll();
    setArrows([]);
    setFeedback({ show: false, isCorrect: false, message: '' });
    setBlockedId(null);
    difficulty.reset();
    setStarted(false);
  };

  if (!started || !puzzle) {
    return (
      <GameStartScreen
        title={t.title}
        description={t.desc}
        icon={ArrowRight}
        gradient="from-rose-400 to-orange-500"
        onStart={() => { difficulty.reset(); startRound(); }}
        startLabel={t.start}
        resumeLevel={difficulty.level}
        onResume={startRound}
      />
    );
  }

  return (
    <div className="space-y-4">
      <GameHeader
        title={t.title}
        description={t.sub}
        hint={t.desc}
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

      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-4 py-1.5 text-base font-semibold">
          🏹 {puzzle.numCount}
        </span>
        <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-full px-4 py-1.5 text-base font-semibold text-foreground">
          {t.remaining}: {arrows.length}
        </span>
      </div>

      <div className="max-w-md mx-auto">
        <ArrowsBoard puzzle={puzzle} arrows={arrows} onRelease={onRelease} blockedId={blockedId} />
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}