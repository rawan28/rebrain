import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PILLARS } from '@/lib/cognitivePillars';
import { useLang } from '@/lib/LanguageContext';
import { TrendingUp } from 'lucide-react';

const PILLAR_KEYS = ['memory', 'logic', 'attention', 'pattern'];

export default function PillarTimeline({ timeline }) {
  const { t } = useLang();
  const labels = {
    memory: t.pillarMemory,
    logic: t.pillarLogic,
    attention: t.pillarAttention,
    pattern: t.pillarPattern,
  };

  if (!timeline.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t.pillarAccuracyOverTime}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
            <TrendingUp className="w-10 h-10 opacity-30" />
            <p className="text-base">{t.noDataYet}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format dates for display
  const chartData = timeline.map(row => ({
    ...row,
    label: row.date.slice(5), // MM-DD
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t.pillarAccuracyOverTime}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
              formatter={(v) => v != null ? [`${v}%`] : ['—']}
            />
            {PILLAR_KEYS.map(key => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={labels[key]}
                stroke={PILLARS[key].color}
                strokeWidth={3}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-3">
          {PILLAR_KEYS.map(key => (
            <div key={key} className="flex items-center gap-1.5 text-sm">
              <span className="text-lg">{PILLARS[key].emoji}</span>
              <span className="font-medium">{labels[key]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}