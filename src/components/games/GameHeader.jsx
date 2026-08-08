import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Target, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import DifficultyBadge from './DifficultyBadge';
import { useLang } from '@/lib/LanguageContext';

export default function GameHeader({ title, description, hint, level, streak, totalCorrect, totalAttempts, onReset, levelBadge }) {
  const { t } = useLang();
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const [hintOpen, setHintOpen] = useState(false);

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-base md:text-lg text-muted-foreground mt-1">{description}</p>
      </div>

      {hint && (
        <div>
          <button
            onClick={() => setHintOpen(v => !v)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            {t.dir === 'rtl' ? 'איך משחקים?' : 'How to play?'}
          </button>
          {hintOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 leading-relaxed"
            >
              💡 {hint}
            </motion.div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <DifficultyBadge level={level} />
        {levelBadge && (
          <span
            className="text-xl animate-bounce"
            aria-label={levelBadge === '📈' ? 'Level increased' : 'Level decreased'}
          >
            {levelBadge}
          </span>
        )}

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex items-center gap-1.5 text-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 px-3 py-2 rounded-xl shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold">{streak} {t.streak}!</span>
          </motion.div>
        )}

        <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 border border-border px-3 py-2 rounded-xl shadow-sm">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{totalCorrect}/{totalAttempts}</span>
          <span className="text-xs text-muted-foreground">· {accuracy}%</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="ms-auto gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          {t.startOver}
        </Button>
      </div>
    </div>
  );
}