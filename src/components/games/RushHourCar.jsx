// SVG car shapes for Rush Hour game
// direction: 'right' | 'left' | 'up' | 'down'

export default function RushHourCar({ horizontal, isPlayer, colorClass, width, height }) {
  if (horizontal) {
    return (
      <svg viewBox="0 0 100 44" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="2" y="14" width="96" height="24" rx="5" className={colorClass} fill="currentColor" />
        {/* Cabin */}
        <path d="M22 14 L30 4 L70 4 L78 14 Z" className={colorClass} fill="currentColor" opacity="0.85" />
        {/* Windshield front */}
        <path d="M70 5 L76 13 L60 13 L60 5 Z" fill="rgba(180,220,255,0.7)" />
        {/* Windshield rear */}
        <path d="M30 5 L24 13 L40 13 L40 5 Z" fill="rgba(180,220,255,0.7)" />
        {/* Side windows */}
        <rect x="42" y="5" width="16" height="8" rx="2" fill="rgba(180,220,255,0.7)" />
        {/* Front bumper highlight */}
        <rect x="88" y="20" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
        {/* Rear bumper */}
        <rect x="4" y="20" width="8" height="12" rx="3" fill="rgba(0,0,0,0.15)" />
        {/* Wheels */}
        <ellipse cx="22" cy="38" rx="9" ry="5" fill="#333" />
        <ellipse cx="22" cy="38" rx="5" ry="3" fill="#888" />
        <ellipse cx="78" cy="38" rx="9" ry="5" fill="#333" />
        <ellipse cx="78" cy="38" rx="5" ry="3" fill="#888" />
        {/* Headlights */}
        <rect x="90" y="22" width="6" height="4" rx="1" fill={isPlayer ? '#FFE066' : '#fff'} opacity="0.9" />
        {/* Tail lights */}
        <rect x="4" y="22" width="6" height="4" rx="1" fill={isPlayer ? '#ff4444' : '#ffcccc'} opacity="0.9" />
        {/* Shine */}
        <rect x="30" y="16" width="40" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
      </svg>
    );
  } else {
    // Vertical car (facing down)
    return (
      <svg viewBox="0 0 44 100" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="6" y="2" width="32" height="96" rx="5" className={colorClass} fill="currentColor" />
        {/* Cabin */}
        <path d="M6 28 L14 20 L30 20 L38 28 Z" className={colorClass} fill="currentColor" opacity="0.85" />
        {/* Windshield front */}
        <path d="M14 20 L13 28 L22 28 L22 20 Z" fill="rgba(180,220,255,0.7)" />
        {/* Windshield rear */}
        <path d="M30 20 L31 28 L22 28 L22 20 Z" fill="rgba(180,220,255,0.7)" />
        {/* Wheels */}
        <ellipse cx="6" cy="25" rx="5" ry="8" fill="#333" />
        <ellipse cx="6" cy="25" rx="3" ry="5" fill="#888" />
        <ellipse cx="38" cy="25" rx="5" ry="8" fill="#333" />
        <ellipse cx="38" cy="25" rx="3" ry="5" fill="#888" />
        <ellipse cx="6" cy="75" rx="5" ry="8" fill="#333" />
        <ellipse cx="6" cy="75" rx="3" ry="5" fill="#888" />
        <ellipse cx="38" cy="75" rx="5" ry="8" fill="#333" />
        <ellipse cx="38" cy="75" rx="3" ry="5" fill="#888" />
        {/* Headlights */}
        <rect x="14" y="4" width="16" height="5" rx="2" fill="#FFE066" opacity="0.85" />
        {/* Tail lights */}
        <rect x="14" y="91" width="16" height="5" rx="2" fill="#ffcccc" opacity="0.9" />
        {/* Shine */}
        <rect x="14" y="35" width="16" height="30" rx="2" fill="rgba(255,255,255,0.13)" />
      </svg>
    );
  }
}