import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Delete, Settings2 } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import useDifficulty from '@/lib/useDifficulty';
import { generateQuestion } from '@/lib/wordData';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import GameHeader from '@/components/games/GameHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CustomWordsManager from '@/components/word/CustomWordsManager';

export default function WordComplete() {
  const { t, lang } = useLang();
  const difficulty = useDifficulty(1, 15, 'word');
  const [question, setQuestion] = useState(null);
  const [filled, setFilled] = useState({}); // index -> letter chosen
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [customWords, setCustomWords] = useState([]);
  const [showManager, setShowManager] = useState(false);

  const startNew = useCallback(() => {
    let q;
    if (customWords.length > 0 && Math.random() < 0.6) {
      const cw = customWords[Math.floor(Math.random() * customWords.length)];
      const letters = [...cw.word];
      const wordLen = letters.length;
      const hiddenCount = Math.max(1, Math.min(Math.floor(wordLen / 2), wordLen - 1));
      const indices = [];
      while (indices.length < hiddenCount) {
        const idx = Math.floor(Math.random() * wordLen);
        if (!indices.includes(idx)) indices.push(idx);
      }
      indices.sort((a, b) => a - b);
      const masked = letters.map((ch, i) => (indices.includes(i) ? '_' : ch));
      const correctLetters = indices.map(i => letters[i]);
      const allLetters = lang === 'he'
        ? 'אבגדהוזחטיכלמנסעפצקרשת'.split('')
        : 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
      const distractors = allLetters
        .filter(l => !correctLetters.includes(l))
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(4, 6 - hiddenCount));
      const options = [...new Set([...correctLetters, ...distractors])].sort(() => Math.random() - 0.5);
      q = { word: cw.word, hint: cw.hint || cw.word, letters, masked, hiddenIndices: indices, options };
    } else {
      q = generateQuestion(lang, difficulty.level);
    }
    setQuestion(q);
    setFilled({});
    setSubmitted(false);
    setIsCorrect(false);
    setShowNext(false);
  }, [lang, difficulty.level]);

  const handleStart = () => startNew();

  // Fill the next empty slot with the chosen letter
  const handleLetterPick = (letter) => {
    if (submitted) return;
    const nextEmpty = question.hiddenIndices.find(i => filled[i] === undefined);
    if (nextEmpty === undefined) return;
    setFilled(prev => ({ ...prev, [nextEmpty]: letter }));
  };

  // Remove the last filled slot
  const handleDelete = () => {
    if (submitted) return;
    const filled_ids = question.hiddenIndices.filter(i => filled[i] !== undefined);
    if (filled_ids.length === 0) return;
    const last = filled_ids[filled_ids.length - 1];
    setFilled(prev => { const n = { ...prev }; delete n[last]; return n; });
  };

  const allFilled = question && question.hiddenIndices.every(i => filled[i] !== undefined);

  const handleSubmit = () => {
    if (!allFilled) return;
    const correct = question.hiddenIndices.every(i => filled[i] === question.letters[i]);
    setIsCorrect(correct);
    setSubmitted(true);
    awardCoin(correct);
    difficulty.recordAnswer(correct);
    saveSession('word', {
      level: difficulty.level,
      streak: correct ? difficulty.streak + 1 : 0,
      totalCorrect: difficulty.totalCorrect + (correct ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });
    setTimeout(() => setShowNext(true), 800);
  };

  const handleNext = () => startNew();
  const handleReset = () => { difficulty.reset(); setQuestion(null); };

  const managerLabels = { he: 'מילים שלי', ar: 'كلماتي' };
  const managerLabel = managerLabels[lang] || 'מילים שלי';

  if (!question) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.wordTitle}</h2>
          <p className="text-lg text-muted-foreground mt-2">{t.wordDescLong}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {difficulty.level > 1 && (
            <Button size="lg" onClick={handleStart} className="text-lg px-8 py-6 gap-3">
              <Play className="w-6 h-6" />
              {t.dir === 'rtl' ? `המשך מרמה ${difficulty.level}` : `Continue from Level ${difficulty.level}`}
            </Button>
          )}
          <Button size="lg" onClick={() => { difficulty.reset(); handleStart(); }} variant={difficulty.level > 1 ? 'outline' : 'default'} className="text-lg px-8 py-6 gap-3">
            <Play className="w-6 h-6" />
            {t.startPlaying}
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowManager(v => !v)} className="text-lg px-6 py-6 gap-2">
            <Settings2 className="w-5 h-5" />
            {managerLabel}
            {customWords.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full text-sm w-6 h-6 flex items-center justify-center">
                {customWords.length}
              </span>
            )}
          </Button>
        </div>
        {showManager && (
          <CustomWordsManager
            customWords={customWords}
            onAdd={w => setCustomWords(prev => [...prev, w])}
            onRemove={i => setCustomWords(prev => prev.filter((_, idx) => idx !== i))}
            onClose={() => setShowManager(false)}
          />
        )}
      </div>
    );
  }

  // Build display cells
  const cells = question.masked.map((ch, i) => {
    const isHidden = question.hiddenIndices.includes(i);
    const value = isHidden ? (filled[i] || null) : ch;
    const isCorrectCell = submitted && isHidden && filled[i] === question.letters[i];
    const isWrongCell = submitted && isHidden && filled[i] !== question.letters[i];

    let cellClass = 'border-2 rounded-xl flex items-center justify-center font-bold text-2xl md:text-3xl w-12 h-12 md:w-14 md:h-14 select-none transition-all';
    if (!isHidden) {
      cellClass += ' bg-secondary border-border text-foreground';
    } else if (!value) {
      cellClass += ' bg-white border-dashed border-primary/40 text-transparent';
    } else if (isCorrectCell) {
      cellClass += ' bg-green-50 border-green-400 text-green-700';
    } else if (isWrongCell) {
      cellClass += ' bg-red-50 border-red-400 text-red-700';
    } else {
      cellClass += ' bg-primary/5 border-primary text-primary';
    }

    return (
      <div key={i} className={cellClass}>
        {isHidden && submitted && !isCorrectCell ? question.letters[i] : (value || '_')}
      </div>
    );
  });

  return (
    <div className="space-y-6">
      <GameHeader
        title={t.wordTitle}
        description={t.wordSubDesc}
        hint={t.dir === 'rtl' ? 'לחץ על האותיות כדי להשלים את המילה החסרה, ואז לחץ "בדוק".' : 'Tap letters to fill in the missing ones, then press Check.'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <Card className="p-6 md:p-8 flex flex-col items-center gap-6">
        {/* Hint */}
        <p className="text-muted-foreground text-base md:text-lg">
          💡 {question.hint}
        </p>

        {/* Word display */}
        <div className="flex gap-2 flex-wrap justify-center" dir="rtl">
          {cells}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xl font-bold px-6 py-2 rounded-full ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {isCorrect ? t.correct : t.incorrect}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter buttons */}
        {!submitted && (
          <div className="flex flex-wrap gap-2 justify-center max-w-xs md:max-w-sm">
            {question.options.map((letter, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterPick(letter)}
                className="w-11 h-11 md:w-13 md:h-13 rounded-xl border-2 border-border bg-white hover:bg-primary/10 hover:border-primary font-bold text-xl md:text-2xl transition-all"
              >
                {letter}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="w-11 h-11 rounded-xl border-2 border-border bg-white hover:bg-red-50 hover:border-red-300 flex items-center justify-center transition-all"
            >
              <Delete className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!allFilled}
            className="text-lg px-8"
          >
            {t.wordCheck}
          </Button>
        )}
      </Card>

      {/* Next button */}
      {showNext && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button size="lg" onClick={handleNext} className="text-lg px-8 py-6">
            {t.nextQuestion}
          </Button>
        </motion.div>
      )}
    </div>
  );
}