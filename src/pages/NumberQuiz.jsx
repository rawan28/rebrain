import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import { generateMathProblem } from '@/lib/mathQuiz';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ArrowRight, ArrowLeft, BarChart2, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

export default function NumberQuiz() {
  const { t } = useLang();
  const difficulty = useDifficulty(1, 15);
  const [problem, setProblem] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const newProblem = useCallback((level) => {
    setProblem(generateMathProblem(level));
    setSelected(null);
    setShowNext(false);
  }, []);

  const handleStart = () => newProblem(difficulty.level);

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === problem.answer;
    awardCoin(isCorrect);
    difficulty.recordAnswer(isCorrect);
    saveSession('numbers', {
      level: difficulty.level,
      streak: isCorrect ? difficulty.streak + 1 : 0,
      totalCorrect: difficulty.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });

    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? t.correct : `${t.theAnswerWas} ${problem.answer}`,
    });

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleNext = () => newProblem(difficulty.level);
  const handleReset = () => { difficulty.reset(); setProblem(null); };

  const ArrowIcon = t.dir === 'rtl' ? ArrowLeft : ArrowRight;

  if (!problem) {
    return (
      <GameStartScreen
        title={t.numbersTitle}
        description={t.numbersDescLong}
        icon={Calculator}
        gradient="from-emerald-400 to-teal-500"
        onStart={handleStart}
        startLabel={t.startPlaying}
      >
        <Link to="/numbers-dashboard">
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-3">
            <BarChart2 className="w-6 h-6" />
            {t.dir === 'rtl' ? 'לוח בקרה' : 'Dashboard'}
          </Button>
        </Link>
      </GameStartScreen>
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={t.numbersTitle}
        description={t.numbersSubDesc}
        hint={t.dir === 'rtl' ? 'ראה את השאלה המתמטית ובחר את התשובה הנכונה מתוך 4 אפשרויות.' : 'Read the math question and choose the correct answer from 4 options.'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-card to-muted/30">
        <div className="text-center py-4">
          <motion.p
            key={problem.question}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-foreground tracking-wide"
          >
            {problem.question}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {problem.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrectAnswer = option === problem.answer;
            const showResult = selected !== null;

            let classes = 'border-border hover:border-primary hover:bg-primary/5 bg-card';
            if (showResult && isCorrectAnswer) classes = 'border-green-400 bg-green-50';
            else if (showResult && isSelected && !isCorrectAnswer) classes = 'border-red-400 bg-red-50';

            return (
              <motion.button
                key={i}
                whileTap={{ scale: selected === null ? 0.93 : 1 }}
                whileHover={{ scale: selected === null ? 1.04 : 1 }}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`rounded-2xl py-5 text-2xl md:text-3xl font-bold border-2 transition-all shadow-sm hover:shadow-md
                  ${classes} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
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
            {t.nextQuestion}
            <ArrowIcon className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}