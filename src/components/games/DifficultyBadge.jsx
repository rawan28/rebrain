import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

export default function DifficultyBadge({ level, maxLevel = 10 }) {
  const { t } = useLang();
  const percentage = (level / maxLevel) * 100;

  let colorClass = 'bg-green-100 text-green-700 border-green-200';
  if (percentage > 66) colorClass = 'bg-red-100 text-red-700 border-red-200';
  else if (percentage > 33) colorClass = 'bg-amber-100 text-amber-700 border-amber-200';

  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-muted-foreground" />
      <Badge variant="outline" className={`text-base px-3 py-1 font-semibold border ${colorClass}`}>
        {t.level} {level}
      </Badge>
    </div>
  );
}