import { useRef } from 'react';

export default function ConnectDotsBoard({ puzzle, path, hintCell, onCellEnter }) {
  const { rows, cols, dots } = puzzle;
  const svgRef = useRef(null);
  const draggingRef = useRef(false);

  const toCell = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * cols;
    const y = ((clientY - rect.top) / rect.height) * rows;
    const c = Math.floor(x);
    const r = Math.floor(y);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  };

  const handleDown = (e) => {
    e.preventDefault();
    const cell = toCell(e.clientX, e.clientY);
    if (!cell) return;
    draggingRef.current = true;
    try { svgRef.current.setPointerCapture(e.pointerId); } catch { /* noop */ }
    onCellEnter(cell);
  };
  const handleMove = (e) => {
    if (!draggingRef.current) return;
    const cell = toCell(e.clientX, e.clientY);
    if (cell) onCellEnter(cell);
  };
  const handleUp = (e) => {
    draggingRef.current = false;
    try { svgRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  // next dot to reach (first not yet in path, in order)
  let reached = 0;
  while (reached < dots.length && path.some(p => p.r === dots[reached].r && p.c === dots[reached].c)) reached++;
  const nextDot = dots[reached];

  const polyPoints = path.map(p => `${p.c + 0.5},${p.r + 0.5}`).join(' ');

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${cols} ${rows}`}
      className="w-full select-none rounded-2xl bg-white border border-border shadow-sm"
      style={{ aspectRatio: `${cols} / ${rows}`, touchAction: 'none' }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onPointerLeave={handleUp}
    >
      <defs>
        <linearGradient id="cd-gradient" x1="0" y1="0" x2={cols} y2={rows} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
      </defs>

      {/* faint grid lines */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i} x2={cols} y2={i} stroke="#E5E7EB" strokeWidth={0.03} />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={i} y1={0} x2={i} y2={rows} stroke="#E5E7EB" strokeWidth={0.03} />
      ))}

      {/* user path */}
      {polyPoints && (
        <polyline
          points={polyPoints}
          fill="none"
          stroke="url(#cd-gradient)"
          strokeWidth={0.34}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* hint pulse */}
      {hintCell && (
        <circle cx={hintCell.c + 0.5} cy={hintCell.r + 0.5} r={0.42} fill="none" stroke="#FF8C00" strokeWidth={0.08}>
          <animate attributeName="r" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* numbered dots */}
      {dots.map(d => {
        const isNext = nextDot && d.num === nextDot.num;
        return (
          <g key={d.num}>
            {isNext && (
              <circle cx={d.c + 0.5} cy={d.r + 0.5} r={0.42} fill="none" stroke="#FF8C00" strokeWidth={0.06} />
            )}
            <circle cx={d.c + 0.5} cy={d.r + 0.5} r={0.3} fill="#111827" />
            <text
              x={d.c + 0.5}
              y={d.r + 0.5}
              fontSize={0.34}
              fontWeight="700"
              fill="#fff"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {d.num}
            </text>
          </g>
        );
      })}
    </svg>
  );
}