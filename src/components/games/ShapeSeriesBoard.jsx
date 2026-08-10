import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ShapeSeriesItem from './ShapeSeriesItem';

const LABELS = {
  he: { whatNext: 'מה הצורה הבאה בסדרה?', pickAnswer: 'בחר את התשובה:', flow: 'קרא את הרצף מימין לשמאל' },
  ar: { whatNext: 'ما الشكل التالي في المتتالية؟', pickAnswer: 'اختر الإجابة:', flow: 'اقرأ المتتالية من اليمين إلى اليسار' },
};

export default function ShapeSeriesBoard({ puzzle, selected, onSelect, lang }) {
  const L = LABELS[lang] || LABELS.he;

  return (
    <div className="space-y-6">
      {/* Sequence display */}
      <div className="text-center">
        <p className="text-lg font-semibold text-muted-foreground mb-4">{L.whatNext}</p>
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          {puzzle.shown.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center"
            >
              <ShapeSeriesItem item={item} size={56} />
            </motion.div>
          ))}
          {/* Flow arrow — points in reading direction (RTL → left) */}
          <motion.div
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (puzzle.shown.length + 1) * 0.12 }}
            className="flex items-center justify-center"
            aria-hidden="true"
          >
            <ArrowLeft className="w-7 h-7 text-primary animate-pulse" strokeWidth={3} />
          </motion.div>
        </div>
        <p className="mt-3 text-sm font-medium text-primary/80 flex items-center justify-center gap-1.5">
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          {L.flow}
        </p>
      </div>

      {/* Options */}
      <div className="text-center">
        <p className="text-base text-muted-foreground mb-3">{L.pickAnswer}</p>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {puzzle.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const showResult = selected !== null;
            const isCorrect = idx === puzzle.correctIndex;

            let cls = 'border-border hover:border-primary/60 bg-card';
            if (showResult && isCorrect) cls = 'border-green-400 bg-green-50 dark:bg-green-900/40';
            else if (showResult && isSelected && !isCorrect) cls = 'border-red-400 bg-red-50 dark:bg-red-900/40';
            else if (showResult) cls = 'border-border opacity-40';

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: selected === null ? 0.95 : 1 }}
                onClick={() => onSelect(idx)}
                disabled={selected !== null}
                className={`rounded-2xl p-4 border-2 transition-all flex items-center justify-center aspect-square cursor-pointer ${cls}`}
              >
                <ShapeSeriesItem item={opt} size={72} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}