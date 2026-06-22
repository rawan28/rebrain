import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import DifficultyBadge from './DifficultyBadge';
import { useLang } from '@/lib/LanguageContext';

export default function GameHeader({ title, description, level, streak, totalCorrect, totalAttempts, onReset }) {
  const { t } = useLang();
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-base md:text-lg text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <DifficultyBadge level={level} />

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