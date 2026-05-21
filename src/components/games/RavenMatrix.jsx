import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Renders a single SVG cell
function Cell({ svg, className, onClick, showResult, isCorrect, isSelected, isAnswer, disabled }) {
  let ring = '';
  if (showResult && isAnswer) ring = 'ring-4 ring-green-400 bg-green-50';
  else if (showResult && isSelected && !isAnswer) ring = 'ring-4 ring-red-400 bg-red-50';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full aspect-square rounded-xl border-2 border-border flex items-center justify-center p-1 transition-all',
        ring,
        !disabled && !showResult && 'hover:border-primary/50 hover:bg-primary/5 cursor-pointer',
        disabled && !showResult && 'cursor-default',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/**
 * RavenMatrix — displays the 3×3 grid puzzle and 4 answer options.
 * Props: puzzle, selected, onSelect
 */
export default function RavenMatrix({ puzzle, selected, onSelect }) {
  const showResult = selected !== null;

  return (
    <div className="space-y-5">
      {/* 3×3 Grid */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs md:max-w-sm mx-auto">
        {puzzle.grid.map((svg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="aspect-square rounded-xl border-2 border-border bg-muted flex items-center justify-center p-1"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ))}
        {/* 9th cell — the question mark */}
        <div className="aspect-square rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center text-2xl font-bold text-primary">
          ?
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* 4 options */}
      <div className="grid grid-cols-2 gap-3 max-w-xs md:max-w-sm mx-auto">
        {puzzle.options.map((svg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
          >
            <Cell
              svg={svg}
              onClick={() => !showResult && onSelect(i)}
              disabled={showResult}
              showResult={showResult}
              isSelected={selected === i}
              isAnswer={i === puzzle.answerIndex}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}