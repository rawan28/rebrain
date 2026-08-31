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
import { getFlipPreviewMs, getMovePar } from '@/lib/adaptiveDifficulty';

// Leniency: completing within par + this many moves still counts as success
const MOVE_TOLERANCE = 3;

const ALL_IMAGES = [
  { id: 'eiffel',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/d2af6e22c_generated_image.png' },
  { id: 'liberty',     img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/64f7ed4a0_generated_image.png' },
  { id: 'bigben',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/768838e00_generated_image.png' },
  { id: 'tajmahal',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/e2780d8f7_generated_image.png' },
  { id: 'colosseum',   img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/90e931c00_generated_image.png' },
  { id: 'pyramids',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/75c325358_generated_image.png' },
  { id: 'operahouse',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/a553d5345_generated_image.png' },
  { id: 'greatwall',   img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/b3ebf795d_generated_image.png' },
  { id: 'pisa',        img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/6fbde287b_generated_image.png' },
  { id: 'christ',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/cffeb3e6a_generated_image.png' },
  { id: 'towerbridge', img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/a828b18f5_generated_image.png' },
  { id: 'sagrada',     img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/e593de0c4_generated_image.png' },
  { id: 'goldengate',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/1e64608a8_generated_image.png' },
  { id: 'burjkhalifa', img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/5238655d8_generated_image.png' },
  { id: 'stbasil',     img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/b80dc634a_generated_image.png' },
  { id: 'fuji',        img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/9f2d3082e_generated_image.png' },
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
  const difficulty = useDifficulty(1, 15, 'memory', { dda: true });
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [moves, setMoves] = useState(0);

  // ref to keep latest moves value available to effects without listing moves in deps
  const movesRef = useRef(0);
  const { setTimeoutAndTrack, clearAll } = useTimeouts();

  // ── DDA: derive flip preview duration and move par from current level ──
  const pairCount = getGridForLevel(difficulty.level);
  const flipPreviewMs = getFlipPreviewMs(difficulty.level);
  const movePar = getMovePar(pairCount, difficulty.level);

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

      if (newMatched.length === pairCount) {
        // ── DDA: use dynamic move par from current level ──
        const isGood = movesRef.current <= movePar + MOVE_TOLERANCE;
        awardCoin(isGood);
        const direction = difficulty.recordAnswer(isGood);
        saveSession('memory', {
          level: difficulty.level,
          streak: difficulty.streak,
          totalCorrect: difficulty.totalCorrect + (isGood ? 1 : 0),
          totalAttempts: difficulty.totalAttempts + 1,
        });

        // ── DDA: direction-aware feedback message ──
        const dirNote = {
          up: t.dir === 'rtl' ? '🎉 הרמה עלתה!' : '🎉 Level up!',
          down: t.dir === 'rtl' ? 'נתאים את הרמה בשבילך' : 'We adjusted the level for you.',
          hold: '',
        };
        const baseMsg = isGood
          ? `${t.excellent} ${t.completedIn} ${movesRef.current} ${t.movesWord}.`
          : `${movesRef.current} ${t.movesWord}. ${t.tryFewer}`;
        const message = dirNote[direction] ? `${baseMsg} ${dirNote[direction]}` : baseMsg;

        setFeedback({
          show: true,
          isCorrect: isGood,
          message,
        });

        setTimeoutAndTrack(() => {
          setFeedback({ show: false, isCorrect: false, message: '' });
          startNewRound();
        }, 2000);
      }
    } else {
      setTimeoutAndTrack(() => setFlipped([]), flipPreviewMs);
    }
  }, [flipped, cards, matched, startNewRound, difficulty, t, setTimeoutAndTrack, pairCount, movePar, flipPreviewMs]);

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
        levelBadge={
          difficulty.lastDirection === 'up' ? '📈' :
          difficulty.lastDirection === 'down' ? '📉' : null
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-lg text-muted-foreground">
          {t.moves}: <span className="font-semibold text-foreground">{moves}</span> ·{' '}
          {t.pairsFound}: <span className="font-semibold text-foreground">{matched.length}</span>/{cards.length / 2}
        </p>
        <span className="text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
          {t.dir === 'rtl' ? `${pairCount} זוגות` : `${pairCount} pairs`}
        </span>
        <span
          className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 font-medium"
          aria-label={t.dir === 'rtl' ? `יעד: ${movePar + MOVE_TOLERANCE} מהלכים או פחות` : `Par: complete in ${movePar + MOVE_TOLERANCE} moves or fewer`}
        >
          {t.dir === 'rtl' ? `יעד: ${movePar + MOVE_TOLERANCE} מהלכים` : `Par: ${movePar + MOVE_TOLERANCE} moves`}
        </span>
      </div>

      <div
        className="grid gap-2 md:gap-4 max-w-lg mx-auto [perspective:1000px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))' }}
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
                bg-gradient-to-br from-sky-400 via-indigo-400 to-fuchsia-400 border-2 border-white/60 shadow-md"
                style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-3xl md:text-4xl text-white/80 font-bold leading-none drop-shadow">★</span>
              </div>
              {/* Card front */}
              <div className={`absolute inset-0 rounded-2xl overflow-hidden border-2 shadow-lg
                ${isMatched
                  ? 'border-amber-400 ring-2 ring-amber-300'
                  : 'border-white'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: '#ffffff' }}>
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