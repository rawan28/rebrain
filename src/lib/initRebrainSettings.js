import { FONT_SIZES } from '@/lib/ThemeProvider';

/**
 * Synchronously reads and applies all Rebrain user settings from localStorage
 * BEFORE React mounts to prevent flash of incorrect theme, font size, or direction.
 */
export function initRebrainSettings() {
  try {
    // 1. Language & Direction
    const lang = localStorage.getItem('rebrain_lang') || 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';

    // 2. Theme (Light / Dark / System)
    const theme = localStorage.getItem('rebrain_theme') || 'system';
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 3. Font Size (normal / large / xlarge)
    const fontSize = localStorage.getItem('rebrain_fontsize') || 'large';
    const size = FONT_SIZES.find(s => s.key === fontSize) || FONT_SIZES[0];
    document.documentElement.style.fontSize = size.clamp;
    document.documentElement.setAttribute('data-fontsize', size.key);

    // 4. Sound Preference Check
    const sound = localStorage.getItem('rebrain_sound');
    if (sound === null) {
      localStorage.setItem('rebrain_sound', 'true');
    }
  } catch (e) {
    console.warn('Failed to initialize Rebrain settings from localStorage:', e);
  }
}