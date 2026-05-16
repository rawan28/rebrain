import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';

const ALL_IMAGES = [
  { id: 'flower', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/397d9f288_generated_image.png' },
  { id: 'sunflower', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/28f594e20_generated_image.png' },
  { id: 'apple', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/4a1abc3fe_generated_image.png' },
  { id: 'dog', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/27e2f78a6_generated_image.png' },
  { id: 'cat', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/18c9e2e22_generated_image.png' },
  { id: 'butterfly', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/a3b04e5e1_generated_image.png' },
  { id: 'rainbow', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/7a2425f9b_generated_image.png' },
  { id: 'star', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/971c8dab4_generated_image.png' },
  { id: 'music', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/71bd56d43_generated_image.png' },
  { id: 'house', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/fa760a1a6_generated_image.png' },
  { id: 'car', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/c73c7fe89_generated_image.png' },
  { id: 'art', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/ff2e5af9a_generated_image.png' },
  { id: 'moon', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/65f94bf1e_generated_image.png' },
  { id: 'pizza', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/a602d1ba0_generated_image.png' },
  { id: 'sun', url: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/ee9cbf49a_generated_image.png' },
];

function getGridForLevel(level) {
  const pairs = Math.min(3 + Math.floor((level - 1) / 2), 8);
  return pairs;
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
  const difficulty = useDifficulty(1, 10);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [moves, setMoves] = useState(0);

  const startNewRound = useCallback(() => {
    const pairs = getGridForLevel(difficulty.level);
    const images = shuffleArray(ALL_IMAGES).slice(0, pairs);
    const deck = shuffleArray([...images, ...images]).map((image, i) => ({
      id: i,
      imageId: image.id,
      url: image.url,
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
          setTimeout(() => {
            setFeedback({ show: false, isCorrect: false, message: '' });
            startNewRound();
          }, 2000);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.memoryTitle}</h2>
          <p className="text-lg text-muted-foreground mt-2">{t.memoryDescLong}</p>
        </div>
        <Button size="lg" onClick={startNewRound} className="text-lg px-8 py-6 gap-3">
          <Play className="w-6 h-6" />
          {t.startPlaying}
        </Button>
      </div>
    );
  }

  const cols = cards.length <= 6 ? 3 : 4;

  return (
    <div className="space-y-4">
      <GameHeader
        title={t.memoryTitle}
        description={t.memorySubDesc}
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
        className="grid gap-3 md:gap-4 max-w-lg mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(card.imageId);
          const showFace = isFlipped || isMatched;

          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(index)}
              disabled={isMatched}
              className={`aspect-square rounded-xl flex items-center justify-center
                border-2 transition-all duration-300 cursor-pointer select-none overflow-hidden
                ${isMatched
                  ? 'bg-green-50 border-green-300 opacity-70'
                  : showFace
                    ? 'bg-white border-primary shadow-lg'
                    : 'bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50'
                }`}
            >
              {showFace ? (
                <motion.img
                  src={card.url}
                  alt="card"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-primary/40">?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}