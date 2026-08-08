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
import useTimeouts from '@/hooks/useTimeouts';

const ALL_IMAGES = [
  { id: 'telescope',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/2e6f554ee_generated_image.png' },
  { id: 'bust',       img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/5191817f9_generated_image.png' },
  { id: 'stones',     img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/a388b7d6e_generated_image.png' },
  { id: 'easel',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/8853f3aac_generated_image.png' },
  { id: 'compass',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/9644fdf7f_generated_image.png' },
  { id: 'books',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/684948d7b_generated_image.png' },
  { id: 'watch',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/d84d9b2ba_generated_image.png' },
  { id: 'hourglass',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/dc3f0be9a_generated_image.png' },
  { id: 'staircase',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/55c9c75d0_generated_image.png' },
  { id: 'globe',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/228f0d294_generated_image.png' },
  { id: 'lantern',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/80a4de7b0_generated_image.png' },
  { id: 'key',        img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/ddd90a237_generated_image.png' },
  { id: 'mapbottle',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/a4891f222_generated_image.png' },
  { id: 'astrolabe',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/aa1e0b4b9_generated_image.png' },
  { id: 'typewriter', img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/10907808d_generated_image.png' },
  { id: 'gramophone', img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/b625cc795_generated_image.png' },
];

function getGridForLevel(level) {
  // levels 1-15 → 10 to 16 pairs (20–32 cards), stepping up every 2 levels
  return Math.min(10 + Math.floor((level - 1) / 2), 16);
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

  // ref to keep latest moves value available to effects without listing moves in deps
  const movesRef = useRef(0);
  const { setTimeoutAndTrack, clearAll } = useTimeouts();

  const startNewRound = useCallback(() => {
    clearAll();
    const pairs = getGridForLevel(difficulty.level);
    const images = shuffleArray(ALL_IMAGES).slice(0, pairs);
    const deck = shuffleArray([...images, ...images]).map((image, i) => ({
      id: i,
      imageId: image.id,
      img: image.img,
    }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    movesRef.current = 0;
    setGameStarted(true);
  }, [difficulty.level, clearAll]);

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [first, second] = flipped;

    // Defensive guards
    if (!cards[first] || !cards[second]) {
      setFlipped([]);
      return;
    }

    // update moves both in state (for UI) and ref (for effects)
    setMoves(prev => {
      const next = prev + 1;
      movesRef.current = next;
      return next;
    });

    if (cards[first].imageId === cards[second].imageId) {
      const newMatched = [...matched, cards[first].imageId];
      setMatched(newMatched);
      setFlipped([]);

      if (newMatched.length === cards.length / 2) {
        const perfectMoves = cards.length / 2;
        const isGood = movesRef.current <= perfectMoves + 3; // use ref for latest moves
        awardCoin(isGood);
        difficulty.recordAnswerMomentum(isGood);
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
            ? `${t.excellent} ${t.completedIn} ${movesRef.current} ${t.movesWord}.`
            : `${movesRef.current} ${t.movesWord}. ${t.tryFewer}`,
        });

        setTimeoutAndTrack(() => {
          setFeedback({ show: false, isCorrect: false, message: '' });
          startNewRound();
        }, 2000);
      }
    } else {
      setTimeoutAndTrack(() => setFlipped([]), 800);
    }
  }, [flipped, cards, matched, startNewRound, difficulty, t, setTimeoutAndTrack]);

  const handleCardClick = (index) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(cards[index]?.imageId)) return;
    setFlipped(prev => [...prev, index]);
  };

  const handleReset = () => {
    clearAll();
    setFlipped([]);
    setFeedback({ show: false, isCorrect: false, message: '' });
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

  const cols = cards.length <= 16 ? 4 : cards.length <= 24 ? 5 : 6;

  return (
    <div className="space-y-4">
      <GameHeader
        title={t.memoryTitle}
        description={t.memorySubDesc}
        hint={t.dir === 'rtl' ? 'לחץ על שני קלפים — אם הם תואמים הם יישארו פתוחים. מצא את כל הזוגות!' : 'Tap two cards — if they match they s[...]'}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-lg text-muted-foreground">
          {t.moves}: <span className="font-semibold text-foreground">{moves}</span> ·{' '}
          {t.pairsFound}: <span className="font-semibold text-foreground">{matched.length}</span>/{cards.length / 2}
        </p>
        <span className="text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
          {t.dir === 'rtl' ? `${cards.length / 2} זוגות` : `${cards.length / 2} pairs`}
        </span>
      </div>

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
                bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-600/50 shadow-md"
                style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-3xl md:text-4xl text-amber-200/40 font-bold">?</span>
              </div>
              {/* Card front */}
              <div className={`absolute inset-0 rounded-2xl overflow-hidden border-2 shadow-lg
                ${isMatched
                  ? 'border-emerald-400 ring-2 ring-emerald-300'
                  : 'border-[#D2C4A7]'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: '#F5F0E6' }}>
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: isMatched ? 0.75 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  src={card.img}
                  alt=""
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <FeedbackOverlay {...feedback} />
    </div>
  );
}