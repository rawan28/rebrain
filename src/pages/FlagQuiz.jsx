import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Flag } from 'lucide-react';
import useDifficulty from '@/lib/useDifficulty';
import { getRandomQuestion, getFlagUrl } from '@/lib/flagsData';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function FlagQuiz() {
  const { t, lang } = useLang();
  const difficulty = useDifficulty(1, 15);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);
  const [usedFlags, setUsedFlags] = useState([]);

  const newQuestion = useCallback(() => {
    const q = getRandomQuestion(lang, usedFlags);
    setQuestion(q);
    setSelected(null);
    setShowNext(false);
    setUsedFlags(prev => {
      const next = [...prev, q.flag];
      return next.length > 30 ? next.slice(-30) : next;
    });
  }, [lang, usedFlags]);

  const handleStart = () => newQuestion();

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === question.answer;
    awardCoin(isCorrect);
    difficulty.recordAnswer(isCorrect);
    saveSession('flags', {
      level: difficulty.level,
      streak: isCorrect ? difficulty.streak + 1 : 0,
      totalCorrect: difficulty.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });

    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? t.greatThinking : `${t.theAnswerWas} ${question.answer}`,
    });

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 1800);
  };

  const handleNext = () => newQuestion();
  const handleReset = () => { difficulty.reset(); setQuestion(null); setUsedFlags([]); };

  if (!question) {
    return (
      <GameStartScreen
        title={t.flagTitle}
        description={t.flagDescLong}
        icon={Flag}
        gradient="from-orange-400 to-amber-500"
        onStart={handleStart}
        startLabel={t.startPlaying}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={t.flagTitle}
        description={t.flagSubDesc}
        hint={t.dir === 'rtl' ? 'הסתכל על הדגל ובחר את שם המדינה הנכון מתוך 3 אפשרויות.' : 'Look at the flag and choose the correct country name from 3 options.'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-6 md:p-10 flex flex-col items-center gap-6 bg-gradient-to-br from-card to-muted/30">
        <p className="text-xl md:text-2xl font-semibold text-foreground">{t.whichCountry}</p>
        <motion.img
          key={question.flag}
          src={getFlagUrl(question.flag)}
          alt={question.answer}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-48 md:w-64 rounded-lg shadow-md border border-border"
        />

        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
          {question.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrectAnswer = option === question.answer;
            const showResult = selected !== null;

            let cls = 'border-border hover:border-primary/60 hover:bg-primary/5';
            if (showResult && isCorrectAnswer) cls = 'border-green-400 bg-green-50';
            else if (showResult && isSelected && !isCorrectAnswer) cls = 'border-red-400 bg-red-50';

            return (
              <motion.button
                key={i}
                whileTap={{ scale: selected === null ? 0.96 : 1 }}
                whileHover={{ scale: selected === null ? 1.02 : 1 }}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`rounded-2xl py-4 px-6 text-lg md:text-xl font-semibold border-2 transition-all text-center shadow-sm hover:shadow-md
                  ${cls} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {showNext && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button size="lg" onClick={handleNext} className="text-lg px-8 py-6">
            {t.nextQuestion}
          </Button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}