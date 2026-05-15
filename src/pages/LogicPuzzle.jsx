import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import { generatePuzzle } from '@/lib/logicPuzzles';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ArrowRight } from 'lucide-react';

export default function LogicPuzzle() {
  const difficulty = useDifficulty(1, 10);
  const [puzzle, setPuzzle] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const newPuzzle = useCallback((level) => {
    setPuzzle(generatePuzzle(level));
    setSelected(null);
    setShowNext(false);
  }, []);

  const handleStart = () => {
    newPuzzle(difficulty.level);
  };

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === puzzle.answer;
    difficulty.recordAnswer(isCorrect);
    
    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? 'Great thinking!' : `The answer was ${puzzle.answer}`,
    });

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleNext = () => {
    newPuzzle(difficulty.level);
  };

  const handleReset = () => {
    difficulty.reset();
    setPuzzle(null);
  };

  if (!puzzle) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Logic Puzzles</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Look at the pattern or group and choose the right answer. Think carefully!
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
        title="Logic Puzzles"
        description="Find the pattern"
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-6 md:p-8 space-y-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">{puzzle.question}</h3>

        {/* Sequence display */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {puzzle.sequence.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-muted rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-bold border-2 border-border"
            >
              {item}
            </motion.div>
          ))}
          {puzzle.type !== 'odd_one_out' && (
            <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl text-primary font-bold">
              ?
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md">
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
                className={`rounded-xl py-4 px-4 text-2xl md:text-3xl font-bold border-2 transition-all
                  ${borderClass} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
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
            Next Puzzle
            <ArrowRight className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}