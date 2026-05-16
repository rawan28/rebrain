import { useState, useCallback } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Car, Trophy } from 'lucide-react';
import { LEVELS } from '@/lib/rushHourLevels';

const GRID_SIZE = 6;
const CELL_SIZE = 56;

// Colors for vehicles
const VEHICLE_COLORS = [
  'bg-red-500',     // player car (index 0)
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-amber-500',
  'bg-lime-500',
];

export default function RushHour() {
  const { t } = useLang();
  const [levelIndex, setLevelIndex] = useState(0);
  const [vehicles, setVehicles] = useState(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [dragging, setDragging] = useState(null); // { vehicleIdx, startX, startY, startPos }

  const startGame = useCallback((idx = levelIndex) => {
    setVehicles(LEVELS[idx].vehicles.map(v => ({ ...v })));
    setMoves(0);
    setWon(false);
    setStarted(true);
  }, [levelIndex]);

  // Build grid occupancy map
  const buildGrid = (vehs) => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(-1));
    vehs.forEach((v, i) => {
      for (let s = 0; s < v.length; s++) {
        const r = v.horizontal ? v.row : v.row + s;
        const c = v.horizontal ? v.col + s : v.col;
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) grid[r][c] = i;
      }
    });
    return grid;
  };

  const moveVehicle = (idx, delta) => {
    if (won) return;
    const v = vehicles[idx];
    const grid = buildGrid(vehicles);
    const newVehs = vehicles.map(x => ({ ...x }));
    const nv = newVehs[idx];

    if (v.horizontal) {
      const newCol = v.col + delta;
      if (newCol < 0 || newCol + v.length > GRID_SIZE) return;
      // Check path is clear
      if (delta > 0) {
        for (let c = v.col + v.length; c < newCol + v.length; c++) {
          if (grid[v.row][c] !== -1 && grid[v.row][c] !== idx) return;
        }
      } else {
        for (let c = newCol; c < v.col; c++) {
          if (grid[v.row][c] !== -1 && grid[v.row][c] !== idx) return;
        }
      }
      nv.col = newCol;
    } else {
      const newRow = v.row + delta;
      if (newRow < 0 || newRow + v.length > GRID_SIZE) return;
      if (delta > 0) {
        for (let r = v.row + v.length; r < newRow + v.length; r++) {
          if (grid[r][v.col] !== -1 && grid[r][v.col] !== idx) return;
        }
      } else {
        for (let r = newRow; r < v.row; r++) {
          if (grid[r][v.col] !== -1 && grid[r][v.col] !== idx) return;
        }
      }
      nv.row = newRow;
    }

    setVehicles(newVehs);
    setMoves(m => m + 1);

    // Check win: player car (idx 0) reaches col 4 (exit at right edge, row 2)
    if (idx === 0 && nv.horizontal && nv.col + nv.length === GRID_SIZE) {
      setWon(true);
    }
  };

  const handleCellClick = (row, col) => {
    if (won) return;
    const grid = buildGrid(vehicles);
    const vIdx = grid[row][col];
    if (vIdx === -1) return;
    // Determine direction to move: find which side has space
    const v = vehicles[vIdx];
    if (v.horizontal) {
      if (col > v.col + Math.floor(v.length / 2) - 1) moveVehicle(vIdx, 1);
      else moveVehicle(vIdx, -1);
    } else {
      if (row > v.row + Math.floor(v.length / 2) - 1) moveVehicle(vIdx, 1);
      else moveVehicle(vIdx, -1);
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center space-y-2">
          <div className="bg-orange-100 p-4 rounded-2xl inline-block mb-2">
            <Car className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold">{t.rushHourTitle || 'חילוץ מכונית'}</h2>
          <p className="text-muted-foreground text-lg">{t.rushHourDesc || 'הוצא את המכונית האדומה מהפקק!'}</p>
        </div>

        <div className="space-y-3 w-full max-w-xs">
          <p className="text-center font-medium">{t.level || 'רמה'}</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {LEVELS.map((lv, i) => (
              <button
                key={i}
                onClick={() => setLevelIndex(i)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all text-sm
                  ${levelIndex === i ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-border bg-card text-muted-foreground hover:border-orange-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8" onClick={() => startGame(levelIndex)}>
          {t.startPlaying || 'התחל לשחק'}
        </Button>
      </div>
    );
  }

  const grid = buildGrid(vehicles);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-sm">
        <h2 className="text-2xl font-bold">{t.rushHourTitle || 'חילוץ מכונית'}</h2>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">{moves} {t.moves || 'מהלכים'}</span>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => startGame(levelIndex)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {won && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-5 py-3 font-semibold text-lg">
          <Trophy className="w-6 h-6" /> {t.excellent || 'מצוין!'} — {moves} {t.moves || 'מהלכים'}
        </div>
      )}

      {/* Game Grid */}
      <div className="relative" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
        {/* Background grid */}
        <div
          className="absolute inset-0 border-2 border-slate-400 rounded-lg bg-slate-100"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent ${CELL_SIZE - 1}px, #cbd5e1 ${CELL_SIZE - 1}px, #cbd5e1 ${CELL_SIZE}px),
              repeating-linear-gradient(90deg, transparent, transparent ${CELL_SIZE - 1}px, #cbd5e1 ${CELL_SIZE - 1}px, #cbd5e1 ${CELL_SIZE}px)
            `
          }}
        />

        {/* Exit arrow */}
        <div
          className="absolute text-red-500 font-bold text-xl flex items-center"
          style={{ right: -28, top: 2 * CELL_SIZE + CELL_SIZE / 2 - 12 }}
        >
          →
        </div>

        {/* Vehicles */}
        {vehicles.map((v, i) => {
          const isPlayer = i === 0;
          const width = v.horizontal ? v.length * CELL_SIZE - 4 : CELL_SIZE - 4;
          const height = v.horizontal ? CELL_SIZE - 4 : v.length * CELL_SIZE - 4;
          const left = v.col * CELL_SIZE + 2;
          const top = v.row * CELL_SIZE + 2;

          return (
            <button
              key={i}
              onClick={() => handleCellClick(v.row, v.col)}
              className={`absolute rounded-lg ${VEHICLE_COLORS[i % VEHICLE_COLORS.length]} 
                flex items-center justify-center shadow-md cursor-pointer
                hover:brightness-110 active:scale-95 transition-all duration-150 select-none
                ${isPlayer ? 'ring-2 ring-red-700' : ''}`}
              style={{ left, top, width, height }}
              title={isPlayer ? (t.rushHourTitle || 'חילוץ מכונית') : ''}
            >
              {isPlayer && (
                <Car className="w-6 h-6 text-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Arrow controls */}
      <div className="flex flex-col items-center gap-3 mt-2">
        <p className="text-sm text-muted-foreground text-center">
          {t.rushHourHint || 'לחץ על הרכב להזזתו — הוצא את המכונית האדומה לצד ימין'}
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          {LEVELS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setLevelIndex(i); startGame(i); }}
              className={`w-8 h-8 rounded-lg border font-medium text-sm transition-all
                ${levelIndex === i ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-border bg-card text-muted-foreground hover:border-orange-300'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}