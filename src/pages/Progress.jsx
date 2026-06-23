import { useMemo, useState, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { loadProgress, syncProgressFromBackend } from '@/lib/progressStore';
import usePullToRefresh from '@/lib/usePullToRefresh';
import PullToRefreshIndicator from '@/components/PullToRefreshIndicator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Brain, Puzzle, Calculator, Trophy, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GAME_TITLE_KEYS = {
  memory: 'memoryTitle',
  logic: 'logicTitle',
  numbers: 'numbersTitle',
  flags: 'flagTitle',
  word: 'wordTitle',
  trivia: 'triviaTitle',
  'shape-word': 'shapeWordTitle',
  'fruit-algebra': 'fruitAlgebraTitle',
  'connect-dots': 'connectDotsTitle',
};

const GAME_CONFIG = {
  memory:        { color: '#3b82f6', icon: Brain },
  logic:         { color: '#8b5cf6', icon: Puzzle },
  numbers:       { color: '#f59e0b', icon: Calculator },
  flags:         { color: '#f97316', icon: Trophy },
  word:          { color: '#ec4899', icon: Target },
  trivia:        { color: '#eab308', icon: Zap },
  'shape-word':  { color: '#6366f1', icon: Puzzle },
  'fruit-algebra': { color: '#ef4444', icon: Calculator },
  'connect-dots': { color: '#14b8a6', icon: Brain },
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="flex-1 min-w-[140px]">
      <CardContent className="pt-5 pb-4 px-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="w-5 h-5" style={{ color }} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
      <TrendingUp className="w-10 h-10 opacity-30" />
      <p className="text-base">{label}</p>
    </div>
  );
}

export default function Progress() {
  const { t } = useLang();
  const [refreshKey, setRefreshKey] = useState(0);
  const { pullY, refreshing, progress } = usePullToRefresh(() =>
    syncProgressFromBackend().then(() => setRefreshKey(k => k + 1))
  );

  // Sync from backend on first load
  useEffect(() => {
    syncProgressFromBackend().then(() => setRefreshKey(k => k + 1));
  }, []);

  const raw = useMemo(() => loadProgress(), [refreshKey]);

  const allGameKeys = Object.keys(GAME_CONFIG);
  const activeGameKeys = useMemo(() => allGameKeys.filter(k => (raw[k]?.length ?? 0) > 0), [raw]);

  const mergedData = useMemo(() => {
    const maxLen = Math.max(...allGameKeys.map(k => raw[k]?.length ?? 0), 0);
    if (maxLen === 0) return [];
    return Array.from({ length: maxLen }, (_, i) => {
      const row = { session: i + 1 };
      allGameKeys.forEach(k => { row[k] = raw[k]?.[i]?.level ?? null; });
      return row;
    });
  }, [raw]);

  const streakData = useMemo(() => {
    const maxLen = Math.max(...allGameKeys.map(k => raw[k]?.length ?? 0), 0);
    if (maxLen === 0) return [];
    return Array.from({ length: maxLen }, (_, i) => {
      const row = { session: i + 1 };
      allGameKeys.forEach(k => { row[k] = raw[k]?.[i]?.streak ?? null; });
      return row;
    });
  }, [raw]);

  const accuracyData = useMemo(() => {
    const maxLen = Math.max(...allGameKeys.map(k => raw[k]?.length ?? 0), 0);
    if (maxLen === 0) return [];
    return Array.from({ length: maxLen }, (_, i) => {
      const row = { session: i + 1 };
      allGameKeys.forEach(k => { row[k] = raw[k]?.[i]?.accuracy ?? null; });
      return row;
    });
  }, [raw]);

  const totalSessions = allGameKeys.reduce((sum, k) => sum + (raw[k]?.length ?? 0), 0);
  const bestStreak = Math.max(...allGameKeys.flatMap(k => raw[k]?.map(s => s.streak) ?? []), 0);
  const maxLevel = Math.max(...allGameKeys.flatMap(k => raw[k]?.map(s => s.level) ?? []), 0);
  const avgAccuracy = useMemo(() => {
    const all = allGameKeys.flatMap(k => raw[k] ?? []).filter(s => s.totalAttempts > 0);
    if (!all.length) return 0;
    return Math.round(all.reduce((s, x) => s + x.accuracy, 0) / all.length);
  }, [raw]);

  const hasData = totalSessions > 0;

  return (
    <div className="space-y-6">
      <PullToRefreshIndicator pullY={pullY} progress={progress} refreshing={refreshing} />
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t.progressTitle}</h2>
        <p className="text-lg text-muted-foreground mt-1">{t.progressDesc}</p>
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-3">
        <StatCard icon={Zap} label={t.totalSessions} value={totalSessions} color="#3b82f6" />
        <StatCard icon={Trophy} label={t.bestStreak} value={bestStreak} color="#f59e0b" />
        <StatCard icon={TrendingUp} label={t.maxLevel} value={maxLevel || '—'} color="#8b5cf6" />
        <StatCard icon={Target} label={t.avgAccuracy} value={hasData ? `${avgAccuracy}%` : '—'} color="#22c55e" />
      </div>

      {/* Level Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t.levelProgress}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? <EmptyState label={t.noDataYet} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mergedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} label={{ value: t.session, position: 'insideBottomRight', offset: -5, fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  labelFormatter={(v) => `${t.session} ${v}`}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                {activeGameKeys.map(k => (
                  <Line key={k} type="monotone" dataKey={k} name={t[GAME_TITLE_KEYS[k]] || k} stroke={GAME_CONFIG[k].color} strokeWidth={2} dot={false} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Streak Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t.streakProgress}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? <EmptyState label={t.noDataYet} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={streakData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  labelFormatter={(v) => `${t.session} ${v}`}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                {activeGameKeys.map(k => (
                  <Bar key={k} dataKey={k} name={t[GAME_TITLE_KEYS[k]] || k} fill={GAME_CONFIG[k].color} radius={[4,4,0,0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Accuracy Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t.accuracyProgress}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? <EmptyState label={t.noDataYet} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={accuracyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  labelFormatter={(v) => `${t.session} ${v}`}
                  formatter={(v) => [`${v}%`]}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                {activeGameKeys.map(k => (
                  <Line key={k} type="monotone" dataKey={k} name={t[GAME_TITLE_KEYS[k]] || k} stroke={GAME_CONFIG[k].color} strokeWidth={2} dot={false} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}