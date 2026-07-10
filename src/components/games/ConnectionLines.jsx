import { useEffect, useState } from 'react';

// Draws SVG lines between connected nodes by measuring their DOM positions
// relative to the container. Re-measures on resize / scroll / connection changes.
export default function ConnectionLines({ containerRef, nodeRefs, connections }) {
  const [lines, setLines] = useState([]);

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const segs = connections.map(({ leftId, rightId }) => {
      const le = nodeRefs.current.get(leftId);
      const re = nodeRefs.current.get(rightId);
      if (!le || !re) return null;
      const lb = le.getBoundingClientRect();
      const rb = re.getBoundingClientRect();
      return {
        x1: lb.left + lb.width / 2 - rect.left,
        y1: lb.top + lb.height / 2 - rect.top,
        x2: rb.left + rb.width / 2 - rect.left,
        y2: rb.top + rb.height / 2 - rect.top,
      };
    }).filter(Boolean);
    setLines(segs);
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ overflow: 'visible' }}>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          className="text-emerald-500"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}