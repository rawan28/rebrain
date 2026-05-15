import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Grid3X3, Puzzle, Calculator, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const exercises = [
  {
    path: '/memory',
    title: 'Memory Cards',
    description: 'Flip cards and find matching pairs. Great for training your memory!',
    icon: Grid3X3,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    path: '/logic',
    title: 'Logic Puzzles',
    description: 'Find the pattern and choose what comes next. Sharpen your reasoning!',
    icon: Puzzle,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    path: '/numbers',
    title: 'Number Quiz',
    description: 'Solve math problems that adapt to your skill level. Keep counting!',
    icon: Calculator,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 py-4"
      >
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
          <Sparkles className="w-5 h-5" />
          <span className="text-base font-medium">Daily Brain Training</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Welcome to MindFit
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Choose an exercise below to get started. Each game adapts to your level — 
          the better you do, the more challenging it gets!
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
                <Card className={`border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${exercise.color}`}>
                  <CardHeader className="flex flex-row items-center gap-4 md:gap-5 p-5 md:p-6">
                    <div className={`p-3 md:p-4 rounded-xl ${exercise.iconBg} shrink-0`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl md:text-2xl mb-1">{exercise.title}</CardTitle>
                      <CardDescription className="text-base md:text-lg leading-relaxed">
                        {exercise.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-2 text-muted-foreground py-4"
      >
        <Heart className="w-5 h-5 text-red-400" />
        <p className="text-base">A little practice each day goes a long way</p>
      </motion.div>
    </div>
  );
}