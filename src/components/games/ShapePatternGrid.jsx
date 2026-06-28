import React from 'react';
import { motion } from 'framer-motion';
import ShapeCombo from './ShapeCombo';

const LABELS = {
  he: { whatNext: 'מה הצורה הבאה?', pickAnswer: 'בחר את התשובה:' },
  ar: { whatNext: 'ما الشكل التالي؟', pickAnswer: 'اختر الإجابة:' },
};

export default function ShapePatternGrid({ puzzle, selected, onSelect, lang }) {
  const L = LABELS[lang] || LABELS.he;

  return (
    <div className="space-y-6">
      {/* Sequence display */}
      <div className="text-center">
        <p className="text-lg font-semibold text-muted-foreground mb-4">{L.whatNext}</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {puzzle.sequence.map((combo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center"
            >
              <ShapeCombo combo={combo} size={48} />
            </motion.div>
          ))}
          {/* Question mark slot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: puzzle.sequence.length * 0.1 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 border-2 border-dashed border-primary shadow-sm flex items-center justify-center"
          >
            <span className="text-3xl font-bold text-primary">?</span>
          </motion.div>
        </div>
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
                <ShapeCombo combo={opt} size={56} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}