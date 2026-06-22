import { useMemo, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { loadProgress } from '@/lib/progressStore';
import usePullToRefresh from '@/lib/usePullToRefresh';
import PullToRefreshIndicator from '@/components/PullToRefreshIndicator';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarRange, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Short weekday labels (last 7 days ordered oldest → newest)
const DAY_LABELS = {
  he: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  ar: ['أ', 'إ', 'ث', 'ر', 'خ', 'ج', 'س'],
};

const GAME_TITLES = {
  memory: 'memoryTitle',
  logic: 'logicTitle',
  numbers: 'numbersTitle',
  flags: 'flagTitle',
  word: 'wordTitle',
  trivia: 'triviaTitle',
  'shape-word': 'shapeWordTitle',
  'rush-hour': 'rushHourTitle',
  'fruit-algebra': 'fruitAlgebraTitle',
};

const GAME_COLORS = {
  memory: '#3b82f6',
  logic: '#8b5cf6',
  numbers: '#f59e0b',
  flags: '#f97316',
  word: '#ec4899',
  trivia: '#eab308',
  'shape-word': '#6366f1',
  'rush-hour': '#fb923c',
  'fruit-algebra': '#ef4444',
};

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function WeeklyReport() {
  const { t, lang } = useLang();
  const [refreshKey, setRefreshKey] = useState(0);
  const { pullY, refreshing, progress } = usePullToRefresh(() =>
    new Promise((r) => setTimeout(() => { setRefreshKey((k) => k + 1); r(); }, 800)),
  );
  const raw = useMemo(() => loadProgress(), [refreshKey]);

  // Build last 7 days (oldest → newest), keyed by YYYY-MM-DD
  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      return { key, label: DAY_LABELS[lang]?.[i] ?? String(i + 1) };
    });
  }, [lang]);

  // Filter sessions to last 7 days, compute max level per day per game
  const games = useMemo(() => {
    const weekKeys = new Set(days.map((d) => d.key));
    const result = [];
    Object.keys(raw).forEach((gameKey) => {
      const sessions = (raw[gameKey] || []).filter((s) => {
        if (!s.date) return false;
        return weekKeys.has(String(s.date).slice(0, 10));
      });
      if (!sessions.length) return;
      const data = days.map((d) => {
        const daySessions = sessions.filter((s) => String(s.date).slice(0, 10) === d.key);
        const maxLevel = daySessions.length
          ? Math.max(...daySessions.map((s) => s.level ?? 0))
          : null;
        return { day: d.label, level: maxLevel };
      });
      const levels = data.map((x) => x.level).filter((v) => v != null);
      const first = levels.length ? levels[0] : 0;
      const last = levels.length ? levels[levels.length - 1] : 0;
      result.push({
        gameKey,
        title: t[GAME_TITLES[gameKey]] || gameKey,
        color: GAME_COLORS[gameKey] || '#3b82f6',
        data,
        improvement: last - first,
        sessions: sessions.length,
      });
    });
    return result;
  }, [raw, days, t]);

  const hasData = games.length > 0;

  return (
    <div className="space-y-6">
      <PullToRefreshIndicator pullY={pullY} progress={progress} refreshing={refreshing} />

      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
          <CalendarRange className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.weeklyReportTitle}</h2>
          <p className="text-lg text-muted-foreground mt-1">{t.weeklyReportDesc}</p>
        </div>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <TrendingUp className="w-10 h-10 opacity-30" />
            <p className="text-base text-center">{t.weeklyNoData}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {games.map((g) => {
            const up = g.improvement > 0;
            const down = g.improvement < 0;
            return (
              <Card key={g.gameKey}>
                <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">{g.title}</CardTitle>
                  <span
                    className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
                      up
                        ? 'bg-green-50 text-green-600'
                        : down
                          ? 'bg-red-50 text-red-600'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {up ? '▲' : down ? '▼' : '—'} {Math.abs(g.improvement)} · {t.level}
                  </span>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={g.data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontSize: 13 }}
                        formatter={(v) => [v, t.level]}
                      />
                      <Line
                        type="monotone"
                        dataKey="level"
                        stroke={g.color}
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}