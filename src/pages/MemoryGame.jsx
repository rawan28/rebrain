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

const ALL_IMAGES = [
  { id: 'conch',     img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/0fd8996cc_generated_image.png' },
  { id: 'lighthouse',img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/e0c9caced_generated_image.png' },
  { id: 'anchor',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/87dd0b224_generated_image.png' },
  { id: 'sailboat',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/2a32182d7_generated_image.png' },
  { id: 'starfish',  img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/49969a16d_generated_image.png' },
  { id: 'crab',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/d80e13222_generated_image.png' },
  { id: 'wave',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/277c6d711_generated_image.png' },
  { id: 'sanddollar',img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/4abb9555b_generated_image.png' },
  { id: 'coral',     img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/fc2ba04d4_generated_image.png' },
  { id: 'oyster',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/ce86dea79_generated_image.png' },
  { id: 'helm',      img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/656edbf05_generated_image.png' },
  { id: 'dunegrass', img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/b9a5c5220_generated_image.png' },
  { id: 'driftwood', img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/e89b24586_generated_image.png' },
  { id: 'bottle',    img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/6408e1c6d_generated_image.png' },
  { id: 'compass',   img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/e82f613f7_generated_image.png' },
  { id: 'seagull',   img: 'https://media.base44.com/images/public/6a073374b4c5bba3a2e2bb0e/dced602a4_generated_image.png' },
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
        const isGood = movesRef.current <= movePar;
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
          aria-label={t.dir === 'rtl' ? `יעד: ${movePar} מהלכים או פחות` : `Par: complete in ${movePar} moves or fewer`}
        >
          {t.dir === 'rtl' ? `יעד: ${movePar} מהלכים` : `Par: ${movePar} moves`}
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
                bg-gradient-to-br from-teal-700 to-cyan-900 border-2 border-teal-500/50 shadow-md"
                style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-3xl md:text-4xl text-cyan-200/40 font-bold leading-none">〜</span>
              </div>
              {/* Card front */}
              <div className={`absolute inset-0 rounded-2xl overflow-hidden border-2 shadow-lg
                ${isMatched
                  ? 'border-teal-400 ring-2 ring-teal-300'
                  : 'border-[#A8C9C2]'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: '#E8F1EF' }}>
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