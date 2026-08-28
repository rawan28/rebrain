import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareHeart, CalendarRange, BellRing, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import usePullToRefresh from '@/lib/usePullToRefresh';
import PullToRefreshIndicator from '@/components/PullToRefreshIndicator';
import FeedbackSurvey from '@/components/FeedbackSurvey';
import DailyHeroCard from '@/components/home/DailyHeroCard';
import QuickPlayCard from '@/components/home/QuickPlayCard';
import AllGamesGrid from '@/components/home/AllGamesGrid';
import useDailyStreak from '@/hooks/useDailyStreak';

const LABELS = {
  he: {
    quickPlay: 'משחק מהיר',
    moreGames: 'עוד משחקים',
    feedback: 'השאירו לנו משוב',
    diffEasy: 'קל',
    diffMedium: 'בינוני',
  },
  ar: {
    quickPlay: 'لعب سريع',
    moreGames: 'ألعاب أخرى',
    feedback: 'شاركونا رأيكم',
    diffEasy: 'سهل',
    diffMedium: 'متوسط',
  },
};

export default function Home() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const streak = useDailyStreak();
  const { pullY, refreshing, progress } = usePullToRefresh(() => new Promise(r => setTimeout(r, 800)));
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const L = LABELS[lang] || LABELS.he;

  const quickPlay = [
    { label: t.memoryTitle, icon: '🃏', route: '/memory', difficulty: L.diffEasy, color: 'from-purple-400 to-indigo-500' },
    { label: t.logicTitle, icon: '🧩', route: '/logic', difficulty: L.diffMedium, color: 'from-teal-400 to-cyan-500' },
    { label: t.fruitAlgebraTitle, icon: '🍎', route: '/fruit-algebra', difficulty: L.diffEasy, color: 'from-orange-400 to-rose-500' },
  ];

  const allGames = [
    { label: t.flagTitle, icon: '🏳️', route: '/flags' },
    { label: t.wordTitle, icon: '📝', route: '/word' },
    { label: t.triviaTitle, icon: '💡', route: '/trivia' },
    { label: t.shapeWordTitle, icon: '🔷', route: '/shape-word' },
    { label: t.miniSudokuTitle, icon: '🔢', route: '/mini-sudoku' },
    { label: t.shapePatternTitle, icon: '🔶', route: '/shape-pattern' },
    { label: t.wordSpellTitle, icon: '🔤', route: '/word-spell' },
    { label: t.shapeSeriesTitle, icon: '🧭', route: '/shape-series' },
    { label: lang === 'ar' ? 'صل النقاط' : 'חבר את הנקודות', icon: '➿', route: '/connect-dots' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8">
      <PullToRefreshIndicator pullY={pullY} progress={progress} refreshing={refreshing} />

      {/* Zone 1: Daily Challenge Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <DailyHeroCard lang={lang} streak={streak} onStart={() => navigate('/daily-quiz')} />
      </motion.div>

      {/* Zone 2: Quick Play strip */}
      <section aria-labelledby="quick-play-heading">
        <h2 id="quick-play-heading" className="text-xl font-bold text-foreground mb-3">
          {L.quickPlay}
        </h2>
        <div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory' }}
          role="list"
        >
          {quickPlay.map((game) => (
            <div key={game.route} role="listitem" style={{ scrollSnapAlign: 'start' }}>
              <QuickPlayCard game={game} onClick={() => navigate(game.route)} />
            </div>
          ))}
        </div>
      </section>

      {/* Zone 3: More Games (collapsed) */}
      <section>
        <button
          onClick={() => setShowAllGames((prev) => !prev)}
          className="w-full flex items-center justify-between text-xl font-bold text-foreground py-3 min-h-[52px] border-t border-border"
          aria-expanded={showAllGames}
          aria-controls="all-games-grid"
        >
          <span>{L.moreGames}</span>
          <span
            className="text-muted-foreground transition-transform duration-200"
            style={{ transform: showAllGames ? 'rotate(180deg)' : 'none' }}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>
        {showAllGames && (
          <div id="all-games-grid" className="mt-3">
            <AllGamesGrid games={allGames} onSelect={(route) => navigate(route)} />
          </div>
        )}
      </section>

      {/* Tools: weekly report, reminder, feedback */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          onClick={() => navigate('/weekly-report')}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-accent/15 text-accent-foreground border-2 border-accent/30 text-lg font-semibold hover:bg-accent/25 transition-colors active:scale-95"
        >
          <CalendarRange className="w-6 h-6" />
          {t.weeklyReportTitle}
        </button>
        <button
          onClick={() => navigate('/badges')}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-accent/15 text-accent-foreground border-2 border-accent/30 text-lg font-semibold hover:bg-accent/25 transition-colors active:scale-95"
        >
          <Award className="w-6 h-6" />
          {lang === 'ar' ? 'الأوسمة والإنجازات' : 'תגים והישגים'}
        </button>
        <button
          onClick={() => navigate('/reminder')}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-accent/15 text-accent-foreground border-2 border-accent/30 text-lg font-semibold hover:bg-accent/25 transition-colors active:scale-95"
        >
          <BellRing className="w-6 h-6" />
          {t.reminderTitle}
        </button>
        <button
          onClick={() => setFeedbackOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-accent/15 text-accent-foreground border-2 border-accent/30 text-lg font-semibold hover:bg-accent/25 transition-colors active:scale-95"
        >
          <MessageSquareHeart className="w-6 h-6" />
          {L.feedback}
        </button>
      </div>

      <FeedbackSurvey open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}