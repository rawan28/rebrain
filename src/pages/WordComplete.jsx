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

    let cellClass = 'border-4 rounded-2xl flex items-center justify-center font-bold text-3xl md:text-4xl w-16 h-16 md:w-20 md:h-20 select-none transition-all shadow-sm';
    if (!isHidden) {
      cellClass += ' bg-secondary border-border text-foreground';
    } else if (!value) {
      cellClass += ' bg-background border-dashed border-primary/50';
    } else if (isCorrectCell) {
      cellClass += ' bg-green-100 border-green-500 text-green-800';
    } else if (isWrongCell) {
      cellClass += ' bg-red-100 border-red-500 text-red-800';
    } else {
      cellClass += ' bg-primary/10 border-primary text-primary';
    }

    return (
      <div key={i} className={cellClass}>
        {isHidden && submitted && !isCorrectCell ? question.letters[i] : (value || '')}
      </div>
    );
  });

  return (
    <div className="space-y-5">
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

      <div className="flex flex-col items-center gap-6">
        {/* Hint */}
        <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl px-6 py-4 text-center">
          <p className="text-foreground text-xl md:text-2xl font-semibold leading-relaxed">
            💡 {question.hint}
          </p>
        </div>

        {/* Word display */}
        <div className="flex gap-3 flex-wrap justify-center" dir={t.dir === 'rtl' ? 'rtl' : 'ltr'}>
          {cells}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`text-2xl font-bold px-8 py-4 rounded-2xl border-2 ${
                isCorrect
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : 'bg-red-100 border-red-400 text-red-800'
              }`}
            >
              {isCorrect ? t.correct : t.incorrect}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter buttons */}
        {!submitted && (
          <div className="flex flex-wrap gap-3 justify-center max-w-sm">
            {question.options.map((letter, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleLetterPick(letter)}
                className="w-16 h-16 md:w-18 md:h-18 rounded-2xl border-4 border-border bg-card hover:bg-primary/10 hover:border-primary font-bold text-2xl md:text-3xl transition-all shadow-sm active:scale-95"
              >
                {letter}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleDelete}
              className="w-16 h-16 rounded-2xl border-4 border-border bg-card hover:bg-red-50 hover:border-red-400 flex items-center justify-center transition-all shadow-sm"
            >
              <Delete className="w-7 h-7 text-muted-foreground" />
            </motion.button>
          </div>
        )}

        {/* Submit */}
        {!submitted && (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!allFilled}
            className="text-xl px-10 py-7 rounded-2xl min-h-[64px] font-bold shadow-md"
          >
            {t.wordCheck}
          </Button>
        )}

        {/* Next button */}
        {showNext && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button size="lg" onClick={handleNext} className="text-xl px-10 py-7 rounded-2xl min-h-[64px] font-bold shadow-md">
              {t.nextQuestion}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}