import { useMemo, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { loadProgress } from '@/lib/progressStore';
import usePullToRefresh from '@/lib/usePullToRefresh';
import PullToRefreshIndicator from '@/components/PullToRefreshIndicator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Brain, Puzzle, Calculator, Trophy, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GAME_CONFIG = {
  memory: { color: '#3b82f6', icon: Brain },
  logic: { color: '#8b5cf6', icon: Puzzle },
  numbers: { color: '#f59e0b', icon: Calculator },
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
  const { pullY, refreshing, progress } = usePullToRefresh(() => new Promise(r => setTimeout(() => { setRefreshKey(k => k + 1); r(); }, 800)));
  const raw = useMemo(() => loadProgress(), [refreshKey]);

  // Merge all games into a unified timeline by session index
  const mergedData = useMemo(() => {
    const maxLen = Math.max(
      raw.memory?.length ?? 0,
      raw.logic?.length ?? 0,
      raw.numbers?.length ?? 0,
    );
    if (maxLen === 0) return [];
    return Array.from({ length: maxLen }, (_, i) => ({
      session: i + 1,
      memory: raw.memory?.[i]?.level ?? null,
      logic: raw.logic?.[i]?.level ?? null,
      numbers: raw.numbers?.[i]?.level ?? null,
    }));
  }, [raw]);

  const streakData = useMemo(() => {
    const maxLen = Math.max(
      raw.memory?.length ?? 0,
      raw.logic?.length ?? 0,
      raw.numbers?.length ?? 0,
    );
    if (maxLen === 0) return [];
    return Array.from({ length: maxLen }, (_, i) => ({
      session: i + 1,
      memory: raw.memory?.[i]?.streak ?? null,
      logic: raw.logic?.[i]?.streak ?? null,
      numbers: raw.numbers?.[i]?.streak ?? null,
    }));
  }, [raw]);

  const accuracyData = useMemo(() => {
    const maxLen = Math.max(
      raw.memory?.length ?? 0,
      raw.logic?.length ?? 0,
      raw.numbers?.length ?? 0,
    );
    if (maxLen === 0) return [];
    return Array.from({ length: maxLen }, (_, i) => ({
      session: i + 1,
      memory: raw.memory?.[i]?.accuracy ?? null,
      logic: raw.logic?.[i]?.accuracy ?? null,
      numbers: raw.numbers?.[i]?.accuracy ?? null,
    }));
  }, [raw]);

  const totalSessions = (raw.memory?.length ?? 0) + (raw.logic?.length ?? 0) + (raw.numbers?.length ?? 0);
  const bestStreak = Math.max(
    ...(raw.memory?.map(s => s.streak) ?? [0]),
    ...(raw.logic?.map(s => s.streak) ?? [0]),
    ...(raw.numbers?.map(s => s.streak) ?? [0]),
    0,
  );
  const maxLevel = Math.max(
    ...(raw.memory?.map(s => s.level) ?? [0]),
    ...(raw.logic?.map(s => s.level) ?? [0]),
    ...(raw.numbers?.map(s => s.level) ?? [0]),
    0,
  );
  const avgAccuracy = useMemo(() => {
    const all = [
      ...(raw.memory ?? []),
      ...(raw.logic ?? []),
      ...(raw.numbers ?? []),
    ].filter(s => s.totalAttempts > 0);
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
                <Line type="monotone" dataKey="memory" name={t.memoryTitle} stroke={GAME_CONFIG.memory.color} strokeWidth={2} dot={false} connectNulls />
                <Line type="monotone" dataKey="logic" name={t.logicTitle} stroke={GAME_CONFIG.logic.color} strokeWidth={2} dot={false} connectNulls />
                <Line type="monotone" dataKey="numbers" name={t.numbersTitle} stroke={GAME_CONFIG.numbers.color} strokeWidth={2} dot={false} connectNulls />
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
                <Bar dataKey="memory" name={t.memoryTitle} fill={GAME_CONFIG.memory.color} radius={[4,4,0,0]} />
                <Bar dataKey="logic" name={t.logicTitle} fill={GAME_CONFIG.logic.color} radius={[4,4,0,0]} />
                <Bar dataKey="numbers" name={t.numbersTitle} fill={GAME_CONFIG.numbers.color} radius={[4,4,0,0]} />
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
                <Line type="monotone" dataKey="memory" name={t.memoryTitle} stroke={GAME_CONFIG.memory.color} strokeWidth={2} dot={false} connectNulls />
                <Line type="monotone" dataKey="logic" name={t.logicTitle} stroke={GAME_CONFIG.logic.color} strokeWidth={2} dot={false} connectNulls />
                <Line type="monotone" dataKey="numbers" name={t.numbersTitle} stroke={GAME_CONFIG.numbers.color} strokeWidth={2} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}