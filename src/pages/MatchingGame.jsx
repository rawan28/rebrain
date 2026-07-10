import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Lightbulb, RotateCcw, Check } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { matchingLevels } from '@/lib/matchingData';
import ConnectionLines from '@/components/games/ConnectionLines';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function MatchingGame() {
  const { t, lang } = useLang();
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [connections, setConnections] = useState([]); // [{leftId, rightId}]
  const [wrongPair, setWrongPair] = useState(null); // {leftId, rightId}
  const [hintUsed, setHintUsed] = useState(false);

  const level = matchingLevels[levelIdx];
  const rightOrder = useMemo(() => shuffle(level.right), [levelIdx]);
  const leftOrder = useMemo(() => shuffle(level.left), [levelIdx]);

  const containerRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const wrongTimer = useRef(null);

  const connectedLeftIds = new Set(connections.map((c) => c.leftId));
  const connectedRightIds = new Set(connections.map((c) => c.rightId));
  const totalPairs = level.left.length;
  const isComplete = connections.length === totalPairs;

  useEffect(() => () => clearTimeout(wrongTimer.current), []);

  const handleSelectLeft = (id) => {
    if (connectedLeftIds.has(id)) return;
    setSelectedLeft(id);
  };

  const handleSelectRight = (rightId) => {
    if (!selectedLeft || connectedRightIds.has(rightId)) return;
    const correctRight = level.pairs[selectedLeft];
    if (correctRight === rightId) {
      setConnections((prev) => [...prev, { leftId: selectedLeft, rightId }]);
      setSelectedLeft(null);
    } else {
      setWrongPair({ leftId: selectedLeft, rightId });
      setSelectedLeft(null);
      clearTimeout(wrongTimer.current);
      wrongTimer.current = setTimeout(() => setWrongPair(null), 700);
    }
  };

  const handleUndo = () => {
    setConnections((prev) => prev.slice(0, -1));
    setSelectedLeft(null);
  };

  const handleHint = () => {
    const remaining = leftOrder.find(
      (l) => !connectedLeftIds.has(l.id)
    );
    if (!remaining) return;
    const matchRight = level.pairs[remaining.id];
    setConnections((prev) => [...prev, { leftId: remaining.id, rightId: matchRight }]);
    setSelectedLeft(null);
    setHintUsed(true);
  };

  const handleRestart = () => {
    setConnections([]);
    setSelectedLeft(null);
    setWrongPair(null);
    setHintUsed(false);
  };

  const handleNextLevel = () => {
    setLevelIdx((i) => (i + 1) % matchingLevels.length);
    handleRestart();
  };

  const nodeState = (id, side) => {
    const connectedSet = side === 'left' ? connectedLeftIds : connectedRightIds;
    if (connectedSet.has(id)) return 'connected';
    if (wrongPair && wrongPair[side === 'left' ? 'leftId' : 'rightId'] === id) return 'wrong';
    if (side === 'left' && selectedLeft === id) return 'selected';
    return 'idle';
  };

  const renderLabel = (item) => {
    if (item.swatch) {
      return <span className="w-8 h-8 md:w-10 md:h-10 rounded-full" style={{ backgroundColor: item.swatch }} />;
    }
    return <span className="text-lg md:text-xl font-bold">{item.label[lang] || item.label.he}</span>;
  };

  const baseNode =
    'relative z-10 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full text-white transition-all duration-150 select-none cursor-pointer active:scale-95 shrink-0';
  const stateClasses = {
    idle: 'bg-foreground text-background',
    selected: 'bg-primary text-primary-foreground ring-4 ring-primary/30 scale-105',
    connected: 'bg-emerald-500 text-white',
    wrong: 'bg-destructive text-destructive-foreground animate-shake',
  };

  const L = {
    title: lang === 'ar' ? 'توصيل الأزواج' : 'חיבור זוגות',
    desc: lang === 'ar' ? 'اختر عنصراً من كل عمود لتوصيل الزوج الصحيح' : 'בחרו פריט מכל טור כדי לחבר את הזוג הנכון',
    undo: lang === 'ar' ? 'تراجع' : 'בטל',
    hint: lang === 'ar' ? 'تلميح' : 'רמז',
    restart: lang === 'ar' ? 'إعادة' : 'התחל מחדש',
    complete: lang === 'ar' ? 'أحسنت! أكملت المستوى 🎉' : 'כל הכבוד! סיימתם את הרמה 🎉',
    next: lang === 'ar' ? 'المستوى التالي' : 'רמה הבאה',
    level: lang === 'ar' ? 'المستوى' : 'רמה',
    pairs: lang === 'ar' ? 'أزواج' : 'זוגות',
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6" dir={t.dir}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{L.title}</h1>
        <p className="text-muted-foreground mt-1">{L.desc}</p>
        <p className="text-sm font-medium text-primary mt-2">
          {L.level} {levelIdx + 1} — {level.title[lang] || level.title.he}
        </p>
      </div>

      {/* progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{connections.length} / {totalPairs} {L.pairs}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(connections.length / totalPairs) * 100}%` }}
          />
        </div>
      </div>

      {/* board */}
      <div ref={containerRef} className="relative bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
        <ConnectionLines
          containerRef={containerRef}
          nodeRefs={nodeRefs}
          connections={connections}
        />
        <div className="relative z-10 flex justify-between gap-4 md:gap-8">
          {/* left column */}
          <div className="flex flex-col gap-3 md:gap-4 items-center">
            {leftOrder.map((item) => {
              const st = nodeState(item.id, 'left');
              return (
                <button
                  key={item.id}
                  ref={(el) => { nodeRefs.current.set(item.id, el); }}
                  onClick={() => handleSelectLeft(item.id)}
                  disabled={st === 'connected'}
                  className={`${baseNode} ${stateClasses[st]}`}
                >
                  {renderLabel(item)}
                  {st === 'connected' && (
                    <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* right column */}
          <div className="flex flex-col gap-3 md:gap-4 items-center">
            {rightOrder.map((item) => {
              const st = nodeState(item.id, 'right');
              return (
                <button
                  key={item.id}
                  ref={(el) => { nodeRefs.current.set(item.id, el); }}
                  onClick={() => handleSelectRight(item.id)}
                  disabled={st === 'connected'}
                  className={`${baseNode} ${stateClasses[st]}`}
                >
                  {renderLabel(item)}
                  {st === 'connected' && (
                    <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={handleUndo}
          disabled={connections.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium disabled:opacity-40 min-h-[44px]"
        >
          <Undo2 className="w-4 h-4" />
          {L.undo}
        </button>
        <button
          onClick={handleHint}
          disabled={isComplete}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium disabled:opacity-40 min-h-[44px]"
        >
          <Lightbulb className="w-4 h-4" />
          {L.hint}
        </button>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          {L.restart}
        </button>
      </div>

      {/* completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-6"
          >
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-xl font-bold text-emerald-700 mb-4">{L.complete}</p>
            <button
              onClick={handleNextLevel}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold min-h-[44px]"
            >
              {L.next}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}