import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Play } from 'lucide-react';
import useDifficulty from '@/lib/useDifficulty';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import ShapePatternGrid from '@/components/games/ShapePatternGrid';
import { generatePuzzle } from '@/lib/shapePatternData';

export default function ShapePattern() {
  const { t, lang } = useLang();
  const difficulty = useDifficulty(1, 15, 'shape-pattern');
  const [puzzle, setPuzzle] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const newPuzzle = useCallback(() => {
    setPuzzle(generatePuzzle(difficulty.level));
    setSelected(null);
    setShowNext(false);
  }, [difficulty.level]);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === puzzle.correctIndex;
    awardCoin(isCorrect);
    difficulty.recordAnswer(isCorrect);
    saveSession('shape-pattern', {
      level: difficulty.level,
      streak: isCorrect ? difficulty.streak + 1 : 0,
      totalCorrect: difficulty.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });
    const L = lang === 'ar'
      ? { correct: 'أحسنت! 🎉', wrong: 'ليس تماماً — حاول مجدداً' }
      : { correct: 'כל הכבוד! 🎉', wrong: 'לא בדיוק — נסה שוב' };
    setFeedback({ show: true, isCorrect, message: isCorrect ? L.correct : L.wrong });
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleReset = () => { difficulty.reset(); setPuzzle(null); };

  const title = lang === 'ar' ? 'أنماط الأشكال' : 'דפוסי צורות';
  const desc = lang === 'ar' ? 'اعثر على الشكل التالي في النمط' : 'מצא את הצורה הבאה בדפוס';
  const descLong = lang === 'ar' ? 'انظر إلى تسلسل الأشكال داخل أشكال — اختر ما يأتي بعد ذلك!' : 'הסתכל על רצף צורות בתוך צורות — בחר מה בא אחר כך!';
  const hint = lang === 'ar' ? 'لاحظ نمط الأشكال الداخلية والخارجية واختر التالي' : 'שים לב לדפוס הצורות הפנימיות והחיצוניות ובחר את הבא';
  const nextLabel = lang === 'ar' ? 'التالي' : 'הבא';

  if (!puzzle) {
    return (
      <GameStartScreen
        title={title}
        description={descLong}
        icon={Hexagon}
        gradient="from-teal-400 to-cyan-500"
        onStart={() => { difficulty.reset(); newPuzzle(); }}
        startLabel={t.startPlaying}
        resumeLevel={difficulty.level}
        onResume={newPuzzle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={title}
        description={desc}
        hint={hint}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <ShapePatternGrid
        puzzle={puzzle}
        selected={selected}
        onSelect={handleSelect}
        lang={lang}
      />

      {showNext && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <button onClick={newPuzzle} className="py-4 px-10 rounded-2xl text-xl font-bold bg-primary text-primary-foreground">
            {nextLabel}
          </button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}