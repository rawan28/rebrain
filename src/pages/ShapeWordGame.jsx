import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Shapes } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import useDifficulty from '@/lib/useDifficulty';
import { buildShapeWordDeck } from '@/lib/shapePairsData';
import GameStartScreen from '@/components/games/GameStartScreen';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';

const labels = {
  he: {
    title: 'צורה ומילה',
    descLong: 'התאם כל צורה למילה שלה! לחץ על קלף ואז על המילה המתאימה.',
    subDesc: 'התאם צורה למילה',
    moves: 'מהלכים',
    pairsFound: 'זוגות שנמצאו',
  },
  ar: {
    title: 'الشكل والكلمة',
    descLong: 'طابق كل شكل مع كلمته! انقر على بطاقة ثم على الكلمة المناسبة.',
    subDesc: 'طابق الشكل مع الكلمة',
    moves: 'الحركات',
    pairsFound: 'أزواج تم إيجادها',
  },
};

function getPairsCount(level) {
  return Math.min(3 + Math.floor((level - 1) / 2), 8);
}

export default function ShapeWordGame() {
  const { t, lang } = useLang();
  const l = labels[lang] || labels.he;
  const difficulty = useDifficulty(1, 15, 'shape_word');

  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null); // card id
  const [matched, setMatched] = useState([]); // pairIds
  const [wrong, setWrong] = useState([]); // card ids flashing red
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });

  const startNewRound = useCallback(() => {
    const pairs = getPairsCount(difficulty.level);
    setCards(buildShapeWordDeck(lang, pairs));
    setSelected(null);
    setMatched([]);
    setWrong([]);
    setMoves(0);
    setGameStarted(true);
  }, [difficulty.level, lang]);

  const handleCardClick = (card) => {
    if (matched.includes(card.pairId)) return;
    if (wrong.length > 0) return; // during wrong flash
    if (selected?.id === card.id) { setSelected(null); return; }

    if (!selected) {
      setSelected(card);
      return;
    }

    // Second card selected
    setMoves(prev => prev + 1);

    if (selected.pairId === card.pairId && selected.type !== card.type) {
      // Match!
      const newMatched = [...matched, card.pairId];
      setMatched(newMatched);
      setSelected(null);
      awardCoin(true);

      const totalPairs = cards.length / 2;
      if (newMatched.length === totalPairs) {
        const perfectMoves = totalPairs;
        const isGood = moves + 1 <= perfectMoves + 2;
        difficulty.recordAnswer(isGood);
        saveSession('memory', {
          level: difficulty.level,
          streak: difficulty.streak,
          totalCorrect: difficulty.totalCorrect + (isGood ? 1 : 0),
          totalAttempts: difficulty.totalAttempts + 1,
        });
        setFeedback({
          show: true,
          isCorrect: isGood,
          message: isGood
            ? `${t.excellent} ${t.completedIn} ${moves + 1} ${t.movesWord}.`
            : `${moves + 1} ${t.movesWord}. ${t.tryFewer}`,
        });
        setTimeout(() => {
          setFeedback({ show: false, isCorrect: false, message: '' });
          startNewRound();
        }, 2000);
      }
    } else {
      // Wrong
      awardCoin(false);
      setWrong([selected.id, card.id]);
      setTimeout(() => {
        setWrong([]);
        setSelected(null);
      }, 700);
    }
  };

  const handleReset = () => { difficulty.reset(); setGameStarted(false); };

  if (!gameStarted) {
    return (
      <GameStartScreen
        title={l.title}
        description={l.descLong}
        icon={Shapes}
        gradient="from-indigo-400 to-blue-500"
        onStart={() => { difficulty.reset(); startNewRound(); }}
        startLabel={t.startPlaying}
        resumeLevel={difficulty.level}
        onResume={startNewRound}
      />
    );
  }

  const cols = cards.length <= 8 ? 4 : 4;
  const totalPairs = cards.length / 2;

  return (
    <div className="space-y-4">
      <GameHeader
        title={l.title}
        description={l.subDesc}
        hint={lang === 'he' ? 'לחץ על צורה ואז על המילה המתאימה לה — מצא את כל הזוגות!' : 'انقر على شكل ثم على كلمته المناسبة — ابحث عن كل الأزواج!'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <p className="text-lg text-muted-foreground">
        {l.moves}: <span className="font-semibold text-foreground">{moves}</span> ·{' '}
        {l.pairsFound}: <span className="font-semibold text-foreground">{matched.length}</span>/{totalPairs}
      </p>

      <div
        className="grid gap-3 md:gap-4 max-w-lg mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => {
          const isMatched = matched.includes(card.pairId);
          const isSelected = selected?.id === card.id;
          const isWrong = wrong.includes(card.id);

          let cardClass = `aspect-square rounded-xl flex items-center justify-center
            border-2 transition-all duration-200 cursor-pointer select-none font-semibold`;

          if (isMatched) {
            cardClass += ' bg-green-50 border-green-300 opacity-60 cursor-default';
          } else if (isWrong) {
            cardClass += ' bg-red-50 border-red-400 scale-95';
          } else if (isSelected) {
            cardClass += ' bg-primary/15 border-primary shadow-md scale-105';
          } else {
            cardClass += ' bg-white border-border hover:bg-primary/5 hover:border-primary/50 hover:scale-105';
          }

          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              className={cardClass}
            >
              {card.type === 'emoji' ? (
                <span className="text-5xl md:text-6xl">{card.content}</span>
              ) : (
                <span className="text-base md:text-lg text-center px-1 leading-tight font-bold">{card.content}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}