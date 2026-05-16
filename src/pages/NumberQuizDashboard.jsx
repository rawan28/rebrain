import { useMemo } from 'react';
import { loadProgress } from '@/lib/progressStore';
import { useLang } from '@/lib/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Target, Zap, Hash } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function NumberQuizDashboard() {
  const { t } = useLang();
  const isRtl = t.dir === 'rtl';

  const sessions = useMemo(() => {
    const data = loadProgress();
    return (data.numbers || []).map((s, i) => ({
      ...s,
      index: i + 1,
      label: `#${i + 1}`,
    }));
  }, []);

  const totalSessions = sessions.length;
  const avgAccuracy = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions)
    : 0;
  const maxStreak = totalSessions > 0
    ? Math.max(...sessions.map(s => s.streak || 0))
    : 0;
  const maxLevel = totalSessions > 0
    ? Math.max(...sessions.map(s => s.level || 0))
    : 0;

  const labels = isRtl
    ? { title: 'לוח בקרה – חידון מספרים', sessions: 'סשנים', accuracy: 'דיוק %', streak: 'רצף', level: 'רמה', avgAcc: 'דיוק ממוצע', best: 'רצף מקסימלי', total: 'סה"כ משחקים', topLevel: 'רמה מקסימלית', accTrend: 'מגמת דיוק לאורך זמן', levelTrend: 'התקדמות רמה', noData: 'אין נתונים עדיין – שחק קצת!' }
    : { title: 'Number Quiz Dashboard', sessions: 'Sessions', accuracy: 'Accuracy %', streak: 'Streak', level: 'Level', avgAcc: 'Avg Accuracy', best: 'Best Streak', total: 'Total Games', topLevel: 'Top Level', accTrend: 'Accuracy Trend Over Time', levelTrend: 'Level Progression', noData: 'No data yet — play some rounds!' };

  const stats = [
    { label: labels.total, value: totalSessions, icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: labels.avgAcc, value: `${avgAccuracy}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: labels.best, value: maxStreak, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: labels.topLevel, value: maxLevel, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="bg-blue-50 p-5 rounded-2xl">
          <BarChart2 className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{labels.title}</h2>
        <p className="text-muted-foreground text-lg">{labels.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={t.dir}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{labels.title}</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accuracy Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{labels.accTrend}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Level Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{labels.levelTrend}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="level" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}