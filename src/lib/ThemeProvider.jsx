import { useEffect } from 'react';

// Font size scale applied to <html> using fluid clamp() so text
// scales down gracefully on narrow screens and up on wider ones.
// clamp(min, preferred, max) — min keeps mobile readable, max = chosen size.
export const FONT_SIZES = [
  { key: 'normal', label: 'רגיל / عادي', clamp: 'clamp(87.5%, 2.5vw + 0.5rem, 100%)' },
  { key: 'large', label: 'גדול / كبير', clamp: 'clamp(93.75%, 2.8vw + 0.5rem, 115%)' },
  { key: 'xlarge', label: 'גדול מאוד / كبير جداً', clamp: 'clamp(100%, 3.2vw + 0.5rem, 130%)' },
];

export function applyFontSize(key) {
  const size = FONT_SIZES.find(s => s.key === key) || FONT_SIZES[0];
  document.documentElement.style.fontSize = size.clamp;
}

export function applyTheme(mode) {
  // mode: 'light' | 'dark' | 'system'
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // system
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  }
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // Apply saved font size
    const savedSize = localStorage.getItem('rebrain_fontsize') || 'large';
    applyFontSize(savedSize);

    // Apply saved theme
    const savedTheme = localStorage.getItem('rebrain_theme') || 'system';
    applyTheme(savedTheme);

    // Listen to system changes only if mode is 'system'
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if ((localStorage.getItem('rebrain_theme') || 'system') === 'system') {
        applyTheme('system');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return children;
}