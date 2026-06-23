import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ArrowRight, ArrowLeft, Apple } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
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

// Generate a fruit algebra puzzle — step-by-step, no algebra literacy needed.
// Each clue directly reveals one fruit's value. Question uses those values.
function generateFruitPuzzle(level) {
  const fruitSets = [
    ['🍓', '🍇', '🍉'],
    ['🍎', '🍊', '🍋'],
    ['🍌', '🍑', '🍒'],
    ['🥝', '🍍', '🥭'],
  ];

  const [f1, f2, f3] = fruitSets[Math.floor(Math.random() * fruitSets.length)];

  // Simple whole-number values — grow slightly with level
  const v1 = Math.floor(Math.random() * 3) + 2 + Math.min(level - 1, 4); // 2–8
  const v2 = Math.floor(Math.random() * 3) + 2 + Math.min(level - 1, 4); // 2–8
  const v3 = Math.floor(Math.random() * 3) + 1 + Math.min(level - 1, 3); // 1–6

  // Clue 1: f1 × 3 = ? → reveals v1 directly (3 identical fruits)
  // Clue 2: f2 × 3 = ? → reveals v2 directly
  // Clue 3: f3 × 3 = ? → reveals v3 directly
  // Question: f1 + f2 + f3 = ? (simple addition of the three values)
  const clues = [
    { left: [f1, '+', f1, '+', f1], right: 3 * v1, value: v1, fruit: f1 },
    { left: [f2, '+', f2, '+', f2], right: 3 * v2, value: v2, fruit: f2 },
    { left: [f3, '+', f3, '+', f3], right: 3 * v3, value: v3, fruit: f3 },
  ];

  const answer = v1 + v2 + v3;

  const wrongs = shuffle(
    [answer - 1, answer + 1, answer - 2, answer + 2, answer + v1, answer - v3]
      .filter(x => x !== answer && x > 0)
  ).slice(0, 3);
  while (wrongs.length < 3) wrongs.push(answer + wrongs.length + 2);

  return {
    clues,
    question: [f1, '+', f2, '+', f3],
    answer: String(answer),
    options: shuffle([String(answer), ...wrongs.map(String)]),
    fruits: [f1, f2, f3],
    values: [v1, v2, v3],
  };
}

export default function FruitAlgebra() {
  const { t } = useLang();
  const difficulty = useDifficulty(1, 15, 'fruit_algebra');
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
      <GameStartScreen
        title={t.fruitAlgebraTitle || 'אלגברת פירות 🍓'}
        description={t.fruitAlgebraDesc || 'גלה את ערך כל פרי ופתור את החידה האחרונה!'}
        icon={Apple}
        gradient="from-red-400 to-rose-500"
        onStart={handleStart}
        startLabel={t.startPlaying || 'התחל לשחק'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={t.fruitAlgebraTitle || 'אלגברת פירות 🍓'}
        description={t.fruitAlgebraSubDesc || 'מה ערך כל פרי?'}
        hint={t.dir === 'rtl' ? 'לכל פרי יש ערך מספרי. השתמש ברמזים כדי לגלות אותו, ואז פתור את השאלה.' : 'Each fruit has a secret number. Use the clues to figure it out, then solve the question.'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-5 md:p-8 space-y-6">
        {/* Step 1: Discover each fruit's value */}
        <div className="space-y-3">
          <p className="text-base font-semibold text-muted-foreground">
            {t.dir === 'rtl' ? '📖 שלב 1 — גלה את ערך כל פרי:' : '📖 Step 1 — Find each fruit\'s value:'}
          </p>
          {puzzle.clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-muted/40 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap"
            >
              {/* equation */}
              <span className="text-3xl md:text-4xl">{clue.fruit}</span>
              <span className="text-orange-500 font-bold text-2xl">+</span>
              <span className="text-3xl md:text-4xl">{clue.fruit}</span>
              <span className="text-orange-500 font-bold text-2xl">+</span>
              <span className="text-3xl md:text-4xl">{clue.fruit}</span>
              <span className="text-orange-500 font-bold text-2xl">=</span>
              <span className="text-2xl font-bold text-foreground">{clue.right}</span>
              {/* reveal arrow → value */}
              <span className="text-muted-foreground text-xl mx-1">→</span>
              <span className="text-3xl md:text-4xl">{clue.fruit}</span>
              <span className="text-orange-500 font-bold text-2xl">=</span>
              <span className="text-2xl font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1">{clue.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-primary/30" />

        {/* Step 2: Use the values to answer */}
        <div className="space-y-4">
          <p className="text-base font-semibold text-primary">
            {t.dir === 'rtl' ? '❓ שלב 2 — עכשיו חשב:' : '❓ Step 2 — Now calculate:'}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-primary/5 border-2 border-primary/20 rounded-xl px-4 py-4 flex items-center gap-3 flex-wrap"
          >
            {puzzle.question.map((part, j) => (
              <span key={j} className={part === '+'
                ? 'text-orange-500 font-bold text-2xl md:text-3xl'
                : 'text-3xl md:text-4xl'}>
                {part}
              </span>
            ))}
            <span className="text-orange-500 font-bold text-2xl">=</span>
            <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl w-14 h-14 flex items-center justify-center text-2xl text-primary font-bold">?</div>
          </motion.div>

          <p className="text-base text-muted-foreground">{t.fruitAlgebraPickAnswer || 'בחר את התשובה הנכונה:'}</p>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
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
                  className={`rounded-xl py-4 px-3 border-2 transition-all min-h-[64px] flex items-center justify-center text-2xl md:text-3xl font-bold ${borderClass} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
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