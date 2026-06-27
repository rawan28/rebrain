import { Card, CardContent } from '@/components/ui/card';
import { PILLARS } from '@/lib/cognitivePillars';
import { useLang } from '@/lib/LanguageContext';

const PILLAR_KEYS = ['memory', 'logic', 'attention', 'pattern'];

export default function PillarSummaryCards({ summary }) {
  const { t } = useLang();
  const labels = {
    memory: t.pillarMemory,
    logic: t.pillarLogic,
    attention: t.pillarAttention,
    pattern: t.pillarPattern,
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {PILLAR_KEYS.map(key => {
        const pillar = PILLARS[key];
        const data = summary[key] || { avgAccuracy: 0, totalSessions: 0 };
        const acc = data.avgAccuracy;
        return (
          <Card key={key} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <span className="text-3xl">{pillar.emoji}</span>
              <p className="text-sm font-semibold text-center">{labels[key]}</p>
              {/* Circular progress ring */}
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none"
                    stroke={pillar.color} strokeWidth="3"
                    strokeDasharray={`${acc * 0.975} 97.5`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {data.totalSessions > 0 ? `${acc}%` : '—'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {data.totalSessions} {t.pillarSessions}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}