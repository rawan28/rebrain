import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import { generatePuzzle } from '@/lib/logicPuzzles';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, ArrowRight, ArrowLeft, Puzzle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

export default function LogicPuzzle() {
  const { t } = useLang();
  const difficulty = useDifficulty(1, 15, 'logic');
  const [puzzle, setPuzzle] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const getLocalizedQuestion = useCallback((puz) => {
    if (!puz) return '';
    if (puz.type === 'pattern') return t.whatComesNext;
    if (puz.type === 'number_pattern') return t.whatNumberNext;
    if (puz.type === 'odd_one_out') return t.whatDoesntBelong;
    if (puz.type === 'analogy') return t.analogyQuestion || 'השלם את האנלוגיה: A : B כמו C : ?';
    if (puz.type === 'matrix') return t.matrixQuestion || 'מה חסר במטריצה?';
    if (puz.type === 'number_analogy') return t.numberAnalogyQuestion || 'השלם: A : B כמו C : ?';
    if (puz.type === 'spatial_iq') return t.spatialIQQuestion || 'מה הגיוני שיבוא בהמשך?';
    if (puz.type === 'visual_iq') return t.visualIQQuestion || 'איזה מהבאים שונה מהשאר?';
    if (puz.type === 'number_series_iq') return t.numberSeriesIQQuestion || 'מהו המספר הבא בסדרה?';
    return puz.question;
  }, [t]);

  const newPuzzle = useCallback((level) => {
    setPuzzle(generatePuzzle(level));
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
    saveSession('logic', {
      level: difficulty.level,
      streak: isCorrect ? difficulty.streak + 1 : 0,
      totalCorrect: difficulty.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });

    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? t.greatThinking : `${t.theAnswerWas} ${puzzle.answer}`,
    });

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleNext = () => newPuzzle(difficulty.level);
  const handleReset = () => { difficulty.reset(); setPuzzle(null); };

  const ArrowIcon = t.dir === 'rtl' ? ArrowLeft : ArrowRight;

  if (!puzzle) {
    return (
      <GameStartScreen
        title={t.logicTitle}
        description={t.logicDescLong}
        icon={Puzzle}
        gradient="from-purple-400 to-violet-500"
        onStart={handleStart}
        startLabel={t.startPlaying}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={t.logicTitle}
        description={t.logicSubDesc}
        hint={t.dir === 'rtl' ? 'הסתכל על הסדרה או הדפוס ובחר מה בא אחר כך — או מה לא שייך.' : 'Look at the sequence or pattern and pick what comes next — or what doesn\'t belong.'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-card to-muted/30">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground">{getLocalizedQuestion(puzzle)}</h3>

        {/* Sequence display */}
        {puzzle.type === 'number_analogy' ? (
          // A : B :: C : ?
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0 }}
              className="bg-muted rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-bold border-2 border-border">
              {puzzle.sequence[0]}
            </motion.div>
            <span className="text-2xl font-bold text-muted-foreground">:</span>
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
              className="bg-muted rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-bold border-2 border-border">
              {puzzle.sequence[1]}
            </motion.div>
            <span className="text-2xl font-bold text-muted-foreground mx-1">::</span>
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }}
              className="bg-muted rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-bold border-2 border-border">
              {puzzle.sequence[2]}
            </motion.div>
            <span className="text-2xl font-bold text-muted-foreground">:</span>
            <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl text-primary font-bold">?</div>
          </div>
        ) : puzzle.type === 'matrix' ? (
          // 2×2 grid with last cell as ?
          <div className="grid grid-cols-2 gap-2 w-fit">
            {[0,1,2].map(i => (
              <motion.div key={i} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i * 0.1 }}
                className="bg-muted rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-3xl md:text-4xl border-2 border-border">
                {puzzle.sequence[i]}
              </motion.div>
            ))}
            <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl text-primary font-bold">?</div>
          </div>
        ) : puzzle.type === 'visual_iq' ? (
          // Visual odd-one-out: show all items in a row
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {puzzle.sequence.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl border-2 border-border"
              >
                {item}
              </motion.div>
            ))}
          </div>
        ) : (
          // Default: horizontal sequence with ? at end
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
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md">
          {puzzle.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrectAnswer = option === puzzle.answer;
            const showResult = selected !== null;

            let borderClass = 'border-border hover:border-primary/50 hover:bg-primary/5';
            if (showResult && isCorrectAnswer) borderClass = 'border-green-400 bg-green-50';
            else if (showResult && isSelected && !isCorrectAnswer) borderClass = 'border-red-400 bg-red-50';

            const isLong = option.length > 4;

            return (
              <motion.button
                key={i}
                whileTap={{ scale: selected === null ? 0.94 : 1 }}
                whileHover={{ scale: selected === null ? 1.03 : 1 }}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`rounded-2xl py-3 px-3 border-2 transition-all min-h-[56px] flex items-center justify-center shadow-sm hover:shadow-md
                  ${isLong ? 'text-base md:text-lg leading-snug' : 'text-2xl md:text-3xl font-bold'}
                  ${borderClass} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
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
            {t.nextPuzzle}
            <ArrowIcon className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}