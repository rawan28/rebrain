import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import usePullToRefresh from '@/lib/usePullToRefresh';
import PullToRefreshIndicator from '@/components/PullToRefreshIndicator';
import DailyHeroCard from '@/components/home/DailyHeroCard';
import AllGamesGrid from '@/components/home/AllGamesGrid';
import useDailyStreak from '@/hooks/useDailyStreak';

const LABELS = {
  he: { games: 'משחקים' },
  ar: { games: 'ألعاب' },
};

export default function Home() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const streak = useDailyStreak();
  const { pullY, refreshing, progress } = usePullToRefresh(() => new Promise(r => setTimeout(r, 800)));
  const L = LABELS[lang] || LABELS.he;

  const allGames = [
    { label: lang === 'ar' ? 'الأسهم' : 'חיצים', icon: '🏹', route: '/arrows' },
    { label: lang === 'ar' ? 'صل النقاط' : 'חבר את הנקודות', icon: '➿', route: '/connect-dots' },
    { label: t.memoryTitle, icon: '🃏', route: '/memory' },
    { label: t.logicTitle, icon: '🧩', route: '/logic' },
    { label: t.fruitAlgebraTitle, icon: '🍎', route: '/fruit-algebra' },
    { label: t.shapeSeriesTitle, icon: '🧭', route: '/shape-series' },
    { label: t.wordSpellTitle, icon: '🔤', route: '/word-spell' },
    { label: t.shapePatternTitle, icon: '🔶', route: '/shape-pattern' },
    { label: t.miniSudokuTitle, icon: '🔢', route: '/mini-sudoku' },
    { label: t.shapeWordTitle, icon: '🔷', route: '/shape-word' },
    { label: t.triviaTitle, icon: '💡', route: '/trivia' },
    { label: t.wordTitle, icon: '📝', route: '/word' },
    { label: t.flagTitle, icon: '🏳️', route: '/flags' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8">
      <PullToRefreshIndicator pullY={pullY} progress={progress} refreshing={refreshing} />

      {/* Daily Challenge Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <DailyHeroCard lang={lang} streak={streak} onStart={() => navigate('/daily-quiz')} />
      </motion.div>

      {/* All Games */}
      <section aria-labelledby="games-heading">
        <h2 id="games-heading" className="text-xl font-bold text-foreground mb-3">
          {L.games}
        </h2>
        <AllGamesGrid games={allGames} onSelect={(route) => navigate(route)} />
      </section>
    </div>
  );
}