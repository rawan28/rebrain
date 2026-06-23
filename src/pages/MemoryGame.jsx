import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Play, Grid3X3 } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

const ALL_IMAGES = [
  { id: 'key',        emoji: '🔑' },
  { id: 'sunglasses', emoji: '🕶️' },
  { id: 'bag',        emoji: '👜' },
  { id: 'money',      emoji: '💰' },
  { id: 'bed',        emoji: '🛏️' },
  { id: 'hat',        emoji: '🎩' },
  { id: 'food',       emoji: '🍽️' },
  { id: 'pan',        emoji: '🍳' },
  { id: 'board',      emoji: '📋' },
  { id: 'child',      emoji: '🧒' },
  { id: 'book',       emoji: '📚' },
  { id: 'newspaper',  emoji: '📰' },
  { id: 'headphones', emoji: '🎧' },
  { id: 'coffee',     emoji: '☕' },
  { id: 'candle',     emoji: '🕯️' },
  { id: 'tree',       emoji: '🌳' },
  { id: 'flower',     emoji: '🌸' },
  { id: 'chair',      emoji: '🪑' },
  { id: 'sea',        emoji: '🌊' },
  { id: 'pool',       emoji: '🏊' },
  { id: 'plane',      emoji: '✈️' },
  { id: 'table',      emoji: '🪞' },
  { id: 'car',        emoji: '🚗' },
  { id: 'letter',     emoji: '✉️' },
  { id: 'bird',       emoji: '🐦' },
  { id: 'dog',        emoji: '🐶' },
  { id: 'rocket',     emoji: '🚀' },
  { id: 'rainbow',    emoji: '🌈' },
  { id: 'guitar',     emoji: '🎸' },
  { id: 'crown',      emoji: '👑' },
  { id: 'diamond',    emoji: '💎' },
  { id: 'globe',      emoji: '🌍' },
  { id: 'volcano',    emoji: '🌋' },
  { id: 'lighthouse', emoji: '🏯' },
  { id: 'cactus',     emoji: '🌵' },
  { id: 'mushroom',   emoji: '🍄' },
  { id: 'anchor',     emoji: '⚓' },
  { id: 'compass',    emoji: '🧭' },
  { id: 'telescope',  emoji: '🔭' },
  { id: 'microscope', emoji: '🔬' },
  { id: 'hourglass',  emoji: '⏳' },
  { id: 'magnet',     emoji: '🧲' },
  { id: 'balloon',    emoji: '🎈' },
  { id: 'kite',       emoji: '🪁' },
  { id: 'chess',      emoji: '♟️' },
  { id: 'dice',       emoji: '🎲' },
  { id: 'butterfly',  emoji: '🦋' },
  { id: 'snail',      emoji: '🐌' },
  { id: 'octopus',    emoji: '🐙' },
  { id: 'crab',       emoji: '🦀' },
  { id: 'fox',        emoji: '🦊' },
  { id: 'penguin',    emoji: '🐧' },
  { id: 'whale',      emoji: '🐋' },
  { id: 'dragon',     emoji: '🐉' },
  { id: 'unicorn',    emoji: '🦄' },
  { id: 'robot',      emoji: '🤖' },
  { id: 'ghost',      emoji: '👻' },
  { id: 'alien',      emoji: '👾' },
  { id: 'wizard',     emoji: '🧙' },
  { id: 'mermaid',    emoji: '🧜' },
  { id: 'volcano2',   emoji: '🏔️' },
  { id: 'cave',       emoji: '🕌' },
  { id: 'waterfall',  emoji: '🏞️' },
  { id: 'igloo',      emoji: '🛖' },
];

function getGridForLevel(level) {
  // levels 1-15 → 3 to 12 pairs, stepping up every 2 levels
  return Math.min(3 + Math.floor((level - 1) / 2), 12);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame() {
  const { t } = useLang();
  const difficulty = useDifficulty(1, 15, 'memory');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [moves, setMoves] = useState(0);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearAllTimeouts(), [clearAllTimeouts]);

  const startNewRound = useCallback(() => {
    const pairs = getGridForLevel(difficulty.level);
    const images = shuffleArray(ALL_IMAGES).slice(0, pairs);
    const deck = shuffleArray([...images, ...images]).map((image, i) => ({
      id: i,
      imageId: image.id,
      emoji: image.emoji,
    }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  }, [difficulty.level]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      setMoves(prev => prev + 1);

      if (cards[first].imageId === cards[second].imageId) {
        const newMatched = [...matched, cards[first].imageId];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length / 2) {
          const perfectMoves = cards.length / 2;
          const isGood = moves + 1 <= perfectMoves + 2;
          awardCoin(isGood);
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
          timeoutsRef.current.push(setTimeout(() => {
            setFeedback({ show: false, isCorrect: false, message: '' });
            startNewRound();
          }, 2000));
        }
      } else {
        timeoutsRef.current.push(setTimeout(() => setFlipped([]), 800));
      }
    }
  }, [flipped]);

  const handleCardClick = (index) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(cards[index].imageId)) return;
    setFlipped(prev => [...prev, index]);
  };

  const handleReset = () => {
    difficulty.reset();
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <GameStartScreen
        title={t.memoryTitle}
        description={t.memoryDescLong}
        icon={Grid3X3}
        gradient="from-blue-400 to-indigo-500"
        onStart={() => { difficulty.reset(); startNewRound(); }}
        startLabel={t.startPlaying}
        resumeLevel={difficulty.level}
        onResume={startNewRound}
      />
    );
  }

  const cols = cards.length <= 6 ? 3 : cards.length <= 16 ? 4 : 6;

  return (
    <div className="space-y-4">
      <GameHeader
        title={t.memoryTitle}
        description={t.memorySubDesc}
        hint={t.dir === 'rtl' ? 'לחץ על שני קלפים — אם הם תואמים הם יישארו פתוחים. מצא את כל הזוגות!' : 'Tap two cards — if they match they stay open. Find all the pairs!'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <p className="text-lg text-muted-foreground">
        {t.moves}: <span className="font-semibold text-foreground">{moves}</span> ·{' '}
        {t.pairsFound}: <span className="font-semibold text-foreground">{matched.length}</span>/{cards.length / 2}
      </p>

      <div
        className="grid gap-3 md:gap-4 max-w-lg mx-auto [perspective:1000px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(card.imageId);
          const showFace = isFlipped || isMatched;

          return (
            <motion.button
              key={card.id}
              animate={{ rotateY: showFace ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleCardClick(index)}
              disabled={isMatched}
              className="aspect-square relative rounded-2xl cursor-pointer select-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card back */}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center
                bg-gradient-to-br from-primary to-indigo-600 border-2 border-primary/50 shadow-md"
                style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-3xl md:text-4xl text-white/30 font-bold">?</span>
              </div>
              {/* Card front */}
              <div className={`absolute inset-0 rounded-2xl flex items-center justify-center border-2 shadow-lg
                ${isMatched
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300'
                  : 'bg-white border-primary'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`text-4xl md:text-5xl select-none ${isMatched ? 'opacity-80' : ''}`}
                >
                  {card.emoji}
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}