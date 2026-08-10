import React from 'react';

// Renders a shape series item: an asymmetric shape rotated/flipped, with optional dots.
// Default orientation is "up" (arrow/triangle) or "right" (pacman); rotation is clockwise.

function shapePath(shape) {
  switch (shape) {
    case 'arrow':
      return 'M50,12 L72,40 L58,40 L58,88 L42,88 L42,40 L28,40 Z';
    case 'triangle':
      return 'M50,16 L86,82 L14,82 Z';
    case 'pacman':
      return 'M50,50 L84.6,30 A40,40 0 1,1 84.6,70 Z';
    case 'L':
      return 'M26,12 L46,12 L46,74 L88,74 L88,94 L26,94 Z';
    default:
      return 'M50,12 L72,40 L58,40 L58,88 L42,88 L42,40 L28,40 Z';
  }
}

function dotPositions(count) {
  if (count === 1) return [[50, 50]];
  if (count === 2) return [[38, 50], [62, 50]];
  if (count === 3) return [[32, 52], [50, 48], [68, 52]];
  return [];
}

export default function ShapeSeriesItem({ item, size = 80 }) {
  const cx = 50;
  const cy = 50;
  const flipScale = item.flip ? -1 : 1;
  const transform = `translate(${cx} ${cy}) rotate(${item.rotation}) scale(${flipScale} 1) translate(${-cx} ${-cy})`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g transform={transform}>
        <path
          d={shapePath(item.shape)}
          fill={item.color}
          stroke={item.color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {dotPositions(item.dots).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill="#1f2937" />
        ))}
      </g>
    </svg>
  );
}