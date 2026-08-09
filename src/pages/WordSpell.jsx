import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/LanguageContext';
import useDifficulty from '@/lib/useDifficulty';
import GameHeader from '@/components/games/GameHeader';
import GameStartScreen from '@/components/games/GameStartScreen';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { getWordSpellPair } from '@/lib/wordSpellData';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordSpell() {
  const { t, lang } = useLang();
  const difficulty = useDifficulty(1, 10, 'word_spell');
  const [gameStarted, setGameStarted] = useState(false);
  const [pair, setPair] = useState(null);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [placedIndices, setPlacedIndices] = useState([]);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const startTimeRef = useRef(null);
  const utteranceRef = useRef(null);
  const roundRef = useRef(0);

  const today = new Date().toISOString().split('T')[0];

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'ar' ? 'ar-SA' : 'he-IL';
    u.rate = 0.85;
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [lang]);

  const startNewRound = useCallback(() => {
    const newPair = getWordSpellPair(today, difficulty.level, roundRef.current);
    setPair(newPair);
    setActiveWordIdx(0);
    setPlacedIndices([]);

    const wordTexts = newPair.words.map(w => w[lang]);
    const allLetters = wordTexts.flatMap(w => w.split(''));
    // Pad with 2-3 distractor letters at higher levels
    const distractorCount = Math.min(2, Math.floor((difficulty.level - 1) / 3));
    const distractorPool = lang === 'ar'
      ? 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('')
      : 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
    const distractors = [];
    for (let i = 0; i < distractorCount; i++) {
      distractors.push(distractorPool[Math.floor(Math.random() * distractorPool.length)]);
    }
    setScrambledLetters(shuffleArray([...allLetters, ...distractors]));

    // Speak the two words after a short delay
    const combined = wordTexts.join(' — ');
    setTimeout(() => speak(combined), 300);
  }, [today, difficulty.level, lang, speak]);

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  const handleStart = () => {
    difficulty.reset();
    setGameStarted(true);
    startTimeRef.current = Date.now();
    roundRef.current = 0;
    startNewRound();
  };

  const handleResume = () => {
    setGameStarted(true);
    startTimeRef.current = Date.now();
    startNewRound();
  };

  const handleReset = () => {
    difficulty.reset();
    setGameStarted(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const replayAudio = () => {
    if (!pair) return;
    const wordTexts = pair.words.map(w => w[lang]);
    speak(wordTexts.join(' — '));
  };

  const placeLetter = (scrambledIdx) => {
    if (placedIndices.includes(scrambledIdx)) return;
    const newPlaced = [...placedIndices, scrambledIdx];
    setPlacedIndices(newPlaced);

    // Check if current word is complete
    const currentWord = pair.words[activeWordIdx][lang];
    const placedLetters = newPlaced.map(i => scrambledLetters[i]);
    const wordLen = currentWord.length;
    // Count how many letters have been placed for the current word
    const prevWordsLen = pair.words.slice(0, activeWordIdx).reduce((s, w) => s + w[lang].length, 0);
    const currentWordLetters = placedLetters.slice(prevWordsLen);
    if (currentWordLetters.length === wordLen) {
      const built = currentWordLetters.join('');
      if (built === currentWord) {
        if (activeWordIdx < pair.words.length - 1) {
          setActiveWordIdx(prev => prev + 1);
        } else {
          handleComplete(true);
        }
      } else {
        handleComplete(false);
      }
    }
  };

  const removeLastLetter = () => {
    if (placedIndices.length === 0) return;
    setPlacedIndices(prev => prev.slice(0, -1));
  };

  const handleComplete = (isCorrect) => {
    awardCoin(isCorrect);
    difficulty.recordAnswer(isCorrect);
    saveSession('word_spell', {
      level: difficulty.level,
      streak: difficulty.streak,
      totalCorrect: difficulty.totalCorrect + (isCorrect ? 1 : 0),
      totalAttempts: difficulty.totalAttempts + 1,
    });
    const correctWords = pair.words.map(w => w[lang]).join(' — ');
    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect
        ? (lang === 'ar' ? `أحسنت! ${correctWords}` : `כל הכבוד! ${correctWords}`)
        : (lang === 'ar' ? `الكلمات: ${correctWords}` : `המילים: ${correctWords}`),
    });
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleNextRound = () => {
    setFeedback({ show: false, isCorrect: false, message: '' });
    setPlacedIndices([]);
    setActiveWordIdx(0);
    roundRef.current += 1;
    startNewRound();
  };

  if (!gameStarted) {
    return (
      <GameStartScreen
        title={t.wordSpellTitle}
        description={t.wordSpellDescLong}
        icon={Volume2}
        gradient="from-emerald-400 to-teal-500"
        onStart={handleStart}
        startLabel={t.startPlaying}
        resumeLevel={difficulty.level}
        onResume={handleResume}
      />
    );
  }

  if (!pair) return null;

  const wordTexts = pair.words.map(w => w[lang]);
  const prevWordsLen = pair.words.slice(0, activeWordIdx).reduce((s, w) => s + w[lang].length, 0);

  return (
    <div className="space-y-4">
      <GameHeader
        title={t.wordSpellTitle}
        description={t.wordSpellSubDesc}
        hint={t.wordSpellHint}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      {/* Audio replay button */}
      <div className="flex justify-center">
        <Button
          onClick={replayAudio}
          size="lg"
          className="gap-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg hover:shadow-xl transition-shadow border-0"
        >
          <Volume2 className="w-6 h-6" />
          {t.wordSpellReplay}
        </Button>
      </div>

      {/* Word slots */}
      <div className="flex flex-col items-center gap-6 py-4">
        {wordTexts.map((word, wIdx) => {
          const wordStart = pair.words.slice(0, wIdx).reduce((s, w) => s + w[lang].length, 0);
          const wordEnd = wordStart + word.length;
          const isActive = wIdx === activeWordIdx;
          const isDone = wIdx < activeWordIdx;
          const letters = Array.from(word);
          return (
            <div key={wIdx} className="flex flex-col items-center gap-2">
              <span className={`text-sm font-semibold ${isActive ? 'text-primary' : isDone ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {t.wordSpellWord} {wIdx + 1}
              </span>
              <div className="flex gap-2">
                {letters.map((letter, lIdx) => {
                  const globalIdx = wordStart + lIdx;
                  const placedLetter = placedIndices[globalIdx] != null ? scrambledLetters[placedIndices[globalIdx]] : null;
                  const isPlaced = placedLetter != null;
                  return (
                    <motion.div
                      key={lIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-sm transition-colors
                        ${isPlaced
                          ? (isDone
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-card border-primary text-foreground')
                          : isActive
                            ? 'bg-accent/30 border-accent text-muted-foreground'
                            : 'bg-muted/30 border-border text-transparent'}`}
                    >
                      {placedLetter || ''}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrambled letter pool */}
      <div className="bg-card border-2 border-border rounded-2xl p-4 md:p-6 shadow-sm">
        <p className="text-center text-sm text-muted-foreground mb-3">{t.wordSpellLetters}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {scrambledLetters.map((letter, idx) => {
            const isUsed = placedIndices.includes(idx);
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.9 }}
                onClick={() => placeLetter(idx)}
                disabled={isUsed}
                className={`w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-md transition-all select-none
                  ${isUsed
                    ? 'opacity-20 border-border bg-muted'
                    : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-900 hover:from-amber-100 hover:to-amber-200 hover:border-amber-400 hover:shadow-lg cursor-pointer'}`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Clear button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={removeLastLetter} disabled={placedIndices.length === 0} className="gap-2">
          <Trash2 className="w-4 h-4" />
          {t.wordSpellClear}
        </Button>
      </div>

      <FeedbackOverlay {...feedback} actionLabel={t.nextPuzzle} onAction={handleNextRound} />
    </div>
  );
}