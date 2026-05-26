import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a fruit algebra puzzle
function generateFruitPuzzle(level) {
  const fruitSets = [
    { fruits: ['🍓', '🍇', '🍉'], names: ['תות', 'ענבים', 'אבטיח'] },
    { fruits: ['🍎', '🍊', '🍋'], names: ['תפוח', 'תפוז', 'לימון'] },
    { fruits: ['🍌', '🍑', '🍒'], names: ['בננה', 'אפרסק', 'דובדבן'] },
    { fruits: ['🥝', '🍍', '🥭'], names: ['קיווי', 'אננס', 'מנגו'] },
  ];

  const set = fruitSets[Math.floor(Math.random() * fruitSets.length)];
  const [f1, f2, f3] = set.fruits;

  // Assign values based on level
  const v1 = Math.floor(Math.random() * 4) + 2 + Math.min(level, 5); // 4–11
  const v2 = Math.floor(Math.random() * 4) + 2 + Math.min(level, 3); // 4–9
  const v3 = Math.floor(Math.random() * 3) + 1 + Math.min(level, 4); // 2–8

  // Build clues:
  // 1) f1 + f1 + f1 = 3*v1
  // 2) f1 + f2 + f2 = v1 + 2*v2
  // 3) f2 + f3 + f3 = v2 + 2*v3
  // 4) Question: f1 + f2 × f3 - f2 = v1 + v2*(v3-1) 
  //    (just show the last puzzle as f3 + f3 + f3 = ?)
  // Simpler: just ask f3 + f3 + f3

  const answer = 3 * v3;

  const clues = [
    { left: [f1, '+', f1, '+', f1], right: 3 * v1 },
    { left: [f1, '+', f2, '+', f2], right: v1 + 2 * v2 },
    { left: [f2, '+', f3, '+', f3], right: v2 + 2 * v3 },
  ];

  const wrong = shuffle([answer - 3, answer + 3, answer - v3, answer + v3 * 2].filter(x => x !== answer && x > 0)).slice(0, 3);
  while (wrong.length < 3) wrong.push(answer + wrong.length + 1);

  return {
    clues,
    question: [f3, '+', f3, '+', f3],
    answer: String(answer),
    options: shuffle([String(answer), ...wrong.slice(0, 3).map(String)]),
    fruits: set.fruits,
    values: [v1, v2, v3],
  };
}

export default function FruitAlgebra() {
  const { t } = useLang();
  const difficulty = useDifficulty(1, 10);
  const [puzzle, setPuzzle] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const ArrowIcon = t.dir === 'rtl' ? ArrowLeft : ArrowRight;

  const newPuzzle = useCallback((level) => {
    setPuzzle(generateFruitPuzzle(level));
    setSelected(null);
    setShowNext(false);
  }, []);

  const handleStart = () => newPuzzle(difficulty.level);

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === puzzle.answer;
    awardCoin(isCorrect);
    difficulty.recordAnswer(isCorrect);
    saveSession('fruit_algebra', {
      level: difficulty.level,
      streak: isCorrect ? difficulty.streak + 1 : 0,
      totalCorrect: difficulty.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });
    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? (t.greatThinking || 'כל הכבוד!') : `${t.theAnswerWas || 'התשובה הייתה'} ${puzzle.answer}`,
    });
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleNext = () => newPuzzle(difficulty.level);
  const handleReset = () => { difficulty.reset(); setPuzzle(null); };

  if (!puzzle) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t.fruitAlgebraTitle || 'אלגברת פירות 🍓'}
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            {t.fruitAlgebraDesc || 'גלה את ערך כל פרי ופתור את החידה האחרונה!'}
          </p>
        </div>
        <Button size="lg" onClick={handleStart} className="text-lg px-8 py-6 gap-3">
          <Play className="w-6 h-6" />
          {t.startPlaying || 'התחל לשחק'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={t.fruitAlgebraTitle || 'אלגברת פירות 🍓'}
        description={t.fruitAlgebraSubDesc || 'מה ערך כל פרי?'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-5 md:p-8 space-y-5">
        {/* Clue rows */}
        <div className="space-y-3">
          {puzzle.clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-2 flex-wrap"
            >
              {clue.left.map((part, j) => (
                <span key={j} className={part === '+' || part === '×' || part === '-'
                  ? 'text-orange-500 font-bold text-2xl md:text-3xl'
                  : 'text-3xl md:text-4xl'}>
                  {part}
                </span>
              ))}
              <span className="text-orange-500 font-bold text-2xl md:text-3xl">=</span>
              <span className="text-orange-500 font-bold text-2xl md:text-3xl">{clue.right}</span>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-border" />

        {/* Question row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {puzzle.question.map((part, j) => (
            <span key={j} className={part === '+' || part === '×' || part === '-'
              ? 'text-orange-500 font-bold text-2xl md:text-3xl'
              : 'text-3xl md:text-4xl'}>
              {part}
            </span>
          ))}
          <span className="text-orange-500 font-bold text-2xl md:text-3xl">=</span>
          <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl w-14 h-14 flex items-center justify-center text-2xl text-primary font-bold">?</div>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xs">
          {puzzle.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrectAnswer = option === puzzle.answer;
            const showResult = selected !== null;

            let borderClass = 'border-border hover:border-primary/50 hover:bg-primary/5';
            if (showResult && isCorrectAnswer) borderClass = 'border-green-400 bg-green-50';
            else if (showResult && isSelected && !isCorrectAnswer) borderClass = 'border-red-400 bg-red-50';

            return (
              <motion.button
                key={i}
                whileTap={{ scale: selected === null ? 0.95 : 1 }}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`rounded-xl py-3 px-3 border-2 transition-all min-h-[56px] flex items-center justify-center text-2xl md:text-3xl font-bold ${borderClass} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {showNext && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button size="lg" onClick={handleNext} className="text-lg px-8 py-6 gap-3">
            {t.nextPuzzle || 'חידה הבאה'}
            <ArrowIcon className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}