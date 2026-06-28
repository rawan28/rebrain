import React from 'react';

function outerPath(shape, s) {
  const h = s / 2;
  switch (shape) {
    case 'circle':
      return <circle cx={h} cy={h} r={h - 2} />;
    case 'square':
      return <rect x={2} y={2} width={s - 4} height={s - 4} rx={3} />;
    case 'diamond':
      return <polygon points={`${h},2 ${s - 2},${h} ${h},${s - 2} 2,${h}`} />;
    case 'hexagon': {
      const r = h - 2;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${h + r * Math.cos(a)},${h + r * Math.sin(a)}`;
      }).join(' ');
      return <polygon points={pts} />;
    }
    case 'triangle':
      return <polygon points={`${h},3 ${s - 3},${s - 3} 3,${s - 3}`} />;
    default:
      return <circle cx={h} cy={h} r={h - 2} />;
  }
}

function innerPath(shape, s) {
  const h = s / 2;
  const r = s * 0.22;
  switch (shape) {
    case 'circle':
      return <circle cx={h} cy={h} r={r} />;
    case 'square':
      return <rect x={h - r} y={h - r} width={r * 2} height={r * 2} rx={2} />;
    case 'diamond':
      return <polygon points={`${h},${h - r} ${h + r},${h} ${h},${h + r} ${h - r},${h}`} />;
    case 'triangle':
      return <polygon points={`${h},${h - r} ${h + r},${h + r} ${h - r},${h + r}`} />;
    case 'star': {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.45;
        return `${h + rad * Math.cos(a)},${h + rad * Math.sin(a)}`;
      }).join(' ');
      return <polygon points={pts} />;
    }
    default:
      return <circle cx={h} cy={h} r={r} />;
  }
}

export default function ShapeCombo({ combo, size = 48 }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g fill="none" stroke={combo.outerColor} strokeWidth={2.5}>
        {outerPath(combo.outerShape, size)}
      </g>
      <g fill={combo.innerColor} stroke="none">
        {innerPath(combo.innerShape, size)}
      </g>
    </svg>
  );
}