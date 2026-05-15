import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import { generateMathProblem } from '@/lib/mathQuiz';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ArrowRight } from 'lucide-react';

export default function NumberQuiz() {
  const difficulty = useDifficulty(1, 10);
  const [problem, setProblem] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const newProblem = useCallback((level) => {
    setProblem(generateMathProblem(level));
    setSelected(null);
    setShowNext(false);
  }, []);

  const handleStart = () => {
    newProblem(difficulty.level);
  };

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === problem.answer;
    difficulty.recordAnswer(isCorrect);

    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? 'Correct!' : `The answer was ${problem.answer}`,
    });

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleNext = () => {
    newProblem(difficulty.level);
  };

  const handleReset = () => {
    difficulty.reset();
    setProblem(null);
  };

  if (!problem) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Number Quiz</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Solve math problems that get harder as you improve. Take your time — accuracy matters more than speed!
          </p>
        </div>
        <Button size="lg" onClick={handleStart} className="text-lg px-8 py-6 gap-3">
          <Play className="w-6 h-6" />
          Start Playing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title="Number Quiz"
        description="Solve the problem"
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-6 md:p-8 space-y-8">
        {/* Question */}
        <div className="text-center">
          <motion.p
            key={problem.question}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground tracking-wide"
          >
            {problem.question}
          </motion.p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {problem.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrectAnswer = option === problem.answer;
            const showResult = selected !== null;

            let classes = 'border-border hover:border-primary hover:bg-primary/5';
            if (showResult && isCorrectAnswer) classes = 'border-green-400 bg-green-50';
            else if (showResult && isSelected && !isCorrectAnswer) classes = 'border-red-400 bg-red-50';

            return (
              <motion.button
                key={i}
                whileTap={{ scale: selected === null ? 0.95 : 1 }}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`rounded-xl py-5 text-2xl md:text-3xl font-bold border-2 transition-all
                  ${classes} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {showNext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button size="lg" onClick={handleNext} className="text-lg px-8 py-6 gap-3">
            Next Question
            <ArrowRight className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}