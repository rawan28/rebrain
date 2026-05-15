import { useState, useEffect } from 'react';
import { generateSudoku } from '@/lib/sudokuGenerator';
import { useLang } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, Hash } from 'lucide-react';

const DIFFICULTIES = [1, 2, 3, 4, 5];

export default function Sudoku() {
  const { t } = useLang();
  const [difficulty, setDifficulty] = useState(1);
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [board, setBoard] = useState(null);
  const [fixed, setFixed] = useState(null);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState({});
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  function startGame(diff = difficulty) {
    const { puzzle: p, solution: s } = generateSudoku(diff);
    setPuzzle(p);
    setSolution(s);
    setBoard(p.map(row => [...row]));
    setFixed(p.map(row => row.map(cell => cell !== 0)));
    setSelected(null);
    setErrors({});
    setWon(false);
    setStarted(true);
  }

  function handleCellClick(row, col) {
    if (fixed[row][col]) return;
    setSelected({ row, col });
  }

  function handleInput(num) {
    if (!selected) return;
    const { row, col } = selected;
    if (fixed[row][col]) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    // Check error
    const key = `${row}-${col}`;
    const newErrors = { ...errors };
    if (num !== 0 && solution[row][col] !== num) {
      newErrors[key] = true;
    } else {
      delete newErrors[key];
    }
    setErrors(newErrors);

    // Check win
    const complete = newBoard.every((r, ri) => r.every((c, ci) => c === solution[ri][ci]));
    if (complete) setWon(true);
  }

  const diffLabel = (d) => {
    const labels = { he: ['קל מאד', 'קל', 'בינוני', 'קשה', 'קשה מאד'], ar: ['سهل جداً', 'سهل', 'متوسط', 'صعب', 'صعب جداً'] };
    const lang = t.dir === 'rtl' ? (t.appSubtitle.includes('نشاط') ? 'ar' : 'he') : 'he';
    return labels[lang][d - 1];
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center space-y-2">
          <div className="bg-teal-100 p-4 rounded-2xl inline-block mb-2">
            <Hash className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.sudokuTitle}</h2>
          <p className="text-muted-foreground text-lg">{t.sudokuDesc}</p>
        </div>
        <div className="space-y-3 w-full max-w-xs">
          <p className="text-center font-medium text-foreground">{t.level}</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all text-sm ${difficulty === d ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-border bg-card text-muted-foreground hover:border-teal-300'}`}
              >
                {diffLabel(d)}
              </button>
            ))}
          </div>
        </div>
        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8" onClick={() => startGame(difficulty)}>
          {t.startPlaying}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-sm">
        <h2 className="text-2xl font-bold">{t.sudokuTitle}</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => startGame(difficulty)}>
          <RotateCcw className="w-4 h-4" /> {t.startOver}
        </Button>
      </div>

      {won && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-5 py-3 font-semibold text-lg">
          <CheckCircle2 className="w-6 h-6" /> {t.excellent}
        </div>
      )}

      {/* Grid */}
      <div className="border-2 border-foreground rounded-lg overflow-hidden">
        {board.map((row, ri) => (
          <div key={ri} className={`flex ${ri === 2 || ri === 5 ? 'border-b-2 border-foreground' : ''}`}>
            {row.map((cell, ci) => {
              const isSelected = selected?.row === ri && selected?.col === ci;
              const isFixed = fixed[ri][ci];
              const isError = errors[`${ri}-${ci}`];
              const sameBox = selected && Math.floor(selected.row / 3) === Math.floor(ri / 3) && Math.floor(selected.col / 3) === Math.floor(ci / 3);
              const sameLine = selected && (selected.row === ri || selected.col === ci);
              const sameNum = selected && cell !== 0 && board[selected.row][selected.col] === cell;

              return (
                <button
                  key={ci}
                  onClick={() => handleCellClick(ri, ci)}
                  className={`
                    w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-base md:text-lg font-semibold border border-border/50 transition-colors
                    ${ci === 2 || ci === 5 ? 'border-r-2 border-r-foreground' : ''}
                    ${isSelected ? 'bg-teal-500 text-white' : ''}
                    ${!isSelected && isError ? 'bg-red-100 text-red-600' : ''}
                    ${!isSelected && !isError && isFixed ? 'text-foreground bg-slate-100' : ''}
                    ${!isSelected && !isError && !isFixed ? 'text-teal-700' : ''}
                    ${!isSelected && (sameBox || sameLine) ? 'bg-teal-50' : ''}
                    ${!isSelected && sameNum && cell !== 0 ? 'bg-teal-100' : ''}
                    ${!isFixed && !isSelected ? 'hover:bg-teal-100 cursor-pointer' : ''}
                    ${isFixed ? 'cursor-default' : ''}
                  `}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Numpad */}
      <div className="flex gap-2 flex-wrap justify-center">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => handleInput(n)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-border bg-card hover:bg-teal-50 hover:border-teal-400 font-bold text-lg transition-all"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleInput(0)}
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-border bg-card hover:bg-red-50 hover:border-red-300 font-bold text-lg transition-all text-muted-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  );
}