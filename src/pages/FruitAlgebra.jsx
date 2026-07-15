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

// Generate a fruit algebra puzzle where the user must INFER at least one value.
// Level 1-3: 2 fruits, one given directly, one inferred from a mixed clue.
// Level 4-7: 3 fruits, two given directly, one inferred.
// Level 8+:  3 fruits, one given directly, two inferred through chained clues.
function generateFruitPuzzle(level) {
  const fruitSets = [
    ['🍓', '🍇', '🍉'],
    ['🍎', '🍊', '🍋'],
    ['🍌', '🍑', '🍒'],
    ['🥝', '🍍', '🥭'],
  ];

  const set = fruitSets[Math.floor(Math.random() * fruitSets.length)];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (level <= 3) {
    // 2 fruits: clue 1 gives f1, clue 2 uses f1+f2 so user infers f2
    const [f1, f2] = set;
    const v1 = rand(2, 5);
    const v2 = rand(2, 5);
    const clues = [
      { parts: [f1, '+', f1, '+', f1], right: 3 * v1, reveal: { fruit: f1, value: v1 } },
      { parts: [f1, '+', f2], right: v1 + v2, reveal: null },
    ];
    const answer = v2 * 2;
    const question = [f2, '+', f2];
    const wrongs = uniqueWrongs(answer, [answer - 1, answer + 1, answer - 2, answer + 2, v1 + v2]);
    return { clues, question, answer: String(answer), options: shuffle([String(answer), ...wrongs.map(String)]), askFruit: f2 };
  }

  if (level <= 7) {
    // 3 fruits: clue 1 gives f1, clue 2 gives f2, clue 3 uses f1+f2+f3 → infer f3
    const [f1, f2, f3] = set;
    const v1 = rand(2, 6);
    const v2 = rand(2, 6);
    const v3 = rand(1, 5);
    const clues = [
      { parts: [f1, '+', f1, '+', f1], right: 3 * v1, reveal: { fruit: f1, value: v1 } },
      { parts: [f2, '+', f2], right: 2 * v2, reveal: { fruit: f2, value: v2 } },
      { parts: [f1, '+', f2, '+', f3], right: v1 + v2 + v3, reveal: null },
    ];
    const answer = v3 * 3;
    const question = [f3, '+', f3, '+', f3];
    const wrongs = uniqueWrongs(answer, [answer - 1, answer + 1, answer + 3, answer - 3, v1 + v2 + v3]);
    return { clues, question, answer: String(answer), options: shuffle([String(answer), ...wrongs.map(String)]), askFruit: f3 };
  }

  // Level 8+: chain — clue 1 gives f1, clue 2 uses f1 to find f2, clue 3 uses f2 to find f3
  const [f1, f2, f3] = set;
  const v1 = rand(2, 7);
  const v2 = rand(2, 7);
  const v3 = rand(1, 6);
  const clues = [
    { parts: [f1, '+', f1], right: 2 * v1, reveal: { fruit: f1, value: v1 } },
    { parts: [f1, '+', f2], right: v1 + v2, reveal: null },
    { parts: [f2, '+', f3], right: v2 + v3, reveal: null },
  ];
  const answer = v1 + v2 + v3;
  const question = [f1, '+', f2, '+', f3];
  const wrongs = uniqueWrongs(answer, [answer - 1, answer + 1, answer - 2, answer + 2, answer + v1]);
  return { clues, question, answer: String(answer), options: shuffle([String(answer), ...wrongs.map(String)]), askFruit: null };
}

function uniqueWrongs(answer, candidates) {
  const set = new Set();
  candidates.forEach(c => { if (c !== answer && c > 0) set.add(c); });
  const arr = [...set];
  while (arr.length < 3) arr.push(answer + arr.length + 2);
  return shuffle(arr).slice(0, 3);
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
        onStart={() => { difficulty.reset(); handleStart(); }}
        startLabel={t.startPlaying || 'התחל לשחק'}
        resumeLevel={difficulty.level}
        onResume={handleStart}
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
        {/* Clues */}
        <div className="space-y-3">
          <p className="text-base font-semibold text-muted-foreground">
            {t.dir === 'rtl' ? '📖 רמזים — השתמש בהם כדי לחשב:' : '📖 Clues — use them to calculate:'}
          </p>
          {puzzle.clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-muted/40 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap"
            >
              {clue.parts.map((part, j) => (
                <span key={j} className={part === '+' ? 'text-orange-500 font-bold text-2xl' : 'text-3xl md:text-4xl'}>{part}</span>
              ))}
              <span className="text-orange-500 font-bold text-2xl">=</span>
              <span className="text-2xl font-bold text-foreground">{clue.right}</span>
              {clue.reveal && (
                <div className="w-full flex items-center gap-2 mt-1 ps-2">
                  <span className="text-2xl font-bold text-muted-foreground">1</span>
                  <span className="text-3xl md:text-4xl">{clue.reveal.fruit}</span>
                  <span className="text-orange-500 font-bold text-2xl">=</span>
                  <span className="text-2xl font-bold text-green-600 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg px-3 py-1">{clue.reveal.value}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-primary/30" />

        {/* Step 2: Use the values to answer */}
        <div className="space-y-4">
          <p className="text-base font-semibold text-primary">
            {t.dir === 'rtl' ? '❓ מה התוצאה?' : '❓ What\'s the answer?'}
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