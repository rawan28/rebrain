import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDifficulty from '@/lib/useDifficulty';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const ALL_EMOJIS = ['🌸', '🌻', '🍎', '🐶', '🐱', '🦋', '🌈', '⭐', '🎵', '🏠', '🚗', '🎨', '🌙', '🍕', '☀️'];

function getGridForLevel(level) {
  // Level 1-3: 4 cards (2 pairs), Level 4-6: 6 cards (3 pairs), etc.
  const pairs = Math.min(2 + Math.floor((level - 1) / 2), 8);
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
  const difficulty = useDifficulty(1, 10);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [moves, setMoves] = useState(0);

  const startNewRound = useCallback(() => {
    const pairs = getGridForLevel(difficulty.level);
    const emojis = shuffleArray(ALL_EMOJIS).slice(0, pairs);
    const deck = shuffleArray([...emojis, ...emojis]).map((emoji, i) => ({
      id: i,
      emoji,
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

      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        const newMatched = [...matched, cards[first].emoji];
        setMatched(newMatched);
        setFlipped([]);

        // Check if all matched
        if (newMatched.length === cards.length / 2) {
          const perfectMoves = cards.length / 2;
          const isGood = moves + 1 <= perfectMoves + 2;
          difficulty.recordAnswer(isGood);
          setFeedback({
            show: true,
            isCorrect: isGood,
            message: isGood 
              ? `Excellent! Completed in ${moves + 1} moves.` 
              : `Done in ${moves + 1} moves. Try fewer next time!`,
          });
          setTimeout(() => {
            setFeedback({ show: false, isCorrect: false, message: '' });
            startNewRound();
          }, 2000);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped]);

  const handleCardClick = (index) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(cards[index].emoji)) return;
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Memory Cards</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Flip two cards at a time and find all matching pairs. The fewer moves, the better!
          </p>
        </div>
        <Button size="lg" onClick={startNewRound} className="text-lg px-8 py-6 gap-3">
          <Play className="w-6 h-6" />
          Start Playing
        </Button>
      </div>
    );
  }

  const cols = cards.length <= 4 ? 2 : cards.length <= 6 ? 3 : 4;

  return (
    <div className="space-y-4">
      <GameHeader
        title="Memory Cards"
        description="Find all matching pairs"
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <p className="text-lg text-muted-foreground">
        Moves: <span className="font-semibold text-foreground">{moves}</span> · 
        Pairs found: <span className="font-semibold text-foreground">{matched.length}</span>/{cards.length / 2}
      </p>

      <div
        className="grid gap-3 md:gap-4 max-w-md mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(card.emoji);
          const showFace = isFlipped || isMatched;

          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(index)}
              disabled={isMatched}
              className={`aspect-square rounded-xl text-4xl md:text-5xl flex items-center justify-center
                border-2 transition-all duration-300 cursor-pointer select-none
                ${isMatched 
                  ? 'bg-green-50 border-green-300 opacity-70' 
                  : showFace 
                    ? 'bg-white border-primary shadow-lg' 
                    : 'bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50'
                }`}
            >
              {showFace ? (
                <motion.span
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <span className="text-3xl text-primary/40">?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}