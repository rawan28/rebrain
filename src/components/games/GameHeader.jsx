import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

export default function GameHeader({ title, description, level, streak, totalCorrect, totalAttempts, onReset }) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-lg text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <DifficultyBadge level={level} />
        
        {streak > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
            <Trophy className="w-5 h-5" />
            <span className="text-base font-semibold">{streak} streak!</span>
          </div>
        )}

        <div className="text-base text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{totalCorrect}</span>/{totalAttempts}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="ml-auto text-base gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Start Over
        </Button>
      </div>
    </div>
  );
}