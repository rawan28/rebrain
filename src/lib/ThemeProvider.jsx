import { useEffect } from 'react';

// Font size scale applied to <html> so rem-based sizing scales everything
export const FONT_SIZES = [
  { key: 'normal', label: 'רגיל / عادي', scale: '100%' },
  { key: 'large', label: 'גדול / كبير', scale: '115%' },
  { key: 'xlarge', label: 'גדול מאוד / كبير جداً', scale: '130%' },
];

export function applyFontSize(key) {
  const size = FONT_SIZES.find(s => s.key === key) || FONT_SIZES[0];
  document.documentElement.style.fontSize = size.scale;
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // Apply saved font size
    const savedSize = localStorage.getItem('rebrain_fontsize') || 'large';
    applyFontSize(savedSize);

    // Apply theme
    const apply = (dark) => {
      document.documentElement.classList.toggle('dark', dark);
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mq.matches);
    const handler = (e) => apply(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return children;
}