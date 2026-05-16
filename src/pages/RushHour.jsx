import { useState, useCallback, useRef } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Car, Trophy } from 'lucide-react';
import { LEVELS } from '@/lib/rushHourLevels';

const GRID_SIZE = 6;
const CELL_SIZE = 56;

// Tailwind color classes (must be literal for purge)
const VEHICLE_FILL_COLORS = [
  '#ef4444', // red - player
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#a855f7', // purple
  '#f97316', // orange
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#84cc16', // lime
];

export default function RushHour() {
  const { t } = useLang();
  const [levelIndex, setLevelIndex] = useState(0);
  const [vehicles, setVehicles] = useState(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  const startGame = useCallback((idx = levelIndex) => {
    setVehicles(LEVELS[idx].vehicles.map(v => ({ ...v })));
    setMoves(0);
    setWon(false);
    setStarted(true);
  }, [levelIndex]);

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

    if (idx === 0 && nv.horizontal && nv.col + nv.length === GRID_SIZE) {
      setWon(true);
    }
  };

  // Swipe handling
  const swipeStart = useRef(null);

  const handlePointerDown = (e, vIdx) => {
    if (won) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    swipeStart.current = { x: e.clientX, y: e.clientY, vIdx };
  };

  const handlePointerUp = (e, vIdx) => {
    if (!swipeStart.current || swipeStart.current.vIdx !== vIdx) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 8) return; // too small — ignore

    const v = vehicles[vIdx];
    if (v.horizontal) {
      if (absDx < absDy) return; // not a horizontal swipe
      const steps = Math.round(dx / CELL_SIZE) || (dx > 0 ? 1 : -1);
      for (let i = 0; i < Math.abs(steps); i++) moveVehicle(vIdx, steps > 0 ? 1 : -1);
    } else {
      if (absDy < absDx) return; // not a vertical swipe
      const steps = Math.round(dy / CELL_SIZE) || (dy > 0 ? 1 : -1);
      for (let i = 0; i < Math.abs(steps); i++) moveVehicle(vIdx, steps > 0 ? 1 : -1);
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
      {(() => {
        const WALL = 10; // wall thickness px
        const GRID_PX = GRID_SIZE * CELL_SIZE;
        const EXIT_ROW = 2;

        return (
          <div
            className="relative select-none"
            style={{ width: GRID_PX + WALL * 2 + 48, height: GRID_PX + WALL * 2 }}
          >
            {/* === WALLS === */}
            {/* Top wall */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: GRID_PX + WALL, height: WALL, background: '#1e293b', borderRadius: '6px 6px 0 0', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }} />
            {/* Bottom wall */}
            <div style={{ position: 'absolute', left: 0, top: GRID_PX + WALL, width: GRID_PX + WALL, height: WALL, background: '#1e293b', borderRadius: '0 0 6px 6px', boxShadow: '0 -2px 6px rgba(0,0,0,0.5)' }} />
            {/* Left wall */}
            <div style={{ position: 'absolute', left: 0, top: WALL, width: WALL, height: GRID_PX, background: '#1e293b', boxShadow: '2px 0 6px rgba(0,0,0,0.5)' }} />
            {/* Right wall — top segment (above exit) */}
            <div style={{ position: 'absolute', left: GRID_PX + WALL, top: WALL, width: WALL, height: EXIT_ROW * CELL_SIZE, background: '#1e293b', boxShadow: '-2px 0 6px rgba(0,0,0,0.5)' }} />
            {/* Right wall — bottom segment (below exit) */}
            <div style={{ position: 'absolute', left: GRID_PX + WALL, top: (EXIT_ROW + 1) * CELL_SIZE + WALL, width: WALL, height: (GRID_SIZE - EXIT_ROW - 1) * CELL_SIZE, background: '#1e293b', boxShadow: '-2px 0 6px rgba(0,0,0,0.5)' }} />

            {/* Corner bolts decoration */}
            {[[4,4],[GRID_PX+WALL-4,4],[4,GRID_PX+WALL-4],[GRID_PX+WALL-4,GRID_PX+WALL-4]].map(([cx,cy],i) => (
              <div key={i} style={{ position:'absolute', left:cx-3, top:cy-3, width:6, height:6, borderRadius:'50%', background:'#94a3b8', boxShadow:'inset 0 1px 2px rgba(0,0,0,0.5)' }} />
            ))}

            {/* Road surface */}
            <div
              className="absolute overflow-hidden"
              style={{ left: WALL, top: WALL, width: GRID_PX, height: GRID_PX, background: '#4a5568' }}
            >
              {/* Grid dashes */}
              {Array.from({ length: GRID_SIZE }).map((_, row) =>
                Array.from({ length: GRID_SIZE }).map((__, col) => (
                  <div key={`${row}-${col}`} style={{
                    position: 'absolute',
                    left: col * CELL_SIZE,
                    top: row * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRight: col < GRID_SIZE - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none',
                    borderBottom: row < GRID_SIZE - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none',
                  }} />
                ))
              )}
              {/* Exit row highlight */}
              <div style={{ position:'absolute', left:0, top: EXIT_ROW * CELL_SIZE, width:'100%', height: CELL_SIZE, background:'rgba(239,68,68,0.1)' }} />
            </div>

            {/* Exit lane */}
            <div style={{
              position: 'absolute',
              left: GRID_PX + WALL * 2,
              top: EXIT_ROW * CELL_SIZE + WALL,
              width: 48,
              height: CELL_SIZE,
              background: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:3, background:'rgba(255,220,0,0.7)', borderRadius:2 }} />)}
              <div style={{ color:'#f87171', fontSize:20, fontWeight:'bold', lineHeight:1 }}>→</div>
            </div>

            {/* Vehicles */}
            {vehicles.map((v, i) => {
              const isPlayer = i === 0;
              const carWidth = v.horizontal ? v.length * CELL_SIZE - 6 : CELL_SIZE - 6;
              const carHeight = v.horizontal ? CELL_SIZE - 6 : v.length * CELL_SIZE - 6;
              const left = WALL + v.col * CELL_SIZE + 3;
              const top = WALL + v.row * CELL_SIZE + 3;
              const color = VEHICLE_FILL_COLORS[i % VEHICLE_FILL_COLORS.length];

              return (
                <div
                  key={i}
                  onPointerDown={e => handlePointerDown(e, i)}
                  onPointerUp={e => handlePointerUp(e, i)}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    width: carWidth,
                    height: carHeight,
                    cursor: v.horizontal ? 'ew-resize' : 'ns-resize',
                    filter: isPlayer ? 'drop-shadow(0 0 6px rgba(239,68,68,0.7))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                    transition: 'left 0.12s ease, top 0.12s ease',
                    zIndex: isPlayer ? 10 : 5,
                    touchAction: 'none',
                  }}
                >
                  <svg
                    viewBox={v.horizontal ? "0 0 100 44" : "0 0 44 100"}
                    width={carWidth}
                    height={carHeight}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'block' }}
                  >
                    {v.horizontal ? (
                      <>
                        <rect x="2" y="12" width="96" height="24" rx="6" fill={color} />
                        <path d="M24 12 L32 3 L68 3 L76 12 Z" fill={color} />
                        <path d="M68 4 L74 11 L58 11 L58 4 Z" fill="rgba(180,230,255,0.75)" />
                        <path d="M32 4 L26 11 L42 11 L42 4 Z" fill="rgba(180,230,255,0.75)" />
                        <rect x="44" y="4" width="12" height="7" rx="1.5" fill="rgba(180,230,255,0.75)" />
                        <rect x="10" y="14" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
                        <rect x="90" y="18" width="8" height="12" rx="3" fill="rgba(255,255,255,0.25)" />
                        <rect x="2" y="18" width="8" height="12" rx="3" fill="rgba(0,0,0,0.2)" />
                        <rect x="91" y="19" width="6" height="5" rx="1.5" fill={isPlayer ? '#FFE566' : '#ffffff'} opacity="0.95" />
                        <rect x="3" y="19" width="6" height="5" rx="1.5" fill={isPlayer ? '#ff3333' : '#ffaaaa'} opacity="0.9" />
                        <ellipse cx="22" cy="37" rx="9" ry="6" fill="#1a1a2e" />
                        <ellipse cx="22" cy="37" rx="5.5" ry="3.5" fill="#6b7280" />
                        <ellipse cx="78" cy="37" rx="9" ry="6" fill="#1a1a2e" />
                        <ellipse cx="78" cy="37" rx="5.5" ry="3.5" fill="#6b7280" />
                        <line x1="50" y1="12" x2="50" y2="36" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                      </>
                    ) : (
                      <>
                        <rect x="4" y="2" width="36" height="96" rx="6" fill={color} />
                        <path d="M4 30 L12 22 L32 22 L40 30 Z" fill={color} />
                        <path d="M12 22 L10 30 L22 30 Z" fill="rgba(180,230,255,0.75)" />
                        <path d="M32 22 L34 30 L22 30 Z" fill="rgba(180,230,255,0.75)" />
                        <rect x="10" y="23" width="10" height="6" rx="1.5" fill="rgba(180,230,255,0.75)" />
                        <rect x="24" y="23" width="10" height="6" rx="1.5" fill="rgba(180,230,255,0.75)" />
                        <rect x="16" y="35" width="12" height="28" rx="2" fill="rgba(255,255,255,0.15)" />
                        <rect x="10" y="3" width="24" height="5" rx="2" fill="#FFE566" opacity="0.9" />
                        <rect x="10" y="92" width="24" height="5" rx="2" fill="#ffaaaa" opacity="0.9" />
                        <ellipse cx="5" cy="22" rx="5" ry="9" fill="#1a1a2e" />
                        <ellipse cx="5" cy="22" rx="3" ry="5.5" fill="#6b7280" />
                        <ellipse cx="39" cy="22" rx="5" ry="9" fill="#1a1a2e" />
                        <ellipse cx="39" cy="22" rx="3" ry="5.5" fill="#6b7280" />
                        <ellipse cx="5" cy="78" rx="5" ry="9" fill="#1a1a2e" />
                        <ellipse cx="5" cy="78" rx="3" ry="5.5" fill="#6b7280" />
                        <ellipse cx="39" cy="78" rx="5" ry="9" fill="#1a1a2e" />
                        <ellipse cx="39" cy="78" rx="3" ry="5.5" fill="#6b7280" />
                        <line x1="4" y1="50" x2="40" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                      </>
                    )}
                  </svg>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Level selector */}
      <div className="flex flex-col items-center gap-2 mt-1">
        <p className="text-sm text-muted-foreground text-center">
          {t.rushHourHint || 'החלק את הרכבים כדי לפנות דרך — הוצא את המכונית האדומה לצד ימין'}
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