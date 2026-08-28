import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const ICONS = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };

function exitOffset(a, rows, cols) {
  switch (a.dir) {
    case 'right': return { x: `${(cols - a.c) * 100}%`, y: 0 };
    case 'left': return { x: `${-(a.c + 1) * 100}%`, y: 0 };
    case 'down': return { y: `${(rows - a.r) * 100}%`, x: 0 };
    case 'up': return { y: `${-(a.r + 1) * 100}%`, x: 0 };
    default: return {};
  }
}

export default function ArrowsBoard({ puzzle, arrows, onRelease, blockedId }) {
  const { rows, cols } = puzzle;

  return (
    <div
      className="relative w-full rounded-2xl bg-white border border-border shadow-sm mx-auto overflow-hidden"
      style={{ aspectRatio: `${cols} / ${rows}`, maxWidth: 460 }}
    >
      {/* grid cells */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <div
            key={`cell-${r}-${c}`}
            className="absolute border border-border/40"
            style={{
              left: `${(c / cols) * 100}%`,
              top: `${(r / rows) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
            }}
          />
        ))
      )}

      {/* arrows */}
      <AnimatePresence>
        {arrows.map(a => {
          const Icon = ICONS[a.dir];
          const off = exitOffset(a, rows, cols);
          const isBlocked = blockedId === a.id;
          return (
            <motion.button
              key={a.id}
              type="button"
              onClick={() => onRelease(a)}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={
                isBlocked
                  ? { x: [0, -6, 6, -4, 4, 0], scale: 1, opacity: 1 }
                  : { scale: 1, opacity: 1, x: 0, y: 0 }
              }
              exit={{ ...off, opacity: 0.3, transition: { duration: 0.35, ease: 'easeIn' } }}
              transition={{ duration: 0.3 }}
              className="absolute flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              style={{
                left: `${(a.c / cols) * 100}%`,
                top: `${(a.r / rows) * 100}%`,
                width: `${100 / cols}%`,
                height: `${100 / rows}%`,
                padding: '6%',
              }}
              aria-label={`arrow ${a.dir}`}
            >
              <Icon className="w-full h-full" strokeWidth={2.5} />
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}