import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';

export default function DifficultyBadge({ level, maxLevel = 15 }) {
  const { t } = useLang();
  const percentage = Math.min((level / maxLevel) * 100, 100);

  let colorClass = 'text-emerald-700';
  let barClass = 'from-emerald-400 to-emerald-500';
  let bgClass = 'bg-emerald-50 border-emerald-200';
  let iconClass = 'text-emerald-500';

  if (percentage > 66) {
    colorClass = 'text-red-700';
    barClass = 'from-red-400 to-rose-500';
    bgClass = 'bg-red-50 border-red-200';
    iconClass = 'text-red-500';
  } else if (percentage > 33) {
    colorClass = 'text-amber-700';
    barClass = 'from-amber-400 to-orange-500';
    bgClass = 'bg-amber-50 border-amber-200';
    iconClass = 'text-amber-500';
  }

  return (
    <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border ${bgClass}`}>
      <TrendingUp className={`w-4 h-4 ${iconClass} shrink-0`} />
      <div className="flex flex-col gap-1 min-w-[90px]">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${colorClass}`}>{t.level} {level}</span>
          <span className="text-[10px] text-muted-foreground">{maxLevel}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
          />
        </div>
      </div>
    </div>
  );
}