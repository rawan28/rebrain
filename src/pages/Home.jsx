import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Grid3X3, Puzzle, Calculator, Flag, PenLine, Lightbulb, Shapes, ArrowLeft, ArrowRight, Sparkles, Apple, CalendarRange, BellRing, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import usePullToRefresh from '@/lib/usePullToRefresh';
import PullToRefreshIndicator from '@/components/PullToRefreshIndicator';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { t } = useLang();
  const { pullY, refreshing, progress } = usePullToRefresh(() => new Promise(r => setTimeout(r, 800)));

  const exercises = [
    {
      path: '/fruit-algebra',
      title: t.fruitAlgebraTitle || 'אלגברת פירות 🍓',
      description: t.fruitAlgebraDesc || 'גלה את ערך כל פרי ופתור את החידה!',
      icon: Apple,
      color: 'bg-red-50 text-red-600 border-red-100',
      iconBg: 'bg-red-100',
    },
    {
      path: '/memory',
      title: t.memoryTitle,
      description: t.memoryDesc,
      icon: Grid3X3,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-100',
    },
    {
      path: '/logic',
      title: t.logicTitle,
      description: t.logicDesc,
      icon: Puzzle,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-100',
    },
    {
      path: '/numbers',
      title: t.numbersTitle,
      description: t.numbersDesc,
      icon: Calculator,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-100',
    },
    {
      path: '/flags',
      title: t.flagTitle,
      description: t.flagDesc,
      icon: Flag,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      iconBg: 'bg-orange-100',
    },
    {
      path: '/word',
      title: t.wordTitle,
      description: t.wordDesc,
      icon: PenLine,
      color: 'bg-pink-50 text-pink-600 border-pink-100',
      iconBg: 'bg-pink-100',
    },

    {
      path: '/trivia',
      title: t.triviaTitle,
      description: t.triviaDesc,
      icon: Lightbulb,
      color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      iconBg: 'bg-yellow-100',
    },
    {
      path: '/shape-word',
      title: t.shapeWordTitle,
      description: t.shapeWordDesc,
      icon: Shapes,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    {
      path: '/weekly-report',
      title: t.weeklyReportTitle,
      description: t.weeklyCardDesc,
      icon: CalendarRange,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      iconBg: 'bg-cyan-100',
    },
    {
      path: '/reminder',
      title: t.reminderTitle,
      description: t.reminderCardDesc,
      icon: BellRing,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      iconBg: 'bg-rose-100',
    },
    {
      path: '/daily-quiz',
      title: t.dir === 'rtl' ? 'משחק יומי' : 'Daily Quiz',
      description: t.dir === 'rtl' ? 'שלושה אתגרים קצרים לחיזוק הזיכרון — כל יום!' : 'Three short challenges to boost your memory — every day!',
      icon: Star,
      color: 'bg-violet-50 text-violet-600 border-violet-100',
      iconBg: 'bg-violet-100',
    },
  ];

  const ArrowIcon = t.dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8">
      <PullToRefreshIndicator pullY={pullY} progress={progress} refreshing={refreshing} />
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 py-4"
      >
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
          <Sparkles className="w-5 h-5" />
          <span className="text-base font-medium">{t.dailyBrainTraining}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {t.welcomeTitle}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {t.welcomeDesc}
        </p>
      </motion.div>

      {/* Exercise Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:gap-6"
      >
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <motion.div key={exercise.path} variants={item}>
              <Link to={exercise.path} className="block group">
                <Card className={`border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden ${exercise.color}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="flex flex-row items-center gap-4 md:gap-5 p-5 md:p-6 relative z-10">
                    <div className={`p-3 md:p-4 rounded-2xl ${exercise.iconBg} shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl md:text-2xl mb-1">{exercise.title}</CardTitle>
                      <CardDescription className="text-base md:text-lg leading-relaxed">
                        {exercise.description}
                      </CardDescription>
                    </div>
                    <ArrowIcon className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>


    </div>
  );
}