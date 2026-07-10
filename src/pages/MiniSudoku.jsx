import { useState, useEffect, useCallback } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { generatePuzzle, getConflicts, isComplete, DIFFICULTY } from '@/lib/miniSudokuData';
import { base44 } from '@/api/base44Client';
import { RotateCcw, Eraser, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LABELS = {
  he: {
    instructions: 'מלאו את הרשת כך שכל שורה, עמודה ומשבצת תכיל את המספרים 1–6 ללא חזרות',
    newGame: 'משחק חדש',
    erase: 'מחק',
    time: 'זמן',
    conflicts: 'התנגשויות',
    youWin: 'כל הכבוד! 🎉',
    youWinDesc: 'פתרתם את הסודוקו בהצלחה',
    solvedIn: 'הושלם ב־',
    playAgain: 'משחק חדש',
  },
  ar: {
    instructions: 'املأ الشبكة بحيث يحتوي كل صف وعمود ومربع على الأرقام 1–6 دون تكرار',
    newGame: 'لعبة جديدة',
    erase: 'مسح',
    time: 'الوقت',
    conflicts: 'تعارضات',
    youWin: 'أحسنت! 🎉',
    youWinDesc: 'حللت السودوكو بنجاح',
    solvedIn: 'تم الحل في',
    playAgain: 'لعبة جديدة',
  },
};

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

function getCellBorderStyle(r, c) {
  const isBlockRightEdge = c === 2;
  const isBlockBottomEdge = r === 1 || r === 3;
  const isLastCol = c === 5;
  const isLastRow = r === 5;
  const thin = '1px solid hsl(var(--border))';
  const thick = '3px solid hsl(var(--foreground))';
  return {
    borderRight: isLastCol ? 'none' : isBlockRightEdge ? thick : thin,
    borderBottom: isLastRow ? 'none' : isBlockBottomEdge ? thick : thin,
  };
}

export default function MiniSudoku() {
  const { lang } = useLang();
  const L = LABELS[lang] || LABELS.he;
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [grid, setGrid] = useState(null);
  const [selected, setSelected] = useState(null);
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState(false);

  const newGame = useCallback((diff) => {
    const { puzzle: p, solution: s } = generatePuzzle(diff);
    setPuzzle(p);
    setSolution(s);
    setGrid(p.map(row => [...row]));
    setSelected(null);
    setWon(false);
    setElapsed(0);
    setSaved(false);
  }, []);

  useEffect(() => { newGame('easy'); }, [newGame]);

  useEffect(() => {
    if (won || !grid) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [won, grid]);

  const conflicts = grid ? getConflicts(grid) : new Set();

  useEffect(() => {
    if (grid && !won && isComplete(grid)) {
      setWon(true);
    }
  }, [grid, won]);

  useEffect(() => {
    if (won && !saved) {
      setSaved(true);
      const today = new Date().toISOString().split('T')[0];
      const { level } = DIFFICULTY[difficulty];
      base44.entities.UserProgress.create({
        game: 'mini_sudoku',
        date: today,
        level,
        totalCorrect: 36,
        totalAttempts: 36,
        accuracy: 100,
        responseTimeMs: elapsed * 1000,
        streak: 1,
      }).catch(() => {});
    }
  }, [won, saved, difficulty, elapsed]);

  const enterNumber = (num) => {
    if (!selected || won || !grid || !puzzle) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
  };

  const eraseCell = () => {
    if (!selected || won || !grid || !puzzle) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = 0;
    setGrid(newGrid);
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    newGame(diff);
  };

  if (!grid || !puzzle) return null;

  const conflictCount = conflicts.size;
  const selectedValue = selected ? grid[selected[0]][selected[1]] : 0;

  return (
    <div dir="rtl" className="max-w-md mx-auto space-y-5 py-2">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{lang === 'ar' ? 'سودوكو مصغر' : 'מיני סודוקו'}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{L.instructions}</p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-5 h-5" />
          <span className="font-mono font-semibold text-lg">{formatTime(elapsed)}</span>
        </div>
        {conflictCount > 0 && (
          <div className="flex items-center gap-2 text-destructive">
            <span className="text-sm font-medium">{L.conflicts}: {conflictCount}</span>
          </div>
        )}
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2 justify-center">
        {Object.entries(DIFFICULTY).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleDifficultyChange(key)}
            className={`px-4 py-2 rounded-xl border-2 font-medium transition-all text-sm min-h-[40px]
              ${difficulty === key
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground hover:border-primary/50'}`}
          >
            {val.label[lang]}
          </button>
        ))}
      </div>

      {/* Sudoku grid */}
      <div className="relative">
        <div className="grid grid-cols-6 gap-0 border-2 border-foreground rounded-xl overflow-hidden bg-card">
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isGiven = puzzle[r][c] !== 0;
              const isSelected = selected && selected[0] === r && selected[1] === c;
              const isSameRow = selected && r === selected[0];
              const isSameCol = selected && c === selected[1];
              const isSameBlock = selected &&
                Math.floor(r / 2) === Math.floor(selected[0] / 2) &&
                Math.floor(c / 3) === Math.floor(selected[1] / 3);
              const isRelated = isSameRow || isSameCol || isSameBlock;
              const isSameValue = selectedValue && val !== 0 && val === selectedValue;
              const isConflict = conflicts.has(`${r},${c}`);

              let cellClass = 'text-foreground';
              if (isConflict) cellClass = 'bg-destructive/20 text-destructive font-bold';
              else if (isSelected) cellClass = 'bg-primary text-primary-foreground';
              else if (isSameValue) cellClass = 'bg-accent text-accent-foreground font-semibold';
              else if (isRelated) cellClass = 'bg-muted/50';
              else if (isGiven) cellClass = 'text-foreground font-bold';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => setSelected([r, c])}
                  style={getCellBorderStyle(r, c)}
                  className={`aspect-square flex items-center justify-center text-2xl md:text-3xl transition-colors ${cellClass}`}
                >
                  {val !== 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>

        {/* Win overlay */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/90 rounded-xl flex flex-col items-center justify-center gap-4 p-6 text-center"
            >
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-foreground">{L.youWin}</h2>
              <p className="text-muted-foreground">{L.youWinDesc}</p>
              <p className="text-lg font-semibold text-primary">
                {L.solvedIn} {formatTime(elapsed)}
              </p>
              <button
                onClick={() => newGame(difficulty)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg"
              >
                <RotateCcw className="w-5 h-5" />
                {L.playAgain}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Number pad */}
      {!won && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => enterNumber(num)}
              className="w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl border-2 border-border bg-card text-foreground hover:border-primary hover:bg-primary/10 transition-all active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={eraseCell}
            className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-border bg-card text-muted-foreground hover:border-destructive hover:bg-destructive/10 transition-all active:scale-95"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* New game button */}
      {!won && (
        <button
          onClick={() => newGame(difficulty)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-bold"
        >
          <RotateCcw className="w-5 h-5" />
          {L.newGame}
        </button>
      )}
    </div>
  );
}